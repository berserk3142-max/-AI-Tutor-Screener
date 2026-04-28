<div align="center">

# 🤖 NovaAI

### **Real-Time AI Voice Interviewer • Evaluation Engine • Recruiter Platform**

> _Conduct live voice interviews, generate AI-powered evaluations, export PDF reports, and manage candidates — all from one platform._

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com)
[![Vapi](https://img.shields.io/badge/Vapi_AI-Voice-blueviolet?style=for-the-badge)](https://vapi.ai)
[![Gemini](https://img.shields.io/badge/Gemini_2.0-Evaluation-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![Resend](https://img.shields.io/badge/Resend-Email-000?style=for-the-badge)](https://resend.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

---

**🎤 Voice-First Interviews** · **📊 Analytics Dashboard** · **📋 PDF Reports** · **📧 Email Notifications** · **🏷️ Recruiter Tags** · **🎙️ Audio Playback**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Interview Flow](#-interview-flow)
- [Voice Pipeline](#-voice-pipeline)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Design System](#-design-system)

---

## 🌟 Overview

**NovaAI** is a next-generation AI interview platform. Candidates have a **real-time voice conversation** with an AI interviewer named **Nova**, powered by Vapi AI + GPT-4o. After the interview, **Gemini 2.0 Flash** evaluates the transcript across 5 skill dimensions, generates a detailed scorecard, and emails the results — all automatically.

### What Makes NovaAI Different

| Traditional Screening | NovaAI |
|:---:|:---:|
| 📝 Written forms | 🎤 Live voice conversation |
| ⏳ Manual review | 🧠 AI-powered instant evaluation |
| 📊 Spreadsheets | 📈 Analytics dashboard with charts |
| 📄 No reports | 📋 Branded PDF scorecards |
| 📧 Manual emails | ✉️ Auto-email results to candidates |
| 🔇 No recordings | 🎙️ Full audio playback |

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    subgraph Client["🌐 CLIENT (Browser)"]
        LP["🏠 Landing Page"]
        IL["📋 Interview Lobby"]
        IR["🎤 Interview Room"]
        RP["📊 Results Page"]
        DB_PAGE["📈 Dashboard"]
        
        LP --> IL --> IR --> RP
        DB_PAGE
        
        subgraph State["State Management"]
            ZS["Zustand Store"]
            VH["useVoice Hook"]
            AR["useAudioRecorder"]
        end
    end

    subgraph VapiCloud["☁️ VAPI AI CLOUD"]
        GPT["🧠 OpenAI GPT-4o\n(Brain)"]
        DG["🎧 Deepgram Nova-2\n(Speech-to-Text)"]
        EL["🔊 ElevenLabs\n(Text-to-Speech)"]
    end

    subgraph Backend["⚙️ NEXT.JS API ROUTES"]
        EVAL["/api/evaluate\n(Gemini AI)"]
        INT["/api/interviews\n(CRUD)"]
        TAGS["/api/interviews/id/tags\n(Recruiter Tools)"]
        AUDIO["/api/upload-audio\n(Recording Storage)"]
    end
    
    subgraph Services["🔌 SERVICES"]
        GEMINI["💎 Gemini 2.0 Flash\n(Evaluation Engine)"]
        RESEND["📧 Resend\n(Email Service)"]
        CLERK["🔐 Clerk\n(Authentication)"]
    end

    subgraph Database["💾 DATABASE"]
        NEON["🐘 Neon PostgreSQL\n(Drizzle ORM)"]
    end

    IR <-->|"WebRTC"| VapiCloud
    IR --> EVAL
    EVAL --> GEMINI
    EVAL --> RESEND
    EVAL --> NEON
    INT --> NEON
    TAGS --> NEON
    AUDIO --> NEON
    Client <-->|"Auth"| CLERK

    style Client fill:#0e0e0e,stroke:#bcff5f,stroke-width:3px,color:#fff
    style VapiCloud fill:#1a1a2e,stroke:#00ffff,stroke-width:3px,color:#fff
    style Backend fill:#0e0e0e,stroke:#ff51fa,stroke-width:3px,color:#fff
    style Services fill:#1a1a2e,stroke:#bcff5f,stroke-width:3px,color:#fff
    style Database fill:#0e0e0e,stroke:#00ffff,stroke-width:3px,color:#fff
```

---

## 🔄 Interview Flow

### Complete Interview Lifecycle

```mermaid
flowchart TD
    A["🏠 Landing Page\n(Meet Nova)"] -->|"Click START"| B["🔐 Clerk Auth\n(Sign In / Sign Up)"]
    B -->|"Authenticated"| C["📋 Interview Lobby\n(Enter Name)"]
    C -->|"Click BEGIN"| D["🔗 Connecting...\n(Vapi WebRTC)"]
    D -->|"Connected"| E["🎤 LIVE INTERVIEW\n━━━━━━━━━━━━━\n• Nova asks 6 questions\n• Real-time transcript\n• Audio recording\n• Timer + Q counter"]
    E -->|"Click END"| F["⏳ Evaluating...\n(Gemini AI)"]
    F --> G{"Gemini\nAvailable?"}
    G -->|"Yes"| H["🧠 AI Evaluation\n(5 dimensions scored)"]
    G -->|"No"| I["📐 Fallback\n(Heuristic scoring)"]
    H --> J["💾 Save to DB\n(Neon PostgreSQL)"]
    I --> J
    J --> K["📧 Email Results\n(via Resend)"]
    J --> L["🎙️ Upload Audio\n(Recording saved)"]
    K --> M["📊 RESULTS PAGE\n━━━━━━━━━━━━━\n• Overall Score + Grade\n• 5 Dimension Scores\n• Strengths & Improvements\n• Evidence Quotes\n• Audio Playback\n• PDF Download"]
    L --> M
    M --> N["📈 Recruiter Dashboard\n━━━━━━━━━━━━━━━━\n• Analytics Charts\n• Tag & Filter Candidates\n• Private Notes\n• Export PDFs"]

    style A fill:#191919,stroke:#bcff5f,stroke-width:2px,color:#fff
    style E fill:#191919,stroke:#00ffff,stroke-width:3px,color:#fff
    style H fill:#191919,stroke:#ff51fa,stroke-width:2px,color:#fff
    style M fill:#191919,stroke:#bcff5f,stroke-width:3px,color:#fff
    style N fill:#191919,stroke:#ff51fa,stroke-width:3px,color:#fff
```

---

## 🔊 Voice Pipeline

### How Nova Talks (Inside Vapi)

```mermaid
flowchart LR
    MIC["🎙️ Candidate\nMicrophone"] -->|"WebRTC\nAudio Stream"| DG["🎧 Deepgram\nNova-2\n(STT)"]
    DG -->|"Text"| GPT["🧠 OpenAI\nGPT-4o\n(LLM)"]
    GPT -->|"Response"| EL["🔊 ElevenLabs\n(TTS)"]
    EL -->|"Audio"| SPK["🔈 Speaker\nOutput"]
    
    DG -.->|"transcript events"| UI["📝 Live\nTranscript UI"]
    GPT -.->|"speech-start/end"| VIS["📊 Audio\nVisualizer"]

    style MIC fill:#191919,stroke:#00ffff,stroke-width:2px,color:#fff
    style DG fill:#1a1a2e,stroke:#bcff5f,stroke-width:2px,color:#fff
    style GPT fill:#1a1a2e,stroke:#ff51fa,stroke-width:2px,color:#fff
    style EL fill:#1a1a2e,stroke:#bcff5f,stroke-width:2px,color:#fff
    style SPK fill:#191919,stroke:#00ffff,stroke-width:2px,color:#fff
```

---

## 🧠 Evaluation Engine

### How Gemini Scores Candidates

```mermaid
flowchart TD
    T["📝 Full Interview Transcript"] --> G["🧠 Gemini 2.0 Flash"]
    
    G --> C["💎 Clarity\n(1-10)\n━━━━━━━━\nPrecision\nExamples\nStructure"]
    G --> P["🌱 Patience\n(1-10)\n━━━━━━━━\nCalm under confusion\nWait time\nEncouragement"]
    G --> F["🗣️ Fluency\n(1-10)\n━━━━━━━━\nConfident speech\nNatural flow\nNo filler words"]
    G --> W["🤗 Warmth\n(1-10)\n━━━━━━━━\nFriendly tone\nApproachable\nSafe space"]
    G --> S["✨ Simplicity\n(1-10)\n━━━━━━━━\nBreaks complexity\nAvoids jargon\nDigestible"]
    
    C & P & F & W & S --> O["📊 Overall Score\n(Weighted Average)\nFavors Clarity & Patience"]
    O --> R["📋 Full Report\n━━━━━━━━━━━━\n• Summary\n• Strengths\n• Improvements\n• Evidence quotes"]

    style T fill:#191919,stroke:#484848,stroke-width:2px,color:#fff
    style G fill:#191919,stroke:#ff51fa,stroke-width:3px,color:#fff
    style O fill:#191919,stroke:#bcff5f,stroke-width:3px,color:#fff
    style R fill:#191919,stroke:#00ffff,stroke-width:2px,color:#fff
```

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Framework** | Next.js 16.2 (Turbopack) | Full-stack React with App Router |
| **Auth** | Clerk | Sign-in/Sign-up, RBAC, route protection |
| **Voice AI** | Vapi AI (`@vapi-ai/web`) | Real-time voice conversations via WebRTC |
| **LLM (Interview)** | OpenAI GPT-4o (via Vapi) | Nova's conversational intelligence |
| **Speech-to-Text** | Deepgram Nova-2 (via Vapi) | Real-time audio transcription |
| **Text-to-Speech** | ElevenLabs (via Vapi) | Natural-sounding AI voice |
| **LLM (Evaluation)** | Google Gemini 2.0 Flash | Post-interview transcript analysis |
| **Database** | Neon PostgreSQL (Serverless) | Interview storage with Drizzle ORM |
| **Email** | Resend | Automated evaluation result emails |
| **Charts** | Recharts | Analytics dashboard visualizations |
| **PDF** | jsPDF + jspdf-autotable | Branded PDF report generation |
| **Toasts** | Sonner | Real-time notification system |
| **State** | Zustand | Lightweight global state management |
| **Styling** | Vanilla CSS (Neo-Brutalist) | Custom design system |
| **Fonts** | Space Grotesk + Material Symbols | Typography & iconography |

---

## 📁 Project Structure

```mermaid
graph LR
    subgraph Root["📦 ai-tutor-screener"]
        subgraph App["app/"]
            AUTH["(auth)/\nsign-in, sign-up"]
            API["api/\nevaluate, interviews\ntags, upload-audio"]
            PAGES["dashboard/\ninterview/\nresults/\nprofile/"]
        end
        
        subgraph Comp["components/"]
            AUTH_C["auth/\nRoleGuard"]
            DASH_C["dashboard/\nAnalyticsPanel\nTagsNotesPanel"]
            INT_C["interview/\nAudioPlayer"]
            LAYOUT_C["layout/\nAppShell"]
            UI_C["ui/\nToaster"]
            SHARED["Navbar, Footer\nScoreCard\nTranscriptDisplay"]
        end
        
        subgraph Core["Core"]
            HOOKS["hooks/\nuseVoice\nuseAudioRecorder"]
            STORE["store/\nuseInterviewStore"]
            LIB["lib/\npdf, email\nutils, auth"]
            DB["db/\nschema, index"]
            TYPES["types/\ninterview, user"]
        end
    end

    style Root fill:#0e0e0e,stroke:#bcff5f,stroke-width:2px,color:#fff
    style App fill:#191919,stroke:#00ffff,stroke-width:2px,color:#fff
    style Comp fill:#191919,stroke:#ff51fa,stroke-width:2px,color:#fff
    style Core fill:#191919,stroke:#bcff5f,stroke-width:2px,color:#fff
```

<details>
<summary><b>📂 Full Directory Tree</b></summary>

```
ai-tutor-screener/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                 # Auth pages layout
│   │   ├── sign-in/[[...sign-in]]/    # Clerk sign-in page
│   │   └── sign-up/[[...sign-up]]/    # Clerk sign-up page
│   ├── api/
│   │   ├── evaluate/route.ts          # POST — Gemini evaluation + email
│   │   ├── interviews/
│   │   │   ├── route.ts              # GET — List interviews
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET — Interview detail
│   │   │       └── tags/route.ts     # PATCH — Update tags/notes
│   │   └── upload-audio/route.ts     # POST — Audio upload
│   ├── dashboard/page.tsx            # Recruiter dashboard + analytics
│   ├── interview/page.tsx            # Interview lobby
│   ├── results/[id]/page.tsx         # Results + PDF + audio + tags
│   ├── profile/page.tsx              # User profile
│   ├── layout.tsx                    # Root layout (Clerk + Toaster)
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Design system
│
├── components/
│   ├── auth/RoleGuard.tsx            # Role-based access control
│   ├── dashboard/
│   │   ├── AnalyticsPanel.tsx        # Charts (bar, radar, line, pie)
│   │   └── TagsNotesPanel.tsx        # Tag selector + notes
│   ├── interview/AudioPlayer.tsx     # Custom audio playback
│   ├── layout/AppShell.tsx           # Consistent page wrapper
│   ├── ui/Toaster.tsx                # Toast notifications
│   ├── Navbar.tsx                    # Navigation with auth
│   ├── Footer.tsx                    # Site footer
│   ├── ScoreCard.tsx                 # Score bar component
│   └── TranscriptDisplay.tsx         # Chat-style transcript
│
├── hooks/
│   ├── useVoice.ts                   # Vapi SDK integration
│   └── useAudioRecorder.ts           # MediaRecorder hook
│
├── store/useInterviewStore.ts        # Zustand global state
├── lib/
│   ├── pdf.ts                        # PDF generation (jsPDF)
│   ├── email.ts                      # Resend email sender
│   ├── email-template.ts             # HTML email template
│   ├── auth.ts                       # Auth utilities
│   ├── utils.ts                      # Formatting helpers
│   └── constants.ts                  # App constants
│
├── db/
│   ├── index.ts                      # Drizzle + Neon connection
│   └── schema.ts                     # Database schema
│
├── types/                            # TypeScript interfaces
├── middleware.ts                      # Clerk route protection
└── drizzle.config.ts                 # Drizzle Kit config
```

</details>

---

## ✨ Features

### 🔐 Authentication & RBAC
- Clerk-powered sign-in/sign-up with Google & email
- Role-based access (Recruiter vs Candidate)
- Protected routes via middleware
- User-scoped interview data

### 🎤 Voice-First Interview
- Real-time WebRTC voice conversation powered by Vapi AI
- GPT-4o drives Nova's conversational intelligence
- ElevenLabs natural speech synthesis
- Deepgram Nova-2 real-time transcription
- Voice Activity Detection for natural turn-taking

### 🎙️ Audio Recording & Playback
- Automatic recording via MediaRecorder API
- Custom audio player with seek & speed controls (0.5x–2x)
- Recordings saved and available on results page

### 📊 Analytics Dashboard
- **Score Distribution** — Bar chart histogram (1–10)
- **Dimension Radar** — Average Clarity, Patience, Fluency, Warmth, Simplicity
- **Score Trend** — Line chart of last 20 interviews
- **Pass/Fail Ratio** — Pie chart with pass rate percentage
- 5 stat cards: Total, Average, Top Rated, This Week, Avg Duration

### 📋 PDF Report Export
- One-click branded PDF download from any results page
- Dark-themed NovaAI design with score tables
- Includes summary, strengths, improvements, and evidence
- Also available per-row on the dashboard

### 📧 Email Notifications
- Auto-sends styled HTML evaluation email after interview
- Dark-themed template matching NovaAI's design
- Score breakdown, summary, strengths, and "View Report" link
- Powered by Resend (fire-and-forget, non-blocking)

### 🏷️ Tags + Recruiter Notes
- 5 predefined tags: `SHORTLISTED` `REJECTED` `ON_HOLD` `NEEDS_REVIEW` `TOP_PICK`
- Private recruiter notes per interview
- Tag filter dropdown on dashboard
- Color-coded tag badges on interview cards

### 🔔 Toast Notifications
- Real-time feedback for all actions
- Neo-brutalist styled with Sonner
- PDF export, tag saves, errors — all notified

### 🛡️ Evaluation Reliability
- Multi-model Gemini fallback (2.0-flash → 2.0-flash-lite → 1.5-flash → gemini-pro)
- Local heuristic evaluation when all APIs are rate-limited
- Candidates always get a result, never left hanging

---

## 💾 Database Schema

```mermaid
erDiagram
    INTERVIEWS {
        text id PK "UUID"
        text user_id "Clerk User ID"
        text candidate_name "Default: Anonymous"
        text transcript "Full conversation"
        int clarity "1-10"
        int patience "1-10"
        int fluency "1-10"
        int warmth "1-10"
        int simplicity "1-10"
        int overall_score "1-10"
        text summary "AI-generated summary"
        jsonb evidence "string[] — quotes"
        jsonb strengths "string[] — strengths"
        jsonb improvements "string[] — areas to improve"
        int duration_seconds "Interview length"
        int question_count "Questions asked"
        text status "completed"
        jsonb tags "string[] — recruiter tags"
        text recruiter_notes "Private notes"
        text tagged_by "Recruiter user ID"
        timestamp tagged_at "When tagged"
        text audio_url "Recording URL/data"
        timestamp created_at "Auto-generated"
    }
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `POST` | `/api/evaluate` | ✅ | Evaluate transcript with Gemini → save → email results |
| `GET` | `/api/interviews` | ✅ | List all interviews (recruiter sees all, users see own) |
| `GET` | `/api/interviews/[id]` | ✅ | Get single interview full details |
| `PATCH` | `/api/interviews/[id]/tags` | 🔒 Recruiter | Update tags and recruiter notes |
| `POST` | `/api/upload-audio` | ✅ | Upload interview audio recording |

### `POST /api/evaluate` — Example

**Request:**
```json
{
  "transcript": "Interviewer (Nova): Hi there!...\n\nCandidate: Hello...",
  "candidateName": "John Doe",
  "duration": 420,
  "questionCount": 6
}
```

**Response:**
```json
{
  "id": "uuid-of-interview",
  "clarity": 8,
  "patience": 7,
  "fluency": 9,
  "warmth": 8,
  "simplicity": 7,
  "overallScore": 8,
  "summary": "The candidate demonstrated strong communication...",
  "strengths": ["Excellent clarity", "Natural flow"],
  "improvements": ["Could show more patience"]
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- [Vapi AI](https://vapi.ai) account (Public API Key)
- [Google AI Studio](https://aistudio.google.com) account (Gemini API Key)
- [Clerk](https://clerk.com) account (Auth keys)
- [Neon](https://neon.tech) PostgreSQL database
- [Resend](https://resend.com) account _(optional — for email)_

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/berserk3142-max/-AI-Tutor-Screener.git
cd ai-tutor-screener

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# 4. Push database schema
npx drizzle-kit push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx drizzle-kit push` | Push schema to database |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB GUI) |

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
# Gemini — AI Evaluation Engine
GEMINI_API_KEY=your_gemini_api_key

# Vapi AI — Voice Conversation Engine
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key

# Neon — PostgreSQL Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Clerk — Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Resend — Email Notifications
RESEND_API_KEY=re_xxx
EMAIL_FROM=onboarding@resend.dev
```

### Where to get the keys

| Key | Source |
|:----|:-------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `NEXT_PUBLIC_VAPI_API_KEY` | [Vapi Dashboard](https://dashboard.vapi.ai) → Settings |
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) |
| `CLERK_*` keys | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com) → API Keys |

---

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project**
3. Select your repo → Add **all environment variables** from above
4. Click **Deploy** ✅
5. Add your Vercel URL to [Clerk Dashboard](https://dashboard.clerk.com) → Domains

### Other Platforms

| Platform | Notes |
|:---------|:------|
| **Vercel** | Zero-config Next.js hosting (recommended) |
| **Railway** | Full-stack deployment |
| **Render** | Docker or Node.js |
| **AWS Amplify** | Managed Next.js hosting |

---

## 🎨 Design System

NovaAI uses a **Neo-Brutalist / Kinetic Terminal** aesthetic:

| Element | Value |
|:--------|:------|
| **Background** | `#0e0e0e` (near-black) |
| **Accent Primary** | `#bcff5f` (acid green) |
| **Accent Secondary** | `#ff51fa` (hot pink) |
| **Accent Tertiary** | `#00ffff` (cyan) |
| **Typography** | Space Grotesk (geometric sans-serif) |
| **Icons** | Material Symbols Outlined |
| **Borders** | 4px solid, 0px border-radius |
| **Shadows** | Hard 4–8px offset (no blur) |
| **Animations** | Pulse glows, fade-in-up, shimmer, wave bars |
| **Background** | Subtle green grid pattern overlay |

---

## 📄 License

This project is private and built for Cuemath's tutor screening process.

---

<div align="center">

**Built with 🧠 by the NovaAI Team**

_Powered by Vapi AI · Google Gemini · Clerk · Resend · Next.js_

[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/berserk3142-max/-AI-Tutor-Screener)

</div>
