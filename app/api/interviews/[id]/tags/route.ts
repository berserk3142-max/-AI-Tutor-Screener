import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ─── Auth + Role Check ───
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    if (role !== "recruiter") {
      return NextResponse.json(
        { error: "Forbidden — recruiter access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { tags, notes } = await req.json();

    // Validate
    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Tags must be an array" },
        { status: 400 }
      );
    }

    await db
      .update(interviews)
      .set({
        tags: tags || [],
        recruiterNotes: notes || "",
        taggedBy: userId,
        taggedAt: new Date(),
      })
      .where(eq(interviews.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update tags error:", error);
    return NextResponse.json(
      { error: "Failed to update tags" },
      { status: 500 }
    );
  }
}
