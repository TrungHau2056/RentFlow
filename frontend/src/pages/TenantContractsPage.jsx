import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const CONTRACT_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Đang hiệu lực' },
  { id: 'expiring', label: 'Sắp hết hạn' },
  { id: 'ended', label: 'Đã kết thúc' },
  { id: 'pending', label: 'Chờ ký' },
]

const STATUS_CONFIG = {
  active: { label: 'Đang hiệu lực', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', badge: 'bg-gradient-to-r from-blue-500 to-blue-600' },
  expiring: { label: 'Sắp hết hạn', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', badge: 'bg-gradient-to-r from-amber-500 to-amber-600' },
  ended: { label: 'Đã kết thúc', color: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-500', badge: 'bg-gradient-to-r from-slate-400 to-slate-500' },
  pending: { label: 'Chờ ký', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', badge: 'bg-gradient-to-r from-purple-500 to-purple-600' },
}

const MOCK_CONTRACTS = [
  {
    id: 'HD-2026-001',
    code: 'HD-2026-001',
    propertyId: 1,
    propertyName: 'Căn hộ 2PN Vinhomes Metropolis',
    propertyImage: null,
    price: '18.000.000',
    priceUnit: '/tháng',
    address: 'Hoàn Kiếm, Hà Nội',
    area: '75m²',
    bedrooms: '2 PN',
    startDate: '2026-01-15',
    endDate: '2027-01-14',
    depositAmount: '36.000.000',
    paymentMethod: 'Chuyển khoản',
    paymentCycle: 'Hàng tháng',
    status: 'active',
    landlordName: 'Nguyễn Văn Cường',
    landlordPhone: '0901 234 567',
    brokerName: 'Trần Thị Hương',
    brokerPhone: '0912 345 678',
    brokerAvatar: null,
    terms: [
      'Thanh toán tiền nhà vào ngày 5 hàng tháng',
      'Tiền cọc tương đương 2 tháng tiền thuê',
      'Không được nuôi thú cưng',
      'Được phép sửa chữa nhỏ với sự đồng ý của chủ nhà',
      'Hợp đồng có gia hạn tự động nếu không có thông báo trước 30 ngày',
    ],
    payments: [
      { date: '2026-05-05', amount: '18.000.000', status: 'paid', note: 'Thanh toán tháng 5' },
      { date: '2026-04-05', amount: '18.000.000', status: 'paid', note: 'Thanh toán tháng 4' },
      { date: '2026-03-05', amount: '18.000.000', status: 'paid', note: 'Thanh toán tháng 3' },
      { date: '2026-02-05', amount: '18.000.000', status: 'paid', note: 'Thanh toán tháng 2' },
      { date: '2026-01-15', amount: '36.000.000', status: 'paid', note: 'Tiền cọc' },
    ],
    timeline: [
      { stage: 'placed', label: 'Đặt lịch xem', date: '2025-12-10', completed: true },
      { stage: 'negotiated', label: 'Đàm phán', date: '2025-12-20', completed: true },
      { stage: 'signed', label: 'Ký hợp đồng', date: '2026-01-05', completed: true },
      { stage: 'active', label: 'Đang thuê', date: '2026-01-15', completed: true },
      { stage: 'ended', label: 'Kết thúc', date: '2027-01-14', completed: false },
    ],
    createdAt: '2026-01-05',
  },
  {
    id: 'HD-2026-002',
    code: 'HD-2026-002',
    propertyId: 2,
    propertyName: 'Căn hộ 3PN Trung Hòa',
    propertyImage: null,
    price: '25.000.000',
    priceUnit: '/tháng',
    address: 'Thanh Xuân, Hà Nội',
    area: '90m²',
    bedrooms: '3 PN',
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    depositAmount: '50.000.000',
    paymentMethod: 'Chuyển khoản',
    paymentCycle: 'Hàng tháng',
    status: 'expiring',
    landlordName: 'Lê Thị Mai',
    landlordPhone: '0908 765 432',
    brokerName: 'Nguyễn Minh Tuấn',
    brokerPhone: '0901 234 567',
    brokerAvatar: null,
    terms: [
      'Thanh toán tiền nhà vào ngày 1 hàng tháng',
      'Tiền cọc tương đương 2 tháng tiền thuê',
      'Được phép nuôi chó mèo nhỏ',
      'Chủ nhà chịu trách nhiệm sửa chữa lớn',
      'Ưu tiên gia hạn hợp đồng',
    ],
    payments: [
      { date: '2026-05-01', amount: '25.000.000', status: 'paid', note: 'Thanh toán tháng 5' },
      { date: '2026-04-01', amount: '25.000.000', status: 'paid', note: 'Thanh toán tháng 4' },
      { date: '2026-03-01', amount: '25.000.000', status: 'paid', note: 'Thanh toán tháng 3' },
      { date: '2026-03-01', amount: '50.000.000', status: 'paid', note: 'Tiền cọc' },
    ],
    timeline: [
      { stage: 'placed', label: 'Đặt lịch xem', date: '2026-02-01', completed: true },
      { stage: 'negotiated', label: 'Đàm phán', date: '2026-02-10', completed: true },
      { stage: 'signed', label: 'Ký hợp đồng', date: '2026-02-20', completed: true },
      { stage: 'active', label: 'Đang thuê', date: '2026-03-01', completed: true },
      { stage: 'ended', label: 'Kết thúc', date: '2026-06-30', completed: false },
    ],
    createdAt: '2026-02-20',
  },
  {
    id: 'HD-2025-089',
    code: 'HD-2025-089',
    propertyId: 3,
    propertyName: 'Chung cư 3PN Keangnam Hanoi',
    propertyImage: null,
    price: '35.000.000',
    priceUnit: '/tháng',
    address: 'Tây Hồ, Hà Nội',
    area: '140m²',
    bedrooms: '3 PN',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    depositAmount: '70.000.000',
    paymentMethod: 'Chuyển khoản',
    paymentCycle: 'Hàng tháng',
    status: 'ended',
    landlordName: 'Phạm Văn Hùng',
    landlordPhone: '0918 654 321',
    brokerName: 'Lê Quốc Hùng',
    brokerPhone: '0978 654 321',
    brokerAvatar: null,
    terms: [
      'Thanh toán tiền nhà vào ngày 10 hàng tháng',
      'Tiền cọc tương đương 2 tháng tiền thuê',
      'Không được hút thuốc trong nhà',
      'Giữ gìn vệ sinh chung',
    ],
    payments: [
      { date: '2026-05-10', amount: '35.000.000', status: 'paid', note: 'Thanh toán tháng 5' },
      { date: '2026-04-10', amount: '35.000.000', status: 'paid', note: 'Thanh toán tháng 4' },
      { date: '2026-03-10', amount: '35.000.000', status: 'paid', note: 'Thanh toán tháng 3' },
    ],
    timeline: [
      { stage: 'placed', label: 'Đặt lịch xem', date: '2025-05-01', completed: true },
      { stage: 'negotiated', label: 'Đàm phán', date: '2025-05-10', completed: true },
      { stage: 'signed', label: 'Ký hợp đồng', date: '2025-05-20', completed: true },
      { stage: 'active', label: 'Đang thuê', date: '2025-06-01', completed: true },
      { stage: 'ended', label: 'Kết thúc', date: '2026-05-31', completed: true },
    ],
    createdAt: '2025-05-20',
  },
  {
    id: 'HD-2026-003',
    code: 'HD-2026-003',
    propertyId: 4,
    propertyName: 'Nhà phố 3 tầng Cầu Giấy',
    propertyImage: null,
    price: '30.000.000',
    priceUnit: '/tháng',
    address: 'Cầu Giấy, Hà Nội',
    area: '120m²',
    bedrooms: '4 PN',
    startDate: '2026-06-15',
    endDate: '2027-06-14',
    depositAmount: '60.000.000',
    paymentMethod: 'Chuyển khoản',
    paymentCycle: 'Hàng tháng',
    status: 'pending',
    landlordName: 'Đỗ Thị Lan',
    landlordPhone: '0909 876 543',
    brokerName: 'Trần Thị Hương',
    brokerPhone: '0912 345 678',
    brokerAvatar: null,
    terms: [
      'Thanh toán tiền nhà vào ngày 15 hàng tháng',
      'Tiền cọc tương đương 2 tháng tiền thuê',
      'Bàn giao nhà vào ngày 01/06/2026',
      'Chủ nhà sẽ sơn lại nhà trước khi bàn giao',
    ],
    payments: [],
    timeline: [
      { stage: 'placed', label: 'Đặt lịch xem', date: '2026-05-01', completed: true },
      { stage: 'negotiated', label: 'Đàm phán', date: '2026-05-10', completed: true },
      { stage: 'signed', label: 'Ký hợp đồng', date: null, completed: false },
      { stage: 'active', label: 'Đang thuê', date: null, completed: false },
      { stage: 'ended', label: 'Kết thúc', date: null, completed: false },
    ],
    createdAt: '2026-05-15',
  },
]

const TIMELINE_CONFIG = {
  placed: { icon: 'calendar', label: 'Đặt lịch' },
  negotiated: { icon: 'chat', label: 'Đàm phán' },
  signed: { icon: 'sign', label: 'Ký hợp đồng' },
  active: { icon: 'check', label: 'Đang thuê' },
  ended: { icon: 'end', label: 'Kết thúc' },
}

function formatCurrency(amount) {
  return `${parseInt(amount.replace(/\./g, '')).toLocaleString('vi-VN')}₫`
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateShort(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

function timeRemaining(endDate) {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end - now
  if (diff < 0) return 'Đã hết hạn'
  const days = Math.floor(diff / 86400000)
  if (days < 30) return `${days} ngày`
  const months = Math.floor(days / 30)
  return `${months} tháng ${days % 30} ngày`
}

function ContractIcon({ type, className = "h-5 w-5" }) {
  const icons = {
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    chat: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
    sign: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    end: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    ),
    bell: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />
    ),
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    ),
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 3h7l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5M9 13h6m-6 4h6" />
    ),
    download: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    ),
    phone: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
    refresh: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    ),
    eye: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ),
    chevronRight: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    ),
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[type] || icons.bell}
    </svg>
  )
}

