import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import viewingService from '../services/viewingService'
import khachHangService from '../services/khachHangService'

const LOAI_NHA_OPTIONS = [
  { value: 'can-ho', label: 'Căn hộ' },
  { value: 'nha-rieng', label: 'Nhà riêng' },
  { value: 'biet-thu', label: 'Biệt thự' },
  { value: 'kios', label: 'Kios, mặt bằng' },
  { value: 'studio', label: 'Studio' },
]

const QUAN_HUYEN_OPTIONS = [
  { value: 'cau-giay', label: 'Cầu Giấy' },
  { value: 'tay-ho', label: 'Tây Hồ' },
  { value: 'ba-dinh', label: 'Ba Đình' },
  { value: 'hoan-kiem', label: 'Hoàn Kiếm' },
  { value: 'hai-ba-trung', label: 'Hai Bà Trưng' },
  { value: 'dong-da', label: 'Đống Đa' },
  { value: 'thanh-xuan', label: 'Thanh Xuân' },
  { value: 'ha-dong', label: 'Hà Đông' },
  { value: 'nam-tu-liem', label: 'Nam Từ Liêm' },
  { value: 'bac-tu-liem', label: 'Bắc Từ Liêm' },
]

const DISTRICT_LABEL_TO_VALUE = Object.fromEntries(
  QUAN_HUYEN_OPTIONS.map(o => [o.label, o.value])
)

const DISTRICT_VALUE_SET = new Set(QUAN_HUYEN_OPTIONS.map(o => o.value))

const DISTRICT_NORMALIZED_LABEL_TO_VALUE = Object.fromEntries(
  QUAN_HUYEN_OPTIONS.map(o => [normalizeText(o.label), o.value])
)

const PREF_TYPE_TO_FILTER = {
  'can_ho': 'can-ho',
  'can-ho': 'can-ho',
  'nha_rieng': 'nha-rieng',
  'nha-rieng': 'nha-rieng',
  'nha_pho': 'nha-rieng',
  'studio': 'studio',
  'biet_thu': 'biet-thu',
  'biet-thu': 'biet-thu',
  'kios': 'kios',
}

