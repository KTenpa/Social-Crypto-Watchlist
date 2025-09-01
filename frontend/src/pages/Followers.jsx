import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/apiClient.js'
import { useAuth } from '../state/AuthContext.jsx'

export default function Followers() {
  const { user } = useAuth()
  const { userId } = useParams()
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  const load = async () => {
    setErr(null)
    setLoading(true)
    try {
      const [f1, f2] = await Promise.all([
        api.get(`/follow/followers/${userId}`),
        api.get(`/follow/following/${userId}`)
      ])
      setFollowers(f1.data.data ?? [])
      setFollowing(f2.data.data ?? [])
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to load followers')
    } finally {
      setLoading(false)
    }
  }

  const toggleFollow = async (targetId, isFollowing) => {
    try {
      if (isFollowing) {
        await api.delete(`/follow/${targetId}`)
      } else {
        await api.post(`/follow/${targetId}`)
      }
      await load()
    } catch {
      alert('Failed to update follow state')
    }
  }

  useEffect(() => { load() }, [userId])

  if (loading) return <div className="center">Loading…</div>

  return (
    <div className="grid-2">
      <div>
        <h3>Followers</h3>
        <ul className="list">
          {followers.map((u) => (
            <li key={u.id} className="row">
              <div className="title">{u.name || u.username || `User ${u.id}`}</div>
              {user?.id !== u.id && (
                <button className="btn"
                  onClick={() => toggleFollow(u.id, true)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
          {followers.length === 0 && <div className="muted">No followers yet.</div>}
        </ul>
      </div>

      <div>
        <h3>Following</h3>
        <ul className="list">
          {following.map((u) => {
            const display = u.name || u.username || `User ${u.id}`
            return (
              <li key={u.id} className="row">
                <div className="title">{display}</div>
                {user?.id !== u.id && (
                  <button className="btn danger"
                    onClick={() => toggleFollow(u.id, true)}
                  >
                    Unfollow
                  </button>
                )}
              </li>
            )
          })}
          {following.length === 0 && <div className="muted">Not following anyone yet.</div>}
        </ul>
      </div>

      {err && <div className="error" style={{ gridColumn: '1 / -1' }}>{err}</div>}
    </div>
  )
}
