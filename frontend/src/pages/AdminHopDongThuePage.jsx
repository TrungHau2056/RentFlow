import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import contractService from '../services/contractService'

const STATUS_CONFIG = {
  cho_ky: { label: 'Chờ ký', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  dang_hieu_luc: { label: 'Đang hiệu lực', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  sap_het_han: { label: 'Sắp hết hạn', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
  da_huy: { label: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
}

const WORKFLOW_STEPS = [
  { key: 'dat_lich', label: 'Đặt lịch' },
  { key: 'dam_phan', label: 'Đàm phán' },
  { key: 'tao_hd', label: 'Tạo HĐ' },
  { key: 'ky_hd', label: 'Ký HĐ' },
  { key: 'dang_thue', label: 'Đang thuê' },
  { key: 'ket_thuc', label: 'Kết thúc' },
]

const MOI_GIOI_ALL = 'Tất cả'
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'expiring', label: 'Sắp hết hạn' },
  { key: 'value_desc', label: 'Giá trị cao nhất' },
  { key: 'value_asc', label: 'Giá trị thấp nhất' },
]

const STATUS_MAP = {
  NHAP: 'cho_ky',
  CHO_PHE_DUYET: 'cho_ky',
  DA_PHE_DUYET: 'dang_hieu_luc',
  TU_CHOI: 'da_huy',
  DA_KY: 'dang_hieu_luc',
  HOAN_THANH: 'da_ket_thuc',
  DA_HUY: 'da_huy',
}

const WORKFLOW_MAP = {
  NHAP: 3, CHO_PHE_DUYET: 3, DA_PHE_DUYET: 4,
  TU_CHOI: 1, DA_KY: 4, HOAN_THANH: 6, DA_HUY: 6,
}

// Step 7.2 - Điều kiện kiểm tra trước khi lập hợp đồng
const DIEU_KIEN_LAP_HOP_DONG = [
  { key: 'khachHang', label: 'Thông tin khách thuê đầy đủ', required: true },
  { key: 'chuNha', label: 'Thông tin chủ nhà đầy đủ', required: true },
  { key: 'batDongSan', label: 'Bất động sản còn hiệu lực', required: true },
  { key: 'giaThue', label: 'Giá thuê đã được thống nhất', required: true },
  { key: 'tienCoc', label: 'Tiền cọc đã thỏa thuận', required: false },
  { key: 'lichSuXemNha', label: 'Đã có lịch sử xem nhà', required: false },
]

function formatVND(value) {
  if (value == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function calcThoiHan(start, end) {
  if (!start || !end) return null
  const s = new Date(start), e = new Date(end)
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
}

function mapContract(item) {
  const rawStatus = item.trangThai || ''
  const status = STATUS_MAP[rawStatus] || 'cho_ky'
  const endDate = item.ngayKetThuc ? new Date(item.ngayKetThuc) : null
  const derivedStatus = (status === 'dang_hieu_luc' && endDate && (endDate - new Date()) / (1000 * 60 * 60 * 24) <= 30)
    ? 'sap_het_han' : status
  const thoiHan = calcThoiHan(item.ngayBatDau, item.ngayKetThuc)

  return {
    id: item.id,
    ma: `HĐT-${item.id}`,
    khachThue: item.tenKhachHang || '',
    sdtKhachThue: '',
    emailKhachThue: '',
    chuNha: '',
    sdtChuNha: '',
    batDongSan: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    diaChiBDS: item.diaChiBatDongSan || '',
    loaiBDS: '',
    giaThue: item.tienThue || 0,
    tienCoc: item.tienCoc || 0,
    ngayBatDau: item.ngayBatDau || '',
    ngayKetThuc: item.ngayKetThuc || '',
    thoiHan: thoiHan || 0,
    moiGioi: item.tenNhanVienMoiGioi || '',
    sdtMoiGioi: '',
    trangThai: derivedStatus,
    workflowStep: WORKFLOW_MAP[rawStatus] || 3,
    lichSuThanhToan: [],
    lichSu: [],
  }
}

function MiniSparkline({ data, color = '#2563eb' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 60, h = 24
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

function WorkflowTimeline({ currentStep }) {
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

function ContractRow({ contract, isSelected, onSelect }) {
  const status = STATUS_CONFIG[contract.trangThai]
  const daysLeft = daysUntil(contract.ngayKetThuc)

  return (
    <tr
      onClick={() => onSelect(contract.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{contract.ma}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-cyan-700">{(contract.khachThue || '?').charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{contract.khachThue || '—'}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700 truncate">{contract.chuNha || '—'}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700 truncate max-w-37.5">{contract.batDongSan}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{formatVND(contract.giaThue)}đ</p>
        <p className="text-xs text-slate-400">/tháng</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-600">{formatDate(contract.ngayBatDau)}</p>
        <p className="text-xs text-slate-400">{formatDate(contract.ngayKetThuc)}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{contract.moiGioi || '—'}</p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        {daysLeft !== null && contract.trangThai === 'dang_hieu_luc' && daysLeft <= 60 && (
          <p className="text-xs text-orange-600 font-medium mt-0.5">Còn {daysLeft} ngày</p>
        )}
      </td>
    </tr>
  )
}

function ContractDetail({ contract, onClose, onCheckDieuKien, onGhiNhanKyKet, onCapNhatTrangThai }) {
  if (!contract) return null
  const status = STATUS_CONFIG[contract.trangThai]
  const daysLeft = daysUntil(contract.ngayKetThuc)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      <div className="bg-linear-to-r from-blue-600 to-cyan-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">Hợp đồng thuê</p>
            <h3 className="text-white font-bold text-lg">{contract.ma}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
          {contract.ngayKetThuc && daysLeft !== null && daysLeft <= 60 && contract.trangThai === 'dang_hieu_luc' && (
            <span className="text-xs font-medium text-orange-300 bg-white/10 px-2 py-1 rounded-md">Còn {daysLeft} ngày</span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Khách thuê</h4>
          <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{(contract.khachThue || '?').charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{contract.khachThue || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Bất động sản</h4>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-800">{contract.batDongSan}</p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {contract.diaChiBDS || '—'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Điều khoản thuê</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Giá thuê</p>
              <p className="text-sm font-bold text-slate-800">{formatVND(contract.giaThue)}đ</p>
              <p className="text-[10px] text-slate-400">/tháng</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Tiền cọc</p>
              <p className="text-sm font-bold text-slate-800">{formatVND(contract.tienCoc)}đ</p>
              {Number(contract.giaThue) > 0 && <p className="text-[10px] text-slate-400">{Math.round(Number(contract.tienCoc) / Number(contract.giaThue))} tháng thuê</p>}
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày bắt đầu</p>
              <p className="text-sm font-semibold text-slate-800">{formatDate(contract.ngayBatDau)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày kết thúc</p>
              <p className={`text-sm font-semibold ${daysLeft !== null && daysLeft <= 60 ? 'text-orange-600' : 'text-slate-800'}`}>
                {formatDate(contract.ngayKetThuc)}
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 mt-2 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">Tổng giá trị hợp đồng</p>
                <p className="text-lg font-bold text-emerald-800">{formatVND(Number(contract.giaThue) * (contract.thoiHan || 1))}đ</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-600">Thời hạn</p>
                <p className="text-sm font-semibold text-emerald-800">{contract.thoiHan || '—'} tháng</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Môi giới phụ trách</h4>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-sm font-medium text-slate-800">{contract.moiGioi || '—'}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tiến trình hợp đồng</h4>
          <WorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Action buttons - Steps 7.2, 7.4, 7.5 */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          {contract.trangThai === 'cho_ky' && (
            <>
              <button
                onClick={() => onCheckDieuKien && onCheckDieuKien(contract)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Kiểm tra điều kiện lập hợp đồng
                </span>
              </button>
            </>
          )}
          {contract.trangThai === 'dang_hieu_luc' && (
            <>
              <button
                onClick={() => onGhiNhanKyKet && onGhiNhanKyKet(contract)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Ghi nhận ký kết
                </span>
              </button>
              <button
                onClick={() => onCapNhatTrangThai && onCapNhatTrangThai(contract)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Cập nhật trạng thái BĐS
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 7.2: Modal kiểm tra điều kiện lập hợp đồng ──────────────────
function DieuKienModal({ contract, onClose, onConfirm }) {
  const [dieuKien, setDieuKien] = useState({
    khachHang: true,
    chuNha: true,
    batDongSan: true,
    giaThue: !!contract?.giaThue,
    tienCoc: !!contract?.tienCoc,
    lichSuXemNha: true,
  })

  const tatCaDat = Object.values(dieuKien).every(v => v)

  const toggleDieuKien = (key) => {
    setDieuKien(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-xs">Step 7.2 - Kiểm tra điều kiện</p>
              <h3 className="text-white font-bold text-lg">Điều kiện lập hợp đồng</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {DIEU_KIEN_LAP_HOP_DONG.map((dk) => (
            <div
              key={dk.key}
              onClick={() => toggleDieuKien(dk.key)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                dieuKien[dk.key]
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  dieuKien[dk.key] ? 'bg-emerald-500' : 'bg-slate-300'
                }`}>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-sm font-medium ${dieuKien[dk.key] ? 'text-emerald-800' : 'text-slate-500'}`}>
                  {dk.label}
                </span>
              </div>
              {dk.required && (
                <span className="text-xs text-red-500 font-medium">*</span>
              )}
            </div>
          ))}

          <div className={`mt-4 p-4 rounded-xl border ${
            tatCaDat ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                tatCaDat ? 'bg-emerald-500' : 'bg-amber-500'
              }`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {tatCaDat ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                </svg>
              </div>
              <div>
                <p className={`text-sm font-semibold ${tatCaDat ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {tatCaDat ? 'Tất cả điều kiện đã đạt!' : 'Còn điều kiện chưa đạt'}
                </p>
                <p className={`text-xs mt-0.5 ${tatCaDat ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {tatCaDat
                    ? 'Có thể tiến hành lập hợp đồng thuê.'
                    : 'Vui lòng kiểm tra và xác nhận các điều kiện chưa đạt (có dấu *).'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(tatCaDat)}
            disabled={!tatCaDat}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tatCaDat
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Tiếp tục lập hợp đồng
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Step 7.4: Modal ghi nhận ký kết hợp đồng ─────────────────────────
function KyKetModal({ contract, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ngayKy: new Date().toISOString().slice(0, 10),
    nguoiKyBenA: '',
    nguoiKyBenB: '',
    fileHopDong: null,
    ghiChu: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (onSave) {
        await onSave({ ...formData, contractId: contract?.id })
      }
      onClose()
    } catch (err) {
      console.error('Failed to save contract signing:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs">Ghi nhận ký kết</p>
              <h3 className="text-white font-bold text-lg">{contract?.ma || 'Hợp đồng thuê'}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Contract summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Khách thuê</p>
                <p className="font-medium text-slate-800">{contract?.khachThue || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Bất động sản</p>
                <p className="font-medium text-slate-800 truncate">{contract?.batDongSan || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Giá thuê</p>
                <p className="font-semibold text-slate-800">{formatVND(contract?.giaThue)}đ/tháng</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Thời hạn</p>
                <p className="font-semibold text-slate-800">{contract?.thoiHan || '—'} tháng</p>
              </div>
            </div>
          </div>

          {/* Signing date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ngày ký *</label>
            <input
              type="date"
              value={formData.ngayKy}
              onChange={(e) => setFormData(prev => ({ ...prev, ngayKy: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Signatories */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bên A (Chủ nhà)</label>
              <input
                type="text"
                value={formData.nguoiKyBenA}
                onChange={(e) => setFormData(prev => ({ ...prev, nguoiKyBenA: e.target.value }))}
                placeholder="Người đại diện"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bên B (Khách thuê)</label>
              <input
                type="text"
                value={formData.nguoiKyBenB}
                onChange={(e) => setFormData(prev => ({ ...prev, nguoiKyBenB: e.target.value }))}
                placeholder="Người đại diện"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">File hợp đồng đã ký</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs text-slate-500">
                {formData.fileHopDong ? formData.fileHopDong.name : 'Click để upload file PDF'}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú</label>
            <textarea
              value={formData.ghiChu}
              onChange={(e) => setFormData(prev => ({ ...prev, ghiChu: e.target.value }))}
              rows={2}
              placeholder="Ghi chú bổ sung..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <p className="text-xs text-slate-400 italic">
            Sau khi ghi nhận ký kết, hợp đồng sẽ chuyển sang trạng thái "Đang hiệu lực".
          </p>
        </div>

        <div className="border-t border-slate-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Ghi nhận ký kết'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Step 7.5: Modal cập nhật trạng thái BĐS ──────────────────────────
function CapNhatTrangThaiBDSSModal({ contract, onClose, onSave }) {
  const [trangThai, setTrangThai] = useState('dang_thue')
  const [ghiChu, setGhiChu] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (onSave) {
        await onSave({ contractId: contract?.id, batDongSanId: contract?.batDongSan, trangThai, ghiChu })
      }
      onClose()
    } catch (err) {
      console.error('Failed to update property status:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-linear-to-r from-amber-600 to-orange-600 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-200 text-xs">Step 7.5 - Cập nhật trạng thái</p>
              <h3 className="text-white font-bold text-lg">Cập nhật trạng thái BĐS</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-400 mb-1">Bất động sản</p>
            <p className="font-medium text-slate-800 truncate">{contract?.batDongSan || '—'}</p>
            <p className="text-xs text-slate-500 mt-1">{contract?.diaChiBDS || '—'}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Trạng thái mới</label>
            <div className="space-y-2">
              {[
                { value: 'dang_thue', label: 'Đang cho thuê', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                { value: 'da_ban', label: 'Đã bán', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { value: 'ngung_cho_thue', label: 'Ngừng cho thuê', color: 'bg-slate-50 border-slate-200 text-slate-600' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setTrangThai(opt.value)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    trangThai === opt.value ? 'border-amber-500 ring-2 ring-amber-200' : opt.color
                  }`}
                >
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú</label>
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={2}
              placeholder="Ghi chú về thay đổi trạng thái..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AlertCard({ title, description, count, color, icon }) {
  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${color}`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{title}</p>
          {count > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80">{count}</span>}
        </div>
        <p className="text-xs mt-0.5 opacity-80">{description}</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-20">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có hợp đồng thuê nào</h3>
        <p className="text-slate-500 text-sm">Khi có hợp đồng thuê mới, chúng sẽ hiển thị tại đây.</p>
      </div>
    </div>
  )
}

export default function AdminHopDongThuePage() {
  const navigate = useNavigate()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [filterMoiGioi, setFilterMoiGioi] = useState(MOI_GIOI_ALL)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)

  // Step 7.2 - Modal kiểm tra điều kiện
  const [dieuKienModal, setDieuKienModal] = useState(null)
  // Step 7.4 - Modal ghi nhận ký kết
  const [kyKetModal, setKyKetModal] = useState(null)
  // Step 7.5 - Modal cập nhật trạng thái BĐS
  const [capNhatTrangThaiModal, setCapNhatTrangThaiModal] = useState(null)

  // Handler cho step 7.2
  const handleCheckDieuKien = (contract) => {
    setDieuKienModal(contract)
  }

  const handleConfirmDieuKien = (tatCaDat) => {
    if (tatCaDat) {
      setDieuKienModal(null)
      navigate(`/admin/hop-dong-thue/tao-moi?contractId=${dieuKienModal?.id}`)
    }
  }

  // Handler cho step 7.4
  const handleGhiNhanKyKet = async ({ contractId, ngayKy, nguoiKyBenA, nguoiKyBenB, fileHopDong, ghiChu }) => {
    console.log('Ghi nhận ký kết:', { contractId, ngayKy, nguoiKyBenA, nguoiKyBenB, fileHopDong, ghiChu })
    // TODO: Gọi API cập nhật hợp đồng
    fetchContracts()
  }

  // Handler cho step 7.5
  const handleCapNhatTrangThaiBDS = async ({ batDongSanId, trangThai, ghiChu }) => {
    console.log('Cập nhật trạng thái BĐS:', { batDongSanId, trangThai, ghiChu })
    // TODO: Gọi API cập nhật trạng thái BĐS
    fetchContracts()
  }

  const fetchContracts = async () => {
    try {
      const res = await contractService.getThueContracts()
      setContracts((res?.data || []).map(mapContract))
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách hợp đồng')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContracts() }, [])

  const moiGioiOptions = useMemo(() => {
    const names = [...new Set(contracts.map(c => c.moiGioi).filter(Boolean))]
    return [MOI_GIOI_ALL, ...names.sort()]
  }, [contracts])

  const filtered = useMemo(() => {
    let result = [...contracts]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.ma.toLowerCase().includes(q) ||
        (c.khachThue || '').toLowerCase().includes(q) ||
        (c.batDongSan || '').toLowerCase().includes(q)
      )
    }
    if (filterTrangThai !== 'all') result = result.filter(c => c.trangThai === filterTrangThai)
    if (filterMoiGioi !== MOI_GIOI_ALL) result = result.filter(c => c.moiGioi === filterMoiGioi)

    switch (sortBy) {
      case 'expiring':
        result.sort((a, b) => {
          if (!a.ngayKetThuc) return 1
          if (!b.ngayKetThuc) return -1
          return new Date(a.ngayKetThuc) - new Date(b.ngayKetThuc)
        })
        break
      case 'value_desc': result.sort((a, b) => (b.giaThue || 0) - (a.giaThue || 0)); break
      case 'value_asc': result.sort((a, b) => (a.giaThue || 0) - (b.giaThue || 0)); break
      default: result.sort((a, b) => new Date(b.ngayBatDau || 0) - new Date(a.ngayBatDau || 0))
    }
    return result
  }, [contracts, searchQuery, filterTrangThai, filterMoiGioi, sortBy])

  const kpiData = useMemo(() => ({
    total: contracts.length,
    dangHieuLuc: contracts.filter(c => c.trangThai === 'dang_hieu_luc').length,
    sapHetHan: contracts.filter(c => c.trangThai === 'sap_het_han').length,
    choKy: contracts.filter(c => c.trangThai === 'cho_ky').length,
    daKetThuc: contracts.filter(c => c.trangThai === 'da_ket_thuc' || c.trangThai === 'da_huy').length,
  }), [contracts])

  const alertData = useMemo(() => {
    const sapHetHan = contracts.filter(c => c.trangThai === 'sap_het_han')
    const treHan = contracts.filter(c => c.lichSuThanhToan.some(p => p.trangThai === 'tre_han'))
    const choKy = contracts.filter(c => c.trangThai === 'cho_ky')
    return { sapHetHan, treHan, choKy }
  }, [contracts])

  const selectedContract = selectedId ? contracts.find(c => c.id === selectedId) : null

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-700 font-medium mb-2">Lỗi tải dữ liệu</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={fetchContracts} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý hợp đồng thuê</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi và quản lý hợp đồng thuê bất động sản</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} label="Tổng hợp đồng thuê" value={kpiData.total} color="text-blue-600" bgColor="bg-blue-50" sparkData={[6, 8, 7, 10, 9, 12, 10]} sparkColor="#2563eb" />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} label="Đang hiệu lực" value={kpiData.dangHieuLuc} color="text-emerald-600" bgColor="bg-emerald-50" sparkData={[3, 4, 5, 4, 5, 6, 4]} sparkColor="#059669" />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Sắp hết hạn" value={kpiData.sapHetHan} color="text-orange-600" bgColor="bg-orange-50" sparkData={[1, 1, 2, 2, 3, 3, 3]} sparkColor="#ea580c" accent />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} label="Chờ ký" value={kpiData.choKy} color="text-amber-600" bgColor="bg-amber-50" sparkData={[1, 2, 1, 2, 2, 3, 2]} sparkColor="#d97706" accent />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} label="Đã kết thúc" value={kpiData.daKetThuc} color="text-slate-500" bgColor="bg-slate-50" sparkData={[1, 1, 2, 2, 2, 3, 2]} sparkColor="#64748b" />
      </div>

      {(alertData.sapHetHan.length > 0 || alertData.treHan.length > 0 || alertData.choKy.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {alertData.sapHetHan.length > 0 && (
            <AlertCard title="Hợp đồng sắp hết hạn" description={`${alertData.sapHetHan.map(c => c.ma).join(', ')} cần gia hạn hoặc đóng`} count={alertData.sapHetHan.length} color="bg-orange-50 border-orange-200 text-orange-800" icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          )}
          {alertData.treHan.length > 0 && (
            <AlertCard title="Thanh toán trễ hạn" description={`${alertData.treHan.length} hợp đồng có khoản thanh toán trễ`} count={alertData.treHan.length} color="bg-red-50 border-red-200 text-red-800" icon={<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
          )}
          {alertData.choKy.length > 0 && (
            <AlertCard title="Hợp đồng chờ ký" description={`${alertData.choKy.map(c => c.ma).join(', ')} đang chờ ký kết`} count={alertData.choKy.length} color="bg-amber-50 border-amber-200 text-amber-800" icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} />
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-60 flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Tìm kiếm mã HĐ, khách thuê, chủ nhà..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm" />
          </div>
          <select value={filterTrangThai} onChange={(e) => setFilterTrangThai(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (<option key={key} value={key}>{cfg.label}</option>))}
          </select>

          {/* Filter: Môi giới */}
          <select
            value={filterMoiGioi}
            onChange={(e) => setFilterMoiGioi(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {moiGioiOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mã HĐ</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Khách thuê</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chủ nhà</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bất động sản</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Giá thuê</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thời hạn</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Môi giới</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(c => (
                      <ContractRow key={c.id} contract={c} isSelected={selectedId === c.id} onSelect={setSelectedId} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Hiển thị {filtered.length} / {contracts.length} hợp đồng</span>
              </div>
            </div>
          </div>
          {selectedContract && (
            <div className="w-105 shrink-0 hidden xl:block">
              <ContractDetail contract={selectedContract} onClose={() => setSelectedId(null)} onCheckDieuKien={handleCheckDieuKien} onGhiNhanKyKet={handleGhiNhanKyKet} onCapNhatTrangThai={handleCapNhatTrangThaiBDS} />
            </div>
          )}
        </div>
      )}

      {dieuKienModal && (
        <DieuKienModal contract={dieuKienModal} onClose={() => setDieuKienModal(null)} onConfirm={handleConfirmDieuKien} />
      )}
      {kyKetModal && (
        <KyKetModal contract={kyKetModal} onClose={() => setKyKetModal(null)} onSave={handleGhiNhanKyKet} />
      )}
      {capNhatTrangThaiModal && (
        <CapNhatTrangThaiBDSSModal contract={capNhatTrangThaiModal} onClose={() => setCapNhatTrangThaiModal(null)} onSave={handleCapNhatTrangThaiBDS} />
      )}
    </div>
  )
}
