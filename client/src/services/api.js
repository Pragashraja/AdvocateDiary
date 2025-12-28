import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Validate token format before sending
      if (typeof token !== 'string' || token.trim() === '') {
        console.error('Invalid token format:', token)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        return Promise.reject(new Error('Invalid token format'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 422 errors (invalid/malformed token)
    if (error.response?.status === 422) {
      console.error('🔴 422 Error - Invalid Token')
      console.error('Server said:', JSON.stringify(error.response.data, null, 2))
      console.error('Request:', originalRequest.method, originalRequest.url)

      // Try to refresh the token if it's invalid
      if (!originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem('refresh_token')
          if (refreshToken) {
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
              {},
              {
                headers: { Authorization: `Bearer ${refreshToken}` }
              }
            )

            const { access_token } = response.data
            localStorage.setItem('access_token', access_token)

            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          console.error('Token refresh failed after 422:', refreshError)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          return Promise.reject(refreshError)
        }
      }
    }

    // Handle 401 errors (expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` }
          }
        )

        const { access_token } = response.data
        localStorage.setItem('access_token', access_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed after 401:', refreshError)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        return Promise.reject(refreshError)
      }
    }

    console.error('API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api
