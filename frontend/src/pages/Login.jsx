import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Welcome back</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="muted">No account? <Link to="/register">Sign up</Link></p>
    </div>
  )
}
