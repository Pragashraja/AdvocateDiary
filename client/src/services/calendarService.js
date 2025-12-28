import api from './api'

export const calendarService = {
  async getEvents() {
    const response = await api.get('/calendar')
    return response.data
  },

  async getEvent(id) {
    const response = await api.get(`/calendar/${id}`)
    return response.data
  },

  async createEvent(eventData) {
    const response = await api.post('/calendar', eventData)
    return response.data
  },

  async updateEvent(id, eventData) {
    const response = await api.put(`/calendar/${id}`, eventData)
    return response.data
  },

  async deleteEvent(id) {
    const response = await api.delete(`/calendar/${id}`)
    return response.data
  }
}
