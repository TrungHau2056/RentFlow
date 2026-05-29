import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import viewingService from '../services/viewingService'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
]

const STATUS_MAP = {
  SAN_SANG_CHO_THUE: { status: 'Moi', label: 'Còn trống' },
  DANG_CHO_THUE: { status: 'Noi_Bat', label: 'Đang cho thuê' },
  DA_THUE: { status: 'Da_Thue', label: 'Đã cho thuê' },
}

const STATUS_STYLES = {
  Moi: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Noi_Bat: 'bg-orange-100 text-orange-700 border-orange-200',
  Da_Thue: 'bg-slate-100 text-slate-600 border-slate-200',
}

function formatPrice(vnd) {
  return (vnd || 0).toLocaleString('vi-VN') + ' đ/tháng'
}

function mapProperty(item, index) {
  const statusInfo = STATUS_MAP[item.trangThai] || { status: 'Moi', label: 'Mới' }
  return {
    id: item.id,
    title: item.loaiNha ? `${item.loaiNha} tại ${item.diaChi}` : item.diaChi,
    price: formatPrice(item.giaThue),
    location: item.diaChi || '',
    area: item.dienTich ? `${item.dienTich} m²` : '',
    bedrooms: item.soPhongNgu || 0,
    bathrooms: item.soPhongVeSinh || 0,
    image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
    status: statusInfo.status,
    statusLabel: statusInfo.label,
    type: item.loaiNha || '',
  }
}

