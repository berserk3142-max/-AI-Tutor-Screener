import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadToR2 } from "@/lib/r2";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { interviewId, audioData } = await req.json();
    if (!interviewId || !audioData) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    let audioUrl: string;

    // Check if R2 credentials are configured
    const hasR2 = process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY;

    if (hasR2) {
      // ─── Upload to Cloudflare R2 ───
      console.log("☁️ Uploading audio to Cloudflare R2...");

      // Convert base64 data URL to Buffer
      const base64Data = audioData.split(",")[1]; // Remove "data:audio/webm;base64," prefix
      const buffer = Buffer.from(base64Data, "base64");

      const key = `interviews/${interviewId}/recording.webm`;
      audioUrl = await uploadToR2(key, buffer, "audio/webm");
    } else {
      // ─── Fallback: Store as base64 in DB ───
      console.log("💾 R2 not configured, storing audio in database...");
      audioUrl = audioData;
    }

    // Save the URL/reference to the interview record
    await db.update(interviews).set({ audioUrl }).where(eq(interviews.id, interviewId));

    return NextResponse.json({ audioUrl, storage: hasR2 ? "r2" : "database", success: true });
  } catch (error) {
    console.error("Upload audio error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
