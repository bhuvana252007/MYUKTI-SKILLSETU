import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set.');
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
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    features: ['maps_grounding', 'search_grounding', 'live_audio', 'audio_transcription', 'multi_turn_chat']
  });
});

// Supabase backend status endpoint
app.get('/api/supabase/status', async (_req, res) => {
  const projectId = 'hoeusmefmobavdxphyyl';
  const supabaseUrl = process.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_76xuAe2LYj-dVVDHjSPetg_eDf5NEJo';

  try {
    const checkRes = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
    });

    const status = checkRes.status;
    const body = await checkRes.json().catch(() => ({}));
    const tableFound = status === 200;

    res.json({
      connected: status !== 0 && status < 500,
      projectId,
      url: supabaseUrl,
      profilesTableFound: tableFound,
      httpStatus: status,
      details: body,
    });
  } catch (err: any) {
    res.json({
      connected: false,
      projectId,
      url: supabaseUrl,
      profilesTableFound: false,
      error: err?.message,
    });
  }
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
app.get('/api/extract-prompt', (_req, res) => {
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
      model: 'gemini-3.8-flash',
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

  const nameMatch = text.match(/(?:nanna\s+hesru|nanna\s+hesaru|mera\s+naam|en\s+peyar|naa\s+peru|my\s+name\s+is|i\s+am)\s+([A-Za-z\u0900-\u0D7F]+)/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].replace(/ji|amma|akka|devi|bai/gi, '').trim();
  }

  const priceMatch = text.match(/(?:₹|rs\.?|rupees|roopaayi|rooba|rupaye)?\s*(\d+)\s*(?:₹|rs\.?|rupees|roopaayi|rooba|rupaye)?/i);
  if (priceMatch && priceMatch[1]) {
    price = `₹${priceMatch[1]}`;
    if (lower.includes('blouse')) price += '/blouse';
    else if (lower.includes('tiffin') || lower.includes('thali')) price += '/thali';
    else if (lower.includes('month') || lower.includes('tingalu')) price += '/month';
    else if (lower.includes('hour') || lower.includes('gante')) price += '/hour';
  }

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

    if (sourceLanguage !== 'auto' && sourceLanguage === targetLanguage) {
      if (fields) {
        return res.json({ success: true, translatedFields: fields });
      }
      return res.json({ success: true, translatedText: text });
    }

    const ai = getAIClient();

    if (!ai) {
      if (fields) {
        return res.json({ success: true, translatedFields: fields, fallback: true });
      }
      return res.json({ success: true, translatedText: text, fallback: true });
    }

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
        model: 'gemini-3.8-flash',
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
        model: 'gemini-3.8-flash',
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
    const fallback = req.body.fields ? { translatedFields: req.body.fields } : { translatedText: req.body.text };
    return res.json({ success: true, ...fallback, fallback: true, notice: error?.message || 'Translation fallback' });
  }
});

// Audio Transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio, mimeType = 'audio/webm', prompt } = req.body;
    if (!audio || typeof audio !== 'string') {
      return res.status(400).json({ error: 'Missing audio base64 data in request body' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API is not configured on the server.' });
    }

    // Clean base64 string if data URI header exists
    const cleanBase64 = audio.includes(',') ? audio.split(',')[1] : audio;

    const audioPart = {
      inlineData: {
        mimeType: mimeType.split(';')[0] || 'audio/webm',
        data: cleanBase64,
      },
    };

    const instructionText = prompt ||
      'Transcribe this audio recording verbatim. It contains spoken speech which may be in Kannada, Hindi, Tamil, Telugu, English, or mixed vernacular. Maintain names, numbers, prices, and locations accurately. Output ONLY the clean transcribed text.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: instructionText }
        ]
      },
    });

    const transcribedText = (response.text || '').trim();
    return res.json({
      success: true,
      text: transcribedText,
      modelUsed: 'gemini-3.5-transcribe'
    });
  } catch (error: any) {
    console.error('Error in /api/transcribe:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Audio transcription failed'
    });
  }
});

