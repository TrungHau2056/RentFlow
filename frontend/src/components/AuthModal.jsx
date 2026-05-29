import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isInternalAdminRole } from '../config/roles'
import { extractUserFromJwt } from '../utils/jwt'
import api from '../services/api'

const MEMBER_BENEFITS = [
  'Xem địa chỉ chi tiết',
  'Xem toàn bộ hình ảnh',
  'Liên hệ môi giới trực tiếp',
  'Đặt lịch xem nhà',
  'Theo dõi nhà yêu thích',
  'Nhận thông báo nhà phù hợp',
]

function EyeIcon({ visible }) {
  return visible ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    password: '',
    confirmPassword: '',
    role: 'CHU_NHA',
  })
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!isOpen) return undefined

    const originalOverflow = document.body.style.overflow
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isOpen, onClose])

  const selectTab = (tab) => {
    setActiveTab(tab)
    setError('')
  }

  const routeAuthenticatedUser = (user) => {
    onLoginSuccess()
    if (isInternalAdminRole(user?.role)) navigate('/admin')
    else if (user?.role === 'CHU_NHA') navigate('/dashboard')
    else if (user?.role === 'KHACH_THUE' || user?.role === 'KHACH_HANG') navigate('/tenant')
    else navigate('/')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Vui lòng nhập email')
      return
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { accessToken, refreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      const userInfo = extractUserFromJwt(accessToken, email)
      if (userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo))

      routeAuthenticatedUser(userInfo)
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')

    if (!registerForm.hoTen.trim()) { setError('Vui lòng nhập họ tên'); return }
    if (!registerForm.email.trim()) { setError('Vui lòng nhập email'); return }
    if (!registerForm.password) { setError('Vui lòng nhập mật khẩu'); return }
    if (registerForm.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return }
    if (registerForm.password !== registerForm.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }

    setLoading(true)
    try {
      const response = await api.post('/api/auth/register', {
        hoTen: registerForm.hoTen,
        email: registerForm.email,
        soDienThoai: registerForm.soDienThoai || undefined,
        password: registerForm.password,
        vaiTro: registerForm.role,
      })
      const { accessToken, refreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      const userInfo = extractUserFromJwt(accessToken, registerForm.email)
      if (userInfo) {
        userInfo.hoTen = registerForm.hoTen
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }

      routeAuthenticatedUser(userInfo)
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const updateRegisterForm = (field) => (event) =>
    setRegisterForm((current) => ({ ...current, [field]: event.target.value }))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="Đóng cửa sổ đăng nhập"
        className="auth-backdrop-enter absolute inset-0 bg-slate-950/65 backdrop-blur-[5px]"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="auth-modal-enter relative grid max-h-[calc(100vh-1.5rem)] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_-20px_rgba(4,19,47,0.5)] md:grid-cols-[0.88fr_1.12fr] sm:max-h-[calc(100vh-3rem)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-all hover:rotate-90 hover:bg-slate-50 hover:text-slate-800"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative hidden overflow-hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=1300&fit=crop"
            alt="Không gian sống cao cấp tại Hà Nội"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031944]/95 via-[#0648b1]/48 to-transparent" />
          <div className="absolute left-7 top-7 flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Đặc quyền thành viên
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-md">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="mb-2 text-2xl font-bold leading-snug">Khám phá ngôi nhà xứng tầm tại Hà Nội</p>
            <p className="text-sm leading-relaxed text-blue-100">
              Thông tin được xác minh, lịch xem linh hoạt và hỗ trợ từ môi giới chuyên nghiệp.
            </p>
          </div>
        </div>

        <div className="min-h-0 flex flex-col bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-16 sm:px-8 md:px-9 md:pt-7">
          <div className="md:hidden mb-5 flex items-center gap-3 rounded-2xl bg-blue-50 p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v2m6-2v2m0-2c0-1.657 1.343-3 3-3s3 1.343 3 3v2M5 13h14v8H5v-8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-primary">Quyền truy cập thành viên RentFlow</p>
          </div>

          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-container">
            RentFlow Member
          </span>
          <h2 id="auth-modal-title" className="mt-3 text-2xl font-bold leading-tight text-on-surface sm:text-[28px]">
            Đăng nhập để xem đầy đủ thông tin
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Trở thành thành viên để xem chi tiết bất động sản và đặt lịch xem thực tế.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MEMBER_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2">
                <svg className="h-4 w-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => selectTab('login')}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:bg-orange-600'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary-container/30 hover:bg-blue-50'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => selectTab('register')}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:bg-orange-600'
                  : 'border border-primary-container/25 bg-white text-primary-container hover:-translate-y-0.5 hover:bg-blue-50'
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="mt-4 space-y-3">
              {error && (
                <div className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
                  {error}
                </div>
              )}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-on-surface placeholder:text-slate-400 transition focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Mật khẩu</span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-sm text-on-surface placeholder:text-slate-400 transition focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-primary-container"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary-container py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập an toàn'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="mt-5 space-y-3">
              {error && (
                <div className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'CHU_NHA', label: 'Chủ nhà' },
                  { value: 'KHACH_THUE', label: 'Khách thuê' },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setRegisterForm((current) => ({ ...current, role: role.value }))}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      registerForm.role === role.value
                        ? 'border-primary-container bg-blue-50 text-primary-container'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={registerForm.hoTen}
                  onChange={updateRegisterForm('hoTen')}
                  placeholder="Họ và tên *"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={updateRegisterForm('email')}
                  placeholder="Email *"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <input
                type="tel"
                value={registerForm.soDienThoai}
                onChange={updateRegisterForm('soDienThoai')}
                placeholder="Số điện thoại (không bắt buộc)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.password}
                    onChange={updateRegisterForm('password')}
                    placeholder="Mật khẩu *"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-container"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerForm.confirmPassword}
                    onChange={updateRegisterForm('confirmPassword')}
                    placeholder="Xác nhận mật khẩu *"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm focus:border-primary-container focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-container"
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary-container py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Đang đăng ký...' : 'Tạo tài khoản miễn phí'}
              </button>
            </form>
          )}

          <div className="mb-4 mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            Hoặc tiếp tục với
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <button type="button" className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 01-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
                  <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1-3.8 1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0012 23z" />
                  <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 010-4.2V7.1H2.2a11 11 0 000 9.8l3.6-2.8z" />
                  <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A10.4 10.4 0 0012 1 11 11 0 002.2 7.1l3.6 2.8c.9-2.6 3.3-4.5 6.2-4.5z" />
                </svg>
                Đăng nhập bằng Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                </svg>
                Đăng nhập bằng Facebook
              </button>
            </div>
          </div>

          </div>

          <div className="shrink-0 border-t border-slate-100 bg-white px-5 pb-5 pt-3 sm:px-8 sm:pb-6 md:px-9">
            <p className="text-center text-xs text-slate-500">
              Việc đăng ký chỉ mất chưa tới 1 phút.{' '}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-md px-1.5 py-1 font-semibold text-primary-container transition hover:bg-blue-50 hover:text-primary hover:underline"
              >
                Tiếp tục xem với quyền khách
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
