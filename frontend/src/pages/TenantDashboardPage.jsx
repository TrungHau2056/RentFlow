import { Link, useNavigate, useOutletContext } from 'react-router-dom'

const KPI_DATA = [
  { label: 'Nhà đã lưu', value: '12', change: '+3 trong tuần', tone: 'blue', icon: 'heart' },
  { label: 'Lịch xem sắp tới', value: '02', change: 'Lịch gần nhất: 28/05', tone: 'orange', icon: 'calendar' },
  { label: 'Thông báo mới', value: '05', change: '3 nhà phù hợp', tone: 'emerald', icon: 'bell' },
  { label: 'Hợp đồng hiệu lực', value: '01', change: 'Đến 15/01/2027', tone: 'violet', icon: 'document' },
]

const SAVED_PROPERTIES = [
  {
    id: 1,
    title: 'Căn hộ Lumière Riverside',
    district: 'Tây Hồ, Hà Nội',
    price: '23.000.000 đ/tháng',
    area: '92 m²',
    status: 'Sẵn sàng xem',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&h=450&fit=crop',
  },
  {
    id: 2,
    title: 'Nhà phố cao cấp Cầu Giấy',
    district: 'Cầu Giấy, Hà Nội',
    price: '31.000.000 đ/tháng',
    area: '125 m²',
    status: 'Mới cập nhật',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=450&fit=crop',
  },
]

const APPOINTMENTS = [
  { date: '28', month: 'TH05', time: '09:30 - 10:30', title: 'Căn hộ Lumière Riverside', location: 'Tây Hồ, Hà Nội', status: 'Đã xác nhận', tone: 'emerald' },
  { date: '30', month: 'TH05', time: '14:00 - 15:00', title: 'Villa Starlake', location: 'Bắc Từ Liêm, Hà Nội', status: 'Chờ xác nhận', tone: 'orange' },
  { date: '20', month: 'TH05', time: '10:00 - 11:00', title: 'Căn hộ Metropolis', location: 'Ba Đình, Hà Nội', status: 'Đã hoàn thành', tone: 'slate' },
]

const NOTIFICATIONS = [
  { title: 'Có 3 căn nhà mới phù hợp', message: 'Khu vực Tây Hồ, ngân sách dưới 25 triệu.', time: '5 phút trước', tone: 'blue' },
  { title: 'Nhắc lịch xem nhà ngày mai', message: 'Lumière Riverside lúc 09:30.', time: '2 giờ trước', tone: 'orange' },
  { title: 'Hợp đồng đã được cập nhật', message: 'Phụ lục thanh toán tháng 06 đã sẵn sàng.', time: 'Hôm qua', tone: 'emerald' },
]

const RECOMMENDATIONS = [
  {
    id: 3,
    title: 'Studio view hồ hiện đại',
    district: 'Tây Hồ',
    price: '16 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=350&fit=crop',
  },
  {
    id: 4,
    title: 'Penthouse trung tâm',
    district: 'Ba Đình',
    price: '38 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=350&fit=crop',
  },
  {
    id: 5,
    title: 'Căn hộ tối giản',
    district: 'Nam Từ Liêm',
    price: '19 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=350&fit=crop',
  },
]

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

export default function TenantDashboardPage() {
  const navigate = useNavigate()
  const { userInfo } = useOutletContext()
  const displayName = userInfo?.hoTen || 'Nguyễn Văn A'

  const openProperty = (propertyId) => navigate(`/bat-dong-san/${propertyId}`)

  const handleCardKeyDown = (event, propertyId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProperty(propertyId)
    }
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
          <Link to="/bat-dong-san" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Tìm nhà mới
          </Link>
          <button type="button" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600">
            Đặt lịch xem nhà
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_DATA.map((card) => (
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
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Nhà đã lưu gần đây</h2>
                <p className="mt-1 text-sm text-slate-500">Danh sách bạn đang quan tâm nhất</p>
              </div>
              <button type="button" className="hidden text-sm font-semibold text-primary-container hover:underline sm:block">Xem tất cả</button>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {SAVED_PROPERTIES.map((property) => (
                <article
                  key={property.id}
                  role="link"
                  tabIndex={0}
                  aria-label={`Xem chi tiết ${property.title}`}
                  onClick={() => openProperty(property.id)}
                  onKeyDown={(event) => handleCardKeyDown(event, property.id)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={property.image} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {property.status}
                    </span>
                    <button type="button" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} aria-label="Bỏ lưu" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
                      <Icon type="heart" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-on-surface">{property.title}</h3>
                    <p className="mt-2 text-lg font-bold text-primary-container">{property.price}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                      <span>{property.district}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{property.area}</span>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/tenant/dat-lich-xem?propertyId=${property.id}`}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                        className="block w-full rounded-xl bg-orange-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-600"
                      >
                        Đặt lịch xem
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Gợi ý bất động sản</h2>
                <p className="mt-1 text-sm text-slate-500">Đề xuất theo nhu cầu và nhà bạn đã lưu</p>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">AI gợi ý</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {RECOMMENDATIONS.map((property) => (
                <Link key={property.id} to={`/bat-dong-san/${property.id}`} className="group overflow-hidden rounded-2xl border border-slate-100">
                  <img src={property.image} alt={property.title} className="h-32 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-3.5">
                    <p className="truncate text-sm font-semibold text-on-surface">{property.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{property.district}</p>
                    <p className="mt-2 text-sm font-bold text-primary-container">{property.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button type="button" className="mt-5 w-full rounded-xl border border-primary-container/20 bg-blue-50 py-3 text-sm font-semibold text-primary-container transition hover:bg-blue-100">
              Xem thêm gợi ý phù hợp
            </button>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface">Hồ sơ nhanh</h2>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-lg font-bold text-white">NA</div>
              <div>
                <p className="font-semibold text-on-surface">{displayName}</p>
                <p className="text-xs text-slate-500">Thành viên xác minh</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-primary p-4 text-white">
              <p className="text-xs text-blue-100">Trạng thái thành viên</p>
              <p className="mt-1 font-semibold">Premium Member</p>
              <p className="mt-2 text-xs text-blue-100">Hiệu lực đến 31/12/2026</p>
            </div>
            <button type="button" className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Chỉnh sửa hồ sơ
            </button>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">Lịch xem sắp tới</h2>
              <button type="button" className="text-xs font-semibold text-primary-container">Xem lịch</button>
            </div>
            <div className="space-y-4">
              {APPOINTMENTS.map((appointment) => (
                <div key={`${appointment.date}-${appointment.title}`} className="flex gap-3">
                  <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-primary-container">
                    <span className="text-lg font-bold leading-none">{appointment.date}</span>
                    <span className="text-[10px] font-semibold">{appointment.month}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-on-surface">{appointment.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{appointment.time} - {appointment.location}</p>
                    <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${TONES[appointment.tone]}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">Thông báo mới</h2>
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">3 mới</span>
            </div>
            <div className="space-y-3">
              {NOTIFICATIONS.map((notification) => (
                <div key={notification.title} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${NOTIFICATION_DOTS[notification.tone]}`} />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{notification.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{notification.message}</p>
                    <p className="mt-2 text-[11px] text-slate-400">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
