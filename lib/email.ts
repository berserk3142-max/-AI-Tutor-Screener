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
