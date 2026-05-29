import { useState, useEffect, useMemo } from 'react'
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

function ContractDetail({ contract, onClose }) {
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
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [filterMoiGioi, setFilterMoiGioi] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const res = await contractService.getThueContracts()
      setContracts((res?.data || []).map(mapContract))
    } catch {
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContracts() }, [])

  const moiGioiOptions = useMemo(() => {
    const names = contracts.map(c => c.moiGioi).filter(Boolean)
    return ['Tất cả', ...new Set(names)]
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
    if (filterMoiGioi !== 'Tất cả') result = result.filter(c => c.moiGioi === filterMoiGioi)

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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
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
          <select value={filterMoiGioi} onChange={(e) => setFilterMoiGioi(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
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
              <ContractDetail contract={selectedContract} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
