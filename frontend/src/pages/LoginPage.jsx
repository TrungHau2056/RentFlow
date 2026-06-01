import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import { isInternalAdminRole } from '../config/roles'
import { extractUserFromJwt } from '../utils/jwt'
import api from '../services/api'
import { MOCK_USERS } from '../config/mockUsers'

const ALERT_CONTENT = {
  missing: {
    title: 'Thiếu thông tin đăng nhập',
    message: 'Vui lòng nhập email hoặc số điện thoại và mật khẩu.',
  },
  incorrect: {
    title: 'Thông tin đăng nhập không đúng',
    message: 'Email, số điện thoại hoặc mật khẩu chưa chính xác.',
  },
  locked: {
    title: 'Tài khoản tạm thời bị khóa',
    message: 'Vui lòng liên hệ hỗ trợ để xác minh và mở khóa tài khoản.',
  },
  unavailable: {
    title: 'Chưa thể kết nối máy chủ',
    message: 'Dùng tài khoản demo: admin@rentflow.vn / 123456 (hoặc ketoan@, phapluat@, chunha@, khachthue@ / 123456)',
  },
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState(() => localStorage.getItem('rememberedIdentifier') || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [loading, setLoading] = useState(false)

  const alert = ALERT_CONTENT[alertType]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAlertType('')

    const normalizedIdentifier = identifier.trim().toLowerCase()
    if (!normalizedIdentifier || !password) {
      setAlertType('missing')
      return
    }

    // Fallback: kiểm tra mock users nếu API lỗi
    const mockUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === normalizedIdentifier && u.password === password
    )
    if (mockUser) {
      setLoading(true)
      setTimeout(() => {
        const userInfo = {
          id: mockUser.id,
          hoTen: mockUser.hoTen,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('accessToken', 'mock-token')
        localStorage.setItem('refreshToken', 'mock-refresh')
        if (rememberMe) localStorage.setItem('rememberedIdentifier', normalizedIdentifier)
        else localStorage.removeItem('rememberedIdentifier')
        if (isInternalAdminRole(userInfo?.role)) navigate('/admin')
        else if (userInfo?.role === 'CHU_NHA') navigate('/dashboard/bat-dong-san')
        else if (userInfo?.role === 'KHACH_HANG') navigate('/tenant')
        else navigate('/')
        setLoading(false)
      }, 300)
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email: normalizedIdentifier, password })
      const { accessToken, refreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      const userInfo = extractUserFromJwt(accessToken, normalizedIdentifier)
      if (userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo))

      if (rememberMe) localStorage.setItem('rememberedIdentifier', normalizedIdentifier)
      else localStorage.removeItem('rememberedIdentifier')

      const role = userInfo?.role
      if (isInternalAdminRole(role)) navigate('/admin')
      else if (role === 'CHU_NHA') navigate('/dashboard/bat-dong-san')
      else if (role === 'KHACH_HANG') navigate('/tenant')
      else navigate('/')
    } catch (error) {
      const data = error.response?.data
      if (data?.message?.toLowerCase().includes('khóa')) setAlertType('locked')
      else if (error.code === 'ERR_NETWORK' || !error.response) setAlertType('unavailable')
      else setAlertType('incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-panel-enter">
        <Link to="/home" className="mb-9 inline-flex items-center gap-3 lg:mb-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-blue-600/20">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-primary">RentFlow</p>
            <p className="text-xs text-slate-500">Ký gửi &amp; Cho thuê nhà</p>
          </div>
        </Link>

        <header>
          <p className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-container">
            Thành viên
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">Đăng nhập</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            Chào mừng bạn quay trở lại
          </p>
        </header>

        {alert && (
          <div role="alert" className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.5m0 3h.01m-8.282 2.025l7.157-12.394a1.288 1.288 0 012.23 0l7.157 12.394a1.288 1.288 0 01-1.115 1.932H4.843a1.288 1.288 0 01-1.115-1.932z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700">{alert.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-red-600">{alert.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email hoặc Số điện thoại</span>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 11h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="email@example.com hoặc 0988 123 456"
                autoComplete="username"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-on-surface placeholder:text-slate-400 transition-all focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</span>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7 11V8a5 5 0 0110 0v3m-11 0h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 text-sm text-on-surface placeholder:text-slate-400 transition-all focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-primary-container"
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 accent-[#0052cc]"
              />
              Ghi nhớ đăng nhập
            </label>
            <button type="button" className="text-sm font-medium text-primary-container transition hover:text-primary hover:underline">
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-primary-container to-[#1265e5] px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="my-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          Hoặc đăng nhập với
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid gap-3">
          <button type="button" className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 01-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
              <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1-3.8 1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0012 23z" />
              <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 010-4.2V7.1H2.2a11 11 0 000 9.8l3.6-2.8z" />
              <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A10.4 10.4 0 0012 1 11 11 0 002.2 7.1l3.6 2.8c.9-2.6 3.3-4.5 6.2-4.5z" />
            </svg>
            Đăng nhập bằng Google
          </button>
          <button type="button" className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
            <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
            </svg>
            Đăng nhập bằng Facebook
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-primary-container transition hover:text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
