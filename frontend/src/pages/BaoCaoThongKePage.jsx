import { useState, useMemo } from 'react'

// ─── Mock Data ───────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: 'T1', revenue: 285000000, contracts: 12 },
  { month: 'T2', revenue: 310000000, contracts: 15 },
  { month: 'T3', revenue: 420000000, contracts: 18 },
  { month: 'T4', revenue: 380000000, contracts: 16 },
  { month: 'T5', revenue: 520000000, contracts: 22 },
  { month: 'T6', revenue: 480000000, contracts: 20 },
  { month: 'T7', revenue: 610000000, contracts: 25 },
  { month: 'T8', revenue: 550000000, contracts: 23 },
  { month: 'T9', revenue: 670000000, contracts: 28 },
  { month: 'T10', revenue: 720000000, contracts: 30 },
  { month: 'T11', revenue: 680000000, contracts: 27 },
  { month: 'T12', revenue: 790000000, contracts: 32 },
]

const REVENUE_BY_AREA = [
  { area: 'Cầu Giấy', value: 890000000 },
  { area: 'Ba Đình', value: 720000000 },
  { area: 'Đống Đa', value: 650000000 },
  { area: 'Hai Bà Trưng', value: 580000000 },
  { area: 'Thanh Xuân', value: 470000000 },
  { area: 'Tây Hồ', value: 420000000 },
  { area: 'Hoàn Kiếm', value: 380000000 },
  { area: 'Long Biên', value: 240000000 },
]

const REVENUE_BY_TYPE = [
  { type: 'Căn hộ chung cư', value: 45, color: '#3b82f6' },
  { type: 'Nhà mặt phố', value: 22, color: '#f59e0b' },
  { type: 'Biệt thự', value: 15, color: '#10b981' },
  { type: 'Nhà trong ngõ', value: 12, color: '#8b5cf6' },
  { type: 'Văn phòng', value: 6, color: '#ef4444' },
]

const PROPERTY_STATUS = [
  { status: 'Đang cho thuê', count: 45, color: '#10b981' },
  { status: 'Đang ký gửi', count: 32, color: '#3b82f6' },
  { status: 'Trống', count: 18, color: '#f59e0b' },
  { status: 'Tạm dừng', count: 5, color: '#ef4444' },
]

const TOP_BROKERS = [
  { id: 1, name: 'Trần Văn Hùng', avatar: null, contracts: 28, revenue: 1250000000, commission: 62500000, rate: 78, clients: 45 },
  { id: 2, name: 'Lê Quốc Anh', avatar: null, contracts: 22, revenue: 980000000, commission: 49000000, rate: 72, clients: 38 },
  { id: 3, name: 'Nguyễn Minh Tú', avatar: null, contracts: 19, revenue: 850000000, commission: 42500000, rate: 68, clients: 32 },
  { id: 4, name: 'Phạm Đức Thắng', avatar: null, contracts: 15, revenue: 620000000, commission: 31000000, rate: 60, clients: 28 },
  { id: 5, name: 'Vũ Thị Lan', avatar: null, contracts: 12, revenue: 480000000, commission: 24000000, rate: 55, clients: 22 },
]

const CUSTOMER_ANALYTICS = {
  newCustomers: 156,
  totalCustomers: 1240,
  conversionRate: 34.5,
  topAreas: [
    { area: 'Cầu Giấy', count: 285 },
    { area: 'Ba Đình', count: 232 },
    { area: 'Đống Đa', count: 198 },
    { area: 'Hai Bà Trưng', count: 167 },
    { area: 'Thanh Xuân', count: 145 },
  ],
  searchTrends: [
    { keyword: 'Căn hộ 2 phòng ngủ', count: 342 },
    { keyword: 'Nhà gần metro', count: 256 },
    { keyword: 'Cho thuê giá rẻ', count: 198 },
    { keyword: 'Căn hộ chung cư cao cấp', count: 176 },
    { keyword: 'Nhà mặt phố kinh doanh', count: 145 },
  ],
  monthlyNew: [12, 15, 18, 14, 22, 20, 25, 23, 28, 30, 27, 32],
}

