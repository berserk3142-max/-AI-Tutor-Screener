// ─── Interview Types ───

export interface TranscriptEntry {
  role: "user" | "ai";
  text: string;
  timestamp: number;
}

export interface EvaluationResult {
  id: string;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  overallScore: number;
  summary: string;
  evidence: string[];
  strengths: string[];
  improvements: string[];
}

export interface InterviewRecord {
  id: string;
  candidateName: string;
  userId?: string | null;
  overallScore: number;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  summary: string;
  transcript?: string;
  evidence?: string[];
  strengths?: string[];
  improvements?: string[];
  duration: number;
  questionCount: number;
  status: string;
  createdAt: string;
}

export type InterviewStatus =
  | "idle"
  | "connecting"
  | "active"
  | "paused"
  | "evaluating"
  | "completed"
  | "error";
