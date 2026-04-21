"use client";

import { useEffect, useCallback, useState } from "react";
import { useInterviewStore } from "@/store/useInterviewStore";
import { useVoice } from "@/hooks/useVoice";
import AudioVisualizer from "./AudioVisualizer";
import TranscriptDisplay from "./TranscriptDisplay";

export default function InterviewRoom() {
  const store = useInterviewStore();
  const { startInterview, endInterview, toggleMute, interruptAudio } = useVoice();
  const [nameInput, setNameInput] = useState("");

  // Timer
  useEffect(() => {
    if (store.status !== "active" || !store.startTime) return;

    const interval = setInterval(() => {
      store.setElapsed(Math.floor((Date.now() - store.startTime!) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [store.status, store.startTime]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleStart = useCallback(() => {
    store.reset();
    store.setCandidateName(nameInput || "Anonymous");
    startInterview();
  }, [nameInput, store, startInterview]);

  // Idle / Name input state
  if (store.status === "idle" || store.status === "error") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 72px)",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        {/* Floating orb background */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(108, 99, 255, 0.15), transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
          className="animate-float"
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              margin: "0 auto 32px",
              boxShadow: "0 0 60px rgba(108, 99, 255, 0.3)",
            }}
          >
            ◈
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              marginBottom: "12px",
            }}
          >
            Ready for your <span className="gradient-text">Interview</span>?
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              maxWidth: "480px",
              lineHeight: 1.6,
              marginBottom: "40px",
            }}
          >
            Nova, your AI interviewer, will evaluate your communication and
            teaching skills through a natural voice conversation.
          </p>

          {/* Name input */}
          <div style={{ marginBottom: "32px" }}>
            <input
              type="text"
              placeholder="Enter your name (optional)"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                width: "320px",
                maxWidth: "100%",
                padding: "14px 24px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--accent-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-subtle)")
              }
            />
          </div>

          {/* Start button */}
          <button
            className="btn-primary"
            onClick={handleStart}
            style={{ fontSize: "18px", padding: "16px 48px" }}
          >
            🎤 Start Interview
          </button>

          {/* Error */}
          {store.error && (
            <div
              style={{
                marginTop: "24px",
                padding: "12px 24px",
                borderRadius: "12px",
                background: "rgba(255, 107, 107, 0.1)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                color: "var(--accent-warning)",
                fontSize: "14px",
                maxWidth: "480px",
              }}
            >
              ⚠️ {store.error}
            </div>
          )}

          {/* Info cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "60px",
              maxWidth: "700px",
            }}
          >
            {[
              { icon: "🎯", title: "5–7 Questions", desc: "Natural conversation flow" },
              { icon: "🧠", title: "AI Evaluation", desc: "5 skill dimensions scored" },
              { icon: "⏱️", title: "~10 Minutes", desc: "Quick & comprehensive" },
            ].map((item) => (
              <div key={item.title} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Connecting state
  if (store.status === "connecting") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 72px)",
          gap: "24px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "3px solid var(--border-subtle)",
            borderTopColor: "var(--accent-primary)",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
          Connecting to Nova...
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Setting up voice connection & microphone
        </p>
      </div>
    );
  }

  // Evaluating state
  if (store.status === "evaluating") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 72px)",
          gap: "24px",
        }}
      >
        <div className="animate-glow-pulse"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
          }}
        >
          🧠
        </div>
        <p style={{ fontSize: "20px", fontWeight: 600 }}>Evaluating your interview...</p>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          AI is analyzing your responses across 5 dimensions
        </p>
        <div className="animate-shimmer" style={{ width: "200px", height: "4px", borderRadius: "2px", background: "var(--bg-card)" }} />
      </div>
    );
  }

  // Active interview
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 72px)",
        position: "relative",
      }}
    >
      {/* Top bar */}
      <div
        className="glass-strong"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: store.status === "active" ? "#00d4aa" : "#ffa726",
              boxShadow: `0 0 10px ${store.status === "active" ? "#00d4aa" : "#ffa726"}`,
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>
            {store.status === "active" ? "Interview Active" : "Paused"}
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            with {store.candidateName || "Anonymous"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "monospace",
              color: "var(--accent-primary)",
            }}
          >
            {formatDuration(store.elapsed)}
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Q: {store.questionCount}
          </span>
        </div>
      </div>

      {/* Transcript area */}
      <TranscriptDisplay
        entries={store.transcript}
        currentAIText={store.currentAIText}
        isAISpeaking={store.isAISpeaking}
      />

      {/* AI Speaking visualizer */}
      {store.isAISpeaking && (
        <div
          style={{
            padding: "8px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <AudioVisualizer isActive={true} color="var(--accent-primary)" />
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
            NOVA IS SPEAKING
          </span>
        </div>
      )}

      {/* Bottom controls */}
      <div
        className="glass-strong"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          gap: "20px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {/* Mute button */}
        <button
          onClick={toggleMute}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "1px solid var(--border-subtle)",
            background: store.isMuted ? "rgba(255, 107, 107, 0.15)" : "var(--bg-card)",
            color: store.isMuted ? "var(--accent-warning)" : "var(--text-primary)",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          title={store.isMuted ? "Unmute" : "Mute"}
        >
          {store.isMuted ? "🔇" : "🎤"}
        </button>

        {/* Main mic indicator */}
        <div style={{ position: "relative" }}>
          <div
            className={`mic-button ${store.status === "active" && !store.isMuted ? "active" : ""} ${store.isMuted ? "muted" : ""}`}
            style={{ width: "80px", height: "80px", cursor: "default" }}
          >
            {store.status === "active" && !store.isMuted && (
              <>
                <div className="ring" />
                <div className="ring" />
              </>
            )}
            <span style={{ fontSize: "28px", zIndex: 2, position: "relative" }}>
              {store.isMuted ? "🔇" : "🎙️"}
            </span>
          </div>
        </div>

        {/* Stop/Interrupt buttons */}
        {store.isAISpeaking && (
          <button
            onClick={interruptAudio}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 167, 38, 0.3)",
              background: "rgba(255, 167, 38, 0.15)",
              color: "#ffa726",
              cursor: "pointer",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            title="Interrupt AI"
          >
            ⏸
          </button>
        )}

        <button
          className="btn-danger"
          onClick={endInterview}
          style={{
            padding: "12px 24px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ⏹ End Interview
        </button>
      </div>
    </div>
  );
}
