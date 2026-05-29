import { useMemo, useState } from 'react'

const LEAD_STATUS = {
  lead_moi: {
    label: 'Lead mới',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  },
  dang_tu_van: {
    label: 'Đang tư vấn',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  dang_dam_phan: {
    label: 'Đang đàm phán',
    className: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  },
  da_ky_hop_dong: {
    label: 'Đã ký hợp đồng',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
}

const ACTIVITY_STYLE = {
  call: { label: 'Gọi điện', className: 'bg-blue-100 text-blue-700' },
  message: { label: 'Nhắn tin', className: 'bg-cyan-100 text-cyan-700' },
  viewing: { label: 'Xem nhà', className: 'bg-amber-100 text-amber-700' },
  negotiation: { label: 'Đàm phán', className: 'bg-violet-100 text-violet-700' },
  contract: { label: 'Ký hợp đồng', className: 'bg-emerald-100 text-emerald-700' },
  meeting: { label: 'Meeting', className: 'bg-slate-100 text-slate-700' },
  follow_up: { label: 'Follow-up', className: 'bg-rose-100 text-rose-700' },
}

const CUSTOMERS = [
  {
    id: 'KH-1001',
    name: 'Trần Thị Bích Ngọc',
    phone: '0912 345 678',
    email: 'ngoc.tran@example.com',
    demand: 'Căn hộ 2PN gần trung tâm',
    propertyType: 'Căn hộ',
    area: 'Tây Hồ',
    budget: '18 - 25 triệu',
    broker: 'Trần Văn Hùng',
    status: 'dang_tu_van',
    source: 'Website',
    cccd: '001188004212',
    address: '12 Thụy Khuê, Tây Hồ, Hà Nội',
    lastContact: '29/05/2026',
    priority: 'Cao',
    viewingSchedules: [
      { id: 'LX-201', time: '30/05/2026 09:30', property: 'Căn hộ 2PN Watermark', status: 'Đã xác nhận' },
      { id: 'LX-202', time: '01/06/2026 16:00', property: 'Căn hộ 2PN D’. Le Roi Soleil', status: 'Chờ phản hồi' },
    ],
    activities: [
      { type: 'call', time: 'Hôm nay, 09:10', title: 'Gọi xác nhận ngân sách và thời gian chuyển vào', by: 'Trần Văn Hùng' },
      { type: 'message', time: '28/05/2026, 19:20', title: 'Gửi shortlist 3 căn hộ Tây Hồ', by: 'Trần Văn Hùng' },
      { type: 'viewing', time: '27/05/2026, 10:00', title: 'Đã xem căn hộ Watermark', by: 'Lễ tân giao dịch' },
    ],
    contracts: [],
  },
  {
    id: 'KH-1002',
    name: 'Nguyễn Văn Minh',
    phone: '0903 456 789',
    email: 'minh.nguyen@example.com',
    demand: 'Nhà phố làm văn phòng',
    propertyType: 'Nhà phố',
    area: 'Cầu Giấy',
    budget: '35 - 50 triệu',
    broker: 'Lê Quốc Anh',
    status: 'lead_moi',
    source: 'Hotline',
    cccd: '001082009822',
    address: '88 Duy Tân, Cầu Giấy, Hà Nội',
    lastContact: '29/05/2026',
    priority: 'Trung bình',
    viewingSchedules: [
      { id: 'LX-203', time: '31/05/2026 14:30', property: 'Nhà phố Trung Kính', status: 'Mới tạo' },
    ],
    activities: [
      { type: 'call', time: 'Hôm nay, 08:45', title: 'Tiếp nhận lead từ hotline', by: 'CSKH' },
      { type: 'follow_up', time: 'Hôm nay, 09:00', title: 'Tạo nhiệm vụ gọi tư vấn lần 1', by: 'Lê Quốc Anh' },
    ],
    contracts: [],
  },
  {
    id: 'KH-1003',
    name: 'Lê Hoàng Anh',
    phone: '0918 567 890',
    email: 'anh.le@example.com',
    demand: 'Biệt thự cho gia đình 5 người',
    propertyType: 'Biệt thự',
    area: 'Tây Hồ',
    budget: '70 - 90 triệu',
    broker: 'Nguyễn Thị Lan',
    status: 'dang_dam_phan',
    source: 'Referral',
    cccd: '001079003455',
    address: '46 Xuân Diệu, Tây Hồ, Hà Nội',
    lastContact: '28/05/2026',
    priority: 'Cao',
    viewingSchedules: [
      { id: 'LX-204', time: '26/05/2026 15:00', property: 'Biệt thự sân vườn Tây Hồ', status: 'Hoàn tất' },
      { id: 'LX-205', time: '29/05/2026 17:00', property: 'Villa Ciputra K3', status: 'Đã xác nhận' },
    ],
    activities: [
      { type: 'negotiation', time: '28/05/2026, 16:30', title: 'Đàm phán giảm giá thuê 5%', by: 'Nguyễn Thị Lan' },
      { type: 'meeting', time: '27/05/2026, 11:00', title: 'Meeting cùng chủ nhà về điều khoản nuôi thú cưng', by: 'Pháp luật' },
      { type: 'viewing', time: '26/05/2026, 15:00', title: 'Khách xem biệt thự sân vườn Tây Hồ', by: 'Nguyễn Thị Lan' },
    ],
    contracts: [],
  },
  {
    id: 'KH-1004',
    name: 'Phạm Thị Lan',
    phone: '0905 678 901',
    email: 'lan.pham@example.com',
    demand: 'Studio gần khu phố cổ',
    propertyType: 'Studio',
    area: 'Hoàn Kiếm',
    budget: '10 - 14 triệu',
    broker: 'Trần Văn Hùng',
    status: 'da_ky_hop_dong',
    source: 'Facebook',
    cccd: '001190007611',
    address: '22 Hàng Bạc, Hoàn Kiếm, Hà Nội',
    lastContact: '25/05/2026',
    priority: 'Đã chốt',
    viewingSchedules: [
      { id: 'LX-206', time: '22/05/2026 09:00', property: 'Studio Tràng Tiền', status: 'Hoàn tất' },
    ],
    activities: [
      { type: 'contract', time: '25/05/2026, 14:00', title: 'Ký hợp đồng thuê Studio Tràng Tiền', by: 'Pháp luật' },
      { type: 'negotiation', time: '24/05/2026, 10:30', title: 'Thống nhất tiền cọc và ngày nhận nhà', by: 'Trần Văn Hùng' },
      { type: 'viewing', time: '22/05/2026, 09:00', title: 'Khách xem Studio Tràng Tiền', by: 'Trần Văn Hùng' },
    ],
    contracts: [
      { id: 'HĐT-2026-041', property: 'Studio Tràng Tiền', period: '01/06/2026 - 31/05/2027', value: '12 triệu/tháng', status: 'Hiệu lực' },
    ],
  },
  {
    id: 'KH-1005',
    name: 'Đỗ Văn Tuấn',
    phone: '0913 789 012',
    email: 'tuan.do@example.com',
    demand: 'Căn hộ 3PN cho chuyên gia',
    propertyType: 'Căn hộ 3PN',
    area: 'Nam Từ Liêm',
    budget: '25 - 35 triệu',
    broker: 'Lê Quốc Anh',
    status: 'dang_tu_van',
    source: 'LinkedIn',
    cccd: '001085002998',
    address: '10 Mễ Trì, Nam Từ Liêm, Hà Nội',
    lastContact: '27/05/2026',
    priority: 'Trung bình',
    viewingSchedules: [
      { id: 'LX-207', time: '02/06/2026 10:00', property: 'Căn hộ The Matrix One', status: 'Đã xác nhận' },
    ],
    activities: [
      { type: 'message', time: '27/05/2026, 18:00', title: 'Gửi bảng so sánh 4 căn hộ Nam Từ Liêm', by: 'Lê Quốc Anh' },
      { type: 'call', time: '27/05/2026, 09:40', title: 'Tư vấn nhu cầu cho chuyên gia nước ngoài', by: 'Lê Quốc Anh' },
    ],
    contracts: [],
  },
  {
    id: 'KH-1006',
    name: 'Vũ Thị Hồng',
    phone: '0907 890 123',
    email: 'hong.vu@example.com',
    demand: 'Căn hộ dịch vụ có dọn phòng',
    propertyType: 'Căn hộ dịch vụ',
    area: 'Ba Đình',
    budget: '20 - 28 triệu',
    broker: 'Phạm Minh Tuấn',
    status: 'lead_moi',
    source: 'Zalo OA',
    cccd: '001192004321',
    address: '18 Kim Mã, Ba Đình, Hà Nội',
    lastContact: '29/05/2026',
    priority: 'Cao',
    viewingSchedules: [],
    activities: [
      { type: 'message', time: 'Hôm nay, 10:15', title: 'Khách nhắn tin hỏi căn hộ dịch vụ Ba Đình', by: 'CSKH' },
      { type: 'follow_up', time: 'Hôm nay, 10:20', title: 'Chuyển lead cho môi giới phụ trách', by: 'Quản lý sale' },
    ],
    contracts: [],
  },
]

const TABS = [
  { id: 'profile', label: 'Thông tin cá nhân' },
  { id: 'demand', label: 'Nhu cầu thuê' },
  { id: 'viewings', label: 'Lịch xem nhà' },
  { id: 'activity', label: 'Lịch sử làm việc' },
  { id: 'contracts', label: 'Hợp đồng thuê' },
]

function initials(name) {
  return name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function StatusBadge({ status }) {
  const config = LEAD_STATUS[status] || LEAD_STATUS.lead_moi
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}

function ActivityIcon({ type }) {
  const config = ACTIVITY_STYLE[type] || ACTIVITY_STYLE.follow_up

  return (
    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.className}`}>
      {type === 'call' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.5 1.2l-1.5.75a11 11 0 005.72 5.72l.75-1.5a1 1 0 011.2-.5l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V5z" />
        </svg>
      )}
      {type === 'message' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 12h8m-8-4h8m-8 8h5m-9 4l2.5-3H19a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h1" />
        </svg>
      )}
      {type === 'viewing' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M2.5 12C3.7 7.9 7.5 5 12 5s8.3 2.9 9.5 7c-1.2 4.1-5 7-9.5 7s-8.3-2.9-9.5-7z" />
        </svg>
      )}
      {type === 'negotiation' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 12h8M12 8v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
      {type === 'contract' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6L19 8.4V19a2 2 0 01-2 2z" />
        </svg>
      )}
      {(type === 'meeting' || type === 'follow_up') && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </span>
  )
}

function KpiCard({ label, value, note, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <span className={`h-10 w-10 rounded-lg ${accent}`} />
      </div>
    </div>
  )
}

function QuickActionButton({ label, children }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      {children}
      {label}
    </button>
  )
}

function DrawerSection({ title, children }) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function ActivityTimeline({ activities, compact = false }) {
  return (
    <div className="space-y-0">
      {activities.map((activity, index) => (
        <div key={`${activity.time}-${activity.title}`} className="relative flex gap-3 pb-5">
          {index < activities.length - 1 && (
            <span className="absolute left-4 top-9 h-full w-px bg-slate-200" />
          )}
          <ActivityIcon type={activity.type} />
          <div className={compact ? 'min-w-0' : ''}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                {ACTIVITY_STYLE[activity.type]?.label || 'Hoạt động'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{activity.time} · {activity.by}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function CustomerDrawer({ customer, activeTab, setActiveTab, onClose }) {
  if (!customer) return null

  return (
    <>
      <button
        type="button"
        aria-label="Đóng chi tiết khách hàng"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/35"
      />

      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl sm:w-[620px]">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                {initials(customer.name)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{customer.id}</p>
                <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusBadge status={customer.status} />
                  <span className="text-xs text-slate-500">{customer.area} · {customer.broker}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <QuickActionButton label="Phân công">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m8-4.13a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
            </QuickActionButton>
            <QuickActionButton label="Đặt lịch">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </QuickActionButton>
            <QuickActionButton label="Ghi chú">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </QuickActionButton>
            <QuickActionButton label="Chuyển lead">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </QuickActionButton>
          </div>
        </div>

        <div className="border-b border-slate-200 px-5">
          <div className="flex gap-2 overflow-x-auto py-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'profile' && (
            <DrawerSection title="Thông tin cá nhân">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ['Họ tên', customer.name],
                  ['SĐT', customer.phone],
                  ['Email', customer.email],
                  ['CCCD', customer.cccd],
                  ['Địa chỉ', customer.address],
                  ['Nguồn lead', customer.source],
                  ['Môi giới phụ trách', customer.broker],
                  ['Liên hệ gần nhất', customer.lastContact],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <dt className="text-xs font-medium text-slate-500">{label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </DrawerSection>
          )}

          {activeTab === 'demand' && (
            <DrawerSection title="Nhu cầu thuê">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ['Loại nhà', customer.propertyType],
                  ['Khu vực', customer.area],
                  ['Ngân sách', customer.budget],
                  ['Độ ưu tiên', customer.priority],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-blue-50 p-4">
                <p className="text-xs font-medium text-blue-700">Mô tả nhu cầu</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{customer.demand}</p>
              </div>
            </DrawerSection>
          )}

          {activeTab === 'viewings' && (
            <DrawerSection title="Danh sách lịch hẹn">
              {customer.viewingSchedules.length > 0 ? (
                <div className="space-y-3">
                  {customer.viewingSchedules.map((schedule) => (
                    <div key={schedule.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{schedule.property}</p>
                          <p className="mt-1 text-xs text-slate-500">{schedule.id} · {schedule.time}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  Chưa có lịch xem nhà.
                </div>
              )}
            </DrawerSection>
          )}

          {activeTab === 'activity' && (
            <DrawerSection title="Call, meeting, follow-up">
              <ActivityTimeline activities={customer.activities} />
            </DrawerSection>
          )}

          {activeTab === 'contracts' && (
            <DrawerSection title="Danh sách hợp đồng thuê">
              {customer.contracts.length > 0 ? (
                <div className="space-y-3">
                  {customer.contracts.map((contract) => (
                    <div key={contract.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-900">{contract.id}</p>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {contract.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{contract.property}</p>
                      <p className="mt-1 text-xs text-slate-500">{contract.period} · {contract.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  Chưa có hợp đồng thuê.
                </div>
              )}
            </DrawerSection>
          )}
        </div>
      </aside>
    </>
  )
}

export default function CustomersPage() {
  const [areaFilter, setAreaFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [brokerFilter, setBrokerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  const areas = useMemo(() => Array.from(new Set(CUSTOMERS.map((customer) => customer.area))), [])
  const budgets = useMemo(() => Array.from(new Set(CUSTOMERS.map((customer) => customer.budget))), [])
  const brokers = useMemo(() => Array.from(new Set(CUSTOMERS.map((customer) => customer.broker))), [])

  const filteredCustomers = useMemo(() => (
    CUSTOMERS.filter((customer) => {
      const matchesArea = areaFilter === 'all' || customer.area === areaFilter
      const matchesBudget = budgetFilter === 'all' || customer.budget === budgetFilter
      const matchesBroker = brokerFilter === 'all' || customer.broker === brokerFilter
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

      return matchesArea && matchesBudget && matchesBroker && matchesStatus
    })
  ), [areaFilter, brokerFilter, budgetFilter, statusFilter])

  const kpis = useMemo(() => [
    { label: 'Tổng khách hàng', value: CUSTOMERS.length, note: 'Khách thuê trong CRM', accent: 'bg-slate-200' },
    { label: 'Lead mới', value: CUSTOMERS.filter((customer) => customer.status === 'lead_moi').length, note: 'Cần gọi tư vấn', accent: 'bg-blue-100' },
    { label: 'Đang tư vấn', value: CUSTOMERS.filter((customer) => customer.status === 'dang_tu_van').length, note: 'Đang chăm sóc nhu cầu', accent: 'bg-amber-100' },
    { label: 'Đã ký hợp đồng', value: CUSTOMERS.filter((customer) => customer.status === 'da_ky_hop_dong').length, note: 'Chuyển thành khách thuê', accent: 'bg-emerald-100' },
  ], [])

  const recentActivities = useMemo(
    () => CUSTOMERS.flatMap((customer) => (
      customer.activities.slice(0, 1).map((activity) => ({
        ...activity,
        title: `${customer.name}: ${activity.title}`,
      }))
    )).slice(0, 5),
    [],
  )

  function openDrawer(customer, tab = 'profile') {
    setSelectedCustomer(customer)
    setActiveTab(tab)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý khách hàng</h1>
            <p className="mt-1 text-sm text-slate-500">Theo dõi khách thuê và cơ hội kinh doanh</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm khách hàng
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khu vực quan tâm</span>
              <select
                value={areaFilter}
                onChange={(event) => setAreaFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả khu vực</option>
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khoảng giá</span>
              <select
                value={budgetFilter}
                onChange={(event) => setBudgetFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả ngân sách</option>
                {budgets.map((budget) => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Môi giới phụ trách</span>
              <select
                value={brokerFilter}
                onChange={(event) => setBrokerFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả môi giới</option>
                {brokers.map((broker) => (
                  <option key={broker} value={broker}>{broker}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái lead</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả trạng thái</option>
                {Object.entries(LEAD_STATUS).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">CRM Table</h2>
                <p className="text-sm text-slate-500">Hiển thị {filteredCustomers.length} khách thuê phù hợp</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <QuickActionButton label="Phân công môi giới">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m8-4.13a4 4 0 10-8 0 4 4 0 008 0z" />
                  </svg>
                </QuickActionButton>
                <QuickActionButton label="Đặt lịch xem">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </QuickActionButton>
                <QuickActionButton label="Tạo ghi chú">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </QuickActionButton>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1040px] w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {['Họ tên', 'SĐT', 'Email', 'Nhu cầu thuê', 'Khu vực', 'Ngân sách', 'Môi giới', 'Trạng thái'].map((column) => (
                      <th key={column} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="transition hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openDrawer(customer)}
                          className="flex items-center gap-3 text-left"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                            {initials(customer.name)}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-slate-900">{customer.name}</span>
                            <span className="block text-xs text-slate-500">{customer.id} · {customer.source}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{customer.phone}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{customer.email}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{customer.demand}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{customer.area}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{customer.budget}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{customer.broker}</td>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => openDrawer(customer, 'activity')}>
                          <StatusBadge status={customer.status} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">CRM Activity Timeline</h2>
                <p className="text-sm text-slate-500">Gọi điện, nhắn tin, xem nhà, đàm phán, ký hợp đồng</p>
              </div>
            </div>
            <div className="mt-4">
              <ActivityTimeline activities={recentActivities} compact />
            </div>
          </aside>
        </section>
      </div>

      <CustomerDrawer
        customer={selectedCustomer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={() => setSelectedCustomer(null)}
      />
    </main>
  )
}
