import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import hopDongKyGuiService from '../services/hopDongKyGuiService'

const TRANG_THAI_HOP_DONG = {
  NHAP: { label: 'Nháp', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  CHO_PHE_DUYET: { label: 'Chờ phê duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  DA_PHE_DUYET: { label: 'Đã phê duyệt', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  TU_CHOI: { label: 'Từ chối', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
  DA_KY: { label: 'Đã ký', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  HOAN_THANH: { label: 'Hoàn thành', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400' },
  DA_HUY: { label: 'Đã hủy', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
}

function formatVND(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

function ContractRow({ contract, isSelected, onSelect }) {
  const status = TRANG_THAI_HOP_DONG[contract.trangThai] || TRANG_THAI_HOP_DONG.NHAP
  return (
    <div
      onClick={() => onSelect(contract.id)}
      className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="shrink-0 w-40">
          <p className="font-mono text-sm font-semibold text-blue-600">#{String(contract.id).padStart(5, '0')}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{contract.ngayKy ? formatDate(contract.ngayKy) : 'Chưa ký'}</p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface truncate">{contract.loaiBatDongSan || 'Bất động sản'} - {contract.diaChiBatDongSan}</p>
          <p className="text-sm text-on-surface-variant truncate">NV: {contract.tenNhanVien || '—'}</p>
        </div>

        <div className="shrink-0 w-32 text-center">
          <p className="text-sm font-medium text-on-surface">
            {contract.ngayBatDau ? `${formatDate(contract.ngayBatDau)}` : '—'}
          </p>
          <p className="text-xs text-on-surface-variant">{contract.ngayKetThuc ? formatDate(contract.ngayKetThuc) : '—'}</p>
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

function ContractDetail({ contract, onClose }) {
  if (!contract) return null
  const status = TRANG_THAI_HOP_DONG[contract.trangThai] || TRANG_THAI_HOP_DONG.NHAP

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium mb-1">#{String(contract.id).padStart(5, '0')}</p>
            <h3 className="text-white font-bold text-lg">{contract.loaiBatDongSan || 'Bất động sản'}</h3>
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
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Thông tin bất động sản</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Địa chỉ</p>
              <p className="text-sm font-medium text-on-surface">{contract.diaChiBatDongSan}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Loại</p>
              <p className="text-sm font-medium text-on-surface">{contract.loaiBatDongSan || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Giá thuê</p>
              <p className="text-sm font-medium text-blue-600">{formatVND(contract.giaThue)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Tiền đảm bảo</p>
              <p className="text-sm font-medium text-on-surface">{formatVND(contract.tienDamBao)}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Điều khoản ký gửi</h4>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày ký</span>
              <span className="font-medium text-on-surface">{contract.ngayKy ? formatDate(contract.ngayKy) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày bắt đầu</span>
              <span className="font-medium text-on-surface">{contract.ngayBatDau ? formatDate(contract.ngayBatDau) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày kết thúc</span>
              <span className="font-medium text-on-surface">{contract.ngayKetThuc ? formatDate(contract.ngayKetThuc) : '—'}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Nhân viên phụ trách</h4>
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Môi giới</p>
              <p className="text-sm font-medium text-on-surface">{contract.tenNhanVien || '—'}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            to={`/dashboard/bat-dong-san/${contract.batDongSanId}`}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors"
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
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const res = await hopDongKyGuiService.theoChuNhaHienTai()
        setContracts(res.data || [])
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    let result = [...contracts]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        String(c.id).includes(q) ||
        (c.diaChiBatDongSan && c.diaChiBatDongSan.toLowerCase().includes(q)) ||
        (c.loaiBatDongSan && c.loaiBatDongSan.toLowerCase().includes(q))
      )
    }
    if (filterStatus !== 'all') result = result.filter(c => c.trangThai === filterStatus)
    return result
  }, [contracts, searchQuery, filterStatus])

  const kpiData = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter(c => c.trangThai === 'DA_KY' || c.trangThai === 'HOAN_THANH').length,
    pending: contracts.filter(c => c.trangThai === 'CHO_PHE_DUYET' || c.trangThai === 'DA_PHE_DUYET').length,
    draft: contracts.filter(c => c.trangThai === 'NHAP').length,
  }), [contracts])

  const selectedContract = selectedId ? contracts.find(c => c.id === selectedId) : null

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto py-20 text-center">
        <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 text-on-surface-variant">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto py-20 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 underline">Thử lại</button>
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
          trend={0}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đã ký / Hoàn thành"
          value={kpiData.active}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Chờ duyệt"
          value={kpiData.pending}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
          label="Bản nháp"
          value={kpiData.draft}
          color="text-slate-600"
          bgColor="bg-slate-50"
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
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(TRANG_THAI_HOP_DONG).map(([key, cfg]) => (
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
            <div className="w-[420px] shrink-0 hidden xl:block">
              <ContractDetail contract={selectedContract} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
