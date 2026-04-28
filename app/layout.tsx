import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Toaster from "@/components/ui/Toaster";
import "./globals.css";

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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#bcff5f",
          colorTextOnPrimaryBackground: "#000000",
          colorBackground: "#0e0e0e",
          colorInputBackground: "#191919",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#ababab",
          colorNeutral: "#ffffff",
          borderRadius: "0px",
          fontFamily: "'Space Grotesk', sans-serif",
        },
        elements: {
          formButtonPrimary:
            "bg-[#bcff5f] text-black font-bold uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#ff51fa] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#ff51fa] transition-all",
          card: "bg-[#0e0e0e] border-4 border-[#484848] shadow-[8px_8px_0px_0px_#bcff5f]",
          headerTitle: "text-white font-black uppercase tracking-tight",
          headerSubtitle: "text-[#ababab]",
          socialButtonsBlockButton:
            "border-4 border-[#484848] bg-[#191919] text-white hover:bg-[#2c2c2c] font-semibold uppercase text-xs",
          formFieldInput:
            "bg-[#191919] border-4 border-[#484848] text-white focus:border-[#bcff5f] font-medium uppercase tracking-wide",
          formFieldLabel: "text-[#ababab] uppercase text-xs tracking-widest font-bold",
          footerActionLink: "text-[#bcff5f] hover:text-[#ff51fa] font-bold",
          identityPreview: "bg-[#191919] border-4 border-[#484848]",
          userButtonPopoverCard: "bg-[#0e0e0e] border-4 border-[#484848] shadow-[4px_4px_0px_0px_#bcff5f]",
          userButtonPopoverActionButton: "text-white hover:bg-[#191919]",
          userButtonPopoverActionButtonText: "text-[#ababab] uppercase text-xs",
          userButtonPopoverFooter: "hidden",
          avatarBox: "border-2 border-[#bcff5f]",
        },
      }}
    >
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
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
