import api from './api';

const nhanVienService = {
  async danhSachMoiGioi() {
    const response = await api.get('/api/nhan-vien-moi-gioi');
    return response.data;
  },

  async ganKhachHang(nhanVienId, khachHangId) {
    const response = await api.post(`/api/nhan-vien-moi-gioi/${nhanVienId}/khach-hang`, { khachHangId });
    return response.data;
  },

  async danhSachKhachHang(nhanVienId) {
    const response = await api.get(`/api/nhan-vien-moi-gioi/${nhanVienId}/khach-hang`);
    return response.data;
  },

  async boGanKhachHang(nhanVienId, khachHangId) {
    const response = await api.delete(`/api/nhan-vien-moi-gioi/${nhanVienId}/khach-hang/${khachHangId}`);
    return response.data;
  },
};

export default nhanVienService;
