import type { ETRecommendation } from '../../../shared/types'

function PriorityPill({ priority }: { priority: ETRecommendation['priority'] }) {
  const styles =
    priority === 'high'
      ? 'bg-red-500/15 text-red-300 ring-red-500/30'
      : priority === 'medium'
        ? 'bg-etOrange/15 text-etOrange ring-etOrange/30'
        : 'bg-white/5 text-[#888888] ring-[#222222]'

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
    <div className="rounded-2xl border border-[#222222] bg-[#111111] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-etOrange">{rec.product}</div>
          <div className="mt-2 text-sm text-[#888888]">{rec.reason}</div>
        </div>
        <PriorityPill priority={rec.priority} />
      </div>
      <a
        href={rec.link}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-etOrange px-4 text-sm font-semibold text-black transition hover:brightness-110"
      >
        Explore on ET →
      </a>
    </div>
  )
}
