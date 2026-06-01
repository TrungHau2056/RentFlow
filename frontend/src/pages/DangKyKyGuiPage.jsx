import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import batDongSanService from '../services/batDongSanService'

const STEPS = [
  { id: 1, title: 'Thông tin cơ bản', icon: 'document' },
  { id: 2, title: 'Địa chỉ & Giá', icon: 'location' },
  { id: 3, title: 'Mô tả & Xác nhận', icon: 'check' },
]

const PROPERTY_TYPES = [
  { id: 'can_ho', label: 'Căn hộ', icon: 'building' },
  { id: 'nha_rieng', label: 'Nhà riêng', icon: 'home' },
  { id: 'biet_thu', label: 'Biệt thự', icon: 'villa' },
  { id: 'kios', label: 'Kios thương mại', icon: 'shop' },
  { id: 'phong_tro', label: 'Phòng trọ', icon: 'room' },
  { id: 'nha_pho', label: 'Nhà phố', icon: 'townhouse' },
]

const DIRECTIONS = [
  'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc', 'Bắc', 'Đông Bắc'
]

function FormIcon({ type, className = "h-5 w-5" }) {
  const icons = {
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    location: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    ),
    features: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    ),
    image: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
    building: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    ),
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    ),
    villa: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6a2 2 0 012-2h2a2 2 0 012 2v6h3a1 1 0 001-1v-3a1 1 0 00-1-1H5a1 1 0 00-1 1v3a1 1 0 001 1z" />
    ),
    shop: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    ),
    room: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    ),
    townhouse: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    ),
    upload: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    success: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    chevronLeft: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    ),
    chevronRight: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    ),
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[type] || icons.document}
    </svg>
  )
}