const CONTRACT_ANALYTICS = {
  kyGui: { total: 87, active: 62, expiring: 12, expired: 8, renewalRate: 78 },
  thue: { total: 65, active: 48, expiring: 9, expired: 5, renewalRate: 82 },
  monthly: [
    { month: 'T1', kyGui: 8, thue: 5 },
    { month: 'T2', kyGui: 10, thue: 7 },
    { month: 'T3', kyGui: 12, thue: 8 },
    { month: 'T4', kyGui: 9, thue: 6 },
    { month: 'T5', kyGui: 14, thue: 10 },
    { month: 'T6', kyGui: 11, thue: 9 },
    { month: 'T7', kyGui: 16, thue: 12 },
    { month: 'T8', kyGui: 13, thue: 11 },
    { month: 'T9', kyGui: 18, thue: 14 },
    { month: 'T10', kyGui: 20, thue: 15 },
    { month: 'T11', kyGui: 17, thue: 13 },
    { month: 'T12', kyGui: 22, thue: 17 },
  ],
}

const FINANCIAL_ANALYTICS = {
  deposits: { total: 128000000, holding: 56000000, refunded: 45000000, deducted: 27000000 },
  cashFlow: [
    { month: 'T1', inflow: 285, outflow: 120 },
    { month: 'T2', inflow: 310, outflow: 135 },
    { month: 'T3', inflow: 420, outflow: 180 },
    { month: 'T4', inflow: 380, outflow: 165 },
    { month: 'T5', inflow: 520, outflow: 220 },
    { month: 'T6', inflow: 480, outflow: 195 },
    { month: 'T7', inflow: 610, outflow: 250 },
    { month: 'T8', inflow: 550, outflow: 230 },
    { month: 'T9', inflow: 670, outflow: 280 },
    { month: 'T10', inflow: 720, outflow: 310 },
    { month: 'T11', inflow: 680, outflow: 290 },
    { month: 'T12', inflow: 790, outflow: 340 },
  ],
}

const INSIGHTS = [
  { id: 1, type: 'warning', title: 'Doanh thu T11 giảm 5.6%', description: 'So với tháng trước, doanh thu tháng 11 giảm nhẹ do số hợp đồng ký gửi ít hơn dự kiến.', action: 'Xem chi tiết' },
  { id: 2, type: 'alert', title: '18 bất động sản quá hạn chưa cho thuê', description: 'Các BDS tại Đống Đa và Hai Bà Trưng đang vượt thời hạn ký gửi mà chưa có khách thuê.', action: 'Xem danh sách' },
  { id: 3, type: 'danger', title: 'Môi giới Vũ Thị Lan hiệu suất thấp', description: 'Tỷ lệ chốt hợp đồng chỉ 55%, thấp hơn mức trung bình 68%. Cần đào tạo bổ sung.', action: 'Xem hồ sơ' },
  { id: 4, type: 'info', title: '9 hợp đồng thuê sắp hết hạn', description: 'Trong 30 ngày tới, 9 hợp đồng thuê sẽ hết hạn. Cần liên hệ gia hạn sớm.', action: 'Xem danh sách' },
  { id: 5, type: 'success', title: 'Tỷ lệ chuyển đổi lead tăng 12%', description: 'Tỷ lệ chuyển đổi khách hàng tiềm năng đạt 34.5%, tăng 12% so với quý trước.', action: null },
]

// ─── Helper Components ───────────────────────────────────────

function formatVND(amount) {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1).replace(/\.0$/, '') + ' tỷ'
  if (amount >= 1000000) return (amount / 1000000).toFixed(0) + ' triệu'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

function Sparkline({ data, width = 80, height = 28, color = '#3b82f6' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={points.split(' ').pop()?.split(',')[0]} cy={points.split(' ').pop()?.split(',')[1]} r={2.5} fill={color} />
    </svg>
  )
}

function GrowthIndicator({ value }) {
  const isPositive = value >= 0
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isPositive ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
      </svg>
      {Math.abs(value)}%
    </span>
  )
}

function KPICard({ icon, label, value, growth, sparkData, sparkColor, bgColor }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-2xl font-bold text-on-surface">{value}</p>
          {growth !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              <GrowthIndicator value={growth} />
              <span className="text-xs text-on-surface-variant">vs tháng trước</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
        </div>
      </div>
    </div>
  )
}

