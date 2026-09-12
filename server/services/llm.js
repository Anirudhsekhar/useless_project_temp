import { GoogleGenAI, Type } from '@google/genai';
import { buildSystemPrompt } from '../prompts/moodpet.js';
import { validateMoodState, buildAvatarContract, CATCH_MAP, applyControlledRandomness } from './mood.js';
import { getLocalFallbackResponse } from '../utils/fallbacks.js';

const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

export async function generateMoodResponse({ message, history = [], currentMood, forcedMood = null }) {
  const provider = (process.env.LLM_PROVIDER || 'auto').toLowerCase();

  // If explicitly requested Ollama or if Gemini key is missing and OLLAMA_HOST is set or provider is ollama
  if (provider === 'ollama') {
    return generateOllamaResponse({ message, history, currentMood, forcedMood });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('[MoodPet Server] GEMINI_API_KEY missing. Attempting local Ollama model connection...');
    const ollamaResult = await generateOllamaResponse({ message, history, currentMood, forcedMood });
    if (ollamaResult.success) {
      return ollamaResult;
    }
    console.error('[MoodPet Server] GEMINI_API_KEY is missing and Ollama local model unavailable.');
    return getLocalFallbackResponse('missing_api_key', currentMood);
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter((m) => m !== primaryModel)];

  const ai = new GoogleGenAI({ apiKey });
  const systemPrompt = buildSystemPrompt(currentMood, forcedMood);

  const contents = [];
  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      if (msg.content) {
        contents.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      mood: {
        type: Type.STRING,
        enum: ['excited', 'sad', 'angry', 'dramatic', 'sleepy', 'shy', 'confused', 'toddler', 'overprotective', 'bargainer'],
      },
      intensity: {
        type: Type.INTEGER,
      },
      moodReason: {
        type: Type.STRING,
      },
      response: {
        type: Type.STRING,
      },
      catchType: {
        type: Type.STRING,
        enum: ['tangent', 'incomplete', 'minimal', 'exaggerated', 'trailing', 'hesitant', 'second-guessing', 'distracted', 'safety-warning', 'transactional'],
      },
    },
    required: ['mood', 'intensity', 'moodReason', 'response'],
  };

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[MoodPet LLM] Trying Gemini model: ${modelName}...`);
      const timeoutMs = 25000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('LLM request timed out')), timeoutMs);
      });

      const llmPromise = ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.7,
        },
      });

      const result = await Promise.race([llmPromise, timeoutPromise]);
      const rawText = result.text;

      let parsed = null;
      try {
        parsed = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn('[MoodPet LLM] Failed to parse JSON response:', rawText);
      }

      if (!parsed || !parsed.response || !parsed.mood) {
        console.warn('[MoodPet LLM] Malformed data from Gemini, trying fallback parsing');
        return getLocalFallbackResponse('malformed_json', currentMood);
      }

      // Check if we should override mood with a controlled random event
      const randomMood = applyControlledRandomness(parsed.mood);
      const finalMood = forcedMood || randomMood || parsed.mood;

      const validatedMood = validateMoodState({
        mood: finalMood,
        intensity: randomMood ? Math.max(70, parsed.intensity) : parsed.intensity, // Boost intensity if randomly changed to make it obvious
      });

      const catchType = parsed.catchType || CATCH_MAP[validatedMood.mood] || 'tangent';
      const moodReason = parsed.moodReason || `Pompom is feeling ${validatedMood.mood}.`;
      const avatar = buildAvatarContract(validatedMood, currentMood);

      console.log(`[MoodPet LLM Success] Model ${modelName} responded. Mood: ${validatedMood.mood} (${validatedMood.intensity}%)`);

      return {
        success: true,
        mood: validatedMood,
        moodReason,
        response: parsed.response,
        catchType,
        avatar,
      };
    } catch (err) {
      lastError = err;
      console.warn(`[MoodPet LLM] Model ${modelName} failed:`, err.message || err);

      if (err.message?.includes('404') || err.message?.includes('not found') || err.message?.includes('no longer available')) {
        // Continue loop to try next model
        continue;
      }
      break;
    }
  }

  console.error('[MoodPet LLM Error] Gemini models failed:', lastError?.message || lastError);

  // If Gemini fails, try local Ollama before giving up to fallbacks
  console.log('[MoodPet Server] Attempting local Ollama fallback...');
  const ollamaResult = await generateOllamaResponse({ message, history, currentMood, forcedMood });
  if (ollamaResult.success) {
    return ollamaResult;
  }

  if (lastError?.message?.includes('429') || lastError?.message?.includes('quota') || lastError?.message?.includes('rate')) {
    return getLocalFallbackResponse('rate_limit', currentMood);
  }
  if (lastError?.message?.includes('timed out')) {
    return getLocalFallbackResponse('timeout', currentMood);
  }

  return getLocalFallbackResponse('provider_error', currentMood);
}

/**
 * Generate response using local Ollama instance (http://localhost:11434)
 */
async function generateOllamaResponse({ message, history = [], currentMood, forcedMood = null }) {
  const host = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3';
  const systemPrompt = buildSystemPrompt(currentMood, forcedMood) + 
    `\n\nCRITICAL INSTRUCTION: You MUST output ONLY a valid raw JSON object matching this structure with no markdown or intro text:
{
  "mood": "excited" | "sad" | "angry" | "dramatic" | "sleepy" | "shy" | "confused" | "toddler" | "overprotective" | "bargainer",
  "intensity": 50,
  "moodReason": "brief reason for current mood",
  "response": "the text message to send to user",
  "catchType": "tangent"
}`;

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history.slice(-10)) {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content || ''
      });
    }
  }

  messages.push({ role: 'user', content: message });

  try {
    console.log(`[MoodPet Ollama] Requesting model '${model}' at ${host}...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${host.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages,
        format: 'json',
        stream: false,
        options: { temperature: 0.7 }
      })
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Ollama HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data.message?.content || data.response || '';
    
    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.warn('[MoodPet Ollama] Failed to parse JSON from Ollama:', rawText);
    }

    if (!parsed || !parsed.response || !parsed.mood) {
      throw new Error('Invalid or missing fields in Ollama response');
    }

    const randomMood = applyControlledRandomness(parsed.mood);
    const finalMood = forcedMood || randomMood || parsed.mood;
    const validatedMood = validateMoodState({
      mood: finalMood,
      intensity: randomMood ? Math.max(70, parsed.intensity) : parsed.intensity,
    });

    const catchType = parsed.catchType || CATCH_MAP[validatedMood.mood] || 'tangent';
    const moodReason = parsed.moodReason || `Pompom is feeling ${validatedMood.mood}.`;
    const avatar = buildAvatarContract(validatedMood, currentMood);

    console.log(`[MoodPet Ollama Success] Model ${model} responded. Mood: ${validatedMood.mood}`);

    return {
      success: true,
      mood: validatedMood,
      moodReason,
      response: parsed.response,
      catchType,
      avatar,
    };
  } catch (err) {
    console.warn('[MoodPet Ollama Warning] Local Ollama request failed:', err.message || err);
    return { success: false, error: err.message };
  }
}

