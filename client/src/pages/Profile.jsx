import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Profile</h1>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="card">
        <h2>Personal Information</h2>
        <div style={{ marginTop: '20px' }}>
          <p><strong>Name:</strong> {user?.full_name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Bar Council ID:</strong> {user?.bar_council_id || 'N/A'}</p>
          <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
          <p><strong>Address:</strong> {user?.address || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
