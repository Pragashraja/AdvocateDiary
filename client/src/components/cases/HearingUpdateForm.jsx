import { useState, useEffect } from 'react'
import { hearingUpdateService } from '../../services/hearingUpdateService'

function HearingUpdateForm({ caseId, hearingData, onClose, onSuccess }) {
  const isEditing = Boolean(hearingData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    hearing_date: '',
    action_taken: '',
    court_order: '',
    next_hearing_date: '',
    action_to_be_taken: ''
  })

  useEffect(() => {
    if (hearingData) {
      setFormData({
        hearing_date: hearingData.hearing_date || '',
        action_taken: hearingData.action_taken || '',
        court_order: hearingData.court_order || '',
        next_hearing_date: hearingData.next_hearing_date || '',
        action_to_be_taken: hearingData.action_to_be_taken || ''
      })
    }
  }, [hearingData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        case_id: caseId
      }

      if (isEditing) {
        await hearingUpdateService.updateHearingUpdate(hearingData.id, formData)
        alert('Hearing update updated successfully!')
      } else {
        await hearingUpdateService.createHearingUpdate(submitData)
        alert('Hearing update created successfully!')
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} hearing update:`, err)
      const errorMessage = err.response?.data?.error || err.message || `Failed to ${isEditing ? 'update' : 'create'} hearing update`
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{isEditing ? 'Edit Hearing Update' : 'Add Hearing Update'}</h2>
          <button onClick={onClose} className="btn btn-secondary">✕</button>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Hearing Date *</label>
            <input
              type="date"
              name="hearing_date"
              className="form-control"
              value={formData.hearing_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Action Taken</label>
            <textarea
              name="action_taken"
              className="form-control"
              rows="3"
              value={formData.action_taken}
              onChange={handleChange}
              placeholder="What happened at the hearing..."
            />
          </div>

          <div className="form-group">
            <label>Court Order</label>
            <textarea
              name="court_order"
              className="form-control"
              rows="3"
              value={formData.court_order}
              onChange={handleChange}
              placeholder="Court orders issued..."
            />
          </div>

          <div className="form-group">
            <label>Next Hearing Date</label>
            <input
              type="date"
              name="next_hearing_date"
              className="form-control"
              value={formData.next_hearing_date}
              onChange={handleChange}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              A calendar event will be automatically created for the next hearing date
            </small>
          </div>

          <div className="form-group">
            <label>Action to be Taken</label>
            <textarea
              name="action_to_be_taken"
              className="form-control"
              rows="3"
              value={formData.action_to_be_taken}
              onChange={handleChange}
              placeholder="Preparation needed for next hearing..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create')}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HearingUpdateForm
