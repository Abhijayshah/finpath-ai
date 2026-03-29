import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
          <span className="size-1.5 rounded-full bg-etOrange" />
          AI-powered personal finance concierge for ET
        </div>

        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Make smarter money moves with FinPath AI
        </h1>

        <p className="text-pretty text-sm leading-6 text-slate-300 sm:text-base">
          Chat, check your financial health score, and get ET-aligned recommendations.
          This is a starter UI with placeholder API hooks for the ET ecosystem.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/chat"
            className="inline-flex items-center justify-center rounded-xl bg-etOrange px-5 py-3 text-sm font-semibold text-black shadow-glow transition hover:brightness-110"
          >
            Meet FinPath AI
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
          >
            View Dashboard
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white">Chat-first</div>
            <div className="mt-1 text-xs text-slate-400">
              Ask anything about budgeting, investing, tax, and goals.
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white">Scorecard</div>
            <div className="mt-1 text-xs text-slate-400">
              Quick view of emergency fund, insurance, debt, and retirement readiness.
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white">ET Insights</div>
            <div className="mt-1 text-xs text-slate-400">
              Recommendations with links into the ET ecosystem.
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-6 rounded-3xl bg-[radial-gradient(450px_220px_at_30%_20%,rgba(255,107,0,0.20),transparent_65%)] blur-2xl" />
        <div className="relative rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">What can I do?</div>
            <div className="text-xs text-slate-400">Demo preview</div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-etOrange px-4 py-3 text-sm text-black">
              I earn ₹1,20,000/month. How much should I invest vs save?
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10">
              I can help you set a split based on goals, emergency fund, and risk. Next,
              I’ll ask about monthly expenses and existing investments.
            </div>
            <div className="rounded-2xl bg-etOrange px-4 py-3 text-sm text-black">
              Show my financial health score.
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10">
              Great—open Dashboard to view a placeholder score breakdown and ET
              recommendations.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
