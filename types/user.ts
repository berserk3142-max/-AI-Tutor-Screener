// ─── User & Auth Types ───

export type UserRole = "candidate" | "recruiter";

export interface UserPublicMetadata {
  role?: UserRole;
}
