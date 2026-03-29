import type { ETRecommendation } from '../../../shared/types'

function PriorityPill({ priority }: { priority: ETRecommendation['priority'] }) {
  const styles =
    priority === 'high'
      ? 'bg-red-50 text-red-600 ring-red-200'
      : priority === 'medium'
        ? 'bg-orange-50 text-etOrange ring-orange-200'
        : 'bg-slate-50 text-textSecondary ring-border'

  return (
    <span
      className={['inline-flex items-center rounded-full px-2 py-1 text-[11px] ring-1', styles].join(' ')}
    >
      {priority.toUpperCase()}
    </span>
  )
}

export default function RecommendationCard({ rec }: { rec: ETRecommendation }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-etOrange">{rec.product}</div>
          <div className="mt-2 text-sm text-textSecondary">{rec.reason}</div>
        </div>
        <PriorityPill priority={rec.priority} />
      </div>
      <a
        href={rec.link}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-etOrange px-4 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Explore on ET →
      </a>
    </div>
  )
}
