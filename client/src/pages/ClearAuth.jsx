import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ClearAuth() {
  const navigate = useNavigate()

  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.clear()

    console.log('All tokens cleared!')

    // Redirect to login after 1 second
    setTimeout(() => {
      navigate('/login')
    }, 1000)
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      gap: '20px'
    }}>
      <h2>Clearing Authentication Data...</h2>
      <p>Redirecting to login...</p>
    </div>
  )
}

export default ClearAuth
