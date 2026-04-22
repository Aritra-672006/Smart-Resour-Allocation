import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_NEEDS, MOCK_ASSIGNMENTS } from '../utils/mockData'
import { formatNumber } from '../utils/urgency'

const INITIAL_USERS = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@example.com', role: 'Volunteer', status: 'Active',   tasks: 3 },
  { id: 2, name: 'Rahul Das',     email: 'rahul@example.com', role: 'Volunteer', status: 'Active',   tasks: 1 },
  { id: 3, name: 'Ayesha Khan',   email: 'ayesha@example.com',role: 'Volunteer', status: 'Inactive', tasks: 0 },
  { id: 4, name: 'Siddharth Roy', email: 'sid@example.com',   role: 'NGO Lead',  status: 'Active',   tasks: 5 },
  { id: 5, name: 'Meena Patel',   email: 'meena@ngo.org',     role: 'NGO Lead',  status: 'Active',   tasks: 2 },
]

const INITIAL_NGO_REPORTS = [
  { id: 'R-001', ngo: 'Sahayata Foundation', district: 'Sundarbans', need: 'Food & Nutrition', people: 1200, submitted: '2025-04-18', status: 'Approved' },
  { id: 'R-002', ngo: 'Hope Bengal',         district: 'Murshidabad', need: 'Medical Aid',     people: 340,  submitted: '2025-04-17', status: 'Approved' },
  { id: 'R-003', ngo: 'GreenRoots NGO',      district: 'Cooch Behar', need: 'Shelter',         people: 780,  submitted: '2025-04-19', status: 'Pending'  },
  { id: 'R-004', ngo: 'AquaRelief',          district: 'Malda',       need: 'Clean Water',     people: 560,  submitted: '2025-04-20', status: 'Pending'  },
  { id: 'R-005', ngo: 'EduReach WB',         district: 'Bankura',     need: 'Education',       people: 210,  submitted: '2025-04-16', status: 'Approved' },
]

const NAV_ITEMS = [
  { id: 'overview', icon: '📊', label: 'Overview'     },
  { id: 'tasks',    icon: '✅', label: 'Manage Tasks' },
  { id: 'users',    icon: '👥', label: 'Manage Users' },
  { id: 'ngo',      icon: '🏢', label: 'NGO Reports'  },
  { id: 'map',      icon: '🗺️', label: 'Map View'     },
  { id: 'settings', icon: '⚙️', label: 'Settings'     },
]

