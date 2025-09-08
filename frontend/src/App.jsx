/**
 * App.jsx
 * ----------------
 * Main React application component that handles routing and layout.
 *
 * Features:
 *  - Sets up client-side routing using react-router-dom
 *  - Includes a Navbar component displayed on all pages
 *  - Protects routes using PrivateRoute which redirects unauthenticated users to /login
 *  - Supports the following routes:
 *      "/"            -> Redirects to "/dashboard"
 *      "/login"       -> Login page
 *      "/register"    -> Registration page
 *      "/dashboard"   -> User dashboard (protected)
 *      "/search"      -> Search coins page (protected)
 *      "/followers/:userId" -> Followers/following page (protected)
 *      "/profile/:userId"   -> User profile page (protected)
 *      "*"            -> Fallback "Not found" page
 *
 * Usage:
 *  Render <App /> inside the root element wrapped in BrowserRouter in index.jsx:
 *
 *    import { BrowserRouter } from 'react-router-dom';
 *    import App from './App.jsx';
 *
 *    ReactDOM.createRoot(document.getElementById('root')).render(
 *      <BrowserRouter>
 *        <App />
 *      </BrowserRouter>
 *    );
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Search from './pages/Search.jsx'
import Followers from './pages/Followers.jsx'
import Profile from './pages/Profile.jsx'
import { useAuth } from './state/AuthContext.jsx'

/**
 * PrivateRoute
 * -------------
 * Wrapper component to protect routes.
 * Redirects to /login if user is not authenticated.
 */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="center">Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/followers/:userId"
            element={
              <PrivateRoute>
                <Followers />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </div>
  )
}
