import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import hopDongKyGuiService from '../services/hopDongKyGuiService'

import { HOP_DONG_STATUS } from '../features/hop-dong-ky-gui/contractStatus'
import {
  mapContractToOwnerView,
  formatDate,
  getStatusConfig,
} from '../features/hop-dong-ky-gui/contractMappers'
import ContractWorkflowTimeline from '../features/hop-dong-ky-gui/ContractWorkflowTimeline'
import SignContractModal from '../features/hop-dong-ky-gui/SignContractModal'

const DEPOSIT_STATUS = {
  cho_duyet: { label: 'Chờ duyệt', color: 'text-amber-600', icon: 'clock' },
  dang_giu: { label: 'Đang giữ', color: 'text-blue-600', icon: 'shield' },
  da_khau_tru: { label: 'Đã khấu trừ', color: 'text-orange-600', icon: 'minus' },
  da_hoan_tra: { label: 'Đã hoàn trả', color: 'text-emerald-600', icon: 'check' },
}

const FILTER_STATUS_OPTIONS = [
  { key: 'all', label: 'Tất cả trạng thái' },
  { key: 'cho_duyet', label: 'Chờ duyệt' },
  { key: 'cho_ky', label: 'Chờ ký' },
  { key: 'dang_hieu_luc', label: 'Đang hiệu lực' },
  { key: 'da_ket_thuc', label: 'Đã kết thúc' },
  { key: 'tam_ngung', label: 'Tạm ngưng' },
]


