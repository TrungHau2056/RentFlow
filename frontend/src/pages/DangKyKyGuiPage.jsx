import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const STEPS = [
  { id: 1, title: 'Thông tin cơ bản', icon: 'document' },
  { id: 2, title: 'Địa chỉ', icon: 'location' },
  { id: 3, title: 'Mô tả & Tiện ích', icon: 'features' },
  { id: 4, title: 'Hình ảnh', icon: 'image' },
  { id: 5, title: 'Xác nhận', icon: 'check' },
]

const PROPERTY_TYPES = [
  { id: 'can_ho', label: 'Căn hộ', icon: 'building' },
  { id: 'nha_rieng', label: 'Nhà riêng', icon: 'home' },
  { id: 'biet_thu', label: 'Biệt thự', icon: 'villa' },
  { id: 'kios', label: 'Kios thương mại', icon: 'shop' },
  { id: 'phong_tro', label: 'Phòng trọ', icon: 'room' },
  { id: 'nha_pho', label: 'Nhà phố', icon: 'townhouse' },
]

const DISTRICTS_BY_CITY = {
  HN: [
    'Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Tây Hồ',
    'Cầu Giấy', 'Thanh Xuân', 'Hà Đông', 'Long Biên', 'Nam Từ Liêm',
    'Bắc Từ Liêm', 'Hoàng Mai', 'Gia Lâm', 'Đan Phượng', 'Hoài Đức',
    'Mê Linh', 'Phúc Thọ', 'Quốc Oai', 'Sóc Sơn', 'Thanh Trì',
    'Thạch Thất', 'Thường Tín', 'Sơn Tây', 'Ba Vì', 'Chương Mỹ',
    'Đông Anh', 'Phú Xuyên', 'Thanh Oai', 'Ứng Hòa', 'Mỹ Đức',
  ],
  'TP.HCM': [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7',
    'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Bình Thạnh',
    'Gò Vấp', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Bình Tân', 'Thủ Đức',
    'Bình Chánh', 'Hóc Môn', 'Củ Chi', 'Nhà Bè', 'Cần Giờ',
  ],
  DN: [
    'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn',
    'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang', 'Hoàng Sa',
  ],
}

const DIRECTIONS = [
  'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc', 'Bắc', 'Đông Bắc'
]

const AMENITIES = [
  { id: 'may_lanh', label: 'Máy lạnh', icon: '❄️' },
  { id: 'noi_that', label: 'Nội thất đầy đủ', icon: '🛋️' },
  { id: 'may_giat', label: 'Máy giặt', icon: '🧺' },
  { id: 'tu_lanh', label: 'Tủ lạnh', icon: '🧊' },
  { id: 'truyen_hinh', label: 'Truyền hình cáp', icon: '📺' },
  { id: 'internet', label: 'Internet/WiFi', icon: '📶' },
  { id: 'ho_boi', label: 'Hồ bơi', icon: '🏊' },
  { id: 'gym', label: 'Phòng gym', icon: '💪' },
  { id: 'bao_ve', label: 'Bảo vệ 24/7', icon: '👮' },
  { id: 'thang_may', label: 'Thang máy', icon: '🛗' },
  { id: 'cho_xe', label: 'Chỗ để xe', icon: '🚗' },
  { id: 'san_vuon', label: 'Sân vườn', icon: '🌳' },
]

