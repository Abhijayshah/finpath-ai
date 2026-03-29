import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Home, MessageCircle, Moon, Sparkles, Sun, Trophy, User } from 'lucide-react'
import { useTheme } from '../context/themeStore'

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [hidden, setHidden] = useState<boolean>(false)
  const [atTop, setAtTop] = useState<boolean>(true)

  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      setAtTop(y < 8)
      const scrollingDown = y > lastY
      if (y > 80 && scrollingDown) setHidden(true)
      if (!scrollingDown) setHidden(false)
      lastY = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const stats = useMemo(
    () => [
      { value: '14 Cr+', label: 'Demat accounts' },
      { value: '95%', label: 'Without a financial plan' },
      { value: '3 Min', label: 'Assessment' },
    ],
    [],
  )

  return (
    <div className="pb-20 md:pb-0">
      <header
        className={[
          'sticky top-0 z-40 -mx-4 mb-10 border-b px-4 py-3 backdrop-blur-md transition-all sm:-mx-6 sm:px-6',
          'bg-white/80 dark:bg-gray-950/80 border-border dark:border-gray-800',
          hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
          atTop ? 'border-transparent shadow-none' : 'shadow-sm',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-etOrange" />
            <div className="font-display text-lg font-bold tracking-tight text-textPrimary dark:text-white">
              FinPath AI
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-textSecondary shadow-sm transition hover:bg-appBgAlt hover:text-textPrimary dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/chat"
              className="inline-flex h-10 items-center justify-center rounded-full bg-etOrange px-6 text-sm font-semibold text-white shadow-card transition hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="animate-fadeIn">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-etOrange/30 bg-etOrange/5 px-3 py-1 text-xs font-medium text-etOrange">
              <Trophy size={14} />
              ET AI Hackathon 2026
            </div>

            <h1 className="mt-6 whitespace-pre-line font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-textPrimary dark:text-white sm:text-6xl">
              Your Personal{'\n'}
              <span className="bg-gradient-to-r from-etOrange to-orange-400 bg-clip-text text-transparent">
                ET Finance
              </span>
              {'\n'}Concierge
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-textSecondary dark:text-gray-300">
              One 3-minute conversation. A complete financial roadmap. Discover the full ET ecosystem — personalized
              for you.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/chat"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-etOrange px-7 text-sm font-semibold text-white shadow-card transition hover:brightness-110"
              >
                Start My Journey
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-7 text-sm font-semibold text-textPrimary shadow-sm transition hover:bg-appBgAlt dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="text-xl font-bold text-etOrange">{s.value}</div>
                  <div className="mt-1 text-xs text-textSecondary dark:text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-3xl bg-[radial-gradient(600px_260px_at_30%_20%,rgba(255,107,0,0.22),transparent_60%)] blur-2xl" />
            <div className="relative rounded-3xl border border-border bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-textPrimary dark:text-white">Live demo</div>
                <div className="text-xs text-textSecondary dark:text-gray-400">3-minute journey</div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl rounded-tr-sm bg-etOrange px-4 py-3 text-sm font-semibold text-white">
                  I want a roadmap for retirement and tax saving.
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-[#F3F4F6] px-4 py-3 text-sm text-textPrimary dark:bg-gray-800 dark:text-white">
                  Love it. I’ll ask a few quick questions—one at a time—and then generate your FinPath Score and ET
                  journey.
                </div>
                <div className="rounded-2xl rounded-tr-sm bg-etOrange px-4 py-3 text-sm font-semibold text-white">
                  Sounds good.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto mt-16 max-w-6xl">
        <div className="text-center font-display text-2xl font-bold text-textPrimary dark:text-white">
          How FinPath AI Works
        </div>
        <div className="relative mt-8">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="mx-auto h-px max-w-5xl border-t border-dashed border-border dark:border-gray-800" />
          </div>
          <div className="stagger-children grid gap-4 lg:grid-cols-3">
            {[
              { n: 1, icon: <MessageCircle size={20} />, title: 'Chat with FinPath AI', desc: 'Answer 9 smart questions' },
              { n: 2, icon: <BarChart3 size={20} />, title: 'Get Your FinPath Score', desc: 'Across 6 financial dimensions' },
              { n: 3, icon: <Sparkles size={20} />, title: 'Get Your ET Journey', desc: 'Personalized product recommendations' },
            ].map((s) => (
              <div
                key={s.n}
                className="animate-slideUp rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-etOrange text-white">
                    {s.n}
                  </div>
                  <div className="grid size-10 place-items-center rounded-xl bg-etOrange/10 text-etOrange">
                    {s.icon}
                  </div>
                </div>
                <div className="mt-5 text-base font-semibold text-textPrimary dark:text-white">{s.title}</div>
                <div className="mt-2 text-sm text-textSecondary dark:text-gray-300">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <div className="text-center font-display text-2xl font-bold text-textPrimary dark:text-white">Features</div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            { icon: <User size={20} />, title: 'AI-Powered Profiling', desc: 'Groq Llama 3 understands your complete financial life' },
            { icon: <Home size={20} />, title: 'ET Ecosystem Guide', desc: 'Discover the right ET products for your goals' },
            { icon: <BarChart3 size={20} />, title: 'Money Health Score', desc: 'Know exactly where you stand financially' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-gradient-to-br from-gray-900 to-[#111111] p-[1px] shadow-card transition hover:shadow-lg"
            >
              <div className="rounded-3xl bg-[#111111] p-6">
                <div className="grid size-11 place-items-center rounded-xl bg-etOrange/15 text-etOrange">
                  {f.icon}
                </div>
                <div className="mt-5 font-display text-lg font-bold text-white">{f.title}</div>
                <div className="mt-2 text-sm text-gray-300">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-16 flex max-w-6xl items-center justify-between border-t border-border py-8 text-xs text-textSecondary dark:border-gray-800 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-etOrange" />
          <span className="font-display font-bold text-textPrimary dark:text-white">FinPath AI</span>
        </div>
        <div>Built for ET AI Hackathon 2026</div>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-white text-textSecondary shadow-sm transition hover:bg-appBgAlt dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </footer>
    </div>
  )
}
