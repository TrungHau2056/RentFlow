import { useState, useEffect, useMemo, useCallback } from 'react'
import contractService from '../services/contractService'
import hopDongKyGuiService from '../services/hopDongKyGuiService'
import { normalizeInternalRole, ROLE_GROUPS } from '../config/roles'
import api from '../services/api'

import {
  STATUS_UI_CONFIG,
  LEGAL_STATUS_UI_CONFIG,
  STATUS_MAP,
  WORKFLOW_MAP,
} from '../features/hop-dong-ky-gui/contractStatus'
import {
  mapContractToAdminView,
  formatDate,
  daysUntil,
  getStatusConfig,
  getLegalStatusConfig,
} from '../features/hop-dong-ky-gui/contractMappers'
import CreateConsignmentContractModal from '../features/hop-dong-ky-gui/CreateConsignmentContractModal'
import ContractWorkflowTimeline from '../features/hop-dong-ky-gui/ContractWorkflowTimeline'
import LegalDecisionModal from '../features/hop-dong-ky-gui/LegalDecisionModal'
import SignContractModal from '../features/hop-dong-ky-gui/SignContractModal'
import ContractActionPanel from '../features/hop-dong-ky-gui/ContractActionPanel'

const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'expiring', label: 'Sắp hết hạn' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'amount_desc', label: 'Tiền ĐB cao nhất' },
  { key: 'amount_asc', label: 'Tiền ĐB thấp nhất' },
]

