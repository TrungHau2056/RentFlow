import api from './api';

const viewingService = {
  async createBooking(data) {
    const response = await api.post('/api/lich-hen-xem-nha/khach-hang', data);
    return response.data;
  },

  async getPropertyDetail(id) {
    const response = await api.get(`/api/bat-dong-san-cong-khai/${id}`);
    return response.data;
  },

  async getPublicProperties() {
    const response = await api.get('/api/bat-dong-san-cong-khai');
    return response.data;
  },

  async searchProperties(params) {
    const response = await api.get('/api/bat-dong-san-cong-khai/search', { params });
    return response.data;
  },

  async getSurveyAppointments() {
    const response = await api.get('/api/lich-hen-khao-sat');
    return response.data;
  },

  async getMyViewingSchedules() {
    const response = await api.get('/api/lich-hen-xem-nha/my');
    return response.data;
  },

  async rescheduleAppointment(id, thoiGian) {
    const response = await api.patch(`/api/lich-hen-xem-nha/${id}/reschedule`, { thoiGian });
    return response.data;
  },
};

export default viewingService;
