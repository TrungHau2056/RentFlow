import api from './api';

const chuNhaService = {
  async me() {
    const response = await api.get('/api/chu-nha/me');
    return response.data;
  },

  async danhSach() {
    const response = await api.get('/api/chu-nha');
    return response.data;
  },

  async chiTiet(id) {
    const response = await api.get(`/api/chu-nha/${id}`);
    return response.data;
  },

  async tao(data) {
    const response = await api.post('/api/chu-nha', data);
    return response.data;
  },

  async capNhat(id, data) {
    const response = await api.put(`/api/chu-nha/${id}`, data);
    return response.data;
  },

  async xoa(id) {
    const response = await api.delete(`/api/chu-nha/${id}`);
    return response.data;
  },
};

export default chuNhaService;
