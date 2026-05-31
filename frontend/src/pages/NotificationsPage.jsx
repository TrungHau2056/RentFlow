import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const NOTIFICATION_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
  { id: 'lich_xem', label: 'Lịch xem nhà' },
  { id: 'goi_y', label: 'Nhà gợi ý' },
  { id: 'hop_dong', label: 'Hợp đồng' },
  { id: 'he_thong', label: 'Hệ thống' },
]

const NOTIFICATION_TYPES = {
  lich_xem: { label: 'Lịch xem nhà', icon: 'calendar', color: 'bg-blue-500', lightBg: 'bg-blue-50' },
  goi_y: { label: 'Nhà gợi ý', icon: 'home', color: 'bg-amber-500', lightBg: 'bg-amber-50' },
  hop_dong: { label: 'Hợp đồng', icon: 'document', color: 'bg-emerald-500', lightBg: 'bg-emerald-50' },
  he_thong: { label: 'Hệ thống', icon: 'bell', color: 'bg-slate-500', lightBg: 'bg-slate-50' },
  phan_hoi: { label: 'Phản hồi', icon: 'chat', color: 'bg-purple-500', lightBg: 'bg-purple-50' },
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'lich_xem',
    title: 'Lịch xem nhà đã được xác nhận',
    content: 'Lịch xem nhà tại Vinhomes Metropolis đã được môi giới xác nhận. Bạn sẽ nhận được nhắc nhở trước 2 giờ.',
    propertyId: 1,
    propertyName: 'Căn hộ 2PN Vinhomes Metropolis',
    time: '2026-05-25T09:30:00',
    read: false,
    important: true,
    actionLabel: 'Xem lịch hẹn',
    actionUrl: '/tenant/lich-xem',
  },
  {
    id: 2,
    type: 'goi_y',
    title: 'Nhà mới phù hợp với yêu cầu của bạn',
    content: 'Căn hộ 3PN tại Thanh Xuân với giá 25 triệu/tháng, diện tích 90m², phù hợp với tiêu chí bạn đã lưu.',
    propertyId: 2,
    propertyName: 'Căn hộ 3PN Trung Hòa',
    price: '25.000.000',
    area: '90m²',
    bedrooms: '3 PN',
    image: null,
    time: '2026-05-25T08:15:00',
    read: false,
    important: false,
    actionLabel: 'Xem chi tiết',
    actionUrl: '/bat-dong-san/2',
  },
  {
    id: 3,
    type: 'hop_dong',
    title: 'Hợp đồng thuê đã được cập nhật',
    content: 'Chủ nhà đã cập nhật điều khoản hợp đồng. Vui lòng xem lại và xác nhận trước ngày 30/05/2026.',
    contractId: 1,
    contractCode: 'HD-2026-001',
    time: '2026-05-24T16:45:00',
    read: false,
    important: true,
    actionLabel: 'Xem hợp đồng',
    actionUrl: '/tenant/hop-dong',
  },
  {
    id: 4,
    type: 'phan_hoi',
    title: 'Môi giới đã phản hồi tin nhắn của bạn',
    content: 'Anh Tuấn đã trả lời câu hỏi về tiện ích xung quanh bất động sản. Xem tin nhắn để biết thêm chi tiết.',
    brokerName: 'Nguyễn Minh Tuấn',
    brokerAvatar: null,
    time: '2026-05-24T14:20:00',
    read: true,
    important: false,
    actionLabel: 'Xem tin nhắn',
    actionUrl: '#',
  },
  {
    id: 5,
    type: 'lich_xem',
    title: 'Nhắc nhở lịch xem nhà ngày mai',
    content: 'Bạn có lịch xem nhà tại Lotte Center Hanoi vào lúc 14:00 ngày 26/05/2026. Đừng quên mang theo giấy tờ tùy thân.',
    propertyId: 3,
    propertyName: 'Căn hộ 2PN Lotte Center Hanoi',
    time: '2026-05-24T10:00:00',
    read: true,
    important: false,
    actionLabel: 'Xem chi tiết',
    actionUrl: '/bat-dong-san/3',
  },
  {
    id: 6,
    type: 'goi_y',
    title: 'Giá thuê giảm tại bất động sản bạn quan tâm',
    content: 'Căn hộ bạn đã lưu tại Keangnam Hanoi đã giảm giá từ 35 triệu xuống 32 triệu/tháng.',
    propertyId: 4,
    propertyName: 'Chung cư 3PN Keangnam Hanoi',
    oldPrice: '35.000.000',
    newPrice: '32.000.000',
    image: null,
    time: '2026-05-23T11:30:00',
    read: true,
    important: true,
    actionLabel: 'Xem ngay',
    actionUrl: '/bat-dong-san/4',
  },
  {
    id: 7,
    type: 'he_thong',
    title: 'Chào mừng bạn đến với RentFlow!',
    content: 'Cảm ơn bạn đã đăng ký. Khám phá các bất động sản phù hợp và đặt lịch xem nhà ngay hôm nay.',
    time: '2026-05-20T08:00:00',
    read: true,
    important: false,
    actionLabel: 'Khám phá nhà',
    actionUrl: '/bat-dong-san',
  },
  {
    id: 8,
    type: 'hop_dong',
    title: 'Hợp đồng thuê đã hết hạn',
    content: 'Hợp đồng thuê nhà tại Hoàn Kiếm đã hết hạn vào ngày 20/05/2026. Liên hệ chủ nhà để gia hạn hoặc tìm nhà mới.',
    contractId: 2,
    contractCode: 'HD-2025-089',
    time: '2026-05-20T07:00:00',
    read: true,
    important: true,
    actionLabel: 'Xem chi tiết',
    actionUrl: '/tenant/hop-dong',
  },
  {
    id: 9,
    type: 'lich_xem',
    title: 'Lịch xem nhà đã hoàn thành',
    content: 'Cảm ơn bạn đã tham gia buổi xem nhà. Vui lòng đánh giá trải nghiệm để chúng tôi cải thiện dịch vụ.',
    propertyId: 5,
    propertyName: 'Nhà phố Cầu Giấy',
    time: '2026-05-19T17:00:00',
    read: true,
    important: false,
    actionLabel: 'Đánh giá',
    actionUrl: '#',
  },
  {
    id: 10,
    type: 'goi_y',
    title: 'Nhà mới đăng trong khu vực bạn quan tâm',
    content: 'Căn hộ studio tại Thanh Xuân với giá 12 triệu/tháng, nội thất đầy đủ, gần metro.',
    propertyId: 6,
    propertyName: 'Studio Cầu Giấy',
    price: '12.000.000',
    area: '45m²',
    bedrooms: '1 PN',
    image: null,
    time: '2026-05-18T15:30:00',
    read: false,
    important: false,
    actionLabel: 'Xem chi tiết',
    actionUrl: '/bat-dong-san/6',
  },
]

