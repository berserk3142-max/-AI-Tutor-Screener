import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NovaAI — Real-Time AI Interviewer",
  description:
    "Experience the future of interviews. NovaAI uses real-time voice AI to evaluate communication, teaching skills, and more through natural conversation.",
  keywords: ["AI interviewer", "voice interview", "real-time AI", "communication skills", "teaching evaluation"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-bg grid-bg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <Navbar />
        <main style={{ paddingTop: "64px", minHeight: "100vh" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
