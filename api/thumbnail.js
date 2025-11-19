import { GoogleGenAI, Modality } from "@google/genai";

export const config = {
  runtime: 'edge',
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { prompt, style, negativePrompt } = await req.json();

    if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const fullPrompt = `Generate a YouTube thumbnail for a video about "${prompt}".
    Style: ${style}.
    Things to avoid: ${negativePrompt}.
    The image should be eye-catching, high-quality, and suitable for a YouTube thumbnail. Do not include any text unless specifically asked for.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { responseModalities: [Modality.IMAGE] },
    });

    const { candidates } = response;
    if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts && candidates[0].content.parts.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return new Response(JSON.stringify({ base64Image: part.inlineData.data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        }
    }

    const finishReason = candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY') {
         return new Response(JSON.stringify({ error: 'Image generation failed due to safety settings. Please adjust your prompt.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Image generation failed or no image was returned.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}