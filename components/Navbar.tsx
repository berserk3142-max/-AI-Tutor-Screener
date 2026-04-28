"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();

  // Check if user is recruiter
  const isRecruiter =
    (user?.publicMetadata as { role?: string } | undefined)?.role === "recruiter";

  const links = [
    { href: "/", label: "MEET NOVA" },
    { href: "/interview", label: "INTERVIEW" },
    ...(isRecruiter
      ? [{ href: "/dashboard", label: "DASHBOARD" }]
      : []),
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        height: "64px",
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "4px solid #000",
        boxShadow: "0 4px 0px 0px #bcff5f",
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: 900,
          color: "#bcff5f",
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
        }}
      >
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
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                padding: "6px 12px",
                borderBottom: isActive
                  ? "2px solid #bcff5f"
                  : "2px solid transparent",
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
        {isLoaded && !isSignedIn && (
          <>
            <Link
              href="/sign-in"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "transparent",
                color: "#bcff5f",
                fontSize: "13px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                border: "4px solid #bcff5f",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(188,255,95,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                login
              </span>
              SIGN IN
            </Link>
            <Link
              href="/sign-up"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "#bcff5f",
                color: "#000",
                fontSize: "13px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                border: "4px solid #000",
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
              SIGN UP
            </Link>
          </>
        )}

        {isLoaded && isSignedIn && (
          <>
            <Link
              href="/profile"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                color: pathname === "/profile" ? "#bcff5f" : "#757575",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                transition: "all 0.15s ease",
                borderBottom:
                  pathname === "/profile"
                    ? "2px solid #bcff5f"
                    : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (pathname !== "/profile") {
                  e.currentTarget.style.background = "#bcff5f";
                  e.currentTarget.style.color = "#000";
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== "/profile") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#757575";
                }
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                person
              </span>
              PROFILE
            </Link>

            <Link
              href="/interview"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "#bcff5f",
                color: "#000",
                fontSize: "13px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                border: "4px solid #000",
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

            <div style={{ marginLeft: "4px" }}>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "36px",
                      height: "36px",
                      border: "2px solid #bcff5f",
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