function BarChart({ data, maxVal, labelKey, valueKey, valueFormat, barColor = '#3b82f6', height = 200 }) {
  const max = maxVal || Math.max(...data.map(d => d[valueKey]))
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = (item[valueKey] / max) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <span className="text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {valueFormat ? valueFormat(item[valueKey]) : item[valueKey]}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80"
              style={{ height: `${barHeight}%`, backgroundColor: barColor, minHeight: 4 }}
            />
            <span className="text-[10px] text-on-surface-variant truncate w-full text-center">{item[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}

function DonutChart({ data, size = 160, strokeWidth = 28 }) {
  const total = data.reduce((sum, d) => sum + d.count || sum + d.value, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const segments = data.reduce((acc, item) => {
    const val = item.count || item.value
    const pct = val / total
    const dashArray = `${pct * circumference} ${(1 - pct) * circumference}`
    const dashOffset = -acc.offset * circumference

    return {
      offset: acc.offset + pct,
      items: [...acc.items, { ...item, pct, dashArray, dashOffset }],
    }
  }, { offset: 0, items: [] }).items

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="shrink-0">
        {segments.map((item, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={item.dashArray}
            strokeDashoffset={item.dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="transition-all duration-500"
          />
        ))}
        <text x={size / 2} y={size / 2 - 8} textAnchor="middle" className="text-2xl font-bold" fill="#051a3e">{total}</text>
        <text x={size / 2} y={size / 2 + 12} textAnchor="middle" className="text-xs" fill="#434654">tổng</text>
      </svg>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-on-surface-variant">{item.status || item.type}</span>
            <span className="text-sm font-medium text-on-surface ml-auto">{item.count || item.value}{item.count ? '' : '%'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBar({ label, value, max, color = '#3b82f6' }) {
  const pct = (value / max) * 100
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-on-surface w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-7 bg-slate-100 rounded-md overflow-hidden relative">
        <div className="h-full rounded-md transition-all duration-700 flex items-center" style={{ width: `${pct}%`, backgroundColor: color }}>
          {pct > 20 && <span className="text-[10px] text-white font-medium ml-2">{value}</span>}
        </div>
      </div>
      {pct <= 20 && <span className="text-xs text-on-surface-variant">{value}</span>}
    </div>
  )
}

function InsightCard({ insight }) {
  const config = {
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', iconBg: 'bg-amber-100' },
    alert: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', iconBg: 'bg-blue-100' },
    danger: { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-600', iconBg: 'bg-rose-100' },
    info: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600', iconBg: 'bg-indigo-100' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  }[insight.type]

  const iconPaths = {
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    alert: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    danger: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}>
          <svg className={`w-5 h-5 ${config.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPaths[insight.type]} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-on-surface">{insight.title}</h4>
          <p className="text-xs text-on-surface-variant mt-1">{insight.description}</p>
          {insight.action && (
            <button className="mt-2 text-xs font-medium text-primary-container hover:underline">{insight.action}</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────

export default function BaoCaoThongKePage() {
  const [dateRange, setDateRange] = useState('thisYear')
  const [exportOpen, setExportOpen] = useState(false)

  const totalRevenue = useMemo(() => MONTHLY_REVENUE.reduce((s, d) => s + d.revenue, 0), [])
  const totalContracts = useMemo(() => MONTHLY_REVENUE.reduce((s, d) => s + d.contracts, 0), [])
  const successRate = 73.5
  const activeProperties = 100
  const newCustomers = CUSTOMER_ANALYTICS.newCustomers
  const totalCommission = TOP_BROKERS.reduce((s, b) => s + b.commission, 0)

  const maxRevenue = Math.max(...MONTHLY_REVENUE.map(d => d.revenue))
  const maxAreaRevenue = Math.max(...REVENUE_BY_AREA.map(d => d.value))
  const maxBrokerRevenue = Math.max(...TOP_BROKERS.map(d => d.revenue))
  const maxCashFlow = Math.max(...FINANCIAL_ANALYTICS.cashFlow.map(d => Math.max(d.inflow, d.outflow)))
  const maxContractMonth = Math.max(...CONTRACT_ANALYTICS.monthly.map(d => Math.max(d.kyGui, d.thue)))

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-on-surface">Báo cáo & Thống kê</h1>
            <p className="text-sm text-on-surface-variant mt-1">Phân tích hoạt động và hiệu suất hệ thống</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            >
              <option value="thisMonth">Tháng này</option>
              <option value="lastMonth">Tháng trước</option>
              <option value="thisQuarter">Quý này</option>
              <option value="lastQuarter">Quý trước</option>
              <option value="thisYear">Năm nay</option>
              <option value="all">Tất cả</option>
            </select>
            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="px-4 py-2 bg-primary-container text-white rounded-lg hover:bg-primary-container/90 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất báo cáo
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-outline-variant rounded-lg shadow-lg py-1 z-10 min-w-40">
                  <button className="w-full px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Xuất PDF
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xuất Excel
                  </button>
                  <div className="border-t border-outline-variant my-1" />
                  <button className="w-full px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Gửi email báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Tổng doanh thu"
            value={formatVND(totalRevenue)}
            growth={12.5}
            sparkData={MONTHLY_REVENUE.map(d => d.revenue / 100000000)}
            sparkColor="#3b82f6"
            bgColor="bg-blue-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            label="Hợp đồng thuê"
            value={totalContracts}
            growth={8.3}
            sparkData={MONTHLY_REVENUE.map(d => d.contracts)}
            sparkColor="#6366f1"
            bgColor="bg-indigo-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Tỷ lệ thuê thành công"
            value={`${successRate}%`}
            growth={5.2}
            sparkData={[65, 68, 70, 69, 72, 71, 74, 73, 75, 76, 74, 73.5]}
            sparkColor="#10b981"
            bgColor="bg-emerald-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            label="BDS active"
            value={activeProperties}
            growth={3.1}
            sparkData={[85, 88, 90, 92, 91, 95, 94, 97, 98, 100, 99, 100]}
            sparkColor="#f59e0b"
            bgColor="bg-amber-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            label="Khách hàng mới"
            value={newCustomers}
            growth={15.8}
            sparkData={CUSTOMER_ANALYTICS.monthlyNew}
            sparkColor="#8b5cf6"
            bgColor="bg-purple-50"
          />
          <KPICard
            icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
            label="Hoa hồng MG"
            value={formatVND(totalCommission)}
            growth={9.4}
            sparkData={[40, 45, 52, 48, 58, 55, 62, 60, 68, 72, 70, 75]}
            sparkColor="#f97316"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Row 2: Revenue + Revenue by Area/Type */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-outline-variant p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-on-surface">Doanh thu theo tháng</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">Tổng doanh thu năm: <span className="font-semibold text-on-surface">{formatVND(totalRevenue)}</span></p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500" /> Doanh thu</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400" /> Hợp đồng</span>
              </div>
            </div>
            <BarChart data={MONTHLY_REVENUE} labelKey="month" valueKey="revenue" maxVal={maxRevenue} valueFormat={(v) => formatVND(v)} barColor="#3b82f6" height={240} />
          </div>

          {/* Revenue by Type */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="text-base font-semibold text-on-surface mb-4">Doanh thu theo loại nhà</h3>
            <DonutChart data={REVENUE_BY_TYPE} size={160} strokeWidth={28} />
            <div className="mt-4 space-y-3">
              {REVENUE_BY_TYPE.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-on-surface-variant flex-1">{item.type}</span>
                  <span className="text-sm font-medium text-on-surface">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Revenue by Area + Property Status */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue by Area */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="text-base font-semibold text-on-surface mb-4">Doanh thu theo khu vực</h3>
            <div className="space-y-3">
              {REVENUE_BY_AREA.map((item, i) => (
                <HorizontalBar key={i} label={item.area} value={formatVND(item.value)} max={formatVND(maxAreaRevenue)} color="#3b82f6" />
              ))}
            </div>
          </div>

          {/* Property Status */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="text-base font-semibold text-on-surface mb-4">Bất động sản theo trạng thái</h3>
            <DonutChart data={PROPERTY_STATUS} size={160} strokeWidth={28} />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-on-surface">{Math.round((45 / 100) * 100)}%</p>
                <p className="text-xs text-on-surface-variant mt-1">Tỷ lệ cho thuê</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">18</p>
                <p className="text-xs text-on-surface-variant mt-1">BDS quá hạn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Broker Performance */}
        <div className="bg-white rounded-xl border border-outline-variant p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-on-surface">Hiệu suất môi giới</h3>
              <p className="text-sm text-on-surface-variant mt-0.5">Top môi giới theo doanh thu và tỷ lệ chốt</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hạng</th>
                  <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Môi giới</th>
                  <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hợp đồng</th>
                  <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Doanh thu</th>
                  <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hoa hồng</th>
                  <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tỷ lệ chốt</th>
                  <th className="pb-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Khách xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TOP_BROKERS.map((broker, i) => (
                  <tr key={broker.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-sm font-semibold text-primary-container">
                          {broker.name.split(' ').map(n => n[0]).join('').slice(-2)}
                        </div>
                        <span className="text-sm font-medium text-on-surface">{broker.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-on-surface font-medium">{broker.contracts}</td>
                    <td className="py-3 text-sm text-on-surface">{formatVND(broker.revenue)}</td>
                    <td className="py-3 text-sm text-on-surface">{formatVND(broker.commission)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${broker.rate >= 70 ? 'bg-emerald-500' : broker.rate >= 55 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${broker.rate}%` }} />
                        </div>
                        <span className={`text-xs font-semibold ${broker.rate >= 70 ? 'text-emerald-600' : broker.rate >= 55 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {broker.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-on-surface">{broker.clients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Broker bar chart */}
          <div className="mt-6 pt-6 border-t border-outline-variant">
            <h4 className="text-sm font-semibold text-on-surface-variant mb-4">Doanh thu môi giới</h4>
            <BarChart data={TOP_BROKERS} labelKey="name" valueKey="revenue" maxVal={maxBrokerRevenue} valueFormat={(v) => formatVND(v)} barColor="#6366f1" height={160} />
          </div>
        </div>

        {/* Row 5: Customer + Contract Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Customer Analytics */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="text-base font-semibold text-on-surface mb-4">Phân tích khách hàng</h3>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-purple-700">{CUSTOMER_ANALYTICS.newCustomers}</p>
                <p className="text-xs text-purple-600 mt-1">Khách mới</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-700">{CUSTOMER_ANALYTICS.totalCustomers}</p>
                <p className="text-xs text-blue-600 mt-1">Tổng khách</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-emerald-700">{CUSTOMER_ANALYTICS.conversionRate}%</p>
                <p className="text-xs text-emerald-600 mt-1">Tỷ lệ chuyển đổi</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-on-surface-variant mb-3">Khu vực khách hàng quan tâm</h4>
              <div className="space-y-2">
                {CUSTOMER_ANALYTICS.topAreas.map((item, i) => (
                  <HorizontalBar key={i} label={item.area} value={item.count} max={CUSTOMER_ANALYTICS.topAreas[0].count} color="#8b5cf6" />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-on-surface-variant mb-3">Hành vi tìm kiếm phổ biến</h4>
              <div className="space-y-2">
                {CUSTOMER_ANALYTICS.searchTrends.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-on-surface">{item.keyword}</span>
                    <span className="text-sm font-medium text-on-surface-variant">{item.count} lượt</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contract Analytics */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="text-base font-semibold text-on-surface mb-4">Phân tích hợp đồng</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-700 mb-3">Hợp đồng ký gửi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-on-surface-variant">Tổng</span><span className="font-medium text-on-surface">{CONTRACT_ANALYTICS.kyGui.total}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Đang hoạt động</span><span className="font-medium text-emerald-600">{CONTRACT_ANALYTICS.kyGui.active}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Sắp hết hạn</span><span className="font-medium text-amber-600">{CONTRACT_ANALYTICS.kyGui.expiring}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Tỷ lệ gia hạn</span><span className="font-medium text-on-surface">{CONTRACT_ANALYTICS.kyGui.renewalRate}%</span></div>
                </div>
              </div>
              <div className="border border-indigo-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-indigo-700 mb-3">Hợp đồng thuê</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-on-surface-variant">Tổng</span><span className="font-medium text-on-surface">{CONTRACT_ANALYTICS.thue.total}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Đang hoạt động</span><span className="font-medium text-emerald-600">{CONTRACT_ANALYTICS.thue.active}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Sắp hết hạn</span><span className="font-medium text-amber-600">{CONTRACT_ANALYTICS.thue.expiring}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Tỷ lệ gia hạn</span><span className="font-medium text-on-surface">{CONTRACT_ANALYTICS.thue.renewalRate}%</span></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-on-surface-variant mb-3">Hợp đồng theo tháng</h4>
              <div className="flex items-center gap-4 mb-2 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500" /> Ký gửi</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-400" /> Thuê</span>
              </div>
              <div className="space-y-1">
                {CONTRACT_ANALYTICS.monthly.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant w-6 shrink-0">{m.month}</span>
                    <div className="flex-1 flex gap-1 h-5">
                      <div className="rounded-sm bg-blue-500 transition-all" style={{ width: `${(m.kyGui / maxContractMonth) * 50}%` }} title={`${m.kyGui} ký gửi`} />
                      <div className="rounded-sm bg-indigo-400 transition-all" style={{ width: `${(m.thue / maxContractMonth) * 50}%` }} title={`${m.thue} thuê`} />
                    </div>
                    <span className="text-[10px] text-on-surface-variant w-14 text-right">{m.kyGui}/{m.thue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 6: Financial Analytics */}
        <div className="bg-white rounded-xl border border-outline-variant p-6">
          <h3 className="text-base font-semibold text-on-surface mb-4">Phân tích tài chính</h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Deposit breakdown */}
            <div>
              <h4 className="text-sm font-semibold text-on-surface-variant mb-3">Tiền đảm bảo</h4>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-blue-700">{formatVND(FINANCIAL_ANALYTICS.deposits.total)}</p>
                  <p className="text-xs text-blue-600 mt-1">Tổng</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-emerald-700">{formatVND(FINANCIAL_ANALYTICS.deposits.holding)}</p>
                  <p className="text-xs text-emerald-600 mt-1">Đang giữ</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-slate-700">{formatVND(FINANCIAL_ANALYTICS.deposits.refunded)}</p>
                  <p className="text-xs text-slate-600 mt-1">Đã hoàn</p>
                </div>
                <div className="bg-rose-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-rose-700">{formatVND(FINANCIAL_ANALYTICS.deposits.deducted)}</p>
                  <p className="text-xs text-rose-600 mt-1">Đã khấu trừ</p>
                </div>
              </div>

              {/* Deposit composition bar */}
              <div className="h-8 rounded-lg overflow-hidden flex">
                <div className="bg-emerald-500 transition-all" style={{ width: `${(FINANCIAL_ANALYTICS.deposits.holding / FINANCIAL_ANALYTICS.deposits.total) * 100}%` }} title="Đang giữ" />
                <div className="bg-slate-400 transition-all" style={{ width: `${(FINANCIAL_ANALYTICS.deposits.refunded / FINANCIAL_ANALYTICS.deposits.total) * 100}%` }} title="Đã hoàn trả" />
                <div className="bg-rose-500 transition-all" style={{ width: `${(FINANCIAL_ANALYTICS.deposits.deducted / FINANCIAL_ANALYTICS.deposits.total) * 100}%` }} title="Đã khấu trừ" />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Đang giữ</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Đã hoàn</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Khấu trừ</span>
              </div>
            </div>

            {/* Cash Flow */}
            <div>
              <h4 className="text-sm font-semibold text-on-surface-variant mb-3">Dòng tiền hệ thống (triệu VNĐ)</h4>
              <div className="flex items-center gap-4 mb-2 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500" /> Thu vào</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-400" /> Chi ra</span>
              </div>
              <div className="space-y-1">
                {FINANCIAL_ANALYTICS.cashFlow.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant w-6 shrink-0">{m.month}</span>
                    <div className="flex-1 flex gap-1 h-5 items-end">
                      <div className="bg-blue-500 rounded-t-sm" style={{ width: '40%', height: `${(m.inflow / maxCashFlow) * 100}%` }} title={`${m.inflow}tr`}>
                        <div className="h-full" />
                      </div>
                      <div className="bg-rose-400 rounded-t-sm" style={{ width: '40%', height: `${(m.outflow / maxCashFlow) * 100}%` }} title={`${m.outflow}tr`}>
                        <div className="h-full" />
                      </div>
                    </div>
                    <span className="text-[10px] text-on-surface-variant w-20 text-right">{m.inflow}/{m.outflow}tr</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 7: Insights + Report Generation */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Alert & Insight Section */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-on-surface">Cảnh báo & Phân tích thông minh</h3>
              <span className="text-xs text-on-surface-variant">{INSIGHTS.length} thông báo</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {INSIGHTS.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>

          {/* Report Generation */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="text-base font-semibold text-on-surface mb-4">Lập báo cáo</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Khoảng thời gian</label>
                <select className="w-full mt-1 px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20">
                  <option>Tháng này</option>
                  <option>Quý này</option>
                  <option>Năm nay</option>
                  <option>Tùy chỉnh</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Loại báo cáo</label>
                <select className="w-full mt-1 px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20">
                  <option>Tổng hợp hoạt động</option>
                  <option>Doanh thu</option>
                  <option>Hiệu suất môi giới</option>
                  <option>Hợp đồng</option>
                  <option>Tài chính</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Định dạng</label>
                <div className="flex gap-2 mt-1">
                  <button className="flex-1 px-3 py-2 border-2 border-blue-500 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">PDF</button>
                  <button className="flex-1 px-3 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-medium hover:bg-surface-container-low">Excel</button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Gửi tới email</label>
                <input
                  type="email"
                  placeholder="admin@rentflow.vn"
                  className="w-full mt-1 px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-4 py-2.5 bg-primary-container text-white rounded-lg text-sm font-medium hover:bg-primary-container/90 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tạo báo cáo
                </button>
                <button className="px-4 py-2.5 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Gửi email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
