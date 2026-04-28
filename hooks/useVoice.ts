"use client";

import { useCallback, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useInterviewStore } from "@/store/useInterviewStore";

// Use store.getState() for reading state inside callbacks (avoids stale closures)
const getStore = () => useInterviewStore.getState();

// Audio recorder refs (module-level to avoid stale closures)
let mediaRecorderInstance: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

async function startAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
    audioChunks = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
    mr.onstop = () => { stream.getTracks().forEach((t) => t.stop()); };
    mediaRecorderInstance = mr;
    mr.start(1000);
    console.log("🎙️ Audio recording started");
  } catch (err) {
    console.error("🎙️ Failed to start recording:", err);
  }
}

function stopAudioRecording(): Blob | null {
  if (mediaRecorderInstance && mediaRecorderInstance.state !== "inactive") {
    mediaRecorderInstance.stop();
    mediaRecorderInstance = null;
    console.log("🎙️ Audio recording stopped");
    // Return blob from collected chunks
    if (audioChunks.length > 0) {
      return new Blob(audioChunks, { type: "audio/webm" });
    }
  }
  return null;
}

async function uploadAudioBlob(interviewId: string, blob: Blob) {
  try {
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const res = await fetch("/api/upload-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewId, audioData: base64 }),
    });

    if (res.ok) {
      console.log("🎙️ Audio uploaded successfully for interview:", interviewId);
    } else {
      console.error("🎙️ Audio upload failed:", res.status);
    }
  } catch (err) {
    console.error("🎙️ Audio upload error:", err);
  }
}

// Nova interviewer system prompt (kept as fallback reference)
const NOVA_SYSTEM_PROMPT = `You are Nova, a warm and professional AI interviewer at Cuemath. You evaluate tutor candidates' teaching and communication skills through a natural voice conversation.

IMPORTANT: You must ALWAYS respond with spoken text. Never return an empty response.

LANGUAGE: You MUST speak ONLY in English. Every word must be in English.

YOUR ROLE: You have already introduced yourself. Now conduct the interview by asking questions one at a time.

INTERVIEW FLOW — ask these questions ONE at a time, waiting for the candidate's full response before moving on:
1. "Great, thanks for sharing! Now imagine I'm a 9-year-old student. Can you explain what fractions are to me? Make it fun and simple!"
2. "Nice! Here's a scenario: A student has been stuck on a math problem for 5 minutes and says they just don't get it. What would you do?"
3. "How would you handle a student who's clearly losing interest during a tutoring session?"
4. "Can you explain why learning algebra is important, in a way that would excite a 12-year-old?"
5. "Tell me about a time you had to take something really complex and explain it simply."
6. "Last one: What would you do if a student gives a wrong answer? How do you handle that moment?"

After all questions, say: "Thank you so much! That was a wonderful conversation. You did great today. We really appreciate your time!"

RULES:
- Ask ONE question at a time. Never combine questions.
- After the candidate responds, give a SHORT 1-2 sentence acknowledgment, then ask the next question.
- If the answer is vague, follow up: "Could you tell me more?" or "Can you give a specific example?"
- If the candidate is nervous, encourage them: "Take your time, there are no wrong answers here."
- If there is silence, gently prompt: "No rush, I'm here whenever you're ready."
- Be warm, natural, and conversational.
- NEVER reveal evaluation metrics.
- You are an INTERVIEWER — NEVER answer your own questions or teach the candidate.
- If the candidate says "I don't know", say "No worries! Let's move to the next one." and continue.`;

void NOVA_SYSTEM_PROMPT; // Kept for reference; assistant config is on Vapi dashboard

