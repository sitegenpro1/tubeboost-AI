import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { title, talkingPoints } = await req.json();

    if (!title) {
        return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as an expert YouTube scriptwriter. Generate a structured video script for a video titled "${title}". 
        ${talkingPoints ? `The user has provided the following key talking points to include: "${talkingPoints}".` : ''}
        The script should have three clear sections: 
        1.  **Intro Hook:** A captivating opening (2-3 sentences) to grab the viewer's attention.
        2.  **Main Content:** A well-organized body that covers the topic. If talking points were provided, expand on them.
        3.  **Call to Action (CTA):** A concluding section (2-3 sentences) encouraging viewers to like, subscribe, and comment.
        Return the entire script as a single block of well-formatted Markdown text. Use headings for each section.`,
    });

    const text = response.text;
    if (!text) {
        return new Response(JSON.stringify({ error: 'The AI model returned an empty script. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ script: text }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}