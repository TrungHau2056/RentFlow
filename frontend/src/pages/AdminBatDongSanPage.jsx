import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const PROPERTIES = [
  {
    id: 1,
    ten: 'Biệt thự Vinhomes Cao cấp',
    loaiNha: 'Biệt thự',
    giaThue: 50000000,
    dienTich: 350,
    soPhong: 5,
    soTang: 3,
    diaChi: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    khuVuc: 'Cầu Giấy',
    chuNha: 'Nguyễn Văn Minh',
    sdtChuNha: '0901 234 567',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'dang_hien_thi',
    trangThaiThue: 'dang_cho_thue',
    hopDong: 'HĐKG-2025-001',
    ngayDangKy: '2025-03-15',
    luotXem: 234,
    khachQuanTam: 12,
    moTa: 'Biệt thự cao cấp với hồ bơi riêng, sân vườn rộng, garage 2 xe. Nội thất nhập khẩu châu Âu. An ninh 24/7.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    ],
    workflowStep: 4,
  },
  {
    id: 2,
    ten: 'Căn hộ Midtown Sài Đồng',
    loaiNha: 'Căn hộ',
    giaThue: 15000000,
    dienTich: 85,
    soPhong: 2,
    soTang: 12,
    diaChi: '29 Liễu Giai, Ba Đình, Hà Nội',
    khuVuc: 'Ba Đình',
    chuNha: 'Trần Thị Hoa',
    sdtChuNha: '0987 654 321',
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    trangThai: 'cho_khao_sat',
    trangThaiThue: 'chua_cho_thue',
    hopDong: null,
    ngayDangKy: '2025-05-25',
    luotXem: 56,
    khachQuanTam: 3,
    moTa: 'Căn hộ 2 phòng ngủ view hồ Tây, đầy đủ nội thất. Gần metro, trường học, bệnh viện.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    ],
    workflowStep: 2,
  },
  {
    id: 3,
    ten: 'Nhà phố cổ khu phố cổ',
    loaiNha: 'Nhà phố',
    giaThue: 25000000,
    dienTich: 120,
    soPhong: 4,
    soTang: 4,
    diaChi: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    khuVuc: 'Hoàn Kiếm',
    chuNha: 'Lê Quốc Bảo',
    sdtChuNha: '0912 345 678',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'da_xac_nhan',
    trangThaiThue: 'dang_cho_thue',
    hopDong: 'HĐKG-2025-005',
    ngayDangKy: '2025-04-20',
    luotXem: 189,
    khachQuanTam: 8,
    moTa: 'Nhà phố kinh doanh mặt tiền Hàng Bài, 4 tầng, thang máy. Phù hợp văn phòng, showroom.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    ],
    workflowStep: 4,
  },
  {
    id: 4,
    ten: 'Biệt thự sân vườn Tây Hồ',
    loaiNha: 'Biệt thự',
    giaThue: 65000000,
    dienTich: 450,
    soPhong: 6,
    soTang: 3,
    diaChi: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    khuVuc: 'Tây Hồ',
    chuNha: 'Phạm Minh Tuấn',
    sdtChuNha: '0903 456 789',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'dang_cho_thue',
    trangThaiThue: 'da_cho_thue',
    hopDong: 'HĐKG-2025-002',
    ngayDangKy: '2025-02-10',
    luotXem: 312,
    khachQuanTam: 15,
    moTa: 'Biệt thự sân vườn 450m², bể bơi riêng, garage 2 xe, an ninh 24/7. Khu vực yên tĩnh gần hồ Tây.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop',
    ],
    workflowStep: 6,
  },
  {
    id: 5,
    ten: 'Căn hộ Studio Times City',
    loaiNha: 'Căn hộ',
    giaThue: 8000000,
    dienTich: 35,
    soPhong: 1,
    soTang: 18,
    diaChi: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    khuVuc: 'Hai Bà Trưng',
    chuNha: 'Nguyễn Thị Lan',
    sdtChuNha: '0965 432 109',
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    trangThai: 'dang_hien_thi',
    trangThaiThue: 'chua_cho_thue',
    hopDong: 'HĐKG-2025-006',
    ngayDangKy: '2025-05-01',
    luotXem: 145,
    khachQuanTam: 6,
    moTa: 'Studio đầy đủ nội thất, view thành phố. Gần Vincom, trường học, bệnh viện. Phù hợp người ở đơn.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    ],
    workflowStep: 4,
  },
  {
    id: 6,
    ten: 'Nhà mặt phố Đống Đa',
    loaiNha: 'Nhà phố',
    giaThue: 22000000,
    dienTich: 95,
    soPhong: 3,
    soTang: 5,
    diaChi: '88 Láng Hạ, Đống Đa, Hà Nội',
    khuVuc: 'Đống Đa',
    chuNha: 'Đỗ Văn Kiên',
    sdtChuNha: '0978 111 222',
    moiGioi: 'Phạm Minh Tuấn',
    sdtMoiGioi: '0903 456 789',
    trangThai: 'cho_ky_hop_dong',
    trangThaiThue: 'chua_cho_thue',
    hopDong: null,
    ngayDangKy: '2025-05-18',
    luotXem: 78,
    khachQuanTam: 4,
    moTa: 'Nhà mặt tiền Láng Hạ, 5 tầng có thang máy, chỗ để xe 2 ô tô. Phù hợp văn phòng công ty.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    ],
    workflowStep: 3,
  },
  {
    id: 7,
    ten: 'Văn phòng hạng B Cầu Giấy',
    loaiNha: 'Văn phòng',
    giaThue: 35000000,
    dienTich: 200,
    soPhong: 8,
    soTang: 10,
    diaChi: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    khuVuc: 'Cầu Giấy',
    chuNha: 'Công ty CP Đầu tư ABC',
    sdtChuNha: '024-1234-5678',
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    trangThai: 'cho_tiep_nhan',
    trangThaiThue: 'chua_cho_thue',
    hopDong: null,
    ngayDangKy: '2025-05-29',
    luotXem: 12,
    khachQuanTam: 0,
    moTa: 'Văn phòng hạng B, 200m², tầng 10 view thành phố. Nội thất cơ bản, điều hòa trung tâm.',
    hinhAnh: [],
    workflowStep: 1,
  },
  {
    id: 8,
    ten: 'Kiot mặt đường Kim Mã',
    loaiNha: 'Kiot',
    giaThue: 12000000,
    dienTich: 25,
    soPhong: 1,
    soTang: 1,
    diaChi: '142 Kim Mã, Ba Đình, Hà Nội',
    khuVuc: 'Ba Đình',
    chuNha: 'Vũ Thị Mai',
    sdtChuNha: '0988 777 666',
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    trangThai: 'cho_khao_sat',
    trangThaiThue: 'chua_cho_thue',
    hopDong: null,
    ngayDangKy: '2025-05-28',
    luotXem: 34,
    khachQuanTam: 2,
    moTa: 'Kiot mặt đường Kim Mã, lưu lượng người qua lại đông. Phù hợp kinh doanh nhỏ, cafe, tiện lợi.',
    hinhAnh: [],
    workflowStep: 2,
  },
  {
    id: 9,
    ten: 'Căn hộ 3PN The Manor',
    loaiNha: 'Căn hộ',
    giaThue: 28000000,
    dienTich: 130,
    soPhong: 3,
    soTang: 8,
    diaChi: 'The Manor, Mai Dich, Cầu Giấy, Hà Nội',
    khuVuc: 'Cầu Giấy',
    chuNha: 'Hoàng Đức Thắng',
    sdtChuNha: '0911 222 333',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'dang_hien_thi',
    trangThaiThue: 'dang_cho_thue',
    hopDong: 'HĐKG-2025-008',
    ngayDangKy: '2025-04-05',
    luotXem: 198,
    khachQuanTam: 9,
    moTa: 'Căn hộ 3PN cao cấp The Manor, nội thất đầy đủ, view hồ, ban công rộng. Khu đô thị an ninh.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    ],
    workflowStep: 5,
  },
  {
    id: 10,
    ten: 'Shophouse Sun Grand City',
    loaiNha: 'Shophouse',
    giaThue: 45000000,
    dienTich: 180,
    soPhong: 4,
    soTang: 4,
    diaChi: 'Sun Grand City, Thụy Khuê, Tây Hồ, Hà Nội',
    khuVuc: 'Tây Hồ',
    chuNha: 'Phạm Hữu Đức',
    sdtChuNha: '0904 555 666',
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    trangThai: 'da_ket_thuc',
    trangThaiThue: 'chua_cho_thue',
    hopDong: 'HĐKG-2024-015',
    ngayDangKy: '2024-06-01',
    luotXem: 267,
    khachQuanTam: 11,
    moTa: 'Shophouse 4 tầng mặt tiền Thụy Khuê, phù hợp kinh doanh và ở. View hồ Tây, khu đô thị cao cấp.',
    hinhAnh: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    ],
    workflowStep: 6,
  },
]