// Multi-turn Gemini Chatbot with Roles, Search Grounding and Maps Grounding
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      role = 'general',
      useSearch = false,
      useMaps = false,
      userLocation = null,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API is not configured on the server.' });
    }

    // Determine model based on task complexity:
    // Basic & General tasks: gemini-3.8-flash (Primary valid model)
    // Complex advisory: gemini-3.1-pro-preview
    // Fast tasks: gemini-3.1-flash-lite
    let selectedModel = 'gemini-3.8-flash';
    if (role === 'advisor') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (role === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else {
      selectedModel = 'gemini-3.8-flash';
    }

    // Determine target language name
    const userLanguage = req.body.language || 'en';
    const langNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      kn: 'Kannada',
      ta: 'Tamil',
      te: 'Telugu',
    };
    const targetLang = langNames[userLanguage] || userLanguage || 'English';

    // System instruction: "You are Setu, a friendly assistant for SkillSetu, a platform connecting rural women's skills (tailoring, cooking, tutoring, mehendi) to local buyers. Reply briefly and simply, in the user's selected language."
    let systemInstruction = `You are Setu, a friendly assistant for SkillSetu, a platform connecting rural women's skills (tailoring, cooking, tutoring, mehendi) to local buyers. Reply briefly and simply, in the user's selected language (${targetLang}).`;

    if (role === 'advisor') {
      systemInstruction += ` You also have specialized knowledge in Self-Help Groups (SHG), Lakhpati Didi, Mudra loans, bookkeeping, and micro-business guidance.`;
    } else if (role === 'fast') {
      systemInstruction += ` Keep responses very concise in 1-2 direct sentences.`;
    }

    // Format conversation history for Gemini contents
    const contents = messages.map((m: { role: 'user' | 'model'; content: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Configure tools: Maps Grounding vs Search Grounding
    // Note per gemini-api skill: googleMaps cannot be combined with googleSearch.
    // When using googleMaps: DO NOT set responseMimeType or responseSchema.
    const tools: any[] = [];
    let toolConfig: any = undefined;

    if (useMaps) {
      selectedModel = 'gemini-3.8-flash';
      tools.push({ googleMaps: {} });
      if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
        toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        };
      }
    } else if (useSearch) {
      selectedModel = 'gemini-3.8-flash';
      tools.push({ googleSearch: {} });
    }

    const config: any = {
      systemInstruction,
      temperature: 0.4,
    };

    if (tools.length > 0) {
      config.tools = tools;
    }
    if (toolConfig) {
      config.toolConfig = toolConfig;
    }

    // Execute with primary model (gemini-3.8-flash), with fast fallback to gemini-3.1-flash-lite if demand spikes or times out
    let response: any;
    let actualModelUsed = selectedModel;

    let timeoutTimer: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutTimer = setTimeout(() => reject(new Error('PRIMARY_MODEL_TIMEOUT')), 7000);
    });

    try {
      response = await Promise.race([
        ai.models.generateContent({
          model: selectedModel,
          contents,
          config,
        }),
        timeoutPromise,
      ]);
    } catch (primaryErr: any) {
      console.warn(`Model ${selectedModel} primary note (${primaryErr?.message}), seamlessly using gemini-3.1-flash-lite...`);
      try {
        actualModelUsed = 'gemini-3.1-flash-lite';
        const fallbackConfig: any = {
          systemInstruction,
          temperature: 0.4,
        };
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: fallbackConfig,
        });
      } catch (_fallbackErr: any) {
        throw primaryErr;
      }
    } finally {
      if (timeoutTimer) clearTimeout(timeoutTimer);
    }

    const responseText = response?.text || '';

    // Extract grounding URLs and details as required by gemini-api skill guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Search grounding sources
    const searchSources: { title: string; uri: string }[] = [];
    // Maps grounding places: MUST extract URLs from groundingChunks and list them as links
    const mapPlaces: { title: string; uri: string; address?: string; snippet?: string }[] = [];

    for (const chunk of groundingChunks) {
      if (chunk.web && chunk.web.uri) {
        searchSources.push({
          title: chunk.web.title || new URL(chunk.web.uri).hostname,
          uri: chunk.web.uri,
        });
      }
      if (chunk.maps) {
        const placeUri = chunk.maps.uri || (chunk.maps.placeAnswerSources?.reviewSnippets?.[0]?.sourceUri) || '';
        mapPlaces.push({
          title: chunk.maps.title || 'Nearby Location',
          uri: placeUri,
          address: chunk.maps.address || '',
          snippet: chunk.maps.placeAnswerSources?.reviewSnippets?.[0]?.snippet || '',
        });
      }
    }

    return res.json({
      success: true,
      text: responseText,
      modelUsed: actualModelUsed,
      sources: searchSources,
      mapPlaces,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Chat generation failed',
    });
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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Create HTTP server to allow WebSocket integration for Gemini Live API
  const server = http.createServer(app);

  // WebSocket Server for gemini-3.8-live real-time voice conversations
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    try {
      const url = request.url ? new URL(request.url, `http://${request.headers.host || 'localhost'}`) : null;
      if (url && url.pathname === '/live') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        // Let Vite or other endpoints handle it if not /live
      }
    } catch (e) {
      console.error('Upgrade routing error:', e);
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('Client connected to /live WebSocket');
    const ai = getAIClient();
    if (!ai) {
      clientWs.send(JSON.stringify({ type: 'error', message: 'Gemini API key is not configured' }));
      clientWs.close();
      return;
    }

    try {
      // Connect to Gemini 3.8 Live API
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
          systemInstruction: 'You are Setu Saheli, an encouraging, natural-spoken Indian voice assistant for SkillSetu. You speak warmly and concisely to help women micro-entrepreneurs and local buyers discuss services like tailoring, cooking, tutoring, mehendi, pricing, and orders in a friendly conversational style.',
        },
        callbacks: {
          onmessage: (message: any) => {
            try {
              const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audio && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'audio', audio }));
              }
              if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'interrupted' }));
              }
              if (message.serverContent?.turnComplete && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'turnComplete' }));
              }
            } catch (err) {
              console.error('Error forwarding Live message to client:', err);
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'closed' }));
            }
          },
          onerror: (err: any) => {
            console.error('Gemini Live API error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'error', message: err?.message || 'Live session encountered an error' }));
            }
          },
        },
      });

      clientWs.send(JSON.stringify({ type: 'ready', message: 'Live voice connection established' }));

      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            // Send 16kHz PCM audio chunk to Gemini Live session
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed.text) {
            // Support sending text prompts into the Live session (useful when no hardware mic is connected)
            session.sendClientContent({
              turns: [
                {
                  role: 'user',
                  parts: [{ text: parsed.text }],
                },
              ],
              turnComplete: true,
            });
          }
        } catch (e) {
          console.error('Error parsing client live packet:', e);
        }
      });

      clientWs.on('close', () => {
        console.log('Client disconnected from /live WebSocket');
        try {
          session.close();
        } catch (_) {}
      });
    } catch (sessionErr: any) {
      console.error('Failed to initialize Gemini Live session:', sessionErr);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'error',
          message: sessionErr?.message || 'Failed to start real-time voice session'
        }));
        clientWs.close();
      }
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSetu server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
