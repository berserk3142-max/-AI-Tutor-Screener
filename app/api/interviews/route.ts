import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    const isRecruiter = role === "recruiter";

    const cols = {
      id: interviews.id,
      candidateName: interviews.candidateName,
      userId: interviews.userId,
      overallScore: interviews.overallScore,
      clarity: interviews.clarity,
      patience: interviews.patience,
      fluency: interviews.fluency,
      warmth: interviews.warmth,
      simplicity: interviews.simplicity,
      summary: interviews.summary,
      duration: interviews.duration,
      questionCount: interviews.questionCount,
      status: interviews.status,
      tags: interviews.tags,
      recruiterNotes: interviews.recruiterNotes,
      createdAt: interviews.createdAt,
    };

    const data = isRecruiter
      ? await db.select(cols).from(interviews).orderBy(desc(interviews.createdAt))
      : await db.select(cols).from(interviews).where(eq(interviews.userId, userId)).orderBy(desc(interviews.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch interviews error:", error);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}
