"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/useInterviewStore";
import { useVoice } from "@/hooks/useVoice";

export default function InterviewRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const candidateName = decodeURIComponent(searchParams.get("name") || "Anonymous");

  const status = useInterviewStore((s) => s.status);
  const transcript = useInterviewStore((s) => s.transcript);
  const currentAIText = useInterviewStore((s) => s.currentAIText);
  const isAISpeaking = useInterviewStore((s) => s.isAISpeaking);
  const isMuted = useInterviewStore((s) => s.isMuted);
  const elapsed = useInterviewStore((s) => s.elapsed);
  const questionCount = useInterviewStore((s) => s.questionCount);
  const error = useInterviewStore((s) => s.error);
  const evaluation = useInterviewStore((s) => s.evaluation);
  const startTime = useInterviewStore((s) => s.startTime);

  const { startInterview, endInterview, toggleMute } = useVoice();
  const [showTranscript, setShowTranscript] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Auto-start interview on mount
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const store = useInterviewStore.getState();
    store.reset();
    store.setCandidateName(candidateName);

    // Start after a brief delay for the UI to render
    const timer = setTimeout(() => {
      console.log("🚀 Auto-starting interview...");
      startInterview();
    }, 800);

    return () => {
      clearTimeout(timer);
      // Reset ref so strict mode re-mount works
      hasStarted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript, currentAIText]);

  // Timer
  useEffect(() => {
    if (status !== "active" || !startTime) return;
    const interval = setInterval(() => {
      useInterviewStore.getState().setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [status, startTime]);

  // Redirect when evaluation complete
  useEffect(() => {
    if (status === "completed" && evaluation?.id) {
      router.push(`/results/${evaluation.id}`);
    }
  }, [status, evaluation, router]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const handleEnd = useCallback(async () => {
    setIsEnding(true);
    await endInterview();
  }, [endInterview]);

  const handleRetry = useCallback(() => {
    const store = useInterviewStore.getState();
    store.reset();
    store.setCandidateName(candidateName);
    setIsEnding(false);
    startInterview();
  }, [candidateName, startInterview]);

  // ─── CONNECTING STATE ───
  if (status === "idle" || status === "connecting") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
        <style>{`
          @keyframes cpulse { 0%, 100% { box-shadow: 0 0 40px rgba(188,255,95,0.3); } 50% { box-shadow: 0 0 80px rgba(188,255,95,0.6); } }
          @keyframes cwave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
          @keyframes step-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <div style={{ width: "100px", height: "100px", background: "#191919", border: "4px solid #bcff5f", display: "flex", alignItems: "center", justifyContent: "center", animation: "cpulse 2s ease-in-out infinite", marginBottom: "32px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#bcff5f", fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <div style={{ fontSize: "16px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
          CONNECTING TO NOVA...
        </div>
        <div style={{ fontSize: "11px", color: "#757575", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "4px" }}>
          ROOM: {roomId}
        </div>
        <div style={{ fontSize: "11px", color: "#484848", marginBottom: "20px" }}>
          Setting up voice link — this takes 5-10 seconds
        </div>
        <div style={{ marginBottom: "20px", display: "flex", gap: "4px", alignItems: "flex-end", height: "24px" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: "4px", height: "20px", background: "#bcff5f", animation: `cwave ${0.5 + i * 0.1}s ease-in-out ${i * 0.1}s infinite`, transformOrigin: "bottom" }} />
          ))}
        </div>
        {/* Progress steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
          <div style={{ fontSize: "10px", color: "#bcff5f", textTransform: "uppercase", animation: "step-fade 0.5s ease-out" }}>
            ✓ Requesting session token...
          </div>
          {status === "connecting" && (
            <div style={{ fontSize: "10px", color: "#00ffff", textTransform: "uppercase", animation: "step-fade 0.5s ease-out 0.5s both" }}>
              ✓ Connecting microphone...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── EVALUATING STATE ───
  if (status === "evaluating") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
        <div style={{ width: "100px", height: "100px", background: "#191919", border: "4px solid #ff51fa", display: "flex", alignItems: "center", justifyContent: "center", animation: "glow-pulse 2s ease-in-out infinite", marginBottom: "24px", boxShadow: "8px 8px 0px 0px #bcff5f" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ff51fa", fontVariationSettings: "'FILL' 1" }}>psychology</span>
        </div>
        <div style={{ fontSize: "18px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>EVALUATING YOUR INTERVIEW</div>
        <div style={{ fontSize: "11px", color: "#757575", textTransform: "uppercase", marginBottom: "24px" }}>
          ANALYZING {transcript.length} RESPONSES
        </div>
        <div style={{ width: "200px", height: "4px", background: "#1f1f1f", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #bcff5f, #ff51fa, #00ffff)", animation: "shimmer 1.5s ease-in-out infinite", backgroundSize: "200% 100%" }} />
        </div>
      </div>
    );
  }

  // ─── ERROR STATE ───
  if (status === "error") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, gap: "16px", padding: "24px" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "#ff7351", fontVariationSettings: "'FILL' 1" }}>error</span>
        <div style={{ fontSize: "18px", fontWeight: 700, textTransform: "uppercase", color: "#ff7351" }}>CONNECTION FAILED</div>
        <div style={{ fontSize: "13px", color: "#ababab", maxWidth: "500px", textAlign: "center", lineHeight: 1.6 }}>{error}</div>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <button onClick={handleRetry} style={{ background: "#bcff5f", color: "#000", padding: "12px 24px", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", border: "4px solid #000", cursor: "pointer", boxShadow: "4px 4px 0px 0px #ff51fa", fontFamily: "'Space Grotesk', sans-serif" }}>
            RETRY
          </button>
          <button onClick={() => router.push("/interview")} style={{ background: "transparent", color: "#bcff5f", padding: "12px 24px", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", border: "4px solid #bcff5f", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE INTERVIEW — MEET STYLE ───
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0a", display: "flex", flexDirection: "column", zIndex: 50 }}>
      <style>{`
        @keyframes ospeak { 0%, 100% { box-shadow: 0 0 40px rgba(188,255,95,0.4), 0 0 80px rgba(188,255,95,0.15); transform: scale(1); } 50% { box-shadow: 0 0 70px rgba(188,255,95,0.7), 0 0 140px rgba(188,255,95,0.3); transform: scale(1.04); } }
        @keyframes oidle { 0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.2); } 50% { box-shadow: 0 0 40px rgba(0,255,255,0.4); } }
        @keyframes rout { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes vbar { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        @keyframes mglow { 0%, 100% { box-shadow: 0 0 10px rgba(188,255,95,0.3); } 50% { box-shadow: 0 0 25px rgba(188,255,95,0.6); } }
      `}</style>

      {/* ─── TOP BAR ─── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid #1a1a1a", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", background: "#bcff5f", animation: "glow-pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.05em" }}>LIVE INTERVIEW</span>
          <span style={{ fontSize: "11px", color: "#484848" }}>|</span>
          <span style={{ fontSize: "11px", color: "#757575" }}>{candidateName}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "16px", fontWeight: 800, fontFamily: "monospace", color: "#bcff5f" }}>{formatTime(elapsed)}</span>
          <span style={{ fontSize: "10px", color: "#484848", textTransform: "uppercase" }}>Q:{questionCount}</span>
        </div>
      </div>

      {/* ─── MAIN: TWO TILES ─── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", gap: "8px", padding: "8px", minWidth: 0 }}>
          {/* LEFT: NOVA AI TILE */}
          <div style={{
            flex: 1, background: "#111", border: `2px solid ${isAISpeaking ? "#bcff5f" : "#1f1f1f"}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden", transition: "border-color 0.3s ease",
          }}>
            {/* Grid bg */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgba(188,255,95,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(188,255,95,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

            {/* Expanding rings when speaking */}
            {isAISpeaking && [0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", width: "200px", height: "200px", border: "2px solid rgba(188,255,95,0.2)", animation: `rout 2s ease-out ${i * 0.6}s infinite`, pointerEvents: "none" }} />
            ))}

            {/* AI ORB */}
            <div style={{
              width: "140px", height: "140px", background: "#0e0e0e",
              border: `4px solid ${isAISpeaking ? "#bcff5f" : "#00ffff"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: isAISpeaking ? "ospeak 1.2s ease-in-out infinite" : "oidle 3s ease-in-out infinite",
              transition: "border-color 0.3s ease", position: "relative", zIndex: 2,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "64px", color: isAISpeaking ? "#bcff5f" : "#00ffff", fontVariationSettings: "'FILL' 1", transition: "color 0.3s ease" }}>smart_toy</span>
            </div>

            {/* Labels */}
            <div style={{ position: "absolute", bottom: "12px", left: "12px", zIndex: 3 }}>
              <div style={{ padding: "4px 10px", background: "rgba(0,0,0,0.8)", border: "1px solid #333", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#bcff5f", fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                NOVA
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "12px", right: "12px", zIndex: 3 }}>
              <div style={{
                padding: "4px 10px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
                background: isAISpeaking ? "rgba(188,255,95,0.15)" : "rgba(0,255,255,0.1)",
                color: isAISpeaking ? "#bcff5f" : "#00ffff",
                border: `1px solid ${isAISpeaking ? "rgba(188,255,95,0.3)" : "rgba(0,255,255,0.2)"}`,
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                <div style={{ width: "5px", height: "5px", background: isAISpeaking ? "#bcff5f" : "#00ffff", animation: "glow-pulse 1s ease-in-out infinite" }} />
                {isAISpeaking ? "SPEAKING" : "LISTENING"}
              </div>
            </div>

            {/* Speaking text */}
            {isAISpeaking && currentAIText && (
              <div style={{ position: "absolute", bottom: "48px", left: "12px", right: "12px", padding: "10px 14px", background: "rgba(0,0,0,0.85)", border: "1px solid rgba(188,255,95,0.2)", fontSize: "12px", color: "#ccc", lineHeight: 1.5, zIndex: 3, maxHeight: "80px", overflow: "hidden" }}>
                {currentAIText.slice(-200)}
              </div>
            )}
          </div>

          {/* RIGHT: USER TILE */}
          <div style={{
            flex: 1, background: "#111", border: `2px solid ${!isAISpeaking && !isMuted ? "#00ffff" : "#1f1f1f"}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden", transition: "border-color 0.3s ease",
          }}>
            {/* User avatar */}
            <div style={{ width: "100px", height: "100px", background: "#1f1f1f", border: "4px solid #484848", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#757575", fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>

            {/* User waveform */}
            {!isAISpeaking && !isMuted && (
              <div style={{ position: "absolute", bottom: "48px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "flex-end", gap: "2px", height: "30px", zIndex: 2 }}>
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} style={{ width: "3px", background: "#00ffff", animation: `vbar ${0.3 + Math.random() * 0.4}s ease-in-out ${i * 0.05}s infinite`, transformOrigin: "bottom" }} />
                ))}
              </div>
            )}

            {/* Name label */}
            <div style={{ position: "absolute", bottom: "12px", left: "12px", zIndex: 3 }}>
              <div style={{ padding: "4px 10px", background: "rgba(0,0,0,0.8)", border: "1px solid #333", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#00ffff", fontVariationSettings: "'FILL' 1" }}>person</span>
                {candidateName.toUpperCase()}
              </div>
            </div>

            {isMuted && (
              <div style={{ position: "absolute", bottom: "12px", right: "12px", zIndex: 3 }}>
                <div style={{ padding: "4px 10px", background: "rgba(255,115,81,0.15)", color: "#ff7351", border: "1px solid rgba(255,115,81,0.3)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>mic_off</span> MUTED
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── TRANSCRIPT SIDEBAR ─── */}
        {showTranscript && (
          <div style={{ width: "320px", borderLeft: "1px solid #1a1a1a", background: "#0a0a0a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#bcff5f" }}>LIVE TRANSCRIPT</span>
              <span style={{ fontSize: "10px", color: "#484848" }}>{transcript.length} MSG</span>
            </div>
            <div ref={transcriptRef} style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {transcript.length === 0 && !currentAIText && (
                <div style={{ textAlign: "center", padding: "32px 12px", color: "#333", fontSize: "11px", textTransform: "uppercase" }}>
                  CONVERSATION WILL APPEAR HERE
                </div>
              )}
              {transcript.map((entry, i) => (
                <div key={i} style={{ padding: "8px 10px", borderLeft: `3px solid ${entry.role === "ai" ? "#bcff5f" : "#00ffff"}`, background: entry.role === "ai" ? "rgba(188,255,95,0.03)" : "rgba(0,255,255,0.03)" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", color: entry.role === "ai" ? "#bcff5f" : "#00ffff" }}>
                    {entry.role === "ai" ? "NOVA" : "YOU"}
                  </div>
                  <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#999", margin: 0 }}>{entry.text}</p>
                </div>
              ))}
              {isAISpeaking && currentAIText && (
                <div style={{ padding: "8px 10px", borderLeft: "3px solid #bcff5f", background: "rgba(188,255,95,0.03)", opacity: 0.6 }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#bcff5f", marginBottom: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                    NOVA <span style={{ animation: "glow-pulse 1s infinite" }}>●</span>
                  </div>
                  <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#999", margin: 0 }}>{currentAIText}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM CONTROLS ─── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", gap: "12px", borderTop: "1px solid #1a1a1a", flexShrink: 0, zIndex: 10 }}>
        <button onClick={toggleMute} style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: isMuted ? "#ff7351" : "#1f1f1f",
          border: `2px solid ${isMuted ? "#ff7351" : "#333"}`,
          color: isMuted ? "#000" : "#fff",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease",
          animation: !isMuted ? "mglow 2s ease-in-out infinite" : "none",
        }} title={isMuted ? "Unmute" : "Mute"}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>
            {isMuted ? "mic_off" : "mic"}
          </span>
        </button>

        <button onClick={() => setShowTranscript(!showTranscript)} style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: showTranscript ? "rgba(188,255,95,0.1)" : "#1f1f1f",
          border: `2px solid ${showTranscript ? "#bcff5f" : "#333"}`,
          color: showTranscript ? "#bcff5f" : "#757575",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease",
        }} title="Toggle transcript">
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>chat</span>
        </button>

        <button onClick={handleEnd} disabled={isEnding} style={{
          height: "52px", padding: "0 28px", borderRadius: "26px",
          background: "#ff3b30", border: "none", color: "#fff",
          fontWeight: 800, fontSize: "13px", textTransform: "uppercase",
          cursor: isEnding ? "wait" : "pointer",
          display: "flex", alignItems: "center", gap: "8px",
          fontFamily: "'Space Grotesk', sans-serif",
          opacity: isEnding ? 0.6 : 1,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>call_end</span>
          {isEnding ? "ENDING..." : "END INTERVIEW"}
        </button>
      </div>
    </div>
  );
}
