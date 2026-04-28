import { auth, currentUser } from "@clerk/nextjs/server";
import { ROLES } from "./constants";
import type { UserRole } from "@/types/user";

/**
 * Get the role of the current user from Clerk's publicMetadata.
 * Defaults to "candidate" if no role is set.
 */
export async function getUserRole(): Promise<UserRole> {
  const user = await currentUser();
  if (!user) return ROLES.CANDIDATE;
  const role = (user.publicMetadata as { role?: string })?.role;
  return role === ROLES.RECRUITER ? ROLES.RECRUITER : ROLES.CANDIDATE;
}

/**
 * Check if the current user has the recruiter role.
 */
export async function isRecruiter(): Promise<boolean> {
  const role = await getUserRole();
  return role === ROLES.RECRUITER;
}

/**
 * Get the authenticated user's ID, or null if not authenticated.
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
