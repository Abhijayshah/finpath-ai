export type FinancialGoal =
  | 'wealth building'
  | 'retirement'
  | 'child education'
  | 'buying home'
  | 'emergency fund'
  | 'tax saving'

export type InvestmentType = 'FD' | 'mutual funds' | 'stocks' | 'crypto' | 'PPF' | 'none'

export type RiskAppetite = 'conservative' | 'moderate' | 'aggressive'

export type UserProfile = {
  name: string
  age: number
  income: number
  expenses: number
  goals: FinancialGoal[]
  investments: InvestmentType[]
  riskAppetite: RiskAppetite
  insurance: string[]
  hasEmergencyFund: boolean
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type FinancialScore = {
  overall: number
  emergency: number
  insurance: number
  investments: number
  debt: number
  taxEfficiency: number
  retirement: number
}

export type ETRecommendation = {
  product: string
  reason: string
  link: string
  priority: 'high' | 'medium' | 'low'
}

export type SessionMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type Session = {
  sessionId: string
  messages: SessionMessage[]
  profile?: UserProfile
  score?: FinancialScore
  recommendations?: ETRecommendation[]
  createdAt: string
  updatedAt: string
}
