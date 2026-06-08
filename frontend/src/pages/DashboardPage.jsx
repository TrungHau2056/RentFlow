import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const STATUS_CONFIG = {
  cho_khao_sat: { label: 'Chờ khảo sát', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-500' },
  cho_ky_hop_dong: { label: 'Chờ ký hợp đồng', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  dang_hien_thi: { label: 'Đang hiển thị', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  da_cho_thue: { label: 'Đã cho thuê', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
}

const MOCK_PROPERTIES = [
  {
    id: 1,
    name: 'Căn hộ 2PN Vinhomes Golden River',
    address: 'Quận 1, TP.HCM',
    price: '18.000.000',
    area: '75m²',
    bedrooms: '2 PN',
    image: null,
    status: 'dang_hien_thi',
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    name: 'Căn hộ 3PN Thảo Điền',
    address: 'Quận 2, TP.HCM',
    price: '25.000.000',
    area: '90m²',
    bedrooms: '3 PN',
    image: null,
    status: 'da_cho_thue',
    createdAt: '2026-02-20',
  },
  {
    id: 3,
    name: 'Nhà phố 3 tầng Quận 7',
    address: 'Quận 7, TP.HCM',
    price: '30.000.000',
    area: '120m²',
    bedrooms: '4 PN',
    image: null,
    status: 'cho_khao_sat',
    createdAt: '2026-05-10',
  },
  {
    id: 4,
    name: 'Studio An Phú',
    address: 'Quận 2, TP.HCM',
    price: '12.000.000',
    area: '45m²',
    bedrooms: '1 PN',
    image: null,
    status: 'cho_ky_hop_dong',
    createdAt: '2026-05-18',
  },
]

const MOCK_SURVEYS = [
  {
    id: 1,
    propertyName: 'Nhà phố 3 tầng Quận 7',
    date: '2026-05-28',
    time: '09:00',
    staffName: 'Nguyễn Minh Tuấn',
    staffPhone: '0901 234 567',
    status: 'confirmed',
  },
  {
    id: 2,
    propertyName: 'Căn hộ 5PN Ciputra',
    date: '2026-05-30',
    time: '14:00',
    staffName: 'Trần Thị Hương',
    staffPhone: '0912 345 678',
    status: 'pending',
  },
]

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'interest',
    title: 'Có khách hàng quan tâm đến bất động sản',
    property: 'Căn hộ 2PN Vinhomes Golden River',
    time: '2 giờ trước',
    unread: true,
  },
  {
    id: 2,
    type: 'contract',
    title: 'Hợp đồng ký gửi đã được duyệt',
    property: 'Studio An Phú',
    time: '5 giờ trước',
    unread: true,
  },
  {
    id: 3,
    type: 'survey',
    title: 'Lịch khảo sát đã được xác nhận',
    property: 'Nhà phố 3 tầng Quận 7',
    time: '1 ngày trước',
    unread: false,
  },
]

const KPI_DATA = {
  tongNhaKyGui: 14,
  nhaDangChoThue: 8,
  hopDongHieuLuc: 10,
  tienDamBao: '520.000.000',
}

function DashboardIcon({ type, className = "h-5 w-5" }) {
  const icons = {
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    ),
    contract: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    money: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    bell: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    ),
    chevronRight: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21a8 8 0 00-16 0m12-13a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    phone: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
    mail: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 11h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    arrowUp: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    ),
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[type] || icons.home}
    </svg>
  )
}

function KPICard({ label, value, subtext, icon, color, trend }) {
  const bgGradients = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-emerald-600">
              <DashboardIcon icon="arrowUp" className="h-3 w-3" />
              <span className="text-xs font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradients[color]} text-white shadow-lg`}>
          <DashboardIcon icon={icon} className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property }) {
  const navigate = useNavigate()
  const status = STATUS_CONFIG[property.status]
  const openProperty = () => navigate(`/dashboard/bat-dong-san/${property.id}`)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProperty()
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`Xem chi tiết ${property.name}`}
      onClick={openProperty}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="flex h-full items-center justify-center">
            <DashboardIcon icon="home" className="h-8 w-8 text-slate-300" />
          </div>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent">
            <span className="m-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
              {property.area} · {property.bedrooms}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="truncate text-sm font-bold text-slate-900">{property.name}</h4>
              <p className="text-xs text-slate-500">{property.address}</p>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.color}`}>
              <span className={`h-1 w-1 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <DashboardIcon icon="calendar" className="h-3 w-3" />
              {new Date(property.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>

          <p className="mt-2 text-base font-bold text-blue-600">
            {property.price}<span className="text-xs font-normal text-slate-400">/tháng</span>
          </p>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          className="w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        >
          Cập nhật
        </button>
      </div>
    </div>
  )
}

