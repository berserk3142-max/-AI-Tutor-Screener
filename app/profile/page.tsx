"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getScoreColor, getGrade, formatDate, formatDuration } from "@/lib/utils";
import AppShell from "@/components/layout/AppShell";

interface InterviewRecord {
  id: string;
  candidateName: string;
  overallScore: number;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  summary: string;
  duration: number;
  questionCount: number;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyInterviews();
  }, []);

  const fetchMyInterviews = async () => {
    try {
      const res = await fetch("/api/interviews");
      if (res.ok) {
        const data = await res.json();
        setInterviews(data);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = interviews.length;
  const avg =
    total > 0
      ? (
          interviews.reduce((s, i) => s + (i.overallScore || 0), 0) / total
        ).toFixed(1)
      : "—";
  const bestScore = total > 0
    ? Math.max(...interviews.map((i) => i.overallScore || 0))
    : 0;

  if (!isLoaded) {
    return (
      <AppShell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ width: "60px", height: "60px", background: "#191919", border: "4px solid #bcff5f", display: "flex", alignItems: "center", justifyContent: "center", animation: "glow-pulse 2s ease-in-out infinite" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#bcff5f", fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
        </div>
      </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <span style={{ color: "#00ffff", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", borderLeft: "4px solid #00ffff", paddingLeft: "8px" }}>
          04 // USER_PROFILE
        </span>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase", marginTop: "8px" }}>
          YOUR <span style={{ color: "#bcff5f" }}>PROFILE</span>
        </h1>
      </div>

      {/* User Info Card */}
      <div
        style={{
          background: "#191919",
          border: "4px solid #000",
          padding: "32px",
          marginBottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          boxShadow: "8px 8px 0px 0px #bcff5f",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#0e0e0e",
            border: "4px solid #bcff5f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "40px",
                color: "#bcff5f",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              person
            </span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              marginBottom: "4px",
            }}
          >
            {user?.fullName || "ANONYMOUS"}
          </h2>
          <div
            style={{
              fontSize: "13px",
              color: "#757575",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#00ffff" }}>mail</span>
              {user?.primaryEmailAddress?.emailAddress || "—"}
            </span>
            <span style={{ color: "#333" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#bcff5f" }}>verified_user</span>
              <span style={{ color: "#bcff5f", fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>
                {(user?.publicMetadata as { role?: string })?.role || "CANDIDATE"}
              </span>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "8px", height: "8px", background: "#bcff5f", animation: "glow-pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: "10px", color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>ACTIVE</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "TOTAL_INTERVIEWS", value: total.toString(), icon: "assignment", color: "#bcff5f" },
          { label: "AVG_SCORE", value: avg, icon: "star", color: "#00ffff" },
          { label: "BEST_SCORE", value: bestScore > 0 ? bestScore.toString() : "—", icon: "emoji_events", color: "#ff51fa" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "10px", color: "#757575", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>{s.label}</div>
              <div style={{ fontSize: "36px", fontWeight: 900, color: s.color, letterSpacing: "-0.05em" }}>{s.value}</div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: "36px", color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Section title */}
      <div style={{ marginBottom: "24px" }}>
        <span style={{ color: "#ff51fa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", borderLeft: "4px solid #ff51fa", paddingLeft: "8px" }}>
          INTERVIEW_HISTORY
        </span>
      </div>

      {/* Interview list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#757575" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#bcff5f", display: "block", marginBottom: "16px", animation: "glow-pulse 2s ease-in-out infinite", fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
          LOADING_DATA...
        </div>
      ) : interviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "#bcff5f", display: "block", marginBottom: "16px", fontVariationSettings: "'FILL' 1" }}>inbox</span>
          <p style={{ color: "#ababab", fontSize: "16px", marginBottom: "8px", textTransform: "uppercase" }}>
            NO_INTERVIEWS_YET
          </p>
          <p style={{ color: "#757575", fontSize: "13px", marginBottom: "24px" }}>
            Take your first interview with Nova to see results here.
          </p>
          <Link href="/interview" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>mic</span>
              START FIRST INTERVIEW
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {interviews.map((interview, index) => (
            <Link key={interview.id} href={`/results/${interview.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: "20px", padding: "16px 24px", cursor: "pointer", animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`, boxShadow: "4px 4px 0px 0px #bcff5f" }}>
                <div style={{ width: "56px", height: "56px", background: `${getScoreColor(interview.overallScore || 0)}15`, border: `4px solid ${getScoreColor(interview.overallScore || 0)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "20px", fontWeight: 900, color: getScoreColor(interview.overallScore || 0), lineHeight: 1 }}>{interview.overallScore || "—"}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: getScoreColor(interview.overallScore || 0), opacity: 0.7 }}>{getGrade(interview.overallScore || 0)}</span>
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px", textTransform: "uppercase" }}>{interview.candidateName || "ANONYMOUS"}</div>
                  <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "#757575", textTransform: "uppercase" }}>
                    <span>{formatDate(interview.createdAt)}</span>
                    {interview.duration > 0 && <span>⏱ {formatDuration(interview.duration)}</span>}
                    {interview.questionCount > 0 && <span>{interview.questionCount}Q</span>}
                  </div>
                  {interview.summary && <p style={{ fontSize: "12px", color: "#ababab", marginTop: "6px", lineHeight: 1.5, maxWidth: "500px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{interview.summary}</p>}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[{ l: "C", v: interview.clarity }, { l: "P", v: interview.patience }, { l: "F", v: interview.fluency }, { l: "W", v: interview.warmth }, { l: "S", v: interview.simplicity }].map((s) => (
                    <div key={s.l} style={{ textAlign: "center", fontSize: "11px" }}>
                      <div style={{ color: "#757575", fontWeight: 700, marginBottom: "2px" }}>{s.l}</div>
                      <div style={{ color: getScoreColor(s.v || 0), fontWeight: 800 }}>{s.v || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </AppShell>
  );
}
