import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import khachHangService from '../services/khachHangService'
import quanTriService from '../services/quanTriService'

const KANBAN_COLUMNS = [
  { key: 'chua_phan_cong', label: 'Chưa phân công', color: 'border-t-slate-400', bg: 'bg-slate-50', headerBg: 'bg-slate-100' },
  { key: 'dang_tu_van', label: 'Đang tư vấn', color: 'border-t-blue-500', bg: 'bg-blue-50/50', headerBg: 'bg-blue-100' },
  { key: 'da_dat_lich', label: 'Đã đặt lịch xem', color: 'border-t-violet-500', bg: 'bg-violet-50/50', headerBg: 'bg-violet-100' },
  { key: 'dang_dam_phan', label: 'Đang đàm phán', color: 'border-t-amber-500', bg: 'bg-amber-50/50', headerBg: 'bg-amber-100' },
  { key: 'da_ky_hop_dong', label: 'Đã ký hợp đồng', color: 'border-t-emerald-500', bg: 'bg-emerald-50/50', headerBg: 'bg-emerald-100' },
]

const PRIORITY_CONFIG = {
  cao: { label: 'Cao', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-400' },
  trung_binh: { label: 'TB', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  thap: { label: 'Thấp', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
}

const BROKER_COLORS = [
  { bg: 'bg-blue-600', light: 'bg-blue-100 text-blue-700' },
  { bg: 'bg-violet-600', light: 'bg-violet-100 text-violet-700' },
  { bg: 'bg-teal-600', light: 'bg-teal-100 text-teal-700' },
  { bg: 'bg-rose-600', light: 'bg-rose-100 text-rose-700' },
]

// ── Helpers ──────────────────────────────────────────────────────────
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
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
function KPICard({ icon, label, value, color, bgColor, sparkData, sparkColor, accent }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group ${accent ? 'border-l-4 border-l-amber-400' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
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

// ── Broker card ──────────────────────────────────────────────────────
function BrokerCard({ broker, isSelected, onSelect }) {
  const colorSet = BROKER_COLORS[(broker.id - 1) % BROKER_COLORS.length]
  const workloadMax = 8
  const isOverloaded = broker.soKhachDangPhuTrach >= workloadMax

  return (
    <div
      onClick={() => onSelect(broker.id)}
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${colorSet.bg} flex items-center justify-center shrink-0`}>
          <span className="text-white text-sm font-bold">{broker.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{broker.ten}</p>
          <p className="text-xs text-slate-400">{broker.sdt}</p>
        </div>
        {isOverloaded && (
          <span className="text-[10px] font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">Quá tải</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-slate-50 rounded-lg py-1.5">
          <p className="text-sm font-bold text-slate-800">{broker.soKhachDangPhuTrach}</p>
          <p className="text-[10px] text-slate-400">Khách</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-1.5">
          <p className="text-sm font-bold text-slate-800">{broker.tyLeChot}%</p>
          <p className="text-[10px] text-slate-400">Chốt</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-1.5">
          <p className="text-sm font-bold text-slate-800">{broker.lichXemSapToi}</p>
          <p className="text-[10px] text-slate-400">Lịch xem</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-400">Workload</span>
          <span className="text-[10px] font-medium text-slate-600">{broker.soKhachDangPhuTrach}/{workloadMax}</span>
        </div>
        <MiniBar value={broker.soKhachDangPhuTrach} max={workloadMax} color={isOverloaded ? 'bg-red-500' : broker.soKhachDangPhuTrach >= 6 ? 'bg-amber-500' : 'bg-blue-500'} />
      </div>
    </div>
  )
}

// ── Kanban customer card ─────────────────────────────────────────────
function KanbanCard({ customer, onAssign, brokers }) {
  const priority = PRIORITY_CONFIG[customer.priority]
  const broker = (brokers || []).find(b => b.id === customer.moiGioiId)
  const colorSet = broker ? BROKER_COLORS[(broker.id - 1) % BROKER_COLORS.length] : null
  const days = daysUntil(customer.deadline)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-cyan-700">{customer.ten.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{customer.ten}</p>
            <p className="text-xs text-slate-400">{customer.sdt}</p>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${priority.color}`}>
          {priority.label}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs text-slate-600 truncate">{customer.nhuCau}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-slate-600">{customer.khuVuc}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-slate-600">{customer.khoangGia}đ/tháng</span>
        </div>
      </div>

      {/* Broker tag */}
      {broker ? (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium ${colorSet.light}`}>
          <div className={`w-4 h-4 rounded-full ${colorSet.bg} flex items-center justify-center`}>
            <span className="text-[8px] text-white font-bold">{broker.avatar}</span>
          </div>
          {broker.ten}
        </div>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); onAssign(customer) }}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-colors border border-dashed border-slate-300"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Phân công
        </button>
      )}

      {/* Deadline */}
      {customer.deadline && days !== null && days <= 7 && days > 0 && (
        <p className="text-[10px] text-amber-600 font-medium mt-2">Deadline: {days} ngày nữa</p>
      )}
      {customer.deadline && days !== null && days <= 0 && (
        <p className="text-[10px] text-red-600 font-medium mt-2">Quá deadline!</p>
      )}
    </div>
  )
}

// ── Broker detail panel ──────────────────────────────────────────────
function BrokerDetailPanel({ broker, onClose, customers }) {
  if (!broker) return null
  const colorSet = BROKER_COLORS[(broker.id - 1) % BROKER_COLORS.length]
  const customersOfBroker = (customers || []).filter(c => c.moiGioiId === broker.id)
  const workloadMax = 8

  const statusGroups = {
    dang_tu_van: customersOfBroker.filter(c => c.trangThai === 'dang_tu_van'),
    da_dat_lich: customersOfBroker.filter(c => c.trangThai === 'da_dat_lich'),
    dang_dam_phan: customersOfBroker.filter(c => c.trangThai === 'dang_dam_phan'),
    da_ky_hop_dong: customersOfBroker.filter(c => c.trangThai === 'da_ky_hop_dong'),
  }

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

        {/* Performance KPIs */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Hiệu suất</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
              <p className="text-2xl font-bold text-blue-700">{broker.tyLeChot}%</p>
              <p className="text-[10px] text-blue-500">Tỷ lệ chốt</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
              <p className="text-2xl font-bold text-emerald-700">{formatVND(broker.hoaHongThang)}đ</p>
              <p className="text-[10px] text-emerald-500">Hoa hồng tháng</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Workload</span>
              <span className="text-xs font-semibold text-slate-700">{broker.soKhachDangPhuTrach}/{workloadMax}</span>
            </div>
            <MiniBar value={broker.soKhachDangPhuTrach} max={workloadMax} color={broker.soKhachDangPhuTrach >= workloadMax ? 'bg-red-500' : 'bg-blue-500'} />
          </div>
        </div>

        {/* Customer list by status */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Khách hàng ({customersOfBroker.length})</h4>
          <div className="space-y-3">
            {Object.entries(statusGroups).filter(([, c]) => c.length > 0).map(([status, custs]) => {
              const statusLabels = {
                dang_tu_van: { label: 'Đang tư vấn', color: 'text-blue-600' },
                da_dat_lich: { label: 'Đã đặt lịch', color: 'text-violet-600' },
                dang_dam_phan: { label: 'Đang đàm phán', color: 'text-amber-600' },
                da_ky_hop_dong: { label: 'Đã ký HĐ', color: 'text-emerald-600' },
              }
              const cfg = statusLabels[status]
              return (
                <div key={status}>
                  <p className={`text-[10px] font-semibold ${cfg.color} mb-1`}>{cfg.label} ({custs.length})</p>
                  <div className="space-y-1.5">
                    {custs.map(c => (
                      <div key={c.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-cyan-700">{c.ten.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 truncate">{c.ten}</p>
                          <p className="text-[10px] text-slate-400">{c.nhuCau} · {c.khuVuc}</p>
                        </div>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${PRIORITY_CONFIG[c.priority].color}`}>
                          {PRIORITY_CONFIG[c.priority].label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming viewings */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch xem sắp tới</h4>
          <div className="space-y-2">
            {broker.lichXemSapToi > 0 ? (
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-violet-700">{broker.lichXemSapToi} lịch xem</span>
                </div>
                <Link to="/admin/lich-xem-nha" className="text-xs text-violet-500 hover:text-violet-700 mt-1 inline-block">
                  Xem chi tiết →
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Chưa có lịch xem nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Assignment modal ─────────────────────────────────────────────────
function AssignmentModal({ customer, onClose, brokers }) {
  const [selectedBroker, setSelectedBroker] = useState('')
  const [priority, setPriority] = useState(customer?.priority || 'trung_binh')
  const [ghiChu, setGhiChu] = useState('')
  const [deadline, setDeadline] = useState('')

  if (!customer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs">Phân công môi giới</p>
              <h3 className="text-white font-bold text-lg">{customer.ten}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Nhu cầu</p>
                <p className="font-medium text-slate-800">{customer.nhuCau}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Khu vực</p>
                <p className="font-medium text-slate-800">{customer.khuVuc}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Khoảng giá</p>
                <p className="font-medium text-slate-800">{customer.khoangGia}đ/tháng</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">SĐT</p>
                <p className="font-medium text-slate-800">{customer.sdt}</p>
              </div>
            </div>
          </div>

          {/* Select broker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Môi giới phụ trách *</label>
            <div className="space-y-2">
              {brokers.map(b => {
                const colorSet = BROKER_COLORS[(b.id - 1) % BROKER_COLORS.length]
                const isSelected = selectedBroker === String(b.id)
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBroker(String(b.id))}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full ${colorSet.bg} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{b.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{b.ten}</p>
                      <p className="text-xs text-slate-400">{b.soKhachDangPhuTrach} khách · {b.tyLeChot}% chốt</p>
                    </div>
                    {b.soKhachDangPhuTrach >= 8 && (
                      <span className="text-[10px] font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">Quá tải</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mức ưu tiên</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'cao', label: 'Cao', color: 'border-red-300 bg-red-50 text-red-700', active: 'border-red-500 bg-red-100 text-red-800 ring-2 ring-red-300' },
                { key: 'trung_binh', label: 'Trung bình', color: 'border-amber-300 bg-amber-50 text-amber-700', active: 'border-amber-500 bg-amber-100 text-amber-800 ring-2 ring-amber-300' },
                { key: 'thap', label: 'Thấp', color: 'border-slate-300 bg-slate-50 text-slate-600', active: 'border-slate-500 bg-slate-100 text-slate-800 ring-2 ring-slate-300' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setPriority(opt.key)}
                  className={`p-2.5 rounded-xl border text-sm font-medium text-center transition-all ${priority === opt.key ? opt.active : opt.color}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú phân công</label>
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={2}
              placeholder="Ghi chú thêm cho môi giới..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline follow-up</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onClose}
              disabled={!selectedBroker}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                selectedBroker ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Phân công
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────
export default function PhanCongMoiGioiPage() {
  const [selectedBrokerId, setSelectedBrokerId] = useState(null)
  const [assignModal, setAssignModal] = useState(null)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [brokers, setBrokers] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [brokerRes, customerRes] = await Promise.all([
        quanTriService.danhSachTaiKhoan(),
        khachHangService.danhSach(),
      ])
      const accounts = brokerRes.data || []
      const mappedBrokers = accounts.filter(acc => acc.vaiTro === 'NHAN_VIEN_DAI_LY').map(acc => ({
        id: acc.id,
        ten: acc.tenNhanVien || acc.hoTen || '',
        sdt: acc.soDienThoai || '',
        email: acc.email || '',
        avatar: (acc.tenNhanVien || acc.hoTen || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'NV',
        soKhachDangPhuTrach: acc.soKhachDangPhuTrach || 0,
        tyLeChot: acc.tyLeChot || 0,
        lichXemSapToi: acc.lichXemSapToi || 0,
        hoaHongThang: acc.hoaHongThang || 0,
        khachHang: acc.danhSachKhachHang || [],
      }))

      const mappedCustomers = (customerRes.data || []).map(c => ({
        id: c.id,
        ten: c.tenKhachHang || c.hoTen || '',
        sdt: c.soDienThoai || '',
        nhuCau: c.nhuCau || '',
        khuVuc: c.khuVuc || '',
        khoangGia: c.khoangGia || '',
        moiGioiId: c.moiGioiId || c.nhanVienId || null,
        trangThai: c.trangThai || 'chua_phan_cong',
        priority: c.priority || c.doUuTien || 'trung_binh',
        ghiChu: c.ghiChu || '',
        deadline: c.deadline || null,
      }))

      setBrokers(mappedBrokers)
      setCustomers(mappedCustomers)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const selectedBroker = useMemo(() => brokers.find(b => b.id === selectedBrokerId), [selectedBrokerId, brokers])

  const filteredCustomers = useMemo(() => {
    let list = [...customers]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c => c.ten.toLowerCase().includes(q) || c.nhuCau.toLowerCase().includes(q) || c.khuVuc.toLowerCase().includes(q) || c.sdt.includes(q))
    }
    if (filterPriority !== 'all') {
      list = list.filter(c => c.priority === filterPriority)
    }
    return list
  }, [search, filterPriority, customers])

  const kanbanData = useMemo(() => {
    const groups = {}
    KANBAN_COLUMNS.forEach(col => { groups[col.key] = [] })
    filteredCustomers.forEach(c => {
      if (groups[c.trangThai]) groups[c.trangThai].push(c)
    })
    return groups
  }, [filteredCustomers])

  const kpi = useMemo(() => ({
    totalBrokers: brokers.length,
    totalProcessing: customers.filter(c => c.trangThai !== 'chua_phan_cong' && c.trangThai !== 'da_ky_hop_dong').length,
    unassigned: customers.filter(c => c.trangThai === 'chua_phan_cong').length,
    successThisMonth: customers.filter(c => c.trangThai === 'da_ky_hop_dong').length,
  }), [brokers, customers])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  )
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-semibold text-red-600">{error}</p>
        <button onClick={fetchData} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Thử lại
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Phân công môi giới</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý khách hàng và môi giới phụ trách</p>
        </div>
        <button
          onClick={() => setAssignModal({ id: 0, ten: '', sdt: '', nhuCau: '', khuVuc: '', khoangGia: '', moiGioiId: null, trangThai: 'chua_phan_cong', priority: 'trung_binh', ghiChu: '', deadline: '' })}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Phân công mới
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          label="Tổng môi giới"
          value={kpi.totalBrokers}
          color="text-blue-600" bgColor="bg-blue-100"
          sparkData={[3, 4, 4, 4, 4, 4, 4]} sparkColor="#2563eb"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          label="Đang xử lý"
          value={kpi.totalProcessing}
          color="text-violet-600" bgColor="bg-violet-100"
          sparkData={[8, 10, 12, 11, 13, 12, 12]} sparkColor="#7c3aed"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          label="Chưa phân công"
          value={kpi.unassigned}
          color="text-amber-600" bgColor="bg-amber-100"
          sparkData={[3, 2, 4, 2, 3, 2, 2]} sparkColor="#d97706"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Thành công tháng này"
          value={kpi.successThisMonth}
          color="text-emerald-600" bgColor="bg-emerald-100"
          sparkData={[1, 2, 2, 3, 2, 3, 3]} sparkColor="#059669"
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AlertCard
          icon="⚠️"
          title="Lead chưa xử lý"
          count={customers.filter(c => c.trangThai === 'chua_phan_cong').length}
          detail="Khách hàng chưa được phân công môi giới"
          variant="amber"
        />
        <AlertCard
          icon="🔥"
          title="Môi giới quá tải"
          count={brokers.filter(b => b.soKhachDangPhuTrach >= 8).length}
          detail="Môi giới vượt ngưỡng workload tối đa"
          variant="red"
        />
        <AlertCard
          icon="⏰"
          title="Chưa follow-up"
          count={customers.filter(c => c.deadline && daysUntil(c.deadline) !== null && daysUntil(c.deadline) <= 0 && c.trangThai !== 'da_ky_hop_dong').length}
          detail="Khách hàng quá deadline follow-up"
          variant="blue"
        />
      </div>

      {/* Main layout: Broker list + Kanban + Detail */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          {/* Broker workload section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Môi giới</h2>
              <span className="text-xs text-slate-400">{brokers.length} người</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {brokers.map(b => (
                <BrokerCard key={b.id} broker={b} isSelected={selectedBrokerId === b.id} onSelect={setSelectedBrokerId} />
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm khách hàng, nhu cầu, khu vực..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">Tất cả priority</option>
                  <option value="cao">Cao</option>
                  <option value="trung_binh">Trung bình</option>
                  <option value="thap">Thấp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kanban board */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Bảng phân công</h2>
            <div className="grid grid-cols-5 gap-4">
              {KANBAN_COLUMNS.map(col => {
                const cards = kanbanData[col.key] || []
                return (
                  <div key={col.key} className={`rounded-xl border-t-4 ${col.color} ${col.bg} border border-slate-200`}>
                    {/* Column header */}
                    <div className={`${col.headerBg} px-4 py-3 rounded-t-lg border-b border-slate-200`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
                        <span className="text-xs font-bold bg-white/60 text-slate-600 px-2 py-0.5 rounded-full">{cards.length}</span>
                      </div>
                    </div>
                    {/* Cards */}
                    <div className="p-3 space-y-3 min-h-48">
                      {cards.map(c => (
                        <KanbanCard key={c.id} customer={c} onAssign={setAssignModal} brokers={brokers} />
                      ))}
                      {cards.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-300">
                          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-xs">Trống</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance analytics */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Hiệu suất môi giới</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Conversion rates */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Tỷ lệ chuyển đổi</p>
                <div className="space-y-3">
                  {brokers.map(b => {
                    const colorSet = BROKER_COLORS[(b.id - 1) % BROKER_COLORS.length]
                    return (
                      <div key={b.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-600">{b.ten}</span>
                          <span className="text-xs font-bold text-slate-800">{b.tyLeChot}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colorSet.bg} transition-all duration-700`} style={{ width: `${b.tyLeChot}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Contracts success */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Hợp đồng thành công</p>
                <div className="space-y-3">
                  {brokers.map(b => {
                    const success = customers.filter(c => c.moiGioiId === b.id && c.trangThai === 'da_ky_hop_dong').length
                    return (
                      <div key={b.id} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">{b.ten}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-emerald-600">{success}</span>
                          <span className="text-[10px] text-slate-400">HĐ</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Commission */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Hoa hồng tháng</p>
                <div className="space-y-3">
                  {brokers.map(b => (
                    <div key={b.id} className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">{b.ten}</span>
                      <span className="text-xs font-bold text-blue-700">{formatVND(b.hoaHongThang)}đ</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active customers */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Khách hàng active</p>
                <div className="space-y-3">
                  {brokers.map(b => {
                    const active = customers.filter(c => c.moiGioiId === b.id && c.trangThai !== 'da_ky_hop_dong').length
                    return (
                      <div key={b.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-600">{b.ten}</span>
                          <span className="text-xs font-bold text-slate-800">{active}</span>
                        </div>
                        <MiniBar value={active} max={8} color="bg-violet-500" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Broker detail panel */}
        {selectedBroker && (
          <div className="hidden xl:block w-105 shrink-0">
            <BrokerDetailPanel broker={selectedBroker} onClose={() => setSelectedBrokerId(null)} customers={customers} />
          </div>
        )}
      </div>

      {/* Empty state when no broker selected */}
      {!selectedBroker && (
        <div className="hidden xl:flex items-center justify-center w-105 shrink-0">
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-slate-400">Chọn môi giới để xem chi tiết</p>
          </div>
        </div>
      )}

      {/* Assignment modal */}
      {assignModal && (
        <AssignmentModal customer={assignModal} onClose={() => setAssignModal(null)} brokers={brokers} />
      )}
    </div>
  )
}
