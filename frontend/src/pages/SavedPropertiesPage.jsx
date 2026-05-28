import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SAVED_PROPERTIES = [
  {
    id: 1,
    title: 'Căn hộ cao cấp view hồ Tây',
    price: '28.000.000 đ/tháng',
    priceRaw: 28000000,
    location: 'Tây Hồ, Hà Nội',
    area: '150 m²',
    areaRaw: 150,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Căn hộ',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    status: 'Con_Trong',
    statusLabel: 'Còn trống',
    savedDate: '2025-01-20',
    furniture: 'Đầy đủ',
    features: ['Hồ bơi', 'Gym', 'Bảo vệ 24/7', 'Thang máy'],
  },
  {
    id: 2,
    title: 'Biệt thự cổ điển Pháp Phố Cổ',
    price: '45.000.000 đ/tháng',
    priceRaw: 45000000,
    location: 'Hoàn Kiếm, Hà Nội',
    area: '320 m²',
    areaRaw: 320,
    bedrooms: 4,
    bathrooms: 5,
    type: 'Biệt thự',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
    status: 'Dat_Lich',
    statusLabel: 'Đã có người đặt lịch',
    savedDate: '2025-01-18',
    furniture: 'Đầy đủ',
    features: ['Sân vườn', 'Garage', 'Thang máy', 'An ninh 24/7'],
  },
  {
    id: 3,
    title: 'Nhà phố thương mại Cầu Giấy',
    price: '22.000.000 đ/tháng',
    priceRaw: 22000000,
    location: 'Cầu Giấy, Hà Nội',
    area: '120 m²',
    areaRaw: 120,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Nhà phố',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    status: 'Sap_Cho_Thue',
    statusLabel: 'Sắp cho thuê',
    savedDate: '2025-01-15',
    furniture: 'Cơ bản',
    features: ['Mặt phố', 'Kinh doanh tốt', 'Giao thông thuận tiện'],
  },
  {
    id: 4,
    title: 'Penthouse sang trọng Ba Đình',
    price: '55.000.000 đ/tháng',
    priceRaw: 55000000,
    location: 'Ba Đình, Hà Nội',
    area: '200 m²',
    areaRaw: 200,
    bedrooms: 3,
    bathrooms: 3,
    type: 'Căn hộ',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    status: 'Con_Trong',
    statusLabel: 'Còn trống',
    savedDate: '2025-01-12',
    furniture: 'Cao cấp',
    features: ['Sân thượng', 'View đẹp', 'Thang máy', 'Bể bơi'],
  },
  {
    id: 5,
    title: 'Studio hiện đại gần ĐH Quốc Gia',
    price: '12.000.000 đ/tháng',
    priceRaw: 12000000,
    location: 'Cầu Giấy, Hà Nội',
    area: '45 m²',
    areaRaw: 45,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Studio',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    status: 'Con_Trong',
    statusLabel: 'Còn trống',
    savedDate: '2025-01-10',
    furniture: 'Đầy đủ',
    features: ['Giờ giấc tự do', 'Không chung chủ', 'Full nội thất'],
  },
  {
    id: 6,
    title: 'Nhà nguyên căn Nam Từ Liêm',
    price: '18.000.000 đ/tháng',
    priceRaw: 18000000,
    location: 'Nam Từ Liêm, Hà Nội',
    area: '85 m²',
    areaRaw: 85,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Nhà nguyên căn',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    status: 'Con_Trong',
    statusLabel: 'Còn trống',
    savedDate: '2025-01-08',
    furniture: 'Không có',
    features: ['Hẻm xe hơi', 'Khu dân cư an ninh', 'Yên tĩnh'],
  },
]

const STATUS_STYLES = {
  Con_Trong: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Dat_Lich: 'bg-amber-100 text-amber-700 border-amber-200',
  Sap_Cho_Thue: 'bg-blue-100 text-blue-700 border-blue-200',
}

const RECOMMENDATIONS = [
  {
    id: 7,
    title: 'Căn hộ Vinhomes Gardenia',
    price: '32.000.000 đ/tháng',
    location: 'Nam Từ Liêm, Hà Nội',
    area: '110 m²',
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    title: 'Biệt thự sân vườn Hà Đông',
    price: '40.000.000 đ/tháng',
    location: 'Hà Đông, Hà Nội',
    area: '250 m²',
    bedrooms: 5,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  },
  {
    id: 9,
    title: 'Căn hộ cao cấp Vinhomes',
    price: '35.000.000 đ/tháng',
    location: 'Thanh Xuân, Hà Nội',
    area: '110 m²',
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
  },
]

