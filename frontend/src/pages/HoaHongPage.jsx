import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

// ── Mock data ────────────────────────────────────────────────────────
const MOCK_BROKERS = [
  { id: 1, ten: 'Trần Văn Hùng', avatar: 'TVH', sdt: '0912 345 678', email: 'tranvanhung@rentflow.vn', tongHD: 5, tongDoanhThu: 98000000, tongHoaHong: 14700000, tyLeChot: 40, lichSuThanhToan: 3 },
  { id: 2, ten: 'Lê Quốc Anh', avatar: 'LQA', sdt: '0987 654 321', email: 'lequocanh@rentflow.vn', tongHD: 4, tongDoanhThu: 62000000, tongHoaHong: 9300000, tyLeChot: 33, lichSuThanhToan: 2 },
  { id: 3, ten: 'Phạm Minh Tuấn', avatar: 'PMT', sdt: '0903 456 789', email: 'phamminhtuan@rentflow.vn', tongHD: 6, tongDoanhThu: 135000000, tongHoaHong: 20250000, tyLeChot: 50, lichSuThanhToan: 4 },
  { id: 4, ten: 'Nguyễn Thị Lan', avatar: 'NTL', sdt: '0912 888 999', email: 'nguyenthilan@rentflow.vn', tongHD: 3, tongDoanhThu: 88000000, tongHoaHong: 13200000, tyLeChot: 67, lichSuThanhToan: 3 },
]

const MOCK_COMMISSIONS = [
  { id: 1, ma: 'HH-2025-001', moiGioiId: 3, hopDong: 'HĐT-2025-001', khachThue: 'Nguyễn Văn Minh', chuNha: 'Hoàng Đức Thắng', giaTriHD: 15000000, thoiHan: 12, phanTram: 15, soTien: 27000000, trangThai: 'da_thanh_toan', ngayTao: '2025-01-15', ngayThanhToan: '2025-01-20', ghiChu: '' },
  { id: 2, ma: 'HH-2025-002', moiGioiId: 1, hopDong: 'HĐT-2025-002', khachThue: 'Lê Thị Hương', chuNha: 'Nguyễn Thị Lan', giaTriHD: 35000000, thoiHan: 24, phanTram: 15, soTien: 63000000, trangThai: 'da_thanh_toan', ngayTao: '2025-02-10', ngayThanhToan: '2025-02-15', ghiChu: '' },
  { id: 3, ma: 'HH-2025-003', moiGioiId: 2, hopDong: 'HĐT-2025-003', khachThue: 'Phạm Đức Anh', chuNha: 'Đỗ Văn Kiên', giaTriHD: 28000000, thoiHan: 12, phanTram: 15, soTien: 50400000, trangThai: 'cho_thanh_toan', ngayTao: '2025-03-05', ngayThanhToan: null, ghiChu: 'Chờ duyệt từ kế toán' },
  { id: 4, ma: 'HH-2025-004', moiGioiId: 4, hopDong: 'HĐT-2025-004', khachThue: 'Trần Hương Giang', chuNha: 'Công ty CP ABC', giaTriHD: 8000000, thoiHan: 6, phanTram: 15, soTien: 7200000, trangThai: 'da_thanh_toan', ngayTao: '2025-03-20', ngayThanhToan: '2025-03-25', ghiChu: '' },
  { id: 5, ma: 'HH-2025-005', moiGioiId: 3, hopDong: 'HĐT-2025-005', khachThue: 'Vũ Minh Trí', chuNha: 'Đỗ Văn Kiên', giaTriHD: 22000000, thoiHan: 12, phanTram: 15, soTien: 39600000, trangThai: 'dang_xu_ly', ngayTao: '2025-04-01', ngayThanhToan: null, ghiChu: 'Đang xác minh hợp đồng' },
  { id: 6, ma: 'HH-2025-006', moiGioiId: 1, hopDong: 'HĐT-2025-006', khachThue: 'Mai Phương Thảo', chuNha: 'Công ty CP Đầu tư ABC', giaTriHD: 35000000, thoiHan: 24, phanTram: 15, soTien: 63000000, trangThai: 'cho_thanh_toan', ngayTao: '2025-04-15', ngayThanhToan: null, ghiChu: '' },
  { id: 7, ma: 'HH-2025-007', moiGioiId: 4, hopDong: 'HĐT-2024-010', khachThue: 'Công ty TNHH ABC', chuNha: 'Phạm Hữu Đức', giaTriHD: 45000000, thoiHan: 12, phanTram: 15, soTien: 81000000, trangThai: 'bi_giu', ngayTao: '2025-04-20', ngayThanhToan: null, ghiChu: 'Giữ lại do tranh chấp hợp đồng' },
  { id: 8, ma: 'HH-2025-008', moiGioiId: 2, hopDong: 'HĐT-2024-008', khachThue: 'Nguyễn Đức Anh', chuNha: 'Hoàng Đức Thắng', giaTriHD: 28000000, thoiHan: 12, phanTram: 15, soTien: 50400000, trangThai: 'da_thanh_toan', ngayTao: '2025-05-01', ngayThanhToan: '2025-05-05', ghiChu: '' },
  { id: 9, ma: 'HH-2025-009', moiGioiId: 3, hopDong: 'HĐT-2024-005', khachThue: 'Đỗ Quang Hải', chuNha: 'Vũ Thị Mai', giaTriHD: 12000000, thoiHan: 12, phanTram: 15, soTien: 21600000, trangThai: 'da_thanh_toan', ngayTao: '2025-05-10', ngayThanhToan: '2025-05-12', ghiChu: '' },
  { id: 10, ma: 'HH-2025-010', moiGioiId: 1, hopDong: 'HĐT-2025-007', khachThue: 'Nguyễn Đức Anh', chuNha: 'Vũ Thị Mai', giaTriHD: 15000000, thoiHan: 12, phanTram: 15, soTien: 27000000, trangThai: 'cho_thanh_toan', ngayTao: '2025-05-20', ngayThanhToan: null, ghiChu: 'Chờ kết thúc kỳ thanh toán' },
]

