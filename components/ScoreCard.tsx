"use client";

import { useEffect, useState } from "react";

interface ScoreCardProps {
  label: string;
  score: number;
  maxScore?: number;
  icon: string;
  delay?: number;
}

export default function ScoreCard({
  label,
  score,
  maxScore = 10,
  icon,
  delay = 0,
}: ScoreCardProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  const percentage = (score / maxScore) * 100;

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "#00d4aa";
    if (pct >= 60) return "#6c63ff";
    if (pct >= 40) return "#ffa726";
    return "#ff6b6b";
  };

  const getScoreLabel = (pct: number) => {
    if (pct >= 80) return "Excellent";
    if (pct >= 60) return "Good";
    if (pct >= 40) return "Average";
    return "Needs Work";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);

      // Animate score number
      const duration = 1500;
      const steps = 30;
      const stepDuration = duration / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += score / steps;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current * 10) / 10);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [score, percentage, delay]);

  return (
    <div
      className="card"
      style={{
        animation: `fadeInUp 0.5s ease-out ${delay}ms both`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>{icon}</span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: getScoreColor(percentage),
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {getScoreLabel(percentage)}
          </span>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: getScoreColor(percentage),
            }}
          >
            {animatedScore}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            /{maxScore}
          </span>
        </div>
      </div>
      <div className="score-bar-bg">
        <div
          style={{
            height: "100%",
            borderRadius: "var(--radius-full)",
            width: `${animatedWidth}%`,
            transition: `width 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
            background: `linear-gradient(90deg, ${getScoreColor(percentage)}88, ${getScoreColor(percentage)})`,
          }}
        />
      </div>
    </div>
  );
}
