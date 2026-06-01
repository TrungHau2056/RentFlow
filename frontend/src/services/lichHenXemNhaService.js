import api from './api';

const lichHenXemNhaService = {
  async danhSach(params) {
    const response = await api.get('/api/lich-hen-xem-nha', { params });
    return response.data;
  },

  async chiTiet(id) {
    const response = await api.get(`/api/lich-hen-xem-nha/${id}`);
    return response.data;
  },

  async tao(data) {
    const response = await api.post('/api/lich-hen-xem-nha', data);
    return response.data;
  },

  async capNhat(id, data) {
    const response = await api.put(`/api/lich-hen-xem-nha/${id}`, data);
    return response.data;
  },

  async capNhatTrangThai(id, trangThai) {
    const response = await api.patch(`/api/lich-hen-xem-nha/${id}/trang-thai`, { trangThai });
    return response.data;
  },

  async assignBroker(id, nhanVienId) {
    const response = await api.patch(`/api/lich-hen-xem-nha/${id}/assign-broker`, { nhanVienId });
    return response.data;
  },

  async ghiPhanHoi(id, data) {
    const response = await api.put(`/api/lich-hen-xem-nha/${id}/phan-hoi`, data);
    return response.data;
  },
};

export default lichHenXemNhaService;
