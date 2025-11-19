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
    const { imageA, imageB } = await req.json();

    if (!imageA || !imageB) {
        return new Response(JSON.stringify({ error: 'Two images are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const prompt = `Act as a world-class YouTube growth expert and UI/UX designer. You will be given two thumbnails, Thumbnail A and Thumbnail B. Analyze them based on 10 core principles of high-performing thumbnails. For each principle, provide a score from 1-10 and a brief, constructive reasoning for both thumbnails. Finally, provide a summary verdict declaring a winner. The 10 principles are: Clarity & Simplicity, Emotional Impact, Face Visibility, Color & Contrast, Text Readability, Branding Consistency, Relevance to Title/Topic, Intrigue & Curiosity, Visual Composition, and Overall Quality. Return ONLY a single JSON object.`;
    const imagePartA = { inlineData: { mimeType: 'image/jpeg', data: imageA } };
    const imagePartB = { inlineData: { mimeType: 'image/jpeg', data: imageB } };
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: prompt }, imagePartA, imagePartB] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                principle: { type: Type.STRING },
                                thumbnailA_score: { type: Type.INTEGER },
                                thumbnailA_reasoning: { type: Type.STRING },
                                thumbnailB_score: { type: Type.INTEGER },
                                thumbnailB_reasoning: { type: Type.STRING },
                            },
                            required: ['principle', 'thumbnailA_score', 'thumbnailA_reasoning', 'thumbnailB_score', 'thumbnailB_reasoning'],
                        },
                    },
                    verdict: {
                        type: Type.OBJECT,
                        properties: {
                            winner: { type: Type.STRING, enum: ['Thumbnail A', 'Thumbnail B', 'Tie'] },
                            summary: { type: Type.STRING },
                        },
                        required: ['winner', 'summary'],
                    },
                },
                required: ['analysis', 'verdict'],
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