const DISTRICTS = [
  { id: 1, name: 'Cầu Giấy', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop' },
  { id: 2, name: 'Hà Đông', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop' },
  { id: 3, name: 'Thanh Xuân', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop' },
  { id: 4, name: 'Nam Từ Liêm', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop' },
  { id: 5, name: 'Ba Đình', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop' },
]

const BENEFITS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Xem đầy đủ thông tin',
    description: 'Xem địa chỉ chi tiết, gallery hình ảnh và thông tin liên hệ của tất cả bất động sản.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Đặt lịch xem thực tế',
    description: 'Dễ dàng đặt lịch xem nhà trực tiếp với chủ nhà hoặc môi giới.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Nhận thông báo phù hợp',
    description: 'Nhận thông báo ngay khi có bất động sản mới phù hợp với tiêu chí của bạn.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Theo dõi nhà yêu thích',
    description: 'Lưu và quản lý danh sách bất động sản yêu thích của bạn.',
  },
]

export default function HomePage() {
  const [userInfo] = useState(() => {
    const stored = localStorage.getItem('userInfo')
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem('userInfo')
      return null
    }
  })
  const [searchParams, setSearchParams] = useState({
    district: '',
    priceRange: '',
    area: '',
    bedrooms: '',
  })
  const [featuredProperties, setFeaturedProperties] = useState([])

  useEffect(() => {
    viewingService.getPublicProperties()
      .then(res => {
        const list = (res?.data || []).map(mapProperty)
        setFeaturedProperties(list)
      })
      .catch(() => setFeaturedProperties([]))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
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

            {/* Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-primary font-medium text-sm hover:text-primary-container transition-colors">
                Trang chủ
              </Link>
              <Link to="/bat-dong-san" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                Nhà cho thuê
              </Link>
              {userInfo?.role === 'CHU_NHA' && (
                <Link to="/dashboard/bat-dong-san/dang-ky" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                  Ký gửi nhà
                </Link>
              )}
              <a href="#contact" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                Liên hệ
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16">
        <div className="relative h-[600px] bg-gradient-to-br from-primary via-primary-container to-surface-tint overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=800&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/60 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-4xl">
              Tìm căn nhà phù hợp dành cho bạn
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl">
              Hàng trăm bất động sản cho thuê được cập nhật mỗi ngày
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-5xl w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Khu vực */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <select
                    value={searchParams.district}
                    onChange={(e) => setSearchParams({ ...searchParams, district: e.target.value })}
                    className="w-full pl-10 pr-8 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">Khu vực</option>
                    <option value="cau-giay">Cầu Giấy</option>
                    <option value="ba-dinh">Ba Đình</option>
                    <option value="hoan-kiem">Hoàn Kiếm</option>
                    <option value="ha-dong">Hà Đông</option>
                    <option value="thanh-xuan">Thanh Xuân</option>
                    <option value="nam-tu-liem">Nam Từ Liêm</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Khoảng giá */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <select
                    value={searchParams.priceRange}
                    onChange={(e) => setSearchParams({ ...searchParams, priceRange: e.target.value })}
                    className="w-full pl-10 pr-8 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">Khoảng giá</option>
                    <option value="0-10">Dưới 10 triệu</option>
                    <option value="10-15">10 - 15 triệu</option>
                    <option value="15-20">15 - 20 triệu</option>
                    <option value="20-30">20 - 30 triệu</option>
                    <option value="30-50">30 - 50 triệu</option>
                    <option value="50+">Trên 50 triệu</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Diện tích */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <select
                    value={searchParams.area}
                    onChange={(e) => setSearchParams({ ...searchParams, area: e.target.value })}
                    className="w-full pl-10 pr-8 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">Diện tích</option>
                    <option value="0-50">Dưới 50 m²</option>
                    <option value="50-80">50 - 80 m²</option>
                    <option value="80-120">80 - 120 m²</option>
                    <option value="120-200">120 - 200 m²</option>
                    <option value="200+">Trên 200 m²</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Số phòng ngủ */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <select
                    value={searchParams.bedrooms}
                    onChange={(e) => setSearchParams({ ...searchParams, bedrooms: e.target.value })}
                    className="w-full pl-10 pr-8 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">Phòng ngủ</option>
                    <option value="1">1 phòng</option>
                    <option value="2">2 phòng</option>
                    <option value="3">3 phòng</option>
                    <option value="4">4+ phòng</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Submit Button */}
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
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Nhà nổi bật</h2>
            <p className="text-slate-500">
              Những bất động sản cho thuê được quan tâm nhất tại Hà Nội
            </p>
          </div>
          <Link
            to="/bat-dong-san"
            className="text-primary-container font-medium text-sm hover:text-primary transition-colors flex items-center gap-1"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property, index) => (
            <Link
              key={property.id}
              to={`/bat-dong-san/${property.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[property.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {property.statusLabel}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 shadow-sm">
                  {property.type}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <p className="text-primary-container font-bold text-lg mb-4">
                  {property.price}
                </p>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{property.location}</span>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>{property.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{property.bedrooms} ngủ</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Districts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Khu vực phổ biến</h2>
            <p className="text-slate-500">Những quận có nhiều bất động sản cho thuê nhất</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {DISTRICTS.map((district) => (
              <Link
                key={district.id}
                to={`/bat-dong-san?district=${district.name.toLowerCase().replace(' ', '-')}`}
                className="group relative h-40 rounded-2xl overflow-hidden"
              >
                <img
                  src={district.image}
                  alt={district.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">{district.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Lợi ích thành viên</h2>
          <p className="text-slate-500">Đăng ký thành viên để nhận được nhiều ưu đãi hơn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-primary-container/30 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/10 flex items-center justify-center mx-auto mb-4 text-primary-container">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{benefit.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/register"
            className="bg-primary-container hover:bg-primary text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-primary-container/30 hover:shadow-xl hover:shadow-primary-container/40"
          >
            Đăng ký thành viên ngay
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
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
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Hệ thống quản lý ký gửi và cho thuê bất động sản chuyên nghiệp tại Hà Nội.
                Chúng tôi cung cấp giải pháp toàn diện cho chủ nhà và khách thuê.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/bat-dong-san" className="text-slate-400 text-sm hover:text-white transition-colors">
                    Nhà cho thuê
                  </Link>
                </li>
                {userInfo?.role === 'CHU_NHA' && (
                  <li>
                    <Link to="/dashboard/bat-dong-san/dang-ky" className="text-slate-400 text-sm hover:text-white transition-colors">
                      Ký gửi nhà
                    </Link>
                  </li>
                )}
                <li>
                  <a href="#contact" className="text-slate-400 text-sm hover:text-white transition-colors">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div id="contact">
              <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-slate-400 text-sm">Hà Nội, Việt Nam</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-slate-400 text-sm">0988.123.456</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-400 text-sm">contact@rentflow.vn</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 RentFlow. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Zalo</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm5-3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5V9c0-.28.22-.5.5-.5s.5.22.5.5v5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
