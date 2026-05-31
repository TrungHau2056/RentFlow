import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import viewingService from '../services/viewingService'

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

const LOAI_NHA_OPTIONS = [
  { value: 'can-ho', label: 'Căn hộ' },
  { value: 'nha-rieng', label: 'Nhà riêng' },
  { value: 'biet-thu', label: 'Biệt thự' },
  { value: 'kios', label: 'Kios, mặt bằng' },
  { value: 'studio', label: 'Studio' },
]

const HUONG_NHA_OPTIONS = [
  { value: 'dong', label: 'Đông' },
  { value: 'tay', label: 'Tây' },
  { value: 'nam', label: 'Nam' },
  { value: 'bac', label: 'Bắc' },
  { value: 'dong-nam', label: 'Đông Nam' },
  { value: 'tay-nam', label: 'Tây Nam' },
  { value: 'dong-bac', label: 'Đông Bắc' },
  { value: 'tay-bac', label: 'Tây Bắc' },
]

const NOI_THAT_OPTIONS = [
  { value: 'day-du', label: 'Đầy đủ' },
  { value: 'co-ban', label: 'Cơ bản' },
  { value: 'khong', label: 'Không có' },
]

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
]

const STATUS_MAP = {
  SAN_SANG_CHO_THUE: { status: 'Moi', label: 'Còn trống' },
  DANG_CHO_THUE: { status: 'Noi_Bat', label: 'Đang cho thuê' },
  DA_THUE: { status: 'Da_Thue', label: 'Đã cho thuê' },
}

const LOAI_NHA_MAP = {
  'Biệt thự': 'biet-thu',
  'Căn hộ': 'can-ho',
  'Nhà riêng': 'nha-rieng',
  'Studio': 'studio',
  'Nhà phố': 'nha-rieng',
}

function formatPrice(vnd) {
  return (vnd || 0).toLocaleString('vi-VN') + ' đ/tháng'
}

function mapProperty(item, index) {
  const typeKey = LOAI_NHA_MAP[item.loaiNha] || 'can-ho'
  const statusInfo = STATUS_MAP[item.trangThai] || { status: 'Moi', label: 'Mới' }
  return {
    id: item.id,
    title: item.loaiNha ? `${item.loaiNha} ${item.diaChi}` : item.diaChi,
    price: formatPrice(item.giaThue),
    priceRaw: item.giaThue || 0,
    location: item.diaChi || '',
    area: item.dienTich ? `${item.dienTich} m²` : '',
    areaRaw: item.dienTich || 0,
    bedrooms: item.soPhongNgu || 0,
    bathrooms: item.soPhongVeSinh || 0,
    type: typeKey,
    typeLabel: item.loaiNha || '',
    image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
    status: statusInfo.status,
    statusLabel: statusInfo.label,
    description: item.diaChi || '',
  }
}

const STATUS_STYLES = {
  Moi: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Noi_Bat: 'bg-orange-100 text-orange-700 border-orange-200',
  Da_Thue: 'bg-slate-100 text-slate-600 border-slate-200',
}

const SORT_OPTIONS = [
  { value: 'moi-nhat', label: 'Mới nhất' },
  { value: 'gia-thap-cao', label: 'Giá: Thấp đến cao' },
  { value: 'gia-cao-thap', label: 'Giá: Cao đến thấp' },
  { value: 'dien-tich-lon', label: 'Diện tích lớn nhất' },
]

function readStoredUser() {
  const stored = localStorage.getItem('userInfo')
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem('userInfo')
    return null
  }
}

