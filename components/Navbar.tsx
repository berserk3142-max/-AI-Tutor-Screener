"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "MEET NOVA" },
    { href: "/interview", label: "INTERVIEW" },
    { href: "/dashboard", label: "DASHBOARD" },
  ];

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 24px", height: "64px",
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "4px solid #000",
        boxShadow: "0 4px 0px 0px #bcff5f",
      }}
    >
      <Link href="/" style={{ textDecoration: "none", fontSize: "22px", fontWeight: 900, color: "#bcff5f", letterSpacing: "-0.05em", textTransform: "uppercase" }}>
        NovaAI
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                color: isActive ? "#bcff5f" : "#757575",
                fontSize: "13px", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "-0.02em", padding: "6px 12px",
                borderBottom: isActive ? "2px solid #bcff5f" : "2px solid transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#bcff5f";
                  e.currentTarget.style.color = "#000";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#757575";
                }
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/interview"
          style={{
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", background: "#bcff5f", color: "#000",
            fontSize: "13px", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "-0.02em", border: "4px solid #000",
            boxShadow: "4px 4px 0px 0px #fff",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(2px, 2px)";
            e.currentTarget.style.boxShadow = "2px 2px 0px 0px #fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0, 0)";
            e.currentTarget.style.boxShadow = "4px 4px 0px 0px #fff";
          }}
        >
          INIT_SESSION
        </Link>
        <button style={{ color: "#bcff5f", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>terminal</span>
        </button>
      </div>
    </nav>
  );
}
