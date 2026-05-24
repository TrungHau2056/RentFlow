import axios from 'axios';

// Base URL for Backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 status in ApiResponse or HTTP status)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    // Check if ApiResponse contains status === 401
    if (data && data.status === 401) {
      return handleUnauthorized(response.config);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if HTTP response is 401
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      return handleUnauthorized(originalRequest);
    }

    return Promise.reject(error);
  }
);

async function handleUnauthorized(originalRequest) {
  if (originalRequest._retry) {
    // If we already retried and failed, clear tokens and logout
    logout();
    return Promise.reject(new Error('Auth refresh failed'));
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    isRefreshing = false;
    logout();
    return Promise.reject(new Error('No refresh token available'));
  }

  try {
    // POST /api/auth/refresh
    // Body: { refreshToken: string }
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const apiResponse = response.data;
    // Check if successful refresh (e.g. data.status === 200 or status is falsy and we got new data)
    if (apiResponse && apiResponse.data) {
      const { accessToken, refreshToken: newRefreshToken } = apiResponse.data;

      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      isRefreshing = false;

      return api(originalRequest);
    } else {
      throw new Error(apiResponse?.message || 'Token refresh failed');
    }
  } catch (refreshError) {
    processQueue(refreshError, null);
    isRefreshing = false;
    logout();
    return Promise.reject(refreshError);
  }
}

function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.dispatchEvent(new Event('auth-logout'));
}

export default api;
