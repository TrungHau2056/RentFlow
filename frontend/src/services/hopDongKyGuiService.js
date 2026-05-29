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

  async tao(data) {
    const response = await api.post('/api/hop-dong-ky-gui', data);
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
};

export default hopDongKyGuiService;
