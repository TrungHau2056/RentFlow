import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

const PROPERTY_DATA = {
  id: 1,
  title: 'Biệt thự cổ điển Pháp tại Phố Cổ',
  price: '45.000.000 đ/tháng',
  priceRaw: 45000000,
  location: 'Hoàn Kiếm, Hà Nội',
  fullAddress: '123 Hàng Ngang, Phường Hàng Đào, Quận Hoàn Kiếm, Hà Nội',
  area: '320 m²',
  areaRaw: 320,
  bedrooms: 4,
  bathrooms: 5,
  floors: 3,
  direction: 'Đông Nam',
  type: 'Biệt thự',
  legalStatus: 'Sổ đỏ chính chủ',
  status: 'Noi_Bat',
  statusLabel: 'Nổi bật',
  description: `Tọa lạc tại vị trí kim cương trong khu phố cổ Hà Nội, biệt thự mang kiến trúc Pháp cổ điển được phục dựng tinh xảo.

Không gian sống kết hợp hài hòa giữa nét đẹp truyền thống và tiện nghi hiện đại. Thiết kế 3 tầng với sân thượng, giếng trời thông thoáng.

Vị trí đắc địa: 5 phút đi bộ ra Hồ Gươm, gần các trường quốc tế, bệnh viện lớn. Khu vực an ninh, dân trí cao.`,
  features: [
    { icon: '🏠', text: 'Kiến trúc Pháp cổ, đã hoàn công' },
    { icon: '🔒', text: 'An ninh 24/7, camera giám sát' },
    { icon: '🌳', text: 'Sân vườn 50m², cây xanh' },
    { icon: '🚗', text: 'Garage ô tô trong nhà' },
    { icon: '🛗', text: 'Thang máy gia đình' },
    { icon: '☀️', text: 'Năng lượng mặt trời' },
  ],
  furniture: 'Đầy đủ nội thất cao cấp',
  nearby: [
    'Trường quốc tế Liên Hợp Quốc 500m',
    'Bệnh viện Việt Đức 1km',
    'Trung tâm thương mại Tràng Tiền 800m',
    'Công viên Thống Nhất 1.5km',
  ],
}

const PROPERTY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop', locked: false },
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', locked: false },
  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', locked: false },
  { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', locked: true },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', locked: true },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', locked: true },
]

const SIMILAR_PROPERTIES = [
  {
    id: 2,
    title: 'Căn hộ cao cấp view hồ Tây',
    price: '28.000.000 đ/tháng',
    location: 'Tây Hồ, Hà Nội',
    area: '150 m²',
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    status: 'Noi_Bat',
    statusLabel: 'Nổi bật',
  },
  {
    id: 3,
    title: 'Nhà phố thương mại Cầu Giấy',
    price: '22.000.000 đ/tháng',
    location: 'Cầu Giấy, Hà Nội',
    area: '120 m²',
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    status: 'Gia_Tot',
    statusLabel: 'Giá tốt',
  },
  {
    id: 4,
    title: 'Penthouse sang trọng Ba Đình',
    price: '55.000.000 đ/tháng',
    location: 'Ba Đình, Hà Nội',
    area: '200 m²',
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    status: 'Moi',
    statusLabel: 'Mới',
  },
]

const STATUS_STYLES = {
  Moi: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Noi_Bat: 'bg-orange-100 text-orange-700 border-orange-200',
  Gia_Tot: 'bg-blue-100 text-blue-700 border-blue-200',
}

const MEMBERSHIP_FEATURES = [
  'Xem địa chỉ chi tiết chính xác',
  'Xem đầy đủ bộ ảnh HD không giới hạn',
  'Truy cập thông tin liên hệ chủ nhà',
  'Đặt lịch xem nhà trực tiếp',
  'Xem lịch sử biến động giá khu vực',
  'Truy cập hồ sơ pháp lý đầy đủ',
]

