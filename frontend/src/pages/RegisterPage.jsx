import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import { isInternalAdminRole } from '../config/roles'
import { extractUserFromJwt } from '../utils/jwt'
import api from '../services/api'

const ROLES = [
  { value: 'CHU_NHA', label: 'Chủ nhà', desc: 'Ký gửi bất động sản cho thuê' },
  { value: 'KHACH_THUE', label: 'Khách thuê', desc: 'Tìm kiếm bất động sản thuê' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('CHU_NHA')
  const [form, setForm] = useState({ hoTen: '', email: '', soDienThoai: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.hoTen.trim()) { setError('Vui lòng nhập họ tên'); return }
    if (!form.email.trim()) { setError('Vui lòng nhập email'); return }
    if (!form.password) { setError('Vui lòng nhập mật khẩu'); return }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return }
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }

    setLoading(true)
    try {
      const res = await api.post('/api/auth/register', {
        hoTen: form.hoTen,
        email: form.email,
        soDienThoai: form.soDienThoai || undefined,
        password: form.password,
        vaiTro: role,
      })
      const { accessToken, refreshToken } = res.data.data
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

      const userInfo = extractUserFromJwt(accessToken, form.email)
      if (userInfo) {
        userInfo.hoTen = form.hoTen
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }

      if (isInternalAdminRole(role)) navigate('/admin')
      else if (role === 'CHU_NHA') navigate('/dashboard')
      else navigate('/')
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-semibold text-on-surface">Đăng ký</h2>
        <p className="mt-2 text-on-surface-variant text-sm leading-relaxed">
          Tạo tài khoản để bắt đầu sử dụng RentFlow
        </p>
      </div>

      {/* Role selector */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            className={`rounded-lg border-2 p-4 text-left transition-all ${
              role === r.value
                ? 'border-primary-container bg-surface-container'
                : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
            }`}
          >
            <span className={`text-sm font-semibold ${role === r.value ? 'text-primary-container' : 'text-on-surface'}`}>
              {r.label}
            </span>
            <span className="block mt-1 text-xs text-on-surface-variant leading-snug">
              {r.desc}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-md bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="hoTen" className="block text-sm font-medium text-on-surface mb-1.5">
            Họ và tên
          </label>
          <input
            id="hoTen"
            type="text"
            value={form.hoTen}
            onChange={update('hoTen')}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="example@email.com"
            autoComplete="email"
            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="soDienThoai" className="block text-sm font-medium text-on-surface mb-1.5">
            Số điện thoại <span className="text-outline font-normal">(không bắt buộc)</span>
          </label>
          <input
            id="soDienThoai"
            type="tel"
            value={form.soDienThoai}
            onChange={update('soDienThoai')}
            placeholder="0901234567"
            autoComplete="tel"
            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="Ít nhất 6 ký tự"
              autoComplete="new-password"
              className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-12 text-on-surface placeholder:text-outline transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface mb-1.5">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-12 text-on-surface placeholder:text-outline transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
            >
              {showConfirm ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-on-surface-variant">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-semibold text-primary-container hover:text-primary transition-colors">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  )
}