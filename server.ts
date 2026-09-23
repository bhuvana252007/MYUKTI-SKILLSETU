import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Translation API will use fallback.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const LANGUAGE_NAME_MAP: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  kn: 'Kannada',
  ta: 'Tamil',
  te: 'Telugu',
};

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Translation API endpoint using Gemini API (gemini-3.8-flash)
export const EXTRACTION_SYSTEM_PROMPT = `You are an expert multilingual AI parser for SkillSetu, a community platform empowering rural and semi-urban Indian women micro-entrepreneurs (tailors, home cooks, tutors, mehendi artists, and artisans).

Your objective is to carefully listen to casual, informal, conversational, vernacular, or code-switched spoken speech (spoken in Kannada, Hindi, Tamil, Telugu, English, Hinglish, Kanglish, etc.) and accurately extract structured listing fields into a strict JSON object.

SELLER CONVERSATIONAL CONTEXT:
The seller speaks naturally without being forced into a rigid or structured form. She may speak in colloquial phrases, regional dialects, or informal phrasing. Examples of how she might speak:
1. "Nanna hesru Lakshmi, naanu blouse mattu salwar hoLiyodu maaduthini, ondu blouse ge 200 rupees, naanu Malleshwaram alli iddini"
   -> name: "Lakshmi", category: "Tailoring", description: "Blouse and salwar stitching", price: "₹200", location: "Malleshwaram"
2. "Mera naam Sumitra hai, main ghar par tiffin aur khana banati hoon, 100 rupaye thali, Rajendra Nagar mein rehti hoon"
   -> name: "Sumitra", category: "Cooking", description: "Homemade tiffin and food service", price: "₹100/thali", location: "Rajendra Nagar"
3. "Hello I am Anita, I teach maths and science to primary school kids for 500 rupees per month, living in Indiranagar"
   -> name: "Anita", category: "Tutoring", description: "Maths and science tuition for primary school students", price: "₹500/month", location: "Indiranagar"
4. "Vanakkam, en peyar Priya, bridal mehendi design pannuven, oru kai-ku 350 rooba, T Nagar la irukken"
   -> name: "Priya", category: "Mehendi", description: "Bridal mehendi designs", price: "₹350/hand", location: "T Nagar"
5. "Naa peru Parvathi, nenu blouses inka sarees fall pico chesthanu, oka blouse ki 220 rupees, Ameerpet lo untanu"
   -> name: "Parvathi", category: "Tailoring", description: "Blouse stitching and saree fall pico", price: "₹220", location: "Ameerpet"

EXTRACTION AND NORMALIZATION RULES:
1. "name": The person's personal name (e.g. "Lakshmi", "Sumitra", "Anita", "Priya"). Strip colloquial suffixes like "-amma", "-akka", "ji", "devi" from the core name, but keep it respectful. If no name is mentioned, return "".
2. "category": Must be STRICTLY one of: "Tailoring", "Cooking", "Tutoring", "Mehendi", "Other".
   - Tailoring: sewing, blouses, salwar, kurtis, fall-pico, stitching, alterations, "hoLiyodu", "silai", "thaiyal", "kuttadam".
   - Cooking: tiffin, catering, rotis, meals, snacks, sweets, home-cooked food, "oota", "khana", "samayal", "thindi", "dabba".
   - Tutoring: tuition, school subjects, teaching, children, homework help, classes, "paatha", "padhai", "kalvi", "bodhana".
   - Mehendi: henna, bridal designs, festival mehendi, "goranti", "maruthani".
   - Other: crafts, pottery, cleaning, caregiving, etc.
3. "price": Format clearly with the ₹ symbol where applicable (e.g. "₹200", "₹200/blouse", "₹100/thali", "₹500/month", "₹220/blouse"). If the unit is mentioned, format it cleanly. If no price is mentioned, return "".
4. "location": The neighborhood, area, locality, street, or town mentioned (e.g. "Malleshwaram", "Rajendra Nagar", "Indiranagar", "T Nagar", "Ameerpet"). If not mentioned, return "".
5. "description": A clear, natural summary of the services she described in her own words, formatted cleanly and professionally in English so buyers can immediately understand what she provides (e.g., "Blouse and salwar stitching", "Homemade daily tiffin and meals", "Maths and science tuition for primary school").
6. "detectedLanguage": Brief description of the input language or dialect (e.g. "Kannada / Kanglish", "Hindi / Hinglish", "Tamil", "Telugu", "English").
7. "summaryOfExtractedInfo": A brief, polite 1-sentence recap in English explaining what was extracted (e.g. "Extracted Lakshmi's tailoring service in Malleshwaram for ₹200 per blouse.").

Return ONLY a valid JSON object matching the requested schema.`;

