import api from './api';

const taiChinhService = {
  async ghiNhanThu(hopDongKyGuiId) {
    const response = await api.post('/api/tai-chinh/ghi-nhan-thu', { hopDongKyGuiId });
    return response.data;
  },

  async layDanhSachGiaoDich(loaiGiaoDich) {
    const params = loaiGiaoDich ? { loaiGiaoDich } : {};
    const response = await api.get('/api/tai-chinh/giao-dich', { params });
    return response.data;
  },

  async layHopDongKyGuiChoThu() {
    const response = await api.get('/api/tai-chinh/hop-dong-ky-gui/cho-ghi-nhan-thu');
    return response.data;
  },

  async layHopDongThueChoTinhHoaHong() {
    const response = await api.get('/api/tai-chinh/hop-dong-thue/cho-tinh-hoa-hong');
    return response.data;
  },

  async xacNhanGiaoDich(id) {
    const response = await api.put(`/api/tai-chinh/giao-dich/${id}/xac-nhan`);
    return response.data;
  },

  async xuatGiaoDichCsv() {
    const response = await api.get('/api/tai-chinh/giao-dich/export', { responseType: 'blob' });
    return response.data;
  },

  async layChiTietGiaoDich(id) {
    const response = await api.get(`/api/tai-chinh/giao-dich/${id}`);
    return response.data;
  },

  async tinhHoaHong(hopDongThueId) {
    const response = await api.post(`/api/tai-chinh/tinh-hoa-hong/${hopDongThueId}`);
    return response.data;
  },

  async layDanhSachHoaHong() {
    const response = await api.get('/api/tai-chinh/hoa-hong');
    return response.data;
  },

  async xuatHoaHongCsv() {
    const response = await api.get('/api/tai-chinh/hoa-hong/export', { responseType: 'blob' });
    return response.data;
  },

  async layChiTietHoaHong(id) {
    const response = await api.get(`/api/tai-chinh/hoa-hong/${id}`);
    return response.data;
  },

  async danhDauThanhToan(id) {
    const response = await api.put(`/api/tai-chinh/hoa-hong/${id}/thanh-toan`);
    return response.data;
  },

  async quetHopDongDuDieuKienHoanTra() {
    const response = await api.get('/api/tai-chinh/hop-dong-ky-gui/du-dieu-kien-hoan-tra');
    return response.data;
  },

  async hoanTra(hopDongKyGuiId, lyDoChAmDut) {
    const response = await api.post('/api/tai-chinh/hoan-tra', { hopDongKyGuiId, lyDoChAmDut });
    return response.data;
  },
};

export default taiChinhService;
