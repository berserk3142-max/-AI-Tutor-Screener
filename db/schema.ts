import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const interviews = pgTable("interviews", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  candidateName: text("candidate_name").default("Anonymous"),
  transcript: text("transcript"),
  clarity: integer("clarity"),
  patience: integer("patience"),
  fluency: integer("fluency"),
  warmth: integer("warmth"),
  simplicity: integer("simplicity"),
  overallScore: integer("overall_score"),
  summary: text("summary"),
  evidence: jsonb("evidence").$type<string[]>(),
  strengths: jsonb("strengths").$type<string[]>(),
  improvements: jsonb("improvements").$type<string[]>(),
  duration: integer("duration_seconds"),
  questionCount: integer("question_count"),
  status: text("status").default("completed"),
  // ─── Tags & Notes (recruiter features) ───
  tags: jsonb("tags").$type<string[]>(),
  recruiterNotes: text("recruiter_notes"),
  taggedBy: text("tagged_by"),
  taggedAt: timestamp("tagged_at"),
  // ─── Audio recording ───
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow(),
});
