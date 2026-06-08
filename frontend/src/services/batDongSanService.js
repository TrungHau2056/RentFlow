import api from './api';

const batDongSanService = {
  async danhSach(trangThai) {
    const params = {};
    if (trangThai) params.trangThai = trangThai;
    const response = await api.get('/api/bat-dong-san', { params });
    return response.data;
  },

  async chiTiet(id) {
    const response = await api.get(`/api/bat-dong-san/${id}`);
    return response.data;
  },

  async theoChuNha(chuNhaId) {
    const response = await api.get(`/api/bat-dong-san/chu-nha/${chuNhaId}`);
    return response.data;
  },

  async yeuCauMoi() {
    const response = await api.get('/api/bat-dong-san/yeu-cau-moi');
    return response.data;
  },

  async tao(data) {
    const response = await api.post('/api/bat-dong-san', data);
    return response.data;
  },

  async capNhatChiTiet(id, data) {
    const response = await api.put(`/api/bat-dong-san-cong-khai/${id}/chi-tiet`, data);
    return response.data;
  },

  async capNhat(id, data) {
    const response = await api.put(`/api/bat-dong-san/${id}`, data);
    return response.data;
  },

  async xoa(id) {
    const response = await api.delete(`/api/bat-dong-san/${id}`);
    return response.data;
  },

  async capNhatTrangThai(id, trangThai) {
    const response = await api.patch(`/api/bat-dong-san/${id}/trang-thai`, { trangThai });
    return response.data;
  },
};

export default batDongSanService;
