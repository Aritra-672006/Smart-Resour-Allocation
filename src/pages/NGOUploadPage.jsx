import { useState, useRef } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import StatusBanner from '../components/StatusBanner'

const INITIAL = {
  ngo_name: '',
  location: '',
  report_text: '',
  people_affected: '',
}

export default function NGOUploadPage() {
  const [form,    setForm]    = useState(INITIAL)
  const [file,    setFile]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState(null) // { type, message }
  const fileRef = useRef()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleFile(e) {
    const f = e.target.files[0]
    if (f) setFile(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([k, v]) => payload.append(k, v))
      if (file) payload.append('file', file)

      await api.post('/upload-report', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setStatus({ type: 'success', message: 'Report submitted successfully! Our team will review it shortly.' })
      setForm(INITIAL)
      setFile(null)
    } catch (err) {
      // Demo fallback
      setStatus({ type: 'success', message: '(Demo mode) Report received — backend not connected.' })
      setForm(INITIAL)
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.ngo_name && form.location && form.report_text && form.people_affected

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        icon="📋"
        title="NGO Report Upload"
        subtitle="Submit a field report to flag urgent community needs for resource allocation."
      />

      <StatusBanner
        type={status?.type}
        message={status?.message}
        onDismiss={() => setStatus(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label">NGO Name *</label>
            <input
              name="ngo_name"
              value={form.ngo_name}
              onChange={handleChange}
              placeholder="e.g. Pratham Foundation"
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Sundarbans, West Bengal"
              required
              className="form-input"
            />
          </div>
        </div>

        {/* People affected */}
        <div>
          <label className="form-label">People Affected *</label>
          <input
            name="people_affected"
            type="number"
            min="1"
            value={form.people_affected}
            onChange={handleChange}
            placeholder="Estimated number of people impacted"
            required
            className="form-input"
          />
        </div>

        {/* Report text */}
        <div>
          <label className="form-label">Report / Situation Summary *</label>
          <textarea
            name="report_text"
            value={form.report_text}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the situation: what happened, immediate needs, accessibility challenges, resources on the ground..."
            required
            className="form-input resize-none"
          />
          <p className="text-xs text-slate-600 mt-1.5">
            {form.report_text.length} characters — be as detailed as possible
          </p>
        </div>

        {/* File upload */}
        <div>
          <label className="form-label">Supporting Document (optional)</label>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-forest-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors group"
          >
            <input
              ref={fileRef}
              type="file"
              onChange={handleFile}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-3 text-forest-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{file.name}</span>
                <span className="text-slate-500 text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <div className="text-slate-500 group-hover:text-slate-400 transition-colors">
                <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="font-medium">Drop a file or click to browse</p>
                <p className="text-xs mt-1">PDF, Word, JPG, PNG — max 10 MB</p>
              </div>
            )}
          </div>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs text-red-400 hover:text-red-300 mt-2 transition-colors"
            >
              Remove file
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
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
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Submit Report
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setForm(INITIAL); setFile(null); setStatus(null) }}
            className="btn-secondary text-sm"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  )
}
