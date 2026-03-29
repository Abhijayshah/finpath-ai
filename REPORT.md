# FinPath AI — Combined Report

Last Updated: 2026-03-29  
Includes: ARCHITECTURE.md + IMPACT_MODEL.md

---

## Architecture

<!-- Source: ARCHITECTURE.md -->

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

---

## Impact Model

<!-- Source: IMPACT_MODEL.md -->

# FinPath AI — Impact Model

Last Updated: 2026-03-29  
Doc Version: 1.0.0

This document provides a quantified, back-of-envelope estimate of FinPath AI’s business impact.  
All numbers are directional and based on stated assumptions.

## 1) Summary (What impact to expect)
- Higher ET ecosystem discovery (more ET products discovered per user session)
- Higher engagement (longer and more frequent sessions)
- Higher cross-sell conversion (more users clicking into ET properties)
- Lower support/advisor cost-to-serve (self-serve finance guidance for mass users)

---

## 2) Assumptions

These assumptions are adjustable. Update the numbers as real analytics become available.

### User and traffic assumptions
- Monthly unique ET users exposed to FinPath entry point: **1,000,000**
- FinPath start rate (users who click “Start My Journey”): **2%**
- Chat completion rate (users who finish 9 questions): **35%**
- Recommendation CTR (users who click at least one ET recommendation): **25%**

### Monetization assumptions (simplified)
- ET Prime net revenue per conversion (blended monthly value): **₹99**
- Probability a recommendation click leads to a paid action within 7 days:
  - ET Prime: **3%**
  - Other ET properties: tracked as engagement uplift (not directly monetized in this model)

### Cost assumptions
- Human advisor cost to user for a basic plan: **₹25,000 / year** (given in prompt)
- We assume FinPath serves as a “good enough” first plan for mass users.
- Groq cost is not modeled here (can be added when real token pricing is finalized).

---

## 3) Funnel Math (Monthly)

### Step A — Sessions completed
- Exposed: 1,000,000
- Start rate 2% → starts = 1,000,000 × 0.02 = **20,000**
- Completion rate 35% → completed sessions = 20,000 × 0.35 = **7,000**

### Step B — ET ecosystem clicks
- Recommendation CTR 25% → users clicking at least one recommendation  
  = 7,000 × 0.25 = **1,750 clicks/users**

This is the “ecosystem discovery” engine: FinPath drives users into Prime/Markets/Wealth/Insurance/Retirement based on profile rules.

---

## 4) Revenue Recovered / Generated (Illustrative)

### ET Prime conversions from FinPath
- Clickers: 1,750
- Prime conversion rate after click: 3% → Prime conversions = 1,750 × 0.03 = **52.5 ≈ 53**
- Net revenue per conversion: ₹99

**Estimated monthly net revenue from Prime = 53 × ₹99 = ₹5,247**

> This number is intentionally conservative. Prime revenue can be significantly higher if you model annual plans, higher ARPU, or better conversion due to personalization.

---

## 5) Cost-to-Serve Reduction (Advisory substitution model)

FinPath is not a complete replacement for a human advisor, but it can:
- Provide a baseline plan for the majority of users
- Reduce demand on support, call centers, and advisory services

If **only 1%** of completed sessions (7,000) would otherwise pay for a basic plan:
- Users = 7,000 × 0.01 = **70 users/month**
- Annual advisor cost avoided per user = ₹25,000/year

**Annualized cost avoided ≈ 70 × ₹25,000 = ₹17,50,000 per month-cohort**  
If you treat each month as a new cohort, this compounds as adoption grows.

---

## 6) Time Saved (User value proxy)

Assume a user typically needs:
- 60 minutes to research basic “what should I do next” finance questions (articles + videos)
- FinPath reduces that to ~3 minutes chat + ~2 minutes dashboard review = **5 minutes**

Time saved per completed session:
- 60 − 5 = **55 minutes**

Monthly time saved (completed sessions = 7,000):
- 7,000 × 55 minutes = **385,000 minutes**
- = **6,416 hours** saved per month

---

## 7) What to Measure Next (TODO)

Add these events/metrics to validate assumptions:
- Funnel: landing → chat start → chat completion → dashboard view
- Recommendation clicks by product (Prime/Markets/Wealth/Insurance/Retirement)
- Prime conversion attribution window (7/14/30 day)
- Repeat usage: sessions per user per month
- Cost: average tokens/session and cost/session
