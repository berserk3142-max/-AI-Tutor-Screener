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
  // ─── Invitation link ───
  invitationId: text("invitation_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invitations = pgTable("interview_invitations", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  candidateEmail: text("candidate_email").notNull(),
  candidateName: text("candidate_name").default(""),
  createdBy: text("created_by").notNull(), // recruiter userId
  status: text("status").default("pending").notNull(), // pending | used | expired
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  interviewId: text("interview_id"), // linked after interview completes
  createdAt: timestamp("created_at").defaultNow(),
});
