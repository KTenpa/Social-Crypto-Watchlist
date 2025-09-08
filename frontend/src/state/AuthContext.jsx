/**
 * AuthContext.jsx
 * ----------------
 * Provides authentication context and hooks for the frontend React application.
 *
 * Exports:
 *  - AuthProvider: React context provider that manages authentication state (user, token, loading)
 *  - useAuth: Custom hook to access authentication state and actions
 *
 * Features:
 *  - Persist auth token in localStorage
 *  - Bootstrap user state on page load
 *  - Login, register, and logout functions
 *
 * Usage:
 *  Wrap your application with <AuthProvider> at the root level:
 * 
 *    <AuthProvider>
 *      <App />
 *    </AuthProvider>
 *
 *  Access auth state in any component:
 *
 *    const { user, login, logout, register, loading } = useAuth();
 */
import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/apiClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function bootstrap() {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await api.get('/auth/me')
        setUser(data.data)
      } catch {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