function KPICard({ label, value, icon, color, onClick }) {
  const bgGradients = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600',
    slate: 'from-slate-500 to-slate-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradients[color]} text-white shadow-lg`}>
          <ContractIcon icon={icon} className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

function ContractCard({ contract, onClick, isSelected }) {
  const daysUntilEnd = contract.status === 'expiring' ? timeRemaining(contract.endDate) : null

  return (
    <div
      onClick={() => onClick(contract)}
      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all ${
        isSelected
          ? 'border-blue-300 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white hover:shadow-md'
      }`}
    >
      {contract.status === 'expiring' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Property Image */}
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="flex h-full items-center justify-center">
            <ContractIcon icon="home" className="h-8 w-8 text-slate-300" />
          </div>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent">
            <span className="m-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
              {contract.area} · {contract.bedrooms}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-400">{contract.code}</span>
                <StatusBadge status={contract.status} />
              </div>
              <h4 className="mt-1 truncate text-sm font-bold text-slate-900">{contract.propertyName}</h4>
              <p className="text-xs text-slate-500">{contract.address}</p>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ContractIcon icon="calendar" className="h-3.5 w-3.5" />
              {formatDateShort(contract.startDate)} - {formatDateShort(contract.endDate)}
            </span>
            {daysUntilEnd && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                Còn {daysUntilEnd}
              </span>
            )}
          </div>

          <p className="mt-2 text-base font-bold text-blue-600">
            {formatCurrency(contract.price)}<span className="text-xs font-normal text-slate-400"> {contract.priceUnit}</span>
          </p>
        </div>

        {/* Chevron */}
        <div className="flex items-center text-slate-400">
          <ContractIcon icon="chevronRight" className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function ContractDetail({ contract, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  const statusConfig = STATUS_CONFIG[contract.status]

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'payments', label: 'Thanh toán' },
    { id: 'timeline', label: 'Tiến trình' },
  ]

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className={`border-b border-slate-100 p-5 ${statusConfig?.badge || ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
              <ContractIcon icon="document" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{contract.code}</h3>
              <p className="text-xs text-white/80">Ký ngày {formatDate(contract.createdAt)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Property Info */}
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
            <ContractIcon icon="home" className="h-10 w-10 text-slate-300" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-bold text-slate-900">{contract.propertyName}</h4>
            <p className="text-xs text-slate-500">{contract.address}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span>{contract.area}</span>
              <span>·</span>
              <span>{contract.bedrooms}</span>
              <span>·</span>
              <span className="font-bold text-blue-600">{formatCurrency(contract.price)} {contract.priceUnit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-100 px-5 pt-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Contract Info */}
            <div className="rounded-xl bg-slate-50 p-4">
              <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Thông tin hợp đồng</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian thuê</span>
                  <span className="font-medium text-slate-900">{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phương thức thanh toán</span>
                  <span className="font-medium text-slate-900">{contract.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chu kỳ thanh toán</span>
                  <span className="font-medium text-slate-900">{contract.paymentCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiền cọc</span>
                  <span className="font-bold text-emerald-600">{contract.depositAmount}₫</span>
                </div>
              </div>
            </div>

            {/* Landlord & Broker */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Chủ nhà</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{contract.landlordName}</p>
                <a href={`tel:${contract.landlordPhone}`} className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <ContractIcon icon="phone" className="h-3 w-3" />
                  {contract.landlordPhone}
                </a>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Môi giới</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{contract.brokerName}</p>
                <a href={`tel:${contract.brokerPhone}`} className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <ContractIcon icon="phone" className="h-3 w-3" />
                  {contract.brokerPhone}
                </a>
              </div>
            </div>

            {/* Terms */}
            <div>
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Điều khoản thuê</h5>
              <ul className="space-y-1.5">
                {contract.terms.map((term, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Tổng đã thanh toán</p>
                <p className="text-xl font-bold text-emerald-600">
                  {contract.payments.reduce((sum, p) => sum + parseInt(p.amount.replace(/\./g, '')), 0).toLocaleString('vi-VN')}₫
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Tiền cọc</p>
                <p className="text-sm font-bold text-slate-900">{contract.depositAmount}₫</p>
              </div>
            </div>

            <div className="space-y-2">
              {contract.payments.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-500">Chưa có lịch sử thanh toán</p>
                </div>
              ) : (
                contract.payments.map((payment, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{payment.note}</p>
                      <p className="text-xs text-slate-500">{formatDate(payment.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{payment.amount}₫</p>
                      {payment.status === 'paid' && (
                        <span className="text-[10px] font-medium text-emerald-600">Đã thanh toán</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200" />
            <div className="space-y-4">
              {contract.timeline.map((stage, i) => {
                const config = TIMELINE_CONFIG[stage.stage]
                return (
                  <div key={i} className="relative flex items-start gap-4 pl-10">
                    <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      stage.completed ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white text-slate-400'
                    }`}>
                      <ContractIcon icon={config.icon} className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${stage.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {config.label}
                      </p>
                      {stage.date && (
                        <p className="text-xs text-slate-500">{formatDate(stage.date)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 p-5">
        {contract.status === 'pending' && (
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Từ chối
            </button>
            <button className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5">
              Ký hợp đồng
            </button>
          </div>
        )}

        {contract.status === 'active' && (
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <span className="flex items-center justify-center gap-1.5">
                <ContractIcon icon="download" className="h-4 w-4" />
                Tải PDF
              </span>
            </button>
            <button className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5">
              <span className="flex items-center justify-center gap-1.5">
                <ContractIcon icon="refresh" className="h-4 w-4" />
                Gia hạn
              </span>
            </button>
          </div>
        )}

        {contract.status === 'expiring' && (
          <button className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5">
            <span className="flex items-center justify-center gap-1.5">
              <ContractIcon icon="refresh" className="h-4 w-4" />
              Gia hạn hợp đồng
            </span>
          </button>
        )}

        {contract.status === 'ended' && (
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/bat-dong-san/${contract.propertyId}`}
              className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Xem lại BĐS
            </Link>
            <button className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5">
              Tìm nhà mới
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100">
        <ContractIcon icon="document" className="h-12 w-12 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Bạn chưa có hợp đồng thuê nào</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
        Khám phá các bất động sản phù hợp và ký hợp đồng thuê ngay hôm nay.
      </p>
      <Link
        to="/bat-dong-san"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
      >
        <ContractIcon icon="home" className="h-5 w-5" />
        Khám phá bất động sản
      </Link>
    </div>
  )
}

export default function TenantContractsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [contracts] = useState(MOCK_CONTRACTS)
  const [selectedContract, setSelectedContract] = useState(null)

  const kpis = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiring: contracts.filter(c => c.status === 'expiring').length,
    ended: contracts.filter(c => c.status === 'ended').length,
  }), [contracts])

  const filteredContracts = useMemo(() => {
    if (activeTab === 'all') return contracts
    if (activeTab === 'pending') return contracts.filter(c => c.status === 'pending')
    return contracts.filter(c => c.status === activeTab)
  }, [contracts, activeTab])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hợp đồng thuê</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi các hợp đồng thuê bất động sản của bạn</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Tổng hợp đồng" value={kpis.total} icon="document" color="blue" />
        <KPICard label="Đang hiệu lực" value={kpis.active} icon="check" color="blue" onClick={() => setActiveTab('active')} />
        <KPICard label="Sắp hết hạn" value={kpis.expiring} icon="calendar" color="amber" onClick={() => setActiveTab('expiring')} />
        <KPICard label="Đã kết thúc" value={kpis.ended} icon="end" color="slate" onClick={() => setActiveTab('ended')} />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contract List */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-2xl bg-slate-100 p-1">
            {CONTRACT_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contract List */}
          {filteredContracts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredContracts.map(contract => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onClick={setSelectedContract}
                  isSelected={selectedContract?.id === contract.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedContract ? (
            <ContractDetail
              contract={selectedContract}
              onClose={() => setSelectedContract(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8">
              <div className="text-center">
                <ContractIcon icon="document" className="mx-auto h-16 w-16 text-slate-300" />
                <p className="mt-4 text-sm font-medium text-slate-500">Chọn hợp đồng để xem chi tiết</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
