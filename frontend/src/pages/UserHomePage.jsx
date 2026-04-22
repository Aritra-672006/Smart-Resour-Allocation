import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const OPTIONS = [
  {
    path: '/tasks',
    icon: '✅',
    title: 'Task Board',
    desc: 'Browse open assignments and accept tasks that match your skills.',
    color: 'hover:border-forest-500/50 hover:bg-forest-500/5',
    accent: 'text-forest-400',
    badge: 'bg-forest-500/10 text-forest-400',
  },
  {
    path: '/volunteer',
    icon: '🤝',
    title: 'Volunteer Signup',
    desc: 'Register your skills and availability to get matched with relief tasks.',
    color: 'hover:border-blue-500/50 hover:bg-blue-500/5',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400',
  },
  {
    path: '/upload',
    icon: '📋',
    title: 'NGO Report Upload',
    desc: 'Submit field reports with affected counts and resource needs.',
    color: 'hover:border-amber-500/50 hover:bg-amber-500/5',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400',
  },
  {
    path: '/map',
    icon: '🗺️',
    title: 'Live Map',
    desc: 'View the geographic heatmap of community needs and resource gaps.',
    color: 'hover:border-purple-500/50 hover:bg-purple-500/5',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400',
  },
]

export default function UserHomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-forest-500/6 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[110px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-slate-100">Smart<span className="text-forest-400">RA</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-forest-500/20 border border-forest-500/30 flex items-center justify-center text-forest-400 text-sm font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-300">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-forest-500/10 border border-forest-500/25 text-forest-400 text-xs font-semibold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
            Volunteer Portal
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-100 mb-3">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-400 to-forest-600">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            What would you like to do today? Choose an option below to get started.
          </p>
        </div>

        {/* Option cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {OPTIONS.map(({ path, icon, title, desc, color, accent, badge }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`glass-card p-7 text-left transition-all duration-200 cursor-pointer group ${color} active:scale-[0.98]`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl ${badge} flex items-center justify-center text-2xl`}>
                  {icon}
                </div>
                <svg className={`w-5 h-5 ${accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className={`font-display text-xl font-bold text-slate-100 mb-2 group-hover:${accent} transition-colors`}>
                {title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-10">
          SmartRA — AI-Powered Humanitarian Resource Allocation Platform
        </p>
      </div>
    </div>
  )
}
