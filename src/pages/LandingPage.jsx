import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATS = [
  { value: '12,400+', label: 'People Reached' },
  { value: '340',     label: 'Active Volunteers' },
  { value: '58',      label: 'NGO Partners' },
  { value: '6',       label: 'Districts Covered' },
]

const FEATURES = [
  { icon: '📋', title: 'NGO Report Uploads', desc: 'NGOs submit field reports with affected counts and needs for immediate triage.' },
  { icon: '🤝', title: 'Volunteer Matching', desc: 'Volunteers register skills and availability; our system assigns the best-fit tasks.' },
  { icon: '📊', title: 'Live Needs Dashboard', desc: 'Real-time urgency scoring and visualizations across all active community needs.' },
  { icon: '🗺️', title: 'Geographic Heatmap', desc: 'Interactive Leaflet map shows need clusters and resource gaps across the region.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-forest-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] bg-blue-500/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-forest-500/10 border border-forest-500/25 text-forest-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
            AI-Powered Humanitarian Platform
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 leading-[1.05] mb-6">
            Smart{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-400 to-forest-600">Resource</span>
            <br />Allocation
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
            Connecting NGOs, volunteers, and communities to direct aid where it's needed most — faster, smarter, and with complete transparency.
          </p>

          {user ? (
            <button
              onClick={() => navigate(user.role === 'admin' ? '/admin-home' : '/home')}
              className="btn-primary flex items-center gap-2 text-base px-8 py-4 mx-auto"
            >
              Go to {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'} →
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary flex items-center gap-2.5 text-base px-8 py-4"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login / Sign Up (User)
                </button>
                <button
                  onClick={() => navigate('/admin-login')}
                  className="flex items-center gap-2.5 text-base px-8 py-4 rounded-xl font-semibold border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all duration-200 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Login as Admin
                </button>
              </div>
              <p className="text-xs text-slate-600">Sign in to access the full platform</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-display font-bold text-forest-400">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-slate-100 mb-3">Everything you need to coordinate aid</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From field reports to task assignments — one platform that keeps relief efforts moving efficiently.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="glass-card p-6 hover:border-forest-500/30 transition-colors group">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-display font-semibold text-slate-100 mb-2 group-hover:text-forest-400 transition-colors">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-500/5 to-transparent pointer-events-none" />
          <h2 className="font-display text-3xl font-bold text-slate-100 mb-3 relative">Ready to make an impact?</h2>
          <p className="text-slate-400 mb-8 relative">Join hundreds of volunteers already working on the ground.</p>
          <div className="flex flex-wrap justify-center gap-4 relative">
            <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3">Join as Volunteer</button>
            <button onClick={() => navigate('/login')} className="btn-secondary px-8 py-3">Sign In to Browse Tasks</button>
          </div>
        </div>
      </section>
    </div>
  )
}
