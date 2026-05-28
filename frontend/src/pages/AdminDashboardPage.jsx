import { Link } from 'react-router-dom'

// ── Mock Data ──

const KPI_DATA = [
  {
    id: 'tong_bds',
    label: 'Tổng bất động sản',
    value: '156',
    growth: '+12',
    growthLabel: 'tháng này',
    growthType: 'up',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    sparkline: [30, 45, 35, 50, 42, 60, 55],
  },
  {
    id: 'dang_cho_thue',
    label: 'Nhà đang cho thuê',
    value: '89',
    growth: '+5',
    growthLabel: 'tháng này',
    growthType: 'up',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    sparkline: [50, 55, 52, 60, 58, 65, 62],
  },
  {
    id: 'hop_dong_hieu_luc',
    label: 'Hợp đồng hiệu lực',
    value: '73',
    growth: '+8',
    growthLabel: 'tháng này',
    growthType: 'up',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    sparkline: [40, 45, 50, 48, 55, 52, 60],
  },
  {
    id: 'doanh_thu_hoa_hong',
    label: 'Doanh thu hoa hồng',
    value: '2.4',
    unit: 'tỷ',
    growth: '+18%',
    growthLabel: 'so với tháng trước',
    growthType: 'up',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    sparkline: [120, 150, 135, 180, 170, 200, 220],
  },
  {
    id: 'tien_dam_bao',
    label: 'Tiền đảm bảo đang giữ',
    value: '3.8',
    unit: 'tỷ',
    growth: '',
    growthLabel: '',
    growthType: 'neutral',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    sparkline: [280, 290, 300, 310, 320, 340, 350],
  },
  {
    id: 'khach_hang_moi',
    label: 'Khách hàng mới',
    value: '34',
    growth: '+7',
    growthLabel: 'tuần này',
    growthType: 'up',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    sparkline: [15, 20, 18, 25, 22, 30, 28],
  },
]

const REVENUE_DATA = [
  { thang: 'T1', giaTri: 1.2, hopDong: 8 },
  { thang: 'T2', giaTri: 1.5, hopDong: 11 },
  { thang: 'T3', giaTri: 0.9, hopDong: 6 },
  { thang: 'T4', giaTri: 1.8, hopDong: 14 },
  { thang: 'T5', giaTri: 2.1, hopDong: 18 },
  { thang: 'T6', giaTri: 1.7, hopDong: 12 },
  { thang: 'T7', giaTri: 2.4, hopDong: 21 },
  { thang: 'T8', giaTri: 2.0, hopDong: 16 },
  { thang: 'T9', giaTri: 2.6, hopDong: 22 },
  { thang: 'T10', giaTri: 2.3, hopDong: 19 },
  { thang: 'T11', giaTri: 2.8, hopDong: 24 },
  { thang: 'T12', giaTri: 2.4, hopDong: 20 },
]

const BDS_MOI_DATA = [
  { thang: 'T1', soLuong: 8 },
  { thang: 'T2', soLuong: 12 },
  { thang: 'T3', soLuong: 9 },
  { thang: 'T4', soLuong: 15 },
  { thang: 'T5', soLuong: 18 },
  { thang: 'T6', soLuong: 14 },
]

