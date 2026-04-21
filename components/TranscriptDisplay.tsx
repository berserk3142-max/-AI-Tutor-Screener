"use client";

import { useEffect, useRef } from "react";
import { TranscriptEntry } from "@/store/useInterviewStore";

interface TranscriptDisplayProps {
  entries: TranscriptEntry[];
  currentAIText?: string;
  isAISpeaking?: boolean;
}

export default function TranscriptDisplay({
  entries,
  currentAIText,
  isAISpeaking,
}: TranscriptDisplayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, currentAIText]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {entries.length === 0 && !currentAIText && (
        <div
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            padding: "60px 20px",
            fontSize: "14px",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>💬</div>
          <p>Conversation will appear here...</p>
          <p style={{ marginTop: "8px", fontSize: "12px" }}>
            Start speaking and Nova will respond
          </p>
        </div>
      )}

      {entries.map((entry, index) => (
        <div
          key={index}
          className={`transcript-entry ${entry.role}`}
          style={{
            animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
              fontSize: "11px",
              color: "var(--text-muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            <span>
              {entry.role === "ai" ? "🤖 Nova" : "👤 You"}
            </span>
            <span>{formatTime(entry.timestamp)}</span>
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "var(--text-primary)",
            }}
          >
            {entry.text}
          </p>
        </div>
      ))}

      {/* Typing indicator */}
      {isAISpeaking && currentAIText && (
        <div className="transcript-entry ai" style={{ opacity: 0.7 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
              fontSize: "11px",
              color: "var(--text-muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            <span>🤖 Nova</span>
            <span
              style={{
                display: "inline-flex",
                gap: "3px",
              }}
            >
              <span className="animate-pulse" style={{ color: "var(--accent-primary)" }}>●</span>
              Speaking...
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
