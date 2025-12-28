import api from './api'

export const hearingUpdateService = {
  // Get all hearing updates for a case
  getHearingUpdates: async (caseId) => {
    const response = await api.get(`/hearing-updates?case_id=${caseId}`)
    return response.data
  },

  // Get all hearing updates across all cases
  getAllHearingUpdates: async () => {
    const response = await api.get('/hearing-updates/all')
    return response.data
  },

  // Get a single hearing update
  getHearingUpdate: async (id) => {
    const response = await api.get(`/hearing-updates/${id}`)
    return response.data
  },

  // Create a new hearing update
  createHearingUpdate: async (updateData) => {
    const response = await api.post('/hearing-updates', updateData)
    return response.data
  },

  // Update a hearing update
  updateHearingUpdate: async (id, updateData) => {
    const response = await api.put(`/hearing-updates/${id}`, updateData)
    return response.data
  },

  // Delete a hearing update
  deleteHearingUpdate: async (id) => {
    const response = await api.delete(`/hearing-updates/${id}`)
    return response.data
  }
}
