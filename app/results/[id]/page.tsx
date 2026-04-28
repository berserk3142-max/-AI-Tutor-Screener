"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import ScoreCard from "@/components/ScoreCard";
import AppShell from "@/components/layout/AppShell";
import TagsNotesPanel from "@/components/dashboard/TagsNotesPanel";
import AudioPlayer from "@/components/interview/AudioPlayer";

const GeneratePDF = dynamic(() => import("@/lib/pdf").then((m) => ({ default: () => { m.generateInterviewPDF; return null; } })), { ssr: false });
// We import generateInterviewPDF directly for the click handler
import { generateInterviewPDF } from "@/lib/pdf";

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
  tags?: string[];
  recruiterNotes?: string;
  audioUrl?: string;
}

export default function ResultDetailPage() {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const isRecruiter = isLoaded && (user?.publicMetadata as { role?: string })?.role === "recruiter";

  useEffect(() => {
    if (params.id) {
      fetch(`/api/interviews/${params.id}`)
        .then((r) => r.json())
        .then(setInterview)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const handlePDF = () => {
    if (!interview) return;
    generateInterviewPDF(interview);
    toast.success("📄 PDF_EXPORTED — Report downloaded");
  };

  if (loading) {
    return (
      <AppShell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 72px)" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </AppShell>
    );
  }

  if (!interview) {
    return (
      <AppShell>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 72px)", gap: "16px" }}>
          <div style={{ fontSize: "48px" }}>🔍</div>
          <p style={{ color: "var(--text-secondary)" }}>Interview not found</p>
          <Link href="/dashboard" style={{ textDecoration: "none" }}><button className="btn-primary">← Back to Dashboard</button></Link>
        </div>
      </AppShell>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#bcff5f";
    if (score >= 6) return "#00ffff";
    if (score >= 4) return "#ff51fa";
    return "#ff7351";
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
    <AppShell>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <Link href="/dashboard" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>← Back to Dashboard</Link>
          <button onClick={handlePDF} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
            background: "#bcff5f", color: "#000", fontWeight: 800, fontSize: "12px",
            textTransform: "uppercase", letterSpacing: "0.05em", border: "4px solid #000",
            cursor: "pointer", boxShadow: "4px 4px 0px 0px #ff51fa", transition: "all 0.15s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px 0px #ff51fa"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px 0px #ff51fa"; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
            DOWNLOAD PDF
          </button>
        </div>

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
            <div style={{ fontSize: "80px", fontWeight: 900, fontFamily: "'Outfit', sans-serif", color, lineHeight: 1 }}>{interview.overallScore || "—"}</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color, marginTop: "4px", opacity: 0.8 }}>Grade: {getGrade(interview.overallScore || 0)}</div>
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

        {/* Audio Player */}
        {interview.audioUrl && (
          <div style={{ marginBottom: "24px" }}>
            <AudioPlayer audioUrl={interview.audioUrl} />
          </div>
        )}

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
                    <span style={{ color: "var(--accent-secondary)", fontWeight: 700, flexShrink: 0 }}>✓</span>{s}
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
                    <span style={{ color: "#ffa726", fontWeight: 700, flexShrink: 0 }}>→</span>{imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Evidence */}
        {interview.evidence && interview.evidence.length > 0 && (
          <div className="card" style={{ marginBottom: "24px" }}>
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

        {/* Recruiter Tags & Notes */}
        {isRecruiter && (
          <div style={{ marginBottom: "24px" }}>
            <TagsNotesPanel interviewId={interview.id} initialTags={interview.tags || []} initialNotes={interview.recruiterNotes || ""} />
          </div>
        )}

        {/* Transcript */}
        {interview.transcript && (
          <details className="card" style={{ marginBottom: "32px" }}>
            <summary style={{ cursor: "pointer", fontSize: "16px", fontWeight: 700, padding: "4px 0", color: "var(--text-primary)" }}>💬 Full Transcript</summary>
            <div style={{ marginTop: "16px", whiteSpace: "pre-wrap", fontSize: "13px", lineHeight: 1.8, color: "var(--text-secondary)" }}>{interview.transcript}</div>
          </details>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link href="/interview" style={{ textDecoration: "none" }}><button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>🎤 New Interview</button></Link>
          <Link href="/dashboard" style={{ textDecoration: "none" }}><button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>📊 Dashboard</button></Link>
          <button onClick={handlePDF} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>📄 Download PDF</button>
        </div>
      </div>
      {/* Hidden: preload PDF module */}
      <GeneratePDF />
    </AppShell>
  );
}
