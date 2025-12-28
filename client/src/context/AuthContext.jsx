import { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      authService.getCurrentUser()
        .then(data => {
          console.log('✅ User authenticated successfully')
          setUser(data)
        })
        .catch(err => {
          console.error('❌ Authentication failed - clearing all tokens')
          console.error('Error details:', err.response?.status, err.response?.data)

          // Force clear ALL localStorage data
          localStorage.clear()
          setUser(null)

          // Force reload to login page
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            console.log('🔄 Redirecting to login...')
            window.location.href = '/login'
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    setUser(data.user)
    return data
  }

  const register = async (userData) => {
    return await authService.register(userData)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