function StepIndicator({ currentStep, steps }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isCurrent
                      ? 'border-blue-600 bg-blue-600 text-white scale-110'
                      : 'border-slate-200 bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <FormIcon icon="check" className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium hidden lg:block ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="mx-2 hidden h-0.5 w-16 lg:block">
                  <div
                    className={`h-full rounded-full transition-all ${
                      step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SuccessScreen({ formData, batDongSanId, onBack }) {
  const timeline = [
    { stage: 'Tiếp nhận', status: 'done', desc: 'Yêu cầu đã được ghi nhận' },
    { stage: 'Khảo sát', status: 'pending', desc: 'Nhân viên sẽ liên hệ trong 24h' },
    { stage: 'Ký hợp đồng', status: 'pending', desc: 'Ký hợp đồng ký gửi chính thức' },
    { stage: 'Hiển thị cho thuê', status: 'pending', desc: 'Đăng tin và tìm khách thuê' },
  ]

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <FormIcon icon="success" className="h-12 w-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Yêu cầu ký gửi đã được gửi thành công!
        </h2>
        <p className="mt-2 text-slate-500">
          Mã BĐS: <span className="font-mono font-bold text-slate-700">#{batDongSanId}</span>
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Thông tin đăng ký</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Loại bất động sản</span>
            <span className="font-medium text-slate-900">{formData.loaiNha || '-'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Địa chỉ</span>
            <span className="font-medium text-slate-900">{formData.diaChi || '-'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Diện tích</span>
            <span className="font-medium text-slate-900">{formData.dienTich || '-'} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Giá thuê đề xuất</span>
            <span className="font-bold text-blue-600">{formData.giaThue || 0} triệu/tháng</span>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Quy trình xử lý</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200" />
          {timeline.map((item, index) => (
            <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0">
              <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                index === 0 ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'
              }`}>
                {index === 0 && (
                  <FormIcon icon="check" className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  index === 0 ? 'text-emerald-600' : 'text-slate-600'
                }`}>
                  {item.stage}
                </p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Về trang quản lý
        </button>
        <Link
          to="/dashboard/bat-dong-san"
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
        >
          Xem danh sách BĐS
        </Link>
      </div>
    </div>
  )
}

function readStoredUser() {
  const stored = localStorage.getItem('userInfo')
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem('userInfo')
    return null
  }
}

export default function DangKyKyGuiPage() {
  const navigate = useNavigate()
  const [userInfo] = useState(readStoredUser)
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [batDongSanId, setBatDongSanId] = useState(null)
  const [formData, setFormData] = useState({
    loaiNha: '',
    dienTich: '',
    soPhongNgu: '',
    soPhongVeSinh: '',
    huongNha: '',
    diaChi: '',
    giaThue: '',
    giaDeXuat: '',
    moTa: '',
    chapNhanDieuKhoan: false,
  })

  if (!userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/40">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-on-surface">Vui lòng đăng nhập</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Chức năng đăng ký ký gửi nhà chỉ dành cho tài khoản chủ nhà.
          </p>
          <Link to="/login" className="mt-6 inline-flex rounded-xl bg-primary-container px-6 py-3 text-sm font-semibold text-white hover:bg-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  if (userInfo.role !== 'CHU_NHA') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/40">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-on-surface">Không có quyền truy cập</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Chức năng đăng ký ký gửi nhà chỉ dành cho chủ nhà. Tài khoản hiện tại không thể thực hiện thao tác này.
          </p>
          <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary-container px-6 py-3 text-sm font-semibold text-white hover:bg-primary">
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const [stepErrors, setStepErrors] = useState({})

  const validateStep = (step) => {
    const errors = {}
    if (step === 1) {
      if (!formData.loaiNha) errors.loaiNha = 'Vui lòng chọn loại bất động sản'
      if (!formData.dienTich) errors.dienTich = 'Vui lòng nhập diện tích'
    }
    if (step === 2) {
      if (!formData.diaChi.trim()) errors.diaChi = 'Vui lòng nhập địa chỉ'
      if (!formData.giaThue) errors.giaThue = 'Vui lòng nhập giá thuê'
    }
    return errors
  }

  const nextStep = () => {
    const errors = validateStep(currentStep)
    setStepErrors(errors)
    if (Object.keys(errors).length > 0) return
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!formData.chapNhanDieuKhoan) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const taoRes = await batDongSanService.tao({
        diaChi: formData.diaChi,
        dienTich: Number(formData.dienTich),
        giaThue: Number(formData.giaThue) * 1000000,
        moTa: formData.moTa,
      })
      const bdsId = taoRes.data.id

      await batDongSanService.capNhatChiTiet(bdsId, {
        loaiNha: formData.loaiNha,
        huong: formData.huongNha || null,
        soPhongNgu: formData.soPhongNgu ? Number(formData.soPhongNgu) : null,
        soPhongVeSinh: formData.soPhongVeSinh ? Number(formData.soPhongVeSinh) : null,
        giaDeXuat: formData.giaDeXuat ? Number(formData.giaDeXuat) * 1000000 : null,
      })

      setBatDongSanId(bdsId)
      setSubmitted(true)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Thông tin cơ bản</h3>
              <p className="text-sm text-slate-500">Chọn loại hình và thông số bất động sản</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Loại bất động sản</label>
              <select
                value={formData.loaiNha}
                onChange={(e) => updateField('loaiNha', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Chọn loại</option>
                {PROPERTY_TYPES.map(t => (
                  <option key={t.id} value={t.label}>{t.label}</option>
                ))}
              </select>
              {stepErrors.loaiNha && <p className="mt-1 text-xs text-red-500">{stepErrors.loaiNha}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Diện tích (m²)</label>
                <input
                  type="number"
                  value={formData.dienTich}
                  onChange={(e) => updateField('dienTich', e.target.value)}
                  placeholder="80"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                {stepErrors.dienTich && <p className="mt-1 text-xs text-red-500">{stepErrors.dienTich}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Số phòng ngủ</label>
                <select
                  value={formData.soPhongNgu}
                  onChange={(e) => updateField('soPhongNgu', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Chọn</option>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} phòng</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Số phòng vệ sinh</label>
                <select
                  value={formData.soPhongVeSinh}
                  onChange={(e) => updateField('soPhongVeSinh', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Chọn</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} phòng</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Hướng nhà</label>
                <select
                  value={formData.huongNha}
                  onChange={(e) => updateField('huongNha', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Chọn hướng</option>
                  {DIRECTIONS.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Địa chỉ & Giá</h3>
              <p className="text-sm text-slate-500">Nhập địa chỉ và mức giá cho thuê</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ</label>
              <input
                type="text"
                value={formData.diaChi}
                onChange={(e) => updateField('diaChi', e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
              {stepErrors.diaChi && <p className="mt-1 text-xs text-red-500">{stepErrors.diaChi}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Giá thuê (triệu/tháng)</label>
                <input
                  type="number"
                  value={formData.giaThue}
                  onChange={(e) => updateField('giaThue', e.target.value)}
                  placeholder="15"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                {stepErrors.giaThue && <p className="mt-1 text-xs text-red-500">{stepErrors.giaThue}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Giá đề xuất (triệu)</label>
                <input
                  type="number"
                  value={formData.giaDeXuat}
                  onChange={(e) => updateField('giaDeXuat', e.target.value)}
                  placeholder="15"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mô tả & Xác nhận</h3>
              <p className="text-sm text-slate-500">Thêm mô tả và xác nhận gửi yêu cầu</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Mô tả chi tiết</label>
              <textarea
                value={formData.moTa}
                onChange={(e) => updateField('moTa', e.target.value)}
                placeholder="Mô tả đặc điểm nổi bật, tình trạng nhà, tiện ích khu vực..."
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-4 font-bold text-slate-900">Thông tin đã nhập</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Loại BĐS</span>
                  <span className="font-medium text-slate-900">{formData.loaiNha || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diện tích</span>
                  <span className="font-medium text-slate-900">{formData.dienTich || '-'} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phòng ngủ / VS</span>
                  <span className="font-medium text-slate-900">
                    {formData.soPhongNgu || '-'} / {formData.soPhongVeSinh || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hướng</span>
                  <span className="font-medium text-slate-900">{formData.huongNha || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ</span>
                  <span className="font-medium text-slate-900">{formData.diaChi || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Giá thuê</span>
                  <span className="font-bold text-blue-600">{formData.giaThue || '-'} triệu/tháng</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Giá đề xuất</span>
                  <span className="font-medium text-slate-900">{formData.giaDeXuat || '-'} triệu</span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">{submitError}</p>
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={formData.chapNhanDieuKhoan}
                onChange={(e) => updateField('chapNhanDieuKhoan', e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">
                Tôi đồng ý với{' '}
                <a href="#" className="font-semibold text-blue-600 hover:underline">
                  Điều khoản ký gửi
                </a>{' '}
                của RentFlow và cam kết thông tin cung cấp là chính xác.
              </span>
            </label>
          </div>
        )

      default:
        return null
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl p-6">
          <Link
            to="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <FormIcon icon="chevronLeft" className="h-4 w-4" />
            Về dashboard
          </Link>
          <SuccessScreen formData={formData} batDongSanId={batDongSanId} onBack={() => navigate('/dashboard')} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl p-6">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <FormIcon icon="chevronLeft" className="h-4 w-4" />
          Về dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Đăng ký ký gửi nhà</h1>
          <p className="mt-1 text-sm text-slate-500">
            Điền thông tin để đăng ký ký gửi bất động sản cho đại lý
          </p>
        </div>

        <StepIndicator currentStep={currentStep} steps={STEPS} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {renderStep()}

          <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || submitting}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FormIcon icon="chevronLeft" className="h-4 w-4" />
              Quay lại
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
              >
                Tiếp tục
                <FormIcon icon="chevronRight" className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.chapNhanDieuKhoan || submitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FormIcon icon="check" className="h-4 w-4" />
                    Gửi yêu cầu ký gửi
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
