import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/dashboard" className="brand">Social Crypto Watchlist</Link>
        {user && (
          <>
            <Link to="/dashboard">My Watchlist</Link>
            <Link to="/search">Search</Link>
            <Link to={`/followers/${user.id}`}>Followers</Link>
            <Link to={`/profile/${user.id}`}>Profile</Link>
          </>
        )}
      </div>
      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn">Sign up</Link>
          </>
        ) : (
          <button className="btn" onClick={handleLogout}>Log out</button>
        )}
      </div>
    </nav>
  )
}
