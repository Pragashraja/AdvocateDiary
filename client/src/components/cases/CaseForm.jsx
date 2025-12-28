import { useState, useEffect } from 'react'
import { caseService } from '../../services/caseService'
import { documentService } from '../../services/documentService'

function CaseForm({ caseData, onClose, onSuccess }) {
  const isEditing = Boolean(caseData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState([])

  const [formData, setFormData] = useState({
    case_number: '',
    title: '',
    case_type: '',
    court_name: '',
    filing_date: '',
    status: 'Active',
    client_name: '',
    client_address: '',
    client_phone: '',
    opposite_party: '',
    otherside_counsel: '',
    party_type: '',
    description: '',
    remarks: '',
    notes: ''
  })

  useEffect(() => {
    if (caseData) {
      setFormData({
        case_number: caseData.case_number || '',
        title: caseData.title || '',
        case_type: caseData.case_type || '',
        court_name: caseData.court_name || '',
        filing_date: caseData.filing_date || '',
        status: caseData.status || 'Active',
        client_name: caseData.client_name || '',
        client_address: caseData.client_address || '',
        client_phone: caseData.client_phone || '',
        opposite_party: caseData.opposite_party || '',
        otherside_counsel: caseData.otherside_counsel || '',
        party_type: caseData.party_type || '',
        description: caseData.description || '',
        remarks: caseData.remarks || '',
        notes: caseData.notes || ''
      })
    }
  }, [caseData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Submitting case data:', formData)

      if (isEditing) {
        // Update existing case
        await caseService.updateCase(caseData.id, formData)
        alert('Case updated successfully!')
      } else {
        // Create new case
        const response = await caseService.createCase(formData)
        console.log('Case creation response:', response)
        const caseId = response.case.id

        // Upload documents if any
        if (documents.length > 0) {
          for (const file of documents) {
            const docFormData = new FormData()
            docFormData.append('file', file)
            docFormData.append('case_id', caseId)
            docFormData.append('title', file.name)
            docFormData.append('description', 'Case document')

            await documentService.uploadDocument(docFormData)
          }
        }

        alert('Case created successfully!')
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} case:`, err)
      console.error('Error response:', err.response)
      const errorMessage = err.response?.data?.error || err.message || `Failed to ${isEditing ? 'update' : 'create'} case`
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
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{isEditing ? 'Edit Case' : 'Add New Case'}</h2>
          <button onClick={onClose} className="btn btn-secondary">✕</button>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Case Details Section */}
          <h3 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            Case Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Case Number *</label>
              <input
                type="text"
                name="case_number"
                className="form-control"
                value={formData.case_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Case Type</label>
              <select name="case_type" className="form-control" value={formData.case_type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Family">Family</option>
                <option value="Corporate">Corporate</option>
                <option value="Property">Property</option>
                <option value="Labour">Labour</option>
                <option value="Tax">Tax</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Case Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g., ABC vs XYZ"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Court Name</label>
              <input
                type="text"
                name="court_name"
                className="form-control"
                value={formData.court_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Filing Date</label>
              <input
                type="date"
                name="filing_date"
                className="form-control"
                value={formData.filing_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Status</label>
              <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="form-group">
              <label>Party Type</label>
              <select name="party_type" className="form-control" value={formData.party_type} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Plaintiff">Plaintiff</option>
                <option value="Defendant">Defendant</option>
                <option value="Petitioner">Petitioner</option>
                <option value="Respondent">Respondent</option>
              </select>
            </div>
          </div>

          {/* Client Details Section */}
          <h3 style={{ marginTop: '25px', marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            Client Details
          </h3>

          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              name="client_name"
              className="form-control"
              value={formData.client_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Client Address</label>
            <textarea
              name="client_address"
              className="form-control"
              rows="2"
              value={formData.client_address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Client Phone</label>
            <input
              type="tel"
              name="client_phone"
              className="form-control"
              value={formData.client_phone}
              onChange={handleChange}
            />
          </div>

          {/* Opposite Party Details Section */}
          <h3 style={{ marginTop: '25px', marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            Opposite Party Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Opposite Party</label>
              <input
                type="text"
                name="opposite_party"
                className="form-control"
                value={formData.opposite_party}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Otherside Counsel</label>
              <input
                type="text"
                name="otherside_counsel"
                className="form-control"
                value={formData.otherside_counsel}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <h3 style={{ marginTop: '25px', marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            Additional Information
          </h3>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              className="form-control"
              rows="2"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              className="form-control"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Document Upload Section */}
          <h3 style={{ marginTop: '25px', marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            Related Documents
          </h3>

          <div className="form-group">
            <label>Upload Documents (Optional)</label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              You can select multiple files. Supported: PDF, DOC, DOCX, JPG, PNG, TXT
            </small>
            {documents.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Selected files:</strong>
                <ul>
                  {documents.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Case...' : 'Create Case'}
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

export default CaseForm
