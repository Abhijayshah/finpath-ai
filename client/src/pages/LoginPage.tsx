import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getStoredSessionId(): string | null {
  const v = window.localStorage.getItem('finpath_session_id')
  return v && v.trim().length > 0 ? v : null
}

function setStoredSessionId(sessionId: string) {
  window.localStorage.setItem('finpath_session_id', sessionId)
}

function setStoredDisplayName(name: string) {
  window.localStorage.setItem('finpath_display_name', name)
}

export default function LoginPage() {
  const navigate = useNavigate()
  const existingSessionId = useMemo(() => getStoredSessionId(), [])
  const [name, setName] = useState<string>('')

  function startNewSession() {
    const sessionId = crypto.randomUUID()
    setStoredSessionId(sessionId)
    setStoredDisplayName(name.trim())
    navigate(`/chat?sessionId=${encodeURIComponent(sessionId)}`)
  }

  function continueSession() {
    if (!existingSessionId) return
    navigate(`/chat?sessionId=${encodeURIComponent(existingSessionId)}`)
  }

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-lg font-semibold text-white">Login</div>
        <div className="mt-1 text-sm text-slate-400">
          This is a lightweight demo login to start a new FinPath AI session (no password).
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300">Your name (optional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Abhijay"
              className="mt-2 w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-etOrange/50"
            />
          </div>

          <button
            type="button"
            onClick={startNewSession}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-etOrange px-5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110"
          >
            Start as New User
          </button>

          {existingSessionId ? (
            <button
              type="button"
              onClick={continueSession}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-white/5 px-5 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Continue Previous Session
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <div className="text-sm font-semibold text-white">What happens next?</div>
        <div className="mt-2 text-sm text-slate-300">
          FinPath AI will ask one profiling question at a time. When the profile is complete, it
          generates your FinPath Score and redirects you to the Dashboard.
        </div>
      </div>
    </div>
  )
}