export default function BatDongSanPage() {
  const navigate = useNavigate()
  const [userInfo] = useState(readStoredUser)
  const [profileOpen, setProfileOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    viewingService.getPublicProperties()
      .then(res => {
        const list = (res?.data || []).map(mapProperty)
        setProperties(list)
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [])

  const initials = userInfo?.hoTen
    ?.split(' ')
    .slice(-2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase() || 'U'

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    navigate('/')
    window.location.reload()
  }

  const canRegisterConsignment = userInfo?.role === 'CHU_NHA'

  const [filters, setFilters] = useState({
    districts: [],
    priceRange: { min: '', max: '' },
    areaRange: { min: '', max: '' },
    bedrooms: [],
    houseType: [],
    direction: [],
    furniture: [],
    status: [],
  })
  const [sortBy, setSortBy] = useState('moi-nhat')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchLocation, setSearchLocation] = useState('')
  const [searchPrice, setSearchPrice] = useState('')
  const [searchArea, setSearchArea] = useState('')
  const [searchBedrooms, setSearchBedrooms] = useState('')

  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      districts: [],
      priceRange: { min: '', max: '' },
      areaRange: { min: '', max: '' },
      bedrooms: [],
      houseType: [],
      direction: [],
      furniture: [],
      status: [],
    })
  }

  const filteredProperties = properties.filter((property) => {
    if (filters.districts.length > 0 && !filters.districts.some(d => property.location.includes(d))) return false
    if (filters.houseType.length > 0 && !filters.houseType.includes(property.type)) return false
    if (filters.bedrooms.length > 0) {
      const minBed = Math.min(...filters.bedrooms.filter(b => typeof b === 'number'))
      if (property.bedrooms < minBed) return false
    }
    if (filters.priceRange.min && property.priceRaw < Number(filters.priceRange.min) * 1000000) return false
    if (filters.priceRange.max && property.priceRaw > Number(filters.priceRange.max) * 1000000) return false
    if (filters.areaRange.min && property.areaRaw < Number(filters.areaRange.min)) return false
    if (filters.areaRange.max && property.areaRaw > Number(filters.areaRange.max)) return false
    if (filters.status.length > 0 && !filters.status.includes(property.status)) return false
    return true
  })

  const ITEMS_PER_PAGE = 6
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'gia-thap-cao') return a.priceRaw - b.priceRaw
    if (sortBy === 'gia-cao-thap') return b.priceRaw - a.priceRaw
    if (sortBy === 'dien-tich-lon') return b.areaRaw - a.areaRaw
    return b.id - a.id
  })
  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = sortedProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-primary font-bold text-xl">RentFlow</h1>
                <p className="text-slate-500 text-xs">Ký gửi & Cho thuê nhà</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {/* Links công cộng */}
              <Link to="/" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <Link to="/bat-dong-san" className="text-primary font-medium text-sm">
                Nhà cho thuê
              </Link>
              {canRegisterConsignment && (
                <Link to="/dashboard/bat-dong-san/dang-ky" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                  Ký gửi nhà
                </Link>
              )}
              <a href="#contact" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                Liên hệ
              </a>

              {/* Links riêng cho khách thuê */}
              {userInfo?.role === 'KHACH_HANG' && (
                <Link to="/tenant/nha-da-luu" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                  Nhà đã lưu
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {userInfo ? (
                <div className="relative flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-medium">{initials}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="hidden sm:flex items-center gap-2 rounded-lg py-1 transition-colors hover:bg-slate-50"
                  >
                    <div className="text-left">
                      <p className="text-sm text-slate-800 leading-tight">{userInfo.hoTen}</p>
                      <p className="text-xs text-slate-500 leading-tight">
                        {userInfo.role === 'CHU_NHA' ? 'Chủ nhà' : 'Khách hàng'}
                      </p>
                    </div>
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                      <Link
                        to="/tenant/ho-so"
                        className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        Hồ sơ cá nhân
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false); handleLogout() }}
                        className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-600 font-medium text-sm hover:text-primary transition-colors px-4 py-2"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-container hover:bg-primary text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-primary-container/30"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-primary font-medium">Nhà cho thuê</span>
          </div>

          {/* Search Bar */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Nhập khu vực..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                />
              </div>
              <select value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer">
                <option value="">Khoảng giá</option>
                <option value="0-10">Dưới 10 triệu</option>
                <option value="10-15">10 - 15 triệu</option>
                <option value="15-20">15 - 20 triệu</option>
                <option value="20-30">20 - 30 triệu</option>
                <option value="30-50">30 - 50 triệu</option>
                <option value="50+">Trên 50 triệu</option>
              </select>
              <select value={searchArea} onChange={(e) => setSearchArea(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer">
                <option value="">Diện tích</option>
                <option value="0-50">Dưới 50 m²</option>
                <option value="50-80">50 - 80 m²</option>
                <option value="80-120">80 - 120 m²</option>
                <option value="120-200">120 - 200 m²</option>
                <option value="200+">Trên 200 m²</option>
              </select>
              <select value={searchBedrooms} onChange={(e) => setSearchBedrooms(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer">
                <option value="">Phòng ngủ</option>
                <option value="1">1 phòng</option>
                <option value="2">2 phòng</option>
                <option value="3">3 phòng</option>
                <option value="4">4+ phòng</option>
              </select>
              <button className="bg-primary-container hover:bg-primary text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary-container/30 hover:shadow-xl hover:shadow-primary-container/40 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-56">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Bộ lọc
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-slate-500 hover:text-primary transition-colors"
                >
                  Đặt lại
                </button>
              </div>

              {/* Loại nhà */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Loại nhà
                </h4>
                <div className="space-y-2">
                  {LOAI_NHA_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.houseType.includes(option.value)}
                        onChange={() => toggleFilter('houseType', option.value)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-container focus:ring-primary-container focus:ring-2"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quận/Huyện */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Quận / Huyện
                </h4>
                <div className="space-y-2">
                  {QUAN_HUYEN_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.districts.includes(option.value)}
                        onChange={() => toggleFilter('districts', option.value)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-container focus:ring-primary-container focus:ring-2"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Khoảng giá */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Khoảng giá
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, min: e.target.value } }))}
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: e.target.value } }))}
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Diện tích */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Diện tích
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.areaRange.min}
                    onChange={(e) => setFilters(prev => ({ ...prev, areaRange: { ...prev.areaRange, min: e.target.value } }))}
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={filters.areaRange.max}
                    onChange={(e) => setFilters(prev => ({ ...prev, areaRange: { ...prev.areaRange, max: e.target.value } }))}
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Số phòng ngủ */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Phòng ngủ
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <button
                      key={num}
                      onClick={() => toggleFilter('bedrooms', num)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.bedrooms.includes(num)
                          ? 'bg-primary-container text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-primary-container'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Hướng nhà */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Hướng
                </h4>
                <div className="space-y-2">
                  {HUONG_NHA_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.direction.includes(option.value)}
                        onChange={() => toggleFilter('direction', option.value)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-container focus:ring-primary-container focus:ring-2"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nội thất */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Nội thất
                </h4>
                <div className="space-y-2">
                  {NOI_THAT_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.furniture.includes(option.value)}
                        onChange={() => toggleFilter('furniture', option.value)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-container focus:ring-primary-container focus:ring-2"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trạng thái */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Trạng thái
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'Moi', label: 'Còn trống' },
                    { value: 'Noi_Bat', label: 'Đang cho thuê' },
                    { value: 'Da_Thue', label: 'Đã cho thuê' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(option.value)}
                        onChange={() => toggleFilter('status', option.value)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-container focus:ring-primary-container focus:ring-2"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-2.5 rounded-lg bg-primary-container text-white font-medium text-sm hover:bg-primary transition-colors shadow-md shadow-primary-container/30">
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          {/* Property List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Nhà cho thuê</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Hiển thị {sortedProperties.length} kết quả
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-500">Đang tải dữ liệu...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && paginatedProperties.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="text-slate-500 font-medium">Không tìm thấy bất động sản nào</p>
                <p className="text-slate-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              </div>
            )}

            {/* Property Grid */}
            {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {paginatedProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/bat-dong-san/${property.id}`}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-2/5 relative overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[property.status]}`}>
                          {property.statusLabel}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
                      >
                        <svg className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="w-3/5 p-4 flex flex-col">
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-primary-container font-bold text-lg mb-2">
                        {property.price}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-4 pt-3 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span>{property.area}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{property.bedrooms} ngủ</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          <span>{property.typeLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
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
                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">RentFlow</h3>
                  <p className="text-slate-400 text-xs">Ký gửi & Cho thuê nhà</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Hệ thống quản lý ký gửi và cho thuê bất động sản chuyên nghiệp tại Hà Nội.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2">
                {/* Links công cộng */}
                <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link to="/bat-dong-san" className="text-slate-400 text-sm hover:text-white transition-colors">Nhà cho thuê</Link></li>
                {canRegisterConsignment && (
                  <li><Link to="/dashboard/bat-dong-san/dang-ky" className="text-slate-400 text-sm hover:text-white transition-colors">Ký gửi nhà</Link></li>
                )}
                <li><a href="#contact" className="text-slate-400 text-sm hover:text-white transition-colors">Liên hệ</a></li>

                {/* Links riêng cho khách thuê */}
                {userInfo?.role === 'KHACH_HANG' && (
                  <>
                    <li><Link to="/tenant/nha-da-luu" className="text-slate-400 text-sm hover:text-white transition-colors">Nhà đã lưu</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div id="contact">
              <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Hà Nội, Việt Nam</li>
                <li>0988.123.456</li>
                <li>contact@rentflow.vn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
            © 2025 RentFlow. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>

    </div>
  )
}
