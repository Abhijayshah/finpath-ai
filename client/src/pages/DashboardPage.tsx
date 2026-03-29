import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RecommendationCard from '../components/RecommendationCard'
import ScoreCard from '../components/ScoreCard'
import { generateScore, getSession } from '../lib/api'
import type { ETRecommendation, FinancialScore, UserProfile } from '@shared/types'

const emptyProfile: UserProfile = {
  name: 'Guest',
  age: 28,
  income: 120000,
  expenses: 65000,
  goals: ['emergency fund', 'retirement'],
  investments: ['mutual funds'],
  riskAppetite: 'moderate',
  insurance: ['Health insurance'],
  hasEmergencyFund: false,
}

function parseCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function parseGoals(value: string): UserProfile['goals'] {
  const allowed: UserProfile['goals'][number][] = [
    'wealth building',
    'retirement',
    'child education',
    'buying home',
    'emergency fund',
    'tax saving',
  ]
  const parsed = parseCsv(value).map((s) => s.toLowerCase())
  return parsed.filter((s): s is UserProfile['goals'][number] => (allowed as string[]).includes(s))
}

function parseInvestments(value: string): UserProfile['investments'] {
  const allowed: UserProfile['investments'][number][] = [
    'FD',
    'mutual funds',
    'stocks',
    'crypto',
    'PPF',
    'none',
  ]

  const parsed = parseCsv(value).map((s) => {
    const lower = s.toLowerCase()
    if (lower === 'fd') return 'FD'
    if (lower === 'ppf') return 'PPF'
    return lower
  })

  const filtered = parsed.filter((s): s is UserProfile['investments'][number] =>
    (allowed as string[]).includes(s),
  )

  return Array.from(new Set(filtered))
}

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const [sessionId] = useState<string>(() => searchParams.get('sessionId') ?? crypto.randomUUID())
  const [profile, setProfile] = useState<UserProfile>(emptyProfile)
  const [score, setScore] = useState<FinancialScore | null>(null)
  const [recs, setRecs] = useState<ETRecommendation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const goalsText = useMemo(() => profile.goals.join(', '), [profile.goals])
  const investmentsText = useMemo(() => profile.investments.join(', '), [profile.investments])
  const insuranceText = useMemo(() => profile.insurance.join(', '), [profile.insurance])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const s = await getSession(sessionId)
        if (cancelled) return
        if (s.profile) setProfile(s.profile)
        if (s.score) setScore(s.score)
        if (s.recommendations) setRecs(s.recommendations)
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load dashboard. Start the server and set VITE_API_URL.'
        setError(message)
        setScore({
          overall: 62,
          emergency: 48,
          insurance: 75,
          investments: 66,
          debt: 60,
          taxEfficiency: 55,
          retirement: 55,
        })
        setRecs([
          {
            product: 'ET Money: Term Insurance Guide',
            reason: 'Review coverage basics and choose a plan aligned to your needs.',
            link: 'https://economictimes.indiatimes.com/wealth',
            priority: 'high',
          },
          {
            product: 'ET Markets: SIP Basics',
            reason: 'Build an investing habit with SIP insights and market explainers.',
            link: 'https://economictimes.indiatimes.com/markets',
            priority: 'medium',
          },
          {
            product: 'ET Prime: Tax Planning',
            reason: 'Learn strategies to improve tax efficiency over the financial year.',
            link: 'https://economictimes.indiatimes.com/prime',
            priority: 'low',
          },
        ])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  async function handleSaveAndRefresh() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await generateScore(profile, sessionId)
      setScore(result.score)
      setRecs(result.recommendations)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh dashboard. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-lg font-semibold text-white">Dashboard</div>
          <div className="text-xs text-slate-400">
            Financial health score and ET recommendations.
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleSaveAndRefresh()}
          className={[
            'inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition',
            isLoading ? 'cursor-not-allowed bg-white/10 text-slate-500' : 'bg-etOrange text-black',
          ].join(' ')}
          disabled={isLoading}
        >
          Update Score
        </button>
      </div>

      {error ? <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-200">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {score ? <ScoreCard score={score} /> : <div className="text-sm text-slate-400">Loading…</div>}
        </div>
        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Profile</div>
          <div className="mt-1 text-xs text-slate-400">
            Stored via /api/profile. Replace with proper auth + user storage.
          </div>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Age</label>
                <input
                  value={profile.age}
                  type="number"
                  min={0}
                  onChange={(e) => setProfile((p) => ({ ...p, age: Number(e.target.value) }))}
                  className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Monthly Income</label>
                <input
                  value={profile.income}
                  type="number"
                  min={0}
                  onChange={(e) => setProfile((p) => ({ ...p, income: Number(e.target.value) }))}
                  className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Monthly Expenses</label>
                <input
                  value={profile.expenses}
                  type="number"
                  min={0}
                  onChange={(e) => setProfile((p) => ({ ...p, expenses: Number(e.target.value) }))}
                  className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Risk Appetite</label>
              <select
                value={profile.riskAppetite}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    riskAppetite: e.target.value as UserProfile['riskAppetite'],
                  }))
                }
                className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Goals (comma-separated)</label>
                <input
                  value={goalsText}
                  onChange={(e) => setProfile((p) => ({ ...p, goals: parseGoals(e.target.value) }))}
                  className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Investments (comma-separated)
                </label>
                <input
                  value={investmentsText}
                  onChange={(e) => setProfile((p) => ({ ...p, investments: parseInvestments(e.target.value) }))}
                  className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Insurance (comma-separated)
                </label>
                <input
                  value={insuranceText}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, insurance: parseCsv(e.target.value) }))
                  }
                  className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-etOrange/50"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={profile.hasEmergencyFund}
                onChange={(e) => setProfile((p) => ({ ...p, hasEmergencyFund: e.target.checked }))}
                className="size-4 rounded border-white/20 bg-black/40 text-etOrange focus:ring-etOrange"
              />
              I have an emergency fund
            </label>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-white">ET Recommendations</div>
        <div className="mt-1 text-xs text-slate-400">
          Placeholder cards from /api/score. Links point to ET properties for now.
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recs.map((rec) => (
            <RecommendationCard key={`${rec.product}-${rec.priority}`} rec={rec} />
          ))}
        </div>
      </div>
    </div>
  )
}