function Badge({ urgency }) {
  const cls = urgency === 'high' ? 'bg-red-500/15 text-red-400' : urgency === 'medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-forest-500/15 text-forest-400'
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${cls}`}>{urgency}</span>
}

function Dot({ urgency }) {
  const cls = urgency === 'high' ? 'bg-red-400' : urgency === 'medium' ? 'bg-amber-400' : 'bg-forest-400'
  return <span className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />
}

function OverviewSection({ users, tasks, needs, onNav }) {
  const stats = useMemo(() => ({
    totalTasks:       tasks.length,
    highUrgency:      needs.filter(n => n.urgency === 'high').length,
    activeVolunteers: users.filter(u => u.status === 'Active').length,
    totalPeople:      needs.reduce((s, n) => s + (n.people_affected || 0), 0),
  }), [tasks, needs, users])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Admin Dashboard
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100">Platform Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor all activity and manage platform resources.</p>
        </div>
        <p className="text-right text-sm text-slate-500 hidden lg:block">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '✅', label: 'Total Tasks',       value: stats.totalTasks,                color: 'text-forest-400', sub: 'Across all districts',         nav: 'tasks' },
          { icon: '🔴', label: 'High Urgency',      value: stats.highUrgency,               color: 'text-red-400',    sub: 'Needs immediate action' },
          { icon: '👥', label: 'Active Volunteers', value: stats.activeVolunteers,           color: 'text-blue-400',   sub: `of ${users.length} registered`, nav: 'users' },
          { icon: '🏘️', label: 'People Affected',  value: formatNumber(stats.totalPeople), color: 'text-amber-400',  sub: 'Across all need types' },
        ].map(({ icon, label, value, color, sub, nav }) => (
          <div key={label} onClick={() => nav && onNav(nav)} className={`glass-card p-5 ${nav ? 'cursor-pointer hover:border-slate-600 transition-colors' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{icon}</span>
              <span className={`text-3xl font-display font-bold ${color}`}>{value}</span>
            </div>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-slate-100">Active Community Needs</h2>
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{needs.length} total</span>
        </div>
        {needs.slice(0, 5).map(need => (
          <div key={need.id} className="flex items-center justify-between py-3 border-b border-slate-700/40 last:border-0">
            <div className="flex items-center gap-3">
              <Dot urgency={need.urgency} />
              <div>
                <p className="text-sm font-medium text-slate-200">{need.need_type}</p>
                <p className="text-xs text-slate-500">{need.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">{formatNumber(need.people_affected)} people</span>
              <Badge urgency={need.urgency} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-slate-100">Recent Tasks</h2>
          <button onClick={() => onNav('tasks')} className="text-xs text-forest-400 hover:text-forest-300 transition-colors font-semibold">View all →</button>
        </div>
        {tasks.slice(0, 4).map(t => (
          <div key={t.id} className="flex items-center justify-between py-3 border-b border-slate-700/40 last:border-0">
            <div className="flex items-center gap-3">
              <Dot urgency={t.urgency} />
              <div>
                <p className="text-sm font-medium text-slate-200">{t.title}</p>
                <p className="text-xs text-slate-500">{t.location} · {t.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{t.volunteers_assigned}/{t.volunteers_needed} volunteers</span>
              <Badge urgency={t.urgency} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ManageTasksSection({ tasks, setTasks }) {
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({})

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.urgency === filter)

  function openEdit(task) { setEditing(task.id); setForm({ ...task }); setShowAdd(false) }
  function openAdd() { setShowAdd(true); setEditing(null); setForm({ id: `T-00${tasks.length + 1}`, title: '', location: '', urgency: 'medium', date: '', duration: '', volunteers_needed: 5, volunteers_assigned: 0, skills_needed: [], description: '', status: 'open' }) }
  function closeForm() { setEditing(null); setShowAdd(false) }
  function saveEdit() { setTasks(prev => prev.map(t => t.id === editing ? { ...form } : t)); closeForm() }
  function saveAdd() { setTasks(prev => [...prev, { ...form }]); closeForm() }
  function deleteTask(id) { if (window.confirm('Delete this task?')) setTasks(prev => prev.filter(t => t.id !== id)) }

  const TaskForm = ({ onSave, title }) => (
    <div className="glass-card p-6 mb-4 border border-forest-500/20">
      <h3 className="font-display font-bold text-slate-100 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {[['title','Title','text'],['location','Location','text'],['date','Date','date'],['duration','Duration (e.g. 4 hrs)','text'],['volunteers_needed','Volunteers Needed','number']].map(([key, label, type]) => (
          <div key={key}>
            <label className="form-label">{label}</label>
            <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="form-input text-sm" />
          </div>
        ))}
        <div>
          <label className="form-label">Urgency</label>
          <select value={form.urgency || 'medium'} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))} className="form-input text-sm">
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="form-label">Description</label>
          <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="form-input text-sm resize-none" />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={onSave} className="btn-primary text-sm px-5 py-2">Save</button>
        <button onClick={closeForm} className="btn-secondary text-sm px-5 py-2">Cancel</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100">Manage Tasks</h1>
          <p className="text-slate-400 text-sm mt-1">Create, edit, and remove volunteer task assignments.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Task
        </button>
      </div>

      {showAdd && <TaskForm onSave={saveAdd} title="New Task" />}

      <div className="flex gap-2 mb-5">
        {['all','high','medium','low'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${filter === f ? f === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : f === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : f === 'low' ? 'bg-forest-500/20 text-forest-400 border border-forest-500/40' : 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-slate-800/60 text-slate-500 border border-slate-700 hover:text-slate-300'}`}>{f}</button>
        ))}
        <span className="ml-auto text-xs text-slate-500 self-center">{filtered.length} tasks</span>
      </div>

      <div className="space-y-3">
        {filtered.map(task => (
          <div key={task.id}>
            {editing === task.id
              ? <TaskForm onSave={saveEdit} title="Edit Task" />
              : (
                <div className="glass-card p-5 flex items-start justify-between gap-4 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Dot urgency={task.urgency} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-slate-100">{task.title}</p>
                        <span className="text-xs text-slate-500 font-mono">{task.id}</span>
                        <Badge urgency={task.urgency} />
                      </div>
                      <p className="text-xs text-slate-500">{task.location} · {task.date} · {task.duration}</p>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{task.description}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs text-slate-500">Volunteers: <span className="text-slate-300 font-medium">{task.volunteers_assigned}/{task.volunteers_needed}</span></span>
                        <div className="flex gap-1 flex-wrap">
                          {task.skills_needed?.map(s => <span key={s} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">{s}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(task)} className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">Edit</button>
                    <button onClick={() => deleteTask(task.id)} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                  </div>
                </div>
              )
            }
          </div>
        ))}
      </div>
    </div>
  )
}

function ManageUsersSection({ users, setUsers }) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({})

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  function openEdit(u) { setEditing(u.id); setForm({ ...u }); setShowAdd(false) }
  function openAdd() { setShowAdd(true); setEditing(null); setForm({ id: Date.now(), name: '', email: '', role: 'Volunteer', status: 'Active', tasks: 0 }) }
  function closeForm() { setEditing(null); setShowAdd(false) }
  function saveEdit() { setUsers(prev => prev.map(u => u.id === editing ? { ...form } : u)); closeForm() }
  function saveAdd() { setUsers(prev => [...prev, { ...form }]); closeForm() }
  function deleteUser(id) { if (window.confirm('Remove this user?')) setUsers(prev => prev.filter(u => u.id !== id)) }
  function toggleStatus(id) { setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)) }

  const UserForm = ({ onSave, title }) => (
    <div className="glass-card p-6 mb-4 border border-forest-500/20">
      <h3 className="font-display font-bold text-slate-100 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Full Name</label><input type="text" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="form-input text-sm" /></div>
        <div><label className="form-label">Email</label><input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="form-input text-sm" /></div>
        <div>
          <label className="form-label">Role</label>
          <select value={form.role || 'Volunteer'} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="form-input text-sm">
            <option>Volunteer</option><option>NGO Lead</option><option>Coordinator</option>
          </select>
        </div>
        <div>
          <label className="form-label">Status</label>
          <select value={form.status || 'Active'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="form-input text-sm">
            <option>Active</option><option>Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={onSave} className="btn-primary text-sm px-5 py-2">Save</button>
        <button onClick={closeForm} className="btn-secondary text-sm px-5 py-2">Cancel</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100">Manage Users</h1>
          <p className="text-slate-400 text-sm mt-1">View, edit, and manage all volunteers and NGO leads.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      {showAdd && <UserForm onSave={saveAdd} title="New User" />}

      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="form-input pl-10 text-sm" />
      </div>

      <div className="flex gap-3 mb-5">
        <span className="text-xs bg-forest-500/15 text-forest-400 px-3 py-1.5 rounded-full font-semibold">{users.filter(u => u.status === 'Active').length} Active</span>
        <span className="text-xs bg-slate-700/60 text-slate-400 px-3 py-1.5 rounded-full font-semibold">{users.filter(u => u.status === 'Inactive').length} Inactive</span>
        <span className="text-xs bg-blue-500/15 text-blue-400 px-3 py-1.5 rounded-full font-semibold">{users.length} Total</span>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-700/50 bg-slate-800/30">
              {['Name','Email','Role','Tasks','Status','Actions'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                {editing === u.id
                  ? <td colSpan={6} className="p-4"><UserForm onSave={saveEdit} title="Edit User" /></td>
                  : <>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">{u.name[0]}</div>
                          {u.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{u.email}</td>
                      <td className="px-4 py-3 text-slate-400">{u.role}</td>
                      <td className="px-4 py-3 text-slate-400">{u.tasks}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(u.id)} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${u.status === 'Active' ? 'bg-forest-500/15 text-forest-400 hover:bg-forest-500/25' : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-forest-400' : 'bg-slate-500'}`} />{u.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(u)} className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">Edit</button>
                          <button onClick={() => deleteUser(u.id)} className="px-2.5 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Remove</button>
                        </div>
                      </td>
                    </>
                }
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-slate-500 py-8">No users found.</p>}
      </div>
    </div>
  )
}

function NGOReportsSection({ reports, setReports }) {
  function updateStatus(id, status) { setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r)) }
  function deleteReport(id) { if (window.confirm('Delete this report?')) setReports(prev => prev.filter(r => r.id !== id)) }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-100">NGO Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Review and approve field reports from partner NGOs.</p>
      </div>
      <div className="flex gap-3 mb-6">
        <span className="text-xs bg-forest-500/15 text-forest-400 px-3 py-1.5 rounded-full font-semibold">✓ {reports.filter(r => r.status === 'Approved').length} Approved</span>
        <span className="text-xs bg-amber-500/15 text-amber-400 px-3 py-1.5 rounded-full font-semibold">⏳ {reports.filter(r => r.status === 'Pending').length} Pending</span>
      </div>
      <div className="space-y-3">
        {reports.map(r => (
          <div key={r.id} className="glass-card p-5 flex items-center justify-between gap-4 hover:border-slate-600 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono text-slate-500">{r.id}</span>
                <p className="font-semibold text-slate-100">{r.ngo}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.status === 'Approved' ? 'bg-forest-500/15 text-forest-400' : 'bg-amber-500/15 text-amber-400'}`}>{r.status}</span>
              </div>
              <p className="text-sm text-slate-400">{r.need} · {r.district} · <span className="text-slate-300 font-medium">{formatNumber(r.people)} people</span></p>
              <p className="text-xs text-slate-600 mt-0.5">Submitted: {r.submitted}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {r.status === 'Pending'
                ? <button onClick={() => updateStatus(r.id, 'Approved')} className="px-3 py-1.5 text-xs rounded-lg bg-forest-500/15 text-forest-400 hover:bg-forest-500/25 transition-colors font-semibold">Approve</button>
                : <button onClick={() => updateStatus(r.id, 'Pending')} className="px-3 py-1.5 text-xs rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors font-semibold">Revoke</button>
              }
              <button onClick={() => deleteReport(r.id)} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MapViewSection({ needs }) {
  const positions = [
    { top: '22%', left: '54%' }, { top: '16%', left: '36%' },
    { top: '11%', left: '66%' }, { top: '38%', left: '43%' },
    { top: '60%', left: '47%' }, { top: '63%', left: '37%' },
  ]
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-100">Map View</h1>
        <p className="text-slate-400 text-sm mt-1">Geographic overview of active needs across West Bengal districts.</p>
      </div>
      <div className="glass-card p-6 mb-6">
        <div className="relative bg-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden" style={{ height: 360 }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-700 text-sm">West Bengal — hover pins to see details</p>
          </div>
          {needs.map((need, i) => (
            <div key={need.id} style={{ position: 'absolute', ...(positions[i] || { top: `${20+i*8}%`, left: `${40+i*5}%` }) }}>
              <div className="relative group cursor-pointer">
                <div className={`w-4 h-4 rounded-full border-2 border-slate-950 shadow-lg ${need.urgency === 'high' ? 'bg-red-500' : need.urgency === 'medium' ? 'bg-amber-500' : 'bg-forest-500'}`} />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-xs whitespace-nowrap z-10 shadow-xl">
                  <p className="font-semibold text-slate-100">{need.need_type}</p>
                  <p className="text-slate-400">{need.location}</p>
                  <p className="text-slate-300 mt-0.5">{formatNumber(need.people_affected)} people affected</p>
                  <Badge urgency={need.urgency} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          {[['bg-red-500','High'],['bg-amber-500','Medium'],['bg-forest-500','Low']].map(([cls, lbl]) => (
            <span key={lbl} className="flex items-center gap-1.5 text-slate-400"><span className={`w-3 h-3 rounded-full ${cls}`} />{lbl} Urgency</span>
          ))}
        </div>
      </div>
      <div className="glass-card p-6">
        <h2 className="font-display font-bold text-slate-100 mb-4">District Summary</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {needs.map(need => (
            <div key={need.id} className="flex items-center gap-3 bg-slate-800/40 rounded-xl px-4 py-3">
              <Dot urgency={need.urgency} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{need.need_type}</p>
                <p className="text-xs text-slate-500">{need.location}</p>
              </div>
              <span className="text-sm font-semibold text-slate-300">{formatNumber(need.people_affected)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ user }) {
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({ name: user?.name || 'Administrator', email: user?.email || '', notifications: true, emailAlerts: true, darkMode: true })

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your admin profile and platform preferences.</p>
      </div>
      {saved && (
        <div className="flex items-center gap-2 bg-forest-500/15 border border-forest-500/30 text-forest-400 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Settings saved successfully!
        </div>
      )}
      <div className="grid gap-6">
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-slate-100 mb-5">Admin Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-bold font-display">A</div>
            <div>
              <p className="font-semibold text-slate-100">{profile.name}</p>
              <p className="text-sm text-slate-500">{profile.email}</p>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full mt-1 inline-block">Administrator</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Display Name</label><input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="form-input text-sm" /></div>
            <div><label className="form-label">Email</label><input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="form-input text-sm" /></div>
            <div className="col-span-2"><label className="form-label">New Password</label><input type="password" placeholder="Leave blank to keep current" className="form-input text-sm" /></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-slate-100 mb-5">Notifications & Preferences</h2>
          <div className="space-y-1">
            {[['notifications','Push Notifications','Receive in-app alerts for new reports and task updates'],['emailAlerts','Email Alerts','Get email summaries for high-urgency needs'],['darkMode','Dark Mode','Use dark theme across the admin panel']].map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-700/40 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <button onClick={() => setProfile(p => ({ ...p, [key]: !p[key] }))} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${profile[key] ? 'bg-forest-500' : 'bg-slate-700'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${profile[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-slate-100 mb-4">Platform Info</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[['Version','1.0.0'],['Environment','Development'],['API Status','Connected'],['Last Sync','Just now']].map(([k, v]) => (
              <div key={k} className="bg-slate-800/40 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">{k}</p>
                <p className="font-medium text-slate-200">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} className="btn-primary px-8 py-3 w-fit">Save Changes</button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(location.state?.section || 'overview')
  const [tasks, setTasks] = useState(MOCK_ASSIGNMENTS)
  const [users, setUsers] = useState(INITIAL_USERS)
  const [reports, setReports] = useState(INITIAL_NGO_REPORTS)

  function handleLogout() { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-64 shrink-0 bg-slate-900/70 border-r border-slate-800 flex flex-col sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-slate-100 leading-tight">Smart<span className="text-forest-400">RA</span></p>
              <p className="text-xs text-amber-400/80">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setActiveSection(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeSection === id ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {activeSection === 'overview'  && <OverviewSection    users={users} tasks={tasks} needs={MOCK_NEEDS} onNav={setActiveSection} />}
          {activeSection === 'tasks'     && <ManageTasksSection tasks={tasks} setTasks={setTasks} />}
          {activeSection === 'users'     && <ManageUsersSection users={users} setUsers={setUsers} />}
          {activeSection === 'ngo'       && <NGOReportsSection  reports={reports} setReports={setReports} />}
          {activeSection === 'map'       && <MapViewSection     needs={MOCK_NEEDS} />}
          {activeSection === 'settings'  && <SettingsSection    user={user} />}
        </div>
      </main>
    </div>
  )
}
