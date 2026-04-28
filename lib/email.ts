import { Resend } from "resend";
import { buildEvaluationHTML } from "./email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEvaluationEmailParams {
  to: string;
  candidateName: string;
  overallScore: number;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  interviewId: string;
}

/**
 * Send evaluation results email to the candidate.
 * Fire-and-forget — errors are logged but don't block the response.
 */
export async function sendEvaluationEmail(params: SendEvaluationEmailParams): Promise<void> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
      ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}`
      : "http://localhost:3000";

    const html = buildEvaluationHTML({
      ...params,
      appUrl,
    });

    const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

    const { error } = await resend.emails.send({
      from: `NovaAI <${fromEmail}>`,
      to: params.to,
      subject: `NovaAI — Your Interview Score: ${params.overallScore}/10`,
      html,
    });

    if (error) {
      console.error("📧 Email send error:", error);
    } else {
      console.log(`📧 Evaluation email sent to ${params.to}`);
    }
  } catch (err) {
    console.error("📧 Failed to send evaluation email:", err);
  }
}

// ─── Invite Email ───

interface SendInviteEmailParams {
  to: string;
  candidateName: string;
  inviteUrl: string;
  expiresAt: Date;
}

export async function sendInviteEmail(params: SendInviteEmailParams): Promise<void> {
  try {
    const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
    const expiryStr = params.expiresAt.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0e0e0e;border:4px solid #484848;">
  <tr><td style="background:#000;padding:24px 32px;border-bottom:4px solid #bcff5f;">
    <span style="font-size:24px;font-weight:900;color:#bcff5f;text-transform:uppercase;">NOVAAI</span><br/>
    <span style="font-size:10px;color:#757575;text-transform:uppercase;letter-spacing:0.15em;">INTERVIEW INVITATION</span>
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="color:#fff;font-size:18px;font-weight:700;text-transform:uppercase;margin:0 0 8px;">Hi ${params.candidateName},</p>
    <p style="color:#ababab;font-size:14px;line-height:1.7;margin:0 0 24px;">You've been invited to complete an AI-powered interview with <strong style="color:#bcff5f;">Nova</strong>. Click the button below to begin your voice interview.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${params.inviteUrl}" style="display:inline-block;padding:16px 40px;background:#bcff5f;color:#000;font-size:14px;font-weight:800;text-transform:uppercase;text-decoration:none;border:4px solid #000;letter-spacing:0.02em;">🎤 START INTERVIEW →</a>
    </div>
    <div style="background:#191919;border:2px solid #2c2c2c;padding:16px;margin:24px 0;">
      <p style="color:#757575;font-size:11px;text-transform:uppercase;margin:0 0 8px;letter-spacing:0.1em;">LINK DETAILS</p>
      <p style="color:#ababab;font-size:12px;margin:0 0 4px;">⏰ Expires: <strong style="color:#ff51fa;">${expiryStr}</strong></p>
      <p style="color:#ababab;font-size:12px;margin:0;">🔒 This link is unique to you and can only be used once.</p>
    </div>
    <p style="color:#757575;font-size:12px;line-height:1.6;margin:0;">If the button doesn't work, copy this link:<br/>
    <span style="color:#00ffff;font-size:11px;word-break:break-all;">${params.inviteUrl}</span></p>
  </td></tr>
  <tr><td style="background:#000;padding:16px 32px;border-top:2px solid #2c2c2c;">
    <span style="font-size:12px;font-weight:900;color:#bcff5f;">NOVAAI</span>
    <span style="font-size:10px;color:#484848;"> // AI-POWERED INTERVIEWS</span>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    const { error } = await resend.emails.send({
      from: `NovaAI <${fromEmail}>`,
      to: params.to,
      subject: `NovaAI — You're Invited to an AI Interview`,
      html,
    });

    if (error) console.error("📧 Invite email error:", error);
    else console.log(`📧 Invite sent to ${params.to}`);
  } catch (err) {
    console.error("📧 Failed to send invite email:", err);
  }
}
