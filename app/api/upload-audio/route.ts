import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { interviewId, audioData } = await req.json();
    if (!interviewId || !audioData) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Store audio as base64 data URL in database
    await db.update(interviews).set({ audioUrl: audioData }).where(eq(interviews.id, interviewId));

    return NextResponse.json({ audioUrl: `/api/audio/${interviewId}`, success: true });
  } catch (error) {
    console.error("Upload audio error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
