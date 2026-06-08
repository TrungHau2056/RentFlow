import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import khachHangService from '../services/khachHangService'

const DISTRICTS = [
  'Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Tây Hồ',
  'Cầu Giấy', 'Thanh Xuân', 'Hà Đông', 'Long Biên', 'Nam Từ Liêm',
  'Bắc Từ Liêm', 'Hoàng Mai', 'Gia Lâm', 'Hoài Đức', 'Mê Linh',
  'Sóc Sơn', 'Thanh Trì', 'Thạch Thất', 'Đông Anh', 'Chương Mỹ',
]

const PROPERTY_TYPES = [
  { id: 'can_ho', label: 'Căn hộ' },
  { id: 'nha_pho', label: 'Nhà phố' },
  { id: 'nha_rieng', label: 'Nhà riêng' },
  { id: 'phong_tro', label: 'Phòng trọ' },
  { id: 'studio', label: 'Studio' },
  { id: 'duplex', label: 'Duplex' },
]

const FURNITURE_OPTIONS = [
  { id: 'full', label: 'Đầy đủ' },
  { id: 'co_ban', label: 'Cơ bản' },
  { id: 'khong', label: 'Không nội thất' },
]

const GENDERS = [
  { id: 'male', label: 'Nam' },
  { id: 'female', label: 'Nữ' },
  { id: 'other', label: 'Khác' },
]

const MOCK_USER = {
  id: 1,
  hoTen: 'Lê Văn Thuê',
  email: 'khachthue@rentflow.vn',
  soDienThoai: '0901 234 567',
  ngaySinh: '1990-05-15',
  gioiTinh: 'male',
  diaChi: '123 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội',
  avatar: null,
  memberSince: '2025-01-15',
  membershipLevel: 'Premium',
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: false,
}

const MOCK_PREFERENCES = {
  districts: ['Cầu Giấy', 'Thanh Xuân', 'Tây Hồ'],
  minPrice: 15,
  maxPrice: 30,
  propertyTypes: ['can_ho', 'studio'],
  minArea: 50,
  maxArea: 100,
  minBedrooms: 2,
  furniture: ['full', 'co_ban'],
}

const MOCK_ACTIVITY = {
  savedProperties: 12,
  scheduledViewings: 3,
  activeContracts: 2,
  unreadNotifications: 5,
}

const MOCK_DEVICES = [
  { id: 1, name: 'MacBook Pro - Chrome', location: 'TP.HCM', lastActive: '2026-05-25T10:30:00', current: true },
  { id: 2, name: 'iPhone 14 - Safari', location: 'TP.HCM', lastActive: '2026-05-24T18:45:00', current: false },
  { id: 3, name: 'Windows PC - Firefox', location: 'Hà Nội', lastActive: '2026-05-20T09:15:00', current: false },
]

function ProfileIcon({ type, className = "h-5 w-5" }) {
  const icons = {
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21a8 8 0 00-16 0m12-13a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    mail: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 11h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    phone: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    location: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    ),
    heart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    ),
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 3h7l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5M9 13h6m-6 4h6" />
    ),
    bell: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />
    ),
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    camera: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    ),
    edit: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
    x: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ),
    chevronRight: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    ),
    logout: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4-4-4m4 4H9m4 8H6a2 2 0 01-2-2V6a2 2 0 012-2h7" />
    ),
    device: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[type] || icons.user}
    </svg>
  )
}

