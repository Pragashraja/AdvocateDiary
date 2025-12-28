import { useState, useEffect } from 'react'
import { hearingUpdateService } from '../services/hearingUpdateService'
import { Link } from 'react-router-dom'
import HearingUpdateForm from '../components/cases/HearingUpdateForm'

function Hearings() {
  const [hearings, setHearings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHearing, setEditingHearing] = useState(null)

  useEffect(() => {
    loadHearings()
  }, [])

  const loadHearings = async () => {
    try {
      const data = await hearingUpdateService.getAllHearingUpdates()
      setHearings(data)
    } catch (error) {
      console.error('Failed to load hearings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (hearing) => {
    setEditingHearing(hearing)
    setShowForm(true)
  }

  const handleDelete = async (hearingId, hearingDate) => {
    if (window.confirm(`Are you sure you want to delete the hearing from ${hearingDate}?`)) {
      try {
        await hearingUpdateService.deleteHearingUpdate(hearingId)
        alert('Hearing deleted successfully!')
        loadHearings()
      } catch (error) {
        console.error('Failed to delete hearing:', error)
        alert(error.response?.data?.error || 'Failed to delete hearing')
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingHearing(null)
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h1>All Hearings</h1>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {hearings.length === 0 ? (
        <div className="card">
          <p>No hearings found. Add hearings from the Cases page.</p>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', whiteSpace: 'nowrap' }}>Hearing Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', whiteSpace: 'nowrap' }}>Next Hearing Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', whiteSpace: 'nowrap' }}>Case Number</th>
                  <th style={{ padding: '12px', textAlign: 'left', whiteSpace: 'nowrap' }}>Case Title</th>
                  <th style={{ padding: '12px', textAlign: 'left', whiteSpace: 'nowrap' }}>Client Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', whiteSpace: 'nowrap' }}>Court Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', minWidth: '150px' }}>Action to be Taken</th>
                  <th style={{ padding: '12px', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hearings.map((hearing) => (
                  <tr key={hearing.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      {new Date(hearing.hearing_date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      {hearing.next_hearing_date
                        ? new Date(hearing.next_hearing_date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td style={{ padding: '12px' }}>{hearing.case_number}</td>
                    <td style={{ padding: '12px' }}>{hearing.case_title}</td>
                    <td style={{ padding: '12px' }}>{hearing.client_name || '-'}</td>
                    <td style={{ padding: '12px' }}>{hearing.court_name || '-'}</td>
                    <td style={{ padding: '12px', maxWidth: '250px' }}>
                      {hearing.action_to_be_taken || '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(hearing)}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '4px 10px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(
                            hearing.id,
                            new Date(hearing.hearing_date).toLocaleDateString()
                          )}
                          className="btn btn-danger"
                          style={{
                            fontSize: '12px',
                            padding: '4px 10px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hearing Update Form Modal */}
      {showForm && (
        <HearingUpdateForm
          caseId={editingHearing?.case_id}
          hearingData={editingHearing}
          onClose={handleFormClose}
          onSuccess={() => {
            loadHearings()
            handleFormClose()
          }}
        />
      )}
    </div>
  )
}

export default Hearings
