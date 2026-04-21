"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%", padding: "24px 32px",
        display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center",
        gap: "16px", background: "#131313",
        borderTop: "4px solid #000",
        marginTop: "96px",
      }}
    >
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#bcff5f", textTransform: "uppercase", letterSpacing: "0.15em" }}>
        ©{new Date().getFullYear()} NOVA_AI // SYSTEM_STATUS: NOMINAL // PROTOCOL_V.4.2
      </div>

      <div style={{ display: "flex", gap: "24px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
        {["API_DOCS", "SECURITY_LOGS", "TERMINAL_ACCESS"].map((label, i) => (
          <Link
            key={label}
            href="#"
            style={{
              color: i === 2 ? "#bcff5f" : "#666",
              textDecoration: i === 2 ? "underline" : "none",
              transition: "color 0.1s ease",
              cursor: "crosshair",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ff51fa"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = i === 2 ? "#bcff5f" : "#666"; }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ color: "#bcff5f", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.05em" }}>
        NovaAI
      </div>
    </footer>
  );
}
