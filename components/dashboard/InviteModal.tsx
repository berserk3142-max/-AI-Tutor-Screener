"use client";

import { useState } from "react";
import { toast } from "sonner";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!email.trim()) { toast.error("EMAIL_REQUIRED"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateEmail: email, candidateName: name }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteUrl(data.inviteUrl);
        toast.success("📧 INVITE_SENT — Link emailed to candidate");
      } else {
        toast.error(data.error || "INVITE_FAILED");
      }
    } catch { toast.error("NETWORK_ERROR"); }
    finally { setSending(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success("📋 LINK_COPIED");
  };

  const handleReset = () => {
    setEmail(""); setName(""); setInviteUrl(""); onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Backdrop */}
      <div onClick={handleReset} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }} />

      {/* Modal */}
      <div style={{ position: "relative", width: "460px", maxWidth: "90vw", background: "#0e0e0e", border: "4px solid #bcff5f", boxShadow: "8px 8px 0px 0px #ff51fa", padding: "32px" }}>
        {/* Close */}
        <button onClick={handleReset} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", color: "#757575", cursor: "pointer", fontSize: "20px" }}>✕</button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#bcff5f", fontVariationSettings: "'FILL' 1" }}>send</span>
          <span style={{ fontSize: "14px", fontWeight: 900, color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.05em" }}>INVITE CANDIDATE</span>
        </div>

        {!inviteUrl ? (
          <>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#757575", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>CANDIDATE EMAIL *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="candidate@email.com"
                style={{ width: "100%", padding: "12px 16px", border: "4px solid #484848", background: "#191919", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "'Space Grotesk',sans-serif", textTransform: "lowercase" }}
                onFocus={(e) => { e.target.style.borderColor = "#bcff5f"; }}
                onBlur={(e) => { e.target.style.borderColor = "#484848"; }}
              />
            </div>

            {/* Name */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#757575", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>CANDIDATE NAME</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="JOHN DOE"
                style={{ width: "100%", padding: "12px 16px", border: "4px solid #484848", background: "#191919", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "'Space Grotesk',sans-serif", textTransform: "uppercase" }}
                onFocus={(e) => { e.target.style.borderColor = "#bcff5f"; }}
                onBlur={(e) => { e.target.style.borderColor = "#484848"; }}
              />
            </div>

            {/* Info */}
            <div style={{ background: "#191919", border: "2px solid #2c2c2c", padding: "12px 16px", marginBottom: "24px", fontSize: "11px", color: "#757575", lineHeight: 1.6 }}>
              <span style={{ color: "#00ffff" }}>ℹ</span> A unique interview link will be generated and emailed to the candidate. The link expires in <strong style={{ color: "#ff51fa" }}>48 hours</strong> and can only be used once.
            </div>

            {/* Send */}
            <button onClick={handleSend} disabled={sending}
              style={{ width: "100%", padding: "14px", background: sending ? "#333" : "#bcff5f", color: "#000", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", border: "4px solid #000", cursor: sending ? "wait" : "pointer", boxShadow: "4px 4px 0px 0px #000", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>mail</span>
              {sending ? "SENDING..." : "SEND INVITE"}
            </button>
          </>
        ) : (
          /* Success State */
          <>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#bcff5f", display: "block", marginBottom: "12px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p style={{ fontSize: "16px", fontWeight: 800, color: "#bcff5f", textTransform: "uppercase" }}>INVITE SENT!</p>
              <p style={{ fontSize: "12px", color: "#ababab", marginTop: "8px" }}>Email sent to <strong style={{ color: "#00ffff" }}>{email}</strong></p>
            </div>

            {/* Copy link */}
            <div style={{ background: "#191919", border: "2px solid #484848", padding: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <input readOnly value={inviteUrl} style={{ flex: 1, background: "transparent", border: "none", color: "#00ffff", fontSize: "11px", outline: "none", fontFamily: "monospace" }} />
              <button onClick={handleCopy} style={{ padding: "6px 12px", background: "#bcff5f", color: "#000", fontWeight: 800, fontSize: "10px", border: "2px solid #000", cursor: "pointer", textTransform: "uppercase" }}>COPY</button>
            </div>

            <button onClick={handleReset}
              style={{ width: "100%", padding: "12px", background: "transparent", color: "#ababab", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", border: "4px solid #484848", cursor: "pointer" }}>
              CLOSE
            </button>
          </>
        )}
      </div>
    </div>
  );
}
