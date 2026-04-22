import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import useFetch from '../hooks/useFetch'
import { MOCK_NEEDS } from '../utils/mockData'
import { getUrgencyClasses, formatNumber } from '../utils/urgency'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

// Urgency → map colour
const URGENCY_COLOR = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
}

// Auto-fit bounds to markers
function FitBounds({ needs }) {
  const map = useMap()
  useEffect(() => {
    if (!needs || needs.length === 0) return
    const valid = needs.filter(n => n.lat && n.lng)
    if (valid.length === 0) return
    const bounds = valid.map(n => [n.lat, n.lng])
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [needs, map])
  return null
}

export default function MapPage() {
  const { data: needs, loading, error } = useFetch('/community-needs', MOCK_NEEDS)
  const [selected, setSelected] = useState(null)
  const [filterUrgency, setFilterUrgency] = useState('all')

  const filtered = (needs || []).filter(n =>
    (filterUrgency === 'all' || n.urgency === filterUrgency) && n.lat && n.lng
  )

  const totalAffected = filtered.reduce((s, n) => s + (n.people_affected || 0), 0)

  if (loading) return <Spinner text="Loading map data..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        icon="🗺️"
        title="Geographic Need Map"
        subtitle="Interactive map showing community needs and urgency levels across regions."
      />

      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-slate-400">
          {['high', 'medium', 'low'].map(u => (
            <span key={u} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: URGENCY_COLOR[u] }}
              />
              <span className="capitalize">{u}</span>
            </span>
          ))}
          <span className="text-slate-600">|  Larger circle = more people</span>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilterUrgency(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border transition-all ${
                filterUrgency === f
                  ? 'bg-slate-700 border-slate-500 text-slate-200'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map + sidebar layout */}
      <div className="grid lg:grid-cols-4 gap-5">
        {/* Map */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-800" style={{ height: 540 }}>
          <MapContainer
            center={[23.5, 87.5]}
            zoom={7}
            style={{ width: '100%', height: '100%' }}
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds needs={filtered} />

            {filtered.map(need => {
              const radius = Math.max(8, Math.min(32, Math.sqrt(need.people_affected / 10)))
              const color  = URGENCY_COLOR[need.urgency] || '#94a3b8'

              return (
                <CircleMarker
                  key={need.id}
                  center={[need.lat, need.lng]}
                  radius={radius}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.55,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => setSelected(need),
                  }}
                >
                  <Popup>
                    <div className="text-slate-900 font-sans text-sm min-w-[180px]">
                      <p className="font-bold text-base mb-1">{need.need_type}</p>
                      <p className="text-slate-600 text-xs mb-1">📍 {need.location}</p>
                      <p className="text-xs mb-1">
                        <span className="font-semibold">{formatNumber(need.people_affected)}</span> people affected
                      </p>
                      <span
                        className="inline-block text-xs font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ backgroundColor: color + '33', color }}
                      >
                        {need.urgency}
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-display font-semibold text-slate-200 text-sm">Map Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Visible Needs</span>
                <span className="text-slate-200 font-semibold">{filtered.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Affected</span>
                <span className="text-forest-400 font-semibold">{formatNumber(totalAffected)}</span>
              </div>
              {['high', 'medium', 'low'].map(u => (
                <div key={u} className="flex justify-between">
                  <span className="text-slate-500 capitalize">{u} urgency</span>
                  <span className="font-semibold" style={{ color: URGENCY_COLOR[u] }}>
                    {filtered.filter(n => n.urgency === u).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected detail */}
          {selected ? (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-slate-200 text-sm">Selected</h3>
                <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-slate-400 text-xs">
                  ✕ clear
                </button>
              </div>
              <p className="font-semibold text-slate-100 mb-1">{selected.need_type}</p>
              <p className="text-xs text-slate-500 mb-2">📍 {selected.location}</p>
              {selected.description && (
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{selected.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full uppercase"
                  style={{ backgroundColor: URGENCY_COLOR[selected.urgency] + '22', color: URGENCY_COLOR[selected.urgency] }}
                >
                  {selected.urgency} urgency
                </span>
                <span className="text-xs text-slate-500">{formatNumber(selected.people_affected)} affected</span>
              </div>
            </div>
          ) : (
            <div className="glass-card p-4 text-center text-slate-600 text-xs">
              Click a circle on the map to see details here.
            </div>
          )}

          {/* Need list */}
          <div className="glass-card p-4 flex-1 overflow-y-auto max-h-64">
            <h3 className="font-display font-semibold text-slate-200 text-sm mb-3">All Locations</h3>
            <div className="space-y-2">
              {filtered.map(need => (
                <button
                  key={need.id}
                  onClick={() => setSelected(need)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    selected?.id === need.id ? 'bg-slate-700' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: URGENCY_COLOR[need.urgency] }}
                    />
                    <span className="text-slate-300 truncate">{need.need_type}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5 ml-4 truncate">{need.location}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
