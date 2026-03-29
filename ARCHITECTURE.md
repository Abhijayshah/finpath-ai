# FinPath AI — Architecture Document 
 
## Agent Roles 
 
### 1. Profiling Agent (Groq Llama 3.3 70B) 
- Conducts 9-question financial profiling conversation 
- Outputs structured PROFILE_COMPLETE JSON when all data collected 
- Handles off-topic redirects and maintains conversation context 
 
### 2. Scoring Engine (server/src/routes/score.ts) 
- Converts raw UserProfile into FinancialScore across 6 dimensions 
- Rule-based weighted scoring logic 
- Outputs FinancialScore + ETRecommendation array 
 
### 3. Recommendation Engine 
- Maps profile to ET ecosystem products using priority rules 
- Always includes ET Prime 
- Conditional: ET Markets (if stocks/MF), ET Wealth (income >50k), 
  ET Insurance (no insurance), ET Retirement (retirement goal) 
 
## Data Flow 
1. User opens /chat → sessionId generated (UUID) 
2. Frontend auto-sends "Hello" → Profiling Agent responds 
3. Each message → POST /api/chat with full conversation history 
4. PROFILE_COMPLETE detected → POST /api/score called automatically 
5. Score + recommendations saved to MongoDB Session document 
6. Auto-redirect to /dashboard?sessionId=xxx 
7. Dashboard fetches via GET /api/session/:sessionId 
 
## Error Handling 
- Groq API failure → 500 with descriptive error message 
- MongoDB unavailable → chat still works, session not persisted 
- Missing env vars → clear startup error logged 
- Frontend API failure → inline error shown in chat UI 
 
## Database Schema 
``` 
Session { 
  sessionId: String (unique) 
  messages:  [{ role, content, timestamp }] 
  profile:   UserProfile 
  score:     FinancialScore 
  recommendations: [ETRecommendation] 
  createdAt, updatedAt 
} 
``` 
