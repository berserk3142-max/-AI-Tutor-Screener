"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import RoleGuard from "@/components/auth/RoleGuard";
import AppShell from "@/components/layout/AppShell";
import InviteModal from "@/components/dashboard/InviteModal";
import { getScoreColor, getGrade, formatDate, formatDuration } from "@/lib/utils";
import { generateInterviewPDF } from "@/lib/pdf";

const AnalyticsPanel = dynamic(() => import("@/components/dashboard/AnalyticsPanel"), { ssr: false });

interface InterviewRecord {
  id: string;
  candidateName: string;
  userId?: string;
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
  tags?: string[];
  recruiterNotes?: string;
}

const TAG_COLORS: Record<string, string> = {
  SHORTLISTED: "#bcff5f",
  REJECTED: "#ff7351",
  ON_HOLD: "#ff51fa",
  NEEDS_REVIEW: "#00ffff",
  TOP_PICK: "#ffd700",
};

function DashboardContent() {
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"interviews" | "analytics">("interviews");
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => { fetchInterviews(); }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/interviews");
      if (res.ok) setInterviews(await res.json());
    } catch (err) { console.error("Failed to fetch:", err); }
    finally { setLoading(false); }
  };

  const handleDownloadPDF = (iv: InterviewRecord, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    generateInterviewPDF(iv);
    toast.success("📄 PDF_EXPORTED — Report downloaded");
  };

  const filteredInterviews = interviews.filter((i) => {
    const matchesSearch = i.candidateName?.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if (filter === "high") matchesFilter = (i.overallScore || 0) >= 8;
    else if (filter === "medium") matchesFilter = (i.overallScore || 0) >= 5 && (i.overallScore || 0) < 8;
    else if (filter === "low") matchesFilter = (i.overallScore || 0) < 5;
    const matchesTag = tagFilter === "all" || (i.tags && i.tags.includes(tagFilter));
    return matchesSearch && matchesFilter && matchesTag;
  });

  const total = interviews.length;
  const avg = total > 0 ? (interviews.reduce((s, i) => s + (i.overallScore || 0), 0) / total).toFixed(1) : "—";
  const top = interviews.filter((i) => (i.overallScore || 0) >= 8).length;

  return (
    <>
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ color: "#ff51fa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", borderLeft: "4px solid #ff51fa", paddingLeft: "8px" }}>03 // COMMAND_CENTER</span>
          <span style={{ background: "rgba(255,81,250,0.1)", color: "#ff51fa", padding: "2px 10px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", border: "2px solid rgba(255,81,250,0.3)" }}>🔒 RECRUITER ONLY</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase", marginTop: "8px", textShadow: "4px 4px 0px #bcff5f" }}>RECRUITER DASHBOARD</h1>
          <button onClick={() => setInviteOpen(true)} style={{ padding: "12px 24px", background: "#bcff5f", color: "#000", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", border: "4px solid #000", cursor: "pointer", boxShadow: "4px 4px 0px 0px #ff51fa", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Space Grotesk',sans-serif", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px 0px #ff51fa"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0px 0px #ff51fa"; }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>person_add</span>
            INVITE CANDIDATE
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "0", marginBottom: "32px" }}>
        {(["interviews", "analytics"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "12px 24px", border: "4px solid #000",
            background: activeTab === tab ? "#bcff5f" : "#191919",
            color: activeTab === tab ? "#000" : "#757575",
            fontSize: "13px", fontWeight: 900, textTransform: "uppercase",
            letterSpacing: "0.05em", cursor: "pointer",
            borderRight: tab === "interviews" ? "none" : "4px solid #000",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
              {tab === "interviews" ? "assignment" : "analytics"}
            </span>
            {tab}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === "analytics" && <AnalyticsPanel interviews={interviews} />}

      {/* Interviews Tab */}
      {activeTab === "interviews" && (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
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
              onFocus={(e) => { e.currentTarget.style.borderColor = "#bcff5f"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#484848"; }}
            />
            {(["all", "high", "medium", "low"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "10px 16px", border: `4px solid ${filter === f ? "#bcff5f" : "#484848"}`,
                background: filter === f ? "rgba(188,255,95,0.1)" : "transparent",
                color: filter === f ? "#bcff5f" : "#757575", fontSize: "11px", fontWeight: 800,
                cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                {f === "all" ? "ALL" : f === "high" ? "8+" : f === "medium" ? "5-7" : "<5"}
              </button>
            ))}
            {/* Tag Filter */}
            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} style={{
              padding: "10px 16px", border: "4px solid #484848", background: "#191919", color: "#ababab",
              fontSize: "11px", fontWeight: 800, textTransform: "uppercase", cursor: "pointer", outline: "none",
            }}>
              <option value="all">ALL TAGS</option>
              {Object.keys(TAG_COLORS).map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
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
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredInterviews.map((interview, index) => (
                <Link key={interview.id} href={`/results/${interview.id}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{
                    display: "grid", gridTemplateColumns: "auto 1fr auto auto",
                    alignItems: "center", gap: "20px", padding: "16px 24px", cursor: "pointer",
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`, boxShadow: "4px 4px 0px 0px #bcff5f",
                  }}>
                    {/* Score */}
                    <div style={{ width: "56px", height: "56px", background: `${getScoreColor(interview.overallScore || 0)}15`, border: `4px solid ${getScoreColor(interview.overallScore || 0)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "20px", fontWeight: 900, color: getScoreColor(interview.overallScore || 0), lineHeight: 1 }}>{interview.overallScore || "—"}</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: getScoreColor(interview.overallScore || 0), opacity: 0.7 }}>{getGrade(interview.overallScore || 0)}</span>
                    </div>
                    {/* Info */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, textTransform: "uppercase" }}>{interview.candidateName || "ANONYMOUS"}</span>
                        {/* Tag badges */}
                        {interview.tags && interview.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: "8px", fontWeight: 800, padding: "2px 6px", background: `${TAG_COLORS[tag] || "#484848"}20`, color: TAG_COLORS[tag] || "#ababab", border: `2px solid ${TAG_COLORS[tag] || "#484848"}`, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tag}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "#757575", textTransform: "uppercase" }}>
                        <span>{formatDate(interview.createdAt)}</span>
                        {interview.duration > 0 && <span>⏱ {formatDuration(interview.duration)}</span>}
                        {interview.questionCount > 0 && <span>{interview.questionCount}Q</span>}
                      </div>
                      {interview.summary && <p style={{ fontSize: "12px", color: "#ababab", marginTop: "6px", lineHeight: 1.5, maxWidth: "500px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{interview.summary}</p>}
                    </div>
                    {/* Dimension scores */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[{ l: "C", v: interview.clarity }, { l: "P", v: interview.patience }, { l: "F", v: interview.fluency }, { l: "W", v: interview.warmth }, { l: "S", v: interview.simplicity }].map((s) => (
                        <div key={s.l} style={{ textAlign: "center", fontSize: "11px" }}>
                          <div style={{ color: "#757575", fontWeight: 700, marginBottom: "2px" }}>{s.l}</div>
                          <div style={{ color: getScoreColor(s.v || 0), fontWeight: 800 }}>{s.v || "—"}</div>
                        </div>
                      ))}
                    </div>
                    {/* PDF button */}
                    <button onClick={(e) => handleDownloadPDF(interview, e)} title="Download PDF"
                      style={{ width: "36px", height: "36px", background: "transparent", border: "2px solid #484848", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bcff5f"; e.currentTarget.style.background = "rgba(188,255,95,0.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#484848"; e.currentTarget.style.background = "transparent"; }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#bcff5f" }}>download</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>

    {/* Invite Modal */}
    <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <RoleGuard allowedRoles={["recruiter"]} fallbackMessage="RECRUITER_ACCESS_REQUIRED">
        <DashboardContent />
      </RoleGuard>
    </AppShell>
  );
}
