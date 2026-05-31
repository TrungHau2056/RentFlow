import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import batDongSanService from '../services/batDongSanService'

const STATUS_CONFIG = {
  CHO_DUYET: { label: 'Chờ duyệt', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  DA_KHAO_SAT: { label: 'Đã khảo sát', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  DANG_SOAN_HOP_DONG: { label: 'Đang soạn HĐ', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400' },
  SAN_SANG_CHO_THUE: { label: 'Sẵn sàng cho thuê', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  DANG_CHO_THUE: { label: 'Đang cho thuê', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-400' },
  DA_THUE: { label: 'Đã thuê', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400' },
  NGUNG_CHO_THUE: { label: 'Ngừng cho thuê', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
  DA_TRA: { label: 'Đã trả', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
  TU_CHOI: { label: 'Từ chối', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

const LOAI_NHA_OPTIONS = ['Tất cả', 'Biệt thự', 'Căn hộ', 'Nhà phố', 'Văn phòng', 'Kiot', 'Shophouse']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'price_desc', label: 'Giá cao nhất' },
  { key: 'price_asc', label: 'Giá thấp nhất' },
]

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

function KPICard({ icon, label, value, color, bgColor, sparkData, sparkColor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
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

function PropertyRow({ property, isSelected, onSelect }) {
  const navigate = useNavigate()
  const status = STATUS_CONFIG[property.trangThai] || STATUS_CONFIG.CHO_DUYET
  const handleClick = () => {
    if (property.trangThai === 'CHO_DUYET') {
      navigate(`/admin/lich-khao-sat/tao/${property.id}`)
    } else {
      onSelect(property.id)
    }
  }
  return (
    <tr
      onClick={handleClick}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{property.diaChi}</p>
            <p className="text-xs text-slate-400">#{String(property.id).padStart(4, '0')}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">{property.loaiNha || '—'}</span>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{property.giaThue ? formatVND(property.giaThue) + 'đ' : '—'}</p>
        <p className="text-xs text-slate-400">/tháng</p>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">{property.dienTich ? `${property.dienTich}m²` : '—'}</td>
      <td className="py-3 px-4 text-sm text-slate-700">{property.tenChuNha || '—'}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-slate-400">{formatDateTime(property.ngayTao)}</td>
    </tr>
  )
}

function PropertyDetail({ property, onClose }) {
  if (!property) return null
  const status = STATUS_CONFIG[property.trangThai] || STATUS_CONFIG.CHO_DUYET

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">{property.loaiNha || 'Bất động sản'} · #{String(property.id).padStart(4, '0')}</p>
            <h3 className="text-white font-bold text-lg truncate">{property.diaChi}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin cơ bản</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Giá thuê</p>
              <p className="text-sm font-bold text-slate-800">{property.giaThue ? formatVND(property.giaThue) + 'đ/tháng' : '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Diện tích</p>
              <p className="text-sm font-bold text-slate-800">{property.dienTich ? `${property.dienTich}m²` : '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Loại nhà</p>
              <p className="text-sm font-bold text-slate-800">{property.loaiNha || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày tạo</p>
              <p className="text-sm font-bold text-slate-800">{formatDateTime(property.ngayTao)}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Địa chỉ</h4>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-700 flex items-start gap-2">
              <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.diaChi}
            </p>
          </div>
        </div>

        {property.moTa && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Mô tả</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3">{property.moTa}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin liên quan</h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Chủ nhà</p>
            <p className="text-sm font-medium text-slate-800">{property.tenChuNha || '—'}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            to={`/admin/bat-dong-san/${property.id}`}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium text-center hover:bg-blue-700 transition-colors"
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
        <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có bất động sản nào</h3>
        <p className="text-slate-500 text-sm mb-8">Khi chủ nhà đăng ký ký gửi, bất động sản sẽ hiển thị tại đây.</p>
      </div>
    </div>
  )
}

export default function AdminBatDongSanPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLoai, setFilterLoai] = useState('Tất cả')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await batDongSanService.danhSach()
      setProperties(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách bất động sản')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const filtered = useMemo(() => {
    let result = [...properties]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        (p.diaChi && p.diaChi.toLowerCase().includes(q)) ||
        (p.tenChuNha && p.tenChuNha.toLowerCase().includes(q)) ||
        (p.loaiNha && p.loaiNha.toLowerCase().includes(q)) ||
        String(p.id).includes(q)
      )
    }
    if (filterLoai !== 'Tất cả') result = result.filter(p => p.loaiNha === filterLoai)
    if (filterTrangThai !== 'all') result = result.filter(p => p.trangThai === filterTrangThai)

    switch (sortBy) {
      case 'price_desc': result.sort((a, b) => (b.giaThue || 0) - (a.giaThue || 0)); break
      case 'price_asc': result.sort((a, b) => (a.giaThue || 0) - (b.giaThue || 0)); break
      default:
        result.sort((a, b) => {
          const dateA = a.ngayTao ? new Date(a.ngayTao) : new Date(0)
          const dateB = b.ngayTao ? new Date(b.ngayTao) : new Date(0)
          return dateB - dateA
        })
    }
    return result
  }, [properties, searchQuery, filterLoai, filterTrangThai, sortBy])

  const kpiData = useMemo(() => ({
    total: properties.length,
    choDuyet: properties.filter(p => p.trangThai === 'CHO_DUYET').length,
    sanSangChoThue: properties.filter(p => p.trangThai === 'SAN_SANG_CHO_THUE' || p.trangThai === 'DANG_CHO_THUE').length,
    dangChoThue: properties.filter(p => p.trangThai === 'DANG_CHO_THUE').length,
  }), [properties])

  const selectedProperty = selectedId ? properties.find(p => p.id === selectedId) : null

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
          <button onClick={fetchProperties} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
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
          <h1 className="text-2xl font-bold text-slate-800">Quản lý bất động sản</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi và quản lý toàn bộ bất động sản ký gửi</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          label="Tổng bất động sản"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          sparkData={[8, 12, 9, 15, 13, 18, 16]}
          sparkColor="#2563eb"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Chờ duyệt"
          value={kpiData.choDuyet}
          color="text-amber-600"
          bgColor="bg-amber-50"
          sparkData={[1, 2, 1, 3, 2, 4, 3]}
          sparkColor="#d97706"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          label="Sẵn sàng cho thuê"
          value={kpiData.sanSangChoThue}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          sparkData={[5, 7, 6, 8, 7, 9, 8]}
          sparkColor="#059669"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          label="Đang cho thuê"
          value={kpiData.dangChoThue}
          color="text-cyan-600"
          bgColor="bg-cyan-50"
          sparkData={[3, 4, 4, 5, 4, 6, 5]}
          sparkColor="#0891b2"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[240px] flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm BĐS, chủ nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {LOAI_NHA_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
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
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bất động sản</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Loại</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Giá thuê</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Diện tích</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chủ nhà</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(p => (
                      <PropertyRow
                        key={p.id}
                        property={p}
                        isSelected={selectedId === p.id}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Hiển thị {filtered.length} / {properties.length} bất động sản</span>
              </div>
            </div>
          </div>

          {selectedProperty && (
            <div className="w-[420px] shrink-0 hidden xl:block">
              <PropertyDetail property={selectedProperty} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