function MiniSparkline({ data, color = '#2563eb' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 60
  const h = 24
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={w} height={h} className="opacity-30">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

function KPICard({ icon, label, value, color, bgColor, sparkData, sparkColor, accent }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group ${accent ? 'border-l-4 border-l-amber-400' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <span className={color}>{icon}</span>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        {sparkData && <MiniSparkline data={sparkData} color={sparkColor} />}
      </div>
    </div>
  )
}

function ContractRow({ contract, isSelected, onSelect }) {
  const status = getStatusConfig(contract.trangThai)
  const legalStatus = getLegalStatusConfig(contract.trangThaiPhapLy)
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
            <span className="text-xs font-semibold text-blue-700">
              {contract.chuNha?.charAt(0) || '?'}
            </span>
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
        <p className="text-sm text-slate-700">
          {contract.thoiHan ? `${contract.thoiHan} tháng` : '—'}
        </p>
        {contract.ngayHetHan && (
          <p
            className={`text-xs ${daysLeft !== null && daysLeft <= 30 ? 'text-orange-600 font-medium' : 'text-slate-400'}`}
          >
            {daysLeft !== null && daysLeft > 0
              ? `Còn ${daysLeft} ngày`
              : daysLeft === 0
              ? 'Hết hạn hôm nay'
              : 'Đã hết hạn'}
          </p>
        )}
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">
          {contract.tienDamBao != null
            ? new Intl.NumberFormat('vi-VN').format(contract.tienDamBao) + 'đ'
            : '—'}
        </p>
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${legalStatus.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${legalStatus.dot}`} />
          {legalStatus.label}
        </span>
      </td>
    </tr>
  )
}

function ContractDetail({ contract, onClose, onAction, actionLoading }) {
  if (!contract) return null
  const status = getStatusConfig(contract.trangThai)
  const legalStatus = getLegalStatusConfig(contract.trangThaiPhapLy)
  const daysLeft = daysUntil(contract.ngayHetHan)

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const roleGroup = normalizeInternalRole(userInfo?.role)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">Hợp đồng ký gửi</p>
            <h3 className="text-white font-bold text-lg">{contract.ma}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
          >
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
        {/* Owner info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Thông tin chủ nhà
          </h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">
                  {contract.chuNha?.charAt(0) || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{contract.chuNha || '—'}</p>
                {contract.sdtChuNha && (
                  <p className="text-xs text-slate-500">{contract.sdtChuNha}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Property info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Bất động sản
          </h4>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-800">{contract.batDongSan}</p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
              {contract.diaChiBDS || '—'}
            </p>
            {contract.giaThue > 0 && (
              <span className="text-xs text-slate-500 mt-1 inline-block">
                Giá thuê:{' '}
                <span className="font-semibold text-slate-700">
                  {new Intl.NumberFormat('vi-VN').format(contract.giaThue)}đ/tháng
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Contract terms */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Điều khoản ký gửi
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày ký</p>
              <p className="text-sm font-semibold text-slate-800">{formatDate(contract.ngayKy)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Thời hạn</p>
              <p className="text-sm font-semibold text-slate-800">
                {contract.thoiHan ? `${contract.thoiHan} tháng` : '—'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày hết hạn</p>
              <p
                className={`text-sm font-semibold ${daysLeft !== null && daysLeft <= 30 ? 'text-orange-600' : 'text-slate-800'}`}
              >
                {formatDate(contract.ngayHetHan)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Tiền đảm bảo</p>
              <p className="text-sm font-semibold text-slate-800">
                {contract.tienDamBao != null
                  ? new Intl.NumberFormat('vi-VN').format(contract.tienDamBao) + 'đ'
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Deposit */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Tiền đảm bảo
          </h4>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">Số tiền giữ</p>
                <p className="text-lg font-bold text-emerald-800">
                  {contract.tienDamBao != null
                    ? new Intl.NumberFormat('vi-VN').format(contract.tienDamBao) + 'đ'
                    : '—'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            {contract.giaThue > 0 && (
              <p className="text-xs text-emerald-600 mt-1">
                Tương đương {Math.round(contract.tienDamBao / contract.giaThue)} tháng tiền thuê
              </p>
            )}
          </div>
        </div>

        {/* Agent */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Nhân viên phụ trách
          </h4>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-sm font-medium text-slate-800">{contract.nhanVien || '—'}</p>
          </div>
        </div>

        {/* Additional clauses */}
        {contract.dieuKhoanPhatSinh && contract.dieuKhoanPhatSinh.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Điều khoản phát sinh
            </h4>
            <div className="space-y-2">
              {contract.dieuKhoanPhatSinh.map((dk, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-sm text-slate-700">{dk.noiDung || dk}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow timeline */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Tiến trình xử lý
          </h4>
          <ContractWorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Signatures status */}
        {(contract.chuKyChuNha || contract.chuKyDaiLy) && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Chữ ký
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className={`rounded-lg p-3 border ${contract.chuKyChuNha ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-xs font-semibold text-slate-600">Chủ nhà</p>
                <p className={`text-sm font-medium mt-1 ${contract.chuKyChuNha ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {contract.chuKyChuNha ? 'Đã ký' : 'Chưa ký'}
                </p>
              </div>
              <div className={`rounded-lg p-3 border ${contract.chuKyDaiLy ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-xs font-semibold text-slate-600">Đại lý</p>
                <p className={`text-sm font-medium mt-1 ${contract.chuKyDaiLy ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {contract.chuKyDaiLy ? 'Đã ký' : 'Chưa ký'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Legal result */}
        {contract.ketQuaPhapLy && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Kết quả pháp lý
            </h4>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-700">
                {contract.ketQuaPhapLy.duyet ? 'Đã phê duyệt' : 'Từ chối'}
                {contract.ketQuaPhapLy.lyDoTuChoi && `: ${contract.ketQuaPhapLy.lyDoTuChoi}`}
              </p>
              {contract.ketQuaPhapLy.ghiChu && (
                <p className="text-xs text-slate-500 mt-1 italic">{contract.ketQuaPhapLy.ghiChu}</p>
              )}
              {contract.ketQuaPhapLy.tenNguoiDuyet && (
                <p className="text-xs text-slate-400 mt-1">
                  Người duyệt: {contract.ketQuaPhapLy.tenNguoiDuyet}
                  {contract.ketQuaPhapLy.thoiGianDuyet && ` · ${formatDate(contract.ketQuaPhapLy.thoiGianDuyet)}`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Lịch sử hoạt động
          </h4>
          <div className="space-y-0">
            {contract.lichSu.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có hoạt động</p>
            ) : (
              contract.lichSu.map((item, i) => {
                const iconConfig = {
                  create: { bg: 'bg-blue-100', color: 'text-blue-600', icon: 'M12 4v16m8-8H4' },
                  edit: {
                    bg: 'bg-amber-100',
                    color: 'text-amber-600',
                    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
                  },
                  approve: { bg: 'bg-emerald-100', color: 'text-emerald-600', icon: 'M5 13l4 4L19 7' },
                  sign: {
                    bg: 'bg-indigo-100',
                    color: 'text-indigo-600',
                    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
                  },
                  active: { bg: 'bg-cyan-100', color: 'text-cyan-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  send: { bg: 'bg-purple-100', color: 'text-purple-600', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                  reject: { bg: 'bg-red-100', color: 'text-red-600', icon: 'M6 18L18 6M6 6l12 12' },
                }
                const cfg = iconConfig[item.loai] || iconConfig.create
                const isLast = i === contract.lichSu.length - 1
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}
                      >
                        <svg className={`w-3.5 h-3.5 ${cfg.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cfg.icon} />
                        </svg>
                      </div>
                      {!isLast && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className={`pb-3`}>
                      <p className="text-xs text-slate-700">{item.noiDung}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.nguoi} · {formatDate(item.ngay)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thao tác</h4>
          <ContractActionPanel
            rawStatus={contract.rawStatus}
            roleGroup={roleGroup}
            onAction={onAction}
            options={{
              coDieuKhoanPhatSinh: contract.coDieuKhoanPhatSinh,
              chuKyChuNha: contract.chuKyChuNha,
              chuKyDaiLy: contract.chuKyDaiLy,
            }}
            actionLoading={actionLoading}
          />
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
          {count > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80">{count}</span>
          )}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có hợp đồng nào</h3>
        <p className="text-slate-500 text-sm">
          Khi có hợp đồng ký gửi mới, chúng sẽ hiển thị tại đây.
        </p>
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

  // Legal decision modal state
  const [legalModal, setLegalModal] = useState({ open: false, action: null })
  // Sign modal state
  const [signModal, setSignModal] = useState({ open: false, role: null })

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const roleGroup = normalizeInternalRole(userInfo?.role)
  const isAdmin = roleGroup === ROLE_GROUPS.ADMIN
  const isNhanVienDaiLy = roleGroup === ROLE_GROUPS.AGENCY
  // isPhapLuat unused here; role gating is via ContractActionPanel

  const fetchContracts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await contractService.getKyGuiContracts()
      setContracts((res?.data || []).map(mapContractToAdminView))
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách hợp đồng')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchChuNhaList = useCallback(async () => {
    try {
      const res = await api.get('/api/chu-nha')
      setChuNhaList(res.data?.data || [])
    } catch {
      setChuNhaList([])
    }
  }, [])

  const fetchBatDongSanList = useCallback(async () => {
    try {
      const res = await api.get('/api/bat-dong-san')
      setBatDongSanList(res.data?.data || [])
    } catch {
      setBatDongSanList([])
    }
  }, [])

  useEffect(() => {
    fetchContracts()
    fetchChuNhaList()
    fetchBatDongSanList()
  }, [fetchContracts, fetchChuNhaList, fetchBatDongSanList])

  const chuNhaOptions = useMemo(() => {
    const names = contracts.map((c) => c.chuNha).filter(Boolean)
    return ['Tất cả', ...new Set(names)]
  }, [contracts])

  const filtered = useMemo(() => {
    let result = [...contracts]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.ma.toLowerCase().includes(q) ||
          c.chuNha.toLowerCase().includes(q) ||
          c.batDongSan.toLowerCase().includes(q) ||
          c.diaChiBDS.toLowerCase().includes(q)
      )
    }
    if (filterTrangThai !== 'all') result = result.filter((c) => c.trangThai === filterTrangThai)
    if (filterPhapLy !== 'all') result = result.filter((c) => c.trangThaiPhapLy === filterPhapLy)
    if (filterChuNha !== 'Tất cả') result = result.filter((c) => c.chuNha === filterChuNha)

    switch (sortBy) {
      case 'expiring':
        result.sort((a, b) => {
          if (!a.ngayHetHan) return 1
          if (!b.ngayHetHan) return -1
          return new Date(a.ngayHetHan) - new Date(b.ngayHetHan)
        })
        break
      case 'pending': {
        const order = {
          cho_duyet: 0,
          cho_ky: 1,
          sap_het_han: 2,
          tam_ngung: 3,
          dang_hieu_luc: 4,
          da_ket_thuc: 5,
          da_huy: 6,
        }
        result.sort((a, b) => (order[a.trangThai] || 9) - (order[b.trangThai] || 9))
        break
      }
      case 'amount_desc':
        result.sort((a, b) => (b.tienDamBao || 0) - (a.tienDamBao || 0))
        break
      case 'amount_asc':
        result.sort((a, b) => (a.tienDamBao || 0) - (b.tienDamBao || 0))
        break
      default:
        result.sort((a, b) => {
          const dateA = a.ngayKy || ''
          const dateB = b.ngayKy || ''
          return new Date(dateB) - new Date(dateA)
        })
    }
    return result
  }, [contracts, searchQuery, filterTrangThai, filterPhapLy, filterChuNha, sortBy])

  const kpiData = useMemo(
    () => ({
      total: contracts.length,
      choDuyet: contracts.filter((c) => c.trangThai === 'cho_duyet').length,
      dangHieuLuc: contracts.filter((c) => c.trangThai === 'dang_hieu_luc').length,
      sapHetHan: contracts.filter((c) => c.trangThai === 'sap_het_han').length,
      coDieuKhoan: contracts.filter((c) => c.coDieuKhoanPhatSinh).length,
    }),
    [contracts]
  )

  const alertData = useMemo(() => {
    const sapHetHan = contracts.filter((c) => c.trangThai === 'sap_het_han')
    const choPhapLuat = contracts.filter(
      (c) => c.trangThaiPhapLy === 'cho_phap_luat' || c.trangThaiPhapLy === 'can_sua' || c.trangThaiPhapLy === 'tu_choi'
    )
    const thieuChuKy = contracts.filter((c) => c.trangThai === 'cho_ky')
    return { sapHetHan, choPhapLuat, thieuChuKy }
  }, [contracts])

  const selectedContract = selectedId ? contracts.find((c) => c.id === selectedId) : null

  /* ---- Action handler ---- */

  const handleAction = async (action, id) => {
    const contract = contracts.find((c) => c.id === id)
    setActionLoading(action)

    try {
      switch (action) {
        case 'approve':
          setLegalModal({ open: true, action: 'approve', contractId: id })
          setActionLoading(null)
          return

        case 'reject':
          setLegalModal({ open: true, action: 'reject', contractId: id })
          setActionLoading(null)
          return

        case 'request_edit':
          setLegalModal({ open: true, action: 'request_edit', contractId: id })
          setActionLoading(null)
          return

        case 'submit_legal': {
          if (!window.confirm('Gửi hợp đồng này đến bộ phận pháp lý để duyệt?')) break
          await hopDongKyGuiService.guiPheDuyet(id)
          setNotice('Đã gửi duyệt pháp lý')
          break
        }

        case 'sign_owner':
          setSignModal({ open: true, role: 'owner', contractId: id })
          setActionLoading(null)
          return

        case 'sign_agency':
          setSignModal({ open: true, role: 'agency', contractId: id })
          setActionLoading(null)
          return

        case 'delete': {
          if (contract?.rawStatus !== 'NHAP') {
            alert('Chỉ có thể xóa hợp đồng ở trạng thái nháp')
            break
          }
          if (!window.confirm('Xác nhận xóa hợp đồng này?')) break
          await hopDongKyGuiService.xoa(id)
          setNotice('Đã xóa hợp đồng')
          if (selectedId === id) setSelectedId(null)
          break
        }

        case 'edit':
          setNotice('Chức năng chỉnh sửa đang phát triển')
          setActionLoading(null)
          return

        case 'extend':
          setNotice('Chức năng gia hạn đang phát triển')
          setActionLoading(null)
          return

        default:
          setActionLoading(null)
          return
      }
      fetchContracts()
    } catch (err) {
      setNotice(err.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setActionLoading(null)
    }
  }

  /* ---- Legal modal handler ---- */

  const handleLegalSubmit = async (action, reason, note) => {
    const { contractId } = legalModal
    switch (action) {
      case 'approve':
        await contractService.approveKyGuiContract(contractId, true)
        setNotice('Đã phê duyệt hợp đồng')
        break
      case 'reject':
        await contractService.approveKyGuiContract(contractId, false, reason || 'Không có lý do')
        setNotice('Đã từ chối hợp đồng')
        break
      case 'request_edit':
        await hopDongKyGuiService.yeuCauSua(contractId, { lyDo: reason, ghiChu: note })
        setNotice('Đã yêu cầu sửa hợp đồng')
        break
      default:
        return
    }
    setLegalModal({ open: false, action: null, contractId: null })
    setSelectedId(null)
    fetchContracts()
  }

  /* ---- Sign modal handler ---- */

  const handleSign = async () => {
    const { contractId, role } = signModal
    if (role === 'owner') {
      await hopDongKyGuiService.kyChuNha(contractId)
      setNotice('Đã ký phía chủ nhà')
    } else {
      await hopDongKyGuiService.kyDaiLy(contractId)
      setNotice('Đã ký phía đại lý')
    }
    setSignModal({ open: false, role: null, contractId: null })
    setSelectedId(null)
    await fetchContracts()
  }

  const handleCreate = () => {
    setCreateModalOpen(false)
    setNotice('Đã tạo hợp đồng thành công')
    fetchContracts()
    fetchChuNhaList()
    fetchBatDongSanList()
  }

  /* ---- Render ---- */

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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-700 font-medium mb-2">Lỗi tải dữ liệu</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchContracts}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
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
          <p className="text-slate-500 text-sm mt-1">
            Theo dõi và xử lý hợp đồng ký gửi bất động sản
          </p>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          label="Tổng hợp đồng"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          sparkData={[5, 8, 6, 10, 9, 12, 10]}
          sparkColor="#2563eb"
        />
        <KPICard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label="Chờ duyệt"
          value={kpiData.choDuyet}
          color="text-amber-600"
          bgColor="bg-amber-50"
          sparkData={[1, 3, 2, 4, 3, 5, 3]}
          sparkColor="#d97706"
          accent
        />
        <KPICard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
          label="Đang hiệu lực"
          value={kpiData.dangHieuLuc}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          sparkData={[3, 4, 5, 4, 6, 5, 7]}
          sparkColor="#059669"
        />
        <KPICard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label="Sắp hết hạn"
          value={kpiData.sapHetHan}
          color="text-orange-600"
          bgColor="bg-orange-50"
          sparkData={[0, 1, 0, 1, 1, 2, 1]}
          sparkColor="#ea580c"
          accent
        />
        <KPICard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
          label="Có điều khoản phát sinh"
          value={kpiData.coDieuKhoan}
          color="text-purple-600"
          bgColor="bg-purple-50"
          sparkData={[2, 3, 2, 4, 3, 5, 4]}
          sparkColor="#7c3aed"
        />
      </div>

      {/* Alerts */}
      {(alertData.sapHetHan.length > 0 ||
        alertData.choPhapLuat.length > 0 ||
        alertData.thieuChuKy.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {alertData.sapHetHan.length > 0 && (
            <AlertCard
              title="Hợp đồng sắp hết hạn"
              description={`${alertData.sapHetHan.map((c) => c.ma).join(', ')} cần gia hạn hoặc đóng`}
              count={alertData.sapHetHan.length}
              color="bg-orange-50 border-orange-200 text-orange-800"
              icon={
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          )}
          {alertData.choPhapLuat.length > 0 && (
            <AlertCard
              title="Chờ pháp luật xử lý"
              description={`${alertData.choPhapLuat.length} hợp đồng cần bộ phận pháp luật duyệt hoặc sửa đổi`}
              count={alertData.choPhapLuat.length}
              color="bg-amber-50 border-amber-200 text-amber-800"
              icon={
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              }
            />
          )}
          {alertData.thieuChuKy.length > 0 && (
            <AlertCard
              title="Thiếu chữ ký"
              description={`${alertData.thieuChuKy.map((c) => c.ma).join(', ')} chờ ký`}
              count={alertData.thieuChuKy.length}
              color="bg-blue-50 border-blue-200 text-blue-800"
              icon={
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              }
            />
          )}
        </div>
      )}

      {/* Search & filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[240px] flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm mã HĐ, chủ nhà, BĐS..."
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
            {Object.entries(STATUS_UI_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <select
            value={filterPhapLy}
            onChange={(e) => setFilterPhapLy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả pháp lý</option>
            {Object.entries(LEGAL_STATUS_UI_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <select
            value={filterChuNha}
            onChange={(e) => setFilterChuNha(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none max-w-[180px]"
          >
            {chuNhaOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
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
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                        Mã hợp đồng
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                        Chủ nhà
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                        Bất động sản
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                        Thời hạn
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                        Tiền ĐB
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                        Pháp lý
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((c) => (
                      <ContractRow
                        key={c.id}
                        contract={c}
                        isSelected={selectedId === c.id}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Hiển thị {filtered.length} / {contracts.length} hợp đồng
                </span>
              </div>
            </div>
          </div>

          {selectedContract && (
            <div className="w-105 shrink-0 hidden xl:block">
              <ContractDetail
                contract={selectedContract}
                onClose={() => setSelectedId(null)}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            </div>
          )}
        </div>
      )}

      {/* Create modal */}
      {createModalOpen && (
        <CreateConsignmentContractModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreate}
          chuNhaList={chuNhaList}
          batDongSanList={batDongSanList}
        />
      )}

      {/* Legal decision modal */}
      {legalModal.open && (
        <LegalDecisionModal
          onClose={() => setLegalModal({ open: false, action: null, contractId: null })}
          onSubmit={handleLegalSubmit}
          action={legalModal.action}
          contractInfo={
            selectedContract
              ? {
                  ma: selectedContract.ma,
                  chuNha: selectedContract.chuNha,
                  batDongSan: selectedContract.batDongSan,
                }
              : null
          }
        />
      )}

      {/* Sign modal */}
      {signModal.open && (
        <SignContractModal
          onClose={() => setSignModal({ open: false, role: null, contractId: null })}
          onSign={handleSign}
          signingRole={signModal.role}
          userDisplayName={userInfo?.hoTen || ''}
          contractInfo={
            selectedContract
              ? {
                  ma: selectedContract.ma,
                  chuNha: selectedContract.chuNha,
                  batDongSan: selectedContract.batDongSan,
                }
              : null
          }
        />
      )}
    </div>
  )
}
