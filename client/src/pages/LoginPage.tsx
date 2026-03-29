import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isLoggedIn, login } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/chat')
  }, [isLoggedIn, navigate])

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

        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            if (isLoading) return
            setIsLoading(true)
            window.setTimeout(() => {
              login({
                name: 'Abhijay Kumar Shah',
                email: 'abhijayshah74@gmail.com',
                avatar: 'AK',
              })
              setIsLoading(false)
              navigate('/chat')
            }, 1500)
          }}
          className={[
            'mt-8 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border px-4 text-sm font-semibold transition',
            isLoading
              ? 'cursor-not-allowed border-border bg-white text-textSecondary'
              : 'border-[#4285F4]/30 bg-white text-textPrimary hover:bg-appBgAlt',
          ].join(' ')}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.62l6.85-6.85C35.9 2.43 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.23 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.45c-.54 2.9-2.17 5.36-4.61 7.02l7.08 5.5C43.29 37.15 46.1 31.32 46.1 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.59c-.5-1.48-.78-3.06-.78-4.69s.28-3.21.78-4.69l-7.98-6.19C.92 16.46 0 20.12 0 23.9c0 3.78.92 7.44 2.56 10.88l7.98-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.14 15.91-5.82l-7.08-5.5c-1.97 1.32-4.5 2.1-8.83 2.1-6.26 0-11.57-3.73-13.46-9.01l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span>Continue with Google 🔑</span>
          {isLoading ? (
            <span className="ml-auto inline-flex size-4 animate-spin rounded-full border-2 border-border border-t-etOrange" />
          ) : null}
        </button>
      </div>
    </div>
  )
}
