import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>Welcome, {user?.full_name}</h1>
        <button onClick={logout} className="btn btn-secondary">Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <Link to="/cases" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '40px' }}>
            <h2>Cases</h2>
            <p>Manage your cases</p>
          </div>
        </Link>
        <Link to="/hearings" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '40px' }}>
            <h2>Hearings</h2>
            <p>View all hearings</p>
          </div>
        </Link>
        <Link to="/clients" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '40px' }}>
            <h2>Clients</h2>
            <p>Manage your clients</p>
          </div>
        </Link>
        <Link to="/calendar" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '40px' }}>
            <h2>Calendar</h2>
            <p>View hearings & events</p>
          </div>
        </Link>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '40px' }}>
            <h2>Profile</h2>
            <p>Update your profile</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
