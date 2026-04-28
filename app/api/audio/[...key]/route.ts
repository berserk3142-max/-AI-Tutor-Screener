import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getFromR2 } from "@/lib/r2";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { key } = await params;
    const objectKey = key.join("/"); // e.g. "interviews/uuid/recording.webm"

    const { body, contentType } = await getFromR2(objectKey);

    if (!body) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Get audio error:", error);
    return NextResponse.json({ error: "Failed to fetch audio" }, { status: 500 });
  }
}