function ActivityCard({ icon, label, value, color }) {
  const bgGradients = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradients[color]} text-white`}>
          <ProfileIcon icon={icon} className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-lg font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        {label && <p className="text-sm font-medium text-slate-700">{label}</p>}
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function MultiSelect({ options, selected, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const removeOption = (id, e) => {
    e.stopPropagation()
    onChange(selected.filter(s => s !== id))
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        {selected.length === 0 ? (
          <span className="text-slate-400">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selected.map(s => {
              const opt = options.find(o => o.id === s || o === s)
              const label = typeof opt === 'string' ? opt : opt?.label || s
              return (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => removeOption(s, e)}
                    className="rounded p-0.5 hover:bg-blue-100"
                  >
                    <ProfileIcon icon="x" className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
        <svg className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
            {options.map(option => {
              const id = typeof option === 'string' ? option : option.id
              const label = typeof option === 'string' ? option : option.label
              const isSelected = selected.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { toggleOption(id); setIsOpen(false) }}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{label}</span>
                  {isSelected && <ProfileIcon icon="check" className="h-4 w-4" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function PriceSlider({ min, max, value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {min} - {max} triệu/tháng
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-slate-200">
        <div
          className="absolute h-full rounded-full bg-blue-600"
          style={{ left: `${(min / 50) * 100}%`, right: `${100 - (max / 50) * 100}%` }}
        />
        <input
          type="range"
          min="5"
          max="50"
          value={min}
          onChange={(e) => onChange({ ...value, min: parseInt(e.target.value) })}
          className="absolute h-full w-full cursor-pointer opacity-0"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>5 triệu</span>
        <span>50 triệu</span>
      </div>
    </div>
  )
}

function SuccessToast({ message, onClose, type = 'success' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-white shadow-2xl animate-in slide-in-from-bottom-4 ${
      type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
    }`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        <ProfileIcon icon={type === 'error' ? 'x' : 'check'} className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium">{message}</p>
      <button type="button" onClick={onClose} className="ml-2 rounded-lg p-1 hover:bg-white/20">
        <ProfileIcon icon="x" className="h-4 w-4" />
      </button>
    </div>
  )
}

function ChangePasswordModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <ProfileIcon icon="shield" className="h-7 w-7 text-blue-600" />
        </div>
        <h3 className="text-center text-xl font-bold text-slate-900">Đổi mật khẩu</h3>
        <p className="mt-1 text-center text-sm text-slate-500">Đảm bảo mật khẩu của bạn an toàn</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Hủy
            </button>
            <button type="submit" className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function TenantProfilePage() {
  const [user, setUser] = useState(MOCK_USER)
  const [preferences, setPreferences] = useState(MOCK_PREFERENCES)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingNhuCau, setSavingNhuCau] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [formData, setFormData] = useState({
    hoTen: user.hoTen,
    email: user.email,
    soDienThoai: user.soDienThoai,
    ngaySinh: user.ngaySinh,
    gioiTinh: user.gioiTinh,
    diaChi: user.diaChi,
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await khachHangService.me()
      const data = res.data
      setUser(prev => ({
        ...prev,
        id: data.id,
        hoTen: data.hoTen || prev.hoTen,
        email: data.email || prev.email,
        soDienThoai: data.soDienThoai || prev.soDienThoai,
      }))
      if (data.nhuCauThue) {
        try {
          const parsed = JSON.parse(data.nhuCauThue)
          setPreferences(prev => ({ ...prev, ...parsed }))
        } catch {
          // ignore, leave defaults
        }
      }
    } catch (err) {
      console.error('Failed to load tenant info:', err)
      setShowError(true)
      setErrorMessage('Không thể tải thông tin người dùng. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        ngaySinh: user.ngaySinh,
        gioiTinh: user.gioiTinh,
        diaChi: user.diaChi,
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setSavingProfile(true)
      await khachHangService.capNhat(user.id, {
        hoTen: formData.hoTen,
        soDienThoai: formData.soDienThoai,
        email: formData.email,
      })
      setUser(prev => ({ ...prev, ...formData }))
      setIsEditing(false)
      setShowToast(true)
      setShowError(false)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      console.error('Failed to save profile:', err)
      setShowError(true)
      setErrorMessage('Không thể lưu thông tin. Vui lòng thử lại sau.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      hoTen: user.hoTen,
      email: user.email,
      soDienThoai: user.soDienThoai,
      ngaySinh: user.ngaySinh,
      gioiTinh: user.gioiTinh,
      diaChi: user.diaChi,
    })
    setIsEditing(false)
  }

  const handleSaveNhuCau = async () => {
    try {
      setSavingNhuCau(true)
      await khachHangService.capNhatNhuCau(user.id, {
        nhuCauThue: JSON.stringify(preferences),
      })
      setShowToast(true)
      setShowError(false)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      console.error('Failed to save preferences:', err)
      setShowError(true)
      setErrorMessage('Không thể lưu sở thích. Vui lòng thử lại sau.')
    } finally {
      setSavingNhuCau(false)
    }
  }

  const handlePasswordSave = () => {
    setShowPasswordModal(false)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const initials = user?.hoTen?.split(' ')?.slice(-2)?.map(p => p[0])?.join('')?.toUpperCase() || '??'

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-slate-500">Đang tải thông tin...</p>
          </div>
        </div>
      ) : (<>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
        <p className="mt-1 text-sm text-slate-500">Quản lý thông tin cá nhân và tùy chỉnh nhu cầu thuê nhà</p>
      </div>

      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
              {initials}
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-600 shadow-lg transition hover:scale-110"
            >
              <ProfileIcon icon="camera" className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.hoTen}</h2>
            <p className="text-blue-100">{user.email}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold">
                {user.membershipLevel} Member
              </span>
              <span className="text-sm text-blue-100">
                Thành viên từ {formatDate(user.memberSince)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <ProfileIcon icon="edit" className="h-4 w-4" />
              {isEditing ? 'Xem hồ sơ' : 'Chỉnh sửa'}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ActivityCard icon="heart" label="Nhà đã lưu" value={MOCK_ACTIVITY.savedProperties} color="blue" />
        <ActivityCard icon="calendar" label="Lịch xem nhà" value={MOCK_ACTIVITY.scheduledViewings} color="amber" />
        <ActivityCard icon="document" label="Hợp đồng" value={MOCK_ACTIVITY.activeContracts} color="emerald" />
        <ActivityCard icon="bell" label="Thông báo" value={MOCK_ACTIVITY.unreadNotifications} color="purple" />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Info Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Thông tin cá nhân</h3>
              {isEditing && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  Đang chỉnh sửa
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ và tên</label>
                <div className="relative">
                  <ProfileIcon icon="user" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <ProfileIcon icon="mail" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                  {user.emailVerified && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                      <ProfileIcon icon="check" className="h-5 w-5" />
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</label>
                <div className="relative">
                  <ProfileIcon icon="phone" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                  {user.phoneVerified && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                      <ProfileIcon icon="check" className="h-5 w-5" />
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày sinh</label>
                <div className="relative">
                  <ProfileIcon icon="calendar" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={formData.ngaySinh}
                    onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Giới tính</label>
                <div className="relative">
                  <select
                    value={formData.gioiTinh}
                    onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                    disabled={!isEditing}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  >
                    {GENDERS.map(g => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Địa chỉ liên hệ</label>
                <div className="relative">
                  <ProfileIcon icon="location" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.diaChi}
                    onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    placeholder="Nhập địa chỉ liên hệ"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={savingProfile}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>

          {/* Preferences Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Nhu cầu thuê nhà</h3>
            <p className="mb-6 text-sm text-slate-500">
              Cập nhật nhu cầu để hệ thống gợi ý bất động sản phù hợp hơn
            </p>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Khu vực mong muốn</label>
                <MultiSelect
                  options={DISTRICTS}
                  selected={preferences.districts}
                  onChange={(districts) => setPreferences({ ...preferences, districts })}
                  placeholder="Chọn quận/huyện"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Khoảng giá</label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <PriceSlider
                    min={preferences.minPrice}
                    max={preferences.maxPrice}
                    value={{ min: preferences.minPrice, max: preferences.maxPrice }}
                    onChange={({ min }) => setPreferences({ ...preferences, minPrice: min })}
                  />
                  <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-slate-500">Từ</label>
                      <input
                        type="number"
                        value={preferences.minPrice}
                        onChange={(e) => setPreferences({ ...preferences, minPrice: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-slate-500">Đến</label>
                      <input
                        type="number"
                        value={preferences.maxPrice}
                        onChange={(e) => setPreferences({ ...preferences, maxPrice: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Loại nhà</label>
                <MultiSelect
                  options={PROPERTY_TYPES}
                  selected={preferences.propertyTypes}
                  onChange={(propertyTypes) => setPreferences({ ...preferences, propertyTypes })}
                  placeholder="Chọn loại nhà"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Diện tích (m²)</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={preferences.minArea}
                      onChange={(e) => setPreferences({ ...preferences, minArea: parseInt(e.target.value) || 0 })}
                      placeholder="Từ"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                    <input
                      type="number"
                      value={preferences.maxArea}
                      onChange={(e) => setPreferences({ ...preferences, maxArea: parseInt(e.target.value) || 0 })}
                      placeholder="Đến"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Số phòng ngủ</label>
                  <select
                    value={preferences.minBedrooms}
                    onChange={(e) => setPreferences({ ...preferences, minBedrooms: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="1">1+ phòng</option>
                    <option value="2">2+ phòng</option>
                    <option value="3">3+ phòng</option>
                    <option value="4">4+ phòng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Nội thất mong muốn</label>
                <MultiSelect
                  options={FURNITURE_OPTIONS}
                  selected={preferences.furniture}
                  onChange={(furniture) => setPreferences({ ...preferences, furniture })}
                  placeholder="Chọn tùy chọn nội thất"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setPreferences(MOCK_PREFERENCES)}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Đặt lại
              </button>
              <button
                type="button"
                onClick={handleSaveNhuCau}
                disabled={savingNhuCau}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingNhuCau ? 'Đang lưu...' : 'Lưu sở thích'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Security Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ProfileIcon icon="shield" className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Bảo mật</h3>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition hover:bg-slate-100"
              >
                <span className="font-medium text-slate-700">Đổi mật khẩu</span>
                <ProfileIcon icon="chevronRight" className="h-4 w-4 text-slate-400" />
              </button>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Toggle
                  label="Xác thực 2 lớp"
                  description="Sớm ra mắt"
                  checked={user.twoFactorEnabled}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          {/* Devices Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ProfileIcon icon="device" className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Thiết bị đăng nhập</h3>
            </div>

            <div className="space-y-3">
              {MOCK_DEVICES.map(device => (
                <div key={device.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                      <ProfileIcon icon="device" className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{device.name}</p>
                      <p className="text-xs text-slate-500">{device.location} · {formatDateRelative(device.lastActive)}</p>
                    </div>
                  </div>
                  {device.current && (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                      Hiện tại
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ProfileIcon icon="bell" className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Thông báo</h3>
            </div>

            <div className="divide-y divide-slate-100">
              <Toggle
                label="Email notification"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="SMS notification"
                checked={false}
                onChange={() => {}}
              />
              <Toggle
                label="Nhà mới phù hợp"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="Nhắc lịch xem nhà"
                checked={true}
                onChange={() => {}}
              />
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Gợi ý AI</h4>
                <p className="text-xs text-slate-500">Đề xuất nhà phù hợp</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Hệ thống sẽ đề xuất bất động sản phù hợp dựa trên hồ sơ và sở thích của bạn.
            </p>
            <Link
              to="/tenant/tim-nha"
              className="mt-4 block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 text-center text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
            >
              Khám phá ngay
            </Link>
          </div>

          {/* Logout */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <ProfileIcon icon="logout" className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Modals & Toasts */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordSave}
      />

      {showToast && (
        <SuccessToast
          message="Đã lưu thay đổi thành công"
          onClose={() => setShowToast(false)}
        />
      )}
      {showError && (
        <SuccessToast
          type="error"
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
      </>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateRelative(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  return formatDate(dateStr)
}
