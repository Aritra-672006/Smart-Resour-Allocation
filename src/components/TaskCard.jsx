import { useState } from 'react'
import { getUrgencyClasses } from '../utils/urgency'
import api from '../utils/api'

export default function TaskCard({ task, onAccepted }) {
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const { badge, card, glow } = getUrgencyClasses(task.urgency)

  const filled = task.volunteers_assigned || 0
  const total  = task.volunteers_needed   || 1
  const pct    = Math.min(Math.round((filled / total) * 100), 100)

  async function handleAccept() {
    setLoading(true)
    try {
      await api.post(`/accept-task/${task.id}`)
      setAccepted(true)
      onAccepted && onAccepted(task.id)
    } catch {
      // In demo mode the API might not exist — still show as accepted
      setAccepted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`glass-card p-5 border-l-4 ${card} hover:shadow-xl ${glow} transition-all duration-200 hover:-translate-y-0.5`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-mono text-xs text-slate-500 mb-0.5">{task.id}</p>
          <h3 className="font-display font-semibold text-slate-100">{task.title}</h3>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${badge}`}>
          {task.urgency}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 mb-4 leading-relaxed">{task.description}</p>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="bg-slate-800/60 rounded-lg p-2.5">
          <p className="text-slate-500 mb-0.5">Location</p>
          <p className="text-slate-300 font-medium">{task.location}</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-2.5">
          <p className="text-slate-500 mb-0.5">Date</p>
          <p className="text-slate-300 font-medium">{task.date}</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-2.5">
          <p className="text-slate-500 mb-0.5">Duration</p>
          <p className="text-slate-300 font-medium">{task.duration}</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-2.5">
          <p className="text-slate-500 mb-0.5">Skills</p>
          <p className="text-slate-300 font-medium truncate">{task.skills_needed?.join(', ')}</p>
        </div>
      </div>

      {/* Volunteer progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Volunteers filled</span>
          <span>{filled} / {total}</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Accept button */}
      {accepted ? (
        <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forest-500/15 border border-forest-500/30 text-forest-400 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Task Accepted!
        </div>
      ) : (
        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Accepting...
            </>
          ) : (
            'Accept Task'
          )}
        </button>
      )}
    </div>
  )
}
