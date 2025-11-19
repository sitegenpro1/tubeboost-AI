import { KeywordResult, ContentIdeaResult, UploadTimeResult, ThumbnailResult, VideoScriptResult, ThumbnailComparisonResult } from '../types';

const handleApiError = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    return response.json();
};

export const generateKeywords = async (topic: string): Promise<KeywordResult> => {
    const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
    });
    return handleApiError(response);
};

export const generateContentIdeas = async (topic: string, audience: string): Promise<ContentIdeaResult> => {
    const response = await fetch('/api/contentIdeas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience }),
    });
    return handleApiError(response);
};

export const generateUploadTimeSuggestions = async (niche: string): Promise<UploadTimeResult> => {
     const response = await fetch('/api/uploadTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
    });
    return handleApiError(response);
};

export const generateThumbnail = async (prompt: string, style: string, negativePrompt: string): Promise<ThumbnailResult> => {
    const response = await fetch('/api/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, negativePrompt }),
    });
    const data = await handleApiError(response);
    return data.base64Image;
};

export const generateVideoScript = async (title: string, talkingPoints: string): Promise<VideoScriptResult> => {
    const response = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, talkingPoints }),
    });
    return handleApiError(response);
};

export const compareThumbnails = async (imageA: string, imageB: string): Promise<ThumbnailComparisonResult> => {
    const response = await fetch('/api/compareThumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageA, imageB }),
    });
    return handleApiError(response);
};