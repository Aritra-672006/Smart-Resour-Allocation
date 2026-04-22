import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// Hardcoded admin credentials (in a real app, this would be server-side)
const ADMIN_EMAIL = 'admin@smartra.org'
const ADMIN_PASSWORD = 'Admin@123'

// Simulated user store (in-memory for demo)
const userStore = [
  { id: 1, name: 'Demo User', email: 'user@example.com', password: 'password123', role: 'user' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('sra_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loginAsUser = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    await new Promise(r => setTimeout(r, 1200)) // simulate network

    const found = userStore.find(u => u.email === email && u.password === password)
    if (!found) {
      setLoading(false)
      setError('Invalid email or password.')
      return false
    }
    const userData = { id: found.id, name: found.name, email: found.email, role: 'user' }
    sessionStorage.setItem('sra_user', JSON.stringify(userData))
    setUser(userData)
    setLoading(false)
    return true
  }, [])

  const signupAsUser = useCallback(async ({ name, email, phone, password }) => {
    setLoading(true)
    setError(null)
    await new Promise(r => setTimeout(r, 1200))

    if (userStore.find(u => u.email === email)) {
      setLoading(false)
      setError('An account with this email already exists.')
      return false
    }
    const newUser = { id: Date.now(), name, email, phone, password, role: 'user' }
    userStore.push(newUser)
    const userData = { id: newUser.id, name, email, phone, role: 'user' }
    sessionStorage.setItem('sra_user', JSON.stringify(userData))
    setUser(userData)
    setLoading(false)
    return true
  }, [])

  const loginAsAdmin = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    await new Promise(r => setTimeout(r, 1200))

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setLoading(false)
      setError('Invalid admin credentials.')
      return false
    }
    const userData = { id: 0, name: 'Administrator', email, role: 'admin' }
    sessionStorage.setItem('sra_user', JSON.stringify(userData))
    setUser(userData)
    setLoading(false)
    return true
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('sra_user')
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, loading, error, loginAsUser, signupAsUser, loginAsAdmin, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
