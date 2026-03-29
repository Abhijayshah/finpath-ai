# FinPath AI 🧭 
### Your Personal ET Finance Concierge 
**ET AI Hackathon 2026 | Problem Statement 7 — AI Concierge for ET** 
 
## 🎯 Problem 
ET has a massive ecosystem — ET Prime, ET Markets, masterclasses, wealth summits, 
and financial services partnerships. But most users discover only 10% of what ET offers. 
Meanwhile, 95% of Indians have no financial plan and professional advisors charge 
₹25,000+/year serving only HNIs. 
 
## 💡 Solution 
FinPath AI is a conversational AI concierge that profiles any ET user in under 3 minutes, 
generates a personalized Money Health Score across 6 dimensions, and maps them to the 
exact ET products and services that match their financial life. 
 
## ✨ Features 
- 💬 Smart Profiling Chat — 9-question AI conversation powered by Groq Llama 3 
- 📊 FinPath Score — Personalized score across 6 financial dimensions 
- 🗺️ ET Ecosystem Map — Tailored recommendations for ET Prime, Markets, Wealth, Insurance 
- 🛡️ Session Persistence — MongoDB stores every user journey 
- 📱 Mobile Responsive — Works on all devices 
- ⚡ Real-time AI — Sub-second responses via Groq 
 
## 🏗️ Architecture 
``` 
User Browser (React + TypeScript) 
         │ 
         ▼ 
   Chat Interface → Progress Bar → Dashboard 
         │ 
         ▼ 
  Express API Server (Node.js + TypeScript) :5050 
         │ 
    ┌────┴────┐ 
    ▼         ▼ 
Groq API   MongoDB Atlas 
(Llama 3)  (Session Store) 
``` 
 
## 🛠️ Tech Stack 
| Layer | Technology | 
|---|---| 
| Frontend | React 18 + TypeScript + Vite | 
| Styling | Tailwind CSS | 
| Backend | Node.js + Express + TypeScript | 
| Database | MongoDB Atlas + Mongoose | 
| AI Engine | Groq API — Llama 3.3 70B | 
| Routing | React Router DOM v6 | 
 
## 🚀 Quick Start 
```bash 
git clone `https://github.com/YOUR_USERNAME/finpath-ai.git` 
cd finpath-ai 
npm run install:all 
cp server/.env.example server/.env 
# Add MONGODB_URI, GROQ_API_KEY, PORT=5050 
cp client/.env.example client/.env 
# Add VITE_API_URL=http://localhost:5050 
npm run dev 
``` 
Open http://localhost:5173 
 
## 📊 Impact Model 
| Metric | Estimate | 
|---|---| 
| ET ecosystem discovery | 10% → 60% of products | 
| Session engagement | +4 min average | 
| Cross-sell conversion | 3x baseline | 
| Financial advisor cost saved | ₹25,000/year per user | 
 
## 👨‍💻 Team 
Abhijay Kumar Shah — B.Tech CS, VIT | Co-founder CatCatchCode 
Email: abhijayshah74@gmail.com 
 
*Built for ET AI Hackathon 2026* 