const RECOMMENDED_PROPERTIES = [
  {
    id: 7,
    name: 'Căn hộ 2PN Vinhomes Metropolis',
    price: '28.000.000',
    area: '85m²',
    bedrooms: '2 PN',
    location: 'Tây Hồ',
    image: null,
    matchScore: 95,
  },
  {
    id: 8,
    name: 'Nhà phố Ciputra',
    price: '35.000.000',
    area: '120m²',
    bedrooms: '3 PN',
    location: 'Cầu Giấy',
    image: null,
    matchScore: 88,
  },
  {
    id: 9,
    name: 'Chung cư The Manor',
    price: '18.000.000',
    area: '70m²',
    bedrooms: '2 PN',
    location: 'Thanh Xuân',
    image: null,
    matchScore: 82,
  },
]

function NotificationIcon({ type, size = 'md' }) {
  const sizeClasses = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'
  const iconPaths = {
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    ),
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 3h7l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5M9 13h6m-6 4h6" />
    ),
    bell: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />
    ),
    chat: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    ),
  }

  return (
    <svg className={sizeClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {iconPaths[type] || iconPaths.bell}
    </svg>
  )
}

function timeAgo(dateStr) {
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
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

function KPICard({ label, value, icon, color, onClick }) {
  const bgGradients = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600',
    slate: 'from-slate-500 to-slate-600',
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
          <NotificationIcon icon={icon} size="lg" />
        </div>
      </div>
    </div>
  )
}

