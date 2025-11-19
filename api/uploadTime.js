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
    const { niche } = await req.json();

    if (!niche) {
        return new Response(JSON.stringify({ error: 'Niche is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as a YouTube growth expert. For the niche "${niche}", provide the top 3 best times (day and time in user's local timezone) to upload a new video. For each suggestion, provide a brief, data-driven reasoning. Finally, give a short summary of the overall upload strategy for this niche. Return ONLY a single JSON object.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    schedule: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                day: { type: Type.STRING },
                                time: { type: Type.STRING },
                                reasoning: { type: Type.STRING }
                            },
                            required: ["day", "time", "reasoning"],
                        }
                    },
                    summary: { type: Type.STRING }
                },
                required: ["schedule", "summary"],
            }
        }
    });
    
    const data = parseJsonResponse(response.text);

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}