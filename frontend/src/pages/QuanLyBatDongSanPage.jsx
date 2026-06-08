import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import batDongSanService from '../services/batDongSanService'
import chuNhaService from '../services/chuNhaService'

const STATUS_CONFIG = {
  cho_tiep_nhan: { label: 'Chờ tiếp nhận', color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  cho_danh_gia: { label: 'Chờ đánh giá', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  cho_khao_sat: { label: 'Chờ khảo sát', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky_hop_dong: { label: 'Chờ ký hợp đồng', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  dang_hien_thi: { label: 'Đang hiển thị', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400' },
  da_cho_thue: { label: 'Đã cho thuê', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  cham_dut: { label: 'Chấm dứt', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

const BE_STATUS_MAP = {
  CHO_DUYET: 'cho_tiep_nhan',
  CHO_DANH_GIA: 'cho_danh_gia',
  DA_KHAO_SAT: 'cho_khao_sat',
  DANG_SOAN_HOP_DONG: 'cho_ky_hop_dong',
  SAN_SANG_CHO_THUE: 'dang_hien_thi',
  DANG_CHO_THUE: 'dang_hien_thi',
  DA_THUE: 'da_cho_thue',
  NGUNG_CHO_THUE: 'cham_dut',
  DA_TRA: 'cham_dut',
  TU_CHOI: 'cham_dut',
}

const WORKFLOW_STEPS = [
  { key: 'cho_tiep_nhan', label: 'Tiếp nhận' },
  { key: 'cho_danh_gia', label: 'Đánh giá' },
  { key: 'cho_khao_sat', label: 'Khảo sát' },
  { key: 'cho_ky_hop_dong', label: 'Ký HĐ' },
  { key: 'dang_hien_thi', label: 'Hiển thị' },
  { key: 'da_cho_thue', label: 'Cho thuê' },
  { key: 'cham_dut', label: 'Chấm dứt' },
]

const PROPERTY_TYPES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Căn hộ', label: 'Căn hộ' },
  { value: 'Nhà riêng', label: 'Nhà riêng' },
  { value: 'Biệt thự', label: 'Biệt thự' },
  { value: 'Nhà phố', label: 'Nhà phố' },
  { value: 'Kios thương mại', label: 'Kiot' },
  { value: 'Phòng trọ', label: 'Phòng trọ' },
]

const DISTRICTS = [
  { value: 'all', label: 'Tất cả khu vực' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_high', label: 'Giá cao nhất' },
  { value: 'price_low', label: 'Giá thấp nhất' },
  { value: 'area_high', label: 'Diện tích lớn nhất' },
]

function getWorkflowStep(status) {
  const map = { cho_tiep_nhan: 1, cho_danh_gia: 2, cho_khao_sat: 3, cho_ky_hop_dong: 4, dang_hien_thi: 5, da_cho_thue: 6, cham_dut: 7 }
  return map[status] || 1
}

function mapProperty(item) {
  const statusKey = BE_STATUS_MAP[item.trangThai] || 'cho_tiep_nhan'
  return {
    id: item.id,
    title: item.loaiNha ? `${item.loaiNha} - ${item.diaChi}` : item.diaChi,
    type: item.loaiNha || '',
    price: item.giaThue ? Math.round(item.giaThue / 1000000) : 0,
    area: item.dienTich || 0,
    bedrooms: item.soPhongNgu || 0,
    bathrooms: item.soPhongVeSinh || 0,
    district: '',
    address: item.diaChi || '',
    ngayKyGui: item.ngayTao ? item.ngayTao[0] + '-' + String(item.ngayTao[1]).padStart(2, '0') + '-' + String(item.ngayTao[2]).padStart(2, '0') : '',
    image: '',
    status: statusKey,
    views: 0,
    description: item.moTa || '',
    tienIch: [],
    workflowStep: getWorkflowStep(statusKey),
    trangThai: item.trangThai,
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

function MiniWorkflow({ currentStep }) {
  return (
    <div className="flex items-center gap-0.5 mt-3">
      {WORKFLOW_STEPS.map((step, i) => {
        const isActive = i + 1 <= currentStep
        const isCurrent = i + 1 === currentStep
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-center">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  isActive ? (isCurrent ? 'bg-amber-400' : 'bg-blue-500') : 'bg-slate-200'
                }`}
              />
            </div>
            <span className={`text-[10px] leading-tight text-center ${isCurrent ? 'text-amber-700 font-medium' : isActive ? 'text-blue-600' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function PropertyCard({ property, onSelect, isSelected }) {
  const status = STATUS_CONFIG[property.status]
  const ngayKyGui = property.ngayKyGui ? new Date(property.ngayKyGui + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''

  return (
    <div
      onClick={() => onSelect(property.id)}
      role="link"
      tabIndex={0}
      aria-label={`Xem chi tiết ${property.title}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(property.id)
        }
      }}
      className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
      }`}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="flex h-full items-center justify-center">
          <svg className="h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border backdrop-blur-sm ${status.color}`}>
            ● {status.label}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 backdrop-blur-sm text-on-surface">
            {property.type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-base line-clamp-1 drop-shadow-md">{property.title}</h3>
          {property.district && (
            <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property.district}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-blue-600">{property.price}</span>
            <span className="text-sm text-on-surface-variant ml-1">triệu/tháng</span>
          </div>
          {property.views > 0 && (
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {property.views.toLocaleString('vi-VN')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.area} m²
          </span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
              </svg>
              {property.bedrooms} PN
            </span>
          )}
          {ngayKyGui && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {ngayKyGui}
            </span>
          )}
        </div>

        <MiniWorkflow currentStep={property.workflowStep} />

        {(property.status === 'dang_hien_thi' || property.status === 'cho_khao_sat') && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          {property.status === 'dang_hien_thi' && (
            <Link
              to={`/dashboard/hop-dong-ky-gui/${property.id}`}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="flex-1 py-2 rounded-lg bg-amber-50 text-amber-700 font-medium text-sm text-center hover:bg-amber-100 transition-colors"
            >
              Hợp đồng
            </Link>
          )}
          {property.status === 'cho_khao_sat' && (
            <Link
              to="/dashboard/lich-khao-sat"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-700 font-medium text-sm text-center hover:bg-slate-100 transition-colors"
            >
              Lịch khảo sát
            </Link>
          )}
          </div>
        )}
      </div>
    </div>
  )
}

function QuickPreview({ property, onClose }) {
  if (!property) return null
  const status = STATUS_CONFIG[property.status]
  const ngayKyGui = property.ngayKyGui ? new Date(property.ngayKyGui + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="flex h-full items-center justify-center">
          <svg className="h-20 w-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <svg className="w-4 h-4 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-on-surface mb-1">{property.title}</h3>
        <p className="text-sm text-on-surface-variant mb-3">{property.address}</p>

        <div className="flex items-end gap-1 mb-4">
          <span className="text-2xl font-bold text-blue-600">{property.price}</span>
          <span className="text-sm text-on-surface-variant">triệu/tháng</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-on-surface-variant">Diện tích</p>
            <p className="text-sm font-semibold text-on-surface">{property.area} m²</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-on-surface-variant">Phòng ngủ</p>
            <p className="text-sm font-semibold text-on-surface">{property.bedrooms}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-on-surface-variant">Phòng tắm</p>
            <p className="text-sm font-semibold text-on-surface">{property.bathrooms}</p>
          </div>
        </div>

        {property.description && (
          <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-3">{property.description}</p>
        )}

        {property.tienIch.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiện ích</p>
            <div className="flex flex-wrap gap-1.5">
              {property.tienIch.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiến độ xử lý</p>
          <MiniWorkflow currentStep={property.workflowStep} />
        </div>

        <div className="flex items-center justify-between text-xs text-on-surface-variant mb-4">
          {ngayKyGui && <span>Ngày ký gửi: {ngayKyGui}</span>}
          {property.views > 0 && <span>{property.views.toLocaleString('vi-VN')} lượt xem</span>}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/dashboard/bat-dong-san/${property.id}`}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ loading }) {
  if (loading) {
    return (
      <div className="col-span-full py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6">
            <svg className="w-16 h-16 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-on-surface-variant text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-full py-20">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Bạn chưa có bất động sản nào</h3>
        <p className="text-on-surface-variant text-sm mb-8">
          Đăng ký ký gửi bất động sản để chúng tôi hỗ trợ bạn tìm kiếm khách thuê nhanh chóng.
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

export default function QuanLyBatDongSanPage() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDistrict, setFilterDistrict] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const meRes = await chuNhaService.me()
        const chuNhaId = meRes.data.id
        const bdsRes = await batDongSanService.theoChuNha(chuNhaId)
        setProperties((bdsRes.data || []).map(mapProperty))
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    let result = [...properties]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      )
    }
    if (filterType !== 'all') result = result.filter(p => p.type === filterType)
    if (filterStatus !== 'all') result = result.filter(p => p.status === filterStatus)

    switch (sortBy) {
      case 'newest': result.sort((a, b) => new Date(b.ngayKyGui || 0) - new Date(a.ngayKyGui || 0)); break
      case 'price_high': result.sort((a, b) => b.price - a.price); break
      case 'price_low': result.sort((a, b) => a.price - b.price); break
      case 'area_high': result.sort((a, b) => b.area - a.area); break
    }

    return result
  }, [properties, searchQuery, filterType, filterDistrict, filterStatus, sortBy])

  const kpiData = useMemo(() => ({
    total: properties.length,
    processing: properties.filter(p => ['cho_tiep_nhan', 'cho_danh_gia', 'cho_khao_sat', 'cho_ky_hop_dong'].includes(p.status)).length,
    displaying: properties.filter(p => p.status === 'dang_hien_thi').length,
    rented: properties.filter(p => p.status === 'da_cho_thue').length,
  }), [properties])

  const selectedProperty = selectedId ? properties.find(p => p.id === selectedId) : null

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 underline">Thử lại</button>
      </div>
    )
  }

  return (
    <div className="max-w-400 mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Bất động sản đã ký gửi</h1>
          <p className="text-on-surface-variant text-sm mt-1">Theo dõi trạng thái và quản lý bất động sản của bạn</p>
        </div>
        <Link
          to="/dashboard/bat-dong-san/dang-ky"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-md text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm bất động sản
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          label="Tổng nhà ký gửi"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đang xử lý"
          value={kpiData.processing}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          label="Đang hiển thị"
          value={kpiData.displaying}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đã cho thuê"
          value={kpiData.rented}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
      </div>

      <div className="bg-white rounded-xl border border-outline-variant p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm bất động sản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-sm text-on-surface focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-sm text-on-surface focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-on-surface-variant hover:bg-slate-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-on-surface-variant hover:bg-slate-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-on-surface-variant">
            Hiển thị <span className="font-semibold text-on-surface">{filtered.length}</span> bất động sản
          </p>
          {(filterType !== 'all' || filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => { setFilterType('all'); setFilterStatus('all'); setSearchQuery(''); }}
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

      {loading ? (
        <EmptyState loading />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          <div className={`flex-1 ${selectedProperty ? '' : ''}`}>
            {viewMode === 'grid' ? (
              <div className={`grid gap-5 ${selectedProperty ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
                {filtered.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={(propertyId) => navigate(`/dashboard/bat-dong-san/${propertyId}`)}
                    isSelected={selectedId === property.id}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(property => {
                  const status = STATUS_CONFIG[property.status]
                  const ngayKyGui = property.ngayKyGui ? new Date(property.ngayKyGui + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''
                  return (
                    <div
                      key={property.id}
                      onClick={() => setSelectedId(property.id)}
                      className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all cursor-pointer flex ${
                        selectedId === property.id ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
                      }`}
                    >
                      <div className="w-48 h-36 shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
                        </svg>
                      </div>
                      <div className="flex-1 p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-on-surface truncate">{property.title}</h3>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border shrink-0 ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant truncate">{property.address}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-on-surface-variant">
                            <span>{property.area} m²</span>
                            {property.bedrooms > 0 && <span>{property.bedrooms} PN</span>}
                            {ngayKyGui && <span>{ngayKyGui}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-blue-600">{property.price}</p>
                          <p className="text-xs text-on-surface-variant">triệu/tháng</p>
                        </div>
                        <div className="shrink-0">
                          <Link
                            to={`/dashboard/bat-dong-san/${property.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg text-on-surface-variant hover:bg-slate-50 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {selectedProperty && (
            <div className="w-96 shrink-0 hidden xl:block">
              <QuickPreview property={selectedProperty} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
