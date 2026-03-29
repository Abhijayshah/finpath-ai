# FinPath AI 🧭  
## Your Personal ET Finance Concierge  
**ET AI Hackathon 2026 | Problem Statement 7 — AI Concierge for ET**

## 👨‍💻 Team Name: abhijayshah74
- Abhijay Kumar Shah -Team leader +917879028316
- Uttam Kumar +919109966274
- Deepak Goutam +919811759060


### Demo Video Link : https://www.youtube.com/playlist?list=PLfXvNZFBCcFSLL0b2uJuGu0WYKCyhy04Y 

### Github link : https://github.com/Abhijayshah/finpath-ai 

### Live Website link : https://finpath-ai.vercel.app/ 


 
<!-- ## ✅ Submission Requirements
- Public GitHub repo: `https://github.com/YOUR_USERNAME/finpath-ai` (replace with your final repo URL)
- README (this file): setup + architecture + deployment
- 3-minute pitch video script: [PITCH_VIDEO_SCRIPT.md](file:///Volumes/VideoAPFS/projects-ssd/finpath-ai/PITCH_VIDEO_SCRIPT.md)
- Architecture document: [ARCHITECTURE.md](file:///Volumes/VideoAPFS/projects-ssd/finpath-ai/ARCHITECTURE.md)
- Developer deep-dive: [details-for-developer.md](file:///Volumes/VideoAPFS/projects-ssd/finpath-ai/details-for-developer.md)
- Impact model: [IMPACT_MODEL.md](file:///Volumes/VideoAPFS/projects-ssd/finpath-ai/IMPACT_MODEL.md) -->

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
| Frontend | React + TypeScript + Vite | 
| Styling | Tailwind CSS | 
| Backend | Node.js + Express + TypeScript | 
| Database | MongoDB Atlas + Mongoose | 
| AI Engine | Groq API — Llama 3.3 70B | 
| Routing | React Router DOM | 
 
## 🚀 Quick Start 
```bash 
git clone https://github.com/YOUR_USERNAME/finpath-ai.git
cd finpath-ai 
npm run install:all 
cp server/.env.example server/.env 
# Add MONGODB_URI, GROQ_API_KEY, PORT=5050 
cp client/.env.example client/.env 
# Add VITE_API_URL=http://localhost:5050 
npm run dev 
``` 
Open http://localhost:5173 

## 🔑 Environment Variables

### Server (`server/.env`)
- `MONGODB_URI` — MongoDB Atlas connection string (session persistence)
- `GROQ_API_KEY` — Groq API key for Llama 3.3 chat completions
- `PORT` — local server port (recommended: `5050`)
- `NODE_ENV` — set `production` on Render

### Client (`client/.env`)
- `VITE_API_URL` — API base URL  
  - Local: `http://localhost:5050`  
  - Production: `https://YOUR_RENDER_SERVICE.onrender.com`
- `VITE_GOOGLE_CLIENT_ID` — Google Identity Services client ID (optional; enables Google login)

## 🚢 Deployment (Vercel + Render)

### Backend (Render)
- Create a Node Web Service from this repo.
- Root directory: `server`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment variables on Render:
  - `MONGODB_URI`
  - `GROQ_API_KEY`
  - `NODE_ENV=production`
  - Do not set `PORT` manually (Render injects it)

### Frontend (Vercel)
- Import the repo in Vercel.
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables on Vercel:
  - `VITE_API_URL=https://YOUR_RENDER_SERVICE.onrender.com`
  - `VITE_GOOGLE_CLIENT_ID=...` (optional)
 
## 📊 Impact Model 
| Metric | Estimate | 
|---|---| 
| ET ecosystem discovery | 10% → 60% of products | 
| Session engagement | +4 min average | 
| Cross-sell conversion | 3x baseline | 
| Financial advisor cost saved | ₹25,000/year per user | 
 
## 👨‍💻 Team Name: abhijayshah74
- Abhijay Kumar Shah -Team leader +917879028316
- Uttam Kumar +919109966274
- Deepak Goutam +919811759060
 
*Built for ET AI Hackathon 2026* 
