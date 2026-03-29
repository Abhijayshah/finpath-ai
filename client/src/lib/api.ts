import axios from 'axios'
import type { ETRecommendation, FinancialScore, Message, Session, UserProfile } from '../../../shared/types'

const apiBaseUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5050'

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
})

export async function sendMessage(messages: Message[], sessionId: string): Promise<string> {
  const { data } = await api.post<{ text: string }>('/api/chat', { messages, sessionId })
  return data.text
}

export async function generateScore(
  profile: UserProfile,
  sessionId: string,
): Promise<{ score: FinancialScore; recommendations: ETRecommendation[] }> {
  const { data } = await api.post<{
    score: FinancialScore
    recommendations: ETRecommendation[]
  }>('/api/score', { profile, sessionId })
  return data
}

export async function getSession(sessionId: string): Promise<Session> {
  const { data } = await api.get<Session>(`/api/session/${encodeURIComponent(sessionId)}`)
  return data
}
