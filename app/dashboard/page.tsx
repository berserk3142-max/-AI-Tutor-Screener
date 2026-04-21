"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface InterviewRecord {
  id: string; candidateName: string; overallScore: number;
  clarity: number; patience: number; fluency: number; warmth: number; simplicity: number;
  summary: string; duration: number; questionCount: number; status: string; createdAt: string;
}

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchInterviews(); }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/interviews");
      if (res.ok) { const data = await res.json(); setInterviews(data); }
    } catch (err) { console.error("Failed to fetch:", err); }
    finally { setLoading(false); }
  };

  const filteredInterviews = interviews.filter((i) => {
    const matchesSearch = i.candidateName?.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if (filter === "high") matchesFilter = (i.overallScore || 0) >= 8;
    else if (filter === "medium") matchesFilter = (i.overallScore || 0) >= 5 && (i.overallScore || 0) < 8;
    else if (filter === "low") matchesFilter = (i.overallScore || 0) < 5;
    return matchesSearch && matchesFilter;
  });

  const getScoreColor = (s: number) => {
    if (s >= 8) return "#bcff5f";
    if (s >= 6) return "#00ffff";
    if (s >= 4) return "#ff51fa";
    return "#ff7351";
  };

  const getGrade = (s: number) => {
    if (s >= 9) return "A+"; if (s >= 8) return "A"; if (s >= 7) return "B+";
    if (s >= 6) return "B"; if (s >= 5) return "C"; return "D";
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const formatDuration = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  const total = interviews.length;
  const avg = total > 0 ? (interviews.reduce((s, i) => s + (i.overallScore || 0), 0) / total).toFixed(1) : "—";
  const top = interviews.filter((i) => (i.overallScore || 0) >= 8).length;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <span style={{ color: "#ff51fa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", borderLeft: "4px solid #ff51fa", paddingLeft: "8px" }}>03 // COMMAND_CENTER</span>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase", marginTop: "8px", textShadow: "4px 4px 0px #bcff5f" }}>
          RECRUITER DASHBOARD
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "TOTAL_INTERVIEWS", value: total.toString(), icon: "assignment", color: "#bcff5f" },
          { label: "AVG_SCORE", value: avg, icon: "star", color: "#00ffff" },
          { label: "TOP_PERFORMERS", value: top.toString(), icon: "emoji_events", color: "#ff51fa" },
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

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
        <input type="text" placeholder="SEARCH_BY_NAME..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: "200px", padding: "10px 16px", border: "4px solid #484848", background: "#191919", color: "#fff", fontSize: "13px", outline: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#bcff5f"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#484848"; }}
        />
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "10px 16px", border: `4px solid ${filter === f ? "#bcff5f" : "#484848"}`, background: filter === f ? "rgba(188,255,95,0.1)" : "transparent", color: filter === f ? "#bcff5f" : "#757575", fontSize: "11px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.15s ease" }}>
            {f === "all" ? "ALL" : f === "high" ? "8+" : f === "medium" ? "5-7" : "<5"}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#757575" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#bcff5f", display: "block", marginBottom: "16px", animation: "glow-pulse 2s ease-in-out infinite", fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
          LOADING_DATA...
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "#bcff5f", display: "block", marginBottom: "16px", fontVariationSettings: "'FILL' 1" }}>inbox</span>
          <p style={{ color: "#ababab", fontSize: "16px", marginBottom: "8px", textTransform: "uppercase" }}>
            {interviews.length === 0 ? "NO_INTERVIEWS_FOUND" : "NO_MATCHES"}
          </p>
          {interviews.length === 0 && (
            <Link href="/interview" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>mic</span>
                INIT_FIRST_SESSION
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredInterviews.map((interview, index) => (
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
  );
}
