# details-for-developer.md

Last Updated: 2026-03-29  
Doc Version: 1.0.0

This document is intended to be living, developer-facing documentation for the FinPath AI codebase.  
Add new sections by extending the Table of Contents and keeping the same formatting style.

## Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Tech Stack](#2-tech-stack)
- [3. File Structure](#3-file-structure)
- [4. Key Components](#4-key-components)
- [5. Routing Structure](#5-routing-structure)
- [6. API Endpoints](#6-api-endpoints)
- [7. Styling System](#7-styling-system)
- [8. Environment Variables](#8-environment-variables)
- [9. Scripts & Commands](#9-scripts--commands)
- [10. Dependencies](#10-dependencies)
- [11. Deployment Notes](#11-deployment-notes)
- [12. Future Sections (Placeholder)](#12-future-sections-placeholder)

---

## 1. Project Overview

**Project name:** FinPath AI 🧭  
**Tagline:** Your Personal ET Finance Concierge

**What it does**
- FinPath AI runs a short, guided chat to collect a user’s financial profile (9 questions).
- It detects a structured `<PROFILE_COMPLETE>...</PROFILE_COMPLETE>` JSON payload produced by the AI.
- It generates a rule-based **FinPath Score** across 6 dimensions.
- It maps the user to the Economic Times (ET) ecosystem with product recommendations.
- It stores session data (messages, profile, score, recommendations) in MongoDB by `sessionId`.

**Main goal**
- Make ET discovery + personal finance guidance feel like a single “concierge journey” rather than multiple disconnected ET products.

**Target audience**
- ET readers/users who want a quick, conversational money “health check” and ET-aligned next steps.

---

## 2. Tech Stack

### Frontend
- **Framework:** React (client/package.json uses `react` + `react-dom`)
- **Routing:** `react-router-dom` (v7.x in client/package.json)
- **HTTP:** Axios (`client/src/lib/api.ts`)
- **Icons:** lucide-react (`client/package.json`)
- **Build tool:** Vite (`client/package.json`)
- **Language:** TypeScript

### Styling
- **Tailwind CSS:** `client/tailwind.config.js`, `client/postcss.config.js`
- **Global CSS:** `client/src/index.css`
- **Fonts:** Inter (UI/body) + Bricolage Grotesque (headings) loaded via Google Fonts in `client/index.html`
- **Theme:** light default + optional dark mode via `.dark` on `<html>` (see `client/src/context/ThemeContext.tsx`)

### Backend
- **Runtime:** Node.js
- **Framework:** Express (server/package.json uses `express` v5.x)
- **Language:** TypeScript (compiled to `server/dist/...` during build)
- **CORS:** `cors` middleware (global)

### Database
- **DB:** MongoDB Atlas (or any MongoDB URI)
- **ODM:** Mongoose (`server/src/models/Session.ts`)
- **Data model:** one Session document per `sessionId`

### AI Engine
- **Provider:** Groq
- **Endpoint:** `https://api.groq.com/openai/v1/chat/completions`
- **Model:** `llama-3.3-70b-versatile`
- **Implementation:** `server/src/routes/chat.ts` using OpenAI-compatible chat format

### Authentication
- **Client-side auth state:** React Context + localStorage (mock / demo level)
- **Google:** Google Identity Services button on the login page (client-side only; no backend verification in this repo yet)
- **Email login:** demo email login (client-side only; no password)

> Architectural note: This repo intentionally keeps auth lightweight for demo/hackathon use. The server does not issue or validate JWTs currently.

### State Management
- React Context:
  - Auth: `client/src/context/AuthContext.tsx` + `client/src/context/authStore.ts`
  - Theme: `client/src/context/ThemeContext.tsx` + `client/src/context/themeStore.ts`
- Session ID persistence: `localStorage.finpath_session_id`

### Package Manager
- npm (package-lock.json present at root, client, and server)

### Deployment
- **Frontend:** Vercel (static Vite build)
- **Backend:** Render (Node service)
- **Ports:**
  - Local dev defaults to `PORT=5050` to avoid macOS conflicts.
  - Production uses the platform-provided `PORT` env (Render).

---

## 3. File Structure

Below is the **actual** structure at repo root. Descriptions use exact file/folder names from this project.

```text
finpath-ai/
├── client/
│   ├── public/
│   │   ├── favicon.svg               # App favicon
│   │   └── icons.svg                 # Static icons asset
│   ├── src/
│   │   ├── assets/                   # Image assets used in UI
│   │   ├── components/
│   │   │   ├── BottomNav.tsx         # Mobile bottom navigation (lucide icons)
│   │   │   ├── ChatBubble.tsx        # UI for user/assistant chat message bubble + timestamp
│   │   │   ├── Navbar.tsx            # Desktop navbar + theme toggle
│   │   │   ├── RecommendationCard.tsx# ET recommendation card + external link CTA
│   │   │   └── ScoreCard.tsx         # Legacy score card component (kept for reuse/extension)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Provider wiring auth state from localStorage into React Context
│   │   │   ├── ThemeContext.tsx      # Provider wiring theme state from localStorage into React Context
│   │   │   ├── authStore.ts          # AuthContext types + helpers (read/write localStorage)
│   │   │   └── themeStore.ts         # ThemeContext types + hook
│   │   ├── lib/
│   │   │   └── api.ts                # Axios client + API wrapper functions
│   │   ├── pages/
│   │   │   ├── ChatPage.tsx          # Main 9-question chat UI + PROFILE_COMPLETE detection + auto-redirect
│   │   │   ├── DashboardPage.tsx     # FinPath Score ring + dimension cards + recommendations + next steps
│   │   │   ├── LandingPage.tsx       # Premium marketing landing page with theme toggle
│   │   │   ├── LoginPage.tsx         # Email login + Google Identity Services login
│   │   │   └── SettingsPage.tsx      # Profile + preferences + logout
│   │   ├── types/
│   │   │   └── global.d.ts           # Window.google typings for Google Identity Services
│   │   ├── App.tsx                   # Router + global layout (Navbar + BottomNav)
│   │   ├── main.tsx                  # React root + providers (ThemeProvider, AuthProvider, BrowserRouter)
│   │   └── index.css                 # Global styles + animations + font declarations
│   ├── index.html                    # Vite HTML entry (fonts loaded here)
│   ├── tailwind.config.js            # Tailwind theme tokens (colors, fonts)
│   ├── vite.config.ts                # Vite config
│   ├── eslint.config.js              # ESLint configuration
│   ├── tsconfig*.json                # TypeScript configs (app + node)
│   ├── .env.example                  # Example env vars (non-secret)
│   └── package.json                  # Client deps + scripts
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # Mongo connection helper (returns boolean; does not crash app)
│   │   ├── middleware/
│   │   │   └── errorHandler.ts       # notFoundHandler + errorHandler
│   │   ├── models/
│   │   │   └── Session.ts            # Mongoose Session schema (messages, profile, score, recs)
│   │   ├── routes/
│   │   │   ├── chat.ts               # POST /api/chat (Groq + session save + PROFILE_COMPLETE extraction)
│   │   │   ├── score.ts              # POST /api/score (rule-based scoring + ET recommendations + save)
│   │   │   ├── session.ts            # GET /api/session/:sessionId (load persisted session)
│   │   │   ├── profile.ts            # GET/POST /api/profile (in-memory profile; legacy/demo)
│   │   │   └── index.ts              # Aggregates all /api routes
│   │   ├── app.ts                    # Express app setup + production static serving of client/dist
│   │   └── index.ts                  # Server entrypoint (dotenv, mongo connect, listen)
│   ├── tsconfig.json                 # Server TS build config
│   ├── .env.example                  # Example env vars (non-secret)
│   └── package.json                  # Server deps + scripts
├── shared/
│   └── types.ts                      # Shared types consumed by both client and server
├── README.md                         # Submission README
├── ARCHITECTURE.md                   # Architecture doc (high-level)
├── details-for-developer.md          # This document
└── package.json                      # Root scripts (dev/build/install:all/start)
```

> Architectural note: `shared/types.ts` is imported by both the client and server via relative paths to keep request/response contracts consistent without publishing a separate package.

---

## 4. Key Components

### App shell and providers

**App**
- **Path:** `client/src/App.tsx`
- **Purpose:** Defines routes, sets global background, mounts `Navbar` (desktop) + `BottomNav` (mobile).
- **Dependencies:** `react-router-dom`

**ThemeProvider**
- **Path:** `client/src/context/ThemeContext.tsx`
- **Purpose:** Controls `Theme` (`light` | `dark`), persists to `localStorage.finpath_theme`, toggles `.dark` on `<html>`.
- **Used by:** `client/src/main.tsx` wraps the whole app.

**AuthProvider**
- **Path:** `client/src/context/AuthContext.tsx`
- **Purpose:** Stores mock user session in localStorage (`finpath_user`) and exposes `login()` / `logout()`.
- **Used by:** `client/src/main.tsx` wraps the whole app.

### Navigation

**Navbar**
- **Path:** `client/src/components/Navbar.tsx`
- **Purpose:** Desktop navigation with theme toggle.
- **Props:** none
- **Dependencies:** `react-router-dom`, `lucide-react`, `useTheme()`, `useAuth()`

**BottomNav**
- **Path:** `client/src/components/BottomNav.tsx`
- **Purpose:** Mobile app-like bottom navigation with lucide icons + active indicator.
- **Props:** none
- **Dependencies:** `react-router-dom`, `lucide-react`, `useAuth()`

### Chat and conversation UI

**ChatPage**
- **Path:** `client/src/pages/ChatPage.tsx`
- **Purpose:** End-to-end conversation flow:
  - Loads session messages from `GET /api/session/:sessionId`
  - Auto-sends `Hello` to begin the profiling flow
  - Calls `POST /api/chat` to get AI response
  - Detects `<PROFILE_COMPLETE>` and extracts JSON
  - Calls `POST /api/score` to generate score + recommendations
  - Redirects to `/dashboard?sessionId=...`
- **Key state:**
  - `sessionId` in localStorage + query param
  - `messages` state + `messagesRef` to avoid stale closure in async sends
  - `progressPercent` derived from assistant message count (11% per AI prompt)
- **Dependencies:** `sendMessage()`, `generateScore()`, `getSession()` from `client/src/lib/api.ts`

**ChatBubble**
- **Path:** `client/src/components/ChatBubble.tsx`
- **Purpose:** Renders a single message bubble with timestamp.
- **Props:** `message: Message`

### Dashboard UI

**DashboardPage**
- **Path:** `client/src/pages/DashboardPage.tsx`
- **Purpose:** Reads the session from `GET /api/session/:sessionId` and renders:
  - Score ring (SVG)
  - 6 dimension score cards
  - ET recommendations
  - Next 3 steps
- **Animation:** ring + bars animate using `setInterval` driven counters.
- **Dependencies:** `RecommendationCard`, `getSession()`

**RecommendationCard**
- **Path:** `client/src/components/RecommendationCard.tsx`
- **Purpose:** Displays an ETRecommendation with priority pill + external link CTA.
- **Props:** `rec: ETRecommendation`
- **Dependencies:** `lucide-react` (ExternalLink)

### Auth / Settings UI

**LoginPage**
- **Path:** `client/src/pages/LoginPage.tsx`
- **Purpose:** Two login options:
  - Email login (client-side only)
  - Google Identity Services button (client-side only; decodes JWT payload client-side)
- **Note:** No server verification of the Google ID token is implemented yet.

**SettingsPage**
- **Path:** `client/src/pages/SettingsPage.tsx`
- **Purpose:** Profile display, theme toggle, logout with confirmation.

---

## 5. Routing Structure

### Client routes (React Router)
Defined in `client/src/App.tsx`:
- `/` → `LandingPage`
- `/login` → `LoginPage`
- `/chat` → `ChatPage`
- `/dashboard` → `DashboardPage`
- `/settings` → `SettingsPage`

**Dynamic routes**
- None (no route params in client routing).

**Query params**
- `/chat?sessionId=...` and `/dashboard?sessionId=...` are used for session scoping.

**Protected routes**
- None enforced. Auth is demo-level; pages can still be accessed when not logged in.

---

## 6. API Endpoints

Base URL is `VITE_API_URL` (client) + `/api/*` routes (server).

### Health
**GET `/health`**
- **Response:** `{ "ok": true }`

### Chat (Groq)
**POST `/api/chat`**
- **Implemented in:** `server/src/routes/chat.ts`
- **Request body:**
```json
{
  "sessionId": "string",
  "messages": [
    { "id": "string", "role": "user|assistant", "content": "string", "timestamp": "ISO string" }
  ]
}
```
- **Response body:**
```json
{ "text": "string" }
```
- **Behavior notes (inline architecture comments):**
  - The server forwards the full conversation to Groq using OpenAI-compatible chat format, including a system prompt as the first message.
  - The server attempts to parse `<PROFILE_COMPLETE>...</PROFILE_COMPLETE>` from the AI response and normalize it into `UserProfile`.
  - Messages + (optional) extracted profile are persisted into MongoDB Session (best-effort; API still returns text if Mongo is unavailable).

### Score
**POST `/api/score`**
- **Implemented in:** `server/src/routes/score.ts`
- **Request body:**
```json
{
  "sessionId": "string",
  "profile": {
    "name": "string",
    "age": 0,
    "income": 0,
    "expenses": 0,
    "goals": ["wealth building|retirement|child education|buying home|emergency fund|tax saving"],
    "investments": ["FD|mutual funds|stocks|crypto|PPF|none"],
    "riskAppetite": "conservative|moderate|aggressive",
    "insurance": ["string"],
    "hasEmergencyFund": true
  }
}
```
- **Response body:**
```json
{
  "score": {
    "overall": 0,
    "emergency": 0,
    "insurance": 0,
    "investments": 0,
    "debt": 0,
    "taxEfficiency": 0,
    "retirement": 0
  },
  "recommendations": [
    { "product": "string", "reason": "string", "link": "string", "priority": "high|medium|low" }
  ]
}
```
- **Auth required:** No
- **Persistence:** Saves score + recommendations to the Session document (best-effort; returns 503 with computed body if DB is down).

### Session fetch
**GET `/api/session/:sessionId`**
- **Implemented in:** `server/src/routes/session.ts`
- **Response body:** `Session` object from `shared/types.ts`
- **Auth required:** No

### Profile (legacy/demo)
**GET `/api/profile`**
**POST `/api/profile`**
- **Implemented in:** `server/src/routes/profile.ts`
- **Storage:** in-memory only (does not persist)
- **Note:** This route is not required for the main chat→dashboard flow; session persistence is handled by `SessionModel`.

---

## 7. Styling System

### Methodology
- Tailwind-first utility styling across all TSX components.
- Minimal global CSS in `client/src/index.css` for:
  - Font families
  - Theme transitions
  - Keyframe animations (fadeIn, slideUp, pulseGlow, shimmer)

### Design tokens
- Tailwind extended colors in `client/tailwind.config.js`:
  - `etOrange`, `appBg`, `appBgAlt`, `card`, `border`, `textPrimary`, `textSecondary`
- Dark theme uses Tailwind `dark:` variants with `.dark` class set on `<html>`.

### Responsive breakpoints
- Tailwind defaults are used (sm/md/lg/...).
- Desktop navbar is `md:block` and BottomNav is `md:hidden`.

### Animations
Defined in `client/src/index.css`:
- `.animate-fadeIn` / `.animate-slideUp`
- `.animate-pulseGlow` (used for dashboard score ring)
- `.stagger-children` helper for cascading animation delays
- `.shimmer` loading background utility

---

## 8. Environment Variables

Do **not** commit `.env` files. Use `.env.example` as templates and platform dashboards (Vercel/Render) for real deployments.

### Client (`client/.env`)
- `VITE_API_URL`  
  - **Purpose:** Base URL for API calls (Axios baseURL).
  - **Used by:** `client/src/lib/api.ts`
  - **Example:** `https://finpath-ai.onrender.com`
- `VITE_GOOGLE_CLIENT_ID`  
  - **Purpose:** Enables Google Identity Services button on `LoginPage`.
  - **Used by:** `client/src/pages/LoginPage.tsx`

### Server (`server/.env`)
- `MONGODB_URI`
  - **Purpose:** MongoDB connection string for session persistence.
  - **Used by:** `server/src/index.ts` → `connectToMongo()` → `mongoose.connect()`
- `GROQ_API_KEY`
  - **Purpose:** Auth for Groq API calls.
  - **Used by:** `server/src/routes/chat.ts` (Authorization header)
- `PORT`
  - **Purpose:** Server listen port (local dev uses 5050 by default).
  - **Used by:** `server/src/index.ts`
- `NODE_ENV`
  - **Purpose:** Enables production behavior (serving `client/dist` from `server/src/app.ts`).
  - **Used by:** `server/src/app.ts`

### TODO / currently unused env vars
These are sometimes present in local `.env` files but are not used by the current codebase:
- `JWT_SECRET` (no server-side JWT auth is implemented)
- `SITE_URL`, `SITE_NAME` (not referenced in server/client code)
- `OPENROUTER_API_KEY` (the code uses Groq, not OpenRouter)
- `GOOGLE_CLIENT_ID` (client uses `VITE_GOOGLE_CLIENT_ID`; server does not need this currently)

---

## 9. Scripts & Commands

### Repo root (`package.json`)
```bash
npm run dev          # Runs server + client concurrently (local development)
npm run build        # Builds server (tsc) and client (vite build)
npm run install:all  # Installs deps in server and client
npm run start        # Starts server in production mode (uses built dist output)
```

### Client (`client/package.json`)
```bash
npm run dev --prefix client      # Starts Vite dev server
npm run build --prefix client    # TypeScript build + Vite production build
npm run lint --prefix client     # ESLint
npm run preview --prefix client  # Vite preview of built assets
```

### Server (`server/package.json`)
```bash
npm run dev --prefix server       # ts-node-dev, transpile-only (fast iteration)
npm run typecheck --prefix server # TypeScript typecheck (no emit)
npm run build --prefix server     # TypeScript compile to dist/
npm run start --prefix server     # node dist/server/src/index.js
```

---

## 10. Dependencies

### Client (major)
- `react`, `react-dom` — UI framework
- `react-router-dom` — SPA routing
- `axios` — API client wrapper
- `lucide-react` — icon system
- `tailwindcss`, `postcss`, `autoprefixer` — styling pipeline
- `vite` — dev server and build tool

### Server (major)
- `express` — API server
- `cors` — CORS middleware
- `mongoose` — MongoDB ODM
- `dotenv` — env loading (via `dotenv/config`)
- `typescript` + `@types/*` — build-time types (kept in dependencies to satisfy Render builds)

---

## 11. Deployment Notes

### Vercel (frontend)
- Build: `client` is a Vite app → deploy `client/dist`.
- Required env vars:
  - `VITE_API_URL=https://finpath-ai.onrender.com`
  - `VITE_GOOGLE_CLIENT_ID=...` (if Google login is desired)

### Render (backend)
- Build: `npm install && npm run build` inside `server`
- Start: `npm run start`
- Required env vars:
  - `MONGODB_URI=...`
  - `GROQ_API_KEY=...`
  - `NODE_ENV=production`
  - Render provides `PORT` automatically; do not hardcode it in Render.

> Architectural note: Render builds often run with production installs. To keep `tsc` builds working reliably on Render, TypeScript and the `@types/*` packages are included in `server/dependencies`.

### Known behavior
- Hitting the Render root (`GET /`) returns “Route not found” unless the server also has access to a built `client/dist` folder. In the Vercel+Render split deployment, this is expected because Vercel serves the frontend separately.

---

## 12. Future Sections (Placeholder)

Add new sections here as the project evolves:
- **Testing Strategy** (TODO: no automated tests in repo yet)
- **Real Authentication** (TODO: verify Google ID token server-side, issue session/JWT)
- **Observability** (logging, metrics, tracing)
- **Rate limiting & abuse protection** (Groq API cost control)
- **Prompt versioning & evaluation** (A/B prompt changes, regression checks)

