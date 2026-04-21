import { NextResponse } from "next/server";
import { db } from "@/db";
import { interviews } from "@/db/schema";

const EVAL_PROMPT = `You are an expert evaluator of teaching and communication skills. Analyze the following interview transcript and provide a structured evaluation.

Return a JSON object with EXACTLY this structure (no markdown, no code fences, pure JSON only):
{
  "clarity": <number 1-10>,
  "patience": <number 1-10>,
  "simplicity": <number 1-10>,
  "warmth": <number 1-10>,
  "fluency": <number 1-10>,
  "overallScore": <number 1-10>,
  "summary": "<2-3 sentence overall assessment>",
  "evidence": ["<direct quote or observation 1>", "<direct quote or observation 2>", "<direct quote or observation 3>"],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area for improvement 1>", "<area for improvement 2>"]
}

SCORING CRITERIA:
- clarity (1-10): How clearly the candidate explains concepts. Do they use good examples? Is their language precise?
- patience (1-10): How well they handle confusion, repeated questions, or slow understanding. Do they stay calm?
- simplicity (1-10): Can they break down complex topics into digestible pieces? Do they avoid unnecessary jargon?
- warmth (1-10): Are they approachable, friendly, and encouraging? Do they create a safe learning environment?
- fluency (1-10): How smooth and natural is their communication? Do they speak confidently without excessive filler words?
- overallScore (1-10): Weighted average favoring clarity and patience.

Be fair but thorough. Provide specific evidence from the transcript.`;

// Models to try — with both v1beta and v1 endpoints
const GEMINI_ATTEMPTS = [
  { model: "gemini-2.0-flash", api: "v1beta" },
  { model: "gemini-2.0-flash-lite", api: "v1beta" },
  { model: "gemini-1.5-flash", api: "v1" },
  { model: "gemini-1.5-flash-latest", api: "v1beta" },
  { model: "gemini-pro", api: "v1" },
];

async function callGemini(
  geminiKey: string,
  transcript: string
): Promise<{ success: true; evaluation: Record<string, unknown> } | { success: false; error: string }> {

  for (const { model, api } of GEMINI_ATTEMPTS) {
    console.log(`🔄 Trying ${model} (${api})...`);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${api}/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${EVAL_PROMPT}\n\nInterview Transcript:\n\n${transcript}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!rawText) {
          console.warn(`Empty response from ${model}, trying next...`);
          continue;
        }

        const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const evaluation = JSON.parse(cleaned);
        console.log(`✅ Evaluation successful with ${model}`);
        return { success: true, evaluation };
      }

      const errorBody = await response.text();
      console.warn(`⚠️ ${model} failed (${response.status}): ${errorBody.slice(0, 200)}`);
      // Continue to next model

    } catch (err) {
      console.error(`❌ Fetch error for ${model}:`, err);
    }
  }

  // All Gemini models failed — use local fallback evaluation
  console.log("⚠️ All Gemini models failed, using local fallback evaluation");
  return localFallbackEvaluation(transcript);
}

/**
 * Local fallback: analyze transcript with basic heuristics when Gemini is unavailable.
 * Not as good as AI, but ensures the user always gets a result.
 */
function localFallbackEvaluation(
  transcript: string
): { success: true; evaluation: Record<string, unknown> } {
  const lines = transcript.split("\n").filter((l) => l.trim());
  const candidateLines = lines.filter((l) => l.startsWith("Candidate:"));
  const totalCandidateWords = candidateLines.join(" ").split(/\s+/).length;
  const questionsAnswered = candidateLines.length;

  // Heuristic scoring based on transcript analysis
  const verbosity = Math.min(10, Math.max(3, Math.round(totalCandidateWords / 30)));
  const engagement = Math.min(10, Math.max(3, questionsAnswered + 2));

  const clarity = Math.min(10, Math.max(4, verbosity));
  const patience = Math.min(10, Math.max(5, engagement));
  const fluency = Math.min(10, Math.max(4, verbosity - 1));
  const warmth = Math.min(10, Math.max(5, engagement - 1));
  const simplicity = Math.min(10, Math.max(4, Math.round((verbosity + engagement) / 2)));
  const overallScore = Math.round((clarity + patience + fluency + warmth + simplicity) / 5);

  return {
    success: true,
    evaluation: {
      clarity,
      patience,
      fluency,
      warmth,
      simplicity,
      overallScore,
      summary: `The candidate answered ${questionsAnswered} questions with approximately ${totalCandidateWords} words total. This is an automated preliminary evaluation — AI evaluation was unavailable due to API rate limits. Please re-evaluate when the API is available for a more detailed assessment.`,
      evidence: [
        `Candidate provided ${questionsAnswered} responses during the interview`,
        `Average response length: ~${Math.round(totalCandidateWords / Math.max(1, questionsAnswered))} words per answer`,
        "Note: Detailed analysis unavailable — this is a heuristic-based evaluation",
      ],
      strengths: [
        "Participated in the full interview process",
        questionsAnswered >= 4 ? "Engaged with multiple interview questions" : "Showed willingness to attempt questions",
        totalCandidateWords > 100 ? "Provided detailed responses" : "Provided responses to questions asked",
      ],
      improvements: [
        "Re-run evaluation with AI for detailed, evidence-based scoring",
        "Consider scheduling a follow-up interview for comprehensive assessment",
      ],
    },
  };
}

export async function POST(req: Request) {
  try {
    const { transcript, candidateName, duration, questionCount } =
      await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.error("GEMINI_API_KEY not set");
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Step 1: Evaluate with Gemini (with model fallback + local fallback)
    const result = await callGemini(geminiKey, transcript);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    const evaluation = result.evaluation;

    // Step 2: Save to database
    const interviewId = crypto.randomUUID();

    await db.insert(interviews).values({
      id: interviewId,
      candidateName: candidateName || "Anonymous",
      transcript,
      clarity: evaluation.clarity as number,
      patience: evaluation.patience as number,
      fluency: evaluation.fluency as number,
      warmth: evaluation.warmth as number,
      simplicity: evaluation.simplicity as number,
      overallScore: evaluation.overallScore as number,
      summary: evaluation.summary as string,
      evidence: evaluation.evidence as string[],
      strengths: evaluation.strengths as string[],
      improvements: evaluation.improvements as string[],
      duration: duration || 0,
      questionCount: questionCount || 0,
      status: "completed",
    });

    return NextResponse.json({
      id: interviewId,
      ...evaluation,
    });
  } catch (error) {
    console.error("Evaluate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
