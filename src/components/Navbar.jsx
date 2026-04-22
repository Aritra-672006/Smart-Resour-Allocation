import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const USER_NAV = [
  { path: '/tasks',     label: 'Tasks' },
  { path: '/map',       label: 'Map' },
  { path: '/upload',    label: 'NGO Upload' },
  { path: '/volunteer', label: 'Volunteer' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
    setOpen(false)
  }

  // Admin has its own full-page sidebar layout — no top navbar needed
  if (user?.role === 'admin') return null

  const navItems = user ? USER_NAV : []

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to={user ? '/home' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-forest-500 flex items-center justify-center group-hover:bg-forest-400 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-slate-100 leading-none">
              Smart<span className="text-forest-400">RA</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-forest-400 bg-forest-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-7 h-7 rounded-full bg-forest-500/20 border border-forest-500/30 flex items-center justify-center text-forest-400 text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-slate-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-outline text-sm px-4 py-2">
                  Sign In
                </button>
                <button onClick={() => navigate('/admin-login')} className="text-sm px-4 py-2 text-amber-400 hover:text-amber-300 transition-colors border border-amber-500/30 rounded-lg hover:bg-amber-500/10">
                  Admin
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-3 space-y-1">
          {navItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-forest-400 bg-forest-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setOpen(false) }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-forest-400 hover:bg-forest-500/10 transition-colors">Sign In (User)</button>
              <button onClick={() => { navigate('/admin-login'); setOpen(false) }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-amber-500/10 transition-colors">Admin Login</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
