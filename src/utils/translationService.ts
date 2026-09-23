import { SellerListing, SupportedLanguage, SkillCategory } from '../types';

// In-memory translation cache to keep the app snappy
const translationCache = new Map<string, string>();

function getCacheKey(text: string, targetLang: string, sourceLang?: string): string {
  return `${sourceLang || 'auto'}:${targetLang}:${text.trim()}`;
}

/**
 * Translates a single text string using the Gemini API backend endpoint.
 */
export async function translateText(
  text: string,
  targetLanguage: SupportedLanguage,
  sourceLanguage: string = 'auto'
): Promise<string> {
  if (!text || !text.trim()) return text;
  if (sourceLanguage !== 'auto' && sourceLanguage === targetLanguage) return text;

  const cacheKey = getCacheKey(text, targetLanguage, sourceLanguage);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      console.warn(`Translation HTTP error ${response.status}`);
      return text;
    }

    const data = await response.json();
    if (data.success && data.translatedText) {
      translationCache.set(cacheKey, data.translatedText);
      return data.translatedText;
    }
  } catch (error) {
    console.error('Translation failed, using fallback:', error);
  }

  return text;
}

/**
 * Translates an object with text fields (e.g. { name, location, description })
 */
export async function translateFields<T extends Record<string, string>>(
  fields: T,
  targetLanguage: SupportedLanguage,
  sourceLanguage: string = 'auto'
): Promise<T> {
  if (sourceLanguage !== 'auto' && sourceLanguage === targetLanguage) {
    return fields;
  }

  // Check if all fields are already cached
  let allCached = true;
  const result: any = { ...fields };
  for (const key of Object.keys(fields)) {
    const val = fields[key];
    if (val && typeof val === 'string' && val.trim()) {
      const cacheKey = getCacheKey(val, targetLanguage, sourceLanguage);
      if (translationCache.has(cacheKey)) {
        result[key] = translationCache.get(cacheKey)!;
      } else {
        allCached = false;
      }
    }
  }

  if (allCached) {
    return result as T;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.translatedFields) {
        // Cache individual fields
        for (const key of Object.keys(data.translatedFields)) {
          const orig = fields[key];
          const trans = data.translatedFields[key];
          if (orig && trans) {
            translationCache.set(getCacheKey(orig, targetLanguage, sourceLanguage), trans);
          }
        }
        return data.translatedFields as T;
      }
    }
  } catch (error) {
    console.error('Field translation failed, using fallback:', error);
  }

  return fields;
}

/**
 * Prepares a new seller listing by storing both the original text and 
 * an English base version as required.
 */
export async function prepareListingWithEnglishBase(
  listing: SellerListing,
  enteredLanguage: SupportedLanguage
): Promise<SellerListing> {
  const original = {
    name: listing.name,
    location: listing.location,
    description: listing.description,
  };

  const updatedListing: SellerListing = {
    ...listing,
    originalLanguage: enteredLanguage,
    originalText: original,
    translations: {
      ...(listing.translations || {}),
      [enteredLanguage]: original,
    },
  };

  // If entered in English, English base is identical
  if (enteredLanguage === 'en') {
    updatedListing.englishBase = original;
    if (!updatedListing.translations) updatedListing.translations = {};
    updatedListing.translations['en'] = original;
    return updatedListing;
  }

  // Otherwise, automatically translate to English using Gemini API
  try {
    const englishFields = await translateFields(original, 'en', enteredLanguage);
    updatedListing.englishBase = englishFields;
    if (!updatedListing.translations) updatedListing.translations = {};
    updatedListing.translations['en'] = englishFields;
  } catch (error) {
    console.error('Failed to translate listing to English base:', error);
    updatedListing.englishBase = original;
  }

  return updatedListing;
}

/**
 * Returns the translated listing for the buyer's currently selected language,
 * using the stored English base as the source for translation.
 */
export async function getTranslatedListing(
  listing: SellerListing,
  targetLanguage: SupportedLanguage
): Promise<SellerListing> {
  // If target language is already cached in listing, return directly
  if (listing.translations && listing.translations[targetLanguage]) {
    const trans = listing.translations[targetLanguage]!;
    return {
      ...listing,
      name: trans.name || listing.name,
      location: trans.location || listing.location,
      description: trans.description || listing.description,
    };
  }

  // If target is English and we have englishBase, return it
  if (targetLanguage === 'en' && listing.englishBase) {
    return {
      ...listing,
      name: listing.englishBase.name,
      location: listing.englishBase.location,
      description: listing.englishBase.description,
    };
  }

  // If target is the original language, return original
  if (listing.originalLanguage === targetLanguage && listing.originalText) {
    return {
      ...listing,
      name: listing.originalText.name,
      location: listing.originalText.location,
      description: listing.originalText.description,
    };
  }

  // Use the stored English base (or fallback to current fields) as translation source
  const sourceFields = listing.englishBase || {
    name: listing.name,
    location: listing.location,
    description: listing.description,
  };

  try {
    const translated = await translateFields(sourceFields, targetLanguage, 'en');

    // Update listing cache
    if (!listing.translations) {
      listing.translations = {};
    }
    listing.translations[targetLanguage] = translated;

    return {
      ...listing,
      name: translated.name,
      location: translated.location,
      description: translated.description,
    };
  } catch (error) {
    console.error(`Failed translating listing ${listing.id} to ${targetLanguage}:`, error);
    return listing;
  }
}

export interface ExtractedListingData {
  name: string;
  category: SkillCategory;
  price: string;
  location: string;
  description: string;
  detectedLanguage?: string;
  summaryOfExtractedInfo?: string;
}

export interface ExtractionResponse {
  success: boolean;
  extracted?: ExtractedListingData;
  promptUsed?: string;
  rawGeminiText?: string;
  fallback?: boolean;
  error?: string;
}

/**
 * Sends informal, casual spoken speech transcript to Gemini API on the backend
 * and extracts structured form fields (name, category, price, location, description)
 * using Gemini's structured JSON output capability.
 */
export async function extractListingFromSpeech(
  transcript: string,
  spokenLanguage?: SupportedLanguage
): Promise<ExtractionResponse> {
  if (!transcript || !transcript.trim()) {
    return { success: false, error: 'Empty transcript provided' };
  }

  try {
    const response = await fetch('/api/extract-listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: transcript.trim(),
        spokenLanguage: spokenLanguage || 'auto',
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Error calling /api/extract-listing:', err);
    return {
      success: false,
      error: err?.message || 'Failed to extract listing details',
    };
  }
}

/**
 * Fetches the exact Gemini extraction system prompt from backend
 */
export async function fetchExtractionPrompt(): Promise<string> {
  try {
    const res = await fetch('/api/extract-prompt');
    if (res.ok) {
      const data = await res.json();
      return data.prompt || '';
    }
  } catch (_) {}
  return '';
}

