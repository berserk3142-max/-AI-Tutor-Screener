<![CDATA[# 🤖 NovaAI — Real-Time AI Voice Interviewer

> **A production-grade, voice-first AI interviewer that conducts live interviews, captures real-time transcripts, and generates AI-powered evaluation reports — all through natural conversation.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Vapi](https://img.shields.io/badge/Vapi_AI-Voice_Engine-blueviolet)](https://vapi.ai)
[![Gemini](https://img.shields.io/badge/Gemini_2.0-Evaluation-blue?logo=google)](https://ai.google.dev)
[![PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-green?logo=postgresql)](https://neon.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Architecture](#architecture)
- [System Flow](#system-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Evaluation Dimensions](#evaluation-dimensions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

**NovaAI** is a next-generation interview platform built for Cuemath to screen tutor candidates. Instead of traditional text-based forms, candidates have a **real-time voice conversation** with an AI interviewer named **Nova**. The system:

1. **Conducts** a structured 6-question voice interview using Vapi AI
2. **Transcribes** the conversation in real-time using Deepgram
3. **Evaluates** the candidate's performance using Google Gemini AI
4. **Stores** results in a PostgreSQL database
5. **Displays** detailed scorecards on a recruiter dashboard

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                            │
│                                                                     │
│  ┌──────────┐   ┌──────────────┐   ┌────────────┐   ┌───────────┐ │
│  │  Landing  │──▶│  Interview   │──▶│  Interview │──▶│  Results   │ │
│  │  Page (/) │   │  Lobby       │   │  Room      │   │  Page     │ │
│  └──────────┘   └──────────────┘   └─────┬──────┘   └───────────┘ │
│                                          │                         │
│                              ┌───────────┴───────────┐             │
│                              │   Zustand Store        │             │
│                              │   (Interview State)    │             │
│                              └───────────┬───────────┘             │
│                                          │                         │
│                              ┌───────────┴───────────┐             │
│                              │   useVoice Hook        │             │
│                              │   (Vapi SDK Client)    │             │
│                              └───────────┬───────────┘             │
└──────────────────────────────────────────┼─────────────────────────┘
                                           │
                              WebRTC + Events (managed by Vapi)
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │              VAPI AI CLOUD                  │
                    │                                              │
                    │   ┌──────────┐  ┌─────────┐  ┌──────────┐  │
                    │   │ OpenAI   │  │Deepgram │  │ElevenLabs│  │
                    │   │ GPT-4o   │  │ Nova-2  │  │  TTS     │  │
                    │   │ (Brain)  │  │ (STT)   │  │ (Voice)  │  │
                    │   └──────────┘  └─────────┘  └──────────┘  │
                    └─────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────┐
                    │           NEXT.JS API ROUTES                │
                    │                                              │
                    │   ┌─────────────────┐  ┌────────────────┐   │
                    │   │ /api/evaluate    │  │ /api/interviews│   │
                    │   │ (Gemini AI)      │  │ (CRUD)         │   │
                    │   └────────┬────────┘  └───────┬────────┘   │
                    │            │                    │            │
                    │            ▼                    ▼            │
                    │   ┌─────────────────────────────────────┐   │
                    │   │       Drizzle ORM                    │   │
                    │   │       (Type-safe queries)            │   │
                    │   └────────────────┬────────────────────┘   │
                    └────────────────────┼────────────────────────┘
                                         │
                              ┌──────────┴──────────┐
                              │   Neon PostgreSQL    │
                              │   (Serverless DB)    │
                              └─────────────────────┘
```

---

## System Flow

### Complete Interview Lifecycle

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Landing   │────▶│   Interview  │────▶│   Interview      │
│   Page      │     │   Lobby      │     │   Room           │
│   (/)       │     │ (/interview) │     │ (/interview/id)  │
└─────────────┘     └──────┬───────┘     └────────┬─────────┘
                           │                      │
                    User enters name        Auto-connects to
                    & clicks START          Vapi AI via WebRTC
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌──────────────────┐
                    │ Generate     │     │  LIVE INTERVIEW   │
                    │ Room ID      │     │                   │
                    │ (UUID)       │     │  Nova asks 6 Qs   │
                    └──────────────┘     │  Real-time STT    │
                                        │  Live transcript   │
                                        │  Timer + Q count   │
                                        └────────┬─────────┘
                                                 │
                                          User clicks
                                          "End Interview"
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │  EVALUATION       │
                                        │                   │
                                        │  Transcript ──▶   │
                                        │  Gemini 2.0 Flash │
                                        │  ──▶ JSON Scores  │
                                        └────────┬─────────┘
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │  SAVE TO DB       │
                                        │                   │
                                        │  Drizzle ORM ──▶  │
                                        │  Neon PostgreSQL   │
                                        └────────┬─────────┘
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │  RESULTS PAGE     │
                                        │  (/results/id)    │
                                        │                   │
                                        │  • Overall Score   │
                                        │  • 5 Dimensions    │
                                        │  • Strengths       │
                                        │  • Improvements    │
                                        │  • Evidence        │
                                        │  • Full Transcript  │
                                        └──────────────────┘
```

### Voice Pipeline (Inside Vapi)

```
   Candidate's Mic                              Speaker Output
        │                                              ▲
        ▼                                              │
  ┌───────────┐     ┌───────────┐     ┌───────────┐   │
  │  WebRTC   │────▶│ Deepgram  │────▶│  OpenAI   │───┤
  │  Audio    │     │  Nova-2   │     │  GPT-4o   │   │
  │  Stream   │     │  (STT)    │     │  (LLM)    │   │
  └───────────┘     └───────────┘     └─────┬─────┘   │
                                            │         │
                                            ▼         │
                                      ┌───────────┐   │
                                      │ ElevenLabs│───┘
                                      │   (TTS)   │
                                      └───────────┘

  ──────────────── Events Flow ────────────────────────

  Vapi SDK ──▶ transcript (partial/final) ──▶ Zustand Store
           ──▶ speech-start / speech-end   ──▶ UI Updates
           ──▶ call-start / call-end       ──▶ Status Changes
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16.2 (App Router) | Full-stack React framework with server-side API routes |
| **Language** | TypeScript 5.x | Type-safe development |
| **Voice AI** | Vapi AI (`@vapi-ai/web`) | Real-time voice conversations via WebRTC |
| **LLM (Interview)** | OpenAI GPT-4o (via Vapi) | Powers Nova's conversational intelligence |
| **Speech-to-Text** | Deepgram Nova-2 (via Vapi) | Real-time audio transcription |
| **Text-to-Speech** | ElevenLabs (via Vapi) | Natural-sounding AI voice |
| **LLM (Evaluation)** | Google Gemini 2.0 Flash | Post-interview transcript analysis & scoring |
| **Database** | Neon PostgreSQL (Serverless) | Persistent storage for interviews & scores |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **State Management** | Zustand | Lightweight global state for interview data |
| **Styling** | Vanilla CSS (Neo-Brutalist) | Custom design system with hard shadows & grid patterns |
| **Fonts** | Space Grotesk + Material Symbols | Typography & iconography |

---

## Project Structure

```
ai-tutor-screener/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── page.tsx                  # Landing page (Meet Nova)
│   ├── globals.css               # Design system & animations
│   ├── interview/
│   │   ├── page.tsx              # Interview lobby (enter name)
│   │   └── [roomId]/
│   │       └── page.tsx          # Live interview room (Meet-style UI)
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx          # Individual result detail page
│   ├── dashboard/
│   │   └── page.tsx              # Recruiter dashboard (all interviews)
│   └── api/
│       ├── evaluate/
│       │   └── route.ts          # POST — Gemini evaluation endpoint
│       ├── interviews/
│       │   ├── route.ts          # GET — List all interviews
│       │   └── [id]/
│       │       └── route.ts      # GET — Single interview detail
│       ├── realtime-token/
│       │   └── route.ts          # (Legacy) OpenAI realtime session
│       └── tts/
│           └── route.ts          # (Legacy) ElevenLabs TTS
│
├── components/
│   ├── Navbar.tsx                # Fixed top navigation bar
│   ├── Footer.tsx                # Site footer
│   ├── InterviewRoom.tsx         # (Legacy) Interview room component
│   ├── AudioVisualizer.tsx       # Sound wave animation bars
│   ├── TranscriptDisplay.tsx     # Live transcript message bubbles
│   ├── ScoreCard.tsx             # Animated score bar with label
│   └── ResultsPanel.tsx          # Full evaluation results view
│
├── hooks/
│   └── useVoice.ts               # Core Vapi integration hook
│                                   (start/end/mute/interrupt)
│
├── store/
│   └── useInterviewStore.ts      # Zustand global state
│                                   (status, transcript, scores)
│
├── db/
│   ├── index.ts                  # Drizzle + pg Pool connection
│   └── schema.ts                 # interviews table schema
│
├── drizzle.config.ts             # Drizzle Kit migration config
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
└── .env.local                    # Environment variables (secrets)
```

---

## Features

### 🎤 Voice-First Interview
- Real-time WebRTC voice conversation powered by Vapi AI
- GPT-4o drives Nova's conversational intelligence
- ElevenLabs provides natural-sounding speech synthesis
- Deepgram Nova-2 handles speech-to-text in real-time
- Voice Activity Detection (VAD) for natural turn-taking

### 📝 Live Transcript
- Real-time partial and final transcript display
- Color-coded messages (green for Nova, cyan for candidate)
- Auto-scrolling sidebar with message count

### 🧠 AI Evaluation (5 Dimensions)
After the interview ends, the full transcript is sent to **Gemini 2.0 Flash** which evaluates across:

| Dimension | What It Measures |
|-----------|-----------------|
| 💎 **Clarity** | How clearly concepts are explained, use of examples |
| 🌱 **Patience** | Handling confusion and slow learners |
| 🗣️ **Fluency** | Natural, confident communication without filler words |
| 🤗 **Warmth** | Approachability, encouragement, safe learning environment |
| ✨ **Simplicity** | Breaking down complex topics, avoiding jargon |

Each dimension is scored **1-10** with an overall weighted score.

### 📊 Recruiter Dashboard
- View all completed interviews
- Filter by score range (All / 8+ / 5-7 / <5)
- Search candidates by name
- Quick stats: total interviews, average score, top performers
- Click any row to see detailed results

### 📋 Detailed Results Page
- Large overall score display with letter grade (A+ to D)
- Animated score bars for each dimension
- AI-generated summary, strengths, and areas for improvement
- Direct evidence quotes from the transcript
- Expandable full transcript

### 🛡️ Reliability
- Multi-model Gemini fallback (2.0-flash → 2.0-flash-lite → 1.5-flash → gemini-pro)
- Local heuristic evaluation when all API models are rate-limited
- Automatic retry on transient failures

---

## Database Schema

```sql
CREATE TABLE interviews (
  id               TEXT PRIMARY KEY,
  candidate_name   TEXT DEFAULT 'Anonymous',
  transcript       TEXT,
  clarity          INTEGER,
  patience         INTEGER,
  fluency          INTEGER,
  warmth           INTEGER,
  simplicity       INTEGER,
  overall_score    INTEGER,
  summary          TEXT,
  evidence         JSONB,        -- string[]
  strengths        JSONB,        -- string[]
  improvements     JSONB,        -- string[]
  duration_seconds INTEGER,
  question_count   INTEGER,
  status           TEXT DEFAULT 'completed',
  created_at       TIMESTAMP DEFAULT NOW()
);
```

### Entity Relationship

```
┌────────────────────────────────────────────┐
│              interviews                     │
├────────────────────────────────────────────┤
│ PK │ id              │ TEXT (UUID)          │
│    │ candidate_name  │ TEXT                 │
│    │ transcript      │ TEXT (full conv.)    │
│    │ clarity         │ INTEGER (1-10)       │
│    │ patience        │ INTEGER (1-10)       │
│    │ fluency         │ INTEGER (1-10)       │
│    │ warmth          │ INTEGER (1-10)       │
│    │ simplicity      │ INTEGER (1-10)       │
│    │ overall_score   │ INTEGER (1-10)       │
│    │ summary         │ TEXT                 │
│    │ evidence        │ JSONB (string[])     │
│    │ strengths       │ JSONB (string[])     │
│    │ improvements    │ JSONB (string[])     │
│    │ duration_seconds│ INTEGER              │
│    │ question_count  │ INTEGER              │
│    │ status          │ TEXT                 │
│    │ created_at      │ TIMESTAMP            │
└────────────────────────────────────────────┘
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/evaluate` | Sends transcript to Gemini AI, saves scored results to DB |
| `GET` | `/api/interviews` | Returns all interviews (sorted by newest first) |
| `GET` | `/api/interviews/[id]` | Returns a single interview's full details |

### POST `/api/evaluate`

**Request Body:**
```json
{
  "transcript": "Interviewer (Nova): Hi there!...\n\nCandidate: Hello...",
  "candidateName": "John Doe",
  "duration": 420,
  "questionCount": 6
}
```

**Response (200):**
```json
{
  "id": "uuid-of-saved-interview",
  "clarity": 8,
  "patience": 7,
  "fluency": 9,
  "warmth": 8,
  "simplicity": 7,
  "overallScore": 8,
  "summary": "The candidate demonstrated strong communication...",
  "evidence": ["Clear use of analogies when explaining fractions..."],
  "strengths": ["Excellent clarity", "Natural conversational flow"],
  "improvements": ["Could show more patience with follow-up questions"]
}
```

---

## Evaluation Dimensions

```
                    ┌─────────────────────────────┐
                    │      INTERVIEW TRANSCRIPT     │
                    └──────────────┬──────────────┘
                                   │
                          Gemini 2.0 Flash
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   💎 Clarity  │     │ 🌱 Patience  │     │  🗣️ Fluency  │
    │   (1-10)      │     │   (1-10)      │     │   (1-10)     │
    │               │     │               │     │              │
    │ • Precision   │     │ • Calm under  │     │ • Confident  │
    │ • Examples    │     │   confusion   │     │ • Natural    │
    │ • Structure   │     │ • Wait time   │     │ • No filler  │
    └──────────────┘     └──────────────┘     └──────────────┘

            ┌──────────────┐              ┌──────────────┐
            │  🤗 Warmth    │              │ ✨ Simplicity │
            │   (1-10)      │              │   (1-10)      │
            │               │              │               │
            │ • Encouraging │              │ • Breaks down │
            │ • Friendly    │              │   complexity  │
            │ • Safe space  │              │ • No jargon   │
            └──────────────┘              └──────────────┘
                         │
                         ▼
              ┌────────────────────┐
              │  📊 Overall Score   │
              │  (Weighted Average) │
              │  Favors Clarity    │
              │  & Patience        │
              └────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A [Vapi AI](https://vapi.ai) account (Public API Key)
- A [Google AI Studio](https://aistudio.google.com) account (Gemini API Key)
- A [Neon](https://neon.tech) PostgreSQL database

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-tutor-screener.git
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

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx drizzle-kit push` | Push schema to database |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB GUI) |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Gemini — Used for AI evaluation after interview
GEMINI_API_KEY=your_gemini_api_key_here

# Vapi AI — Voice conversation engine (Public Key, safe for client-side)
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key_here

# ElevenLabs — Voice ID for Nova's TTS (configured in Vapi)
ELEVENLABS_API_KEY=your_elevenlabs_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Neon Database — PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Where to get the keys:

| Key | Where to get it |
|-----|----------------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) → Create API Key |
| `NEXT_PUBLIC_VAPI_API_KEY` | [Vapi Dashboard](https://dashboard.vapi.ai) → Settings → Public Key |
| `ELEVENLABS_API_KEY` | [ElevenLabs](https://elevenlabs.io) → Profile → API Key |
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) → Connection Details |

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in the Vercel Dashboard → Project Settings → Environment Variables.

### Deploy to Other Platforms

The app is a standard Next.js application. It can be deployed to any platform that supports Node.js:

- **Vercel** (recommended) — Zero-config Next.js hosting
- **Railway** — Full-stack deployment
- **Render** — Docker or Node.js deployment
- **AWS Amplify** — Managed Next.js hosting

---

## Design System

The UI follows a **Neo-Brutalist / Kinetic Terminal** aesthetic:

- **Colors**: Black background, `#bcff5f` (acid green), `#ff51fa` (hot pink), `#00ffff` (cyan)
- **Typography**: Space Grotesk (geometric sans-serif)
- **Shadows**: Hard 4-8px offset box shadows (no blur)
- **Borders**: 4px solid, 0px border-radius
- **Animations**: Pulse glows, fade-in-up, shimmer, wave bars
- **Grid Pattern**: Subtle green grid lines as background texture

---

## License

This project is private and built for Cuemath's tutor screening process.

---

<p align="center">
  Built with 🧠 by <strong>NovaAI Team</strong> — Powered by Vapi, Gemini & Next.js
</p>
]]>