export default function SavedPropertiesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedDistricts, setSelectedDistricts] = useState([])
  const [sortBy, setSortBy] = useState('moi-luu')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState([])
  const [savedProperties, setSavedProperties] = useState(SAVED_PROPERTIES)

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleDistrict = (district) => {
    setSelectedDistricts(prev =>
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    )
  }

  const toggleCompare = (id) => {
    if (!compareMode) return
    setSelectedForCompare(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const removeSaved = (id) => {
    setSavedProperties(prev => prev.filter(p => p.id !== id))
    setSelectedForCompare(prev => prev.filter(i => i !== id))
  }

  const filteredProperties = savedProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(property.type)
    const matchesDistrict = selectedDistricts.length === 0 ||
      selectedDistricts.some(d => property.location.includes(d))
    const matchesPrice = !priceRange.min || property.priceRaw >= parseInt(priceRange.min) * 1000000
    const matchesMaxPrice = !priceRange.max || property.priceRaw <= parseInt(priceRange.max) * 1000000
    return matchesSearch && matchesType && matchesDistrict && matchesPrice && matchesMaxPrice
  })

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'gia-thap-cao':
        return a.priceRaw - b.priceRaw
      case 'gia-cao-thap':
        return b.priceRaw - a.priceRaw
      case 'dien-tich':
        return b.areaRaw - a.areaRaw
      case 'moi-luu':
      default:
        return new Date(b.savedDate) - new Date(a.savedDate)
    }
  })

  const selectedCompareData = savedProperties.filter(p => selectedForCompare.includes(p.id))

  const openProperty = (propertyId) => navigate(`/bat-dong-san/${propertyId}`)

  const handleCardKeyDown = (event, propertyId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProperty(propertyId)
    }
  }

  // Empty state
  if (savedProperties.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Bạn chưa lưu bất động sản nào</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Lưu lại những bất động sản bạn quan tâm để dễ dàng theo dõi và so sánh sau này.
            </p>
            <Link
              to="/bat-dong-san"
              className="inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary-container/30 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Khám phá nhà cho thuê
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Nhà đã lưu</h1>
              <p className="text-slate-500">
                Quản lý các bất động sản bạn đang quan tâm
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-container">{savedProperties.length}</div>
                <div className="text-xs text-slate-500 uppercase">Bất động sản</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc khu vực..."
                className="w-full lg:w-auto pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
              />
            </div>

            {/* Compare Mode Toggle */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                compareMode
                  ? 'bg-primary-container text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {compareMode ? 'Thoát so sánh' : 'So sánh'}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
            >
              <option value="moi-luu">Mới lưu nhất</option>
              <option value="gia-thap-cao">Giá: Thấp đến cao</option>
              <option value="gia-cao-thap">Giá: Cao đến thấp</option>
              <option value="dien-tich">Diện tích lớn nhất</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200">
            <span className="text-sm text-slate-500 py-2">Lọc nhanh:</span>
            {['Căn hộ', 'Biệt thự', 'Nhà phố', 'Studio'].map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTypes.includes(type)
                    ? 'bg-primary-container text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
            {['Tây Hồ', 'Cầu Giấy', 'Ba Đình', 'Hoàn Kiếm'].map((district) => (
              <button
                key={district}
                onClick={() => toggleDistrict(district)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedDistricts.includes(district)
                    ? 'bg-primary-container text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {district}
              </button>
            ))}
            {(selectedTypes.length > 0 || selectedDistricts.length > 0 || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedTypes([])
                  setSelectedDistricts([])
                  setSearchTerm('')
                  setPriceRange({ min: '', max: '' })
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Compare Section */}
        {compareMode && selectedCompareData.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">So sánh bất động sản đã chọn ({selectedCompareData.length}/3)</h3>
              <button
                onClick={() => {
                  setCompareMode(false)
                  setSelectedForCompare([])
                }}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Đóng
              </button>
            </div>
            <div className="min-w-[600px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Tiêu chí</th>
                    {selectedCompareData.map((property) => (
                      <th key={property.id} className="text-left py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={property.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <div className="text-sm font-medium text-slate-800 line-clamp-1">{property.title}</div>
                            <div className="text-xs text-primary-container font-semibold">{property.price}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-500">Diện tích</td>
                    {selectedCompareData.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-medium">{p.area}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-500">Phòng ngủ</td>
                    {selectedCompareData.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-medium">{p.bedrooms} phòng</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-500">Loại nhà</td>
                    {selectedCompareData.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-medium">{p.type}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-500">Vị trí</td>
                    {selectedCompareData.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-medium">{p.location}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-500">Nội thất</td>
                    {selectedCompareData.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-medium">{p.furniture}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500">Tiện ích</td>
                    {selectedCompareData.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.features.slice(0, 2).map((f, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">{f}</span>
                          ))}
                          {p.features.length > 2 && (
                            <span className="text-xs text-slate-400">+{p.features.length - 2}</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Property Grid */}
        {sortedProperties.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-slate-500 text-sm">Thử xóa bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <div
                key={property.id}
                role="link"
                tabIndex={0}
                aria-label={`Xem chi tiết ${property.title}`}
                onClick={() => openProperty(property.id)}
                onKeyDown={(event) => handleCardKeyDown(event, property.id)}
                className={`cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all group ${
                  compareMode && selectedForCompare.includes(property.id) ? 'ring-2 ring-primary-container' : ''
                }`}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[property.status]}`}>
                      {property.statusLabel}
                    </span>
                  </div>
                  {compareMode && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleCompare(property.id)
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        selectedForCompare.includes(property.id)
                          ? 'bg-primary-container text-white'
                          : 'bg-white/90 text-slate-400 hover:text-primary-container'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  )}
                  {!compareMode && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        removeSaved(property.id)
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="Bỏ lưu"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-primary-container font-bold text-lg mb-3">
                    {property.price}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="line-clamp-1">{property.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pb-3 border-t border-slate-100 mb-3">
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
                      <span>{property.type}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <Link
                      to={`/tenant/dat-lich-xem?propertyId=${property.id}`}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Đặt lịch
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Có thể bạn sẽ thích</h2>
              <p className="text-slate-500 text-sm mt-1">Gợi ý dựa trên những bất động sản bạn đã lưu</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDATIONS.map((property) => (
              <Link
                key={property.id}
                to={`/bat-dong-san/${property.id}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
    </div>
  )
}
