"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

interface InterviewRecord {
  id: string;
  candidateName: string;
  overallScore: number;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  duration: number;
  questionCount: number;
  createdAt: string;
}

interface AnalyticsPanelProps {
  interviews: InterviewRecord[];
}

const COLORS = {
  green: "#bcff5f",
  pink: "#ff51fa",
  cyan: "#00ffff",
  orange: "#ff7351",
  bg: "#191919",
  border: "#484848",
  muted: "#757575",
};

const PIE_COLORS = ["#bcff5f", "#ff51fa", "#00ffff", "#ff7351"];

export default function AnalyticsPanel({ interviews }: AnalyticsPanelProps) {
  // ─── Score Distribution (histogram) ───
  const scoreDistribution = useMemo(() => {
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: `${i + 1}`,
      count: 0,
    }));
    interviews.forEach((iv) => {
      const s = Math.min(10, Math.max(1, iv.overallScore || 1));
      buckets[s - 1].count++;
    });
    return buckets;
  }, [interviews]);

  // ─── Radar data (avg dimensions) ───
  const radarData = useMemo(() => {
    if (interviews.length === 0) return [];
    const avg = (key: keyof InterviewRecord) =>
      Number((interviews.reduce((s, i) => s + ((i[key] as number) || 0), 0) / interviews.length).toFixed(1));
    return [
      { dim: "Clarity", score: avg("clarity"), fullMark: 10 },
      { dim: "Patience", score: avg("patience"), fullMark: 10 },
      { dim: "Fluency", score: avg("fluency"), fullMark: 10 },
      { dim: "Warmth", score: avg("warmth"), fullMark: 10 },
      { dim: "Simplicity", score: avg("simplicity"), fullMark: 10 },
    ];
  }, [interviews]);

  // ─── Trend line (scores over time) ───
  const trendData = useMemo(() => {
    return [...interviews]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-20)
      .map((iv, i) => ({
        index: i + 1,
        score: iv.overallScore || 0,
        name: iv.candidateName?.slice(0, 10) || "Anon",
        date: new Date(iv.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }));
  }, [interviews]);

  // ─── Pass/Fail pie ───
  const passFailData = useMemo(() => {
    const pass = interviews.filter((i) => (i.overallScore || 0) >= 7).length;
    const fail = interviews.length - pass;
    return [
      { name: "PASS (≥7)", value: pass },
      { name: "FAIL (<7)", value: fail },
    ];
  }, [interviews]);

  // ─── Stats ───
  const stats = useMemo(() => {
    const total = interviews.length;
    const avg = total > 0
      ? (interviews.reduce((s, i) => s + (i.overallScore || 0), 0) / total).toFixed(1)
      : "—";
    const top = interviews.filter((i) => (i.overallScore || 0) >= 8).length;
    const thisWeek = interviews.filter((i) => {
      const d = new Date(i.createdAt);
      const now = new Date();
      return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
    }).length;
    const avgDuration = total > 0
      ? Math.round(interviews.reduce((s, i) => s + (i.duration || 0), 0) / total)
      : 0;
    return { total, avg, top, thisWeek, avgDuration };
  }, [interviews]);

  const tooltipStyle = {
    contentStyle: {
      background: "#0e0e0e",
      border: "4px solid #484848",
      borderRadius: "0",
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: "12px",
      color: "#fff",
      boxShadow: "4px 4px 0px 0px #bcff5f",
    },
    labelStyle: { color: COLORS.green, fontWeight: 700, textTransform: "uppercase" as const },
  };

  if (interviews.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "56px", color: COLORS.green, display: "block", marginBottom: "16px", fontVariationSettings: "'FILL' 1" }}>analytics</span>
        <p style={{ color: "#ababab", fontSize: "16px", textTransform: "uppercase" }}>NO_DATA_AVAILABLE</p>
        <p style={{ color: "#757575", fontSize: "13px", marginTop: "8px" }}>Complete some interviews to see analytics here.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "32px" }}>
        {[
          { label: "TOTAL", value: stats.total, icon: "assignment", color: COLORS.green },
          { label: "AVG_SCORE", value: stats.avg, icon: "star", color: COLORS.cyan },
          { label: "TOP_RATED", value: stats.top, icon: "emoji_events", color: COLORS.pink },
          { label: "THIS_WEEK", value: stats.thisWeek, icon: "date_range", color: COLORS.orange },
          { label: "AVG_TIME", value: `${Math.floor(stats.avgDuration / 60)}m`, icon: "timer", color: COLORS.green },
        ].map((s) => (
          <div key={s.label} style={{ background: "#191919", border: "4px solid #000", padding: "16px", boxShadow: `4px 4px 0px 0px ${s.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "9px", color: "#757575", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>{s.label}</div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: s.color, letterSpacing: "-0.05em" }}>{s.value}</div>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "24px", color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Score Distribution */}
        <div style={{ background: "#191919", border: "4px solid #000", padding: "24px", boxShadow: "4px 4px 0px 0px #bcff5f" }}>
          <div style={{ fontSize: "10px", color: COLORS.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", borderLeft: "4px solid " + COLORS.green, paddingLeft: "8px" }}>
            SCORE_DISTRIBUTION
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <XAxis dataKey="range" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill={COLORS.green} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div style={{ background: "#191919", border: "4px solid #000", padding: "24px", boxShadow: "4px 4px 0px 0px #ff51fa" }}>
          <div style={{ fontSize: "10px", color: COLORS.pink, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", borderLeft: "4px solid " + COLORS.pink, paddingLeft: "8px" }}>
            DIMENSION_AVERAGES
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="dim" tick={{ fill: COLORS.muted, fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fill: "#444", fontSize: 9 }} axisLine={false} />
              <Radar dataKey="score" stroke={COLORS.pink} fill={COLORS.pink} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Line */}
        <div style={{ background: "#191919", border: "4px solid #000", padding: "24px", boxShadow: "4px 4px 0px 0px #00ffff" }}>
          <div style={{ fontSize: "10px", color: COLORS.cyan, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", borderLeft: "4px solid " + COLORS.cyan, paddingLeft: "8px" }}>
            SCORE_TREND (LAST 20)
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" tick={{ fill: COLORS.muted, fontSize: 10 }} axisLine={{ stroke: "#333" }} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: COLORS.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke={COLORS.cyan} strokeWidth={3} dot={{ fill: COLORS.cyan, r: 4 }} activeDot={{ r: 6, fill: COLORS.green }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pass/Fail Pie */}
        <div style={{ background: "#191919", border: "4px solid #000", padding: "24px", boxShadow: "4px 4px 0px 0px #ff7351" }}>
          <div style={{ fontSize: "10px", color: COLORS.orange, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", borderLeft: "4px solid " + COLORS.orange, paddingLeft: "8px" }}>
            PASS_FAIL_RATIO
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={passFailData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {passFailData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {passFailData.map((entry, i) => (
                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", background: PIE_COLORS[i] }} />
                  <span style={{ fontSize: "11px", color: "#ababab", fontWeight: 700 }}>{entry.name}: {entry.value}</span>
                </div>
              ))}
              <div style={{ fontSize: "24px", fontWeight: 900, color: COLORS.green, marginTop: "8px" }}>
                {interviews.length > 0 ? Math.round((passFailData[0].value / interviews.length) * 100) : 0}%
              </div>
              <div style={{ fontSize: "9px", color: "#757575", textTransform: "uppercase" }}>PASS_RATE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
