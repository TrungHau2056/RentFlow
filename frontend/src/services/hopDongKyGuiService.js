import api from './api';

const hopDongKyGuiService = {
  async danhSach() {
    const response = await api.get('/api/hop-dong-ky-gui');
    return response.data;
  },

  async chiTiet(id) {
    const response = await api.get(`/api/hop-dong-ky-gui/${id}`);
    return response.data;
  },

  async theoChuNhaHienTai() {
    const response = await api.get('/api/hop-dong-ky-gui/chu-nha/me');
    return response.data;
  },

  async theoBDS(batDongSanId) {
    const response = await api.get(`/api/hop-dong-ky-gui/by-bat-dong-san/${batDongSanId}`);
    return response.data;
  },

  async tao(data) {
    const response = await api.post('/api/hop-dong-ky-gui', data);
    return response.data;
  },

  async taoVaKy(data) {
    const response = await api.post('/api/hop-dong-ky-gui/tao-va-ky', data);
    return response.data;
  },

  async capNhat(id, data) {
    const response = await api.put(`/api/hop-dong-ky-gui/${id}`, data);
    return response.data;
  },

  async guiPheDuyet(id) {
    const response = await api.patch(`/api/hop-dong-ky-gui/${id}/gui-phe-duyet`);
    return response.data;
  },

  async pheDuyet(id, data) {
    const response = await api.patch(`/api/hop-dong-ky-gui/${id}/phe-duyet`, data);
    return response.data;
  },

  async kyKet(id) {
    const response = await api.patch(`/api/hop-dong-ky-gui/${id}/ky-ket`);
    return response.data;
  },

  async xoa(id) {
    const response = await api.delete(`/api/hop-dong-ky-gui/${id}`);
    return response.data;
  },

  // === Extended endpoints (may fallback if backend not ready) ===

  /** Yêu cầu sửa hợp đồng (gửi lại pháp lý sau khi sửa) */
  async yeuCauSua(id, data = {}) {
    // Fallback: use pheDuyet with duyet=false + lyDo if dedicated endpoint missing
    try {
      const response = await api.patch(`/api/hop-dong-ky-gui/${id}/yeu-cau-sua`, data);
      return response.data;
    } catch {
      // Fallback: use pheDuyet with explanatory note
      const response = await api.patch(`/api/hop-dong-ky-gui/${id}/phe-duyet`, {
        duyet: false,
        lyDoTuChoi: data.lyDo || 'Yêu cầu sửa: ' + (data.ghiChu || ''),
      });
      return response.data;
    }
  },

  /** Ký phía chủ nhà */
  async kyChuNha(id) {
    try {
      const response = await api.patch(`/api/hop-dong-ky-gui/${id}/ky-chu-nha`);
      return response.data;
    } catch {
      // Fallback: use kyKet (combined signing)
      const response = await api.patch(`/api/hop-dong-ky-gui/${id}/ky-ket`);
      return response.data;
    }
  },

  /** Ký phía đại lý */
  async kyDaiLy(id) {
    try {
      const response = await api.patch(`/api/hop-dong-ky-gui/${id}/ky-dai-ly`);
      return response.data;
    } catch {
      // Fallback: use kyKet (combined signing)
      const response = await api.patch(`/api/hop-dong-ky-gui/${id}/ky-ket`);
      return response.data;
    }
  },
};

export default hopDongKyGuiService;
