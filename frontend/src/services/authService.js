import api from './api';

const authService = {
  /**
   * Logs in a user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} The API response data
   */
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    const apiResponse = response.data;
    
    // Check if login is successful (status: 200 or similar success, and data exists)
    if (apiResponse && apiResponse.data) {
      const { accessToken, refreshToken } = apiResponse.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    return apiResponse;
  },

  /**
   * Manually refreshes the access token using a refresh token
   * @param {string} refreshToken 
   * @returns {Promise<Object>} The API response data
   */
  async refresh(refreshToken) {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    const apiResponse = response.data;
    if (apiResponse && apiResponse.data) {
      const { accessToken, refreshToken: newRefreshToken } = apiResponse.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
    }
    return apiResponse;
  },

  /**
   * Logs out the current user by removing tokens from local storage
   */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('auth-logout'));
  },

  /**
   * Checks if an access token exists in local storage
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Gets the stored access token
   * @returns {string|null}
   */
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  /**
   * Gets the stored refresh token
   * @returns {string|null}
   */
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
};

export default authService;
