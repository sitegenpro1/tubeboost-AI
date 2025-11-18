
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { KeywordResult, ContentIdeaResult, UploadTimeResult, ThumbnailResult, VideoScriptResult, ThumbnailComparisonResult } from '../types';

// FIX: Per coding guidelines, the API key must be read from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleGeminiError = (error: any) => {
    console.error('Gemini API Error:', error);
    // Try to extract a user-friendly message
    const message = error.message || 'An unknown error occurred while contacting the AI model.';
    // More specific checks could be added here if needed, e.g., for safety settings blocks.
    throw new Error(message);
};

const parseJsonResponse = <T>(responseText: string | undefined): T => {
    if (!responseText) {
        throw new Error("Received an empty response from the AI model.");
    }
    // Trim and remove markdown fences.
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


// This function now directly calls the Gemini API from the client-side.
export const generateKeywords = async (topic: string): Promise<KeywordResult> => {
  try {
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
    
    return parseJsonResponse<KeywordResult>(response.text);
  } catch (error) {
    handleGeminiError(error);
    throw error;
  }
};

export const generateContentIdeas = async (topic: string, audience: string): Promise<ContentIdeaResult> => {
    try {
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
        
        return parseJsonResponse<ContentIdeaResult>(response.text);
    } catch (error) {
        handleGeminiError(error);
        throw error;
    }
};

export const generateUploadTimeSuggestions = async (niche: string): Promise<UploadTimeResult> => {
    try {
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
        
        return parseJsonResponse<UploadTimeResult>(response.text);
    } catch (error) {
        handleGeminiError(error);
        throw error;
    }
};

export const generateThumbnail = async (prompt: string, style: string, negativePrompt: string): Promise<ThumbnailResult> => {
   try {
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
                    return part.inlineData.data;
                }
            }
        }
        
        const finishReason = candidates?.[0]?.finishReason;
        if (finishReason === 'SAFETY') {
             throw new Error('Image generation failed due to safety settings. Please adjust your prompt.');
        }

        throw new Error('Image generation failed or no image was returned.');

    } catch (error) {
        handleGeminiError(error);
        throw error;
    }
};

export const generateVideoScript = async (title: string, talkingPoints: string): Promise<VideoScriptResult> => {
   try {
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
            throw new Error("The AI model returned an empty script. Please try again.");
        }
        return { script: text };
    } catch (error) {
        handleGeminiError(error);
        throw error;
    }
};


export const compareThumbnails = async (imageA: string, imageB: string): Promise<ThumbnailComparisonResult> => {
   try {
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

        return parseJsonResponse<ThumbnailComparisonResult>(response.text);
    } catch (error) {
        handleGeminiError(error);
        throw error;
    }
};