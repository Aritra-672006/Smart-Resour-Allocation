import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import LandingPage    from './pages/LandingPage'
import UserLoginPage  from './pages/UserLoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import UserHomePage   from './pages/UserHomePage'
import AdminHomePage  from './pages/AdminHomePage'
import AdminDashboard from './pages/AdminDashboard'
import NGOUploadPage  from './pages/NGOUploadPage'
import VolunteerPage  from './pages/VolunteerPage'
import DashboardPage  from './pages/DashboardPage'
import TaskPage       from './pages/TaskPage'
import MapPage        from './pages/MapPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950">
          <Navbar />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/"            element={<LandingPage />} />
              <Route path="/login"       element={<UserLoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />

              {/* User home — option picker */}
              <Route path="/home" element={<ProtectedRoute role="user"><UserHomePage /></ProtectedRoute>} />

              {/* User feature routes */}
              <Route path="/tasks"     element={<ProtectedRoute role="user"><TaskPage /></ProtectedRoute>} />
              <Route path="/map"       element={<ProtectedRoute role="user"><MapPage /></ProtectedRoute>} />
              <Route path="/upload"    element={<ProtectedRoute role="user"><NGOUploadPage /></ProtectedRoute>} />
              <Route path="/volunteer" element={<ProtectedRoute role="user"><VolunteerPage /></ProtectedRoute>} />

              {/* Admin home — option picker */}
              <Route path="/admin-home" element={<ProtectedRoute role="admin"><AdminHomePage /></ProtectedRoute>} />

              {/* Admin dashboard (full panel) */}
              <Route path="/admin"     element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute role="admin"><DashboardPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
