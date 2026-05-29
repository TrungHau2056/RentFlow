import api from './api';

const baoCaoService = {
  async thongKeBatDongSan(thang, nam) {
    const params = {};
    if (thang) params.thang = thang;
    if (nam) params.nam = nam;
    const response = await api.get('/api/bao-cao/bat-dong-san/thong-ke', { params });
    return response.data;
  },

  async doanhThuHoaHong(thang, nam) {
    const params = {};
    if (thang) params.thang = thang;
    if (nam) params.nam = nam;
    const response = await api.get('/api/bao-cao/hoa-hong/doanh-thu', { params });
    return response.data;
  },

  async hieuSuatMoiGioi(thang, nam) {
    const params = {};
    if (thang) params.thang = thang;
    if (nam) params.nam = nam;
    const response = await api.get('/api/bao-cao/moi-gioi/hieu-suat', { params });
    return response.data;
  },
};

export default baoCaoService;
