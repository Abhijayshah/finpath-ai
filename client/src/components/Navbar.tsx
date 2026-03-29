import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/authStore'

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden border-b border-border bg-white md:block">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="grid size-9 place-items-center rounded-full bg-etOrange text-white shadow-card">
              <span className="text-xs font-bold">{user?.avatar ?? 'FP'}</span>
            </div>
          ) : null}
          <div className="grid size-9 place-items-center rounded-lg bg-etOrange text-white shadow-card">
            <span className="text-sm font-bold">FP</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-textPrimary">FinPath AI</div>
            <div className="text-xs text-textSecondary">ET Finance Concierge</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            <NavItem to="/" label="Home" />
            <NavItem to="/chat" label="Chat" />
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/settings" label="Settings" />
            {isLoggedIn ? null : <NavItem to="/login" label="Login" />}
          </nav>
        </div>
      </div>
    </header>
  )
}
