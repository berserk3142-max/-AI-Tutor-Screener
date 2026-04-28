"use client";

import { useState } from "react";
import { toast } from "sonner";

const PREDEFINED_TAGS = [
  { label: "SHORTLISTED", color: "#bcff5f" },
  { label: "REJECTED", color: "#ff7351" },
  { label: "ON_HOLD", color: "#ff51fa" },
  { label: "NEEDS_REVIEW", color: "#00ffff" },
  { label: "TOP_PICK", color: "#ffd700" },
];

interface TagsNotesPanelProps {
  interviewId: string;
  initialTags?: string[];
  initialNotes?: string;
}

export default function TagsNotesPanel({
  interviewId,
  initialTags = [],
  initialNotes = "",
}: TagsNotesPanelProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/interviews/${interviewId}/tags`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags, notes }),
      });
      if (res.ok) {
        toast.success("🏷️ TAGS_AND_NOTES_SAVED");
      } else {
        const data = await res.json();
        toast.error(data.error || "SAVE_FAILED");
      }
    } catch {
      toast.error("NETWORK_ERROR — SAVE_FAILED");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#191919", border: "4px solid #000", padding: "24px", boxShadow: "4px 4px 0px 0px #ff51fa" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#ff51fa", fontVariationSettings: "'FILL' 1" }}>label</span>
          <span style={{ fontSize: "12px", color: "#ff51fa", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>RECRUITER TOOLS</span>
        </div>
        <button
          onClick={saveChanges}
          disabled={saving}
          style={{
            background: saving ? "#333" : "#bcff5f",
            color: "#000",
            padding: "8px 16px",
            fontWeight: 800,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            border: "4px solid #000",
            cursor: saving ? "wait" : "pointer",
            boxShadow: "4px 4px 0px 0px #000",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000"; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>save</span>
          {saving ? "SAVING..." : "SAVE"}
        </button>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "10px", color: "#757575", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
          TAGS
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {PREDEFINED_TAGS.map((tag) => {
            const isActive = tags.includes(tag.label);
            return (
              <button
                key={tag.label}
                onClick={() => toggleTag(tag.label)}
                style={{
                  padding: "6px 14px",
                  border: `3px solid ${isActive ? tag.color : "#484848"}`,
                  background: isActive ? `${tag.color}15` : "transparent",
                  color: isActive ? tag.color : "#757575",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isActive && (
                  <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>check</span>
                )}
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div style={{ fontSize: "10px", color: "#757575", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
          PRIVATE NOTES
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ADD RECRUITER NOTES HERE..."
          rows={4}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "4px solid #484848",
            background: "#0e0e0e",
            color: "#fff",
            fontSize: "13px",
            fontFamily: "'Space Grotesk', sans-serif",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.6,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#ff51fa"; }}
          onBlur={(e) => { e.target.style.borderColor = "#484848"; }}
        />
      </div>
    </div>
  );
}
