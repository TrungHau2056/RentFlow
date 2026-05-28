import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const PROPERTIES = [
  {
    id: 1,
    title: 'Biệt thự Vinhomes Cao cấp',
    type: 'Biệt thự',
    price: 45,
    area: 320,
    bedrooms: 4,
    bathrooms: 5,
    district: 'Cầu Giấy',
    address: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    ngayKyGui: '2024-12-15',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
    status: 'dang_hien_thi',
    views: 1247,
    description: 'Biệt thự cao cấp với thiết kế hiện đại, sân vườn rộng, hồ bơi riêng. Khu an ninh 24/7, gần trường học và bệnh viện.',
    tienIch: ['Bể bơi', 'Gym', 'Sân vườn', 'Garage', 'An ninh 24/7'],
    workflowStep: 4,
  },
  {
    id: 2,
    title: 'Căn hộ Midtown Sài Đồng',
    type: 'Căn hộ',
    price: 15,
    area: 95,
    bedrooms: 2,
    bathrooms: 2,
    district: 'Ba Đình',
    address: '29 Liễu Giai, Ba Đình, Hà Nội',
    ngayKyGui: '2025-01-08',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    status: 'cho_khao_sat',
    views: 0,
    description: 'Căn hộ 2 phòng ngủ view hồ, nội thất đầy đủ, tầng trung. Gần Lotte Center.',
    tienIch: ['Nội thất', 'Thang máy', 'Chỗ để xe'],
    workflowStep: 2,
  },
  {
    id: 3,
    title: 'Nhà phố cổ khu phố cổ',
    type: 'Nhà phố',
    price: 28,
    area: 65,
    bedrooms: 3,
    bathrooms: 2,
    district: 'Hoàn Kiếm',
    address: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    ngayKyGui: '2025-01-20',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    status: 'cho_ky_hop_dong',
    views: 523,
    description: 'Nhà phố vị trí đắc địa, kinh doanh sầm uất. Mặt tiền rộng, phù hợp vừa ở vừa kinh doanh.',
    tienIch: ['Mặt tiền', 'Chỗ để xe', 'An ninh'],
    workflowStep: 3,
  },
  {
    id: 4,
    title: 'Biệt thự sân vườn Tây Hồ',
    type: 'Biệt thự',
    price: 65,
    area: 450,
    bedrooms: 5,
    bathrooms: 4,
    district: 'Tây Hồ',
    address: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    ngayKyGui: '2024-11-05',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    status: 'da_cho_thue',
    views: 3210,
    description: 'Biệt thự sân vườn rộng 450m², khu vực yên tĩnh, gần hồ Tây. Đã cho thuê dài hạn.',
    tienIch: ['Sân vườn', 'Garage 2 xe', 'An ninh 24/7', 'Bể bơi'],
    workflowStep: 5,
  },
  {
    id: 5,
    title: 'Căn hộ Studio Times City',
    type: 'Căn hộ',
    price: 8.5,
    area: 42,
    bedrooms: 1,
    bathrooms: 1,
    district: 'Hai Bà Trưng',
    address: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    ngayKyGui: '2025-02-01',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    status: 'cho_tiep_nhan',
    views: 0,
    description: 'Căn hộ studio nội thất cao cấp, tòa nhà đầy đủ tiện ích. Phù hợp người độc thân hoặc cặp vợ chồng trẻ.',
    tienIch: ['Nội thất', 'Gym', 'Hồ bơi', 'Chỗ để xe'],
    workflowStep: 1,
  },
  {
    id: 6,
    title: 'Nhà mặt phố Đống Đa',
    type: 'Nhà riêng',
    price: 22,
    area: 85,
    bedrooms: 3,
    bathrooms: 2,
    district: 'Đống Đa',
    address: '88 Láng Hạ, Đống Đa, Hà Nội',
    ngayKyGui: '2024-10-20',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    status: 'dang_hien_thi',
    views: 876,
    description: 'Nhà mặt phố rộng, phù hợp làm văn phòng hoặc chỗ ở. Gần ga метро, giao thông thuận tiện.',
    tienIch: ['Mặt tiền', 'Chỗ để xe', 'An ninh'],
    workflowStep: 4,
  },
  {
    id: 7,
    title: 'Penthouse Keangnam',
    type: 'Căn hộ',
    price: 55,
    area: 180,
    bedrooms: 3,
    bathrooms: 3,
    district: 'Cầu Giấy',
    address: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    ngayKyGui: '2024-09-12',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    status: 'da_cho_thue',
    views: 2150,
    description: 'Penthouse hạng sang tầng cao nhất, view toàn cảnh thành phố. Nội thất nhập khẩu Ý.',
    tienIch: ['Nội thất', 'Gym', 'Bể bơi', 'Sauna', 'An ninh 24/7'],
    workflowStep: 5,
  },
  {
    id: 8,
    title: 'Kiot mặt đường Kim Mã',
    type: 'Kiot',
    price: 18,
    area: 35,
    bedrooms: 0,
    bathrooms: 1,
    district: 'Ba Đình',
    address: '142 Kim Mã, Ba Đình, Hà Nội',
    ngayKyGui: '2025-01-28',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    status: 'cho_khao_sat',
    views: 0,
    description: 'Kiot mặt đường lớn, vỉa hè rộng, phù hợp kinh doanh đa dạng ngành hàng. Lưu lượng người qua lại đông.',
    tienIch: ['Mặt tiền', 'Vỉa hè', 'Chỗ để xe'],
    workflowStep: 2,
  },
]

