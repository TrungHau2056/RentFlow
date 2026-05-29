import api from './api';

const lichHenKhaoSatService = {
  async danhSach() {
    const response = await api.get('/api/lich-hen-khao-sat');
    return response.data;
  },

  async chiTiet(id) {
    const response = await api.get(`/api/lich-hen-khao-sat/${id}`);
    return response.data;
  },

  async tao(data) {
    const response = await api.post('/api/lich-hen-khao-sat', data);
    return response.data;
  },

  async capNhat(id, data) {
    const response = await api.put(`/api/lich-hen-khao-sat/${id}`, data);
    return response.data;
  },

  async capNhatTrangThai(id, trangThai) {
    const response = await api.patch(`/api/lich-hen-khao-sat/${id}/trang-thai`, { trangThai });
    return response.data;
  },

  async ghiKetQua(id, data) {
    const response = await api.patch(`/api/lich-hen-khao-sat/${id}/ket-qua`, data);
    return response.data;
  },

  async xoa(id) {
    const response = await api.delete(`/api/lich-hen-khao-sat/${id}`);
    return response.data;
  },
};

export default lichHenKhaoSatService;
