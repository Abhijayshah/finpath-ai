import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/authStore'
import { useTheme } from '../context/themeStore'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="page-fade-in space-y-8 pb-20 md:pb-0">
      <div>
        <div className="font-display text-3xl font-extrabold tracking-tight text-textPrimary dark:text-white">
          Settings
        </div>
        <div className="mt-2 text-sm text-textSecondary dark:text-gray-300">
          Manage your profile and app preferences.
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="text-sm font-semibold text-textPrimary dark:text-white">Profile</div>
        <div className="mt-4 flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-etOrange text-white shadow-sm">
            <span className="text-base font-bold">{user?.avatar ?? 'FP'}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-textPrimary dark:text-white">
              {user?.name ?? 'Guest'}
            </div>
            <div className="text-sm text-textSecondary dark:text-gray-300">{user?.email ?? 'Not logged in'}</div>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5 dark:border-gray-800">
          <div className="text-sm font-semibold text-textPrimary dark:text-white">Preferences</div>
          <button
            type="button"
            onClick={toggleTheme}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-left text-sm text-textPrimary shadow-sm transition hover:bg-appBgAlt dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Sun size={18} className="text-etOrange" /> : <Moon size={18} className="text-etOrange" />}
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-xs text-textSecondary dark:text-gray-400">Toggle light/dark mode</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-textSecondary dark:text-gray-400">{theme.toUpperCase()}</div>
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-5 dark:border-gray-800">
          <div className="text-sm font-semibold text-textPrimary dark:text-white">Account</div>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm('Log out of FinPath AI?')) return
              logout()
              window.localStorage.removeItem('finpath_session_id')
              navigate('/')
            }}
            className={[
              'mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition',
              isLoggedIn
                ? 'border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:bg-gray-950 dark:text-red-300 dark:hover:bg-red-500/10'
                : 'cursor-not-allowed border border-border bg-white text-textSecondary dark:border-gray-800 dark:bg-gray-950 dark:text-gray-500',
            ].join(' ')}
            disabled={!isLoggedIn}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="text-sm font-semibold text-textPrimary dark:text-white">About</div>
        <div className="mt-2 text-sm text-textSecondary dark:text-gray-300">
          FinPath AI is a personal finance concierge for the Economic Times (ET) ecosystem. It profiles you in a
          short conversation, generates a FinPath Score, and recommends the right ET products for your journey.
        </div>
        <div className="mt-4 text-xs text-textSecondary dark:text-gray-400">Built for ET AI Hackathon 2026</div>
      </div>
    </div>
  )
}
