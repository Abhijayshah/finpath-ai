import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="space-y-14">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#222222] bg-[#111111] px-3 py-1 text-xs text-[#888888]">
            <span>🏆</span>
            Built for ET AI Hackathon 2026
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your Personal ET Finance Concierge
          </h1>

          <p className="text-pretty text-sm leading-6 text-[#888888] sm:text-base">
            One 3-minute conversation. A complete financial roadmap. Powered by AI.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-xl bg-etOrange px-5 py-3 text-sm font-semibold text-black shadow-glow transition hover:brightness-110"
            >
              Start My Journey →
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-[#222222] bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:border-etOrange/40"
            >
              Login
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#222222] bg-[#111111] p-4">
              <div className="text-xs font-semibold text-white">14 Cr+ Demat Accounts</div>
              <div className="mt-1 text-xs text-[#888888]">India’s investing wave is massive.</div>
            </div>
            <div className="rounded-2xl border border-[#222222] bg-[#111111] p-4">
              <div className="text-xs font-semibold text-white">95% Without a Financial Plan</div>
              <div className="mt-1 text-xs text-[#888888]">FinPath helps you start today.</div>
            </div>
            <div className="rounded-2xl border border-[#222222] bg-[#111111] p-4">
              <div className="text-xs font-semibold text-white">3 Min Assessment</div>
              <div className="mt-1 text-xs text-[#888888]">9 questions, 6 score dimensions.</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-3xl bg-[radial-gradient(550px_260px_at_30%_20%,rgba(255,107,0,0.16),transparent_65%)] blur-2xl" />
          <div className="relative rounded-3xl border border-[#222222] bg-[#111111] p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Demo</div>
              <div className="text-xs text-[#888888]">3-minute journey</div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-etOrange px-4 py-3 text-sm font-medium text-black">
                I want a roadmap for retirement and tax saving.
              </div>
              <div className="rounded-2xl border border-[#222222] bg-[#0A0A0A] px-4 py-3 text-sm text-white">
                Love it. I’ll ask a few quick questions—one at a time—and then generate your FinPath
                Score and ET journey. 😊
              </div>
              <div className="rounded-2xl bg-etOrange px-4 py-3 text-sm font-medium text-black">
                Sounds good.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-xl font-semibold text-white">How it works</div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#222222] bg-[#111111] p-5">
            <div className="text-2xl">💬</div>
            <div className="mt-3 text-sm font-semibold text-white">Chat with FinPath AI</div>
            <div className="mt-2 text-sm text-[#888888]">Answer 9 smart questions</div>
          </div>
          <div className="rounded-2xl border border-[#222222] bg-[#111111] p-5">
            <div className="text-2xl">📊</div>
            <div className="mt-3 text-sm font-semibold text-white">Get Your FinPath Score</div>
            <div className="mt-2 text-sm text-[#888888]">Across 6 financial dimensions</div>
          </div>
          <div className="rounded-2xl border border-[#222222] bg-[#111111] p-5">
            <div className="text-2xl">🗺️</div>
            <div className="mt-3 text-sm font-semibold text-white">Get Your ET Journey</div>
            <div className="mt-2 text-sm text-[#888888]">Personalized product recommendations</div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-xl font-semibold text-white">Features</div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#222222] bg-[#111111] p-5">
            <div className="text-sm font-semibold text-white">AI-Powered Profiling</div>
            <div className="mt-2 text-sm text-[#888888]">
              Groq Llama 3 understands your complete financial life
            </div>
          </div>
          <div className="rounded-2xl border border-[#222222] bg-[#111111] p-5">
            <div className="text-sm font-semibold text-white">ET Ecosystem Guide</div>
            <div className="mt-2 text-sm text-[#888888]">
              Discover the right ET products for your goals
            </div>
          </div>
          <div className="rounded-2xl border border-[#222222] bg-[#111111] p-5">
            <div className="text-sm font-semibold text-white">Money Health Score</div>
            <div className="mt-2 text-sm text-[#888888]">
              Know exactly where you stand financially
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#222222] pt-8 text-center text-xs text-[#888888]">
        FinPath AI — Built for ET AI Hackathon 2026 | Powered by Groq Llama 3
      </footer>
    </div>
  )
}
