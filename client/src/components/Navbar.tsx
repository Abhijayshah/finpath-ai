import { NavLink } from 'react-router-dom'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-md px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-300 hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
      end={to === '/'}
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-etOrange/15 text-etOrange shadow-glow">
            <span className="text-sm font-bold">FP</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-white">
              FinPath AI
            </div>
            <div className="text-xs text-[#888888]">ET Finance Concierge</div>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          <NavItem to="/" label="Home" />
          <NavItem to="/login" label="Login" />
          <NavItem to="/chat" label="Chat" />
          <NavItem to="/dashboard" label="Dashboard" />
        </nav>
      </div>
    </header>
  )
}
