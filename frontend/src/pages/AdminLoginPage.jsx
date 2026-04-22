import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { loginAsAdmin, loading, error, clearError, user } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loginState, setLoginState] = useState('idle')

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    }
  }, [user, navigate])

  function handleChange(e) {
    clearError()
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoginState('logging-in')
    const ok = await loginAsAdmin({ email: form.email, password: form.password })
    if (ok) {
      setLoginState('done')
      setTimeout(() => navigate('/admin-home'), 400)
    } else {
      setLoginState('idle')
    }
  }

  const isLogging = loginState === 'logging-in' || loading

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[15%] w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-[350px] h-[350px] bg-red-500/4 rounded-full blur-[110px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="glass-card p-8 border-amber-500/20">
          {/* Admin badge */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-slate-100 text-lg leading-tight">
                Smart<span className="text-forest-400">RA</span>
              </p>
              <p className="text-xs text-amber-400/80">Admin Portal</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            Restricted Access
          </div>

          <h2 className="font-display text-2xl font-bold text-slate-100 mb-1">Admin Sign In</h2>
          <p className="text-sm text-slate-500 mb-7">
            Authorized administrators only. All access is logged.
          </p>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Admin Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@smartra.org"
                required
                className="form-input border-amber-500/20 focus:ring-amber-500/30 focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="form-input border-amber-500/20 focus:ring-amber-500/30 focus:border-amber-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLogging}
              className="w-full flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 mt-2"
            >
              {isLogging ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Demo credentials: admin@smartra.org / Admin@123 */}
        </div>
      </div>
    </div>
  )
}