function formatVND(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

function KPICard({ icon, label, value, color, bgColor, trend }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-3xl font-bold text-on-surface">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${trend > 0 ? 'text-emerald-600' : trend === 0 ? 'text-slate-500' : 'text-red-500'}`}
            >
              {trend > 0 && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend > 0 ? `+${trend}%` : trend === 0 ? '—' : `${trend}%`} so với tháng trước
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <span className={color}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

function ContractRow({ contract, isSelected, onSelect }) {
  const status = getStatusConfig(contract.trangThai)
  return (
    <div
      onClick={() => onSelect(contract.id)}
      className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="shrink-0 w-40">
          <p className="font-mono text-sm font-semibold text-blue-600">
            #{String(contract.id).padStart(5, '0')}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {contract.ngayKy ? formatDate(contract.ngayKy) : 'Chưa ký'}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface truncate">{contract.tenBDS}</p>
          <p className="text-sm text-on-surface-variant truncate">
            NV: {contract.daiDienDaiLy || '—'}
          </p>
        </div>

        <div className="shrink-0 w-32 text-center">
          <p className="text-sm font-medium text-on-surface">
            {contract.ngayBatDau ? `${formatDate(contract.ngayBatDau)}` : '—'}
          </p>
          <p className="text-xs text-on-surface-variant">
            {contract.ngayKetThuc ? formatDate(contract.ngayKetThuc) : '—'}
          </p>
        </div>

        <div className="shrink-0 w-36 text-right">
          <p className="text-sm font-semibold text-on-surface">{formatVND(contract.tienDamBao)}</p>
        </div>

        <div className="shrink-0">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
        </div>

        <div className="shrink-0">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function ContractDetail({ contract, onClose, onSignOwner, actionLoading }) {
  if (!contract) return null
  const status = getStatusConfig(contract.trangThai)
  const canSign = contract.rawStatus === HOP_DONG_STATUS.DA_PHE_DUYET || contract.rawStatus === HOP_DONG_STATUS.CHO_KY
  const isOwnerSigned = !!contract.chuKyChuNha

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium mb-1">
              #{String(contract.id).padStart(5, '0')}
            </p>
            <h3 className="text-white font-bold text-lg">{contract.tenBDS}</h3>
            <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
              ● {status.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Workflow */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
            Tiến trình xử lý
          </h4>
          <ContractWorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Property info */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
            Thông tin bất động sản
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Địa chỉ</p>
              <p className="text-sm font-medium text-on-surface">{contract.diaChiBDS}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Loại</p>
              <p className="text-sm font-medium text-on-surface">{contract.loaiBDS || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Diện tích</p>
              <p className="text-sm font-medium text-on-surface">{contract.dienTich || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Tiền đảm bảo</p>
              <p className="text-sm font-medium text-on-surface">{formatVND(contract.tienDamBao)}</p>
            </div>
          </div>
        </div>

        {/* Contract terms */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
            Điều khoản ký gửi
          </h4>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày ký</span>
              <span className="font-medium text-on-surface">
                {contract.ngayKy ? formatDate(contract.ngayKy) : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày bắt đầu</span>
              <span className="font-medium text-on-surface">
                {contract.ngayBatDau ? formatDate(contract.ngayBatDau) : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày kết thúc</span>
              <span className="font-medium text-on-surface">
                {contract.ngayKetThuc ? formatDate(contract.ngayKetThuc) : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Representative */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
            Đại diện
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Đại lý</p>
                <p className="text-sm font-medium text-on-surface">{contract.daiDienDaiLy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
            Tiền đảm bảo
          </h4>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-blue-700">{formatVND(contract.tienDamBao)}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.color} bg-white`}
              >
                {DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Legal result */}
        {contract.ketQuaPhapLy && (
          <div>
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
              Kết quả pháp lý
            </h4>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-sm text-slate-700">
                {contract.ketQuaPhapLy.duyet ? 'Đã phê duyệt' : 'Từ chối'}
                {contract.ketQuaPhapLy.lyDoTuChoi && `: ${contract.ketQuaPhapLy.lyDoTuChoi}`}
              </p>
              {contract.ketQuaPhapLy.ghiChu && (
                <p className="text-xs text-slate-500 mt-1 italic">{contract.ketQuaPhapLy.ghiChu}</p>
              )}
            </div>
          </div>
        )}

        {/* Signature status */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
            Tình trạng chữ ký
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={`rounded-lg p-3 border ${contract.chuKyChuNha ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
            >
              <p className="text-xs font-semibold text-slate-600">Chủ nhà (Bạn)</p>
              <p
                className={`text-sm font-medium mt-1 ${contract.chuKyChuNha ? 'text-emerald-700' : 'text-slate-400'}`}
              >
                {contract.chuKyChuNha ? 'Đã ký' : 'Chưa ký'}
              </p>
            </div>
            <div
              className={`rounded-lg p-3 border ${contract.chuKyDaiLy ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
            >
              <p className="text-xs font-semibold text-slate-600">Đại lý</p>
              <p
                className={`text-sm font-medium mt-1 ${contract.chuKyDaiLy ? 'text-emerald-700' : 'text-slate-400'}`}
              >
                {contract.chuKyDaiLy ? 'Đã ký' : 'Chưa ký'}
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="space-y-2 pt-2">
          {canSign && !isOwnerSigned && (
            <button
              onClick={onSignOwner}
              disabled={actionLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              )}
              Ký hợp đồng (Chủ nhà)
            </button>
          )}
          {canSign && isOwnerSigned && (
            <p className="text-center text-sm text-emerald-600 font-medium">
              ✅ Bạn đã ký hợp đồng này
            </p>
          )}
          <Link
            to={`/dashboard/bat-dong-san/${contract.bdsId}`}
            className="block w-full py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-sm text-center hover:bg-slate-50 transition-colors"
          >
            Xem bất động sản
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-20">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">
          Bạn chưa có hợp đồng ký gửi nào
        </h3>
        <p className="text-on-surface-variant text-sm mb-8">
          Đăng ký ký gửi bất động sản để bắt đầu quy trình hợp đồng.
        </p>
        <Link
          to="/dashboard/bat-dong-san/dang-ky"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Đăng ký ký gửi ngay
        </Link>
      </div>
    </div>
  )
}

export default function HopDongKyGuiPage() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Sign modal
  const [signModal, setSignModal] = useState({ open: false })
  const [notice, setNotice] = useState('')

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  const fetchContracts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Try owner-specific endpoint, fallback to all
      let res
      try {
        res = await hopDongKyGuiService.theoChuNhaHienTai()
      } catch {
        res = await hopDongKyGuiService.danhSach()
      }
      const mapped = (res?.data || []).map(mapContractToOwnerView)
      setContracts(mapped)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách hợp đồng')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const filtered = useMemo(() => {
    let result = [...contracts]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          String(c.id).includes(q) ||
          (c.tenBDS && c.tenBDS.toLowerCase().includes(q))
      )
    }
    if (filterStatus !== 'all') result = result.filter((c) => c.trangThai === filterStatus)
    return result
  }, [searchQuery, filterStatus, contracts])

  const kpiData = useMemo(
    () => ({
      total: contracts.length,
      active: contracts.filter((c) => c.trangThai === 'dang_hieu_luc').length,
      pending: contracts.filter((c) => ['cho_duyet', 'cho_ky'].includes(c.trangThai)).length,
      ended: contracts.filter((c) => ['da_ket_thuc', 'tam_ngung'].includes(c.trangThai)).length,
    }),
    [contracts]
  )

  const selectedContract = selectedId ? contracts.find((c) => c.id === selectedId) : null

  const handleSignOwner = async () => {
    if (!selectedContract) return
    setActionLoading(true)
    try {
      await hopDongKyGuiService.kyChuNha(selectedContract.id)
      setNotice('Đã ký hợp đồng thành công')
      setSignModal({ open: false })
      setSelectedId(null)
      fetchContracts()
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto flex items-center justify-center min-h-[400px]">
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
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Hợp đồng ký gửi</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Theo dõi hợp đồng ký gửi bất động sản của bạn
        </p>
      </div>

      {/* Notice */}
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
      <div className="grid grid-cols-4 gap-4 mb-6">
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
          trend={0}
        />
        <KPICard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label="Đã ký / Hoàn thành"
          value={kpiData.active}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
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
          value={kpiData.pending}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <KPICard
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          }
          label="Kết thúc"
          value={kpiData.ended}
          color="text-slate-600"
          bgColor="bg-slate-50"
        />
      </div>

      {/* Search & filter */}
      <div className="bg-white rounded-xl border border-outline-variant p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline"
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
              placeholder="Tìm kiếm mã hợp đồng, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-sm text-on-surface focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {FILTER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-on-surface-variant">
            Hiển thị{' '}
            <span className="font-semibold text-on-surface">{filtered.length}</span> hợp đồng
          </p>
          {(filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilterStatus('all')
                setSearchQuery('')
              }}
              className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-[160px_1fr_128px_144px_auto_32px] gap-4 px-4 py-2.5 mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Mã hợp đồng
              </span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Bất động sản
              </span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide text-center">
                Thời hạn
              </span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide text-right">
                Tiền đảm bảo
              </span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Trạng thái
              </span>
              <span />
            </div>

            <div className="space-y-3">
              {filtered.map((c) => (
                <ContractRow
                  key={c.id}
                  contract={c}
                  isSelected={selectedId === c.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          {selectedContract && (
            <div className="w-105 shrink-0 hidden xl:block">
              <ContractDetail
                contract={selectedContract}
                onClose={() => setSelectedId(null)}
                onSignOwner={() => setSignModal({ open: true })}
                actionLoading={actionLoading}
              />
            </div>
          )}
        </div>
      )}

      {/* Sign modal */}
      {signModal.open && selectedContract && (
        <SignContractModal
          onClose={() => setSignModal({ open: false })}
          onSign={handleSignOwner}
          signingRole="owner"
          userDisplayName={userInfo?.hoTen || ''}
          contractInfo={{
            ma: `HĐKG-${String(selectedContract.id).padStart(4, '0')}`,
            chuNha: userInfo?.hoTen || '',
            batDongSan: selectedContract.tenBDS,
          }}
        />
      )}
    </div>
  )
}
