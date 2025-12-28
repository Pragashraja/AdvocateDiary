import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Cases from './pages/Cases'
import Hearings from './pages/Hearings'
import Clients from './pages/Clients'
import Calendar from './pages/Calendar'
import Profile from './pages/Profile'
import ClearAuth from './pages/ClearAuth'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/clear-auth" element={<ClearAuth />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/cases" element={<PrivateRoute><Cases /></PrivateRoute>} />
      <Route path="/hearings" element={<PrivateRoute><Hearings /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
      <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  )
}

export default AppRouter
