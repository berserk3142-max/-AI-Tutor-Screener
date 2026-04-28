"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackMessage?: string;
}

/**
 * Client-side role guard component.
 * Checks Clerk user's publicMetadata.role and blocks access if not in allowedRoles.
 */
export default function RoleGuard({
  allowedRoles,
  children,
  fallbackMessage = "ACCESS_DENIED",
}: RoleGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const role =
      (user.publicMetadata as { role?: string })?.role || "candidate";
    if (allowedRoles.includes(role)) {
      setAuthorized(true);
    }
  }, [user, isLoaded, allowedRoles, router]);

  if (!isLoaded) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            background: "#191919",
            border: "4px solid #bcff5f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "glow-pulse 2s ease-in-out infinite",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "28px",
              color: "#bcff5f",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            lock
          </span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
          gap: "24px",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            background: "#191919",
            border: "4px solid #ff7351",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "8px 8px 0px 0px #ff51fa",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "48px",
              color: "#ff7351",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            shield_lock
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#ff7351",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "8px",
            }}
          >
            ERROR_403 // {fallbackMessage}
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.05em",
            }}
          >
            UNAUTHORIZED{" "}
            <span style={{ color: "#ff7351" }}>ACCESS</span>
          </h2>
          <p
            style={{
              color: "#757575",
              fontSize: "14px",
              marginTop: "12px",
              maxWidth: "400px",
            }}
          >
            You don&apos;t have the required permissions to view this page.
            Contact an administrator if you believe this is an error.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            home
          </span>
          RETURN HOME
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
