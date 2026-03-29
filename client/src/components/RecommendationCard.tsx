import type { ETRecommendation } from '../../../shared/types'
import { ExternalLink } from 'lucide-react'

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
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-etOrange to-orange-300 opacity-90" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-etOrange">{rec.product}</div>
          <div className="mt-2 text-sm text-textSecondary dark:text-gray-300">{rec.reason}</div>
        </div>
        <PriorityPill priority={rec.priority} />
      </div>
      <a
        href={rec.link}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-etOrange/40 bg-white px-4 text-sm font-semibold text-etOrange transition hover:bg-etOrange hover:text-white dark:bg-transparent"
      >
        Explore on ET
        <ExternalLink size={16} />
      </a>
    </div>
  )
}