export default function ChiTietBatDongSanPage() {
  const { id } = useParams()
  const [mainImage, setMainImage] = useState(PROPERTY_IMAGES[0])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const isLoggedIn = !!userInfo
  const [savedPropertyIds, setSavedPropertyIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedProperties') || '[]')
    } catch { return [] }
  })
  const isSaved = savedPropertyIds.includes(Number(id))
  const isTenant = userInfo?.role === 'KHACH_THUE'

  useEffect(() => {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored))
      } catch {
        localStorage.removeItem('userInfo')
      }
    }
  }, [])

  const toggleSave = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true)
      return
    }
    const numId = Number(id)
    const updated = isSaved
      ? savedPropertyIds.filter(pid => pid !== numId)
      : [...savedPropertyIds, numId]
    setSavedPropertyIds(updated)
    localStorage.setItem('savedProperties', JSON.stringify(updated))
  }

  const handleLockedAction = (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      setIsAuthModalOpen(true)
    }
  }

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
              {/* Links công cộng - hiển thị cho tất cả */}
              <Link to="/" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <Link to="/bat-dong-san" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                Nhà cho thuê
              </Link>
              {userInfo?.role !== 'KHACH_THUE' && (
                <Link to="/bat-dong-san/dang-ky" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                  Ký gửi nhà
                </Link>
              )}
              <a href="#contact" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                Liên hệ
              </a>

              {/* Links riêng cho khách thuê */}
              {isTenant && (
                <Link to="/tenant/nha-da-luu" className="text-slate-600 font-medium text-sm hover:text-primary transition-colors">
                  Nhà đã lưu
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-slate-600 font-medium text-sm hover:text-primary transition-colors px-4 py-2"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-primary-container hover:bg-primary text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-primary-container/30"
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="text-on-primary text-xs font-medium">
                      {userInfo?.hoTen?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-on-surface">{userInfo?.hoTen || 'User'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/bat-dong-san" className="hover:text-primary transition-colors">Nhà cho thuê</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-800 font-medium truncate">{PROPERTY_DATA.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              {/* Main Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={mainImage.src}
                  alt={PROPERTY_DATA.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${mainImage.locked && !isLoggedIn ? 'blur-sm' : ''}`}
                />
                {mainImage.locked && !isLoggedIn && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-8">
                    <button
                      onClick={handleLockedAction}
                      className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-slate-700 font-medium">Đăng nhập để xem ảnh</span>
                    </button>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[PROPERTY_DATA.status]}`}>
                    {PROPERTY_DATA.statusLabel}
                  </span>
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="p-4 bg-slate-50">
                <div className="grid grid-cols-6 gap-2">
                  {PROPERTY_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => !(img.locked && !isLoggedIn) && setMainImage(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden ${
                        img.locked && !isLoggedIn ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                      }`}
                    >
                      <img
                        src={img.src}
                        alt={`Property ${idx + 1}`}
                        className={`w-full h-full object-cover ${img.locked && !isLoggedIn ? 'blur-sm' : ''}`}
                      />
                      {img.locked && !isLoggedIn && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      )}
                      {idx === mainImage && (
                        <div className="absolute inset-0 border-2 border-primary-container"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">{PROPERTY_DATA.title}</h1>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{PROPERTY_DATA.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-container">{PROPERTY_DATA.price}</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500 uppercase">Diện tích</div>
                  <div className="text-lg font-semibold text-slate-800">{PROPERTY_DATA.area}</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500 uppercase">Phòng ngủ</div>
                  <div className="text-lg font-semibold text-slate-800">{PROPERTY_DATA.bedrooms}</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500 uppercase">Phòng tắm</div>
                  <div className="text-lg font-semibold text-slate-800">{PROPERTY_DATA.bathrooms}</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500 uppercase">Hướng</div>
                  <div className="text-lg font-semibold text-slate-800">{PROPERTY_DATA.direction}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Mô tả bất động sản</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{PROPERTY_DATA.description}</p>
              </div>

              {/* Features */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 uppercase mb-3">Tiện ích nổi bật</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PROPERTY_DATA.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                      <span className="text-xl">{feature.icon}</span>
                      <span className="text-sm text-slate-600">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Furniture & Nearby - Blurred for non-logged users */}
              {!isLoggedIn ? (
                <div className="mt-6 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 blur-sm select-none">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 uppercase mb-3">Nội thất</h3>
                      <p className="text-slate-600">{PROPERTY_DATA.furniture}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 uppercase mb-3">Khu vực xung quanh</h3>
                      <ul className="space-y-2">
                        {PROPERTY_DATA.nearby.map((item, idx) => (
                          <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                            <svg className="w-4 h-4 text-primary-container mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent">
                    <button
                      onClick={handleLockedAction}
                      className="bg-primary-container hover:bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Đăng nhập để xem chi tiết
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase mb-3">Nội thất</h3>
                    <p className="text-slate-600">{PROPERTY_DATA.furniture}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase mb-3">Khu vực xung quanh</h3>
                    <ul className="space-y-2">
                      {PROPERTY_DATA.nearby.map((item, idx) => (
                        <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                          <svg className="w-4 h-4 text-primary-container mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Similar Properties */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Bất động sản tương tự</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SIMILAR_PROPERTIES.map((property) => (
                  <Link
                    key={property.id}
                    to={`/bat-dong-san/${property.id}`}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[property.status]}`}>
                          {property.statusLabel}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-slate-800 text-sm mb-1 line-clamp-1">{property.title}</h3>
                      <div className="text-primary-container font-bold text-sm mb-2">{property.price}</div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{property.area}</span>
                        <span>{property.bedrooms} ngủ</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              {/* Price Card */}
              <div className="text-center mb-6 pb-6 border-b border-slate-200">
                <div className="text-3xl font-bold text-primary-container mb-2">{PROPERTY_DATA.price}</div>
                <div className="text-sm text-slate-500">Giá cho thuê</div>
              </div>

              {/* Property Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Loại nhà</span>
                  <span className="text-sm font-medium text-slate-800">{PROPERTY_DATA.type}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Diện tích</span>
                  <span className="text-sm font-medium text-slate-800">{PROPERTY_DATA.area}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Phòng ngủ</span>
                  <span className="text-sm font-medium text-slate-800">{PROPERTY_DATA.bedrooms} phòng</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Trạng thái</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[PROPERTY_DATA.status]}`}>
                    {PROPERTY_DATA.statusLabel}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={toggleSave}
                className={`w-full font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-red-50 hover:bg-red-100 text-red-500 border border-red-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isSaved ? 'Đã lưu' : 'Lưu nhà'}
              </button>

              {/* CTA Buttons - Locked for non-logged users */}
              {!isLoggedIn ? (
                <div className="space-y-3">
                  <button
                    onClick={handleLockedAction}
                    className="w-full bg-primary-container hover:bg-primary text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary-container/30 hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Đăng nhập để liên hệ
                  </button>
                  <button
                    onClick={handleLockedAction}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Đặt lịch xem nhà
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button className="w-full bg-primary-container hover:bg-primary text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary-container/30 hover:shadow-xl flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Liên hệ ngay
                  </button>
                  <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Đặt lịch xem nhà
                  </button>
                </div>
              )}

              {/* Membership Benefits for non-logged users */}
              {!isLoggedIn && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4 text-center">Đặc quyền thành viên</h3>
                  <ul className="space-y-3">
                    {MEMBERSHIP_FEATURES.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-primary-container mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
                {userInfo?.role !== 'KHACH_THUE' && (
                  <li><Link to="/bat-dong-san/dang-ky" className="text-slate-400 text-sm hover:text-white transition-colors">Ký gửi nhà</Link></li>
                )}
                <li><a href="#contact" className="text-slate-400 text-sm hover:text-white transition-colors">Liên hệ</a></li>

                {/* Links riêng cho khách thuê */}
                {isTenant && (
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => {
          const stored = localStorage.getItem('userInfo')
          if (stored) {
            try {
              setUserInfo(JSON.parse(stored))
            } catch {
              localStorage.removeItem('userInfo')
            }
          }
        }}
      />
    </div>
  )
}
