import { useState, useEffect } from 'react'
import { clientService } from '../services/clientService'
import { Link } from 'react-router-dom'

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const data = await clientService.getClients()
      setClients(data)
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Clients</h1>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {clients.length === 0 ? (
        <div className="card">
          <p>No clients found. Add your first client to get started.</p>
        </div>
      ) : (
        <div>
          {clients.map(client => (
            <div key={client.id} className="card">
              <h3>{client.name}</h3>
              <p><strong>Email:</strong> {client.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {client.phone || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Clients
