"use client";

import { useInterviewStore } from "@/store/useInterviewStore";
import ScoreCard from "./ScoreCard";
import Link from "next/link";

export default function ResultsPanel() {
  const evaluation = useInterviewStore((s) => s.evaluation);
  const transcript = useInterviewStore((s) => s.transcript);
  const elapsed = useInterviewStore((s) => s.elapsed);
  const questionCount = useInterviewStore((s) => s.questionCount);
  const candidateName = useInterviewStore((s) => s.candidateName);
  const reset = useInterviewStore((s) => s.reset);

  if (!evaluation) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getOverallGrade = (score: number) => {
    if (score >= 9) return { grade: "A+", color: "#00d4aa" };
    if (score >= 8) return { grade: "A", color: "#00d4aa" };
    if (score >= 7) return { grade: "B+", color: "#6c63ff" };
    if (score >= 6) return { grade: "B", color: "#6c63ff" };
    if (score >= 5) return { grade: "C", color: "#ffa726" };
    return { grade: "D", color: "#ff6b6b" };
  };

  const { grade, color } = getOverallGrade(evaluation.overallScore);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
        }}
        className="animate-fade-in-up"
      >
        <div
          style={{
            fontSize: "14px",
            color: "var(--accent-secondary)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Interview Complete
        </div>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            marginBottom: "8px",
          }}
        >
          Results for{" "}
          <span className="gradient-text">{candidateName || "Anonymous"}</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          {formatDuration(elapsed)} · {questionCount} questions · Evaluated by GPT-4o
        </p>
      </div>

      {/* Overall Score */}
      <div
        className="glass animate-scale-in"
        style={{
          textAlign: "center",
          padding: "48px",
          borderRadius: "var(--radius-xl)",
          marginBottom: "32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at center, ${color}10, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Overall Score
          </div>
          <div
            style={{
              fontSize: "80px",
              fontWeight: 900,
              fontFamily: "'Outfit', sans-serif",
              color,
              lineHeight: 1,
            }}
          >
            {evaluation.overallScore}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color,
              marginTop: "4px",
              opacity: 0.8,
            }}
          >
            Grade: {grade}
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div
        style={{
          display: "grid",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <ScoreCard icon="💎" label="Clarity" score={evaluation.clarity} delay={100} />
        <ScoreCard icon="🌱" label="Patience" score={evaluation.patience} delay={200} />
        <ScoreCard icon="🗣️" label="Fluency" score={evaluation.fluency} delay={300} />
        <ScoreCard icon="🤗" label="Warmth" score={evaluation.warmth} delay={400} />
        <ScoreCard icon="✨" label="Simplicity" score={evaluation.simplicity} delay={500} />
      </div>

      {/* Summary */}
      <div
        className="card"
        style={{ marginBottom: "24px", animation: "fadeInUp 0.5s ease-out 0.3s both" }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          📝 Summary
        </h3>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          {evaluation.summary}
        </p>
      </div>

      {/* Strengths & Improvements */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Strengths */}
        <div className="card" style={{ animation: "fadeInUp 0.5s ease-out 0.4s both" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            💪 Strengths
          </h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {evaluation.strengths?.map((s, i) => (
              <li
                key={i}
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: "var(--accent-secondary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="card" style={{ animation: "fadeInUp 0.5s ease-out 0.5s both" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            🎯 Areas for Improvement
          </h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {evaluation.improvements?.map((imp, i) => (
              <li
                key={i}
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: "#ffa726", fontWeight: 700, flexShrink: 0 }}>→</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evidence */}
      {evaluation.evidence && evaluation.evidence.length > 0 && (
        <div className="card" style={{ marginBottom: "32px", animation: "fadeInUp 0.5s ease-out 0.6s both" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            🔍 Key Evidence
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {evaluation.evidence.map((ev, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "rgba(108, 99, 255, 0.05)",
                  borderLeft: "3px solid var(--accent-primary)",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                &ldquo;{ev}&rdquo;
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      <details
        className="card"
        style={{ marginBottom: "32px" }}
      >
        <summary
          style={{
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 700,
            padding: "4px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-primary)",
          }}
        >
          💬 Full Transcript ({transcript.length} messages)
        </summary>
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {transcript.map((entry, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: entry.role === "ai" ? "rgba(108, 99, 255, 0.05)" : "rgba(0, 212, 170, 0.05)",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "11px", textTransform: "uppercase" }}>
                {entry.role === "ai" ? "🤖 Nova" : "👤 You"}:
              </span>{" "}
              {entry.text}
            </div>
          ))}
        </div>
      </details>

      {/* Actions */}
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          className="btn-primary"
          onClick={reset}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          🔄 New Interview
        </button>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            📊 View Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
