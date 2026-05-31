import { useState, useEffect } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import viewingService from '../services/viewingService'
import hopDongThueService from '../services/hopDongThueService'

const TONES = {
  blue: 'bg-blue-50 text-primary-container',
  orange: 'bg-orange-50 text-orange-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
}

const NOTIFICATION_DOTS = {
  blue: 'bg-primary-container',
  orange: 'bg-orange-500',
  emerald: 'bg-emerald-500',
}

const STATUS_TONES = {
  DA_XAC_NHAN: 'emerald',
  CHO_XAC_NHAN: 'orange',
  DA_HOAN_THANH: 'slate',
  DA_HUY: 'slate',
}

const STATUS_LABELS = {
  DA_XAC_NHAN: 'Đã xác nhận',
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_HOAN_THANH: 'Đã hoàn thành',
  DA_HUY: 'Đã hủy',
}

function Icon({ type }) {
  const paths = {
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 3v4m8-4v4M4 10h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />,
    document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 3h7l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5M9 13h6m-6 4h6" />,
  }
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  )
}

function formatPrice(vnd) {
  return (vnd || 0).toLocaleString('vi-VN') + ' đ/tháng'
}

function formatShortPrice(vnd) {
  if (!vnd) return ''
  if (vnd >= 1_000_000) return `${(vnd / 1_000_000).toFixed(vnd % 1_000_000 === 0 ? 0 : 1)} triệu/tháng`
  return vnd.toLocaleString('vi-VN') + ' đ/tháng'
}

export default function TenantDashboardPage() {
  const navigate = useNavigate()
  const { userInfo } = useOutletContext()
  const displayName = userInfo?.hoTen || 'Người dùng'

  const [appointments, setAppointments] = useState([])
  const [properties, setProperties] = useState([])
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      viewingService.getMyViewingSchedules(),
      viewingService.getPublicProperties(),
      hopDongThueService.cuaToi(),
    ])
      .then(([schedulesRes, propsRes, contractsRes]) => {
        if (schedulesRes.status === 'fulfilled' && schedulesRes.value?.data) {
          setAppointments(schedulesRes.value.data.slice(0, 5))
        }
        if (propsRes.status === 'fulfilled' && propsRes.value?.data) {
          setProperties(propsRes.value.data.slice(0, 6))
        }
        if (contractsRes.status === 'fulfilled' && contractsRes.value?.data) {
          setContracts(contractsRes.value.data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const savedCount = JSON.parse(localStorage.getItem('savedProperties') || '[]').length
  const upcomingCount = appointments.filter(a => a.trangThai === 'CHO_XAC_NHAN' || a.trangThai === 'DA_XAC_NHAN').length
  const activeContracts = contracts.filter(c => c.trangThai === 'DANG_HIEU_LUC' || c.trangThai === 'CON_HIEU_LUC').length

  const kpiData = [
    { label: 'Nhà đã lưu', value: savedCount || '0', change: savedCount > 0 ? `${savedCount} nhà quan tâm` : 'Chưa lưu nhà nào', tone: 'blue', icon: 'heart' },
    { label: 'Lịch xem sắp tới', value: String(upcomingCount).padStart(2, '0'), change: appointments.length > 0 ? `${appointments.length} lịch đã đặt` : 'Chưa có lịch xem', tone: 'orange', icon: 'calendar' },
    { label: 'Hợp đồng hiệu lực', value: String(activeContracts), change: activeContracts > 0 ? `${activeContracts} hợp đồng` : 'Chưa có hợp đồng', tone: 'violet', icon: 'document' },
  ]

  const openProperty = (propertyId) => navigate(`/bat-dong-san/${propertyId}`)

  const handleCardKeyDown = (event, propertyId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProperty(propertyId)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-panel-enter mx-auto max-w-[1500px] space-y-7">
      <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <p className="text-sm font-medium text-primary-container">Tổng quan khách hàng</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface">
            Xin chào, {displayName}
          </h1>
          <p className="mt-2 text-sm text-slate-500">Chào mừng quay trở lại hệ thống</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/tenant/tim-nha" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Tìm nhà mới
          </Link>
          <Link to="/tenant/dat-lich-xem" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600">
            Đặt lịch xem nhà
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpiData.map((card) => (
          <div key={card.label} className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-on-surface">{card.value}</p>
                <p className="mt-2 text-xs font-medium text-slate-500">{card.change}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONES[card.tone]}`}>
                <Icon type={card.icon} />
              </span>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-6">
          {/* Gợi ý bất động sản */}
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Bất động sản nổi bật</h2>
                <p className="mt-1 text-sm text-slate-500">Đề xuất cho bạn</p>
              </div>
              <Link to="/tenant/tim-nha" className="text-sm font-semibold text-primary-container hover:underline">Xem tất cả</Link>
            </div>
            {properties.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">Chưa có bất động sản nào</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((item) => (
                  <Link key={item.id} to={`/bat-dong-san/${item.id}`} className="group overflow-hidden rounded-2xl border border-slate-100">
                    <div className="h-32 bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="p-3.5">
                      <p className="truncate text-sm font-semibold text-on-surface">{item.loaiNha} {item.diaChi}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.diaChi}</p>
                      <p className="mt-2 text-sm font-bold text-primary-container">{formatShortPrice(item.giaThue)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {/* Hồ sơ nhanh */}
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface">Hồ sơ nhanh</h2>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-lg font-bold text-white">
                {displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-on-surface">{displayName}</p>
                <p className="text-xs text-slate-500">Thành viên</p>
              </div>
            </div>
            <Link to="/tenant/ho-so" className="mt-4 block w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Chỉnh sửa hồ sơ
            </Link>
          </section>

          {/* Lịch xem sắp tới */}
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">Lịch xem sắp tới</h2>
              <Link to="/tenant/lich-xem" className="text-xs font-semibold text-primary-container">Xem lịch</Link>
            </div>
            {appointments.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-slate-500">Chưa có lịch xem nào</p>
                <Link to="/tenant/dat-lich-xem" className="mt-2 inline-block text-sm font-medium text-primary-container hover:underline">
                  Đặt lịch xem nhà
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => {
                  const date = apt.thoiGian ? new Date(apt.thoiGian) : null
                  const day = date ? date.getDate() : '--'
                  const month = date ? `TH${String(date.getMonth() + 1).padStart(2, '0')}` : ''
                  const time = date ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : ''
                  const statusLabel = STATUS_LABELS[apt.trangThai] || apt.trangThai || ''
                  const statusTone = STATUS_TONES[apt.trangThai] || 'slate'
                  return (
                    <div key={apt.id} className="flex gap-3">
                      <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-primary-container">
                        <span className="text-lg font-bold leading-none">{day}</span>
                        <span className="text-[10px] font-semibold">{month}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-on-surface">{apt.batDongSan?.loaiNha || apt.batDongSan?.diaChi || `BĐS #${apt.batDongSanId || apt.id}`}</p>
                        <p className="mt-1 text-xs text-slate-500">{time} - {apt.batDongSan?.diaChi || ''}</p>
                        <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${TONES[statusTone]}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}