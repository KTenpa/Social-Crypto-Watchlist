import { useEffect, useState } from 'react'
import api from '../utils/apiClient.js'

export default function Search() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const search = async (e) => {
    e?.preventDefault()
    if (!q.trim()) return
    setLoading(true)
    setMsg(null)
    try {
      const { data } = await api.get(`/coins/search/${encodeURIComponent(q)}`)
      setResults(data?.data?.coins || [])
    } catch {
      setResults([])
      setMsg('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const ensureCoinAndAddToWatchlist = async (coin) => {
    setMsg(null)
    try {
      // 1) ensure coin exists in DB
      await api.post('/coins', {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image_url: coin.large
      }).catch(() => {}) // ignore 400 "already exists"

      // 2) add to watchlist
      const resp = await api.post('/watchlist', { coin })
      setMsg(resp.data?.message || 'Added to watchlist')
    } catch (err) {
      setMsg(err?.response?.data?.error || 'Failed to add')
    }
  }

  useEffect(() => {
    // optional: initial suggestions, e.g., "bitcoin"
  }, [])

  return (
    <div>
      <h2>Search Coins</h2>
      <form className="row" onSubmit={search}>
        <input
          placeholder="Search by name or symbol (e.g., bitcoin, eth)"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
        <button className="btn" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>
      {msg && <div className="notice">{msg}</div>}
      <ul className="grid">
        {results.map((c) => (
          <li key={c.id} className="card">
            <div className="row-left">
              <img src={c.large} alt={c.name} width="32" height="32" />
              <div>
                <div className="title">{c.name} ({c.symbol.toUpperCase()})</div>
                <div className="muted">{c.id}</div>
              </div>
            </div>
            <button className="btn" onClick={() => ensureCoinAndAddToWatchlist(c)}>Add to Watchlist</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
