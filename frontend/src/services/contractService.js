import api from './api';

const contractService = {
  async getKyGuiContracts() {
    const response = await api.get('/api/hop-dong-ky-gui');
    return response.data;
  },

  async getThueContracts() {
    const response = await api.get('/api/hop-dong-thue');
    return response.data;
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
    const response = await api.patch(`/api/hop-dong-thue/${id}/trang-thai`, { trangThai });
    return response.data;
  },

  async kyHopDongThue(id) {
    const response = await api.put(`/api/hop-dong-thue/${id}/ky`);
    return response.data;
  },
};

export default contractService;