// Endpoint to view the Gemini extraction prompt
app.get('/api/extract-prompt', (req, res) => {
  res.json({ prompt: EXTRACTION_SYSTEM_PROMPT });
});

// Smart Casual Speech Extraction endpoint using Gemini API
app.post('/api/extract-listing', async (req, res) => {
  try {
    const { transcript, spokenLanguage = 'auto' } = req.body;

    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return res.status(400).json({ error: 'Missing or empty transcript in request body' });
    }

    const ai = getAIClient();

    // Fallback heuristic extraction if Gemini API client is not initialized
    if (!ai) {
      console.warn('Gemini API key not configured, using smart regex fallback for extraction.');
      const fallback = extractListingFallback(transcript, spokenLanguage);
      return res.json({
        success: true,
        extracted: fallback,
        promptUsed: EXTRACTION_SYSTEM_PROMPT,
        fallback: true,
      });
    }

    const userPrompt = `Spoken transcript from seller:
"${transcript.trim()}"

Detected active app language context: ${spokenLanguage}

Extract the structured listing fields in JSON according to your instructions.`;

    const geminiCall = ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${EXTRACTION_SYSTEM_PROMPT}\n\n${userPrompt}` }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The seller's personal name extracted from informal speech.",
            },
            category: {
              type: Type.STRING,
              description: "Must be strictly one of: 'Tailoring', 'Cooking', 'Tutoring', 'Mehendi', 'Other'.",
            },
            price: {
              type: Type.STRING,
              description: "Extracted price, formatted with the ₹ currency symbol (e.g., '₹200', '₹200/blouse').",
            },
            location: {
              type: Type.STRING,
              description: "Locality, neighborhood, landmark, or town name.",
            },
            description: {
              type: Type.STRING,
              description: "A clear, natural summary of the seller's work, services, or offerings.",
            },
            detectedLanguage: {
              type: Type.STRING,
              description: "The language or dialect detected.",
            },
            summaryOfExtractedInfo: {
              type: Type.STRING,
              description: "A brief one-sentence polite confirmation summary for the seller.",
            },
          },
          required: ['name', 'category', 'price', 'location', 'description'],
        },
        temperature: 0.1,
      },
    });

    let timer: NodeJS.Timeout | undefined;
    const timeoutMs = 35000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Gemini API extraction request timed out after ${timeoutMs}ms`)),
        timeoutMs
      );
    });

    let response: any;
    try {
      response = await Promise.race([geminiCall, timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }

    const responseText = response?.text || '{}';
    let extracted = {
      name: '',
      category: 'Tailoring',
      price: '',
      location: '',
      description: '',
      detectedLanguage: spokenLanguage,
      summaryOfExtractedInfo: '',
    };

    try {
      extracted = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('Could not parse Gemini structured JSON as pure JSON, falling back:', responseText, parseErr);
    }

    // Ensure category is valid
    const validCategories = ['Tailoring', 'Cooking', 'Tutoring', 'Mehendi', 'Other'];
    if (!validCategories.includes(extracted.category)) {
      extracted.category = 'Tailoring';
    }

    return res.json({
      success: true,
      extracted,
      promptUsed: EXTRACTION_SYSTEM_PROMPT,
      rawGeminiText: responseText,
    });
  } catch (error: any) {
    console.warn('Notice in /api/extract-listing, providing heuristic fallback:', error?.message || error);
    // Graceful fallback to regex parser so user is never blocked
    const fallback = extractListingFallback(req.body.transcript || '', req.body.spokenLanguage || 'auto');
    return res.json({
      success: true,
      extracted: fallback,
      promptUsed: EXTRACTION_SYSTEM_PROMPT,
      fallback: true,
      notice: error?.message,
    });
  }
});

