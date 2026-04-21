import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const interviews = pgTable("interviews", {
  id: text("id").primaryKey(),
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
  createdAt: timestamp("created_at").defaultNow(),
});
