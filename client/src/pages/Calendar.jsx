import { useState, useEffect } from 'react'
import { calendarService } from '../services/calendarService'
import { Link } from 'react-router-dom'

function Calendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await calendarService.getEvents()
      setEvents(data)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Calendar & Events</h1>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {events.length === 0 ? (
        <div className="card">
          <p>No events scheduled. Add your first event to get started.</p>
        </div>
      ) : (
        <div>
          {events.map(event => (
            <div key={event.id} className="card">
              <h3>{event.title}</h3>
              <p><strong>Type:</strong> {event.event_type}</p>
              <p><strong>Date:</strong> {new Date(event.event_date).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location || 'N/A'}</p>
              {event.case && <p><strong>Case:</strong> {event.case.title}</p>}
              <p><strong>Status:</strong> {event.is_completed ? 'Completed' : 'Pending'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Calendar
