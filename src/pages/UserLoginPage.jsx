import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Demo credentials — kept in code but not shown on screen
// user@example.com / password123

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function UserLoginPage() {
  const navigate = useNavigate()
  const { loginAsUser, signupAsUser, loading, error, clearError, user } = useAuth()

  const [mode, setMode]           = useState('login')   // 'login' | 'signup'
  const [step, setStep]           = useState('form')    // 'form' | 'otp'
  const [form, setForm]           = useState({ name: '', email: '', phone: '', password: '' })
  const [loginState, setLoginState] = useState('idle')
  const [otp, setOtp]             = useState(['', '', '', '', '', ''])
  const [generatedOtp, setGeneratedOtp] = useState(null)
  const [otpError, setOtpError]   = useState('')
  const [otpTimer, setOtpTimer]   = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [pendingData, setPendingData] = useState(null)
  const otpRefs = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin-home' : '/home', { replace: true })
  }, [user, navigate])

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== 'otp') return
    setOtpTimer(30)
    setCanResend(false)
    timerRef.current = setInterval(() => {
      setOtpTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [step])

  function handleChange(e) {
    clearError()
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Login submit (no OTP needed)
  async function handleLoginSubmit(e) {
    e.preventDefault()
    setLoginState('logging-in')
    const ok = await loginAsUser({ email: form.email, password: form.password })
    if (ok) {
      setLoginState('done')
      setTimeout(() => navigate('/home'), 400)
    } else {
      setLoginState('idle')
    }
  }

  // Signup step 1: validate form → send OTP
  function handleSignupSubmit(e) {
    e.preventDefault()
    if (form.phone.replace(/\D/g, '').length < 10) {
      clearError()
      return
    }
    const code = generateOTP()
    setGeneratedOtp(code)
    setPendingData({ name: form.name, email: form.email, phone: form.phone, password: form.password })
    // In production this would send via SMS gateway
    console.info(`[DEV] OTP for ${form.phone}: ${code}`)
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
    setStep('otp')
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  // OTP digit input handler
  function handleOtpChange(index, value) {
    if (!/^\d?$/.test(value)) return
    setOtpError('')
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
    if (!value && index > 0) otpRefs.current[index - 1]?.focus()
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpPaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || ''
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  // OTP step 2: verify → create account
  async function handleVerifyOtp(e) {
    e.preventDefault()
    const entered = otp.join('')
    if (entered.length < 6) { setOtpError('Please enter all 6 digits.'); return }
    if (entered !== generatedOtp) { setOtpError('Incorrect OTP. Please try again.'); return }

    setLoginState('logging-in')
    const ok = await signupAsUser(pendingData)
    if (ok) {
      setLoginState('done')
      setTimeout(() => navigate('/home'), 400)
    } else {
      setLoginState('idle')
      setStep('form')
    }
  }

  function handleResend() {
    const code = generateOTP()
    setGeneratedOtp(code)
    console.info(`[DEV] Resent OTP for ${pendingData?.phone}: ${code}`)
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
    setCanResend(false)
    setOtpTimer(30)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setOtpTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0 }
        return t - 1
      })
    }, 1000)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  const isLogging = loginState === 'logging-in' || loading
  const otpFilled = otp.every(d => d !== '')

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] bg-forest-500/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-slate-100 text-lg leading-tight">Smart<span className="text-forest-400">RA</span></p>
              <p className="text-xs text-slate-500">Volunteer Portal</p>
            </div>
          </div>

          {/* ── OTP STEP ── */}
          {step === 'otp' ? (
            <div>
              {/* Back to form */}
              <button onClick={() => { setStep('form'); setOtpError('') }} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-sm mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {/* Phone icon */}
              <div className="flex items-center justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-forest-500/15 border border-forest-500/25 flex items-center justify-center">
                  <svg className="w-7 h-7 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold text-slate-100 mb-1 text-center">Verify your phone</h2>
              <p className="text-sm text-slate-500 mb-1 text-center">
                We sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-slate-300 mb-7 text-center">{pendingData?.phone}</p>

              {otpError && (
                <div className="mb-5 flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-400">{otpError}</p>
                </div>
              )}

              {/* OTP boxes */}
              <form onSubmit={handleVerifyOtp}>
                <div className="flex gap-2.5 justify-center mb-7" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border transition-all duration-150 bg-slate-800/80 text-slate-100 focus:outline-none ${
                        digit
                          ? 'border-forest-500 bg-forest-500/10 text-forest-300'
                          : 'border-slate-700 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/30'
                      } ${otpError ? 'border-red-500/60' : ''}`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLogging || !otpFilled}
                  className="w-full btn-primary flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLogging ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Creating account...
                    </>
                  ) : 'Verify & Create Account'}
                </button>
              </form>

              {/* Resend */}
              <div className="text-center mt-5">
                {canResend ? (
                  <button onClick={handleResend} className="text-sm text-forest-400 hover:text-forest-300 transition-colors font-semibold">
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-slate-600">
                    Resend in <span className="text-slate-400 font-mono">{otpTimer}s</span>
                  </p>
                )}
              </div>

              {/* Dev hint — visible only in browser console, not on screen */}
              {/* OTP is logged to console: open DevTools → Console to see it */}
            </div>

          ) : (
            /* ── FORM STEP (login / signup) ── */
            <div>
              {/* Mode toggle */}
              <div className="flex bg-slate-900/60 rounded-xl p-1 mb-7 gap-1">
                {[{ key: 'login', label: 'Sign In' }, { key: 'signup', label: 'Sign Up' }].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setMode(key); clearError(); setForm({ name: '', email: '', phone: '', password: '' }) }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === key ? 'bg-forest-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <h2 className="font-display text-2xl font-bold text-slate-100 mb-1">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                {mode === 'login' ? 'Sign in to access your volunteer portal.' : 'Join the SmartRA community today.'}
              </p>

              {error && (
                <div className="mb-5 flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={mode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="form-label">Full Name</label>
                    <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Jane Doe" required className="form-input" />
                  </div>
                )}

                <div>
                  <label className="form-label">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="form-input" />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="form-label">Phone Number</label>
                    <div className="flex gap-2">
                      <span className="form-input w-16 flex items-center justify-center text-slate-400 text-sm shrink-0 cursor-default select-none">+91</span>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="98765 43210"
                        required
                        maxLength={15}
                        pattern="[0-9\s\-\+]{10,15}"
                        className="form-input flex-1"
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">OTP will be sent to this number for verification</p>
                  </div>
                )}

                <div>
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                    required
                    minLength={mode === 'signup' ? 8 : 6}
                    className="form-input"
                  />
                </div>

                <button type="submit" disabled={isLogging} className="w-full btn-primary flex items-center justify-center gap-2.5 mt-2">
                  {isLogging ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {mode === 'login' ? 'Logging in...' : 'Sending OTP...'}
                    </>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Send OTP & Continue →'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
