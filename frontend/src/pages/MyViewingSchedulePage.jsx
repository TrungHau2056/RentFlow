import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import viewingService from '../services/viewingService'

const STATUS_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'cho_xac_nhan', label: 'Chờ xác nhận' },
  { id: 'da_xac_nhan', label: 'Đã xác nhận' },
  { id: 'da_hoan_thanh', label: 'Đã hoàn thành' },
  { id: 'da_huy', label: 'Đã hủy' },
]

const STATUS_CONFIG = {
  cho_xac_nhan: { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  da_xac_nhan: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  da_hoan_thanh: { label: 'Đã hoàn thành', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  da_huy: { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
}

const METHOD_CONFIG = {
  truc_tiep: { label: 'Xem trực tiếp', icon: '🏠', color: 'bg-blue-50 text-blue-700' },
  video_call: { label: 'Video call', icon: '📹', color: 'bg-purple-50 text-purple-700' },
  di_cung_moi_gioi: { label: 'Đi cùng môi giới', icon: '🤝', color: 'bg-teal-50 text-teal-700' },
}

const STATUS_MAP = {
  CHO_XAC_NHAN: 'cho_xac_nhan',
  DA_XAC_NHAN: 'da_xac_nhan',
  DA_HOAN_THANH: 'da_hoan_thanh',
  DA_HUY: 'da_huy',
}

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function mapBooking(item) {
  const thoiGian = item.thoiGian ? new Date(item.thoiGian) : new Date()
  const date = thoiGian.toISOString().slice(0, 10)
  const time = thoiGian.toTimeString().slice(0, 5)
  return {
    id: item.id,
    propertyId: item.batDongSanId,
    propertyName: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    propertyImage: null,
    price: '',
    priceUnit: '/tháng',
    address: item.diaChiBatDongSan || '',
    area: '',
    bedrooms: '',
    date,
    time,
    method: 'truc_tiep',
    status: STATUS_MAP[item.trangThai] || item.trangThai?.toLowerCase() || 'cho_xac_nhan',
    brokerId: item.nhanVienId,
    brokerName: item.tenNhanVien || '',
    notes: item.noiDungTraoDoi || '',
    createdAt: date,
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

function KPIIcon({ type }) {
  const icons = {
    total: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    upcoming: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    completed: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    cancelled: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }
  return icons[type]
}

function KPICard({ label, value, type, color }) {
  const bgColors = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600',
    red: 'from-red-400 to-red-500',
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${bgColors[color]} text-white shadow-lg`}>
          <KPIIcon type={type} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
      />
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

function MethodBadge({ method }) {
  const config = METHOD_CONFIG[method]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}

function BrokerCard({ broker }) {
  const initials = broker.name.split(' ').slice(-2).map(p => p[0]).join('')

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white">
          {initials}
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${broker.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{broker.name}</p>
        <div className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs text-slate-500">{broker.rating} ({broker.reviews})</span>
        </div>
      </div>
    </div>
  )
}

function BookingCard({ booking, onReschedule }) {
  const broker = {
    name: booking.brokerName || 'Môi giới',
    role: 'Môi giới',
    online: false,
    rating: 0,
    reviews: 0,
    phone: '',
  }
  const isActive = booking.status === 'cho_xac_nhan' || booking.status === 'da_xac_nhan'

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
        {/* Property image */}
        <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 lg:h-28 lg:w-36">
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent">
            <span className="m-2 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700 backdrop-blur-sm">{booking.area} · {booking.bedrooms}</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link to={`/bat-dong-san/${booking.propertyId}`} className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                {booking.propertyName}
              </Link>
              <p className="mt-0.5 text-sm text-slate-500">{booking.address}</p>
              <p className="mt-1 text-lg font-bold text-blue-600">{booking.price}<span className="text-sm font-normal text-slate-400">{booking.priceUnit}</span></p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* Date & Method */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">{booking.time}</span>
            </div>
            <MethodBadge method={booking.method} />
          </div>

          {/* Broker */}
          <div className="mt-3 flex items-center justify-between">
            <BrokerCard broker={broker} />
          </div>

          {booking.notes && (
            <p className="mt-2 text-xs text-slate-400 italic">"{booking.notes}"</p>
          )}
        </div>

        {/* Actions */}
        {isActive && (
          <div className="flex flex-row gap-2 lg:flex-col lg:items-end">
            <Link
              to={`/bat-dong-san/${booking.propertyId}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem BĐS
            </Link>
            <button
              type="button"
              onClick={() => onReschedule(booking)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Đổi lịch
            </button>
          </div>
        )}

        {booking.status === 'da_hoan_thanh' && (
          <div className="flex flex-row gap-2 lg:flex-col lg:items-end">
            <Link
              to={`/bat-dong-san/${booking.propertyId}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Xem lại BĐS
            </Link>
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-600"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 8.394c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Đánh giá
            </button>
          </div>
        )}

        {booking.status === 'da_huy' && (
          <div className="flex flex-row gap-2 lg:flex-col lg:items-end">
            <Link
              to={`/tenant/dat-lich-xem`}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
            >
              Đặt lại lịch
            </Link>
          </div>
        )}
      </div>

      {/* Booking ID footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">Mã lịch hẹn: <span className="font-mono font-medium text-slate-500">{booking.id}</span></span>
        <span className="text-xs text-slate-400">Đặt lúc: {formatDateShort(booking.createdAt)}</span>
      </div>
    </div>
  )
}

function CalendarView({ bookings, onSelectBooking }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const startPad = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  const getBookingsForDay = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookings.filter(b => b.date === dateStr)
  }

  const isToday = (day) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold capitalize text-slate-900">{monthLabel}</h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-xl bg-slate-100 overflow-hidden">
        {DAYS_VI.map(d => (
          <div key={d} className="bg-white py-2 text-center text-xs font-semibold text-slate-400">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="bg-slate-50/50 min-h-[80px]" />
          const dayBookings = getBookingsForDay(day)
          const todayClass = isToday(day) ? 'bg-blue-50' : ''
          return (
            <div key={day} className={`min-h-[80px] bg-white p-1.5 ${todayClass}`}>
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-medium ${isToday(day) ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                {day}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayBookings.slice(0, 2).map(b => {
                  const sConfig = STATUS_CONFIG[b.status]
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => onSelectBooking(b)}
                      className={`w-full truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-medium ${sConfig.color} border transition hover:opacity-80`}
                    >
                      {b.time} {b.propertyName.split(' ').slice(0, 3).join(' ')}
                    </button>
                  )
                })}
                {dayBookings.length > 2 && (
                  <p className="px-1 text-[10px] font-medium text-slate-400">+{dayBookings.length - 2} khác</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RescheduleModal({ booking, onClose, onConfirm }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  if (!booking) return null

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

  // Generate next 14 days
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    dates.push(d)
  }

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return
    onConfirm(booking.id, selectedDate, selectedTime)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Đóng" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="text-center text-xl font-bold text-slate-900">Đổi lịch xem nhà</h3>
        <p className="mt-1 text-center text-sm text-slate-500">{booking.propertyName}</p>

        {/* Current schedule */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-400">Lịch hiện tại</p>
          <p className="text-sm font-semibold text-slate-700">{formatDate(booking.date)} — {booking.time}</p>
        </div>

        {/* New date */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Chọn ngày mới</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map(d => {
              const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
              const isSelected = selectedDate === dateStr
              const dayLabel = d.toLocaleDateString('vi-VN', { weekday: 'short' })
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition ${
                    isSelected ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[10px] font-medium">{dayLabel}</span>
                  <span className="text-lg font-bold">{d.getDate()}</span>
                  <span className="text-[10px]">{d.getMonth() + 1}/{d.getFullYear() % 100}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* New time */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Chọn giờ mới</label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTime(t)}
                className={`rounded-xl border py-2 text-sm font-medium transition ${
                  selectedTime === t ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Xác nhận đổi lịch
          </button>
        </div>
      </div>
    </div>
  )
}

function SuccessModal({ type, booking, onClose }) {
  if (!booking) return null

  const isError = type === 'reschedule_error'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Đóng" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${isError ? 'bg-red-50' : 'bg-emerald-50'}`}>
          <svg className={`h-8 w-8 ${isError ? 'text-red-500' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isError ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'} />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">{isError ? 'Đổi lịch thất bại' : 'Đã đổi lịch thành công'}</h3>
        <p className="mt-2 text-sm text-slate-500">
          {isError
            ? 'Không thể đổi lịch hẹn. Vui lòng thử lại sau.'
            : `Lịch hẹn ${booking.id} đã được cập nhật.`}
        </p>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left">
          <p className="text-xs text-slate-400">Mã lịch hẹn</p>
          <p className="font-mono text-sm font-bold text-slate-900">{booking.id}</p>
        </div>
        <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
          Đã hiểu
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100">
        <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900">Bạn chưa có lịch xem nhà nào</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-500">Khám phá các bất động sản phù hợp và đặt lịch xem nhà ngay hôm nay.</p>
      <Link
        to="/bat-dong-san"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5-5m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Khám phá bất động sản
      </Link>
    </div>
  )
}

export default function MyViewingSchedulePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [rescheduleBooking, setRescheduleBooking] = useState(null)
  const [successResult, setSuccessResult] = useState(null)

  useEffect(() => {
    setLoading(true)
    viewingService.getMyViewingSchedules()
      .then(res => {
        if (res?.data) {
          setBookings(res.data.map(mapBooking))
        }
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings
    return bookings.filter(b => b.status === activeTab)
  }, [bookings, activeTab])

  const kpis = useMemo(() => ({
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'cho_xac_nhan' || b.status === 'da_xac_nhan').length,
    completed: bookings.filter(b => b.status === 'da_hoan_thanh').length,
    cancelled: bookings.filter(b => b.status === 'da_huy').length,
  }), [bookings])

  const handleRescheduleConfirm = async (bookingId, newDate, newTime) => {
    try {
      const thoiGian = `${newDate}T${newTime}:00`
      await viewingService.rescheduleAppointment(bookingId, thoiGian)
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, date: newDate, time: newTime } : b))
      setRescheduleBooking(null)
      setSuccessResult({ type: 'reschedule', booking: { id: bookingId } })
    } catch {
      setSuccessResult({ type: 'reschedule_error', booking: { id: bookingId } })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lịch xem nhà của tôi</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi và quản lý các lịch hẹn xem bất động sản</p>
        </div>
        <Link
          to="/tenant/dat-lich-xem"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Đặt lịch xem nhà
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Tổng số lịch hẹn" value={kpis.total} type="total" color="blue" />
        <KPICard label="Sắp diễn ra" value={kpis.upcoming} type="upcoming" color="amber" />
        <KPICard label="Đã hoàn thành" value={kpis.completed} type="completed" color="emerald" />
        <KPICard label="Đã hủy" value={kpis.cancelled} type="cancelled" color="red" />
      </div>

      {/* Tabs + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.id !== 'all' && (
                <span className="ml-1.5 text-xs">
                  ({bookings.filter(b => tab.id === 'all' || b.status === tab.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Danh sách
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Lịch
          </button>
        </div>
      </div>

      {/* Content */}
      {bookings.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'list' ? (
        filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-400">Không có lịch hẹn nào ở trạng thái này.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onReschedule={setRescheduleBooking}
              />
            ))}
          </div>
        )
      ) : (
        <CalendarView
          bookings={filteredBookings}
          onSelectBooking={(b) => {
            if (b.status === 'cho_xac_nhan' || b.status === 'da_xac_nhan') setRescheduleBooking(b)
          }}
        />
      )}

      {/* Modals */}
      {rescheduleBooking && (
        <RescheduleModal
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onConfirm={handleRescheduleConfirm}
        />
      )}

      {successResult && (
        <SuccessModal
          type={successResult.type}
          booking={successResult.booking}
          onClose={() => setSuccessResult(null)}
        />
      )}
    </div>
  )
}
