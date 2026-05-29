import api from './api';

const quanTriService = {
  async danhSachTaiKhoan() {
    const response = await api.get('/api/quan-tri/tai-khoan');
    return response.data;
  },

  async chiTietTaiKhoan(id) {
    const response = await api.get(`/api/quan-tri/tai-khoan/${id}`);
    return response.data;
  },

  async taoTaiKhoan(data) {
    const response = await api.post('/api/quan-tri/tai-khoan', data);
    return response.data;
  },

  async doiTrangThai(id, trangThai) {
    const response = await api.put(`/api/quan-tri/tai-khoan/${id}/trang-thai`, { trangThai });
    return response.data;
  },

  async doiVaiTro(id, tenVaiTro) {
    const response = await api.put(`/api/quan-tri/tai-khoan/${id}/vai-tro`, { tenVaiTro });
    return response.data;
  },

  async xoaTaiKhoan(id) {
    const response = await api.delete(`/api/quan-tri/tai-khoan/${id}`);
    return response.data;
  },
};

export default quanTriService;
