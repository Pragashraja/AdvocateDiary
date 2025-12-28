import { useState, useEffect } from 'react'
import { caseService } from '../services/caseService'
import { Link } from 'react-router-dom'
import CaseForm from '../components/cases/CaseForm'
import HearingHistory from '../components/cases/HearingHistory'

function Cases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedCase, setExpandedCase] = useState(null)
  const [editingCase, setEditingCase] = useState(null)
  const [activeTab, setActiveTab] = useState({})

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    try {
      const data = await caseService.getCases()
      setCases(data)
    } catch (error) {
      console.error('Failed to load cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDetails = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId)
  }

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem)
    setShowForm(true)
  }

  const handleDelete = async (caseId, caseNumber) => {
    if (window.confirm(`Are you sure you want to delete case ${caseNumber}?`)) {
      try {
        await caseService.deleteCase(caseId)
        alert('Case deleted successfully!')
        loadCases()
      } catch (error) {
        console.error('Failed to delete case:', error)
        alert(error.response?.data?.error || 'Failed to delete case')
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCase(null)
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h1>Cases</h1>
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            style={{ marginRight: '10px' }}
          >
            + Add New Case
          </button>
          <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="card">
          <p>No cases found. Create your first case to get started.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + Add Your First Case
          </button>
        </div>
      ) : (
        <div>
          {cases.map(caseItem => (
            <div key={caseItem.id} className="card" style={{ marginBottom: '15px' }}>
              {/* Case Header - Always Visible */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '10px', color: '#007bff' }}>{caseItem.title}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <p><strong>Case Number:</strong> {caseItem.case_number}</p>
                    <p><strong>Type:</strong> {caseItem.case_type || 'N/A'}</p>
                    <p><strong>Court:</strong> {caseItem.court_name || 'N/A'}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: caseItem.status === 'Active' ? '#28a745' :
                                       caseItem.status === 'Won' ? '#007bff' :
                                       caseItem.status === 'Lost' ? '#dc3545' : '#6c757d',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {caseItem.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div style={{ marginLeft: '15px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <button
                    onClick={() => handleEdit(caseItem)}
                    className="btn btn-primary"
                    style={{ fontSize: '14px', padding: '5px 15px' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(caseItem.id, caseItem.case_number)}
                    className="btn btn-danger"
                    style={{ fontSize: '14px', padding: '5px 15px', backgroundColor: '#dc3545', color: 'white' }}
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => toggleDetails(caseItem.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '14px', padding: '5px 15px' }}
                  >
                    {expandedCase === caseItem.id ? '▲ Hide' : '▼ View'}
                  </button>
                </div>
              </div>

              {/* Expanded Details - Shown on click */}
              {expandedCase === caseItem.id && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #ddd'
                }}>
                  {/* Tab Navigation */}
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    borderBottom: '2px solid #ddd',
                    marginBottom: '20px'
                  }}>
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [caseItem.id]: 'details' })}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: (activeTab[caseItem.id] || 'details') === 'details' ? 'bold' : 'normal',
                        color: (activeTab[caseItem.id] || 'details') === 'details' ? '#007bff' : '#666',
                        borderBottom: (activeTab[caseItem.id] || 'details') === 'details' ? '3px solid #007bff' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer'
                      }}
                    >
                      Case Details
                    </button>
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [caseItem.id]: 'hearing' })}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: activeTab[caseItem.id] === 'hearing' ? 'bold' : 'normal',
                        color: activeTab[caseItem.id] === 'hearing' ? '#007bff' : '#666',
                        borderBottom: activeTab[caseItem.id] === 'hearing' ? '3px solid #007bff' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer'
                      }}
                    >
                      Hearing History
                    </button>
                  </div>

                  {/* Tab Content */}
                  {(activeTab[caseItem.id] || 'details') === 'details' ? (
                    <div>
                      {/* Client Details */}
                      {caseItem.client_name && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ color: '#007bff', marginBottom: '10px' }}>Client Details</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <p><strong>Name:</strong> {caseItem.client_name}</p>
                            <p><strong>Phone:</strong> {caseItem.client_phone || 'N/A'}</p>
                            <p style={{ gridColumn: '1 / -1' }}>
                              <strong>Address:</strong> {caseItem.client_address || 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Opposite Party Details */}
                      {(caseItem.opposite_party || caseItem.otherside_counsel) && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ color: '#007bff', marginBottom: '10px' }}>Opposite Party Details</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <p><strong>Opposite Party:</strong> {caseItem.opposite_party || 'N/A'}</p>
                            <p><strong>Otherside Counsel:</strong> {caseItem.otherside_counsel || 'N/A'}</p>
                            <p><strong>Party Type:</strong> {caseItem.party_type || 'N/A'}</p>
                          </div>
                        </div>
                      )}

                      {/* Additional Information */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: '#007bff', marginBottom: '10px' }}>Additional Information</h4>
                        {caseItem.description && (
                          <p><strong>Description:</strong> {caseItem.description}</p>
                        )}
                        {caseItem.remarks && (
                          <p><strong>Remarks:</strong> {caseItem.remarks}</p>
                        )}
                        {caseItem.notes && (
                          <p><strong>Notes:</strong> {caseItem.notes}</p>
                        )}
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                          <strong>Created:</strong> {new Date(caseItem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <HearingHistory caseId={caseItem.id} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Case Form Modal */}
      {showForm && (
        <CaseForm
          caseData={editingCase}
          onClose={handleFormClose}
          onSuccess={() => {
            loadCases()
            handleFormClose()
          }}
        />
      )}
    </div>
  )
}

export default Cases
