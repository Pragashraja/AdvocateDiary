import api from './api'

export const caseService = {
  async getCases() {
    const response = await api.get('/cases')
    return response.data
  },

  async getCase(id) {
    const response = await api.get(`/cases/${id}`)
    return response.data
  },

  async createCase(caseData) {
    const response = await api.post('/cases', caseData)
    return response.data
  },

  async updateCase(id, caseData) {
    const response = await api.put(`/cases/${id}`, caseData)
    return response.data
  },

  async deleteCase(id) {
    const response = await api.delete(`/cases/${id}`)
    return response.data
  }
}
