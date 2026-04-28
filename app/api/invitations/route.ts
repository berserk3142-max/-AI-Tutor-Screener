import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { invitations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { sendInviteEmail } from "@/lib/email";

// GET — List all invitations (recruiter only)
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    if (role !== "recruiter") {
      return NextResponse.json({ error: "Recruiter access required" }, { status: 403 });
    }

    const data = await db
      .select()
      .from(invitations)
      .orderBy(desc(invitations.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch invitations error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST — Create a new invitation (recruiter only)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    if (role !== "recruiter") {
      return NextResponse.json({ error: "Recruiter access required" }, { status: 403 });
    }

    const { candidateEmail, candidateName } = await req.json();
    if (!candidateEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    await db.insert(invitations).values({
      id,
      token,
      candidateEmail: candidateEmail.toLowerCase().trim(),
      candidateName: candidateName || "",
      createdBy: userId,
      status: "pending",
      expiresAt,
    });

    // Build invite URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const inviteUrl = `${baseUrl}/interview?token=${token}`;

    // Send invite email
    try {
      await sendInviteEmail({
        to: candidateEmail,
        candidateName: candidateName || "Candidate",
        inviteUrl,
        expiresAt,
      });
    } catch (emailErr) {
      console.error("Failed to send invite email:", emailErr);
    }

    return NextResponse.json({
      id,
      token,
      inviteUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Create invitation error:", error);
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 });
  }
}