export function useVoice() {
  const vapiRef = useRef<Vapi | null>(null);

  const startInterview = useCallback(async () => {
    const s = getStore();
    try {
      s.setStatus("connecting");
      s.setError(null);
      console.log("🔄 Step 1: Initializing Vapi...");

      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_VAPI_API_KEY is not set in .env.local");
      }

      const vapi = new Vapi(apiKey);
      vapiRef.current = vapi;

      // ─── EVENT HANDLERS ───

      vapi.on("call-start", () => {
        console.log("✅ Vapi call started — Nova is live!");
        const st = getStore();
        st.setStatus("active");
        st.setStartTime(Date.now());
      });

      vapi.on("call-end", () => {
        console.log("📞 Vapi call ended");
      });

      vapi.on("speech-start", () => {
        getStore().setAISpeaking(true);
        getStore().setCurrentAIText("");
      });

      vapi.on("speech-end", () => {
        getStore().setAISpeaking(false);
      });

      vapi.on("message", (message: Record<string, unknown>) => {
        const st = getStore();

        switch (message.type) {
          case "transcript": {
            const role = message.role as string;
            const text = message.transcript as string;
            const transcriptType = message.transcriptType as string;

            if (transcriptType === "partial") {
              if (role === "assistant") {
                st.setCurrentAIText(text || "");
                st.setAISpeaking(true);
              }
            } else if (transcriptType === "final") {
              if (role === "assistant" && text?.trim()) {
                st.addTranscript({ role: "ai", text: text.trim(), timestamp: Date.now() });
                st.incrementQuestions();
                st.setAISpeaking(false);
                st.setCurrentAIText("");
              } else if (role === "user" && text?.trim()) {
                st.addTranscript({ role: "user", text: text.trim(), timestamp: Date.now() });
              }
            }
            break;
          }

          case "conversation-update": {
            console.log("💬 Conversation updated");
            break;
          }

          default:
            break;
        }
      });

      vapi.on("volume-level", (volume: number) => {
        void volume;
      });

      vapi.on("error", (error: unknown) => {
        console.error("❌ Vapi error:", error);
        const err = error as Record<string, string> | undefined;
        getStore().setError(err?.message || "Voice connection error occurred");
        getStore().setStatus("error");
      });

      // ─── START AUDIO RECORDING ───
      await startAudioRecording();

      // ─── START THE CALL using Vapi Dashboard Assistant ───
      console.log("🔄 Step 2: Starting Vapi call with assistant ID...");

      await vapi.start("afb4e9ee-ce87-466e-bc61-be6eaab40ef0");

      console.log("✅ Vapi.start() resolved");

    } catch (err: unknown) {
      console.error("❌ Start error:", err);
      const st = getStore();
      st.setStatus("error");
      st.setError(err instanceof Error ? err.message : "Failed to connect to Nova");
    }
  }, []);

  const toggleMute = useCallback(() => {
    const vapi = vapiRef.current;
    if (vapi) {
      const currentlyMuted = vapi.isMuted();
      vapi.setMuted(!currentlyMuted);
      getStore().setMuted(!currentlyMuted);
    }
  }, []);

  const interruptAudio = useCallback(() => {
    getStore().setAISpeaking(false);
    getStore().setCurrentAIText("");
  }, []);

  const endInterview = useCallback(async () => {
    // Stop Vapi call
    const vapi = vapiRef.current;
    if (vapi) {
      vapi.stop();
      vapiRef.current = null;
    }

    // ─── Stop audio recording and collect blob ───
    // Small delay to ensure MediaRecorder captures final chunks
    await new Promise((r) => setTimeout(r, 500));
    const audioBlob = stopAudioRecording();

    const s = getStore();
    s.setStatus("evaluating");

    const transcriptText = s.transcript
      .map((e) => `${e.role === "ai" ? "Interviewer (Nova)" : "Candidate"}: ${e.text}`)
      .join("\n\n");

    if (transcriptText.trim().length === 0) {
      s.setStatus("idle");
      s.setError("No transcript captured. Please speak during the interview.");
      return;
    }

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptText,
          candidateName: s.candidateName || "Anonymous",
          duration: Math.floor(s.elapsed),
          questionCount: s.questionCount,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Evaluation failed" }));
        throw new Error(errorData.error || "Evaluation failed");
      }

      const evaluation = await res.json();
      getStore().setEvaluation(evaluation);
      getStore().setStatus("completed");

      // ─── Upload audio recording (fire-and-forget) ───
      if (audioBlob && evaluation.id) {
        console.log("🎙️ Uploading audio for interview:", evaluation.id);
        uploadAudioBlob(evaluation.id, audioBlob).catch((err) =>
          console.error("Audio upload failed:", err)
        );
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      getStore().setError(
        err instanceof Error ? err.message : "Failed to evaluate interview"
      );
      getStore().setStatus("error");
    }
  }, []);

  return { startInterview, endInterview, toggleMute, interruptAudio };
}
