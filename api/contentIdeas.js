import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = (responseText) => {
    if (!responseText) {
        throw new Error("Received an empty response from the AI model.");
    }
    const cleanedText = responseText.trim().replace(/^```json\n?/, '').replace(/```$/, '');
    return JSON.parse(cleanedText);
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { topic, audience } = await req.json();

    if (!topic || !audience) {
        return new Response(JSON.stringify({ error: 'Topic and audience are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `For a YouTube video about "${topic}" targeting an audience of "${audience}", generate 5 catchy and SEO-friendly video title ideas. Also suggest 3 main talking points for the video script, and 10 relevant tags. Return the result as a JSON object.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    titleIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    talkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['titleIdeas', 'talkingPoints', 'tags'],
            },
        },
    });
    
    const data = parseJsonResponse(response.text);

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}