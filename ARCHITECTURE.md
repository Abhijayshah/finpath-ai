# FinPath AI — Architecture Document

Last Updated: 2026-03-29  
Doc Version: 1.1.0

This document describes the system at a level suitable for product engineers and judges: agent roles, system boundaries, data flow, tool integrations, and error handling.

---

## 1) System Diagram (1-page)

```mermaid
flowchart TD
  U[User] -->|Browser| FE[Client (React + TS + Vite)]
  FE -->|POST /api/chat\n(messages, sessionId)| API[Server (Express + TS)]
  API -->|OpenAI-compatible request| GROQ[Groq Chat Completions\nllama-3.3-70b-versatile]
  GROQ -->|Assistant text\n(+ optional <PROFILE_COMPLETE> JSON)| API

  FE -->|POST /api/score\n(profile, sessionId)| API
  API -->|save/read| DB[(MongoDB Atlas\nSession Store)]
  FE -->|GET /api/session/:sessionId| API
  API --> FE
```

---

## 2) Agent Roles

### 2.1 Profiling Agent (Groq Llama 3.3 70B)
- Location: `server/src/routes/chat.ts` (system prompt + Groq call)
- Responsibilities:
  - Conduct a strict 9-question profiling flow (one question per response)
  - Maintain conversational tone, redirect off-topic inputs
  - Output **valid JSON** inside `<PROFILE_COMPLETE> ... </PROFILE_COMPLETE>` only when all 9 answers are collected

### 2.2 Scoring Engine (Rule-based, server/src/routes/score.ts)
- Location: `server/src/routes/score.ts`
- Responsibilities:
  - Convert `UserProfile` into `FinancialScore` across 6 dimensions
  - Compute `overall` score as the average of dimensions
  - Return `{ score, recommendations }` and persist into the Session document

### 2.3 Recommendation Engine (ET ecosystem mapping)
- Location: `server/src/routes/score.ts` (same module as scoring)
- Responsibilities:
  - Always include ET Prime
  - Conditionally include:
    - ET Markets (if investments include stocks or mutual funds)
    - ET Wealth (if income > 50k)
    - ET Insurance (if no insurance)
    - ET Retirement (if primary goal is retirement)
    - ET Education (if primary goal is child education)

---

## 3) Communication & Tool Integrations

### 3.1 Client ↔ Server
- The client sends the full conversation transcript on each call so the model has context.
- The server stores sessions by `sessionId` (UUID) so the dashboard can load the full state later.

### 3.2 Server ↔ Groq
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Auth: `Authorization: Bearer ${process.env.GROQ_API_KEY}`
- Request format: OpenAI-compatible `{ model, messages, temperature, max_tokens }`
- Response parsing: `choices[0].message.content`

### 3.3 Server ↔ MongoDB
- Storage model: one Session document per `sessionId`
- Saved data:
  - messages (role/content/timestamp)
  - profile (once extracted)
  - score + recommendations (after scoring)

---

## 4) Data Flow (Start → Finish)

1. User opens `/chat`  
   - `sessionId` is generated/stored in localStorage (and optionally passed via query string).
2. Client auto-sends `"Hello"` to kick off the profiling flow.
3. Each user answer triggers `POST /api/chat` with `{ messages, sessionId }`.
4. Server sends the chat to Groq with a system prompt that enforces the 9-step sequence.
5. When Groq returns `<PROFILE_COMPLETE>`, the client parses it and calls `POST /api/score`.
6. Server computes `FinancialScore` + `ETRecommendation[]` and stores them in MongoDB.
7. Client redirects to `/dashboard?sessionId=...` and loads session state via `GET /api/session/:sessionId`.

---

## 5) Error Handling Logic

### 5.1 Groq API failures
- If Groq returns non-200, the server responds `502` with a descriptive error string in `{ text }`.
- Client shows inline error message and the user can retry.

### 5.2 MongoDB failures
- Server attempts persistence best-effort:
  - `/api/chat`: returns AI response even if Mongo write fails
  - `/api/score`: returns score/recs even if Mongo write fails (503 status)
  - `/api/session/:sessionId`: returns 503 if session store is unavailable
- Startup behavior:
  - Server logs a warning if Mongo connection fails, but still starts (so demo still works without persistence).

### 5.3 Missing environment variables
- Missing `GROQ_API_KEY` causes `/api/chat` to return a clear “misconfigured” message.
- Missing `MONGODB_URI` causes persistence to be unavailable (server still runs).

---

## 6) Database Schema

```text
Session {
  sessionId: String (unique)
  messages:  [{ role, content, timestamp }]
  profile:   UserProfile
  score:     FinancialScore
  recommendations: [ETRecommendation]
  createdAt, updatedAt
}
```

---

## 7) Notes for Future Iteration (TODO)

- Verify Google ID tokens server-side and issue signed sessions/JWT (optional for production hardening).
- Add rate limiting + abuse controls on `/api/chat` (protect Groq spend).
- Add scoring tests to prevent regressions and document scoring assumptions explicitly.