const NEARBY_FEATURES = [
  { id: 'truong_hoc', label: 'Gần trường học', icon: '🏫' },
  { id: 'benh_vien', label: 'Gần bệnh viện', icon: '🏥' },
  { id: 'sieu_thi', label: 'Gần siêu thị', icon: '🛒' },
  { id: 'cong_vien', label: 'Gần công viên', icon: '🌳' },
  { id: 'metro', label: 'Gần metro', icon: '🚇' },
  { id: 'nha_hang', label: 'Gần nhà hàng', icon: '🍽️' },
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
    camera: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    ),
    chevronLeft: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    ),
    chevronRight: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    success: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function PropertyTypeCard({ type, selected, onSelect }) {
  const icons = {
    building: '🏢',
    home: '🏠',
    villa: '🏡',
    shop: '🏪',
    room: '🚪',
    townhouse: '🏘️',
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(type.id)}
      className={`group flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
        selected === type.id
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <span className="text-4xl">{icons[type.icon]}</span>
      <span className={`text-sm font-medium ${
        selected === type.id ? 'text-blue-600' : 'text-slate-600'
      }`}>
        {type.label}
      </span>
    </button>
  )
}

function ImageUploadZone({ images, onUpload, onRemove }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const newImages = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      url: null,
      name: `image-${Date.now()}-${i}.jpg`,
    }))
    onUpload(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-8 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <FormIcon icon="upload" className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-base font-semibold text-slate-700">
            Kéo thả hình ảnh vào đây
          </p>
          <p className="mt-1 text-sm text-slate-500">
            hoặc click để chọn file (tối đa 20 ảnh)
          </p>
          <button
            type="button"
            onClick={() => onUpload([{ id: Date.now(), url: null, name: 'image.jpg' }])}
            className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Chọn hình ảnh
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              {image.url ? (
                <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FormIcon icon="camera" className="h-8 w-8 text-slate-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onRemove(image.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  <FormIcon icon="trash" className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                <p className="truncate text-[10px] text-white">{image.name}</p>
              </div>
            </div>
          ))}

          {images.length < 20 && (
            <button
              type="button"
              onClick={() => onUpload([{ id: Date.now(), url: null, name: 'new-image.jpg' }])}
              className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50"
            >
              <FormIcon icon="plus" className="h-8 w-8 text-slate-400" />
              <span className="mt-2 text-xs text-slate-500">Thêm ảnh</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function SuccessScreen({ formData, onBack, requestCode }) {
  const timeline = [
    { stage: 'Tiếp nhận', status: 'pending', desc: 'Nhân viên sẽ liên hệ trong 24h' },
    { stage: 'Khảo sát', status: 'pending', desc: 'Khảo sát thực tế BĐS' },
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
          Mã yêu cầu: <span className="font-mono font-bold text-slate-700">{requestCode}</span>
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Thông tin đăng ký</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Loại bất động sản</span>
            <span className="font-medium text-slate-900">
              {PROPERTY_TYPES.find(t => t.id === formData.loaiNha)?.label || '-'}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Tên BĐS</span>
            <span className="font-medium text-slate-900">{formData.tenBds || '-'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Địa chỉ</span>
            <span className="font-medium text-slate-900">
              {formData.diaChi}, {formData.quanHuyen}, {formData.thanhPho === 'HN' ? 'Hà Nội' : formData.thanhPho === 'TP.HCM' ? 'TP.HCM' : 'Đà Nẵng'}
            </span>
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
  const [requestCode, setRequestCode] = useState('')
  const [formData, setFormData] = useState({
    loaiNha: '',
    tenBds: '',
    dienTich: '',
    giaThue: '',
    soPhongNgu: '',
    soWC: '',
    huongNha: '',
    thanhPho: 'HN',
    quanHuyen: '',
    phuongXa: '',
    diaChi: '',
    moTa: '',
    noiThat: [],
    tienIch: [],
    khuVucXungQuanh: [],
    hinhAnh: [],
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

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const [stepErrors, setStepErrors] = useState({})

  const validateStep = (step) => {
    const errors = {}
    if (step === 1) {
      if (!formData.loaiNha) errors.loaiNha = 'Vui lòng chọn loại bất động sản'
      if (!formData.tenBds.trim()) errors.tenBds = 'Vui lòng nhập tên bất động sản'
      if (!formData.dienTich) errors.dienTich = 'Vui lòng nhập diện tích'
      if (!formData.giaThue) errors.giaThue = 'Vui lòng nhập giá thuê'
    }
    if (step === 2) {
      if (!formData.quanHuyen) errors.quanHuyen = 'Vui lòng chọn quận/huyện'
      if (!formData.diaChi.trim()) errors.diaChi = 'Vui lòng nhập địa chỉ chi tiết'
    }
    return errors
  }

  const nextStep = () => {
    const errors = validateStep(currentStep)
    setStepErrors(errors)
    if (Object.keys(errors).length > 0) return
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    if (!formData.chapNhanDieuKhoan) return
    setRequestCode(`REQ-${Date.now().toString().slice(-6)}`)
    setSubmitted(true)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Loại bất động sản</h3>
              <p className="text-sm text-slate-500">Chọn loại hình bất động sản phù hợp</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {PROPERTY_TYPES.map(type => (
                <PropertyTypeCard
                  key={type.id}
                  type={type}
                  selected={formData.loaiNha}
                  onSelect={(id) => updateField('loaiNha', id)}
                />
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tên bất động sản
                </label>
                <input
                  type="text"
                  value={formData.tenBds}
                  onChange={(e) => updateField('tenBds', e.target.value)}
                  placeholder="Ví dụ: Căn hộ 2PN Vinhomes Golden River"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Diện tích (m²)
                </label>
                <input
                  type="number"
                  value={formData.dienTich}
                  onChange={(e) => updateField('dienTich', e.target.value)}
                  placeholder="75"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Giá thuê đề xuất (triệu/tháng)
                </label>
                <input
                  type="number"
                  value={formData.giaThue}
                  onChange={(e) => updateField('giaThue', e.target.value)}
                  placeholder="18"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Số phòng ngủ
                </label>
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Số WC
                </label>
                <select
                  value={formData.soWC}
                  onChange={(e) => updateField('soWC', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Chọn</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} phòng</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Hướng nhà
                </label>
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
              <h3 className="text-lg font-bold text-slate-900">Địa chỉ bất động sản</h3>
              <p className="text-sm text-slate-500">Nhập thông tin địa chỉ chính xác</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Thành phố
                </label>
                <select
                  value={formData.thanhPho}
                  onChange={(e) => { updateField('thanhPho', e.target.value); updateField('quanHuyen', '') }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="HN">Hà Nội</option>
                  <option value="TP.HCM">TP. Hồ Chí Minh</option>
                  <option value="DN">Đà Nẵng</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quận/Huyện
                </label>
                <select
                  value={formData.quanHuyen}
                  onChange={(e) => updateField('quanHuyen', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Chọn quận/huyện</option>
                  {(DISTRICTS_BY_CITY[formData.thanhPho] || []).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phường/Xã
                </label>
                <input
                  type="text"
                  value={formData.phuongXa}
                  onChange={(e) => updateField('phuongXa', e.target.value)}
                  placeholder="Nhập phường/xã"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => updateField('diaChi', e.target.value)}
                  placeholder="Số nhà, tên đường"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                  <FormIcon icon="location" className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-500">Bản đồ sẽ hiển thị ở đây</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mô tả & Tiện ích</h3>
              <p className="text-sm text-slate-500">Cung cấp thông tin chi tiết về BĐS</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mô tả chi tiết
              </label>
              <textarea
                value={formData.moTa}
                onChange={(e) => updateField('moTa', e.target.value)}
                placeholder="Mô tả đặc điểm nổi bật, tình trạng nhà,..."
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Nội thất & Tiện ích
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {AMENITIES.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleArrayField('noiThat', item.id)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition ${
                      formData.noiThat.includes(item.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Khu vực xung quanh
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {NEARBY_FEATURES.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleArrayField('khuVucXungQuanh', item.id)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition ${
                      formData.khuVucXungQuanh.includes(item.id)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Hình ảnh bất động sản</h3>
              <p className="text-sm text-slate-500">Upload hình ảnh rõ nét để thu hút khách thuê</p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <FormIcon icon="info" className="h-5 w-5 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-700">
                  <p className="font-semibold">Hướng dẫn upload ảnh:</p>
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    <li>Ảnh rõ nét, ánh sáng tốt</li>
                    <li>Chụp đầy đủ các phòng</li>
                    <li>Include mặt bằng nếu có</li>
                    <li>Tối đa 20 ảnh</li>
                  </ul>
                </div>
              </div>
            </div>

            <ImageUploadZone
              images={formData.hinhAnh}
              onUpload={(newImages) => updateField('hinhAnh', [...formData.hinhAnh, ...newImages])}
              onRemove={(id) => updateField('hinhAnh', formData.hinhAnh.filter(img => img.id !== id))}
            />
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Xác nhận thông tin</h3>
              <p className="text-sm text-slate-500">Kiểm tra lại thông tin trước khi gửi</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <FormIcon icon={PROPERTY_TYPES.find(t => t.id === formData.loaiNha)?.icon || 'building'} className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{formData.tenBds || 'Chưa đặt tên'}</h4>
                  <p className="text-xs text-slate-500">
                    {PROPERTY_TYPES.find(t => t.id === formData.loaiNha)?.label || 'Loại nhà'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ</span>
                  <span className="font-medium text-slate-900">
                    {formData.diaChi || '-'}, {formData.quanHuyen || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diện tích</span>
                  <span className="font-medium text-slate-900">{formData.dienTich || '-'} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Giá thuê</span>
                  <span className="font-bold text-blue-600">{formData.giaThue || '-'} triệu/tháng</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phòng ngủ / WC</span>
                  <span className="font-medium text-slate-900">
                    {formData.soPhongNgu || '-'} / {formData.soWC || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hướng</span>
                  <span className="font-medium text-slate-900">{formData.huongNha || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nội thất</span>
                  <span className="font-medium text-slate-900">{formData.noiThat.length} mục</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiện ích xung quanh</span>
                  <span className="font-medium text-slate-900">{formData.khuVucXungQuanh.length} mục</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hình ảnh</span>
                  <span className="font-medium text-slate-900">{formData.hinhAnh.length} ảnh</span>
                </div>
              </div>
            </div>

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
          <SuccessScreen formData={formData} requestCode={requestCode} onBack={() => navigate('/dashboard')} />
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
              disabled={currentStep === 1}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FormIcon icon="chevronLeft" className="h-4 w-4" />
              Quay lại
            </button>

            {currentStep < 5 ? (
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
                disabled={!formData.chapNhanDieuKhoan}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FormIcon icon="check" className="h-4 w-4" />
                Gửi yêu cầu ký gửi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