const STATUS_CONFIG = {
  cho_tiep_nhan: { label: 'Chờ tiếp nhận', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  cho_khao_sat: { label: 'Chờ khảo sát', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky_hop_dong: { label: 'Chờ ký HĐ', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  da_xac_nhan: { label: 'Đã xác nhận', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400' },
  dang_hien_thi: { label: 'Đang hiển thị', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  dang_cho_thue: { label: 'Đang cho thuê', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
}

const THUE_STATUS = {
  chua_cho_thue: { label: 'Chưa cho thuê', color: 'text-slate-400' },
  dang_cho_thue: { label: 'Đang cho thuê', color: 'text-emerald-600' },
}

const WORKFLOW_STEPS = [
  { key: 'tiep_nhan', label: 'Tiếp nhận' },
  { key: 'khao_sat', label: 'Khảo sát' },
  { key: 'ky_hop_dong', label: 'Ký HĐ' },
  { key: 'hien_thi', label: 'Hiển thị' },
  { key: 'khach_quan_tam', label: 'Có khách' },
  { key: 'da_cho_thue', label: 'Cho thuê' },
]

const LOAI_NHA_OPTIONS = ['Tất cả', 'Biệt thự', 'Căn hộ', 'Nhà phố', 'Văn phòng', 'Kiot', 'Shophouse']
const KHUVUC_OPTIONS = ['Tất cả', 'Cầu Giấy', 'Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Đống Đa', 'Hai Bà Trưng']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'price_desc', label: 'Giá cao nhất' },
  { key: 'price_asc', label: 'Giá thấp nhất' },
  { key: 'views', label: 'Lượt xem nhiều nhất' },
  { key: 'interest', label: 'Quan tâm nhiều nhất' },
]

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

function PropertyRow({ property, isSelected, onSelect }) {
  const status = STATUS_CONFIG[property.trangThai]
  const thueStatus = THUE_STATUS[property.trangThaiThue]
  return (
    <tr
      onClick={() => onSelect(property.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0">
            {property.hinhAnh.length > 0 ? (
              <img src={property.hinhAnh[0]} alt={property.ten} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{property.ten}</p>
            <p className="text-xs text-slate-400 truncate">{property.diaChi}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">{property.loaiNha}</span>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{formatVND(property.giaThue)}đ</p>
        <p className="text-xs text-slate-400">/tháng</p>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">{property.dienTich}m²</td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{property.chuNha}</p>
        <p className="text-xs text-slate-400">{property.sdtChuNha}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{property.moiGioi}</p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        <p className={`text-xs mt-1 ${thueStatus.color}`}>{thueStatus.label}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1" title="Lượt xem">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {property.luotXem}
          </span>
          <span className="flex items-center gap-1" title="Khách quan tâm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {property.khachQuanTam}
          </span>
        </div>
      </td>
    </tr>
  )
}

function PropertyDetail({ property, onClose }) {
  if (!property) return null
  const status = STATUS_CONFIG[property.trangThai]
  const thueStatus = THUE_STATUS[property.trangThaiThue]
  const tyLeThue = property.trangThaiThue === 'da_cho_thue' ? '100%' : property.khachQuanTam > 0 ? `${Math.min(Math.round(property.khachQuanTam / property.luotXem * 100), 100)}%` : '0%'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">{property.loaiNha} · {property.khuVuc}</p>
            <h3 className="text-white font-bold text-lg">{property.ten}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
          <span className={`text-xs font-medium ${thueStatus.color} bg-white/10 px-2 py-1 rounded-md`}>
            {thueStatus.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Gallery */}
        {property.hinhAnh.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Hình ảnh</h4>
            <div className="grid grid-cols-2 gap-2">
              {property.hinhAnh.map((img, i) => (
                <img key={i} src={img} alt={`${property.ten} ${i + 1}`} className="w-full h-28 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin cơ bản</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Giá thuê</p>
              <p className="text-sm font-bold text-slate-800">{formatVND(property.giaThue)}đ/tháng</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Diện tích</p>
              <p className="text-sm font-bold text-slate-800">{property.dienTich}m²</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Số phòng</p>
              <p className="text-sm font-bold text-slate-800">{property.soPhong} phòng</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Số tầng</p>
              <p className="text-sm font-bold text-slate-800">{property.soTang} tầng</p>
            </div>
          </div>
        </div>

        {/* Address */}
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

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Mô tả</h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3">{property.moTa}</p>
        </div>

        {/* Owner & Broker */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin liên quan</h4>
          <div className="space-y-2">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Chủ nhà</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{property.chuNha}</p>
                  <p className="text-xs text-slate-500">{property.sdtChuNha}</p>
                </div>
                <a href={`tel:${property.sdtChuNha.replace(/\s/g, '')}`} className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Môi giới phụ trách</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{property.moiGioi}</p>
                  <p className="text-xs text-slate-500">{property.sdtMoiGioi}</p>
                </div>
                <a href={`tel:${property.sdtMoiGioi.replace(/\s/g, '')}`} className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contract */}
        {property.hopDong && (
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Hợp đồng liên quan</p>
            <Link to={`/admin/hop-dong-ky-gui/${property.hopDong}`} className="text-sm text-emerald-800 font-medium hover:text-emerald-700 flex items-center gap-1">
              {property.hopDong}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-xs text-slate-500 mt-1">Ngày đăng ký: {formatDate(property.ngayDangKy)}</p>
          </div>
        )}

        {/* Workflow */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tiến trình xử lý</h4>
          <WorkflowTimeline currentStep={property.workflowStep} />
        </div>

        {/* Analytics */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thống kê</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-600">{property.luotXem}</p>
              <p className="text-[10px] text-slate-500">Lượt xem</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-amber-600">{property.khachQuanTam}</p>
              <p className="text-[10px] text-slate-500">Quan tâm</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-emerald-600">{tyLeThue}</p>
              <p className="text-[10px] text-slate-500">Tỷ lệ thuê</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thao tác</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6a2 2 0 11-4 0 2 2 0 014 0zM4 6a2 2 0 114 0 2 2 0 01-4 0z" />
              </svg>
              Phân công MG
            </button>
            <button className="py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Lịch khảo sát
            </button>
            {property.hopDong && (
              <Link to={`/admin/hop-dong-ky-gui/${property.hopDong}`} className="py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xem HĐ
              </Link>
            )}
            <button className="py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Cập nhật
            </button>
          </div>
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
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm bất động sản
        </button>
      </div>
    </div>
  )
}

export default function AdminBatDongSanPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLoai, setFilterLoai] = useState('Tất cả')
  const [filterKhuVuc, setFilterKhuVuc] = useState('Tất cả')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...PROPERTIES]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.ten.toLowerCase().includes(q) ||
        p.diaChi.toLowerCase().includes(q) ||
        p.chuNha.toLowerCase().includes(q) ||
        p.moiGioi.toLowerCase().includes(q)
      )
    }
    if (filterLoai !== 'Tất cả') result = result.filter(p => p.loaiNha === filterLoai)
    if (filterKhuVuc !== 'Tất cả') result = result.filter(p => p.khuVuc === filterKhuVuc)
    if (filterTrangThai !== 'all') result = result.filter(p => p.trangThai === filterTrangThai)

    switch (sortBy) {
      case 'price_desc': result.sort((a, b) => b.giaThue - a.giaThue); break
      case 'price_asc': result.sort((a, b) => a.giaThue - b.giaThue); break
      case 'views': result.sort((a, b) => b.luotXem - a.luotXem); break
      case 'interest': result.sort((a, b) => b.khachQuanTam - a.khachQuanTam); break
      default: result.sort((a, b) => new Date(b.ngayDangKy) - new Date(a.ngayDangKy))
    }
    return result
  }, [searchQuery, filterLoai, filterKhuVuc, filterTrangThai, sortBy])

  const kpiData = useMemo(() => ({
    total: PROPERTIES.length,
    dangHienThi: PROPERTIES.filter(p => p.trangThai === 'dang_hien_thi').length,
    dangChoThue: PROPERTIES.filter(p => p.trangThaiThue === 'da_cho_thue').length,
    choKhaoSat: PROPERTIES.filter(p => p.trangThai === 'cho_khao_sat').length,
    choKyHD: PROPERTIES.filter(p => p.trangThai === 'cho_ky_hop_dong').length,
  }), [])

  const selectedProperty = selectedId ? PROPERTIES.find(p => p.id === selectedId) : null

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý bất động sản</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi và quản lý toàn bộ bất động sản ký gửi</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm bất động sản
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
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
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          label="Đang hiển thị"
          value={kpiData.dangHienThi}
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
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          label="Chờ khảo sát"
          value={kpiData.choKhaoSat}
          color="text-amber-600"
          bgColor="bg-amber-50"
          sparkData={[1, 2, 1, 3, 2, 4, 3]}
          sparkColor="#d97706"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          label="Chờ ký HĐ"
          value={kpiData.choKyHD}
          color="text-purple-600"
          bgColor="bg-purple-50"
          sparkData={[0, 1, 1, 2, 1, 2, 1]}
          sparkColor="#7c3aed"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm BĐS, chủ nhà, môi giới..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

          {/* Filter: Loại nhà */}
          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {LOAI_NHA_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

          {/* Filter: Khu vực */}
          <select
            value={filterKhuVuc}
            onChange={(e) => setFilterKhuVuc(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {KHUVUC_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

          {/* Filter: Trạng thái */}
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

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          {/* Table */}
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
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Môi giới</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thống kê</th>
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
                <span>Hiển thị {filtered.length} / {PROPERTIES.length} bất động sản</span>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
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