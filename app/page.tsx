"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const dimensions = [
    { id: "DIM_01", icon: "visibility", label: "Clarity", desc: "Precision in signal transmission. Eliminating noise from the data stream to ensure absolute directive comprehension.", border: "#bcff5f", shadow: "#bcff5f", span: false },
    { id: "DIM_02", icon: "hourglass_empty", label: "Patience", desc: "Sustained processing states. Allowing for complex query resolution without premature termination sequences.", border: "#ff51fa", shadow: "#ff51fa", span: true },
    { id: "DIM_03", icon: "translate", label: "Fluency", desc: "Seamless protocol adaptation. High-fidelity conversion across diverse linguistic and technical environments.", border: "#bcff5f", shadow: "#bcff5f", span: false },
    { id: "DIM_04", icon: "layers_clear", label: "Simplicity", desc: "Architectural elegance. Minimizing cognitive load vectors while maximizing output utility.", border: "#bcff5f", shadow: "#bcff5f", span: false },
    { id: "DIM_05", icon: "favorite", label: "Warmth", desc: "Emulated empathetic response. Calibrating user interaction to reduce friction and increase trust metrics.", border: "#ff51fa", shadow: "#ff51fa", span: false },
  ];

  const steps = [
    { num: "01", icon: "mic", title: "Voice Transmission", desc: "Initial acoustic data capture. System engages high-fidelity microphones to stream raw vocal inputs into the processing matrix. Latency under 12ms.", status: "Acoustic_Link_Active", offset: "" },
    { num: "02", icon: "memory", title: "Deep Synthesis", desc: "Core algorithmic breakdown. Neural networks parse phonetic structures, applying sentiment analysis and linguistic modeling in real-time.", status: "Neural_Net_Engaged", offset: "marginTop: 32px" },
    { num: "03", icon: "data_object", title: "Output Compilation", desc: "Final data structuralization. Processed information is reformatted into comprehensive scorecards with actionable insights.", status: "Compile_Ready", offset: "marginTop: 64px" },
  ];

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Ambient glows */}
      <div style={{ position: "fixed", top: "25%", left: "25%", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(188,255,95,0.08), transparent 70%)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", zIndex: -1 }} />
      <div style={{ position: "fixed", bottom: 0, right: 0, width: "600px", height: "600px", background: "radial-gradient(circle, rgba(255,81,250,0.06), transparent 70%)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", zIndex: -1 }} />

      {/* ===== HERO ===== */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", minHeight: "calc(100vh - 64px)" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ fontSize: "13px", color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.15em", background: "#191919", padding: "4px 12px", border: "1px solid rgba(188,255,95,0.3)", display: "inline-block", width: "fit-content" }}>
            01 // SYSTEM_INITIATED
          </div>

          <h1 style={{ fontSize: "clamp(40px, 5vw, 80px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", lineHeight: 1.05, position: "relative" }}>
            MEET NOVA.<br />
            <span style={{ color: "#bcff5f", background: "#000", padding: "0 8px", display: "inline-block", borderLeft: "8px solid #bcff5f" }}>YOUR AI</span><br />
            INTERVIEWER.
          </h1>

          <p style={{ fontSize: "18px", color: "#ababab", maxWidth: "480px", lineHeight: 1.7, borderLeft: "4px solid #ff51fa", paddingLeft: "16px", background: "rgba(19,19,19,0.5)", padding: "12px 16px 12px 20px" }}>
            Experience the next generation of candidate evaluation with high-fidelity voice AI and real-time empathy analysis.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
            <Link href="/interview" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px" }}>
                START INTERVIEW
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_forward</span>
              </button>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px" }}>
                VIEW DASHBOARD
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>terminal</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right — Visual */}
        <div style={{ position: "relative", aspectRatio: "1", padding: "32px" }}>
          <div style={{ position: "absolute", inset: 0, border: "8px solid #1f1f1f", boxShadow: "8px 8px 0px 0px #bcff5f", transform: "translate(16px, 16px)", pointerEvents: "none", zIndex: -1 }} />
          <div style={{ position: "absolute", inset: 0, border: "4px solid rgba(255,81,250,0.4)", transform: "translate(-16px, -16px)", pointerEvents: "none", zIndex: -1, mixBlendMode: "screen" }} />

          <div style={{ width: "100%", height: "100%", background: "#191919", border: "4px solid #000", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none", mixBlendMode: "overlay", background: "repeating-linear-gradient(transparent, transparent 2px, rgba(61,98,0,0.15) 2px, rgba(61,98,0,0.15) 4px)" }} />
            <Image src="/voice-wave-hero.png" alt="AI voice wave visualization" fill style={{ objectFit: "cover", opacity: 0.8, filter: "grayscale(0.2) contrast(1.25)", mixBlendMode: "luminosity" }} />

            <div style={{ position: "absolute", top: 0, right: 0, background: "#ff51fa", color: "#000", fontSize: "11px", fontWeight: 800, padding: "4px 8px", textTransform: "uppercase", borderLeft: "4px solid #000", borderBottom: "4px solid #000", zIndex: 30 }}>
              V.4.2 // LIVE
            </div>

            <div style={{ position: "absolute", bottom: "16px", left: "16px", zIndex: 30, display: "flex", gap: "3px", alignItems: "flex-end" }}>
              {[8, 12, 4, 16, 6, 10].map((h, i) => (
                <div key={i} style={{ width: "3px", height: `${h * 2}px`, background: "#bcff5f", animation: `wave ${0.5 + i * 0.1}s ease-in-out ${i * 0.08}s infinite` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase", textShadow: "4px 4px 0px #bcff5f", maxWidth: "800px" }}>
            OPERATIONAL SEQUENCE
          </h2>
          <div style={{ color: "#bcff5f", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "16px" }}>
            02 // SYSTEM_WORKFLOW_OVERVIEW
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
          {steps.map((step, idx) => (
            <div key={step.num} className="card" style={{ display: "flex", flexDirection: "column", marginTop: idx * 32, border: "4px solid #000" }}>
              <div style={{ background: "#bcff5f", padding: "16px", borderBottom: "4px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#000", fontWeight: 900, fontSize: "24px", letterSpacing: "-0.05em" }}>{step.num}</span>
                <span className="material-symbols-outlined" style={{ color: "#000", fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
              </div>
              <div style={{ padding: "24px", flexGrow: 1 }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: "16px", height: "16px", background: "#00ffff" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, textTransform: "uppercase", marginBottom: "16px" }}>{step.title}</h3>
                <p style={{ color: "#ababab", fontSize: "14px", lineHeight: 1.7 }}>{step.desc}</p>
                <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", color: "#00ffff", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  <div style={{ width: "8px", height: "8px", background: "#00ffff", animation: "glow-pulse 2s ease-in-out infinite" }} />
                  <span>{step.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DIMENSIONS ===== */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: "64px" }}>
          <span style={{ color: "#ff51fa", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.15em", borderLeft: "4px solid #ff51fa", paddingLeft: "8px" }}>01 // METRICS</span>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase", lineHeight: 1, marginTop: "12px" }}>
            EVALUATION<br />
            <span style={{ color: "#bcff5f", position: "relative", display: "inline-block" }}>
              DIMENSIONS
              <span style={{ position: "absolute", bottom: "-8px", left: 0, width: "100%", height: "8px", background: "#bcff5f" }} />
            </span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {dimensions.map((dim) => (
            <div
              key={dim.id}
              style={{
                background: "#131313", border: `4px solid ${dim.border}`, padding: "24px",
                position: "relative", gridColumn: dim.span ? "span 2" : "span 1",
                boxShadow: `8px 8px 0px 0px ${dim.shadow}`,
                transition: "all 0.2s ease",
                display: dim.span ? "flex" : "block",
                gap: dim.span ? "32px" : undefined,
                alignItems: dim.span ? "center" : undefined,
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, background: "#00ffff", color: "#000", fontSize: "10px", fontWeight: 800, padding: "4px 8px", textTransform: "uppercase", borderLeft: "4px solid #000", borderBottom: "4px solid #000" }}>
                {dim.id}
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "56px", color: dim.border, display: "block", marginBottom: dim.span ? 0 : "24px", fontVariationSettings: "'FILL' 1" }}>{dim.icon}</span>
              <div>
                <h3 style={{ fontSize: "28px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "8px" }}>{dim.label}</h3>
                <p style={{ color: "#ababab", fontSize: "15px", lineHeight: 1.7 }}>{dim.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: "80px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "900px", border: "4px solid #bcff5f", background: "#131313", padding: "64px", boxShadow: "16px 16px 0px 0px #000", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: "#00ffff", color: "#000", fontSize: "12px", fontWeight: 800, padding: "4px 16px", textTransform: "uppercase", letterSpacing: "0.15em", borderLeft: "4px solid #000", borderBottom: "4px solid #000" }}>
            01 // EVAL_PROTOCOL
          </div>

          <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", marginBottom: "16px", textShadow: "4px 4px 0px rgba(0,0,0,1)" }}>
            READY TO BE <span style={{ color: "#bcff5f" }}>EVALUATED?</span>
          </h2>
          <p style={{ fontSize: "20px", color: "#ababab", marginBottom: "40px" }}>
            The future of hiring is one conversation away.
          </p>

          <Link href="/interview" style={{ textDecoration: "none" }}>
            <button style={{ position: "relative", background: "#bcff5f", color: "#000", fontWeight: 900, fontSize: "clamp(20px, 3vw, 36px)", padding: "24px 48px", textTransform: "uppercase", letterSpacing: "-0.05em", border: "4px solid #000", boxShadow: "12px 12px 0px 0px #ff51fa", cursor: "pointer", transition: "all 0.15s ease" }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = "translate(12px, 12px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "12px 12px 0px 0px #ff51fa"; }}
            >
              BEGIN INTERVIEW
              <span style={{ position: "absolute", top: "-8px", right: "-8px", width: "20px", height: "20px", background: "#ff51fa", border: "2px solid #000", animation: "glow-pulse 2s ease-in-out infinite" }} />
            </button>
          </Link>

          <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "16px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#757575" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>lock</span> SECURE
            </span>
            <span>//</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>memory</span> AI ACTIVE
            </span>
            <span>//</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>speed</span> &lt;12MS
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