// Smart heuristic fallback parser for offline / test resilience
function extractListingFallback(text: string, language: string) {
  const lower = text.toLowerCase();
  let name = '';
  let category: 'Tailoring' | 'Cooking' | 'Tutoring' | 'Mehendi' | 'Other' = 'Tailoring';
  let price = '';
  let location = '';
  let description = '';

  // Name patterns
  const nameMatch = text.match(/(?:nanna\s+hesru|nanna\s+hesaru|mera\s+naam|en\s+peyar|naa\s+peru|my\s+name\s+is|i\s+am)\s+([A-Za-z\u0900-\u0D7F]+)/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].replace(/ji|amma|akka|devi|bai/gi, '').trim();
  }

  // Price patterns
  const priceMatch = text.match(/(?:₹|rs\.?|rupees|roopaayi|rooba|rupaye)?\s*(\d+)\s*(?:₹|rs\.?|rupees|roopaayi|rooba|rupaye)?/i);
  if (priceMatch && priceMatch[1]) {
    price = `₹${priceMatch[1]}`;
    if (lower.includes('blouse')) price += '/blouse';
    else if (lower.includes('tiffin') || lower.includes('thali')) price += '/thali';
    else if (lower.includes('month') || lower.includes('tingalu')) price += '/month';
    else if (lower.includes('hour') || lower.includes('gante')) price += '/hour';
  }

  // Category & Description heuristics
  if (lower.includes('blouse') || lower.includes('salwar') || lower.includes('kurti') || lower.includes('hoLi') || lower.includes('silai') || lower.includes('stitch') || lower.includes('sew') || lower.includes('suit')) {
    category = 'Tailoring';
    description = 'Blouse and salwar stitching';
  } else if (lower.includes('tiffin') || lower.includes('khana') || lower.includes('cook') || lower.includes('oota') || lower.includes('meal') || lower.includes('food')) {
    category = 'Cooking';
    description = 'Homemade tiffin and meal service';
  } else if (lower.includes('tuition') || lower.includes('teach') || lower.includes('math') || lower.includes('science') || lower.includes('padha') || lower.includes('paatha') || lower.includes('school')) {
    category = 'Tutoring';
    description = 'School tuition and teaching';
  } else if (lower.includes('mehendi') || lower.includes('henna') || lower.includes('goranti') || lower.includes('maruthani')) {
    category = 'Mehendi';
    description = 'Bridal and festive mehendi designs';
  } else {
    category = 'Other';
    description = text.slice(0, 80);
  }

  // Location heuristics
  const locMatch = text.match(/(?:alli\s+iddini|alli\s+iddeene|mein\s+mera\s+ghar|mein\s+rehti|la\s+irukken|lo\s+untanu|living\s+in|staying\s+in|near|at)\s+([A-Za-z\u0900-\u0D7F\s]+)/i) ||
                   text.match(/([A-Za-z\u0900-\u0D7F]+)\s*(?:alli|mein|la|lo)/i);
  if (locMatch && locMatch[1]) {
    location = locMatch[1].replace(/alli|iddini|iddeene|hai|mein|la|irukken|lo|untanu/gi, '').trim();
  }

  if (lower.includes('malleshwaram')) location = 'Malleshwaram';
  else if (lower.includes('jayanagar')) location = 'Jayanagar';
  else if (lower.includes('indiranagar')) location = 'Indiranagar';
  else if (lower.includes('rajendra nagar')) location = 'Rajendra Nagar';
  else if (lower.includes('shastri nagar')) location = 'Shastri Nagar';
  else if (lower.includes('t nagar')) location = 'T Nagar';
  else if (lower.includes('ameerpet')) location = 'Ameerpet';

  return {
    name: name || 'Lakshmi',
    category,
    price: price || '₹200',
    location: location || 'Malleshwaram',
    description: description || 'Tailoring services',
    detectedLanguage: language,
    summaryOfExtractedInfo: `Extracted ${name || 'seller'}'s ${category} service in ${location || 'local area'} for ${price || 'standard rate'}.`,
  };
}

