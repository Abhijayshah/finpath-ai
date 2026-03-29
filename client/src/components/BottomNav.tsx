import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/authStore'

type Tab = {
  to: string
  label: string
  icon: string
  avatar?: boolean
  end?: boolean
}

function TabItem({ tab }: { tab: Tab }) {
  return (
    <NavLink
      to={tab.to}
      end={tab.end}
      className={({ isActive }) =>
        [
          'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] transition',
          isActive ? 'text-etOrange' : 'text-textSecondary',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {tab.avatar ? (
            <span
              className={[
                'grid size-7 place-items-center rounded-full bg-etOrange text-[10px] font-bold text-white',
                isActive ? 'animate-navPop' : '',
              ].join(' ')}
            >
              {tab.icon}
            </span>
          ) : (
            <span className={['text-lg leading-none', isActive ? 'animate-navPop' : ''].join(' ')}>
              {tab.icon}
            </span>
          )}
          <span className="leading-none">{tab.label}</span>
          <span
            className={[
              'absolute top-0 h-0.5 w-8 rounded-full transition-all',
              isActive ? 'bg-etOrange opacity-100' : 'bg-etOrange opacity-0',
            ].join(' ')}
          />
        </>
      )}
    </NavLink>
  )
}

export default function BottomNav() {
  const { isLoggedIn, user } = useAuth()

  const tabs: Tab[] = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/chat', label: 'Chat', icon: '💬' },
    { to: '/login', label: isLoggedIn ? 'Profile' : 'Login', icon: isLoggedIn ? (user?.avatar ?? 'FP') : '👤', avatar: isLoggedIn },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white md:hidden">
      <div className="mx-auto flex h-16 max-w-6xl px-2">
        {tabs.map((tab) => (
          <TabItem key={tab.to} tab={tab} />
        ))}
      </div>
    </nav>
  )
}
