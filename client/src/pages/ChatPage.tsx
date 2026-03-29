import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, RefreshCw, Send } from 'lucide-react'
import ChatBubble from '../components/ChatBubble'
import { generateScore, getSession, sendMessage } from '../lib/api'
import type { Message, UserProfile } from '../../../shared/types'

function buildMessage(role: Message['role'], content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
  }
}

export default function ChatPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [sessionId, setSessionId] = useState<string>(() => {
    const fromUrl = searchParams.get('sessionId')
    const stored = window.localStorage.getItem('finpath_session_id')
    const picked = (fromUrl && fromUrl.trim().length > 0 ? fromUrl : null) ?? (stored && stored.trim().length > 0 ? stored : null)
    return picked ?? crypto.randomUUID()
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const [isGeneratingScore, setIsGeneratingScore] = useState<boolean>(false)
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const didInitRef = useRef<boolean>(false)
  const messagesRef = useRef<Message[]>([])
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const canSend = useMemo(() => draft.trim().length > 0 && !isSending, [draft, isSending])

  const progressPercent = useMemo(() => {
    if (isProfileComplete) return 100
    const aiMessages = messages.filter(
      (m) =>
        m.role === 'assistant' &&
        !m.content.toLowerCase().includes('generating your finpath score'),
    )
    return Math.min(99, aiMessages.length * 11)
  }, [isProfileComplete, messages])

  function extractProfileFromText(text: string): { cleanText: string; profile: UserProfile | null } {
    const match = text.match(/<PROFILE_COMPLETE>([\s\S]*?)<\/PROFILE_COMPLETE>/i)
    if (!match) return { cleanText: text.trim(), profile: null }

    const jsonText = match[1]?.trim() ?? ''
    const cleanText = text.replace(match[0], '').trim()

    try {
      const parsed = JSON.parse(jsonText) as unknown
      if (!parsed || typeof parsed !== 'object') return { cleanText, profile: null }
      const p = parsed as Record<string, unknown>

      const goal =
        typeof p.goal === 'string'
          ? p.goal
          : typeof p.goals === 'string'
            ? p.goals
            : Array.isArray(p.goals) && typeof p.goals[0] === 'string'
              ? (p.goals[0] as string)
              : ''

      const allowedGoals: UserProfile['goals'][number][] = [
        'wealth building',
        'retirement',
        'child education',
        'buying home',
        'emergency fund',
        'tax saving',
      ]
      const normalizedGoal = goal.trim().toLowerCase()
      const goalValue = (allowedGoals as string[]).includes(normalizedGoal)
        ? (normalizedGoal as UserProfile['goals'][number])
        : null

      const investments = Array.isArray(p.investments)
        ? p.investments
        : typeof p.investments === 'string'
          ? p.investments.split(',').map((s) => s.trim())
          : []

      const allowedInvestments: UserProfile['investments'][number][] = [
        'FD',
        'mutual funds',
        'stocks',
        'crypto',
        'PPF',
        'none',
      ]
      const normalizedInvestments = investments
        .map((v) => String(v).trim())
        .filter((v) => v.length > 0)
        .map((v) => {
          const lower = v.toLowerCase()
          if (lower === 'fd') return 'FD'
          if (lower === 'ppf') return 'PPF'
          return lower
        })
        .filter((v) => (allowedInvestments as string[]).includes(v)) as UserProfile['investments']

      const hasInsurance =
        typeof p.hasInsurance === 'boolean'
          ? p.hasInsurance
          : typeof p.insurance === 'boolean'
            ? p.insurance
            : typeof p.insurance === 'string'
              ? p.insurance.trim().toLowerCase() === 'yes'
              : Array.isArray(p.insurance)

      const profile: UserProfile = {
        name: typeof p.name === 'string' ? p.name : 'User',
        age: typeof p.age === 'number' ? p.age : Number(p.age),
        income: typeof p.income === 'number' ? p.income : Number(p.income),
        expenses: typeof p.expenses === 'number' ? p.expenses : Number(p.expenses),
        goals: goalValue ? [goalValue] : [],
        investments:
          normalizedInvestments.length > 0 ? normalizedInvestments : (['none'] as UserProfile['investments']),
        riskAppetite: (typeof p.riskAppetite === 'string'
          ? p.riskAppetite.trim().toLowerCase()
          : 'moderate') as UserProfile['riskAppetite'],
        insurance: hasInsurance ? ['insured'] : [],
        hasEmergencyFund:
          typeof p.hasEmergencyFund === 'boolean'
            ? p.hasEmergencyFund
            : typeof p.emergencyFund === 'boolean'
              ? p.emergencyFund
              : String(p.hasEmergencyFund ?? '').trim().toLowerCase() === 'yes',
      }

      if (
        !profile.name ||
        profile.goals.length === 0 ||
        Number.isNaN(profile.age) ||
        Number.isNaN(profile.income) ||
        Number.isNaN(profile.expenses)
      ) {
        return { cleanText, profile: null }
      }

      return { cleanText, profile }
    } catch {
      return { cleanText, profile: null }
    }
  }

  const handleSend = useCallback(async (messageText: string) => {
    const trimmed = messageText.trim()
    if (!trimmed || isSending || isGeneratingScore) return

    const userMessage = buildMessage('user', trimmed)
    setDraft('')
    setError(null)
    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)

    try {
      const assistantText = await sendMessage([...messagesRef.current, userMessage], sessionId)
      const { cleanText, profile } = extractProfileFromText(assistantText)

      setMessages((prev) => [...prev, buildMessage('assistant', cleanText || assistantText)])

      if (profile) {
        setIsProfileComplete(true)
        setIsGeneratingScore(true)
        setMessages((prev) => [
          ...prev,
          buildMessage('assistant', 'Generating your FinPath Score…'),
        ])
        await generateScore(profile, sessionId)
        window.setTimeout(() => {
          navigate(`/dashboard?sessionId=${encodeURIComponent(sessionId)}`)
        }, 2000)
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      setError(message)
      setMessages((prev) => [
        ...prev,
        buildMessage(
          'assistant',
          'I could not reach the API. This is expected until the server is running and VITE_API_URL is set.',
        ),
      ])
    } finally {
      setIsSending(false)
    }
  }, [isGeneratingScore, isSending, navigate, sessionId])

  useEffect(() => {
    window.localStorage.setItem('finpath_session_id', sessionId)
  }, [sessionId])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const session = await getSession(sessionId)
        if (cancelled) return

        const restored: Message[] = (session.messages ?? []).map((m) => ({
          id: crypto.randomUUID(),
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }))
        setMessages(restored)
      } catch {
        if (!cancelled) setMessages([])
      } finally {
        if (!cancelled) setIsLoaded(true)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  useEffect(() => {
    if (!isLoaded) return
    if (didInitRef.current) return
    if (messages.length > 0) {
      didInitRef.current = true
      return
    }
    didInitRef.current = true
    void handleSend('Hello')
  }, [handleSend, isLoaded, messages.length])

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [messages, isSending])

  return (
    <div className="page-fade-in flex h-[calc(100vh-7.5rem)] flex-col gap-4 pb-20 md:h-[calc(100vh-6rem)] md:pb-0">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-card dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-textSecondary transition hover:bg-appBgAlt hover:text-textPrimary dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="Back"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="font-display text-base font-bold text-textPrimary dark:text-white">
                FinPath AI
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-textSecondary dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
                <span className="text-border dark:text-gray-700">•</span>
                <span>Session {sessionId.slice(0, 8)}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const newSessionId = crypto.randomUUID()
              window.localStorage.setItem('finpath_session_id', newSessionId)
              setSessionId(newSessionId)
              setMessages([])
              setDraft('')
              setError(null)
              setIsProfileComplete(false)
              setIsGeneratingScore(false)
              didInitRef.current = true
              window.setTimeout(() => {
                didInitRef.current = false
                void handleSend('Hello')
              }, 0)
              navigate(`/chat?sessionId=${encodeURIComponent(newSessionId)}`, { replace: true })
            }}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-textSecondary transition hover:bg-appBgAlt hover:text-textPrimary dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Restart chat"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-border/70 dark:bg-gray-800">
          <div
            className="h-full bg-etOrange transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
      <div className="hidden items-center justify-between gap-4 md:flex">
        <div className="text-sm text-textSecondary dark:text-gray-400">
          Answer one question at a time to generate your FinPath Score.
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border bg-appBgAlt p-5 dark:border-gray-800 dark:bg-gray-950"
      >
        <div className="stagger-children space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="animate-slideUp">
              <ChatBubble message={m} />
            </div>
          ))}
        </div>
        {isSending ? (
          <div className="flex gap-3">
            <div className="mt-1 grid size-9 place-items-center rounded-full bg-etOrange text-xs font-bold text-white shadow-sm">
              FP
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-textPrimary shadow-sm dark:bg-gray-800 dark:text-white">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-textSecondary [animation-delay:-0.2s] dark:bg-gray-400" />
                  <span className="size-1.5 animate-bounce rounded-full bg-textSecondary [animation-delay:-0.1s] dark:bg-gray-400" />
                  <span className="size-1.5 animate-bounce rounded-full bg-textSecondary dark:bg-gray-400" />
                </span>
                <span className="text-xs text-textSecondary dark:text-gray-400">Typing…</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-border bg-white p-3 shadow-card dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-end gap-3">
          <div className="flex-1 rounded-2xl border border-border bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              placeholder="Type your answer..."
              className="max-h-40 w-full resize-none bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary dark:text-white dark:placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend(draft)
                }
              }}
            />
            <div className="mt-1 text-[11px] text-textSecondary dark:text-gray-400">Enter to send</div>
          </div>
          <button
            type="button"
            onClick={() => void handleSend(draft)}
            disabled={!canSend || isGeneratingScore}
            className={[
              'grid size-12 place-items-center rounded-full transition',
              canSend && !isGeneratingScore
                ? 'bg-etOrange text-white shadow-card hover:brightness-110'
                : 'cursor-not-allowed bg-border/60 text-textSecondary dark:bg-gray-800 dark:text-gray-500',
            ].join(' ')}
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>
        {error ? <div className="mt-3 text-xs text-red-600">{error}</div> : null}
      </div>
      </div>
    </div>
  )
}
