import { NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/authStore'
import { useTheme } from '../context/themeStore'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-md px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'text-etOrange'
            : 'text-textSecondary hover:text-textPrimary',
        ].join(' ')
      }
      end={to === '/'}
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const { user, isLoggedIn } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden border-b border-border bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 md:block">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="grid size-9 place-items-center rounded-full bg-etOrange text-white shadow-card">
              <span className="text-xs font-bold">{user?.avatar ?? 'FP'}</span>
            </div>
          ) : null}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-etOrange" />
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight text-textPrimary dark:text-white">
                FinPath AI
              </div>
              <div className="text-xs text-textSecondary dark:text-gray-400">ET Finance Concierge</div>
            </div>
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            <NavItem to="/" label="Home" />
            <NavItem to="/chat" label="Chat" />
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/settings" label="Settings" />
            {isLoggedIn ? null : <NavItem to="/login" label="Login" />}
          </nav>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-textSecondary shadow-sm transition hover:bg-appBgAlt hover:text-textPrimary dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