const STATUS_CONFIG = {
  cho_tiep_nhan: { label: 'Chờ tiếp nhận', color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  cho_khao_sat: { label: 'Chờ khảo sát', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky_hop_dong: { label: 'Chờ ký hợp đồng', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  dang_hien_thi: { label: 'Đang hiển thị', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400' },
  da_cho_thue: { label: 'Đã cho thuê', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  cham_dut: { label: 'Chấm dứt', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

const WORKFLOW_STEPS = [
  { key: 'cho_tiep_nhan', label: 'Tiếp nhận' },
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
  { value: 'Kiot', label: 'Kiot' },
  { value: 'Phòng trọ', label: 'Phòng trọ' },
]

const DISTRICTS = [
  { value: 'all', label: 'Tất cả khu vực' },
  { value: 'Cầu Giấy', label: 'Cầu Giấy' },
  { value: 'Tây Hồ', label: 'Tây Hồ' },
  { value: 'Ba Đình', label: 'Ba Đình' },
  { value: 'Hoàn Kiếm', label: 'Hoàn Kiếm' },
  { value: 'Hai Bà Trưng', label: 'Hai Bà Trưng' },
  { value: 'Đống Đa', label: 'Đống Đa' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_high', label: 'Giá cao nhất' },
  { value: 'price_low', label: 'Giá thấp nhất' },
  { value: 'area_high', label: 'Diện tích lớn nhất' },
  { value: 'views', label: 'Xem nhiều nhất' },
]

function KPICard({ icon, label, value, color, bgColor, trend }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-3xl font-bold text-on-surface">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${trend > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {trend > 0 ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : null}
              {trend > 0 ? `+${trend}%` : '—'} so với tháng trước
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
  const ngayKyGui = new Date(property.ngayKyGui)
  const ngayHienThi = ngayKyGui.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

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
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
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
          <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{property.district}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price & Stats */}
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
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {ngayHienThi}
          </span>
        </div>

        {/* Mini Workflow */}
        <MiniWorkflow currentStep={property.workflowStep} />

        {/* Secondary workflow actions; the card itself opens its details. */}
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
  const ngayKyGui = new Date(property.ngayKyGui).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      <div className="relative">
        <img src={property.image} alt={property.title} className="w-full h-56 object-cover" />
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

        <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-3">{property.description}</p>

        {/* Amenities */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiện ích</p>
          <div className="flex flex-wrap gap-1.5">
            {property.tienIch.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">{t}</span>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiến độ xử lý</p>
          <MiniWorkflow currentStep={property.workflowStep} />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant mb-4">
          <span>Ngày ký gửi: {ngayKyGui}</span>
          {property.views > 0 && <span>{property.views.toLocaleString('vi-VN')} lượt xem</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/dashboard/bat-dong-san/${property.id}`}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors"
          >
            Xem chi tiết
          </Link>
          <button className="py-2.5 px-4 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDistrict, setFilterDistrict] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...PROPERTIES]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      )
    }
    if (filterType !== 'all') result = result.filter(p => p.type === filterType)
    if (filterDistrict !== 'all') result = result.filter(p => p.district === filterDistrict)
    if (filterStatus !== 'all') result = result.filter(p => p.status === filterStatus)

    switch (sortBy) {
      case 'newest': result.sort((a, b) => new Date(b.ngayKyGui) - new Date(a.ngayKyGui)); break
      case 'price_high': result.sort((a, b) => b.price - a.price); break
      case 'price_low': result.sort((a, b) => a.price - b.price); break
      case 'area_high': result.sort((a, b) => b.area - a.area); break
      case 'views': result.sort((a, b) => b.views - a.views); break
    }

    return result
  }, [searchQuery, filterType, filterDistrict, filterStatus, sortBy])

  const kpiData = useMemo(() => ({
    total: PROPERTIES.length,
    processing: PROPERTIES.filter(p => ['cho_tiep_nhan', 'cho_khao_sat', 'cho_ky_hop_dong'].includes(p.status)).length,
    displaying: PROPERTIES.filter(p => p.status === 'dang_hien_thi').length,
    rented: PROPERTIES.filter(p => p.status === 'da_cho_thue').length,
  }), [])

  const selectedProperty = selectedId ? PROPERTIES.find(p => p.id === selectedId) : null

  return (
    <div className="max-w-400 mx-auto">
      {/* Page Header */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          label="Tổng nhà ký gửi"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          trend={12}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đang xử lý"
          value={kpiData.processing}
          color="text-amber-600"
          bgColor="bg-amber-50"
          trend={0}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          label="Đang hiển thị"
          value={kpiData.displaying}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          trend={8}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đã cho thuê"
          value={kpiData.rented}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          trend={25}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-outline-variant p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
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

          {/* Filters */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-sm text-on-surface focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-sm text-on-surface focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {DISTRICTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
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

          {/* View Toggle */}
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

        {/* Active filters & count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-on-surface-variant">
            Hiển thị <span className="font-semibold text-on-surface">{filtered.length}</span> bất động sản
          </p>
          {(filterType !== 'all' || filterDistrict !== 'all' || filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => { setFilterType('all'); setFilterDistrict('all'); setFilterStatus('all'); setSearchQuery(''); }}
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

      {/* Content Area */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          {/* Property Grid / List */}
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
                  const ngayKyGui = new Date(property.ngayKyGui).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  return (
                    <div
                      key={property.id}
                      onClick={() => setSelectedId(property.id)}
                      className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all cursor-pointer flex ${
                        selectedId === property.id ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
                      }`}
                    >
                      <div className="w-48 h-36 shrink-0 overflow-hidden">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
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
                            <span>{ngayKyGui}</span>
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

          {/* Quick Preview Panel */}
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
