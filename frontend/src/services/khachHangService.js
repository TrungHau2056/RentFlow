import api from './api';

const khachHangService = {
  async danhSach() {
    const response = await api.get('/api/khach-hang');
    return response.data;
  },

  async chiTiet(id) {
    const response = await api.get(`/api/khach-hang/${id}`);
    return response.data;
  },

  async capNhat(id, data) {
    const response = await api.put(`/api/khach-hang/${id}`, data);
    return response.data;
  },

  async capNhatNhuCau(id, nhuCau) {
    const response = await api.put(`/api/khach-hang/${id}/nhu-cau`, nhuCau);
    return response.data;
  },

  async xoa(id) {
    const response = await api.delete(`/api/khach-hang/${id}`);
    return response.data;
  },
};

export default khachHangService;
