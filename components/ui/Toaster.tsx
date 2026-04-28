"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#191919",
          border: "4px solid #484848",
          color: "#ffffff",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "13px",
          textTransform: "uppercase" as const,
          letterSpacing: "0.02em",
          boxShadow: "4px 4px 0px 0px #bcff5f",
          borderRadius: "0px",
        },
        classNames: {
          success: "",
          error: "",
          info: "",
        },
      }}
      theme="dark"
      richColors={false}
      expand={false}
      closeButton
    />
  );
}
