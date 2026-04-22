import { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Tooltip, Legend, Title,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

import useFetch from '../hooks/useFetch'
import { MOCK_NEEDS } from '../utils/mockData'
import { formatNumber } from '../utils/urgency'
import NeedCard from '../components/NeedCard'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatusBanner from '../components/StatusBanner'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title)

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'DM Sans', size: 12 } } },
    tooltip: { backgroundColor: '#1e293b', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
    y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
  },
}

export default function DashboardPage() {
  const { data: needs, loading, error } = useFetch('/community-needs', MOCK_NEEDS)
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => {
    if (!needs) return {}
    const total  = needs.reduce((s, n) => s + (n.people_affected || 0), 0)
    const high   = needs.filter(n => n.urgency === 'high').length
    const medium = needs.filter(n => n.urgency === 'medium').length
    const low    = needs.filter(n => n.urgency === 'low').length
    return { total, high, medium, low, count: needs.length }
  }, [needs])

  const barData = useMemo(() => {
    if (!needs) return null
    return {
      labels: needs.map(n => n.need_type),
      datasets: [{
        label: 'People Affected',
        data: needs.map(n => n.people_affected),
        backgroundColor: needs.map(n =>
          n.urgency === 'high'   ? 'rgba(239,68,68,0.6)'  :
          n.urgency === 'medium' ? 'rgba(245,158,11,0.6)' :
                                   'rgba(34,197,94,0.6)'
        ),
        borderColor: needs.map(n =>
          n.urgency === 'high'   ? 'rgb(239,68,68)'  :
          n.urgency === 'medium' ? 'rgb(245,158,11)' :
                                   'rgb(34,197,94)'
        ),
        borderWidth: 1,
        borderRadius: 6,
      }],
    }
  }, [needs])

  const doughnutData = useMemo(() => {
    if (!needs) return null
    return {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        data: [stats.high, stats.medium, stats.low],
        backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(34,197,94,0.7)'],
        borderColor:     ['rgb(239,68,68)', 'rgb(245,158,11)', 'rgb(34,197,94)'],
        borderWidth: 2,
      }],
    }
  }, [needs, stats])

  const filtered = useMemo(() => {
    if (!needs) return []
    return filter === 'all' ? needs : needs.filter(n => n.urgency === filter)
  }, [needs, filter])

  if (loading) return <Spinner text="Loading community needs..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        icon="📊"
        title="Needs Dashboard"
        subtitle="Live overview of active community needs and resource allocation status."
      />

      {error && (
        <StatusBanner type="error" message={`API error: ${error} — showing demo data.`} />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Needs',       value: stats.count,  color: 'text-slate-100' },
          { label: 'High Urgency',      value: stats.high,   color: 'text-red-400' },
          { label: 'Medium Urgency',    value: stats.medium, color: 'text-amber-400' },
          { label: 'People Affected',   value: formatNumber(stats.total), color: 'text-forest-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-5 text-center">
            <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-display font-semibold text-slate-200 mb-4">People Affected by Need Type</h3>
          <div className="h-56">
            {barData && (
              <Bar
                data={barData}
                options={{ ...CHART_OPTS, indexAxis: 'y', scales: {
                  x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
                  y: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { display: false } },
                }}}
              />
            )}
          </div>
        </div>
        <div className="glass-card p-5 flex flex-col">
          <h3 className="font-display font-semibold text-slate-200 mb-4">Urgency Breakdown</h3>
          <div className="flex-1 flex items-center justify-center">
            {doughnutData && (
              <div className="h-44 w-44">
                <Doughnut
                  data={doughnutData}
                  options={{ ...CHART_OPTS, cutout: '65%', scales: undefined }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Medium</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-forest-400 inline-block" />Low</span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="font-display font-bold text-xl text-slate-100">All Needs</h2>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${
                filter === f
                  ? f === 'high'   ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    f === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    f === 'low'    ? 'bg-forest-500/20 text-forest-400 border border-forest-500/40' :
                                     'bg-slate-700 text-slate-200 border border-slate-600'
                  : 'bg-slate-800/60 text-slate-500 border border-slate-700 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Need cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No needs found for this filter.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(need => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      )}
    </div>
  )
}
