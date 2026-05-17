import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { logout } = useAuth();
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [apiResult, setApiResult] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    // Get tokens on mount
    setAccessToken(localStorage.getItem('accessToken') || 'No access token');
    setRefreshToken(localStorage.getItem('refreshToken') || 'No refresh token');
  }, []);

  const handleTestApi = async () => {
    setApiLoading(true);
    setApiResult(null);
    try {
      // Try to fetch user profile or a dummy protected endpoint (e.g. /api/user/profile)
      const response = await api.get('/api/user/profile');
      setApiResult({
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      console.error('Test API error:', error);
      setApiResult({
        success: false,
        status: error.response?.status || 'network_error',
        message: error.response?.data?.message || error.message || 'API request failed.'
      });
    } finally {
      setApiLoading(false);
    }
  };

  const handleForceTokenRefresh = async () => {
    setApiLoading(true);
    setApiResult(null);
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (!currentRefreshToken) {
        throw new Error('Không tìm thấy Refresh Token trong LocalStorage!');
      }

      // Manually request a refresh
      const response = await api.post('/api/auth/refresh', { refreshToken: currentRefreshToken });
      
      if (response.data && response.data.data) {
        const { accessToken: newAccess, refreshToken: newRefresh } = response.data.data;
        setAccessToken(newAccess);
        if (newRefresh) setRefreshToken(newRefresh);
        
        setApiResult({
          success: true,
          message: 'Làm mới token thành công!',
          data: response.data
        });
      } else {
        throw new Error(response.data?.message || 'Không thể làm mới token.');
      }
    } catch (error) {
      console.error('Manual refresh error:', error);
      setApiResult({
        success: false,
        message: error.message || 'Làm mới token thất bại.'
      });
    } finally {
      setApiLoading(false);
    }
  };

  const truncateToken = (token) => {
    if (!token || token === 'No access token' || token === 'No refresh token') return token;
    if (token.length <= 30) return token;
    return `${token.substring(0, 15)}...${token.substring(token.length - 15)}`;
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">RentFlow</div>
        <div className="nav-actions">
          <span className="user-badge">Đã đăng nhập</span>
          <button className="logout-btn" onClick={logout}>Đăng xuất</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-card welcome-card">
          <h1>Chào mừng đến với RentFlow!</h1>
          <p className="subtitle">
            Hệ thống quản lý kí gửi nhà cho thuê. Route này đang được bảo vệ bởi <code>ProtectedRoute</code>.
          </p>
        </div>

        <div className="dashboard-grid">
          
          {/* Tokens Demonstration */}
          <div className="dashboard-card token-card">
            <h3>Thông tin Token lưu tại LocalStorage</h3>
            <p className="card-desc">Cả 2 tokens đều đang được lưu trữ an toàn trong LocalStorage của trình duyệt.</p>
            
            <div className="token-display-group">
              <div className="token-item">
                <span className="token-label">Access Token:</span>
                <code className="token-code" title={accessToken}>
                  {truncateToken(accessToken)}
                </code>
              </div>
              <div className="token-item">
                <span className="token-label">Refresh Token:</span>
                <code className="token-code" title={refreshToken}>
                  {truncateToken(refreshToken)}
                </code>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="action-btn refresh-btn" 
                onClick={handleForceTokenRefresh}
                disabled={apiLoading}
              >
                Làm mới Token thủ công
              </button>
            </div>
          </div>

          {/* API Client Testing */}
          <div className="dashboard-card api-card">
            <h3>Kiểm thử Axios Interceptor & Auto-Refresh</h3>
            <p className="card-desc">
              Khi bạn gửi yêu cầu và máy chủ trả về mã <strong>401 (Unauthorized)</strong>, 
              Axios Interceptor sẽ tự động chặn, gửi Refresh Token để lấy Access Token mới, 
              sau đó tự động gửi lại yêu cầu gốc mà không làm gián đoạn người dùng.
            </p>
            
            <div className="action-buttons">
              <button 
                className="action-btn api-test-btn" 
                onClick={handleTestApi}
                disabled={apiLoading}
              >
                {apiLoading ? 'Đang gửi...' : 'Gửi Request có Auth Header'}
              </button>
            </div>

            {apiResult && (
              <div className={`api-result-box ${apiResult.success ? 'success' : 'error'}`}>
                <strong>Trạng thái: {apiResult.status || 'OK'}</strong>
                <pre className="json-output">
                  {JSON.stringify(apiResult.data || apiResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