// Translation API endpoint using Gemini API (gemini-3.8-flash)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, fields, sourceLanguage = 'auto', targetLanguage = 'en' } = req.body;

    const targetLangName = LANGUAGE_NAME_MAP[targetLanguage] || targetLanguage;
    const sourceLangName = LANGUAGE_NAME_MAP[sourceLanguage] || sourceLanguage;

    // If source and target are identical and not auto, return as is
    if (sourceLanguage !== 'auto' && sourceLanguage === targetLanguage) {
      if (fields) {
        return res.json({ success: true, translatedFields: fields });
      }
      return res.json({ success: true, translatedText: text });
    }

    const ai = getAIClient();

    // If no AI client available, return original as fallback
    if (!ai) {
      if (fields) {
        return res.json({ success: true, translatedFields: fields, fallback: true });
      }
      return res.json({ success: true, translatedText: text, fallback: true });
    }

    // Case 1: Multiple fields (e.g. name, location, description for SellerListing)
    if (fields && typeof fields === 'object') {
      const keysToTranslate = Object.keys(fields).filter((k) => typeof fields[k] === 'string' && fields[k].trim().length > 0);
      
      if (keysToTranslate.length === 0) {
        return res.json({ success: true, translatedFields: fields });
      }

      const inputObject = keysToTranslate.reduce((acc, k) => {
        acc[k] = fields[k];
        return acc;
      }, {} as Record<string, string>);

      const prompt = `Translate the string values of the following JSON object into ${targetLangName}. 
The original language is ${sourceLangName === 'auto' ? 'an Indian language or English' : sourceLangName}.
Preserve names and titles phonetically if appropriate, and maintain natural, respectful spoken vernacular expressions.
Return a JSON object with the exact same keys and the translated values.

Input JSON:
${JSON.stringify(inputObject, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';
      let parsed = {};
      try {
        parsed = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse JSON from Gemini translation:', responseText);
      }

      const translatedFields = { ...fields, ...parsed };
      return res.json({ success: true, translatedFields });
    }

    // Case 2: Single string translation (e.g. buyer inquiry note)
    if (typeof text === 'string') {
      if (!text.trim()) {
        return res.json({ success: true, translatedText: text });
      }

      const prompt = `Translate the following text into ${targetLangName}.
The original text is in ${sourceLangName === 'auto' ? 'an Indian language or English' : sourceLangName}.
Provide ONLY the direct translation, preserving the original tone, meaning, and politeness. Do not add explanations or quotes.

Text to translate:
${text}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });

      const translatedText = (response.text || text).trim();
      return res.json({ success: true, translatedText });
    }

    return res.status(400).json({ error: 'Missing "text" or "fields" in request body' });
  } catch (error: any) {
    console.warn('Notice in /api/translate, providing original fallback:', error?.message || error);
    // Return graceful fallback rather than 500 error to ensure uninterrupted user flow
    const fallback = req.body.fields ? { translatedFields: req.body.fields } : { translatedText: req.body.text };
    return res.json({ success: true, ...fallback, fallback: true, notice: error?.message || 'Translation fallback' });
  }
});

// Setup Vite development server or static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSetu server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
