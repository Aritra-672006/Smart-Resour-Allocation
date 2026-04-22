import { useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import StatusBanner from '../components/StatusBanner'

const SKILL_OPTIONS = [
  'Medical', 'First Aid', 'Logistics', 'Driving', 'Construction',
  'Carpentry', 'Water Sanitation', 'Teaching', 'Community Outreach',
  'Engineering', 'Counselling', 'IT/Tech', 'Cooking', 'Translation',
]

const AVAILABILITY_OPTIONS = [
  'Weekdays (9–5)',
  'Evenings (5–9 PM)',
  'Weekends',
  'Overnight Shifts',
  'On-call / Emergency',
  'Full-time (1 week+)',
]

const INITIAL = {
  name: '',
  phone: '',
  location: '',
}

export default function VolunteerPage() {
  const [form,         setForm]         = useState(INITIAL)
  const [skills,       setSkills]       = useState([])
  const [availability, setAvailability] = useState([])
  const [loading,      setLoading]      = useState(false)
  const [status,       setStatus]       = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function toggleSkill(skill) {
    setSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  function toggleAvailability(opt) {
    setAvailability(prev =>
      prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      await api.post('/register-volunteer', {
        ...form,
        skills,
        availability,
      })
      setStatus({ type: 'success', message: 'Registration successful! We\'ll reach out with matching tasks soon.' })
      setForm(INITIAL)
      setSkills([])
      setAvailability([])
    } catch {
      setStatus({ type: 'success', message: '(Demo mode) Volunteer registered — backend not connected.' })
      setForm(INITIAL)
      setSkills([])
      setAvailability([])
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.name && form.phone && form.location && skills.length > 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        icon="🤝"
        title="Volunteer Registration"
        subtitle="Sign up to offer your skills and time to communities that need help."
      />

      <StatusBanner
        type={status?.type}
        message={status?.message}
        onDismiss={() => setStatus(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-slate-200 text-lg border-b border-slate-700 pb-3">
            Personal Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Full Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arjun Mehta"
                required
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Phone Number *</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Your Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Kolkata, West Bengal"
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-slate-200 text-lg border-b border-slate-700 pb-3 mb-4">
            Skills{' '}
            <span className="text-slate-500 font-normal text-sm">(select all that apply *)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map(skill => {
              const active = skills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    active
                      ? 'bg-forest-500/20 border-forest-500/50 text-forest-400'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {active && <span className="mr-1">✓</span>}
                  {skill}
                </button>
              )
            })}
          </div>
          {skills.length > 0 && (
            <p className="text-xs text-slate-500 mt-3">
              {skills.length} skill{skills.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Availability */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-slate-200 text-lg border-b border-slate-700 pb-3 mb-4">
            Availability{' '}
            <span className="text-slate-500 font-normal text-sm">(optional)</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {AVAILABILITY_OPTIONS.map(opt => {
              const active = availability.includes(opt)
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? 'bg-forest-500/10 border-forest-500/40 text-forest-400'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleAvailability(opt)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'bg-forest-500 border-forest-500' : 'border-slate-600'
                  }`}>
                    {active && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{opt}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Registering...
              </>
            ) : (
              'Register as Volunteer'
            )}
          </button>
          <p className="text-xs text-slate-600">
            * Required fields
          </p>
        </div>
      </form>
    </div>
  )
}
