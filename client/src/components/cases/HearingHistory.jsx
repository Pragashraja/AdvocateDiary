import { useState, useEffect } from 'react'
import { hearingUpdateService } from '../../services/hearingUpdateService'
import HearingUpdateForm from './HearingUpdateForm'

function HearingHistory({ caseId }) {
  const [hearingUpdates, setHearingUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHearing, setEditingHearing] = useState(null)

  useEffect(() => {
    loadHearingUpdates()
  }, [caseId])

  const loadHearingUpdates = async () => {
    try {
      const data = await hearingUpdateService.getHearingUpdates(caseId)
      setHearingUpdates(data)
    } catch (error) {
      console.error('Failed to load hearing updates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (hearing) => {
    setEditingHearing(hearing)
    setShowForm(true)
  }

  const handleDelete = async (hearingId, hearingDate) => {
    if (window.confirm(`Are you sure you want to delete the hearing update from ${hearingDate}?`)) {
      try {
        await hearingUpdateService.deleteHearingUpdate(hearingId)
        alert('Hearing update deleted successfully!')
        loadHearingUpdates()
      } catch (error) {
        console.error('Failed to delete hearing update:', error)
        alert(error.response?.data?.error || 'Failed to delete hearing update')
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingHearing(null)
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading hearing history...</div>

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ color: '#007bff', margin: 0 }}>Hearing History</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          style={{ fontSize: '14px', padding: '5px 15px' }}
        >
          + Add Hearing Update
        </button>
      </div>

      {hearingUpdates.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>No hearing updates recorded yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            + Add First Hearing Update
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '30px' }}>
          {/* Vertical timeline line */}
          <div style={{
            position: 'absolute',
            left: '10px',
            top: '20px',
            bottom: '20px',
            width: '3px',
            backgroundColor: '#007bff'
          }} />

          {/* Timeline items */}
          {hearingUpdates.map((hearing, index) => (
            <div key={hearing.id} style={{
              position: 'relative',
              marginBottom: '30px',
              paddingLeft: '20px'
            }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '8px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                border: '3px solid white',
                boxShadow: '0 0 0 2px #007bff'
              }} />

              {/* Update card */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {/* Header with date and actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '15px'
                }}>
                  <div>
                    <h4 style={{
                      color: '#007bff',
                      margin: 0,
                      marginBottom: '5px',
                      fontSize: '18px'
                    }}>
                      Hearing Date: {new Date(hearing.hearing_date).toLocaleDateString()}
                    </h4>
                    {hearing.next_hearing_date && (
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        marginTop: '5px'
                      }}>
                        {hearing.calendar_event_id && '📅 '}
                        Next: {new Date(hearing.next_hearing_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(hearing)}
                      className="btn btn-primary"
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hearing.id, new Date(hearing.hearing_date).toLocaleDateString())}
                      className="btn btn-danger"
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div style={{ fontSize: '14px' }}>
                  {hearing.action_taken && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#555' }}>Action Taken:</strong>
                      <p style={{ margin: '5px 0 0 0', color: '#333' }}>{hearing.action_taken}</p>
                    </div>
                  )}

                  {hearing.court_order && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#555' }}>Court Order:</strong>
                      <p style={{ margin: '5px 0 0 0', color: '#333' }}>{hearing.court_order}</p>
                    </div>
                  )}

                  {hearing.action_to_be_taken && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#555' }}>Action to be Taken:</strong>
                      <p style={{ margin: '5px 0 0 0', color: '#333' }}>{hearing.action_to_be_taken}</p>
                    </div>
                  )}

                  <div style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
                    Recorded on {new Date(hearing.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hearing Update Form Modal */}
      {showForm && (
        <HearingUpdateForm
          caseId={caseId}
          hearingData={editingHearing}
          onClose={handleFormClose}
          onSuccess={() => {
            loadHearingUpdates()
            handleFormClose()
          }}
        />
      )}
    </div>
  )
}

export default HearingHistory
