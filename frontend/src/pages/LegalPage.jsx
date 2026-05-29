import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import contractService from '../services/contractService'
import hopDongKyGuiService from '../services/hopDongKyGuiService'
import hopDongThueService from '../services/hopDongThueService'

const STATUS_CONFIG = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  dang_xet_duyet: { label: 'Đang xem xét', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  da_phe_duyet: { label: 'Đã phê duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  da_tu_choi: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
  can_bo_sung: { label: 'Cần bổ sung', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
}

const PRIORITY_CONFIG = {
  khan_cap: { label: 'Khẩn cấp', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', pulse: true },
  quan_trong: { label: 'Quan trọng', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  binh_thuong: { label: 'Bình thường', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
}

const LOAI_YEU_CAU_CONFIG = {
  duyet_hop_dong: { label: 'Duyệt hợp đồng', color: 'bg-blue-50 text-blue-700', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  duyet_dieu_khoan: { label: 'Duyệt điều khoản', color: 'bg-purple-50 text-purple-700', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  sua_dieu_khoan: { label: 'Sửa điều khoản', color: 'bg-amber-50 text-amber-700', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
}

const LOAI_FILTER = ['Tất cả', 'Duyệt hợp đồng', 'Duyệt điều khoản', 'Sửa điều khoản']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'deadline', label: 'Deadline gần nhất' },
  { key: 'priority', label: 'Ưu tiên cao nhất' },
]

const TRANG_THAI_MAP = {
  CHO_PHE_DUYET: 'cho_duyet',
  DA_PHE_DUYET: 'da_phe_duyet',
  TU_CHOI: 'da_tu_choi',
  DA_KY: 'da_phe_duyet',
  NHAP: 'cho_duyet',
  DA_HUY: 'da_tu_choi',
  HOAN_THANH: 'da_phe_duyet',
}

const LOAI_HOP_DONG = {
  KY_GUI: 'ky_gui',
  THUE: 'thue',
}

const CLAUSE_RISK_CONFIG = {
  cao: { label: 'Rủi ro cao', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
  trung_binh: { label: 'Rủi ro TB', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  thap: { label: 'Rủi ro thấp', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
}

const CLAUSE_STATUS = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
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

function toLegalRequest(item, type) {
  const isKyGui = type === LOAI_HOP_DONG.KY_GUI
  const rawStatus = item.trangThai || ''
  return {
    id: item.id,
    loaiHopDong: type,
    maYeuCau: isKyGui ? `KG-${item.id}` : `HDT-${item.id}`,
    maHopDong: isKyGui ? `HĐKG-${item.id}` : `HĐT-${item.id}`,
    chuNha: isKyGui ? (item.tenChuNha || '') : (item.tenKhachHang || ''),
    sdtChuNha: '',
    batDongSan: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    diaChiBDS: item.diaChiBatDongSan || '',
    loaiYeuCau: 'duyet_hop_dong',
    mucDoUuTien: 'binh_thuong',
    ngayGui: item.ngayKy || item.ngayBatDau || '',
    trangThai: TRANG_THAI_MAP[rawStatus] || 'cho_duyet',
    nguoiGui: isKyGui ? (item.tenNhanVien || '') : (item.tenNhanVienMoiGioi || ''),
    nguoiXuLy: null,
    deadline: item.ngayKetThuc || '',
    dieuKhoanPhatSinh: [],
    ghiChuPhapLy: '',
    lichSu: [],
  }
}

function mapKyGuiContract(item) {
  return toLegalRequest(item, LOAI_HOP_DONG.KY_GUI)
}

function mapThueContract(item) {
  return toLegalRequest(item, LOAI_HOP_DONG.THUE)
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

function RequestRow({ request, isSelected, onSelect }) {
  const status = STATUS_CONFIG[request.trangThai] || { color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', label: request.trangThai }
  const priority = PRIORITY_CONFIG[request.mucDoUuTien] || { color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: request.mucDoUuTien }
  const loaiYC = LOAI_YEU_CAU_CONFIG[request.loaiYeuCau] || { color: 'bg-slate-100 text-slate-600', icon: '', label: request.loaiYeuCau }
  const daysLeft = daysUntil(request.deadline)
  const isOverdue = daysLeft !== null && daysLeft < 0
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 1

  return (
    <tr
      onClick={() => onSelect(request.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{request.maYeuCau}</p>
        <Link
          to={`/admin/hop-dong-ky-gui/${request.maHopDong}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-slate-400 hover:text-blue-600"
        >
          {request.maHopDong}
        </Link>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-blue-700">{request.chuNha.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{request.chuNha}</p>
            <p className="text-xs text-slate-400 truncate max-w-37.5">{request.batDongSan}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${loaiYC.color}`}>
          {loaiYC.icon && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={loaiYC.icon} />
            </svg>
          )}
          {loaiYC.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${priority.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot} ${priority.pulse ? 'animate-pulse' : ''}`} />
          {priority.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-600">{formatDate(request.ngayGui)}</p>
        <p className={`text-xs font-medium ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-slate-400'}`}>
          {isOverdue ? `Quá hạn ${Math.abs(daysLeft)} ngày` : isUrgent ? `Còn ${daysLeft} ngày` : `DL: ${formatDate(request.deadline)}`}
        </p>
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

function ClauseCompare({ clause }) {
  const risk = CLAUSE_RISK_CONFIG[clause.mucDoRuiRo]
  const clauseStatus = CLAUSE_STATUS[clause.trangThai]

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-sm font-semibold text-slate-700">{clause.dieuKhoan}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${risk.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
            {risk.label}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${clauseStatus.color}`}>
            {clauseStatus.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-200">
        <div className="p-3">
          <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wide mb-1.5">Nội dung cũ</p>
          <p className="text-sm text-slate-600 leading-relaxed bg-red-50/50 rounded p-2 border border-red-100/50">{clause.noiDungCu}</p>
        </div>
        <div className="p-3">
          <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1.5">Nội dung mới</p>
          <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50/50 rounded p-2 border border-emerald-100/50">{clause.noiDungMoi}</p>
        </div>
      </div>

      {clause.ghiChu && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-amber-50/50">
          <p className="text-xs text-amber-700 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {clause.ghiChu}
          </p>
        </div>
      )}
    </div>
  )
}

function LegalDetail({ request, onClose, onApprove, onReject, onSubmit, actionLoading }) {
  if (!request) return null
  const status = STATUS_CONFIG[request.trangThai] || { color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', label: request.trangThai }
  const priority = PRIORITY_CONFIG[request.mucDoUuTien] || { color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: request.mucDoUuTien }
  const loaiYC = LOAI_YEU_CAU_CONFIG[request.loaiYeuCau] || { color: 'bg-slate-100 text-slate-600', icon: '', label: request.loaiYeuCau }
  const daysLeft = daysUntil(request.deadline)
  const isOverdue = daysLeft !== null && daysLeft < 0
  const canAct = request.trangThai === 'cho_duyet' || request.trangThai === 'dang_xet_duyet'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      <div className="bg-linear-to-r from-slate-800 to-slate-900 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-xs mb-1">Yêu cầu pháp lý</p>
            <h3 className="text-white font-bold text-lg">{request.maYeuCau}</h3>
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
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${priority.color}`}>
            {priority.label}
          </span>
          <span className={`text-xs font-medium ${loaiYC.color} bg-white/10 px-2 py-1 rounded-md`}>
            {loaiYC.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin hợp đồng</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Mã hợp đồng</p>
              <Link to={`/admin/hop-dong-ky-gui/${request.maHopDong}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                {request.maHopDong}
              </Link>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">{request.loaiHopDong === 'ky_gui' ? 'Chủ nhà' : 'Khách hàng'}</p>
              <p className="text-sm font-semibold text-slate-800">{request.chuNha}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 mt-2">
            <p className="text-xs text-slate-400">Bất động sản</p>
            <p className="text-sm font-medium text-slate-800">{request.batDongSan}</p>
            <p className="text-xs text-slate-400 mt-0.5">{request.diaChiBDS}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quy trình phê duyệt</h4>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Người gửi yêu cầu</span>
              <span className="text-xs font-medium text-slate-700">{request.nguoiGui || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Loại hợp đồng</span>
              <span className="text-xs font-medium text-slate-700">{request.loaiHopDong === 'ky_gui' ? 'Ký gửi' : 'Thuê'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Ngày gửi</span>
              <span className="text-xs font-medium text-slate-700">{formatDate(request.ngayGui)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Deadline</span>
              <span className={`text-xs font-semibold ${isOverdue ? 'text-red-600' : daysLeft !== null && daysLeft <= 1 ? 'text-amber-600' : 'text-slate-700'}`}>
                {formatDate(request.deadline)}
                {isOverdue && ' (Quá hạn)'}
                {!isOverdue && daysLeft !== null && daysLeft <= 1 && ` (Còn ${daysLeft} ngày)`}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ghi chú pháp lý</h4>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-400 italic">Chưa có ghi chú pháp lý</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thao tác</h4>
          <div className="space-y-2">
            {canAct && (
              <>
                <button
                  onClick={() => onApprove(request.id)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {actionLoading ? 'Đang xử lý...' : 'Phê duyệt'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onReject(request.id)}
                    disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {actionLoading ? 'Đang xử lý...' : 'Từ chối'}
                  </button>
                  <button
                    onClick={() => onSubmit(request.id)}
                    disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {actionLoading ? 'Đang xử lý...' : 'Yêu cầu sửa'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PriorityAlert({ title, description, count, color, icon }) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Không có yêu cầu pháp lý</h3>
        <p className="text-slate-500 text-sm">Khi có yêu cầu duyệt pháp lý, chúng sẽ hiển thị tại đây.</p>
      </div>
    </div>
  )
}

export default function LegalPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [filterUuTien, setFilterUuTien] = useState('all')
  const [filterLoai, setFilterLoai] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)

  const fetchContracts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [kyGuiRes, thueRes] = await Promise.all([
        contractService.getKyGuiContracts(),
        contractService.getThueContracts(),
      ])
      const kyGuiList = (kyGuiRes?.data || []).map(mapKyGuiContract)
      const thueList = (thueRes?.data || []).map(mapThueContract)
      setRequests([...kyGuiList, ...thueList])
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách yêu cầu')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleApprove = useCallback(async (id) => {
    setActionLoading(true)
    try {
      const request = requests.find(r => r.id === id)
      if (request?.loaiHopDong === 'ky_gui') {
        await contractService.approveKyGuiContract(id, true)
      } else {
        await contractService.updateThueContractStatus(id, 'DA_PHE_DUYET')
      }
      setSelectedId(null)
      fetchContracts()
    } catch (err) {
      alert(err.response?.data?.message || 'Phê duyệt thất bại')
    } finally {
      setActionLoading(false)
    }
  }, [fetchContracts, requests])

  const handleReject = useCallback(async (id) => {
    setActionLoading(true)
    try {
      const request = requests.find(r => r.id === id)
      const lyDo = prompt('Nhập lý do từ chối:')
      if (lyDo === null) { setActionLoading(false); return }
      if (request?.loaiHopDong === 'ky_gui') {
        await contractService.approveKyGuiContract(id, false, lyDo)
      } else {
        await contractService.updateThueContractStatus(id, 'TU_CHOI')
      }
      setSelectedId(null)
      fetchContracts()
    } catch (err) {
      alert(err.response?.data?.message || 'Từ chối thất bại')
    } finally {
      setActionLoading(false)
    }
  }, [fetchContracts, requests])

  const handleSubmit = useCallback(async (id) => {
    setActionLoading(true)
    try {
      await hopDongKyGuiService.guiPheDuyet(id)
      fetchContracts()
    } catch (err) {
      alert(err.response?.data?.message || 'Gửi duyệt thất bại')
    } finally {
      setActionLoading(false)
    }
  }, [fetchContracts])

  const filtered = useMemo(() => {
    let result = [...requests]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.maYeuCau.toLowerCase().includes(q) ||
        r.maHopDong.toLowerCase().includes(q) ||
        r.chuNha.toLowerCase().includes(q) ||
        r.batDongSan.toLowerCase().includes(q)
      )
    }
    if (filterTrangThai !== 'all') result = result.filter(r => r.trangThai === filterTrangThai)
    if (filterUuTien !== 'all') result = result.filter(r => r.mucDoUuTien === filterUuTien)
    if (filterLoai !== 'Tất cả') {
      const loaiMap = { 'Duyệt hợp đồng': 'duyet_hop_dong', 'Duyệt điều khoản': 'duyet_dieu_khoan', 'Sửa điều khoản': 'sua_dieu_khoan' }
      result = result.filter(r => r.loaiYeuCau === loaiMap[filterLoai])
    }

    switch (sortBy) {
      case 'deadline': result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); break
      case 'priority': {
        const order = { khan_cap: 0, quan_trong: 1, binh_thuong: 2 }
        result.sort((a, b) => (order[a.mucDoUuTien] || 9) - (order[b.mucDoUuTien] || 9))
        break
      }
      default: result.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui))
    }
    return result
  }, [searchQuery, filterTrangThai, filterUuTien, filterLoai, sortBy, requests])

  const kpiData = useMemo(() => ({
    choDuyet: requests.filter(r => r.trangThai === 'cho_duyet' || r.trangThai === 'dang_xet_duyet').length,
    dieuKhoanPhatSinh: requests.reduce((acc, r) => acc + r.dieuKhoanPhatSinh.length, 0),
    daPheDuyet: requests.filter(r => r.trangThai === 'da_phe_duyet').length,
    daTuChoi: requests.filter(r => r.trangThai === 'da_tu_choi').length,
  }), [requests])

  const alertData = useMemo(() => {
    const quaHan = requests.filter(r => {
      const d = daysUntil(r.deadline)
      return d !== null && d < 0 && r.trangThai !== 'da_phe_duyet' && r.trangThai !== 'da_tu_choi'
    })
    const ruiRoCao = requests.filter(r => r.dieuKhoanPhatSinh.some(c => c.mucDoRuiRo === 'cao'))
    const khanCap = requests.filter(r => r.mucDoUuTien === 'khan_cap' && r.trangThai !== 'da_phe_duyet' && r.trangThai !== 'da_tu_choi')
    return { quaHan, ruiRoCao, khanCap }
  }, [requests])

  const selectedRequest = selectedId ? requests.find(r => r.id === selectedId) : null

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Duyệt pháp lý hợp đồng</h1>
          <p className="text-slate-500 text-sm mt-1">Xem xét và phê duyệt hợp đồng từ bộ phận kinh doanh</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Hợp đồng chờ duyệt"
          value={kpiData.choDuyet}
          color="text-amber-600"
          bgColor="bg-amber-50"
          sparkData={[2, 4, 3, 5, 4, 6, 4]}
          sparkColor="#d97706"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          label="Điều khoản phát sinh"
          value={kpiData.dieuKhoanPhatSinh}
          color="text-purple-600"
          bgColor="bg-purple-50"
          sparkData={[3, 5, 4, 6, 5, 7, 6]}
          sparkColor="#7c3aed"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          label="Đã phê duyệt"
          value={kpiData.daPheDuyet}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          sparkData={[2, 3, 3, 4, 4, 5, 3]}
          sparkColor="#059669"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
          label="Đã từ chối"
          value={kpiData.daTuChoi}
          color="text-red-600"
          bgColor="bg-red-50"
          sparkData={[0, 1, 0, 1, 0, 0, 1]}
          sparkColor="#dc2626"
        />
      </div>

      {(alertData.quaHan.length > 0 || alertData.ruiRoCao.length > 0 || alertData.khanCap.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {alertData.quaHan.length > 0 && (
            <PriorityAlert
              title="Hợp đồng quá hạn duyệt"
              description={`${alertData.quaHan.map(r => r.maYeuCau).join(', ')} cần xử lý ngay`}
              count={alertData.quaHan.length}
              color="bg-red-50 border-red-200 text-red-800"
              icon={<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          )}
          {alertData.ruiRoCao.length > 0 && (
            <PriorityAlert
              title="Điều khoản rủi ro cao"
              description={`${alertData.ruiRoCao.length} yêu cầu có điều khoản đánh giá rủi ro cao`}
              count={alertData.ruiRoCao.length}
              color="bg-amber-50 border-amber-200 text-amber-800"
              icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          )}
          {alertData.khanCap.length > 0 && (
            <PriorityAlert
              title="Yêu cầu khẩn cấp"
              description={`${alertData.khanCap.map(r => r.maYeuCau).join(', ')} cần xử lý ưu tiên`}
              count={alertData.khanCap.length}
              color="bg-orange-50 border-orange-200 text-orange-800"
              icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-60 flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm mã YC, mã HĐ, chủ nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>

          <select
            value={filterUuTien}
            onChange={(e) => setFilterUuTien(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả ưu tiên</option>
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>

          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {LOAI_FILTER.map(o => <option key={o}>{o}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Đang tải yêu cầu pháp lý...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">{error}</p>
            <button onClick={fetchContracts} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              Thử lại
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mã yêu cầu</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chủ nhà / BĐS</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Loại yêu cầu</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ưu tiên</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ngày gửi</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(r => (
                      <RequestRow
                        key={`${r.loaiHopDong}-${r.id}`}
                        request={r}
                        isSelected={selectedId === r.id}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Hiển thị {filtered.length} / {requests.length} yêu cầu</span>
              </div>
            </div>
          </div>

          {selectedRequest && (
            <div className="w-105 shrink-0 hidden xl:block">
              <LegalDetail request={selectedRequest} onClose={() => setSelectedId(null)} onApprove={handleApprove} onReject={handleReject} onSubmit={handleSubmit} actionLoading={actionLoading} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
