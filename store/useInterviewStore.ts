import { create } from "zustand";

export type InterviewStatus =
  | "idle"
  | "connecting"
  | "active"
  | "paused"
  | "evaluating"
  | "completed"
  | "error";

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

interface InterviewState {
  status: InterviewStatus;
  transcript: TranscriptEntry[];
  candidateName: string;
  startTime: number | null;
  elapsed: number;
  questionCount: number;
  isMuted: boolean;
  isAISpeaking: boolean;
  currentAIText: string;
  evaluation: EvaluationResult | null;
  error: string | null;

  // Actions
  setStatus: (status: InterviewStatus) => void;
  setCandidateName: (name: string) => void;
  addTranscript: (entry: TranscriptEntry) => void;
  setStartTime: (time: number) => void;
  setElapsed: (seconds: number) => void;
  incrementQuestions: () => void;
  setMuted: (muted: boolean) => void;
  setAISpeaking: (speaking: boolean) => void;
  setCurrentAIText: (text: string) => void;
  setEvaluation: (evaluation: EvaluationResult) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as InterviewStatus,
  transcript: [],
  candidateName: "",
  startTime: null,
  elapsed: 0,
  questionCount: 0,
  isMuted: false,
  isAISpeaking: false,
  currentAIText: "",
  evaluation: null,
  error: null,
};

export const useInterviewStore = create<InterviewState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  setCandidateName: (candidateName) => set({ candidateName }),
  addTranscript: (entry) =>
    set((state) => ({ transcript: [...state.transcript, entry] })),
  setStartTime: (startTime) => set({ startTime }),
  setElapsed: (elapsed) => set({ elapsed }),
  incrementQuestions: () =>
    set((state) => ({ questionCount: state.questionCount + 1 })),
  setMuted: (isMuted) => set({ isMuted }),
  setAISpeaking: (isAISpeaking) => set({ isAISpeaking }),
  setCurrentAIText: (currentAIText) => set({ currentAIText }),
  setEvaluation: (evaluation) => set({ evaluation }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
