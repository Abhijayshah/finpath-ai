import { Router } from 'express'
import type { FinancialGoal, InvestmentType, Message, RiskAppetite, UserProfile } from '../../../shared/types'
import { SessionModel } from '../models/Session'

type ChatRequestBody = {
  messages: Message[]
  sessionId: string
}

type ChatResponseBody = {
  text: string
}

const router = Router()

const SYSTEM_PROMPT = `You are FinPath AI, a warm and intelligent personal finance concierge for the Economic Times (ET) ecosystem. Your job is to profile the user through a natural conversation and guide them to the right ET products and services. 

Follow this EXACT profiling sequence — ask ONE question at a time, naturally: 
1. Greet warmly and ask their name 
2. Ask their age 
3. Ask their monthly income (in rupees) 
4. Ask their monthly expenses 
5. Ask their primary financial goal (options: wealth building, retirement, child education, buying home, emergency fund, tax saving) 
6. Ask their current investments (FD, mutual funds, stocks, crypto, PPF, none) 
7. Ask their risk appetite (conservative / moderate / aggressive) 
8. Ask if they have health/life insurance (yes/no) 
9. Ask if they have an emergency fund of 6 months expenses (yes/no) 
10. After collecting all info, say: "Great! I have everything I need. Let me build your personalized FinPath Score and ET journey..." then output a JSON block wrapped in <PROFILE_COMPLETE> tags with all collected data. 

Be conversational, warm, use emojis occasionally. Never ask more than one question per message. If user goes off-topic, gently bring them back.`

function normalizeGoal(value: unknown): FinancialGoal | null {
  if (typeof value !== 'string') return null
  const v = value.trim().toLowerCase()
  const allowed: FinancialGoal[] = [
    'wealth building',
    'retirement',
    'child education',
    'buying home',
    'emergency fund',
    'tax saving',
  ]
  return (allowed as string[]).includes(v) ? (v as FinancialGoal) : null
}

function normalizeInvestments(value: unknown): InvestmentType[] {
  const allowed: InvestmentType[] = ['FD', 'mutual funds', 'stocks', 'crypto', 'PPF', 'none']

  if (Array.isArray(value)) {
    const asStrings = value.filter((v): v is string => typeof v === 'string')
    const normalized = asStrings
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => (s.toLowerCase() === 'fd' ? 'FD' : s.toLowerCase() === 'ppf' ? 'PPF' : s.toLowerCase()))
      .map((s) => {
        if (s === 'FD' || s === 'PPF') return s
        return s
      })
      .filter((s) => (allowed as string[]).includes(s)) as InvestmentType[]

    return Array.from(new Set(normalized))
  }

  if (typeof value === 'string') {
    const parts = value.split(',').map((s) => s.trim())
    return normalizeInvestments(parts)
  }

  return []
}

function normalizeRisk(value: unknown): RiskAppetite {
  if (typeof value !== 'string') return 'moderate'
  const v = value.trim().toLowerCase()
  return v === 'conservative' || v === 'moderate' || v === 'aggressive' ? (v as RiskAppetite) : 'moderate'
}

function normalizeUserProfile(raw: unknown): UserProfile | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  const name = typeof r.name === 'string' ? r.name.trim() : ''
  const age = typeof r.age === 'number' ? r.age : Number(r.age)
  const income = typeof r.income === 'number' ? r.income : Number(r.income)
  const expenses = typeof r.expenses === 'number' ? r.expenses : Number(r.expenses)

  const goalFromGoalKey = normalizeGoal(r.goal)
  const goalsFromGoalsKey = Array.isArray(r.goals) ? r.goals.map(normalizeGoal).filter(Boolean) : []
  const goals: FinancialGoal[] = goalFromGoalKey ? [goalFromGoalKey] : (goalsFromGoalsKey as FinancialGoal[])

  const investments = normalizeInvestments(r.investments)

  const riskAppetite = normalizeRisk(r.riskAppetite ?? r.risk ?? r.risk_level)

  const hasEmergencyFund =
    typeof r.hasEmergencyFund === 'boolean'
      ? r.hasEmergencyFund
      : typeof r.emergencyFund === 'boolean'
        ? r.emergencyFund
        : typeof r.has_emergency_fund === 'boolean'
          ? r.has_emergency_fund
          : String(r.hasEmergencyFund ?? '').toLowerCase() === 'yes'

  const hasInsurance =
    typeof r.hasInsurance === 'boolean'
      ? r.hasInsurance
      : typeof r.insurance === 'boolean'
        ? r.insurance
        : typeof r.has_insurance === 'boolean'
          ? r.has_insurance
          : typeof r.insurance === 'string'
            ? r.insurance.trim().toLowerCase() === 'yes'
            : false

  const insuranceArray =
    Array.isArray(r.insurance) && r.insurance.every((x) => typeof x === 'string')
      ? (r.insurance as string[])
      : hasInsurance
        ? ['insured']
        : []

  if (!name || Number.isNaN(age) || Number.isNaN(income) || Number.isNaN(expenses) || goals.length === 0) {
    return null
  }

  return {
    name,
    age,
    income,
    expenses,
    goals,
    investments: investments.length > 0 ? investments : ['none'],
    riskAppetite,
    insurance: insuranceArray,
    hasEmergencyFund,
  }
}

function extractProfileFromClaudeText(text: string): UserProfile | null {
  const match = text.match(/<PROFILE_COMPLETE>([\s\S]*?)<\/PROFILE_COMPLETE>/i)
  if (!match) return null
  const jsonText = match[1]?.trim()
  if (!jsonText) return null

  try {
    const parsed = JSON.parse(jsonText) as unknown
    return normalizeUserProfile(parsed)
  } catch {
    return null
  }
}

router.post<{}, ChatResponseBody, ChatRequestBody>('/', async (req, res) => {
  const { messages, sessionId } = req.body

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ text: 'Invalid request: sessionId is required.' })
  }

  if (!Array.isArray(messages)) {
    return res.status(400).json({ text: 'Invalid request: messages must be an array.' })
  }

  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    return res.status(500).json({ text: 'Server misconfigured: CLAUDE_API_KEY is missing.' })
  }

  const claudeMessages = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({
      role: m.role,
      content: m.content,
    }))

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: claudeMessages,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      return res
        .status(502)
        .json({ text: `Claude API error (${response.status}): ${errorText || 'Unknown error'}` })
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>
    }

    const text =
      data.content?.find((c) => c.type === 'text')?.text ??
      'I had trouble generating a response. Please try again.'

    const assistantTimestamp = new Date().toISOString()
    const storedMessages = [
      ...messages
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: typeof m.timestamp === 'string' ? m.timestamp : assistantTimestamp,
        })),
      { role: 'assistant' as const, content: text, timestamp: assistantTimestamp },
    ]

    const extractedProfile = extractProfileFromClaudeText(text)

    await SessionModel.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          sessionId,
          messages: storedMessages,
          ...(extractedProfile ? { profile: extractedProfile } : {}),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )

    return res.json({ text })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error'
    return res.status(500).json({ text: message })
  }
})

export default router
