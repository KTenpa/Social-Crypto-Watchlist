import { useEffect, useState } from 'react'
import api from '../utils/apiClient.js'
import { useAuth } from '../state/AuthContext.jsx'

/**
 * @file Dashboard.jsx
 * @description Displays the logged-in user's watchlist. Allows removing coins from watchlist.
 */
export default function Dashboard() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.get('/watchlist')
      setWatchlist(data.data ?? [])
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (coin_id) => {
    const original = watchlist
    setWatchlist(watchlist.filter(c => c.id !== coin_id))
    try {
      await api.delete(`/watchlist/${coin_id}`)
    } catch {
      setWatchlist(original)
      alert('Failed to remove coin')
    }
  }

  if (loading) return <div className="center">Loading…</div>

  return (
    <div>
      <h2>{user?.name}'s Watchlist</h2>
      {error && <div className="error">{error}</div>}
      {watchlist.length === 0 ? (
        <div className="muted">Your watchlist is empty. Head to Search to add coins.</div>
      ) : (
        <ul className="list">
          {watchlist.map((c) => (
            <li key={c.id} className="row">
              <div className="row-left">
                {c.image_url && <img src={c.image_url} alt={c.name} width="24" height="24" />}
                <div>
                  <div className="title">{c.name} ({c.symbol?.toUpperCase()})</div>
                  <div className="muted">{c.id}</div>
                </div>
              </div>
              <button className="btn danger" onClick={() => remove(c.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
