import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isLoggedIn, login } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isGoogleReady, setIsGoogleReady] = useState<boolean>(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/chat')
  }, [isLoggedIn, navigate])

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
    if (!clientId) return

    const existing = document.querySelector<HTMLScriptElement>('script[data-gis="true"]')
    if (existing) {
      if (window.google?.accounts?.id) {
        window.setTimeout(() => setIsGoogleReady(true), 0)
        return
      }

      const onLoad = () => setIsGoogleReady(true)
      const onError = () => setError('Google login failed to load. Try email login.')
      existing.addEventListener('load', onLoad)
      existing.addEventListener('error', onError)
      return () => {
        existing.removeEventListener('load', onLoad)
        existing.removeEventListener('error', onError)
      }
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.gis = 'true'
    script.onload = () => setIsGoogleReady(true)
    script.onerror = () => setError('Google login failed to load. Try email login.')
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isGoogleReady) return
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
    if (!clientId) return

    const container = document.getElementById('google-signin-button')
    if (!container) return
    if (!window.google?.accounts?.id) return

    const decodeJwt = (token: string): Record<string, unknown> | null => {
      try {
        const payload = token.split('.')[1]
        if (!payload) return null
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
            .join(''),
        )
        return JSON.parse(json) as Record<string, unknown>
      } catch {
        return null
      }
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (resp) => {
        const payload = decodeJwt(resp.credential)
        const emailValue = typeof payload?.email === 'string' ? payload.email : ''
        const nameValue = typeof payload?.name === 'string' ? payload.name : 'User'
        const initials =
          (nameValue.split(' ').filter(Boolean)[0]?.[0] ?? 'U') +
          (nameValue.split(' ').filter(Boolean)[1]?.[0] ?? '')

        login({
          name: nameValue,
          email: emailValue || 'unknown@email',
          avatar: initials.toUpperCase(),
        })
        navigate('/chat')
      },
    })

    container.innerHTML = ''
    window.google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 360,
      logo_alignment: 'left',
    })
  }, [isGoogleReady, login, navigate])

  function handleEmailLogin() {
    const normalizedEmail = email.trim().toLowerCase()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    if (!emailOk) {
      setError('Enter a valid email address.')
      return
    }

    setError(null)
    setIsLoading(true)
    window.setTimeout(() => {
      const normalizedName = name.trim()
      const displayName = normalizedName.length > 0 ? normalizedName : normalizedEmail.split('@')[0] ?? 'User'
      const initials =
        (displayName.split(' ').filter(Boolean)[0]?.[0] ?? 'U') +
        (displayName.split(' ').filter(Boolean)[1]?.[0] ?? '')

      login({
        name: displayName,
        email: normalizedEmail,
        avatar: initials.toUpperCase(),
      })
      setIsLoading(false)
      navigate('/chat')
    }, 800)
  }

  return (
    <div className="page-fade-in mx-auto grid max-w-md place-items-center pb-20 md:pb-0">
      <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-card transition hover:shadow">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-etOrange text-white shadow-card">
          <span className="text-sm font-bold">FP</span>
        </div>

        <div className="mt-6 text-center">
          <div className="text-2xl font-semibold text-textPrimary">Welcome to FinPath AI</div>
          <div className="mt-2 text-sm text-textSecondary">Your personal ET finance concierge</div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-border bg-white p-4">
            <div className="text-sm font-semibold text-textPrimary">Continue with Email</div>
            <div className="mt-3 grid gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name (optional)"
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-textPrimary outline-none placeholder:text-textSecondary focus:border-etOrange/60"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                inputMode="email"
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-textPrimary outline-none placeholder:text-textSecondary focus:border-etOrange/60"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={handleEmailLogin}
                className={[
                  'inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition',
                  isLoading
                    ? 'cursor-not-allowed bg-appBgAlt text-textSecondary'
                    : 'bg-etOrange text-white hover:brightness-110',
                ].join(' ')}
              >
                Continue
                {isLoading ? (
                  <span className="ml-3 inline-flex size-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                ) : null}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="text-xs text-textSecondary">OR</div>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="rounded-2xl border border-border bg-white p-4">
            <div className="text-sm font-semibold text-textPrimary">Continue with Google</div>
            <div className="mt-3">
              <div id="google-signin-button" className="flex justify-center" />
              {!import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <div className="mt-2 text-xs text-textSecondary">
                  Set VITE_GOOGLE_CLIENT_ID to enable Google login.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}
      </div>
    </div>
  )
}
