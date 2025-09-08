import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/apiClient.js'
import { useAuth } from '../state/AuthContext.jsx'

/**
 * @file Profile.jsx
 * @description Displays a user's profile and their watchlist. Differentiates between self and other users.
 */
export default function Profile() {
  const { user } = useAuth()
  const { userId } = useParams()
  const [watchlist, setWatchlist] = useState([])
  const [isSelf, setIsSelf] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    setIsSelf(String(user?.id) === String(userId))
    const load = async () => {
      setErr(null)
      try {
        if (isSelf) {
          const { data } = await api.get('/watchlist')
          setWatchlist(data.data ?? [])
        } else {
          // public profile watchlist (if you add a public endpoint later)
          setWatchlist([])
        }
      } catch (e) {
        setErr(e?.response?.data?.error || 'Failed to load profile')
      }
    }
    load()
  }, [user, userId, isSelf])

  return (
    <div>
      <h2>{isSelf ? 'My Profile' : `User ${userId}`}</h2>
      {err && <div className="error">{err}</div>}
      <h3>Watchlist</h3>
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
          </li>
        ))}
        {watchlist.length === 0 && <div className="muted">No items yet.</div>}
      </ul>
    </div>
  )
}
