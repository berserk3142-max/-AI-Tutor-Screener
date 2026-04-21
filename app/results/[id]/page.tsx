"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ScoreCard from "@/components/ScoreCard";

interface InterviewDetail {
  id: string;
  candidateName: string;
  transcript: string;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  overallScore: number;
  summary: string;
  evidence: string[];
  strengths: string[];
  improvements: string[];
  duration: number;
  questionCount: number;
  createdAt: string;
}

export default function ResultDetailPage() {
  const params = useParams();
  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/interviews/${params.id}`)
        .then((r) => r.json())
        .then(setInterview)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 72px)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 72px)", gap: "16px" }}>
        <div style={{ fontSize: "48px" }}>🔍</div>
        <p style={{ color: "var(--text-secondary)" }}>Interview not found</p>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button className="btn-primary">← Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#00d4aa";
    if (score >= 6) return "#6c63ff";
    if (score >= 4) return "#ffa726";
    return "#ff6b6b";
  };

  const getGrade = (score: number) => {
    if (score >= 9) return "A+";
    if (score >= 8) return "A";
    if (score >= 7) return "B+";
    if (score >= 6) return "B";
    if (score >= 5) return "C";
    return "D";
  };

  const color = getScoreColor(interview.overallScore || 0);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Back link */}
      <Link
        href="/dashboard"
        style={{
          color: "var(--text-muted)",
          textDecoration: "none",
          fontSize: "13px",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "32px",
          transition: "color 0.3s",
        }}
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }} className="animate-fade-in-up">
        <h1 style={{ fontSize: "32px", fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: "8px" }}>
          {interview.candidateName || "Anonymous"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          {new Date(interview.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          {interview.duration > 0 && ` · ${Math.floor(interview.duration / 60)}m ${interview.duration % 60}s`}
        </p>
      </div>

      {/* Overall Score */}
      <div className="glass animate-scale-in" style={{ textAlign: "center", padding: "48px", borderRadius: "var(--radius-xl)", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at center, ${color}10, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Overall Score</div>
          <div style={{ fontSize: "80px", fontWeight: 900, fontFamily: "'Outfit', sans-serif", color, lineHeight: 1 }}>
            {interview.overallScore || "—"}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color, marginTop: "4px", opacity: 0.8 }}>
            Grade: {getGrade(interview.overallScore || 0)}
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
        <ScoreCard icon="💎" label="Clarity" score={interview.clarity || 0} delay={100} />
        <ScoreCard icon="🌱" label="Patience" score={interview.patience || 0} delay={200} />
        <ScoreCard icon="🗣️" label="Fluency" score={interview.fluency || 0} delay={300} />
        <ScoreCard icon="🤗" label="Warmth" score={interview.warmth || 0} delay={400} />
        <ScoreCard icon="✨" label="Simplicity" score={interview.simplicity || 0} delay={500} />
      </div>

      {/* Summary */}
      {interview.summary && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>📝 Summary</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.8 }}>{interview.summary}</p>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {interview.strengths && interview.strengths.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>💪 Strengths</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {interview.strengths.map((s, i) => (
                <li key={i} style={{ fontSize: "14px", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "10px", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--accent-secondary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {interview.improvements && interview.improvements.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>🎯 Improvements</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {interview.improvements.map((imp, i) => (
                <li key={i} style={{ fontSize: "14px", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "10px", lineHeight: 1.6 }}>
                  <span style={{ color: "#ffa726", fontWeight: 700, flexShrink: 0 }}>→</span>
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Evidence */}
      {interview.evidence && interview.evidence.length > 0 && (
        <div className="card" style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>🔍 Key Evidence</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {interview.evidence.map((ev, i) => (
              <div key={i} style={{ padding: "12px 16px", borderRadius: "8px", background: "rgba(108, 99, 255, 0.05)", borderLeft: "3px solid var(--accent-primary)", fontSize: "13px", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                &ldquo;{ev}&rdquo;
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      {interview.transcript && (
        <details className="card" style={{ marginBottom: "32px" }}>
          <summary style={{ cursor: "pointer", fontSize: "16px", fontWeight: 700, padding: "4px 0", color: "var(--text-primary)" }}>
            💬 Full Transcript
          </summary>
          <div style={{ marginTop: "16px", whiteSpace: "pre-wrap", fontSize: "13px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
            {interview.transcript}
          </div>
        </details>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <Link href="/interview" style={{ textDecoration: "none" }}>
          <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>🎤 New Interview</button>
        </Link>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>📊 Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
