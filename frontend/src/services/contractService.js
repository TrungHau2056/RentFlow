import api from './api';
import hopDongThueService from './hopDongThueService';

const contractService = {
  async getKyGuiContracts() {
    const response = await api.get('/api/hop-dong-ky-gui');
    return response.data;
  },

  async getThueContracts() {
    return hopDongThueService.danhSach();
  },

  async approveKyGuiContract(id, duyet, lyDoTuChoi) {
    const response = await api.patch(`/api/hop-dong-ky-gui/${id}/phe-duyet`, {
      duyet,
      lyDoTuChoi: lyDoTuChoi || '',
    });
    return response.data;
  },

  async guiPheDuyetKyGui(id) {
    const response = await api.patch(`/api/hop-dong-ky-gui/${id}/gui-phe-duyet`);
    return response.data;
  },

  async kyKetKyGui(id) {
    const response = await api.patch(`/api/hop-dong-ky-gui/${id}/ky-ket`);
    return response.data;
  },

  async updateThueContractStatus(id, trangThai) {
    return hopDongThueService.capNhatTrangThai(id, trangThai);
  },

  async kyHopDongThue(id, data = {}) {
    return hopDongThueService.ky(id, data);
  },

  async kiemTraDieuKienThue(params) {
    return hopDongThueService.kiemTraDieuKien(params);
  },
};

export default contractService;
