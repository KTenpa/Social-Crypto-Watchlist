import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import api from '../utils/apiClient.js';

/**
 * @file Followers.jsx
 * @description Displays followers and following lists. Provides search functionality and allows
 *              following/unfollowing users as well as removing followers.
 */
export default function Followers() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const [f1, f2] = await Promise.all([
        api.get(`/follow/followers/${user.id}`),
        api.get(`/follow/following/${user.id}`)
      ]);
      setFollowers(f1.data.data ?? []);
      setFollowing(f2.data.data ?? []);
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    try {
      const { data } = await api.get(`/follow/search/${encodeURIComponent(query)}`);
      setSearchResults(data.data ?? []);
    } catch {
      setSearchResults([]);
      setErr('Search failed');
    }
  };

  const toggleFollow = async (targetId, isFollowing) => {
    try {
      if (isFollowing) await api.delete(`/follow/${targetId}`);
      else await api.post(`/follow/${targetId}`);
      await load();
      if (searchResults.length) searchUsers(); // refresh search results
    } catch {
      alert('Failed to update follow state');
    }
  };

  const removeFollower = async (followerId) => {
    try {
      await api.delete(`/follow/follower/${followerId}`);
      await load();
    } catch {
      alert('Failed to remove follower');
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="center">Loading…</div>;

  return (
    <div>
      <h2>Followers / Following</h2>

      {/* Search users */}
      <form className="row" onSubmit={searchUsers}>
        <input
          placeholder="Search users by name or email"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="btn">Search</button>
      </form>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results</h3>
          <ul className="list">
            {searchResults.map(u => {
              const isFollowing = following.some(f => f.id === u.id);
              return (
                <li key={u.id} className="row">
                  <div className="title">{u.name || `User ${u.id}`}</div>
                  {user.id !== u.id && (
                    <button className="btn" onClick={() => toggleFollow(u.id, isFollowing)}>
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Followers and Following lists */}
      <div className="grid-2">
        <div>
          <h3>Followers</h3>
          <ul className="list">
            {followers.map(u => (
              <li key={u.id} className="row">
                <div className="title">{u.name || `User ${u.id}`}</div>
                {user.id !== u.id && (
                  <button className="btn" onClick={() => removeFollower(u.id)}>
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
            {following.map(u => (
              <li key={u.id} className="row">
                <div className="title">{u.name || `User ${u.id}`}</div>
                {user.id !== u.id && (
                  <button className="btn danger" onClick={() => toggleFollow(u.id, true)}>
                    Unfollow
                  </button>
                )}
              </li>
            ))}
            {following.length === 0 && <div className="muted">Not following anyone yet.</div>}
          </ul>
        </div>
      </div>

      {err && <div className="error">{err}</div>}
    </div>
  );
}