const WORKFLOW_ITEMS = [
  {
    id: 1,
    title: 'Hợp đồng chờ duyệt',
    count: 5,
    color: 'bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-600',
    items: ['HĐKG-2025-015 – Căn hộ Times City', 'HĐKG-2025-016 – Nhà phố Cầu Giấy', 'HĐKG-2025-017 – Biệt thự Tây Hồ'],
    link: '/admin/hop-dong-ky-gui',
  },
  {
    id: 2,
    title: 'Nhà chờ khảo sát',
    count: 8,
    color: 'bg-blue-50 border-blue-200',
    dotColor: 'bg-blue-400',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-600',
    items: ['Villa Hoàng Quốc Việt', 'Căn hộ Midtown', 'Kiot Kim Mã'],
    link: '/admin/lich-khao-sat',
  },
  {
    id: 3,
    title: 'Yêu cầu hoàn trả tiền đảm bảo',
    count: 3,
    color: 'bg-red-50 border-red-200',
    dotColor: 'bg-red-400',
    textColor: 'text-red-700',
    iconColor: 'text-red-600',
    items: ['Căn hộ Studio Times City – 30tr', 'Nhà phố Đống Đa – 50tr'],
    link: '/admin/tien-dam-bao',
  },
  {
    id: 4,
    title: 'Hợp đồng sắp hết hạn',
    count: 4,
    color: 'bg-purple-50 border-purple-200',
    dotColor: 'bg-purple-400',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-600',
    items: ['HĐKG-2025-001 – Hết hạn 15/06', 'HĐKG-2025-005 – Hết hạn 22/06'],
    link: '/admin/hop-dong-ky-gui',
  },
]

const ACTIVITY_FEED = [
  { id: 1, type: 'chu_nha_moi', text: 'Chủ nhà Nguyễn Văn A đăng ký ký gửi', time: '10 phút trước', icon: 'user-plus', color: 'bg-blue-100 text-blue-600' },
  { id: 2, type: 'lich_xem', text: 'Khách hàng Trần Thị B đặt lịch xem nhà', time: '25 phút trước', icon: 'calendar', color: 'bg-amber-100 text-amber-600' },
  { id: 3, type: 'hop_dong_moi', text: 'Hợp đồng HĐKG-2025-015 đã được ký', time: '1 giờ trước', icon: 'contract', color: 'bg-emerald-100 text-emerald-600' },
  { id: 4, type: 'hoan_thanh', text: 'Khảo sát biệt thự Vinhomes hoàn thành', time: '2 giờ trước', icon: 'check', color: 'bg-emerald-100 text-emerald-600' },
  { id: 5, type: 'he_thong', text: 'Cập nhật hệ thống RentFlow v2.5.0', time: '3 giờ trước', icon: 'system', color: 'bg-slate-100 text-slate-600' },
  { id: 6, type: 'phap_ly', text: 'HĐKG-2025-012 đã duyệt pháp lý', time: '5 giờ trước', icon: 'legal', color: 'bg-purple-100 text-purple-600' },
  { id: 7, type: 'hoa_hong', text: 'Hoa hồng tháng 5 đã được tính', time: '1 ngày trước', icon: 'money', color: 'bg-amber-100 text-amber-600' },
]

const BROKER_PERFORMANCE = [
  { id: 1, ten: 'Trần Văn Hùng', role: 'Môi giới cao cấp', soKhach: 24, soHopDong: 8, hoaHong: '180tr', hieuSuat: 95, avatar: 'T' },
  { id: 2, ten: 'Lê Quốc Anh', role: 'Môi giới', soKhach: 18, soHopDong: 5, hoaHong: '120tr', hieuSuat: 82, avatar: 'L' },
  { id: 3, ten: 'Phạm Minh Tuấn', role: 'Môi giới', soKhach: 15, soHopDong: 4, hoaHong: '95tr', hieuSuat: 75, avatar: 'P' },
  { id: 4, ten: 'Nguyễn Thị Lan', role: 'Môi giới', soKhach: 12, soHopDong: 3, hoaHong: '72tr', hieuSuat: 68, avatar: 'N' },
  { id: 5, ten: 'Đỗ Văn Kiên', role: 'Môi giới mới', soKhach: 8, soHopDong: 2, hoaHong: '48tr', hieuSuat: 55, avatar: 'Đ' },
]

const NOTIFICATION_ALERTS = [
  { id: 1, type: 'warning', title: 'BĐS quá hạn 6 tháng chưa cho thuê', count: 3, detail: 'Căn hộ Times City, Nhà phố Đống Đa, Kiot Kim Mã', color: 'bg-red-50 border-red-200 text-red-700' },
  { id: 2, type: 'warning', title: 'Hợp đồng sắp hết hạn trong 30 ngày', count: 4, detail: 'Cần gia hạn hoặc chấm dứt', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 3, type: 'info', title: 'Yêu cầu duyệt pháp lý', count: 2, detail: 'Đang chờ bộ phận pháp lý xử lý', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 4, type: 'info', title: 'Hợp đồng pending', count: 5, detail: 'Chờ chủ nhà xác nhận và ký', color: 'bg-purple-50 border-purple-200 text-purple-700' },
]

