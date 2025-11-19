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
    if (!cleanedText) {
        throw new Error("Received an empty response from the AI model after cleanup.");
    }
    try {
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON:", cleanedText, e);
        throw new Error("The AI model returned a response in an unexpected format.");
    }
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { topic } = await req.json();

    if (!topic) {
        return new Response(JSON.stringify({ error: 'Topic is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as a YouTube SEO expert. For the topic "${topic}", generate a comprehensive list of 15-20 keywords. Categorize them into three types: 'Related Keyword', 'Long-Tail Variation', and 'Question'. For each keyword, provide a competition score: 'Low', 'Medium', or 'High'. Also, provide a brief (2-3 sentences) overall content strategy summary based on these keywords. Return the result as a single JSON object.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    keywords: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['Related Keyword', 'Long-Tail Variation', 'Question'] },
                                competition: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                            },
                            required: ['text', 'type', 'competition'],
                        },
                    },
                    strategy: {
                        type: Type.STRING,
                        description: "A brief content strategy summary based on the generated keywords."
                    },
                },
                required: ['keywords', 'strategy'],
            },
        }
    });
    
    const data = parseJsonResponse(response.text);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}