import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import hopDongKyGuiService from '../services/hopDongKyGuiService'

const STATUS_CONFIG = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky: { label: 'Chờ ký', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  dang_hieu_luc: { label: 'Đang hiệu lực', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  tam_dung: { label: 'Tạm dừng', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

const DEPOSIT_STATUS = {
  cho_duyet: { label: 'Chờ duyệt', color: 'text-amber-600', icon: 'clock' },
  dang_giu: { label: 'Đang giữ', color: 'text-blue-600', icon: 'shield' },
  da_khau_tru: { label: 'Đã khấu trừ', color: 'text-orange-600', icon: 'minus' },
  da_hoan_tra: { label: 'Đã hoàn trả', color: 'text-emerald-600', icon: 'check' },
}

const WORKFLOW_STEPS = [
  { key: 'tiep_nhan', label: 'Tiếp nhận' },
  { key: 'khao_sat', label: 'Khảo sát' },
  { key: 'phap_luat', label: 'Pháp lý duyệt' },
  { key: 'cho_ky', label: 'Chờ ký' },
  { key: 'hieu_luc', label: 'Hiệu lực' },
]

const STATUS_MAP = {
  NHAP: 'cho_duyet',
  CHO_PHE_DUYET: 'cho_duyet',
  DA_PHE_DUYET: 'cho_ky',
  TU_CHOI: 'tam_dung',
  DA_KY: 'dang_hieu_luc',
  HOAN_THANH: 'da_ket_thuc',
  DA_HUY: 'da_ket_thuc',
}

const WORKFLOW_MAP = {
  NHAP: 1, CHO_PHE_DUYET: 2, DA_PHE_DUYET: 3,
  TU_CHOI: 2, DA_KY: 5, HOAN_THANH: 5, DA_HUY: 5,
}

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function calcThoiHan(ngayBatDau, ngayKetThuc) {
  if (!ngayBatDau || !ngayKetThuc) return null
  const start = new Date(ngayBatDau)
  const end = new Date(ngayKetThuc)
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
}

function mapContract(item) {
  const rawStatus = item.trangThai || ''
  const status = STATUS_MAP[rawStatus] || 'cho_duyet'
  const thoiHan = calcThoiHan(item.ngayBatDau, item.ngayKetThuc)

  return {
    id: item.id,
    maHopDong: `HĐKG-${item.id}`,
    tenBDS: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    bdsId: item.batDongSanId,
    ngayKy: item.ngayKy || '',
    ngayBatDau: item.ngayBatDau || item.ngayKy,
    ngayKetThuc: item.ngayKetThuc,
    thoiHan: thoiHan ? `${thoiHan} tháng` : '—',
    tienDamBao: item.tienDamBao || 0,
    status: status,
    tienDamBaoTrangThai: rawStatus === 'DA_KY' || rawStatus === 'HOAN_THANH' ? 'dang_giu' : 'cho_duyet',
    workflowStep: WORKFLOW_MAP[rawStatus] || 1,
    diaChiBDS: item.diaChiBatDongSan || '',
    loaiBDS: '',
    dienTich: '',
    giaThueDeXuat: item.giaThue ? `${formatVND(item.giaThue)}/tháng` : '—',
    phiKyGui: '5%/năm',
    daiDienDaiLy: item.tenNhanVien || '—',
    moiGioi: '',
    dieuKhoanPhatSinh: '',
    dieuKienChamDut: '',
    lichSu: [],
  }
}

function KPICard({ icon, label, value, color, bgColor, trend }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-3xl font-bold text-on-surface">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${trend > 0 ? 'text-emerald-600' : trend === 0 ? 'text-slate-500' : 'text-red-500'}`}>
              {trend > 0 && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend > 0 ? `+${trend}%` : trend === 0 ? '—' : `${trend}%`} so với tháng trước
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className={color}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

function WorkflowTimeline({ currentStep }) {
  return (
    <div className="py-4">
      <div className="flex items-center">
        {WORKFLOW_STEPS.map((step, i) => {
          const stepNum = i + 1
          const isActive = stepNum <= currentStep
          const isCurrent = stepNum === currentStep
          const isLast = i === WORKFLOW_STEPS.length - 1
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isActive
                    ? isCurrent ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {isActive && !isCurrent ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : stepNum}
                </div>
                <span className={`text-[10px] mt-1.5 text-center leading-tight whitespace-nowrap ${isCurrent ? 'text-amber-700 font-semibold' : isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
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
    </div>
  )
}

function DepositTimeline({ status }) {
  const steps = [
    { key: 'cho_duyet', label: 'Chờ nộp' },
    { key: 'dang_giu', label: 'Đang giữ' },
    { key: 'da_khau_tru', label: 'Khấu trừ' },
    { key: 'da_hoan_tra', label: 'Hoàn trả' },
  ]
  const currentIdx = steps.findIndex(s => s.key === status)

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = i <= currentIdx
        const isCurrent = i === currentIdx
        return (
          <div key={step.key} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-amber-400 ring-2 ring-amber-100' : isActive ? 'bg-blue-500' : 'bg-slate-200'}`} />
              <span className={`text-xs ${isCurrent ? 'text-amber-700 font-medium' : isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${i < currentIdx ? 'bg-blue-300' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ContractRow({ contract, isSelected, onSelect }) {
  const status = STATUS_CONFIG[contract.status]
  return (
    <div
      onClick={() => onSelect(contract.id)}
      className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="shrink-0 w-40">
          <p className="font-mono text-sm font-semibold text-blue-600">{contract.maHopDong}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{formatDate(contract.ngayKy)}</p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface truncate">{contract.tenBDS}</p>
          <p className="text-sm text-on-surface-variant truncate">{contract.diaChiBDS}</p>
        </div>

        <div className="shrink-0 w-32 text-center">
          <p className="text-sm font-medium text-on-surface">{contract.thoiHan}</p>
          <p className="text-xs text-on-surface-variant">{formatDate(contract.ngayBatDau)} – {formatDate(contract.ngayKetThuc)}</p>
        </div>

        <div className="shrink-0 w-36 text-right">
          <p className="text-sm font-semibold text-on-surface">{formatVND(contract.tienDamBao)}</p>
          <span className={`text-xs font-medium ${DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.color}`}>
            {DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.label}
          </span>
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

function ContractDetail({ contract, onClose }) {
  if (!contract) return null
  const status = STATUS_CONFIG[contract.status]

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium mb-1">{contract.maHopDong}</p>
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
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiến trình pháp lý</h4>
          <WorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Thông tin bất động sản</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Loại</p>
              <p className="text-sm font-medium text-on-surface">{contract.loaiBDS || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Diện tích</p>
              <p className="text-sm font-medium text-on-surface">{contract.dienTich || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Giá thuê đề xuất</p>
              <p className="text-sm font-medium text-blue-600">{contract.giaThueDeXuat}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Phí ký gửi</p>
              <p className="text-sm font-medium text-on-surface">{contract.phiKyGui}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Điều khoản ký gửi</h4>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày bắt đầu</span>
              <span className="font-medium text-on-surface">{formatDate(contract.ngayBatDau)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày kết thúc</span>
              <span className="font-medium text-on-surface">{formatDate(contract.ngayKetThuc)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Thời hạn</span>
              <span className="font-medium text-on-surface">{contract.thoiHan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Phí ký gửi</span>
              <span className="font-medium text-on-surface">{contract.phiKyGui}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Đại diện</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Đại lý</p>
                <p className="text-sm font-medium text-on-surface">{contract.daiDienDaiLy}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Tiền đảm bảo</h4>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-blue-700">{formatVND(contract.tienDamBao)}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.color} bg-white`}>
                {DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.label}
              </span>
            </div>
            <DepositTimeline status={contract.tienDamBaoTrangThai} />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            to={`/dashboard/hop-dong-ky-gui/${contract.id}`}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors"
          >
            Xem chi tiết
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Bạn chưa có hợp đồng ký gửi nào</h3>
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

  const fetchContracts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await hopDongKyGuiService.danhSach()
      const mapped = (res?.data || []).map(mapContract)
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
      result = result.filter(c =>
        c.maHopDong.toLowerCase().includes(q) ||
        c.tenBDS.toLowerCase().includes(q) ||
        c.diaChiBDS.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') result = result.filter(c => c.status === filterStatus)
    return result
  }, [searchQuery, filterStatus, contracts])

  const kpiData = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter(c => c.status === 'dang_hieu_luc').length,
    pending: contracts.filter(c => ['cho_duyet', 'cho_ky'].includes(c.status)).length,
    ended: contracts.filter(c => ['da_ket_thuc', 'tam_dung'].includes(c.status)).length,
  }), [contracts])

  const selectedContract = selectedId ? contracts.find(c => c.id === selectedId) : null

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
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Hợp đồng ký gửi</h1>
        <p className="text-on-surface-variant text-sm mt-1">Theo dõi hợp đồng ký gửi bất động sản của bạn</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          label="Tổng hợp đồng"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          trend={15}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đang hiệu lực"
          value={kpiData.active}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          trend={10}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Chờ duyệt"
          value={kpiData.pending}
          color="text-amber-600"
          bgColor="bg-amber-50"
          trend={0}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
          label="Đã kết thúc"
          value={kpiData.ended}
          color="text-slate-600"
          bgColor="bg-slate-50"
          trend={-5}
        />
      </div>

      <div className="bg-white rounded-xl border border-outline-variant p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm mã hợp đồng, bất động sản..."
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
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-on-surface-variant">
            Hiển thị <span className="font-semibold text-on-surface">{filtered.length}</span> hợp đồng
          </p>
          {(filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => { setFilterStatus('all'); setSearchQuery('') }}
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
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Mã hợp đồng</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Bất động sản</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide text-center">Thời hạn</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide text-right">Tiền đảm bảo</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Trạng thái</span>
              <span />
            </div>

            <div className="space-y-3">
              {filtered.map(contract => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  isSelected={selectedId === contract.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          {selectedContract && (
            <div className="w-105 shrink-0 hidden xl:block">
              <ContractDetail contract={selectedContract} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
