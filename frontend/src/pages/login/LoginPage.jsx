import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './LoginPage.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login, loading } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path, defaulting to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      } else {
        setErrorMsg(result.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      setErrorMsg('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-content-container">
        
        {/* Left Side: Brand Branding */}
        <div className="login-brand-section">
          <h1 className="brand-title">RentFlow</h1>
          <h2 className="brand-subtitle">Hệ thống quản lý kí gửi nhà cho thuê</h2>
          <p className="brand-description">
            Giải pháp quản lý kí gửi và cho thuê nhà toàn diện, giúp bạn dễ dàng theo dõi và quản lý mọi hoạt động giao dịch.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <div className="login-card-container">
          <div className="login-card">
            
            {/* Lock Circle Icon */}
            <div className="lock-icon-container">
              <svg 
                className="lock-svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <h3 className="card-title">Đăng nhập</h3>

            {errorMsg && <div className="auth-alert alert-error">{errorMsg}</div>}
            {successMsg && <div className="auth-alert alert-success">{successMsg}</div>}

            <form className="login-form" onSubmit={handleSubmit}>
              
              {/* Email / Username field */}
              <div className="input-group">
                <label className="input-label">Tên đăng nhập</label>
                <input
                  type="text"
                  className="outlined-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="012345678901 hoặc email"
                  disabled={loading}
                  required
                />
              </div>

              {/* Password field */}
              <div className="input-group">
                <label className="input-label">Mật khẩu</label>
                <input
                  type="password"
                  className="outlined-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={loading}
                  required
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`login-submit-btn ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