const KHOANG_GIA_OPTIONS = [
  { value: '0-10', label: 'Dưới 10 triệu', min: 0, max: 10000000 },
  { value: '10-15', label: '10 - 15 triệu', min: 10000000, max: 15000000 },
  { value: '15-20', label: '15 - 20 triệu', min: 15000000, max: 20000000 },
  { value: '20-30', label: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { value: '30-50', label: '30 - 50 triệu', min: 30000000, max: 50000000 },
  { value: '50+', label: 'Trên 50 triệu', min: 50000000, max: Infinity },
]

const LOAI_NHA_MAP = {
  'Biệt thự': 'biet-thu',
  'Căn hộ': 'can-ho',
  'Nhà riêng': 'nha-rieng',
  'Studio': 'studio',
  'Nhà phố': 'nha-rieng',
}

const STATUS_MAP = {
  SAN_SANG_CHO_THUE: { label: 'Còn trống', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DANG_CHO_THUE: { label: 'Đang cho thuê', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  DA_THUE: { label: 'Đã cho thuê', style: 'bg-slate-100 text-slate-500 border-slate-200' },
}

const SORT_OPTIONS = [
  { value: 'moi-nhat', label: 'Mới nhất' },
  { value: 'gia-thap-cao', label: 'Giá: Thấp → Cao' },
  { value: 'gia-cao-thap', label: 'Giá: Cao → Thấp' },
  { value: 'dien-tich-lon', label: 'Diện tích lớn nhất' },
]

function formatPrice(vnd) {
  return (vnd || 0).toLocaleString('vi-VN') + ' đ/tháng'
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

function resolveDistrictFilterValue(district) {
  const value = String(district || '').trim()
  if (!value) return null
  if (DISTRICT_VALUE_SET.has(value)) return value
  return DISTRICT_LABEL_TO_VALUE[value] || DISTRICT_NORMALIZED_LABEL_TO_VALUE[normalizeText(value)] || null
}

function findBestPriceRange(minPrice, maxPrice) {
  const minVnd = (minPrice || 0) * 1000000
  const maxVnd = (maxPrice != null ? maxPrice : Infinity) * 1000000
  let bestMatch = null
  let bestOverlap = -1

  for (const range of KHOANG_GIA_OPTIONS) {
    const rMax = range.max === Infinity ? maxVnd : range.max
    const overlapStart = Math.max(minVnd, range.min)
    const overlapEnd = Math.min(maxVnd, rMax)
    const overlap = Math.max(0, overlapEnd - overlapStart)
    if (overlap > bestOverlap) {
      bestOverlap = overlap
      bestMatch = range.value
    }
  }

  return bestMatch
}

function parseBudgetRange(budget) {
  const numbers = String(budget || '')
    .match(/\d[\d.,]*/g)
    ?.map(v => Number(v.replace(/[.,]/g, '')))
    .filter(Number.isFinite) || []
  if (numbers.length === 0) return {}

  const toMillion = value => value >= 1000000 ? value / 1000000 : value
  return {
    minPrice: toMillion(numbers[0]),
    maxPrice: toMillion(numbers[1] || numbers[0]),
  }
}

function mapProperty(item) {
  const typeKey = LOAI_NHA_MAP[item.loaiNha] || 'can-ho'
  const statusInfo = STATUS_MAP[item.trangThai] || { label: 'Mới', style: 'bg-blue-50 text-blue-700 border-blue-200' }
  return {
    id: item.id,
    title: item.loaiNha ? `${item.loaiNha} ${item.diaChi || ''}` : item.diaChi || `BĐS #${item.id}`,
    price: formatPrice(item.giaThue),
    priceRaw: item.giaThue || 0,
    location: item.diaChi || '',
    area: item.dienTich ? `${item.dienTich} m²` : '',
    areaRaw: item.dienTich || 0,
    bedrooms: item.soPhongNgu || 0,
    bathrooms: item.soPhongVeSinh || 0,
    type: typeKey,
    typeLabel: item.loaiNha || '',
    status: statusInfo,
  }
}

export default function TenantFindPropertyPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState([])
  const [filterPrice, setFilterPrice] = useState('')
  const [filterDistrict, setFilterDistrict] = useState([])
  const [sortBy, setSortBy] = useState('moi-nhat')
  const [currentPage, setCurrentPage] = useState(1)

  const [autoApplied, setAutoApplied] = useState(false)

  useEffect(() => {
    viewingService.getPublicProperties()
      .then(res => {
        setProperties((res?.data || []).map(mapProperty))
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (autoApplied) return
    khachHangService.me()
      .then(res => {
        const data = res?.data
        if (!data || !data.nhuCauThue) return
        try {
          const prefs = JSON.parse(data.nhuCauThue)
          const propertyTypes = prefs.propertyTypes || prefs.loaiBatDongSan || []
          const districts = prefs.districts || prefs.khuVuc || []

          if (propertyTypes.length > 0) {
            const mapped = propertyTypes
              .map(t => PREF_TYPE_TO_FILTER[t])
              .filter(Boolean)
            if (mapped.length > 0) setFilterType(mapped)
          }
          if (districts.length > 0) {
            const mapped = districts
              .map(resolveDistrictFilterValue)
              .filter(Boolean)
            if (mapped.length > 0) setFilterDistrict(mapped)
          }
          if (prefs.minPrice != null || prefs.maxPrice != null || prefs.nganSach) {
            const budgetRange = prefs.nganSach ? parseBudgetRange(prefs.nganSach) : {}
            const bestMatch = findBestPriceRange(
              prefs.minPrice ?? budgetRange.minPrice,
              prefs.maxPrice ?? budgetRange.maxPrice
            )
            if (bestMatch) setFilterPrice(bestMatch)
          }
          setAutoApplied(true)
        } catch {
          // ignore parse errors
        }
      })
      .catch(() => {})
  }, [autoApplied])

  const toggleType = (value) => {
    setFilterType(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const toggleDistrict = (value) => {
    setFilterDistrict(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterType([])
    setFilterPrice('')
    setFilterDistrict([])
    setSortBy('moi-nhat')
  }

  const hasActiveFilters = searchTerm || filterType.length > 0 || filterPrice || filterDistrict.length > 0

  const filtered = useMemo(() => {
    let result = [...properties]

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
    }
    if (filterType.length > 0) {
      result = result.filter(p => filterType.includes(p.type))
    }
    if (filterPrice) {
      const range = KHOANG_GIA_OPTIONS.find(o => o.value === filterPrice)
      if (range) result = result.filter(p => p.priceRaw >= range.min && p.priceRaw < range.max)
    }
    if (filterDistrict.length > 0) {
      result = result.filter(p => filterDistrict.some(d => {
        const district = QUAN_HUYEN_OPTIONS.find(o => o.value === d)
        const location = normalizeText(p.location)
        return location.includes(normalizeText(district?.label || d))
      }))
    }

    switch (sortBy) {
      case 'gia-thap-cao': result.sort((a, b) => a.priceRaw - b.priceRaw); break
      case 'gia-cao-thap': result.sort((a, b) => b.priceRaw - a.priceRaw); break
      case 'dien-tich-lon': result.sort((a, b) => b.areaRaw - a.areaRaw); break
      default: result.sort((a, b) => b.id - a.id)
    }
    return result
  }, [properties, searchTerm, filterType, filterPrice, filterDistrict, sortBy])

  const ITEMS_PER_PAGE = 6
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Đang tải danh sách nhà...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tìm nhà mới</h1>
          <p className="mt-1 text-sm text-slate-500">Khám phá các bất động sản cho thuê phù hợp với bạn</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-primary-container">
          {filtered.length} kết quả
        </span>
      </div>

      {/* Search + Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo khu vực, tên nhà..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
            />
          </div>

          {/* Price */}
          <select
            value={filterPrice}
            onChange={(e) => { setFilterPrice(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
          >
            <option value="">Khoảng giá</option>
            {KHOANG_GIA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500 py-1.5">Loại nhà:</span>
          {LOAI_NHA_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => { toggleType(o.value); setCurrentPage(1) }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterType.includes(o.value)
                  ? 'bg-primary-container text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          <span className="text-sm text-slate-500 py-1.5">Khu vực:</span>
          {QUAN_HUYEN_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => { toggleDistrict(o.value); setCurrentPage(1) }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterDistrict.includes(o.value)
                  ? 'bg-primary-container text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="mt-3">
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100">
            <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Không tìm thấy kết quả</h3>
          <p className="mt-2 text-sm text-slate-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {paginated.map((property) => (
            <Link
              key={property.id}
              to={`/bat-dong-san/${property.id}`}
              className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-container/30"
            >
              {/* Placeholder image */}
              <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${property.status.style}`}>
                    {property.status.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <p className="text-primary-container font-bold text-lg mb-2">{property.price}</p>

                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                  {property.area && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {property.area}
                    </div>
                  )}
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {property.bedrooms} ngủ
                    </div>
                  )}
                  {property.typeLabel && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      {property.typeLabel}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <Link
                    to={`/tenant/dat-lich-xem?propertyId=${property.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm py-2.5 text-center transition-all"
                  >
                    Đặt lịch xem
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl font-medium text-sm transition-colors ${
                currentPage === page
                  ? 'bg-primary-container text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
