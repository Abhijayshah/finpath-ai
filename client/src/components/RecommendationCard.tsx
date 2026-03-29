import type { ETRecommendation } from '../../../shared/types'

function PriorityPill({ priority }: { priority: ETRecommendation['priority'] }) {
  const styles =
    priority === 'high'
      ? 'bg-etOrange/15 text-etOrange ring-etOrange/30'
      : priority === 'medium'
        ? 'bg-white/10 text-slate-200 ring-white/20'
        : 'bg-white/5 text-slate-300 ring-white/10'

  return (
    <span
      className={['inline-flex items-center rounded-full px-2 py-1 text-[11px] ring-1', styles].join(
        ' ',
      )}
    >
      {priority.toUpperCase()}
    </span>
  )
}

export default function RecommendationCard({ rec }: { rec: ETRecommendation }) {
  return (
    <a
      href={rec.link}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{rec.product}</div>
          <div className="mt-1 text-xs text-slate-400">{rec.reason}</div>
        </div>
        <PriorityPill priority={rec.priority} />
      </div>
      <div className="mt-4 text-xs font-medium text-etOrange">Open in ET →</div>
    </a>
  )
}