const STATUS_CONFIG = {
  cho_thanh_toan: { label: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  da_thanh_toan: { label: 'Đã thanh toán', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  dang_xu_ly: { label: 'Đang xử lý', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  bi_giu: { label: 'Bị giữ', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
}

const WORKFLOW_STEPS = [
  { key: 'hoan_tat', label: 'Hoàn tất HĐ' },
  { key: 'tinh_hh', label: 'Tính HH' },
  { key: 'cho_duyet', label: 'Chờ duyệt' },
  { key: 'da_tt', label: 'Đã TT' },
]

const BROKER_COLORS = [
  { bg: 'bg-blue-600', light: 'bg-blue-100 text-blue-700' },
  { bg: 'bg-violet-600', light: 'bg-violet-100 text-violet-700' },
  { bg: 'bg-teal-600', light: 'bg-teal-100 text-teal-700' },
  { bg: 'bg-rose-600', light: 'bg-rose-100 text-rose-700' },
]

const MONTHLY_DATA = [
  { month: 'T1', hoaHong: 12, doanhThu: 80 },
  { month: 'T2', hoaHong: 18, doanhThu: 120 },
  { month: 'T3', hoaHong: 15, doanhThu: 100 },
  { month: 'T4', hoaHong: 22, doanhThu: 147 },
  { month: 'T5', hoaHong: 20, doanhThu: 135 },
  { month: 'T6', hoaHong: 25, doanhThu: 167 },
]

const MOI_GIOI_OPTIONS = ['Tất cả', 'Trần Văn Hùng', 'Lê Quốc Anh', 'Phạm Minh Tuấn', 'Nguyễn Thị Lan']
const STATUS_OPTIONS = ['Tất cả', 'Chờ thanh toán', 'Đã thanh toán', 'Đang xử lý', 'Bị giữ']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'oldest', label: 'Cũ nhất' },
  { key: 'amount_desc', label: 'Số tiền cao nhất' },
  { key: 'amount_asc', label: 'Số tiền thấp nhất' },
]
const PERIOD_OPTIONS = ['Tháng này', 'Tháng trước', 'Quý này', 'Năm nay']

// ── Helpers ──────────────────────────────────────────────────────────
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function MiniSparkline({ data, color = '#2563eb' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 60
  const h = 24
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} className="opacity-30">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

function MiniBar({ value, max, color = 'bg-blue-500' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ── KPI Card ─────────────────────────────────────────────────────────
function KPICard({ icon, label, value, sub, color, bgColor, sparkData, sparkColor, accent }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group ${accent ? 'border-l-4 border-l-amber-400' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className={color}>{icon}</span>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        {sparkData && <MiniSparkline data={sparkData} color={sparkColor} />}
      </div>
    </div>
  )
}

// ── Alert card ───────────────────────────────────────────────────────
function AlertCard({ icon, title, count, detail, variant = 'amber' }) {
  const styles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  }
  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${styles[variant]}`}>
      <span className="text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-80 mt-0.5">{detail}</p>
      </div>
      {count > 0 && (
        <span className="text-sm font-bold bg-white/60 rounded-lg px-2.5 py-1 shrink-0">{count}</span>
      )}
    </div>
  )
}

// ── Bar chart ────────────────────────────────────────────────────────
function BarChart({ data, barKey, lineKey, barLabel, lineLabel }) {
  const maxVal = Math.max(...data.map(d => d[lineKey]))
  const chartH = 180
  const barW = 32
  const gap = 20
  const totalW = data.length * (barW + gap)

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-xs text-slate-500">{barLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400" />
          <span className="text-xs text-slate-500">{lineLabel}</span>
        </div>
      </div>
      <div className="relative" style={{ height: chartH + 30 }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-right">
          {[...Array(5)].map((_, i) => {
            const val = Math.round((maxVal * (4 - i)) / 4)
            return <span key={i} className="text-[10px] text-slate-400">{val}tr</span>
          })}
        </div>
        {/* Chart area */}
        <div className="ml-14 relative" style={{ height: chartH }}>
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute left-0 right-0 border-t border-slate-100" style={{ top: `${(i / 4) * 100}%` }} />
          ))}
          {/* Bars + line */}
          <svg className="absolute inset-0" viewBox={`0 0 ${totalW} ${chartH}`} preserveAspectRatio="none">
            {/* Line */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.map((d, i) => {
                const x = i * (barW + gap) + barW / 2
                const y = chartH - (d[lineKey] / maxVal) * (chartH - 10)
                return `${x},${y}`
              }).join(' ')}
            />
            {/* Dots */}
            {data.map((d, i) => {
              const x = i * (barW + gap) + barW / 2
              const y = chartH - (d[lineKey] / maxVal) * (chartH - 10)
              return <circle key={i} cx={x} cy={y} r="3" fill="#f59e0b" />
            })}
          </svg>
          {/* Bars (HTML) */}
          <div className="absolute inset-0 flex items-end" style={{ paddingLeft: gap / 2 }}>
            {data.map((d, i) => {
              const barH = maxVal > 0 ? (d[barKey] / maxVal) * (chartH - 10) : 0
              return (
                <div key={i} style={{ width: barW, marginRight: gap }} className="flex flex-col items-center">
                  <div className="w-full rounded-t-md bg-blue-500/80 transition-all duration-500" style={{ height: barH }} />
                </div>
              )
            })}
          </div>
        </div>
        {/* X-axis labels */}
        <div className="ml-14 flex" style={{ paddingLeft: gap / 2 }}>
          {data.map((d, i) => (
            <span key={i} className="text-[10px] text-slate-400 text-center" style={{ width: barW, marginRight: gap }}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Workflow timeline ────────────────────────────────────────────────
function WorkflowTimeline({ trangThai }) {
  const statusStepMap = { da_thanh_toan: 4, cho_thanh_toan: 3, dang_xu_ly: 2, bi_giu: 2 }
  const currentStep = statusStepMap[trangThai] || 1

  return (
    <div className="flex items-center">
      {WORKFLOW_STEPS.map((step, i) => {
        const stepNum = i + 1
        const isActive = stepNum <= currentStep
        const isCurrent = stepNum === currentStep
        const isLast = i === WORKFLOW_STEPS.length - 1
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                isActive
                  ? isCurrent ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {isActive && !isCurrent ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : stepNum}
              </div>
              <span className={`text-[9px] mt-1 text-center leading-tight whitespace-nowrap ${isCurrent ? 'text-amber-700 font-semibold' : isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-0.5 rounded-full ${stepNum < currentStep ? 'bg-blue-500' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Commission row ───────────────────────────────────────────────────
function CommissionRow({ comm, isSelected, onSelect }) {
  const status = STATUS_CONFIG[comm.trangThai]
  const broker = MOCK_BROKERS.find(b => b.id === comm.moiGioiId)
  const colorSet = BROKER_COLORS[(comm.moiGioiId - 1) % BROKER_COLORS.length]

  return (
    <tr
      onClick={() => onSelect(comm.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{comm.ma}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full ${colorSet.bg} flex items-center justify-center shrink-0`}>
            <span className="text-[10px] font-bold text-white">{broker?.avatar}</span>
          </div>
          <p className="text-sm text-slate-700">{broker?.ten}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{comm.khachThue}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-600">{comm.chuNha}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{formatVND(comm.giaTriHD)}đ</p>
        <p className="text-xs text-slate-400">{comm.thoiHan} tháng</p>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-semibold text-blue-700">{comm.phanTram}%</span>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-bold text-emerald-700">{formatVND(comm.soTien)}đ</p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
    </tr>
  )
}

// ── Broker detail panel ──────────────────────────────────────────────
function BrokerDetailPanel({ broker, onClose }) {
  if (!broker) return null
  const colorSet = BROKER_COLORS[(broker.id - 1) % BROKER_COLORS.length]
  const commissions = MOCK_COMMISSIONS.filter(c => c.moiGioiId === broker.id)
  const paid = commissions.filter(c => c.trangThai === 'da_thanh_toan')
  const pending = commissions.filter(c => c.trangThai !== 'da_thanh_toan')

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className={`bg-linear-to-r ${colorSet.bg === 'bg-blue-600' ? 'from-blue-600 to-blue-700' : colorSet.bg === 'bg-violet-600' ? 'from-violet-600 to-violet-700' : colorSet.bg === 'bg-teal-600' ? 'from-teal-600 to-teal-700' : 'from-rose-600 to-rose-700'} p-5`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-lg font-bold">{broker.avatar}</span>
            </div>
            <div>
              <p className="text-white/70 text-xs">Môi giới</p>
              <h3 className="text-white font-bold text-lg">{broker.ten}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Liên hệ</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {broker.sdt}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {broker.email}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Hiệu suất</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
              <p className="text-2xl font-bold text-blue-700">{broker.tongHD}</p>
              <p className="text-[10px] text-blue-500">Tổng HĐ</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
              <p className="text-2xl font-bold text-emerald-700">{broker.tyLeChot}%</p>
              <p className="text-[10px] text-emerald-500">Tỷ lệ chốt</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-center col-span-2">
              <p className="text-xl font-bold text-amber-700">{formatVND(broker.tongDoanhThu)}đ</p>
              <p className="text-[10px] text-amber-500">Tổng doanh thu</p>
            </div>
          </div>
        </div>

        {/* Commission calculation */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Công thức hoa hồng</h4>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Tỷ lệ HH</span>
                <span className="font-semibold text-slate-800">15% giá trị HĐ năm đầu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng HH</span>
                <span className="font-bold text-emerald-700">{formatVND(broker.tongHoaHong)}đ</span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Đã thanh toán</span>
                  <span className="font-semibold text-emerald-600">{formatVND(paid.reduce((s, c) => s + c.soTien, 0))}đ</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-500">Chờ thanh toán</span>
                  <span className="font-semibold text-amber-600">{formatVND(pending.reduce((s, c) => s + c.soTien, 0))}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment history */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch sử thanh toán</h4>
          <div className="space-y-2">
            {commissions.map(c => {
              const status = STATUS_CONFIG[c.trangThai]
              return (
                <div key={c.id} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800">{c.ma}</p>
                    <p className="text-[10px] text-slate-400">{c.khachThue} · {c.hopDong}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-800">{formatVND(c.soTien)}đ</p>
                    <span className={`text-[9px] font-medium ${status.color} px-1.5 py-0.5 rounded border`}>{status.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          <Link
            to="/admin/hop-dong-thue"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors text-center"
          >
            Xem hợp đồng thuê
          </Link>
          <Link
            to="/admin/phan-cong-moi-gioi"
            className="block w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-colors text-center"
          >
            Xem phân công môi giới
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Commission detail panel ──────────────────────────────────────────
function CommissionDetail({ comm, onClose }) {
  if (!comm) return null
  const status = STATUS_CONFIG[comm.trangThai]
  const broker = MOCK_BROKERS.find(b => b.id === comm.moiGioiId)
  const colorSet = BROKER_COLORS[(comm.moiGioiId - 1) % BROKER_COLORS.length]

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-emerald-200 text-xs">Hoa hồng</p>
            <h3 className="text-white font-bold text-lg">{comm.ma}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
          <span className="text-emerald-200 text-xs font-medium">{formatVND(comm.soTien)}đ</span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Broker */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Môi giới</h4>
          <div className={`${colorSet.light.split(' ')[0]} rounded-lg p-3 border border-slate-200`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${colorSet.bg} flex items-center justify-center shrink-0`}>
                <span className="text-white text-sm font-bold">{broker?.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{broker?.ten}</p>
                <p className="text-xs text-slate-500">{broker?.sdt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin hợp đồng</h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã HĐ</span>
              <Link to="/admin/hop-dong-thue" className="font-semibold text-blue-700 hover:text-blue-900">{comm.hopDong}</Link>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Khách thuê</span>
              <span className="font-medium text-slate-800">{comm.khachThue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chủ nhà</span>
              <span className="font-medium text-slate-800">{comm.chuNha}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Giá trị HĐ</span>
              <span className="font-semibold text-slate-800">{formatVND(comm.giaTriHD)}đ/tháng</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thời hạn</span>
              <span className="font-medium text-slate-800">{comm.thoiHan} tháng</span>
            </div>
          </div>
        </div>

        {/* Commission calculation */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tính hoa hồng</h4>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Giá trị HĐ/năm</span>
              <span className="font-medium text-slate-800">{formatVND(comm.giaTriHD * comm.thoiHan)}đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tỷ lệ HH</span>
              <span className="font-semibold text-blue-700">{comm.phanTram}%</span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between">
              <span className="font-semibold text-slate-700">Số tiền HH</span>
              <span className="text-lg font-bold text-emerald-700">{formatVND(comm.soTien)}đ</span>
            </div>
          </div>
        </div>

        {/* Payment workflow */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quy trình thanh toán</h4>
          <WorkflowTimeline trangThai={comm.trangThai} />
        </div>

        {/* Notes */}
        {comm.ghiChu && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ghi chú</h4>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-sm text-amber-800">
              {comm.ghiChu}
            </div>
          </div>
        )}

        {/* Dates */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thời gian</h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Ngày tạo</span>
              <span className="text-slate-700">{formatDate(comm.ngayTao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ngày thanh toán</span>
              <span className="text-slate-700">{formatDate(comm.ngayThanhToan)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          {comm.trangThai === 'cho_thanh_toan' && (
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Duyệt thanh toán
            </button>
          )}
          {(comm.trangThai === 'cho_thanh_toan' || comm.trangThai === 'dang_xu_ly') && (
            <button className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Xuất báo cáo
            </button>
          )}
          <Link
            to="/admin/hop-dong-thue"
            className="block w-full bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 py-2.5 rounded-xl text-sm font-semibold transition-colors text-center"
          >
            Xem hợp đồng
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────
export default function HoaHongPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [selectedBrokerId, setSelectedBrokerId] = useState(null)
  const [detailMode, setDetailMode] = useState('commission')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tất cả')
  const [filterMoiGioi, setFilterMoiGioi] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [period, setPeriod] = useState('Tháng này')

  const selectedBroker = useMemo(() => MOCK_BROKERS.find(b => b.id === selectedBrokerId), [selectedBrokerId])
  const selectedComm = useMemo(() => MOCK_COMMISSIONS.find(c => c.id === selectedId), [selectedId])

  const filtered = useMemo(() => {
    let list = [...MOCK_COMMISSIONS]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.ma.toLowerCase().includes(q) ||
        c.hopDong.toLowerCase().includes(q) ||
        c.khachThue.toLowerCase().includes(q) ||
        c.chuNha.toLowerCase().includes(q) ||
        MOCK_BROKERS.find(b => b.id === c.moiGioiId)?.ten.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'Tất cả') {
      const statusMap = {
        'Chờ thanh toán': 'cho_thanh_toan',
        'Đã thanh toán': 'da_thanh_toan',
        'Đang xử lý': 'dang_xu_ly',
        'Bị giữ': 'bi_giu',
      }
      list = list.filter(c => c.trangThai === statusMap[filterStatus])
    }
    if (filterMoiGioi !== 'Tất cả') {
      const broker = MOCK_BROKERS.find(b => b.ten === filterMoiGioi)
      if (broker) list = list.filter(c => c.moiGioiId === broker.id)
    }
    switch (sortBy) {
      case 'newest': list.sort((a, b) => b.id - a.id); break
      case 'oldest': list.sort((a, b) => a.id - b.id); break
      case 'amount_desc': list.sort((a, b) => b.soTien - a.soTien); break
      case 'amount_asc': list.sort((a, b) => a.soTien - b.soTien); break
    }
    return list
  }, [search, filterStatus, filterMoiGioi, sortBy])

  const kpi = useMemo(() => {
    const totalHH = MOCK_COMMISSIONS.reduce((s, c) => s + c.soTien, 0)
    const totalDT = MOCK_COMMISSIONS.reduce((s, c) => s + (c.giaTriHD * c.thoiHan), 0)
    const successHD = MOCK_COMMISSIONS.filter(c => c.trangThai === 'da_thanh_toan').length
    const topBroker = MOCK_BROKERS.reduce((max, b) => b.tongHoaHong > max.tongHoaHong ? b : max, MOCK_BROKERS[0])
    return { totalHH, totalDT, successHD, topBroker }
  }, [])

  const handleSelectComm = (id) => {
    setSelectedId(id)
    setDetailMode('commission')
    const comm = MOCK_COMMISSIONS.find(c => c.id === id)
    if (comm) setSelectedBrokerId(comm.moiGioiId)
  }

  const handleSelectBroker = (id) => {
    setSelectedBrokerId(id)
    setDetailMode('broker')
    const firstComm = MOCK_COMMISSIONS.find(c => c.moiGioiId === id)
    if (firstComm) setSelectedId(firstComm.id)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý hoa hồng môi giới</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi doanh thu và hoa hồng từ các hợp đồng thuê</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {PERIOD_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Tổng HH tháng này"
          value={`${formatVND(kpi.totalHH)}đ`}
          color="text-emerald-600" bgColor="bg-emerald-100"
          sparkData={[12, 18, 15, 22, 20, 25]} sparkColor="#059669"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          label="Tổng doanh thu"
          value={`${formatVND(kpi.totalDT)}đ`}
          sub="Giá trị hợp đồng"
          color="text-blue-600" bgColor="bg-blue-100"
          sparkData={[80, 120, 100, 147, 135, 167]} sparkColor="#2563eb"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="HĐ thành công"
          value={kpi.successHD}
          color="text-violet-600" bgColor="bg-violet-100"
          sparkData={[3, 5, 4, 6, 5, 7]} sparkColor="#7c3aed"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="MG hiệu suất cao"
          value={kpi.topBroker.ten}
          sub={`${kpi.topBroker.tyLeChot}% chốt · ${formatVND(kpi.topBroker.tongHoaHong)}đ HH`}
          color="text-amber-600" bgColor="bg-amber-100"
          sparkData={[8, 12, 10, 15, 18, 20]} sparkColor="#d97706"
          accent
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AlertCard
          icon="💰"
          title="HH chưa thanh toán"
          count={MOCK_COMMISSIONS.filter(c => c.trangThai === 'cho_thanh_toan').length}
          detail={`${formatVND(MOCK_COMMISSIONS.filter(c => c.trangThai === 'cho_thanh_toan').reduce((s, c) => s + c.soTien, 0))}đ chờ duyệt`}
          variant="amber"
        />
        <AlertCard
          icon="⏳"
          title="Hợp đồng pending"
          count={MOCK_COMMISSIONS.filter(c => c.trangThai === 'dang_xu_ly').length}
          detail="Cần xác minh để tính hoa hồng"
          variant="blue"
        />
        <AlertCard
          icon="🚫"
          title="HH bị giữ"
          count={MOCK_COMMISSIONS.filter(c => c.trangThai === 'bi_giu').length}
          detail="Cần giải quyết tranh chấp"
          variant="red"
        />
      </div>

      {/* Analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Hoa hồng & Doanh thu theo tháng</h3>
          <BarChart
            data={MONTHLY_DATA}
            barKey="doanhThu"
            lineKey="hoaHong"
            barLabel="Doanh thu (triệu)"
            lineLabel="Hoa hồng (triệu)"
          />
        </div>

        {/* Top brokers + Area breakdown */}
        <div className="space-y-6">
          {/* Top brokers */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Top môi giới theo hoa hồng</h3>
            <div className="space-y-3">
              {MOCK_BROKERS.sort((a, b) => b.tongHoaHong - a.tongHoaHong).map((b, i) => {
                const colorSet = BROKER_COLORS[(b.id - 1) % BROKER_COLORS.length]
                const maxHH = Math.max(...MOCK_BROKERS.map(x => x.tongHoaHong))
                return (
                  <div key={b.id} className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-amber-500' : 'text-slate-400'}`}>#{i + 1}</span>
                    <div className={`w-8 h-8 rounded-full ${colorSet.bg} flex items-center justify-center shrink-0`}>
                      <span className="text-[10px] font-bold text-white">{b.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-800 truncate">{b.ten}</span>
                        <span className="text-xs font-bold text-emerald-700">{formatVND(b.tongHoaHong)}đ</span>
                      </div>
                      <MiniBar value={b.tongHoaHong} max={maxHH} color={colorSet.bg} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Area breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Doanh thu theo khu vực</h3>
            <div className="space-y-3">
              {[
                { khuVuc: 'Cầu Giấy', soHD: 4, doanhThu: 85000000, pct: 32 },
                { khuVuc: 'Hai Bà Trưng', soHD: 3, doanhThu: 68000000, pct: 25 },
                { khuVuc: 'Tây Hồ', soHD: 2, doanhThu: 54000000, pct: 20 },
                { khuVuc: 'Ba Đình', soHD: 2, doanhThu: 38000000, pct: 14 },
                { khuVuc: 'Khác', soHD: 2, doanhThu: 23000000, pct: 9 },
              ].map(item => (
                <div key={item.khuVuc}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700">{item.khuVuc}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{item.soHD} HĐ</span>
                      <span className="text-xs font-bold text-slate-800">{formatVND(item.doanhThu)}đ</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Broker quick cards */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Hiệu suất môi giới</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_BROKERS.map(b => {
            const colorSet = BROKER_COLORS[(b.id - 1) % BROKER_COLORS.length]
            const isSelected = selectedBrokerId === b.id
            return (
              <div
                key={b.id}
                onClick={() => handleSelectBroker(b.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${colorSet.bg} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-sm font-bold">{b.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{b.ten}</p>
                    <p className="text-xs text-slate-400">{b.tongHD} HĐ · {b.tyLeChot}% chốt</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-emerald-50 rounded-lg py-2 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-700">{formatVND(b.tongHoaHong / 1000000)}tr</p>
                    <p className="text-[9px] text-emerald-500">HH</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg py-2 border border-blue-100">
                    <p className="text-xs font-bold text-blue-700">{formatVND(b.tongDoanhThu / 1000000)}tr</p>
                    <p className="text-[9px] text-blue-500">Doanh thu</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã HH, hợp đồng, khách thuê, chủ nhà..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select
              value={filterMoiGioi}
              onChange={(e) => setFilterMoiGioi(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {MOI_GIOI_OPTIONS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SORT_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content: table + detail */}
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Mã HH</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Môi giới</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Khách thuê</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Chủ nhà</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Giá trị HĐ</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">% HH</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Số tiền HH</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-slate-400">Không tìm thấy hoa hồng nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(c => (
                      <CommissionRow key={c.id} comm={c} isSelected={selectedId === c.id} onSelect={handleSelectComm} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedId && (
          <div className="hidden xl:block w-105 shrink-0">
            {detailMode === 'broker' && selectedBroker ? (
              <BrokerDetailPanel broker={selectedBroker} onClose={() => { setSelectedBrokerId(null); setSelectedId(null) }} />
            ) : (
              <CommissionDetail comm={selectedComm} onClose={() => setSelectedId(null)} />
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {!selectedId && (
        <div className="hidden xl:flex items-center justify-center w-105 shrink-0">
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm text-slate-400">Chọn giao dịch để xem chi tiết</p>
          </div>
        </div>
      )}
    </div>
  )
}
