import { useState, useMemo } from 'react'
import useFetch from '../hooks/useFetch'
import { MOCK_ASSIGNMENTS } from '../utils/mockData'
import TaskCard from '../components/TaskCard'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatusBanner from '../components/StatusBanner'

export default function TaskPage() {
  const { data: tasks, loading, error, setData } = useFetch('/assignments', MOCK_ASSIGNMENTS)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  function handleAccepted(taskId) {
    // Could update local state here if needed
  }

  const filtered = useMemo(() => {
    if (!tasks) return []
    return tasks.filter(t => {
      const matchFilter = filter === 'all' || t.urgency === filter
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase()) ||
        t.skills_needed?.some(s => s.toLowerCase().includes(search.toLowerCase()))
      return matchFilter && matchSearch
    })
  }, [tasks, filter, search])

  if (loading) return <Spinner text="Loading task assignments..." />

  const counts = {
    all:    tasks?.length || 0,
    high:   tasks?.filter(t => t.urgency === 'high').length   || 0,
    medium: tasks?.filter(t => t.urgency === 'medium').length || 0,
    low:    tasks?.filter(t => t.urgency === 'low').length    || 0,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        icon="✅"
        title="Volunteer Task Board"
        subtitle="Browse open assignments and accept tasks that match your skills."
      />

      {error && (
        <StatusBanner type="error" message={`API error: ${error} — showing demo data.`} />
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, location or skill..."
            className="form-input pl-10 text-sm"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 shrink-0">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all flex items-center gap-1.5 ${
                filter === f
                  ? f === 'high'   ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : f === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : f === 'low'    ? 'bg-forest-500/20 text-forest-400 border border-forest-500/40'
                  :                  'bg-slate-700 text-slate-200 border border-slate-600'
                  : 'bg-slate-800/60 text-slate-500 border border-slate-700 hover:text-slate-300'
              }`}
            >
              {f}
              <span className="bg-slate-700/80 rounded-full px-1.5 py-0.5 text-slate-400 font-mono text-xs">
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-5">
        Showing {filtered.length} of {tasks?.length || 0} tasks
      </p>

      {/* Task grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg mb-2">No tasks found</p>
          <p className="text-slate-600 text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} onAccepted={handleAccepted} />
          ))}
        </div>
      )}
    </div>
  )
}
