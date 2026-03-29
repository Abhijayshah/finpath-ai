import type { FinancialScore } from '../../../shared/types'

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span className="tabular-nums">{value}/100</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
        <div
          className="h-full rounded-full bg-etOrange"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}

export default function ScoreCard({ score }: { score: FinancialScore }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Financial Health</div>
          <div className="mt-1 text-xs text-slate-400">
            Placeholder scoring model. Backend rules will replace this.
          </div>
        </div>
        <div className="grid size-14 place-items-center rounded-xl bg-etOrange/15 text-etOrange ring-1 ring-etOrange/30">
          <div className="text-lg font-bold tabular-nums">{score.overall}</div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Bar label="Emergency" value={score.emergency} />
        <Bar label="Insurance" value={score.insurance} />
        <Bar label="Investments" value={score.investments} />
        <Bar label="Debt" value={score.debt} />
        <Bar label="Tax Efficiency" value={score.taxEfficiency} />
        <Bar label="Retirement" value={score.retirement} />
      </div>
    </div>
  )
}
