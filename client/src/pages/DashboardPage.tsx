import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RecommendationCard from '../components/RecommendationCard'
import { getSession } from '../lib/api'
import type { ETRecommendation, FinancialScore, UserProfile } from '../../../shared/types'

type DimensionKey = keyof Omit<FinancialScore, 'overall'>

function getScoreColor(score: number): 'green' | 'orange' | 'red' {
  if (score > 70) return 'green'
  if (score >= 40) return 'orange'
  return 'red'
}

function colorClasses(score: number): { text: string; bar: string; ring: string } {
  const c = getScoreColor(score)
  if (c === 'green') return { text: 'text-emerald-600', bar: 'bg-emerald-500', ring: 'stroke-emerald-500' }
  if (c === 'orange') return { text: 'text-etOrange', bar: 'bg-etOrange', ring: 'stroke-etOrange' }
  return { text: 'text-red-600', bar: 'bg-red-500', ring: 'stroke-red-500' }
}

function overallSubtitle(score: number): string {
  if (score > 70) return 'Excellent financial health! 🎉'
  if (score >= 40) return 'Good foundation, room to grow 📈'
  return "Let's build your financial future 💪"
}

function dimensionMeta(key: DimensionKey): { title: string; emoji: string; tipLow: string; tipDefault: string } {
  switch (key) {
    case 'emergency':
      return {
        title: 'Emergency Fund',
        emoji: '🛡️',
        tipLow: 'Build 6 months of expenses as safety net',
        tipDefault: 'Keep your emergency fund liquid and accessible',
      }
    case 'insurance':
      return {
        title: 'Insurance',
        emoji: '🏥',
        tipLow: 'Get term life + health insurance immediately',
        tipDefault: 'Review coverage annually to avoid gaps',
      }
    case 'investments':
      return {
        title: 'Investments',
        emoji: '📊',
        tipLow: 'Start a SIP of even ₹500/month',
        tipDefault: 'Increase SIPs as income grows',
      }
    case 'debt':
      return {
        title: 'Debt Health',
        emoji: '💳',
        tipLow: 'Prioritize high-interest debt first',
        tipDefault: 'Keep EMIs under control and avoid revolving credit',
      }
    case 'taxEfficiency':
      return {
        title: 'Tax Efficiency',
        emoji: '💰',
        tipLow: 'Explore 80C deductions to save up to ₹46,800/year',
        tipDefault: 'Use deductions and exemptions strategically',
      }
    case 'retirement':
      return {
        title: 'Retirement',
        emoji: '🏖️',
        tipLow: 'Start NPS or PPF contributions today',
        tipDefault: 'Increase long-term contributions with raises',
      }
  }
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [sessionId] = useState<string>(() => {
    const fromUrl = searchParams.get('sessionId')
    const stored = window.localStorage.getItem('finpath_session_id')
    const picked = (fromUrl && fromUrl.trim().length > 0 ? fromUrl : null) ?? (stored && stored.trim().length > 0 ? stored : null)
    return picked ?? crypto.randomUUID()
  })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [score, setScore] = useState<FinancialScore | null>(null)
  const [recs, setRecs] = useState<ETRecommendation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [animatedOverall, setAnimatedOverall] = useState<number>(0)
  const [animatedDims, setAnimatedDims] = useState<Record<DimensionKey, number>>({
    emergency: 0,
    insurance: 0,
    investments: 0,
    debt: 0,
    taxEfficiency: 0,
    retirement: 0,
  })

  useEffect(() => {
    window.localStorage.setItem('finpath_session_id', sessionId)
  }, [sessionId])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const s = await getSession(sessionId)
        if (cancelled) return
        setProfile(s.profile ?? null)
        setScore(s.score ?? null)
        setRecs(s.recommendations ?? [])
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load dashboard. Start the server and set VITE_API_URL.'
        setError(message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  useEffect(() => {
    if (!score) return

    setAnimatedOverall(0)
    setAnimatedDims({
      emergency: 0,
      insurance: 0,
      investments: 0,
      debt: 0,
      taxEfficiency: 0,
      retirement: 0,
    })

    const interval = window.setInterval(() => {
      setAnimatedOverall((prev) => (prev >= score.overall ? score.overall : prev + 1))
      setAnimatedDims((prev) => ({
        emergency: prev.emergency >= score.emergency ? score.emergency : prev.emergency + 1,
        insurance: prev.insurance >= score.insurance ? score.insurance : prev.insurance + 1,
        investments: prev.investments >= score.investments ? score.investments : prev.investments + 1,
        debt: prev.debt >= score.debt ? score.debt : prev.debt + 1,
        taxEfficiency: prev.taxEfficiency >= score.taxEfficiency ? score.taxEfficiency : prev.taxEfficiency + 1,
        retirement: prev.retirement >= score.retirement ? score.retirement : prev.retirement + 1,
      }))
    }, 12)

    return () => {
      window.clearInterval(interval)
    }
  }, [score])

  const nextSteps = useMemo(() => {
    if (!score) return []
    const dims: Array<{ key: DimensionKey; value: number; title: string; emoji: string; tip: string }> = (
      Object.keys(animatedDims) as DimensionKey[]
    ).map((key) => {
      const meta = dimensionMeta(key)
      const value = score[key]
      const tip = value < 50 ? meta.tipLow : meta.tipDefault
      return { key, value, title: meta.title, emoji: meta.emoji, tip }
    })
    return [...dims].sort((a, b) => a.value - b.value).slice(0, 3)
  }, [animatedDims, score])

  const name = profile?.name?.trim() || 'there'
  const overall = score?.overall ?? 0
  const overallColors = colorClasses(overall)

  const ringSize = 164
  const ringStroke = 14
  const ringRadius = (ringSize - ringStroke) / 2
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference - (animatedOverall / 100) * ringCircumference

  return (
    <div className="page-fade-in space-y-10 pb-20 md:pb-0">
      <div>
        <div className="text-2xl font-semibold text-textPrimary">Welcome back, {name}!</div>
        <div className="mt-2 text-sm text-textSecondary">Your personalized ET financial journey</div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card transition hover:shadow lg:col-span-1">
          <div className="text-sm font-semibold text-textPrimary">Your FinPath Score</div>
          <div className="mt-1 text-sm text-textSecondary">{overallSubtitle(overall)}</div>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative" style={{ width: ringSize, height: ringSize }}>
              <svg width={ringSize} height={ringSize} className="block">
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringRadius}
                  fill="transparent"
                  stroke="#E5E7EB"
                  strokeWidth={ringStroke}
                />
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringRadius}
                  fill="transparent"
                  strokeWidth={ringStroke}
                  strokeLinecap="round"
                  className={overallColors.ring}
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className={['text-4xl font-bold tabular-nums', overallColors.text].join(' ')}>
                    {animatedOverall}
                  </div>
                  <div className="mt-1 text-xs text-textSecondary">/ 100</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-textSecondary">
            {isLoading ? 'Loading your score…' : score ? 'Score loaded from your session.' : 'Complete chat to generate your score.'}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(['emergency', 'insurance', 'investments', 'debt', 'taxEfficiency', 'retirement'] as DimensionKey[]).map(
              (key) => {
                const meta = dimensionMeta(key)
                const value = score ? score[key] : 0
                const animatedValue = animatedDims[key]
                const c = colorClasses(value)
                const tip = value < 50 ? meta.tipLow : meta.tipDefault

                return (
                  <div key={key} className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xl">{meta.emoji}</div>
                        <div className="mt-2 text-sm font-semibold text-textPrimary">{meta.title}</div>
                      </div>
                      <div className={['text-lg font-bold tabular-nums', c.text].join(' ')}>
                        {score ? animatedValue : '—'}
                      </div>
                    </div>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className={['h-full transition-[width] duration-500', c.bar].join(' ')}
                        style={{ width: `${Math.max(0, Math.min(100, animatedValue))}%` }}
                      />
                    </div>

                    <div className="mt-3 text-sm text-textSecondary">{tip}</div>
                  </div>
                )
              },
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <div className="text-lg font-semibold text-textPrimary">Your Personalized ET Journey 🗺️</div>
          <div className="mt-1 text-sm text-textSecondary">Curated recommendations based on your profile.</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recs.map((rec) => (
            <RecommendationCard key={`${rec.product}-${rec.priority}`} rec={rec} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-lg font-semibold text-textPrimary">Your Next 3 Steps</div>
        <div className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((s, idx) => (
            <div key={s.key} className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold text-textPrimary">
                  {idx + 1}. {s.emoji} {s.title}
                </div>
                <div className="text-sm font-bold tabular-nums text-textSecondary">{s.value}</div>
              </div>
              <div className="mt-3 text-sm text-textSecondary">{s.tip}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-textSecondary">Session: {sessionId.slice(0, 8)}</div>
        <button
          type="button"
          onClick={() => {
            const newSessionId = crypto.randomUUID()
            window.localStorage.setItem('finpath_session_id', newSessionId)
            navigate(`/chat?sessionId=${encodeURIComponent(newSessionId)}`)
          }}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-etOrange px-5 text-sm font-semibold text-white shadow-card transition hover:brightness-110"
        >
          Retake Assessment
        </button>
      </div>
    </div>
  )
}
