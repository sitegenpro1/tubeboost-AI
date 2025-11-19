export interface Keyword {
  text: string;
  type: 'Related Keyword' | 'Long-Tail Variation' | 'Question';
  competition: 'Low' | 'Medium' | 'High';
}

export interface KeywordResult {
  keywords: Keyword[];
  strategy: string;
}

export interface ContentIdeaResult {
  titleIdeas: string[];
  talkingPoints: string[];
  tags: string[];
}

export interface UploadTimeResult {
  schedule: {
    day: string;
    time: string;
    reasoning: string;
  }[];
  summary: string;
}

export type ThumbnailResult = string; // base64 string

export interface VideoScriptResult {
    script: string;
}

export type NotificationType = 'success' | 'info' | 'error';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface ThumbnailComparisonResult {
  analysis: Array<{
    principle: string;
    thumbnailA_score: number;
    thumbnailA_reasoning: string;
    thumbnailB_score: number;
    thumbnailB_reasoning: string;
  }>;
  verdict: {
    winner: 'Thumbnail A' | 'Thumbnail B' | 'Tie';
    summary: string;
  };
}