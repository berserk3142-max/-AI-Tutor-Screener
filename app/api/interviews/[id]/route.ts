import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ─── Auth Check ───
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized — please sign in" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const result = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const interview = result[0];

    // ─── Ownership / Role Check ───
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    const isRecruiter = role === "recruiter";

    // Candidates can only view their own interviews
    if (!isRecruiter && interview.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden — you can only view your own interviews" },
        { status: 403 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Fetch interview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview" },
      { status: 500 }
    );
  }
}