function NotificationCard({ notification, onClick, isSelected }) {
  const typeConfig = NOTIFICATION_TYPES[notification.type]
  const isUnread = !notification.read

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all ${
        isSelected
          ? 'border-blue-300 bg-blue-50 shadow-md'
          : isUnread
          ? 'border-blue-200 bg-white shadow-sm hover:shadow-md'
          : 'border-slate-200 bg-white hover:shadow-sm'
      }`}
    >
      {isUnread && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
        </span>
      )}

      <div className="flex items-start gap-4">
        <div className={`flex shrink-0 items-center justify-center rounded-xl ${typeConfig?.lightBg || 'bg-slate-50'}`}>
          <div className={`${typeConfig?.color || 'bg-slate-500'} text-white`}>
            <NotificationIcon icon={typeConfig?.icon || 'bell'} size="md" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
              {notification.title}
            </h4>
            {notification.important && (
              <span className="shrink-0 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
                Quan trọng
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{notification.content}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-[11px] text-slate-400">{timeAgo(notification.time)}</span>
            {!notification.read && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                Mới
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationDetail({ notification, onClose, onMarkRead, onDelete }) {
  if (!notification) return null

  const typeConfig = NOTIFICATION_TYPES[notification.type]

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeConfig?.lightBg || 'bg-slate-50'}`}>
            <div className={`${typeConfig?.color || 'bg-slate-500'} text-white`}>
              <NotificationIcon icon={typeConfig?.icon || 'bell'} size="md" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Chi tiết thông báo</h3>
            <p className="text-xs text-slate-500">{timeAgo(notification.time)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            title="Đánh dấu đã đọc"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            title="Xóa thông báo"
          >
            <NotificationIcon icon="trash" size="md" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <h4 className="text-lg font-bold text-slate-900">{notification.title}</h4>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{notification.content}</p>

        {/* Property preview */}
        {notification.propertyId && notification.propertyName && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bất động sản liên quan</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-200 to-slate-300">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{notification.propertyName}</p>
                {notification.price && (
                  <p className="text-sm font-bold text-blue-600">{notification.price}<span className="text-xs font-normal text-slate-400">/tháng</span></p>
                )}
                {notification.oldPrice && notification.newPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 line-through">{notification.oldPrice}</span>
                    <span className="text-sm font-bold text-emerald-600">{notification.newPrice}</span>
                  </div>
                )}
              </div>
            </div>
            <Link
              to={notification.actionUrl || '#'}
              className="mt-3 block w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {notification.actionLabel || 'Xem chi tiết'}
            </Link>
          </div>
        )}

        {/* Contract preview */}
        {notification.contractId && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hợp đồng liên quan</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">Hợp đồng {notification.contractCode}</p>
                <p className="text-xs text-slate-500">Mã: {notification.contractId}</p>
              </div>
            </div>
            <Link
              to={notification.actionUrl || '#'}
              className="mt-3 block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {notification.actionLabel || 'Xem hợp đồng'}
            </Link>
          </div>
        )}

        {/* Broker reply preview */}
        {notification.brokerName && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phản hồi từ môi giới</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-sm font-bold text-purple-700">
                {notification.brokerName.split(' ').slice(-2).map(p => p[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{notification.brokerName}</p>
                <p className="text-xs text-slate-500">Môi giới RentFlow</p>
              </div>
            </div>
            <Link
              to={notification.actionUrl || '#'}
              className="mt-3 block w-full rounded-xl bg-purple-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              {notification.actionLabel || 'Xem tin nhắn'}
            </Link>
          </div>
        )}

        {/* No additional content */}
        {!notification.propertyId && !notification.contractId && !notification.brokerName && (
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">Không có thông tin bổ sung</p>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="border-t border-slate-100 p-5">
        <Link
          to={notification.actionUrl || '#'}
          className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-600/30"
        >
          {notification.actionLabel || 'Xem chi tiết'}
        </Link>
      </div>
    </div>
  )
}

function RecommendedPropertyCard({ property }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md">
      <div className="relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="flex h-32 items-center justify-center">
          <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
          </svg>
        </div>
        <div className="absolute right-2 top-2 rounded-lg bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
          {property.matchScore}% phù hợp
        </div>
      </div>
      <h4 className="truncate text-sm font-semibold text-slate-900">{property.name}</h4>
      <p className="mt-1 text-xs text-slate-500">{property.location}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm font-bold text-blue-600">{property.price}<span className="text-xs font-normal text-slate-400">/tháng</span></p>
        <div className="flex gap-1 text-[10px] text-slate-500">
          <span>{property.area}</span>
          <span>·</span>
          <span>{property.bedrooms}</span>
        </div>
      </div>
      <Link
        to={`/bat-dong-san/${property.id}`}
        className="mt-3 block w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
      >
        Xem chi tiết
      </Link>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100">
        <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900">Bạn chưa có thông báo nào</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
        Các thông báo về lịch xem nhà, nhà gợi ý và hợp đồng sẽ xuất hiện ở đây.
      </p>
    </div>
  )
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Đóng" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <NotificationIcon icon="trash" size="lg" />
        </div>
        <h3 className="text-center text-xl font-bold text-slate-900">Xóa thông báo?</h3>
        <p className="mt-2 text-center text-sm text-slate-500">
          Bạn có chắc chắn muốn xóa thông báo này? Hành động không thể hoàn tác.
        </p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Hủy bỏ
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
            Xóa thông báo
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState(null)

  const kpis = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    lichXem: notifications.filter(n => n.type === 'lich_xem').length,
    goiY: notifications.filter(n => n.type === 'goi_y').length,
  }), [notifications])

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications]
    if (activeTab === 'unread') return filtered.filter(n => !n.read)
    if (activeTab !== 'all') filtered = filtered.filter(n => n.type === activeTab)
    return filtered.sort((a, b) => new Date(b.time) - new Date(a.time))
  }, [notifications, activeTab])

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDelete = (id) => {
    setNotificationToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (notificationToDelete) {
      setNotifications(prev => prev.filter(n => n.id !== notificationToDelete))
      if (selectedNotification?.id === notificationToDelete) {
        setSelectedNotification(null)
      }
      setShowDeleteModal(false)
      setNotificationToDelete(null)
    }
  }

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
          <p className="mt-1 text-sm text-slate-500">Cập nhật mới nhất từ hệ thống và môi giới</p>
        </div>
        {kpis.unread > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Tổng thông báo" value={kpis.total} icon="bell" color="blue" />
        <KPICard label="Chưa đọc" value={kpis.unread} icon="bell" color="amber" onClick={() => setActiveTab('unread')} />
        <KPICard label="Lịch hẹn mới" value={kpis.lichXem} icon="calendar" color="blue" onClick={() => setActiveTab('lich_xem')} />
        <KPICard label="Nhà gợi ý" value={kpis.goiY} icon="home" color="amber" onClick={() => setActiveTab('goi_y')} />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notification List */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-2xl bg-slate-100 p-1">
            {NOTIFICATION_TABS.map(tab => (
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

          {/* Notification List */}
          {filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  isSelected={selectedNotification?.id === notification.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel / Recommendations */}
        <div className="space-y-6">
          {selectedNotification ? (
            <NotificationDetail
              notification={selectedNotification}
              onClose={() => setSelectedNotification(null)}
              onMarkRead={handleMarkAsRead}
              onDelete={(id) => handleDelete(id)}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-bold text-slate-900">Nhà gợi ý cho bạn</h3>
              <p className="mt-1 text-sm text-slate-500">Dựa trên sở thích và lịch sử xem</p>
              <div className="mt-4 space-y-4">
                {RECOMMENDED_PROPERTIES.map(property => (
                  <RecommendedPropertyCard key={property.id} property={property} />
                ))}
              </div>
              <Link
                to="/tenant/tim-nha"
                className="mt-4 block w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-center text-sm font-semibold text-white transition hover:from-amber-600 hover:to-amber-700"
              >
                Xem tất cả nhà
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setNotificationToDelete(null)
        }}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
