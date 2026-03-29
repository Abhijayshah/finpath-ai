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

