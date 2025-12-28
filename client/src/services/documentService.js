import api from './api'

export const documentService = {
  async getCaseDocuments(caseId) {
    const response = await api.get(`/documents/case/${caseId}`)
    return response.data
  },

  async uploadDocument(formData) {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async deleteDocument(id) {
    const response = await api.delete(`/documents/${id}`)
    return response.data
  }
}
