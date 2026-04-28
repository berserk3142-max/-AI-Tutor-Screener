"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Wraps children with Navbar and Footer.
 * Used by pages that need the standard app shell.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>{children}</main>
      <Footer />
    </>
  );
}
