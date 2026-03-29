import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, Home, MessageCircle, Settings, User } from 'lucide-react'
import { useAuth } from '../context/authStore'

type Tab = {
  to: string
  label: string
  icon: ReactNode
  avatar?: string
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
          <span
            className={[
              'relative grid size-9 place-items-center rounded-2xl',
              isActive ? 'text-etOrange' : 'text-textSecondary dark:text-gray-400',
            ].join(' ')}
          >
            <span className={isActive ? 'animate-navPop' : ''}>
              {tab.avatar ? (
                <span className="grid size-7 place-items-center rounded-full bg-etOrange text-[10px] font-bold text-white">
                  {tab.avatar}
                </span>
              ) : (
                tab.icon
              )}
            </span>
            <span
              className={[
                'absolute -top-1 size-1.5 rounded-full transition-all',
                isActive ? 'bg-etOrange opacity-100' : 'bg-etOrange opacity-0',
              ].join(' ')}
            />
          </span>
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
    { to: '/', label: 'Home', icon: <Home size={20} />, end: true },
    { to: '/chat', label: 'Chat', icon: <MessageCircle size={20} /> },
    {
      to: '/login',
      label: isLoggedIn ? 'Profile' : 'Login',
      icon: <User size={20} />,
      avatar: isLoggedIn ? (user?.avatar ?? 'FP') : undefined,
    },
    { to: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 md:hidden">
      <div className="mx-auto flex max-w-6xl px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2">
        {tabs.map((tab) => (
          <TabItem key={tab.to} tab={tab} />
        ))}
      </div>
    </nav>
  )
}
