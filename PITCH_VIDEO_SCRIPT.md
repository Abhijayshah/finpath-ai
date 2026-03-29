# FinPath AI — 3-Minute Pitch Video Script

Last Updated: 2026-03-29  
Target Duration: ~3 minutes

## 0:00–0:15 — Hook (Problem)

Hi, I’m Abhijay, and this is **FinPath AI** — your personal ET finance concierge.

ET has a massive ecosystem — **ET Prime, ET Markets, ET Wealth, Insurance, Retirement, learning** — but most users discover only a small fraction of what’s available.
At the same time, **95% of Indians don’t have a financial plan**, and professional advisors are expensive and mostly serve HNIs.

## 0:15–0:40 — Solution (What we built)

FinPath AI solves this with a simple idea:
**One 3-minute conversation** that produces:
- a structured user profile,
- a **FinPath Score** across 6 dimensions,
- and a **personalized ET journey** with direct product recommendations.

It works end-to-end, stores the session in MongoDB, and is fast because it uses **Groq Llama 3.3 70B**.

## 0:40–1:10 — Architecture (How it works)

Here’s the high-level flow:
- The user chats on the React frontend.
- The frontend calls `POST /api/chat` on our Express server.
- The server sends an OpenAI-compatible request to Groq.
- The AI asks **one profiling question at a time**.
- When complete, the AI outputs a JSON payload inside `<PROFILE_COMPLETE>`.
- The frontend detects this, calls `POST /api/score`, and redirects to the dashboard.
- Everything is saved by `sessionId` in MongoDB Atlas.

## 1:10–2:30 — Live Demo (Show workflow start to finish)

I’m going to demo the full workflow now.

1) From the landing page, I click **Get Started**.

2) FinPath AI starts the chat and asks for my name.  
(Answer with a realistic name)

3) It asks my age.  
(Answer a number)

4) It asks my monthly income in rupees.  
(Answer a number)

5) It asks my monthly expenses.  
(Answer a number)

6) It asks my primary goal.  
(Choose one: wealth building / retirement / child education / buying home / emergency fund / tax saving)

7) It asks my current investments.  
(Choose: FD / mutual funds / stocks / crypto / PPF / none)

8) It asks my risk appetite.  
(conservative / moderate / aggressive)

9) It asks if I have insurance (yes/no).  
(Answer)

10) It asks if I have an emergency fund covering 6 months (yes/no).  
(Answer)

At this point, the AI confirms it has everything and outputs `<PROFILE_COMPLETE>` in the background.
The app automatically generates my **FinPath Score** and redirects to the dashboard.

On the dashboard:
- I see an overall score ring, animated from 0 to the final score.
- I see 6 dimension breakdown cards: Emergency Fund, Insurance, Investments, Debt Health, Tax Efficiency, Retirement.
- I see ET recommendations like **ET Prime** plus conditional products (Markets, Wealth, Insurance, Retirement).
- I see **Next 3 Steps**, based on my lowest scoring dimensions.

## 2:30–2:55 — Impact (Why this matters)

This improves ET discovery and monetization by:
- Increasing product discovery from ~10% to ~60% of the ecosystem for users who complete a session,
- Driving higher engagement because the journey is personalized,
- Increasing cross-sell conversion by recommending the right ET product at the right time.

## 2:55–3:00 — Close

That’s FinPath AI — a complete concierge journey from chat → score → ET recommendations, fully deployed and session-persistent.
Thank you.

