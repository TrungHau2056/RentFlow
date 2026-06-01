import { useState, useEffect, useMemo, useCallback } from 'react'
import contractService from '../services/contractService'
import hopDongKyGuiService from '../services/hopDongKyGuiService'
import { normalizeInternalRole, ROLE_GROUPS } from '../config/roles'
import api from '../services/api'

const STATUS_CONFIG = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky: { label: 'Chờ ký', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  dang_hieu_luc: { label: 'Đang hiệu lực', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  sap_het_han: { label: 'Sắp hết hạn', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
  tam_ngung: { label: 'Tạm ngưng', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
}

const LEGAL_STATUS_CONFIG = {
  cho_phap_luat: { label: 'Chờ pháp luật', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
  can_sua: { label: 'Cần sửa', color: 'bg-orange-50 text-orange-700', dot: 'bg-orange-400' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700', dot: 'bg-red-400' },
}

const WORKFLOW_STEPS = [
  { key: 'tiep_nhan', label: 'Tiếp nhận' },
  { key: 'soan_hop_dong', label: 'Soạn HĐ' },
  { key: 'phap_luat_duyet', label: 'PL duyệt' },
  { key: 'cho_ky', label: 'Chờ ký' },
  { key: 'hieu_luc', label: 'Hiệu lực' },
]

const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'expiring', label: 'Sắp hết hạn' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'amount_desc', label: 'Tiền ĐB cao nhất' },
  { key: 'amount_asc', label: 'Tiền ĐB thấp nhất' },
]

const CLAUSE_STATUS = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
}

const STATUS_MAP = {
  NHAP: 'cho_duyet',
  CHO_PHE_DUYET: 'cho_duyet',
  DA_PHE_DUYET: 'cho_ky',
  TU_CHOI: 'tam_ngung',
  DA_KY: 'dang_hieu_luc',
  HOAN_THANH: 'da_ket_thuc',
  DA_HUY: 'da_ket_thuc',
}

const LEGAL_MAP = {
  NHAP: 'cho_phap_luat',
  CHO_PHE_DUYET: 'cho_phap_luat',
  DA_PHE_DUYET: 'da_duyet',
  TU_CHOI: 'tu_choi',
  DA_KY: 'da_duyet',
  HOAN_THANH: 'da_duyet',
  DA_HUY: 'da_duyet',
}

const WORKFLOW_MAP = {
  NHAP: 1, CHO_PHE_DUYET: 2, DA_PHE_DUYET: 3,
  TU_CHOI: 2, DA_KY: 5, HOAN_THANH: 5, DA_HUY: 5,
}

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

function calcThoiHan(ngayBatDau, ngayKetThuc) {
  if (!ngayBatDau || !ngayKetThuc) return null
  const start = new Date(ngayBatDau)
  const end = new Date(ngayKetThuc)
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
}

function mapContract(item) {
  const rawStatus = item.trangThai || ''
  const ngayBatDau = item.ngayBatDau || item.ngayKy
  const ngayKetThuc = item.ngayKetThuc
  const status = STATUS_MAP[rawStatus] || 'cho_duyet'

  const now = new Date()
  const endDate = ngayKetThuc ? new Date(ngayKetThuc) : null
  const derivedStatus = (status === 'dang_hieu_luc' && endDate && (endDate - now) / (1000 * 60 * 60 * 24) <= 30)
    ? 'sap_het_han' : status

  return {
    id: item.id,
    ma: `HĐKG-${item.id}`,
    chuNha: item.tenChuNha || '',
    sdtChuNha: '',
    emailChuNha: '',
    batDongSan: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    diaChiBDS: item.diaChiBatDongSan || '',
    loaiBDS: '',
    giaThue: item.giaThue || 0,
    ngayKy: item.ngayKy || '',
    thoiHan: calcThoiHan(ngayBatDau, ngayKetThuc) || 0,
    ngayHetHan: ngayKetThuc || '',
    tienDamBao: item.tienDamBao || 0,
    trangThai: derivedStatus,
    trangThaiPhapLy: LEGAL_MAP[rawStatus] || 'cho_phap_luat',
    moiGioi: item.tenNhanVien || '',
    sdtMoiGioi: '',
    dieuKhoanPhatSinh: [],
    workflowStep: WORKFLOW_MAP[rawStatus] || 1,
    lichSu: [],
  }
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                isActive
                  ? isCurrent ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {isActive && !isCurrent ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : stepNum}
              </div>
              <span className={`text-[9px] mt-1.5 text-center leading-tight whitespace-nowrap ${isCurrent ? 'text-amber-700 font-semibold' : isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 rounded-full ${stepNum < currentStep ? 'bg-blue-500' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ContractRow({ contract, isSelected, onSelect }) {
  const status = STATUS_CONFIG[contract.trangThai] || { color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', label: contract.trangThai }
  const legalStatus = LEGAL_STATUS_CONFIG[contract.trangThaiPhapLy] || { color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400', label: contract.trangThaiPhapLy }
  const daysLeft = daysUntil(contract.ngayHetHan)

  return (
    <tr
      onClick={() => onSelect(contract.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{contract.ma}</p>
        <p className="text-xs text-slate-400">{formatDate(contract.ngayKy)}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-blue-700">{contract.chuNha?.charAt(0) || '?'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{contract.chuNha || '—'}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700 truncate max-w-[180px]">{contract.batDongSan}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{contract.thoiHan ? `${contract.thoiHan} tháng` : '—'}</p>
        {contract.ngayHetHan && (
          <p className={`text-xs ${daysLeft !== null && daysLeft <= 30 ? 'text-orange-600 font-medium' : 'text-slate-400'}`}>
            {daysLeft !== null && daysLeft > 0 ? `Còn ${daysLeft} ngày` : daysLeft === 0 ? 'Hết hạn hôm nay' : 'Đã hết hạn'}
          </p>
        )}
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{formatVND(contract.tienDamBao)}đ</p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${legalStatus.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${legalStatus.dot}`} />
          {legalStatus.label}
        </span>
      </td>
    </tr>
  )
}

function ContractDetail({ contract, onClose, onAction }) {
  if (!contract) return null
  const status = STATUS_CONFIG[contract.trangThai] || { color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', label: contract.trangThai }
  const legalStatus = LEGAL_STATUS_CONFIG[contract.trangThaiPhapLy] || { color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400', label: contract.trangThaiPhapLy }
  const daysLeft = daysUntil(contract.ngayHetHan)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">Hợp đồng ký gửi</p>
            <h3 className="text-white font-bold text-lg">{contract.ma}</h3>
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
          <span className={`text-xs font-medium ${legalStatus.color} bg-white/10 px-2 py-1 rounded-md`}>
            PL: {legalStatus.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin chủ nhà</h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{contract.chuNha.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{contract.chuNha || '—'}</p>
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
            {contract.giaThue > 0 && (
              <span className="text-xs text-slate-500 mt-1 inline-block">Giá thuê: <span className="font-semibold text-slate-700">{formatVND(contract.giaThue)}đ/tháng</span></span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Điều khoản ký gửi</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày ký</p>
              <p className="text-sm font-semibold text-slate-800">{formatDate(contract.ngayKy)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Thời hạn</p>
              <p className="text-sm font-semibold text-slate-800">{contract.thoiHan ? `${contract.thoiHan} tháng` : '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày hết hạn</p>
              <p className={`text-sm font-semibold ${daysLeft !== null && daysLeft <= 30 ? 'text-orange-600' : 'text-slate-800'}`}>
                {formatDate(contract.ngayHetHan)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Tiền đảm bảo</p>
              <p className="text-sm font-semibold text-slate-800">{formatVND(contract.tienDamBao)}đ</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tiền đảm bảo</h4>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">Số tiền giữ</p>
                <p className="text-lg font-bold text-emerald-800">{formatVND(contract.tienDamBao)}đ</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            {contract.giaThue > 0 && (
              <p className="text-xs text-emerald-600 mt-1">Tương đương {Math.round(contract.tienDamBao / contract.giaThue)} tháng tiền thuê</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Môi giới phụ trách</h4>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-sm font-medium text-slate-800">{contract.moiGioi || '—'}</p>
          </div>
        </div>

        {/* Additional Clauses */}
        {(contract.dieuKhoanPhatSinh || []).length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Điều khoản phát sinh</h4>
            <div className="space-y-2">
              {(contract.dieuKhoanPhatSinh || []).map((dk, i) => {
                const clauseStatus = CLAUSE_STATUS[dk.trangThai]
                return (
                  <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-700 flex-1">{dk.noiDung}</p>
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium border ${clauseStatus.color}`}>
                        {clauseStatus.label}
                      </span>
                    </div>
                    {dk.ghiChu && <p className="text-xs text-slate-400 mt-1.5 italic">{dk.ghiChu}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PDF */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">File hợp đồng</h4>
          <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs text-slate-400">Chưa có file PDF</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tiến trình pháp lý</h4>
          <WorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Activity History */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch sử hoạt động</h4>
          <div className="space-y-0">
            {(contract.lichSu || []).map((item, i) => {
              const iconConfig = {
                create: { bg: 'bg-blue-100', color: 'text-blue-600', icon: 'M12 4v16m8-8H4' },
                edit: { bg: 'bg-amber-100', color: 'text-amber-600', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                approve: { bg: 'bg-emerald-100', color: 'text-emerald-600', icon: 'M5 13l4 4L19 7' },
                sign: { bg: 'bg-indigo-100', color: 'text-indigo-600', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                active: { bg: 'bg-cyan-100', color: 'text-cyan-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                send: { bg: 'bg-purple-100', color: 'text-purple-600', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                reject: { bg: 'bg-red-100', color: 'text-red-600', icon: 'M6 18L18 6M6 6l12 12' },
                expire: { bg: 'bg-slate-100', color: 'text-slate-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                suspend: { bg: 'bg-orange-100', color: 'text-orange-600', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
              }
              const cfg = iconConfig[item.loai] || iconConfig.create
              const isLast = i === contract.lichSu.length - 1
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <svg className={`w-3.5 h-3.5 ${cfg.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cfg.icon} />
                      </svg>
                    </div>
                    {!isLast && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className={`pb-3 ${isLast ? '' : ''}`}>
                    <p className="text-xs text-slate-700">{item.noiDung}</p>
                    <p className="text-[10px] text-slate-400">{item.nguoi} · {formatDate(item.ngay)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thao tác</h4>
          <div className="space-y-2">
            {(contract.trangThai === 'cho_duyet' || contract.trangThaiPhapLy === 'can_sua') && (
              <div className="flex gap-2">
                <button
                  onClick={() => onAction?.('approve', contract.id)}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Duyệt hợp đồng
                </button>
                <button
                  onClick={() => onAction?.('reject', contract.id)}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Từ chối
                </button>
              </div>
            )}
            {contract.trangThai === 'cho_ky' && (
              <button
                onClick={() => onAction?.('kyKet', contract.id)}
                className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Ký kết hợp đồng
              </button>
            )}
            {contract.trangThai === 'cho_duyet' && (
              <button
                onClick={() => onAction?.('guiPheDuyet', contract.id)}
                className="w-full py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Gửi duyệt pháp lý
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onAction?.('edit', contract.id)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </button>
              <button
                onClick={() => onAction?.('delete', contract.id)}
                className="flex-1 py-2.5 rounded-lg border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa
              </button>
            </div>
            {contract.trangThai === 'dang_hieu_luc' && (
              <button
                onClick={() => onAction?.('extend', contract.id)}
                className="w-full py-2.5 rounded-lg border border-amber-300 text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Gia hạn hợp đồng
              </button>
            )}
          </div>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có hợp đồng nào</h3>
        <p className="text-slate-500 text-sm">Khi có hợp đồng ký gửi mới, chúng sẽ hiển thị tại đây.</p>
      </div>
    </div>
  )
}

function CreateContractModal({ onClose, onCreate, chuNhaList, batDongSanList }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    chuNhaId: '',
    batDongSanId: '',
    nhanVienId: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    tienDamBao: '',
    coDieuKhoanPhatSinh: false,
    dieuKhoanPhatSinh: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateStep = (stepNum) => {
    if (stepNum === 0) {
      if (!formData.chuNhaId || !formData.batDongSanId || !formData.ngayBatDau || !formData.ngayKetThuc || !formData.tienDamBao) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc')
        return false
      }
    }
    setError('')
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        chuNhaId: Number(formData.chuNhaId),
        batDongSanId: Number(formData.batDongSanId),
        nhanVienId: Number(formData.nhanVienId) || 1,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
        tienDamBao: Number(formData.tienDamBao),
      }
      await hopDongKyGuiService.tao(payload)
      onCreate()
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo hợp đồng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tạo hợp đồng ký gửi</h2>
            <p className="text-xs text-slate-500 mt-0.5">{step === 0 ? 'Soạn thảo hợp đồng ký gửi mới' : 'Kiểm tra điều khoản phát sinh'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${step >= 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
            <div className={`flex-1 h-0.5 ${step >= 1 ? 'bg-blue-500' : 'bg-slate-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <label className="col-span-2">
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Chủ nhà *</span>
                <select
                  value={formData.chuNhaId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, chuNhaId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">-- Chọn chủ nhà --</option>
                  {(chuNhaList || []).map((cn) => (
                    <option key={cn.id} value={cn.id}>{cn.hoTen}</option>
                  ))}
                </select>
              </label>

              <label className="col-span-2">
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Bất động sản * <span className="font-normal text-slate-400">(danh sách nhà đã khảo sát)</span></span>
                <select
                  value={formData.batDongSanId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, batDongSanId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">-- Chọn bất động sản --</option>
                  {(batDongSanList || []).filter(bds => bds.trangThai === 'DA_KHAO_SAT').map((bds) => (
                    <option key={bds.id} value={bds.id}>{bds.diaChi}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày bắt đầu *</span>
                <input
                  type="date"
                  value={formData.ngayBatDau}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ngayBatDau: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </label>

              <label>
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày kết thúc *</span>
                <input
                  type="date"
                  value={formData.ngayKetThuc}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ngayKetThuc: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </label>

              <label>
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Tiền đảm bảo (VNĐ) *</span>
                <input
                  type="number"
                  value={formData.tienDamBao}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tienDamBao: e.target.value }))}
                  placeholder="10000000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Có điều khoản phát sinh?</p>
                <p className="text-xs text-slate-500 mt-0.5">Kiểm tra xem hợp đồng có điều khoản đặc biệt nào cần lưu ý không</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coDieuKhoanPhatSinh: false }))}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                    !formData.coDieuKhoanPhatSinh
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Không có
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coDieuKhoanPhatSinh: true }))}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                    formData.coDieuKhoanPhatSinh
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Có điều khoản
                </button>
              </div>

              {formData.coDieuKhoanPhatSinh && (
                <label className="block">
                  <span className="block text-xs font-semibold text-slate-600 mb-1.5">Mô tả điều khoản phát sinh</span>
                  <textarea
                    value={formData.dieuKhoanPhatSinh}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dieuKhoanPhatSinh: e.target.value }))}
                    placeholder="Mô tả chi tiết các điều khoản đặc biệt cần lưu ý..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </label>
              )}

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-700 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lưu ý: Nếu có điều khoản phát sinh, hợp đồng sẽ được đánh dấu để bộ phận pháp lý xem xét kỹ hơn.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            {step === 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Quay lại
              </button>
            )}
            {step === 0 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Tiếp tục
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : 'Tạo hợp đồng'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminHopDongKyGuiPage() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [filterPhapLy, setFilterPhapLy] = useState('all')
  const [filterChuNha, setFilterChuNha] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [chuNhaList, setChuNhaList] = useState([])
  const [batDongSanList, setBatDongSanList] = useState([])
  const [actionLoading, setActionLoading] = useState(null)
  const [notice, setNotice] = useState('')

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const roleGroup = normalizeInternalRole(userInfo?.role)
  const isAdmin = roleGroup === ROLE_GROUPS.ADMIN
  const isNhanVienDaiLy = roleGroup === ROLE_GROUPS.AGENCY
  const isPhapLuat = roleGroup === ROLE_GROUPS.LEGAL

  const fetchContracts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await contractService.getKyGuiContracts()
      setContracts((res?.data || []).map(mapContract))
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách hợp đồng')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchChuNhaList = async () => {
    try {
      const res = await api.get('/api/chu-nha')
      setChuNhaList(res.data?.data || [])
    } catch {
      setChuNhaList([])
    }
  }

  const fetchBatDongSanList = async () => {
    try {
      const res = await api.get('/api/bat-dong-san')
      setBatDongSanList(res.data?.data || [])
    } catch {
      setBatDongSanList([])
    }
  }

  useEffect(() => {
    fetchContracts()
    fetchChuNhaList()
    fetchBatDongSanList()
  }, [])

  const chuNhaOptions = useMemo(() => {
    const names = contracts.map(c => c.chuNha).filter(Boolean)
    return ['Tất cả', ...new Set(names)]
  }, [contracts])

  const filtered = useMemo(() => {
    let result = [...contracts]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.ma.toLowerCase().includes(q) ||
        c.chuNha.toLowerCase().includes(q) ||
        c.batDongSan.toLowerCase().includes(q) ||
        c.diaChiBDS.toLowerCase().includes(q)
      )
    }
    if (filterTrangThai !== 'all') result = result.filter(c => c.trangThai === filterTrangThai)
    if (filterPhapLy !== 'all') result = result.filter(c => c.trangThaiPhapLy === filterPhapLy)
    if (filterChuNha !== 'Tất cả') result = result.filter(c => c.chuNha === filterChuNha)

    switch (sortBy) {
      case 'expiring':
        result.sort((a, b) => {
          if (!a.ngayHetHan) return 1
          if (!b.ngayHetHan) return -1
          return new Date(a.ngayHetHan) - new Date(b.ngayHetHan)
        })
        break
      case 'pending': {
        const order = { cho_duyet: 0, cho_ky: 1, sap_het_han: 2, tam_ngung: 3, dang_hieu_luc: 4, da_ket_thuc: 5 }
        result.sort((a, b) => (order[a.trangThai] || 9) - (order[b.trangThai] || 9))
        break
      }
      case 'amount_desc': result.sort((a, b) => (b.tienDamBao || 0) - (a.tienDamBao || 0)); break
      case 'amount_asc': result.sort((a, b) => (a.tienDamBao || 0) - (b.tienDamBao || 0)); break
      default: result.sort((a, b) => {
        const dateA = (a.lichSu || [])[0]?.ngay || a.ngayKy || ''
        const dateB = (b.lichSu || [])[0]?.ngay || b.ngayKy || ''
        return new Date(dateB) - new Date(dateA)
      })
    }
    return result
  }, [contracts, searchQuery, filterTrangThai, filterPhapLy, filterChuNha, sortBy])

  const kpiData = useMemo(() => ({
    total: contracts.length,
    choDuyet: contracts.filter(c => c.trangThai === 'cho_duyet').length,
    dangHieuLuc: contracts.filter(c => c.trangThai === 'dang_hieu_luc').length,
    sapHetHan: contracts.filter(c => c.trangThai === 'sap_het_han').length,
    coDieuKhoan: contracts.filter(c => (c.dieuKhoanPhatSinh || []).length > 0).length,
  }), [contracts])

  const alertData = useMemo(() => {
    const sapHetHan = contracts.filter(c => c.trangThai === 'sap_het_han')
    const choPhapLuat = contracts.filter(c => c.trangThaiPhapLy === 'cho_phap_luat' || c.trangThaiPhapLy === 'can_sua' || c.trangThaiPhapLy === 'tu_choi')
    const thieuChuKy = contracts.filter(c => c.trangThai === 'cho_ky')
    return { sapHetHan, choPhapLuat, thieuChuKy }
  }, [contracts])

  const selectedContract = selectedId ? contracts.find(c => c.id === selectedId) : null

  const handleAction = async (action, id) => {
    setActionLoading(action)
    try {
      switch (action) {
        case 'approve': {
          if (!window.confirm('Xác nhận duyệt hợp đồng này?')) return
          await contractService.approveKyGuiContract(id, true)
          setNotice('Đã duyệt hợp đồng thành công')
          break
        }
        case 'reject': {
          const lyDo = prompt('Nhập lý do từ chối:')
          if (lyDo === null) return
          await contractService.approveKyGuiContract(id, false, lyDo || 'Không có lý do')
          setNotice('Đã từ chối hợp đồng')
          break
        }
        case 'guiPheDuyet': {
          if (!window.confirm('Gửi hợp đồng này đến bộ phận pháp lý để duyệt?')) return
          await hopDongKyGuiService.guiPheDuyet(id)
          setNotice('Đã gửi duyệt pháp lý')
          break
        }
        case 'kyKet': {
          if (!window.confirm('Xác nhận ký kết hợp đồng này?')) return
          await hopDongKyGuiService.kyKet(id)
          setNotice('Đã ký kết hợp đồng')
          break
        }
        case 'delete': {
          const contract = contracts.find(c => c.id === id)
          if (contract?.trangThai !== 'cho_duyet') {
            alert('Chỉ có thể xóa hợp đồng ở trạng thái "Chờ duyệt"')
            return
          }
          if (!window.confirm('Xác nhận xóa hợp đồng này?')) return
          await hopDongKyGuiService.xoa(id)
          setNotice('Đã xóa hợp đồng')
          if (selectedId === id) setSelectedId(null)
          break
        }
        case 'edit':
          setNotice('Chức năng chỉnh sửa đang phát triển')
          return
        case 'extend':
          setNotice('Chức năng gia hạn đang phát triển')
          return
        default:
          return
      }
      fetchContracts()
    } catch (err) {
      setNotice(err.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreate = () => {
    setCreateModalOpen(false)
    setNotice('Đã tạo hợp đồng thành công')
    fetchContracts()
    fetchChuNhaList()
    fetchBatDongSanList()
  }

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
          <h1 className="text-2xl font-bold text-slate-800">Quản lý hợp đồng ký gửi</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi và xử lý hợp đồng ký gửi bất động sản</p>
        </div>
        {(isAdmin || isNhanVienDaiLy) && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo hợp đồng
          </button>
        )}
      </div>

      {notice && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notice}
          </span>
          <button onClick={() => setNotice('')} className="text-blue-500 hover:text-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 mb-6">
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} label="Tổng hợp đồng" value={kpiData.total} color="text-blue-600" bgColor="bg-blue-50" sparkData={[5, 8, 6, 10, 9, 12, 10]} sparkColor="#2563eb" />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Chờ duyệt" value={kpiData.choDuyet} color="text-amber-600" bgColor="bg-amber-50" sparkData={[1, 3, 2, 4, 3, 5, 3]} sparkColor="#d97706" accent />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} label="Đang hiệu lực" value={kpiData.dangHieuLuc} color="text-emerald-600" bgColor="bg-emerald-50" sparkData={[3, 4, 5, 4, 6, 5, 7]} sparkColor="#059669" />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Sắp hết hạn" value={kpiData.sapHetHan} color="text-orange-600" bgColor="bg-orange-50" sparkData={[0, 1, 0, 1, 1, 2, 1]} sparkColor="#ea580c" accent />
        <KPICard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} label="Có điều khoản phát sinh" value={kpiData.coDieuKhoan} color="text-purple-600" bgColor="bg-purple-50" sparkData={[2, 3, 2, 4, 3, 5, 4]} sparkColor="#7c3aed" />
      </div>

      {(alertData.sapHetHan.length > 0 || alertData.choPhapLuat.length > 0 || alertData.thieuChuKy.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {alertData.sapHetHan.length > 0 && (
            <AlertCard title="Hợp đồng sắp hết hạn" description={`${alertData.sapHetHan.map(c => c.ma).join(', ')} cần gia hạn hoặc đóng`} count={alertData.sapHetHan.length} color="bg-orange-50 border-orange-200 text-orange-800" icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          )}
          {alertData.choPhapLuat.length > 0 && (
            <AlertCard title="Chờ pháp luật xử lý" description={`${alertData.choPhapLuat.length} hợp đồng cần bộ phận pháp luật duyệt hoặc sửa đổi`} count={alertData.choPhapLuat.length} color="bg-amber-50 border-amber-200 text-amber-800" icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>} />
          )}
          {alertData.thieuChuKy.length > 0 && (
            <AlertCard title="Thiếu chữ ký" description={`${alertData.thieuChuKy.map(c => c.ma).join(', ')} chờ chủ nhà ký`} count={alertData.thieuChuKy.length} color="bg-blue-50 border-blue-200 text-blue-800" icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} />
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[240px] flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Tìm kiếm mã HĐ, chủ nhà, BĐS..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm" />
          </div>
          <select value={filterTrangThai} onChange={(e) => setFilterTrangThai(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (<option key={key} value={key}>{cfg.label}</option>))}
          </select>
          <select value={filterPhapLy} onChange={(e) => setFilterPhapLy(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="all">Tất cả pháp lý</option>
            {Object.entries(LEGAL_STATUS_CONFIG).map(([key, cfg]) => (<option key={key} value={key}>{cfg.label}</option>))}
          </select>
          <select value={filterChuNha} onChange={(e) => setFilterChuNha(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none max-w-[180px]">
            {chuNhaOptions.map(o => <option key={o}>{o}</option>)}
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
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mã hợp đồng</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chủ nhà</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bất động sản</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thời hạn</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tiền ĐB</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Pháp lý</th>
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
              <ContractDetail contract={selectedContract} onClose={() => setSelectedId(null)} onAction={handleAction} />
            </div>
          )}
        </div>
      )}

      {createModalOpen && (
        <CreateContractModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreate}
          chuNhaList={chuNhaList}
          batDongSanList={batDongSanList}
        />
      )}
    </div>
  )
}
