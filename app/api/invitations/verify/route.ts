import { NextResponse } from "next/server";
import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

// GET /api/invitations/verify?token=xxx — Verify an invitation token
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.token, token),
          eq(invitations.status, "pending"),
          gt(invitations.expiresAt, new Date())
        )
      )
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({
        valid: false,
        error: "Invalid, expired, or already used invitation",
      });
    }

    const invite = result[0];
    return NextResponse.json({
      valid: true,
      candidateEmail: invite.candidateEmail,
      candidateName: invite.candidateName,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    console.error("Verify invitation error:", error);
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 });
  }
}
