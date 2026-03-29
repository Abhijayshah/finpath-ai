import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import { generateScore, sendMessage } from '../lib/api'
import type { Message, UserProfile } from '@shared/types'

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
  const [sessionId] = useState<string>(() => crypto.randomUUID())
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const [isGeneratingScore, setIsGeneratingScore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const didInitRef = useRef<boolean>(false)

  const canSend = useMemo(() => draft.trim().length > 0 && !isSending, [draft, isSending])

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
      const assistantText = await sendMessage([...messages, userMessage], sessionId)
      const { cleanText, profile } = extractProfileFromText(assistantText)

      setMessages((prev) => [...prev, buildMessage('assistant', cleanText || assistantText)])

      if (profile) {
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
  }, [isGeneratingScore, isSending, messages, navigate, sessionId])

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true
    void handleSend('Hello')
  }, [handleSend])

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [messages, isSending])

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-white">Chat</div>
          <div className="text-xs text-slate-400">
            AI profiling chat. One question at a time, then your FinPath Score.
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/10 sm:flex">
          <span className="size-1.5 rounded-full bg-etOrange" />
          Session: {sessionId.slice(0, 8)}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {isSending ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10">
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400" />
              </span>
              <span className="text-xs text-slate-300">FinPath AI is typing</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-300">Your message</label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder="Ask about budgeting, investing, tax, insurance…"
              className="mt-2 w-full resize-none rounded-xl bg-black/40 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-slate-500 focus:ring-etOrange/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend(draft)
                }
              }}
            />
            <div className="mt-2 text-[11px] text-slate-400">
              Press Enter to send, Shift + Enter for a new line
            </div>
          </div>
          <button
            type="button"
            className={[
              'inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition',
              canSend
                ? 'bg-etOrange text-black hover:brightness-110'
                : 'cursor-not-allowed bg-white/10 text-slate-500',
            ].join(' ')}
            onClick={() => void handleSend(draft)}
            disabled={!canSend || isGeneratingScore}
          >
            {isGeneratingScore ? 'Scoring…' : 'Send'}
          </button>
        </div>
        {error ? <div className="mt-3 text-xs text-red-300">{error}</div> : null}
      </div>
    </div>
  )
}
