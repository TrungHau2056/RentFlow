import api from './api';

const baoCaoService = {
  async thongKeBatDongSan(thang, nam, khuVuc, loaiHinh) {
    const params = {};
    if (thang) params.thang = thang;
    if (nam) params.nam = nam;
    if (khuVuc) params.khuVuc = khuVuc;
    if (loaiHinh) params.loaiHinh = loaiHinh;
    const response = await api.get('/api/bao-cao/bat-dong-san/thong-ke', { params });
    return response.data;
  },

  async doanhThuHoaHong(thang, nam, tuNgay, denNgay) {
    const params = {};
    if (thang) params.thang = thang;
    if (nam) params.nam = nam;
    if (tuNgay) params.tuNgay = tuNgay;
    if (denNgay) params.denNgay = denNgay;
    const response = await api.get('/api/bao-cao/hoa-hong/doanh-thu', { params });
    return response.data;
  },

  async hieuSuatMoiGioi(thang, nam, sapXepTheo, gioiHan) {
    const params = {};
    if (thang) params.thang = thang;
    if (nam) params.nam = nam;
    if (sapXepTheo) params.sapXepTheo = sapXepTheo;
    if (gioiHan) params.gioiHan = gioiHan;
    const response = await api.get('/api/bao-cao/moi-gioi/hieu-suat', { params });
    return response.data;
  },

  async baoCaoHopDong(thang, nam) {
    const params = {};
    if (thang) params.thang = thang;
    if (nam) params.nam = nam;
    const response = await api.get('/api/bao-cao/hop-dong', { params });
    return response.data;
  },

  async luuBaoCao(data) {
    const response = await api.post('/api/bao-cao/luu', data);
    return response.data;
  },

  async lichSuBaoCao() {
    const response = await api.get('/api/bao-cao/lich-su');
    return response.data;
  },

  async chiTietBaoCao(id) {
    const response = await api.get(`/api/bao-cao/chi-tiet/${id}`);
    return response.data;
  },
};

export default baoCaoService;
