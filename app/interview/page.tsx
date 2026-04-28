"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";

function InterviewLobbyContent() {
  const { user, isLoaded } = useUser();
  const defaultName = isLoaded && user ? (user.fullName || user.firstName || "") : "";
  const [name, setName] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─── Token Verification ───
  const token = searchParams.get("token");
  const [verifying, setVerifying] = useState(!!token);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenError, setTokenError] = useState("");
  const [inviteData, setInviteData] = useState<{
    candidateEmail?: string;
    candidateName?: string;
  }>({});

  useEffect(() => {
    if (!token) { setVerifying(false); return; }

    (async () => {
      try {
        const res = await fetch(`/api/invitations/verify?token=${token}`);
        const data = await res.json();
        if (data.valid) {
          setTokenValid(true);
          setInviteData({
            candidateEmail: data.candidateEmail,
            candidateName: data.candidateName,
          });
          if (data.candidateName) setName(data.candidateName);
        } else {
          setTokenValid(false);
          setTokenError(data.error || "Invalid invitation");
        }
      } catch {
        setTokenValid(false);
        setTokenError("Failed to verify invitation");
      } finally {
        setVerifying(false);
      }
    })();
  }, [token]);

  const displayName = name || inviteData.candidateName || defaultName;

  const handleStart = () => {
    setIsStarting(true);
    const roomId = crypto.randomUUID().slice(0, 8);
    const candidateName = encodeURIComponent(displayName.trim() || "Anonymous");
    const tokenParam = token ? `&token=${token}` : "";
    router.push(`/interview/${roomId}?name=${candidateName}${tokenParam}`);
  };

  // ─── No token = open access (keep backward compatible) ───
  // ─── With token = must be valid ───

  // Loading state while verifying
  if (verifying) {
    return (
      <AppShell>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", gap: "20px" }}>
          <div style={{ width: "80px", height: "80px", background: "#191919", border: "4px solid #bcff5f", display: "flex", alignItems: "center", justifyContent: "center", animation: "glow-pulse 2s ease-in-out infinite" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#bcff5f", fontVariationSettings: "'FILL' 1" }}>vpn_key</span>
          </div>
          <div style={{ fontSize: "12px", color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>VERIFYING INVITATION...</div>
        </div>
      </AppShell>
    );
  }

  // Invalid token
  if (token && tokenValid === false) {
    return (
      <AppShell>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", gap: "24px", padding: "40px" }}>
          <div style={{ width: "100px", height: "100px", background: "#191919", border: "4px solid #ff7351", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "8px 8px 0px 0px #ff51fa" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ff7351", fontVariationSettings: "'FILL' 1" }}>link_off</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#ff7351", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>
              INVITATION_ERROR
            </div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em" }}>
              INVALID <span style={{ color: "#ff7351" }}>INVITATION</span>
            </h2>
            <p style={{ color: "#757575", fontSize: "14px", marginTop: "12px", maxWidth: "400px" }}>
              {tokenError}. The link may have expired, been used already, or is invalid. Please contact the recruiter for a new invitation.
            </p>
          </div>
          <button onClick={() => router.push("/")} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>home</span>
            RETURN HOME
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "40px 20px", textAlign: "center", position: "relative" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(188,255,95,0.08), transparent 70%)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "560px" }}>
        {/* Nova orb */}
        <div style={{ width: "120px", height: "120px", margin: "0 auto 40px", position: "relative" }}>
          <div style={{ width: "120px", height: "120px", background: "#191919", border: "4px solid #bcff5f", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "8px 8px 0px 0px #ff51fa", animation: "glow-pulse 3s ease-in-out infinite" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "#bcff5f", fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", borderLeft: "4px solid #bcff5f", paddingLeft: "8px", display: "inline-block" }}>
          NOVA_INTERVIEW_SYSTEM // V4.2
        </div>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase", marginBottom: "16px" }}>
          READY FOR YOUR <span style={{ color: "#bcff5f" }}>INTERVIEW</span>?
        </h1>

        {/* Invitation badge */}
        {token && tokenValid && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            marginBottom: "20px", padding: "12px 20px", background: "rgba(0,255,255,0.05)",
            border: "2px solid rgba(0,255,255,0.3)",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#00ffff", fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span style={{ fontSize: "11px", color: "#00ffff", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
              VERIFIED INVITATION • {inviteData.candidateEmail}
            </span>
          </div>
        )}

        {/* Show signed-in user info */}
        {isLoaded && user && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            marginBottom: "24px", padding: "12px 20px", background: "rgba(188,255,95,0.05)",
            border: "2px solid rgba(188,255,95,0.15)",
          }}>
            <div style={{ width: "8px", height: "8px", background: "#bcff5f", animation: "glow-pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "12px", color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
              AUTHENTICATED AS: {user.fullName || user.primaryEmailAddress?.emailAddress || "USER"}
            </span>
          </div>
        )}

        <p style={{ color: "#ababab", fontSize: "16px", lineHeight: 1.7, marginBottom: "40px", maxWidth: "480px", margin: "0 auto 40px" }}>
          Nova will evaluate your communication and teaching skills through a natural voice conversation. Speak clearly — this is a voice-first experience.
        </p>

        {/* Name input */}
        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            placeholder={displayName ? `${displayName.toUpperCase()} (AUTO-DETECTED)` : "ENTER YOUR NAME..."}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            style={{
              width: "100%", maxWidth: "360px", padding: "14px 20px",
              border: "4px solid #484848", background: "#191919", color: "#fff",
              fontSize: "14px", fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.05em", outline: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#bcff5f"; }}
            onBlur={(e) => { e.target.style.borderColor = "#484848"; }}
          />
          {displayName && !name && (
            <div style={{ fontSize: "10px", color: "#757575", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              NAME AUTO-FILLED • OVERRIDE ABOVE
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={isStarting}
          style={{
            background: isStarting ? "#555" : "#bcff5f", color: "#000",
            padding: "18px 48px", fontWeight: 900, fontSize: "16px",
            textTransform: "uppercase", letterSpacing: "-0.02em",
            border: "4px solid #000", cursor: isStarting ? "wait" : "pointer",
            boxShadow: "8px 8px 0px 0px #ff51fa",
            transition: "all 0.15s ease",
            display: "inline-flex", alignItems: "center", gap: "10px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
          onMouseEnter={(e) => { if (!isStarting) { e.currentTarget.style.transform = "translate(4px, 4px)"; e.currentTarget.style.boxShadow = "4px 4px 0px 0px #ff51fa"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "8px 8px 0px 0px #ff51fa"; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>mic</span>
          {isStarting ? "CONNECTING..." : "START INTERVIEW"}
        </button>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "56px" }}>
          {[
            { icon: "record_voice_over", title: "VOICE-FIRST", desc: "Speak naturally, no typing" },
            { icon: "psychology", title: "AI EVALUATION", desc: "5 dimensions scored" },
            { icon: "timer", title: "~10 MINUTES", desc: "Quick & comprehensive" },
          ].map((item) => (
            <div key={item.title} style={{ background: "#191919", border: "4px solid #000", padding: "16px 12px", boxShadow: "4px 4px 0px 0px #bcff5f", textAlign: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#bcff5f", display: "block", marginBottom: "8px", fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <div style={{ fontWeight: 700, fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>{item.title}</div>
              <div style={{ fontSize: "10px", color: "#757575", textTransform: "uppercase" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </AppShell>
  );
}

export default function InterviewLobby() {
  return (
    <Suspense fallback={
      <AppShell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
          <div style={{ fontSize: "12px", color: "#757575", textTransform: "uppercase" }}>LOADING...</div>
        </div>
      </AppShell>
    }>
      <InterviewLobbyContent />
    </Suspense>
  );
}
