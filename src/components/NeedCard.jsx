import { getUrgencyClasses, formatNumber } from '../utils/urgency'

const NEED_ICONS = {
  'Food & Nutrition':  '🌾',
  'Medical Aid':       '🏥',
  'Shelter':           '🏠',
  'Clean Water':       '💧',
  'Education Support': '📚',
  'Livelihood':        '🛠️',
}

export default function NeedCard({ need }) {
  const { badge, dot, card, glow } = getUrgencyClasses(need.urgency)
  const icon = NEED_ICONS[need.need_type] || '📦'

  return (
    <div
      className={`glass-card p-5 border-l-4 ${card} hover:shadow-xl ${glow} transition-all duration-200 hover:-translate-y-0.5`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-sm leading-tight">
              {need.need_type}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{need.location}</p>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${badge}`}>
          {need.urgency}
        </span>
      </div>

      {/* Description */}
      {need.description && (
        <p className="text-sm text-slate-400 mb-4 leading-relaxed line-clamp-2">
          {need.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
          <span className="text-xs text-slate-500">Active Need</span>
        </div>
        <div className="text-right">
          <p className="text-lg font-display font-bold text-slate-100">
            {formatNumber(need.people_affected)}
          </p>
          <p className="text-xs text-slate-500">people affected</p>
        </div>
      </div>
    </div>
  )
}