const QUICK_ACTIONS = [
  { id: 1, label: 'Tạo hợp đồng', icon: 'contract', color: 'bg-blue-600 hover:bg-blue-700', link: '/admin/hop-dong-ky-gui' },
  { id: 2, label: 'Phân công môi giới', icon: 'broker', color: 'bg-purple-600 hover:bg-purple-700', link: '/admin/phan-cong-moi-gioi' },
  { id: 3, label: 'Duyệt pháp lý', icon: 'legal', color: 'bg-emerald-600 hover:bg-emerald-700', link: '/admin/phap-luat' },
  { id: 4, label: 'Xuất báo cáo', icon: 'report', color: 'bg-amber-600 hover:bg-amber-700', link: '/admin/bao-cao' },
]

// ── Components ──

function Sparkline({ data, color = 'blue' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 28
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  const colorMap = { blue: '#2563eb', emerald: '#059669', purple: '#7c3aed', amber: '#d97706', indigo: '#4f46e5', cyan: '#0891b2' }
  const strokeColor = colorMap[color] || colorMap.blue

  return (
    <svg width={w} height={h} className="opacity-40 group-hover:opacity-70 transition-opacity">
      <polyline fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

function KPICard({ data }) {
  const sparkColor = data.color.replace('text-', '').replace('-600', '')
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{data.label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800">{data.value}</span>
            {data.unit && <span className="text-sm text-slate-500">{data.unit}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl ${data.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform ${data.color}`}>
          {data.icon}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          {data.growthType === 'up' && (
            <>
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm text-emerald-600 font-medium">{data.growth}</span>
            </>
          )}
          {data.growthType === 'neutral' && (
            <span className="text-sm text-slate-400">—</span>
          )}
          <span className="text-xs text-slate-400">{data.growthLabel}</span>
        </div>
        <Sparkline data={data.sparkline} color={sparkColor} />
      </div>
    </div>
  )
}

function RevenueChart() {
  const maxVal = Math.max(...REVENUE_DATA.map(d => d.giaTri))
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Doanh thu theo tháng</h3>
            <p className="text-xs text-slate-400 mt-0.5">Đơn vị: tỷ VNĐ</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-blue-500" /> Doanh thu
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-amber-400" /> Hợp đồng
            </span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="h-64 flex items-end gap-2">
          {REVENUE_DATA.map((item, idx) => {
            const height = (item.giaTri / maxVal) * 100
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">{item.giaTri} tỷ</span>
                <div className="w-full relative">
                  <div
                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-colors"
                    style={{ height: `${height * 2.2}px` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{item.thang}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ContractChart() {
  const maxVal = Math.max(...BDS_MOI_DATA.map(d => d.soLuong))
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Nhà ký gửi mới</h3>
        <p className="text-xs text-slate-400 mt-0.5">6 tháng gần nhất</p>
      </div>
      <div className="p-5">
        <div className="h-52 flex items-end gap-3">
          {BDS_MOI_DATA.map((item, idx) => {
            const height = (item.soLuong / maxVal) * 100
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500 font-medium">{item.soLuong}</span>
                <div
                  className="w-full bg-emerald-400 hover:bg-emerald-500 rounded-t transition-colors"
                  style={{ height: `${height * 1.8}px` }}
                />
                <span className="text-xs text-slate-400 mt-1">{item.thang}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function WorkflowCard({ item }) {
  return (
    <Link to={item.link} className={`rounded-xl border p-4 ${item.color} hover:shadow-md transition-all block`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
          <h4 className={`text-sm font-semibold ${item.textColor}`}>{item.title}</h4>
        </div>
        <span className={`text-xl font-bold ${item.textColor}`}>{item.count}</span>
      </div>
      <div className="space-y-1.5">
        {item.items.map((sub, i) => (
          <p key={i} className="text-xs text-slate-600 truncate flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
            {sub}
          </p>
        ))}
        {item.count > item.items.length && (
          <p className="text-xs text-slate-400 pl-2.5">+{item.count - item.items.length} khác</p>
        )}
      </div>
    </Link>
  )
}

function ActivityFeed() {
  const getIcon = (type) => {
    const icons = {
      'user-plus': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      calendar: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      contract: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      check: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
      system: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      legal: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      money: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
    return icons[type] || icons.system
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Hoạt động gần đây</h3>
      </div>
      <div className="p-4">
        <div className="space-y-0">
          {ACTIVITY_FEED.map((item, i) => (
            <div key={item.id} className="flex gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                  {getIcon(item.icon)}
                </div>
                {i < ACTIVITY_FEED.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm text-slate-700 font-medium leading-snug">{item.text}</p>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BrokerTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Hiệu suất môi giới</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tháng 5/2025</p>
          </div>
          <Link to="/admin/phan-cong-moi-gioi" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Chi tiết
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase">Môi giới</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Khách</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase">HĐ</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Hoa hồng</th>
              <th className="text-center py-3 px-5 text-xs font-semibold text-slate-500 uppercase">Hiệu suất</th>
            </tr>
          </thead>
          <tbody>
            {BROKER_PERFORMANCE.map((b, idx) => (
              <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        idx === 0 ? 'bg-amber-100 text-amber-700' :
                        idx === 1 ? 'bg-slate-200 text-slate-700' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {b.avatar}
                      </div>
                      {idx < 3 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-bold text-white">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{b.ten}</p>
                      <p className="text-xs text-slate-400">{b.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-sm text-slate-600">{b.soKhach}</td>
                <td className="py-3 px-3 text-center text-sm text-slate-600">{b.soHopDong}</td>
                <td className="py-3 px-3 text-center text-sm font-medium text-slate-800">{b.hoaHong}</td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          b.hieuSuat >= 80 ? 'bg-emerald-500' :
                          b.hieuSuat >= 60 ? 'bg-amber-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${b.hieuSuat}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-8 text-right">{b.hieuSuat}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NotificationPanel() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Thông báo quan trọng</h3>
      </div>
      <div className="p-4 space-y-3">
        {NOTIFICATION_ALERTS.map(alert => (
          <div key={alert.id} className={`rounded-lg border p-3 ${alert.color}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold">{alert.title}</p>
              <span className="text-lg font-bold">{alert.count}</span>
            </div>
            <p className="text-xs opacity-70">{alert.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickActions() {
  const getIcon = (icon) => {
    const icons = {
      contract: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      broker: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6a2 2 0 11-4 0 2 2 0 014 0zM4 6a2 2 0 114 0 2 2 0 01-4 0z" />
        </svg>
      ),
      legal: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      report: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    }
    return icons[icon] || icons.contract
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {QUICK_ACTIONS.map(action => (
        <Link
          key={action.id}
          to={action.link}
          className={`${action.color} text-white rounded-xl p-4 flex items-center gap-3 transition-colors shadow-md hover:shadow-lg`}
        >
          {getIcon(action.icon)}
          <span className="text-sm font-semibold">{action.label}</span>
        </Link>
      ))}
    </div>
  )
}

// ── Main Page ──

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard quản trị</h1>
          <p className="text-slate-500 text-sm mt-1">Tổng quan hoạt động hệ thống ký gửi và cho thuê nhà</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Tháng 5/2025
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {KPI_DATA.map(kpi => (
          <KPICard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <ContractChart />
      </div>

      {/* Workflow Monitoring */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Theo dõi quy trình
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {WORKFLOW_ITEMS.map(item => (
            <WorkflowCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Main Content Grid: Broker + Activity + Notifications + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Broker Performance */}
        <div className="lg:col-span-2">
          <BrokerTable />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <NotificationPanel />
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Thao tác nhanh</h3>
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  )
}