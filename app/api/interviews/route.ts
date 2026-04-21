import { NextResponse } from "next/server";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allInterviews = await db
      .select({
        id: interviews.id,
        candidateName: interviews.candidateName,
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
        createdAt: interviews.createdAt,
      })
      .from(interviews)
      .orderBy(desc(interviews.createdAt));

    return NextResponse.json(allInterviews);
  } catch (error) {
    console.error("Fetch interviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
