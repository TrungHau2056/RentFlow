import api from './api';

const hopDongThueService = {
  async danhSach(params) {
    const response = await api.get('/api/hop-dong-thue', { params });
    return response.data;
  },

  async chiTiet(id) {
    const response = await api.get(`/api/hop-dong-thue/${id}`);
    return response.data;
  },

  async cuaToi() {
    const response = await api.get('/api/hop-dong-thue/me');
    return response.data;
  },

  async tao(data) {
    const response = await api.post('/api/hop-dong-thue', data);
    return response.data;
  },

  async capNhat(id, data) {
    const response = await api.put(`/api/hop-dong-thue/${id}`, data);
    return response.data;
  },

  async kiemTraDieuKien(params) {
    const response = await api.get('/api/hop-dong-thue/eligible', { params });
    return response.data;
  },

  async ky(id, data = {}) {
    const response = await api.put(`/api/hop-dong-thue/${id}/ky`, data);
    return response.data;
  },

  async capNhatTrangThai(id, trangThai) {
    const response = await api.patch(`/api/hop-dong-thue/${id}/trang-thai`, { trangThai });
    return response.data;
  },
};

export default hopDongThueService;
