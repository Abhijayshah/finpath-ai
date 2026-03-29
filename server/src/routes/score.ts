import { Router } from 'express'
import type { ETRecommendation, FinancialScore, UserProfile } from '../../../shared/types'
import { SessionModel } from '../models/Session'

type ScoreRequestBody = {
  profile: UserProfile
  sessionId: string
}

type ScoreResponseBody = {
  score: FinancialScore
  recommendations: ETRecommendation[]
}

const router = Router()

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

router.post<{}, ScoreResponseBody, ScoreRequestBody>('/', async (req, res) => {
  const { profile, sessionId } = req.body

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({
      score: {
        overall: 0,
        emergency: 0,
        insurance: 0,
        investments: 0,
        debt: 0,
        taxEfficiency: 0,
        retirement: 0,
      },
      recommendations: [],
    })
  }

  const hasInsurance =
    Array.isArray(profile.insurance) &&
    profile.insurance.some((v) => typeof v === 'string' && v.trim().toLowerCase() !== 'no')

  const emergency = profile.hasEmergencyFund ? 100 : 20
  const insurance = hasInsurance ? 100 : 15

  const investmentSet = new Set(
    (profile.investments ?? []).map((v) => (typeof v === 'string' ? v.trim().toLowerCase() : '')),
  )

  const investments = (() => {
    if (investmentSet.size === 0 || (investmentSet.size === 1 && investmentSet.has('none'))) return 10
    if (investmentSet.size === 1 && investmentSet.has('fd')) return 40
    if (investmentSet.size === 1 && investmentSet.has('mutual funds')) return 70
    if (investmentSet.size === 1 && investmentSet.has('stocks')) return 80
    if (investmentSet.size === 1 && investmentSet.has('ppf')) return 55
    if (investmentSet.size === 1 && investmentSet.has('crypto')) return 30
    if (investmentSet.has('stocks') && investmentSet.has('mutual funds') && investmentSet.size === 2)
      return 90
    if (investmentSet.size >= 3) return 100
    if (investmentSet.has('mutual funds')) return 75
    return 60
  })()

  const debt = 80

  const taxEfficiency = profile.goals?.includes('tax saving') ? 90 : 50

  const isInvesting = investmentSet.size > 0 && !investmentSet.has('none')
  const retirement = (() => {
    if (profile.age < 30) return 60
    if (profile.age < 40) return 70
    return isInvesting ? 85 : 70
  })()

  const overall = clampScore((emergency + insurance + investments + debt + taxEfficiency + retirement) / 6)

  const score: FinancialScore = {
    overall,
    emergency,
    insurance,
    investments,
    debt,
    taxEfficiency,
    retirement,
  }

  const recommendations: ETRecommendation[] = []

  recommendations.push({
    product: 'ET Prime',
    reason: 'Unlock expert explainers and in-depth personal finance coverage from ET.',
    link: 'https://economictimes.indiatimes.com/prime',
    priority: 'high',
  })

  if (investmentSet.has('stocks') || investmentSet.has('mutual funds')) {
    recommendations.push({
      product: 'ET Markets',
      reason: 'Track markets, build watchlists, and stay on top of investing insights.',
      link: 'https://economictimes.indiatimes.com/markets',
      priority: 'high',
    })
  }

  if (profile.income > 50000) {
    recommendations.push({
      product: 'ET Wealth',
      reason: 'Get help building a goal-based plan aligned to your income and risk profile.',
      link: 'https://economictimes.indiatimes.com/wealth',
      priority: 'medium',
    })
  }

  const primaryGoal = profile.goals?.[0]

  if (primaryGoal === 'retirement') {
    recommendations.push({
      product: 'ET Retirement',
      reason: 'Learn step-by-step retirement planning with ET’s curated learning track.',
      link: 'https://economictimes.indiatimes.com/wealth/plan/retirement',
      priority: 'high',
    })
  }

  if (!hasInsurance) {
    recommendations.push({
      product: 'ET Insurance',
      reason: 'Compare health/life insurance options and pick coverage that fits your needs.',
      link: 'https://economictimes.indiatimes.com/wealth/insure',
      priority: 'high',
    })
  }

  if (primaryGoal === 'child education') {
    recommendations.push({
      product: 'ET Education',
      reason: 'Plan for education costs with goal-based investing and inflation-aware estimates.',
      link: 'https://economictimes.indiatimes.com/wealth/plan',
      priority: 'medium',
    })
  }

  try {
    await SessionModel.findOneAndUpdate(
      { sessionId },
      { $set: { sessionId, profile, score, recommendations } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
  } catch {
    return res.status(503).json({ score, recommendations })
  }

  return res.json({ score, recommendations })
})

export default router
