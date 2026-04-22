import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_NEEDS, MOCK_ASSIGNMENTS } from '../utils/mockData'

const OPTIONS = [
  {
    section: 'overview',
    icon: '📊',
    title: 'Overview',
    desc: 'Platform-wide stats, active needs, and recent task summary.',
    color: 'hover:border-amber-500/50 hover:bg-amber-500/5',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/10',
  },
  {
    section: 'tasks',
    icon: '✅',
    title: 'Manage Tasks',
    desc: 'Create, edit, and delete volunteer task assignments.',
    color: 'hover:border-forest-500/50 hover:bg-forest-500/5',
    accent: 'text-forest-400',
    badge: 'bg-forest-500/10',
  },
  {
    section: 'users',
    icon: '👥',
    title: 'Manage Users',
    desc: 'View, edit, and manage all registered volunteers and NGO leads.',
    color: 'hover:border-blue-500/50 hover:bg-blue-500/5',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/10',
  },
  {
    section: 'ngo',
    icon: '🏢',
    title: 'NGO Reports',
    desc: 'Review and approve field reports submitted by partner NGOs.',
    color: 'hover:border-purple-500/50 hover:bg-purple-500/5',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/10',
  },
  {
    section: 'map',
    icon: '🗺️',
    title: 'Map View',
    desc: 'Geographic overview of active needs across all districts.',
    color: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
    accent: 'text-cyan-400',
    badge: 'bg-cyan-500/10',
  },
  {
    section: 'settings',
    icon: '⚙️',
    title: 'Settings',
    desc: 'Manage your admin profile and platform preferences.',
    color: 'hover:border-slate-500/50 hover:bg-slate-500/5',
    accent: 'text-slate-300',
    badge: 'bg-slate-700/60',
  },
]

export default function AdminHomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const stats = {
    tasks: MOCK_ASSIGNMENTS.length,
    highUrgency: MOCK_NEEDS.filter(n => n.urgency === 'high').length,
    totalPeople: MOCK_NEEDS.reduce((s, n) => s + (n.people_affected || 0), 0),
  }

  function goTo(section) {
    navigate('/admin', { state: { section } })
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-5%] left-[10%] w-[400px] h-[400px] bg-red-500/4 rounded-full blur-[110px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-lg text-slate-100">Smart<span className="text-forest-400">RA</span></span>
              <span className="ml-2 text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-bold">A</div>
              <span className="text-sm text-slate-300">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10">
              Sign Out
            </button>
          </div>
        </div>

        {/* Welcome + quick stats */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Admin Control Panel
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-100 mb-3">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Administrator</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Select a section below to manage the platform.
          </p>

          {/* Quick stats strip */}
          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            {[
              { label: 'Active Tasks', value: stats.tasks, color: 'text-forest-400' },
              { label: 'High Urgency', value: stats.highUrgency, color: 'text-red-400' },
              { label: 'People Affected', value: stats.totalPeople.toLocaleString('en-IN'), color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Option cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OPTIONS.map(({ section, icon, title, desc, color, accent, badge }) => (
            <button
              key={section}
              onClick={() => goTo(section)}
              className={`glass-card p-6 text-left transition-all duration-200 cursor-pointer group ${color} active:scale-[0.98]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${badge} flex items-center justify-center text-xl`}>
                  {icon}
                </div>
                <svg className={`w-4 h-4 ${accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-100 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-10">
          SmartRA Admin — All actions are logged for audit purposes
        </p>
      </div>
    </div>
  )
}
