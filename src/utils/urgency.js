// Returns Tailwind class sets based on urgency level
export function getUrgencyClasses(urgency) {
  switch (urgency?.toLowerCase()) {
    case 'high':
      return {
        badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
        dot: 'bg-red-400',
        card: 'border-l-red-500',
        glow: 'shadow-red-500/10',
      }
    case 'medium':
      return {
        badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        dot: 'bg-amber-400',
        card: 'border-l-amber-500',
        glow: 'shadow-amber-500/10',
      }
    case 'low':
    default:
      return {
        badge: 'bg-forest-500/20 text-forest-400 border border-forest-500/30',
        dot: 'bg-forest-400',
        card: 'border-l-forest-500',
        glow: 'shadow-forest-500/10',
      }
  }
}

export function formatNumber(n) {
  if (!n && n !== 0) return '—'
  return Number(n).toLocaleString('en-IN')
}
