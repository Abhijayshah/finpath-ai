import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authStore'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <div className="page-fade-in space-y-8 pb-20 md:pb-0">
      <div>
        <div className="text-2xl font-semibold text-textPrimary">Settings</div>
        <div className="mt-2 text-sm text-textSecondary">Manage your profile and app preferences.</div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:shadow">
        <div className="text-sm font-semibold text-textPrimary">Profile</div>
        <div className="mt-4 flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-full bg-etOrange text-white">
            <span className="text-sm font-bold">{user?.avatar ?? 'FP'}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-textPrimary">
              {user?.name ?? 'Guest'}
            </div>
            <div className="text-sm text-textSecondary">{user?.email ?? 'Not logged in'}</div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              logout()
              window.localStorage.removeItem('finpath_session_id')
              navigate('/')
            }}
            className={[
              'inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition',
              isLoggedIn
                ? 'border border-border bg-white text-textPrimary hover:bg-appBgAlt'
                : 'cursor-not-allowed border border-border bg-white text-textSecondary',
            ].join(' ')}
            disabled={!isLoggedIn}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:shadow">
        <div className="text-sm font-semibold text-textPrimary">About FinPath AI</div>
        <div className="mt-2 text-sm text-textSecondary">
          FinPath AI is a personal finance concierge for the Economic Times (ET) ecosystem. It profiles you in a
          short conversation, generates a FinPath Score, and recommends the right ET products for your journey.
        </div>
      </div>
    </div>
  )
}