function SurveyCard({ survey }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <DashboardIcon icon="calendar" className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{survey.propertyName}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <DashboardIcon icon="calendar" className="h-3.5 w-3.5" />
            {new Date(survey.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {survey.time}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">{survey.staffName}</span>
          <a href={`tel:${survey.staffPhone}`} className="text-xs text-blue-600 hover:underline">
            {survey.staffPhone}
          </a>
        </div>
        {survey.status === 'pending' && (
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
              Xác nhận
            </button>
            <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
              Từ chối
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationItem({ notification }) {
  const icons = {
    interest: { icon: 'user', bg: 'bg-blue-100', color: 'text-blue-600' },
    contract: { icon: 'contract', bg: 'bg-emerald-100', color: 'text-emerald-600' },
    survey: { icon: 'calendar', bg: 'bg-amber-100', color: 'text-amber-600' },
  }
  const config = icons[notification.type] || icons.interest

  return (
    <div className={`flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
        <DashboardIcon icon={config.icon} className={`h-5 w-5 ${config.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">{notification.title}</p>
        {notification.property && (
          <p className="mt-0.5 truncate text-xs text-slate-500">{notification.property}</p>
        )}
        <p className="mt-1 text-[10px] text-slate-400">{notification.time}</p>
      </div>
      {notification.unread && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [userInfo] = useState(() => {
    const stored = localStorage.getItem('userInfo')
    return stored ? JSON.parse(stored) : { hoTen: 'Nguyễn Văn A', email: 'chunha@rentflow.vn' }
  })

  const properties = useMemo(() => MOCK_PROPERTIES, [])
  const surveys = useMemo(() => MOCK_SURVEYS, [])
  const notifications = useMemo(() => MOCK_NOTIFICATIONS, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xin chào, {userInfo.hoTen}</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý bất động sản ký gửi của bạn</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
          <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-blue-600">
            CẬP NHẬT: {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          label="Tổng nhà ký gửi"
          value={KPI_DATA.tongNhaKyGui}
          subtext="tài sản"
          icon="home"
          color="blue"
          trend="+2 tháng này"
        />
        <KPICard
          label="Nhà đang cho thuê"
          value={KPI_DATA.nhaDangChoThue}
          subtext="tài sản"
          icon="contract"
          color="emerald"
        />
        <KPICard
          label="Hợp đồng hiệu lực"
          value={KPI_DATA.hopDongHieuLuc}
          subtext="hợp đồng"
          icon="contract"
          color="purple"
        />
        <KPICard
          label="Tiền đảm bảo"
          value={KPI_DATA.tienDamBao}
          subtext="VNĐ"
          icon="money"
          color="amber"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Properties & Surveys */}
        <div className="space-y-6 lg:col-span-2">
          {/* Properties Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bất động sản của tôi</h3>
                <p className="text-sm text-slate-500">Quản lý danh sách nhà ký gửi</p>
              </div>
              <Link
                to="/dashboard/bat-dong-san"
                className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {properties.slice(0, 4).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <Link
              to="/dashboard/bat-dong-san/dang-ky"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-4 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              <DashboardIcon icon="plus" className="h-5 w-5" />
              Đăng ký ký gửi nhà mới
            </Link>
          </div>

          {/* Surveys Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Lịch khảo sát sắp tới</h3>
                <p className="text-sm text-slate-500">Theo dõi lịch khảo sát bất động sản</p>
              </div>
              <Link
                to="/dashboard/lich-khao-sat"
                className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
              >
                Xem tất cả →
              </Link>
            </div>

            {surveys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <DashboardIcon icon="calendar" className="h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">Không có lịch khảo sát nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {surveys.map(survey => (
                  <SurveyCard key={survey.id} survey={survey} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Notifications & Profile */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-6 text-white shadow-xl">
            <h3 className="text-lg font-bold">Thao tác nhanh</h3>
            <p className="mt-1 text-sm text-blue-100">Quản lý bất động sản hiệu quả</p>

            <div className="mt-4 space-y-3">
              <Link
                to="/dashboard/bat-dong-san/dang-ky"
                className="flex items-center justify-between rounded-xl bg-white/20 px-4 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <span>Đăng ký ký gửi mới</span>
                <DashboardIcon icon="chevronRight" className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/hop-dong"
                className="flex items-center justify-between rounded-xl bg-white/20 px-4 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <span>Xem hợp đồng</span>
                <DashboardIcon icon="chevronRight" className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/tien-dam-bao"
                className="flex items-center justify-between rounded-xl bg-white/20 px-4 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <span>Theo dõi tiền đảm bảo</span>
                <DashboardIcon icon="chevronRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <DashboardIcon icon="bell" className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Thông báo mới</h3>
              </div>
              <button className="text-xs font-medium text-blue-600 transition hover:text-blue-700">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-2">
              {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </div>

          {/* Owner Profile Mini */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-bold text-white">
                {userInfo.hoTen?.split(' ').slice(-2).map(p => p[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-slate-900">{userInfo.hoTen}</h4>
                <p className="truncate text-xs text-slate-500">{userInfo.email}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
              <DashboardIcon icon="shield" className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Đã xác minh</span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <DashboardIcon icon="phone" className="h-3.5 w-3.5" />
                <span>0901 234 567</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <DashboardIcon icon="mail" className="h-3.5 w-3.5" />
                <span>{userInfo.email}</span>
              </div>
            </div>

            <Link
              to="/dashboard/ho-so"
              className="mt-4 block w-full rounded-xl border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              Xem hồ sơ cá nhân
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
