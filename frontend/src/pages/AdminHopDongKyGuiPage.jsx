import { useState, useMemo } from 'react'

const CONTRACTS = [
  {
    id: 1,
    ma: 'HĐKG-2025-001',
    chuNha: 'Nguyễn Văn Minh',
    sdtChuNha: '0901 234 567',
    emailChuNha: 'nguyenvanminh@email.com',
    batDongSan: 'Biệt thự Vinhomes Cao cấp',
    diaChiBDS: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    loaiBDS: 'Biệt thự',
    giaThue: 50000000,
    ngayKy: '2025-03-15',
    thoiHan: 12,
    ngayHetHan: '2026-03-15',
    tienDamBao: 100000000,
    trangThai: 'dang_hieu_luc',
    trangThaiPhapLy: 'da_duyet',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    dieuKhoanPhatSinh: [
      { noiDung: 'Gia hạn thêm 6 tháng nếu cả hai bên đồng ý', trangThai: 'da_duyet', ghiChu: 'Đã được pháp luật duyệt' },
      { noiDung: 'Điều chỉnh giá thuê tăng 5% sau tháng thứ 6', trangThai: 'cho_duyet', ghiChu: 'Chờ xác nhận từ chủ nhà' },
    ],
    workflowStep: 5,
    lichSu: [
      { ngay: '2025-03-10', noiDung: 'Tạo hợp đồng', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2025-03-12', noiDung: 'Chỉnh sửa điều khoản 3.2', nguoi: 'Lê Quốc Anh', loai: 'edit' },
      { ngay: '2025-03-13', noiDung: 'Pháp luật duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
      { ngay: '2025-03-15', noiDung: 'Chủ nhà ký kết', nguoi: 'Nguyễn Văn Minh', loai: 'sign' },
      { ngay: '2025-03-15', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
    ],
  },
  {
    id: 2,
    ma: 'HĐKG-2025-002',
    chuNha: 'Phạm Minh Tuấn',
    sdtChuNha: '0903 456 789',
    emailChuNha: 'phamminhtuan@email.com',
    batDongSan: 'Biệt thự sân vườn Tây Hồ',
    diaChiBDS: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    loaiBDS: 'Biệt thự',
    giaThue: 65000000,
    ngayKy: '2025-02-10',
    thoiHan: 24,
    ngayHetHan: '2027-02-10',
    tienDamBao: 195000000,
    trangThai: 'dang_hieu_luc',
    trangThaiPhapLy: 'da_duyet',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    dieuKhoanPhatSinh: [],
    workflowStep: 5,
    lichSu: [
      { ngay: '2025-02-05', noiDung: 'Tạo hợp đồng', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-02-07', noiDung: 'Pháp luật duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
      { ngay: '2025-02-10', noiDung: 'Ký kết thành công', nguoi: 'Phạm Minh Tuấn', loai: 'sign' },
    ],
  },
  {
    id: 3,
    ma: 'HĐKG-2025-003',
    chuNha: 'Trần Thị Hoa',
    sdtChuNha: '0987 654 321',
    emailChuNha: 'tranthihoa@email.com',
    batDongSan: 'Căn hộ Midtown Sài Đồng',
    diaChiBDS: '29 Liễu Giai, Ba Đình, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaThue: 15000000,
    ngayKy: null,
    thoiHan: 12,
    ngayHetHan: null,
    tienDamBao: 30000000,
    trangThai: 'cho_duyet',
    trangThaiPhapLy: 'cho_phap_luat',
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    dieuKhoanPhatSinh: [],
    workflowStep: 1,
    lichSu: [
      { ngay: '2025-05-25', noiDung: 'Tạo hợp đồng', nguoi: 'Lê Quốc Anh', loai: 'create' },
    ],
  },
  {
    id: 4,
    ma: 'HĐKG-2025-004',
    chuNha: 'Lê Quốc Bảo',
    sdtChuNha: '0912 345 678',
    emailChuNha: 'lequocbao@email.com',
    batDongSan: 'Nhà phố cổ khu phố cổ',
    diaChiBDS: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    loaiBDS: 'Nhà phố',
    giaThue: 25000000,
    ngayKy: null,
    thoiHan: 12,
    ngayHetHan: null,
    tienDamBao: 50000000,
    trangThai: 'cho_ky',
    trangThaiPhapLy: 'da_duyet',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    dieuKhoanPhatSinh: [
      { noiDung: 'Cho phép kinh doanh thương mại tại tầng 1', trangThai: 'da_duyet', ghiChu: 'Phù hợp quy định' },
    ],
    workflowStep: 4,
    lichSu: [
      { ngay: '2025-04-18', noiDung: 'Tạo hợp đồng', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-04-19', noiDung: 'Pháp luật duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
      { ngay: '2025-04-20', noiDung: 'Gửi cho chủ nhà ký', nguoi: 'Trần Văn Hùng', loai: 'send' },
    ],
  },
  {
    id: 5,
    ma: 'HĐKG-2025-005',
    chuNha: 'Đỗ Văn Kiên',
    sdtChuNha: '0978 111 222',
    emailChuNha: 'dovankien@email.com',
    batDongSan: 'Nhà mặt phố Đống Đa',
    diaChiBDS: '88 Láng Hạ, Đống Đa, Hà Nội',
    loaiBDS: 'Nhà phố',
    giaThue: 22000000,
    ngayKy: null,
    thoiHan: 12,
    ngayHetHan: null,
    tienDamBao: 44000000,
    trangThai: 'cho_duyet',
    trangThaiPhapLy: 'can_sua',
    moiGioi: 'Phạm Minh Tuấn',
    sdtMoiGioi: '0903 456 789',
    dieuKhoanPhatSinh: [
      { noiDung: 'Quy định sử dụng thang máy chung', trangThai: 'cho_duyet', ghiChu: 'Cần bổ sung điều khoản bảo trì' },
    ],
    workflowStep: 2,
    lichSu: [
      { ngay: '2025-05-18', noiDung: 'Tạo hợp đồng', nguoi: 'Phạm Minh Tuấn', loai: 'create' },
      { ngay: '2025-05-19', noiDung: 'Pháp luật yêu cầu sửa đổi điều 4.1', nguoi: 'Phạm Thị Hương', loai: 'edit' },
    ],
  },
  {
    id: 6,
    ma: 'HĐKG-2025-006',
    chuNha: 'Nguyễn Thị Lan',
    sdtChuNha: '0965 432 109',
    emailChuNha: 'nguyenthilan@email.com',
    batDongSan: 'Căn hộ Studio Times City',
    diaChiBDS: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaThue: 8000000,
    ngayKy: '2025-05-01',
    thoiHan: 6,
    ngayHetHan: '2025-11-01',
    tienDamBao: 16000000,
    trangThai: 'sap_het_han',
    trangThaiPhapLy: 'da_duyet',
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    dieuKhoanPhatSinh: [],
    workflowStep: 5,
    lichSu: [
      { ngay: '2025-04-28', noiDung: 'Tạo hợp đồng', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2025-04-29', noiDung: 'Pháp luật duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
      { ngay: '2025-05-01', noiDung: 'Ký kết', nguoi: 'Nguyễn Thị Lan', loai: 'sign' },
    ],
  },
  {
    id: 7,
    ma: 'HĐKG-2024-015',
    chuNha: 'Phạm Hữu Đức',
    sdtChuNha: '0904 555 666',
    emailChuNha: 'phamhuuduc@email.com',
    batDongSan: 'Shophouse Sun Grand City',
    diaChiBDS: 'Sun Grand City, Thụy Khuê, Tây Hồ, Hà Nội',
    loaiBDS: 'Shophouse',
    giaThue: 45000000,
    ngayKy: '2024-06-01',
    thoiHan: 12,
    ngayHetHan: '2025-06-01',
    tienDamBao: 90000000,
    trangThai: 'da_ket_thuc',
    trangThaiPhapLy: 'da_duyet',
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    dieuKhoanPhatSinh: [],
    workflowStep: 5,
    lichSu: [
      { ngay: '2024-05-25', noiDung: 'Tạo hợp đồng', nguoi: 'Nguyễn Thị Lan', loai: 'create' },
      { ngay: '2024-05-27', noiDung: 'Pháp luật duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
      { ngay: '2024-06-01', noiDung: 'Ký kết', nguoi: 'Phạm Hữu Đức', loai: 'sign' },
      { ngay: '2025-06-01', noiDung: 'Hợp đồng hết hạn', nguoi: 'Hệ thống', loai: 'expire' },
    ],
  },
  {
    id: 8,
    ma: 'HĐKG-2025-007',
    chuNha: 'Hoàng Đức Thắng',
    sdtChuNha: '0911 222 333',
    emailChuNha: 'hoangducthang@email.com',
    batDongSan: 'Căn hộ 3PN The Manor',
    diaChiBDS: 'The Manor, Mai Dich, Cầu Giấy, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaThue: 28000000,
    ngayKy: '2025-04-05',
    thoiHan: 12,
    ngayHetHan: '2026-04-05',
    tienDamBao: 56000000,
    trangThai: 'tam_ngung',
    trangThaiPhapLy: 'da_duyet',
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    dieuKhoanPhatSinh: [
      { noiDung: 'Tạm ngưng do tranh chấp nội thất', trangThai: 'da_duyet', ghiChu: 'Chờ giải quyết tranh chấp giữa chủ nhà và khách thuê' },
    ],
    workflowStep: 5,
    lichSu: [
      { ngay: '2025-04-01', noiDung: 'Tạo hợp đồng', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-04-03', noiDung: 'Pháp luật duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
      { ngay: '2025-04-05', noiDung: 'Ký kết', nguoi: 'Hoàng Đức Thắng', loai: 'sign' },
      { ngay: '2025-05-10', noiDung: 'Tạm ngưng hợp đồng', nguoi: 'Phạm Thị Hương', loai: 'suspend' },
    ],
  },
  {
    id: 9,
    ma: 'HĐKG-2025-008',
    chuNha: 'Công ty CP Đầu tư ABC',
    sdtChuNha: '024-1234-5678',
    emailChuNha: 'info@abccorp.vn',
    batDongSan: 'Văn phòng hạng B Cầu Giấy',
    diaChiBDS: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    loaiBDS: 'Văn phòng',
    giaThue: 35000000,
    ngayKy: null,
    thoiHan: 24,
    ngayHetHan: null,
    tienDamBao: 105000000,
    trangThai: 'cho_duyet',
    trangThaiPhapLy: 'tu_choi',
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    dieuKhoanPhatSinh: [
      { noiDung: 'Điều khoản bồi thường không rõ ràng', trangThai: 'tu_choi', ghiChu: 'Cần sửa lại theo mẫu chuẩn' },
    ],
    workflowStep: 2,
    lichSu: [
      { ngay: '2025-05-29', noiDung: 'Tạo hợp đồng', nguoi: 'Nguyễn Thị Lan', loai: 'create' },
      { ngay: '2025-05-30', noiDung: 'Pháp luật từ chối - cần sửa đổi', nguoi: 'Phạm Thị Hương', loai: 'reject' },
    ],
  },
  {
    id: 10,
    ma: 'HĐKG-2025-009',
    chuNha: 'Vũ Thị Mai',
    sdtChuNha: '0988 777 666',
    emailChuNha: 'vuthimai@email.com',
    batDongSan: 'Kiot mặt đường Kim Mã',
    diaChiBDS: '142 Kim Mã, Ba Đình, Hà Nội',
    loaiBDS: 'Kiot',
    giaThue: 12000000,
    ngayKy: null,
    thoiHan: 6,
    ngayHetHan: null,
    tienDamBao: 24000000,
    trangThai: 'cho_ky',
    trangThaiPhapLy: 'da_duyet',
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    dieuKhoanPhatSinh: [],
    workflowStep: 4,
    lichSu: [
      { ngay: '2025-05-28', noiDung: 'Tạo hợp đồng', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2025-05-29', noiDung: 'Pháp luật duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
    ],
  },
]

const STATUS_CONFIG = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky: { label: 'Chờ ký', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  dang_hieu_luc: { label: 'Đang hiệu lực', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  sap_het_han: { label: 'Sắp hết hạn', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
  tam_ngung: { label: 'Tạm ngưng', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
}

const LEGAL_STATUS_CONFIG = {
  cho_phap_luat: { label: 'Chờ pháp luật', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
  can_sua: { label: 'Cần sửa', color: 'bg-orange-50 text-orange-700', dot: 'bg-orange-400' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700', dot: 'bg-red-400' },
}

const WORKFLOW_STEPS = [
  { key: 'tiep_nhan', label: 'Tiếp nhận' },
  { key: 'soan_hop_dong', label: 'Soạn HĐ' },
  { key: 'phap_luat_duyet', label: 'PL duyệt' },
  { key: 'cho_ky', label: 'Chờ ký' },
  { key: 'hieu_luc', label: 'Hiệu lực' },
]

const CLAUSE_STATUS = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
}

const CHU_NHA_OPTIONS = ['Tất cả', 'Nguyễn Văn Minh', 'Phạm Minh Tuấn', 'Trần Thị Hoa', 'Lê Quốc Bảo', 'Đỗ Văn Kiên', 'Nguyễn Thị Lan', 'Phạm Hữu Đức', 'Hoàng Đức Thắng', 'Công ty CP Đầu tư ABC', 'Vũ Thị Mai']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'expiring', label: 'Sắp hết hạn' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'amount_desc', label: 'Tiền ĐB cao nhất' },
  { key: 'amount_asc', label: 'Tiền ĐB thấp nhất' },
]

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
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

function KPICard({ icon, label, value, color, bgColor, sparkData, sparkColor, accent }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group ${accent ? 'border-l-4 border-l-amber-400' : ''}`}>
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                isActive
                  ? isCurrent ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {isActive && !isCurrent ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : stepNum}
              </div>
              <span className={`text-[9px] mt-1.5 text-center leading-tight whitespace-nowrap ${isCurrent ? 'text-amber-700 font-semibold' : isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 rounded-full ${stepNum < currentStep ? 'bg-blue-500' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ContractRow({ contract, isSelected, onSelect }) {
  const status = STATUS_CONFIG[contract.trangThai]
  const legalStatus = LEGAL_STATUS_CONFIG[contract.trangThaiPhapLy]
  const daysLeft = daysUntil(contract.ngayHetHan)

  return (
    <tr
      onClick={() => onSelect(contract.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{contract.ma}</p>
        <p className="text-xs text-slate-400">{formatDate(contract.ngayKy)}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-blue-700">{contract.chuNha.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{contract.chuNha}</p>
            <p className="text-xs text-slate-400 truncate">{contract.sdtChuNha}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700 truncate max-w-[180px]">{contract.batDongSan}</p>
        <p className="text-xs text-slate-400">{contract.loaiBDS}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{contract.thoiHan} tháng</p>
        {contract.ngayHetHan && (
          <p className={`text-xs ${daysLeft !== null && daysLeft <= 30 ? 'text-orange-600 font-medium' : 'text-slate-400'}`}>
            {daysLeft !== null && daysLeft > 0 ? `Còn ${daysLeft} ngày` : daysLeft === 0 ? 'Hết hạn hôm nay' : 'Đã hết hạn'}
          </p>
        )}
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{formatVND(contract.tienDamBao)}đ</p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${legalStatus.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${legalStatus.dot}`} />
          {legalStatus.label}
        </span>
      </td>
    </tr>
  )
}

function ContractDetail({ contract, onClose }) {
  if (!contract) return null
  const status = STATUS_CONFIG[contract.trangThai]
  const legalStatus = LEGAL_STATUS_CONFIG[contract.trangThaiPhapLy]
  const daysLeft = daysUntil(contract.ngayHetHan)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">Hợp đồng ký gửi</p>
            <h3 className="text-white font-bold text-lg">{contract.ma}</h3>
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
          <span className={`text-xs font-medium ${legalStatus.color} bg-white/10 px-2 py-1 rounded-md`}>
            PL: {legalStatus.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Owner Info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin chủ nhà</h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{contract.chuNha.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{contract.chuNha}</p>
                <p className="text-xs text-slate-500">{contract.sdtChuNha} · {contract.emailChuNha}</p>
              </div>
              <a href={`tel:${contract.sdtChuNha.replace(/\s/g, '')}`} className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Bất động sản</h4>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-800">{contract.batDongSan}</p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {contract.diaChiBDS}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">{contract.loaiBDS}</span>
              <span className="text-xs text-slate-500">Giá thuê: <span className="font-semibold text-slate-700">{formatVND(contract.giaThue)}đ/tháng</span></span>
            </div>
          </div>
        </div>

        {/* Contract Terms */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Điều khoản ký gửi</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày ký</p>
              <p className="text-sm font-semibold text-slate-800">{formatDate(contract.ngayKy)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Thời hạn</p>
              <p className="text-sm font-semibold text-slate-800">{contract.thoiHan} tháng</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày hết hạn</p>
              <p className={`text-sm font-semibold ${daysLeft !== null && daysLeft <= 30 ? 'text-orange-600' : 'text-slate-800'}`}>
                {formatDate(contract.ngayHetHan)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Tiền đảm bảo</p>
              <p className="text-sm font-semibold text-slate-800">{formatVND(contract.tienDamBao)}đ</p>
            </div>
          </div>
        </div>

        {/* Deposit */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tiền đảm bảo</h4>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">Số tiền giữ</p>
                <p className="text-lg font-bold text-emerald-800">{formatVND(contract.tienDamBao)}đ</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-1">Tương đương {Math.round(contract.tienDamBao / contract.giaThue)} tháng tiền thuê</p>
          </div>
        </div>

        {/* Broker */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Môi giới phụ trách</h4>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{contract.moiGioi}</p>
                <p className="text-xs text-slate-500">{contract.sdtMoiGioi}</p>
              </div>
              <a href={`tel:${contract.sdtMoiGioi.replace(/\s/g, '')}`} className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Additional Clauses */}
        {contract.dieuKhoanPhatSinh.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Điều khoản phát sinh</h4>
            <div className="space-y-2">
              {contract.dieuKhoanPhatSinh.map((dk, i) => {
                const clauseStatus = CLAUSE_STATUS[dk.trangThai]
                return (
                  <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-700 flex-1">{dk.noiDung}</p>
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium border ${clauseStatus.color}`}>
                        {clauseStatus.label}
                      </span>
                    </div>
                    {dk.ghiChu && <p className="text-xs text-slate-400 mt-1.5 italic">{dk.ghiChu}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PDF */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">File hợp đồng</h4>
          <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs text-slate-400">Chưa có file PDF</p>
            <button className="mt-2 text-xs text-blue-600 font-medium hover:text-blue-700">Tải lên hợp đồng</button>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tiến trình pháp lý</h4>
          <WorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Activity History */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch sử hoạt động</h4>
          <div className="space-y-0">
            {contract.lichSu.map((item, i) => {
              const iconConfig = {
                create: { bg: 'bg-blue-100', color: 'text-blue-600', icon: 'M12 4v16m8-8H4' },
                edit: { bg: 'bg-amber-100', color: 'text-amber-600', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                approve: { bg: 'bg-emerald-100', color: 'text-emerald-600', icon: 'M5 13l4 4L19 7' },
                sign: { bg: 'bg-indigo-100', color: 'text-indigo-600', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                active: { bg: 'bg-cyan-100', color: 'text-cyan-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                send: { bg: 'bg-purple-100', color: 'text-purple-600', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                reject: { bg: 'bg-red-100', color: 'text-red-600', icon: 'M6 18L18 6M6 6l12 12' },
                expire: { bg: 'bg-slate-100', color: 'text-slate-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                suspend: { bg: 'bg-orange-100', color: 'text-orange-600', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
              }
              const cfg = iconConfig[item.loai] || iconConfig.create
              const isLast = i === contract.lichSu.length - 1
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <svg className={`w-3.5 h-3.5 ${cfg.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cfg.icon} />
                      </svg>
                    </div>
                    {!isLast && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className={`pb-3 ${isLast ? '' : ''}`}>
                    <p className="text-xs text-slate-700">{item.noiDung}</p>
                    <p className="text-[10px] text-slate-400">{item.nguoi} · {formatDate(item.ngay)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thao tác</h4>
          <div className="space-y-2">
            {(contract.trangThai === 'cho_duyet' || contract.trangThaiPhapLy === 'can_sua') && (
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Duyệt hợp đồng
                </button>
                <button className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Từ chối
                </button>
              </div>
            )}
            {contract.trangThai === 'cho_ky' && (
              <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Gửi cho chủ nhà ký
              </button>
            )}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </button>
              <button className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất PDF
              </button>
            </div>
            {contract.trangThai === 'dang_hieu_luc' && (
              <button className="w-full py-2.5 rounded-lg border border-amber-300 text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Gia hạn hợp đồng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertCard({ title, description, count, icon, color }) {
  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${color}`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{title}</p>
          {count > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80">{count}</span>}
        </div>
        <p className="text-xs mt-0.5 opacity-80">{description}</p>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có hợp đồng nào</h3>
        <p className="text-slate-500 text-sm mb-8">Khi có hợp đồng ký gửi mới, chúng sẽ hiển thị tại đây.</p>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo hợp đồng
        </button>
      </div>
    </div>
  )
}

export default function AdminHopDongKyGuiPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [filterPhapLy, setFilterPhapLy] = useState('all')
  const [filterChuNha, setFilterChuNha] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...CONTRACTS]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.ma.toLowerCase().includes(q) ||
        c.chuNha.toLowerCase().includes(q) ||
        c.batDongSan.toLowerCase().includes(q) ||
        c.diaChiBDS.toLowerCase().includes(q)
      )
    }
    if (filterTrangThai !== 'all') result = result.filter(c => c.trangThai === filterTrangThai)
    if (filterPhapLy !== 'all') result = result.filter(c => c.trangThaiPhapLy === filterPhapLy)
    if (filterChuNha !== 'Tất cả') result = result.filter(c => c.chuNha === filterChuNha)

    switch (sortBy) {
      case 'expiring': result.sort((a, b) => {
        if (!a.ngayHetHan) return 1
        if (!b.ngayHetHan) return -1
        return new Date(a.ngayHetHan) - new Date(b.ngayHetHan)
      }); break
      case 'pending': result.sort((a, b) => {
        const order = { cho_duyet: 0, cho_ky: 1, sap_het_han: 2, tam_ngung: 3, dang_hieu_luc: 4, da_ket_thuc: 5 }
        return (order[a.trangThai] || 9) - (order[b.trangThai] || 9)
      }); break
      case 'amount_desc': result.sort((a, b) => b.tienDamBao - a.tienDamBao); break
      case 'amount_asc': result.sort((a, b) => a.tienDamBao - b.tienDamBao); break
      default: result.sort((a, b) => {
        const dateA = a.lichSu[0]?.ngay || a.ngayKy || ''
        const dateB = b.lichSu[0]?.ngay || b.ngayKy || ''
        return new Date(dateB) - new Date(dateA)
      })
    }
    return result
  }, [searchQuery, filterTrangThai, filterPhapLy, filterChuNha, sortBy])

  const kpiData = useMemo(() => ({
    total: CONTRACTS.length,
    choDuyet: CONTRACTS.filter(c => c.trangThai === 'cho_duyet').length,
    dangHieuLuc: CONTRACTS.filter(c => c.trangThai === 'dang_hieu_luc').length,
    sapHetHan: CONTRACTS.filter(c => c.trangThai === 'sap_het_han').length,
    coDieuKhoan: CONTRACTS.filter(c => c.dieuKhoanPhatSinh.length > 0).length,
  }), [])

  const alertData = useMemo(() => {
    const sapHetHan = CONTRACTS.filter(c => c.trangThai === 'sap_het_han')
    const choPhapLuat = CONTRACTS.filter(c => c.trangThaiPhapLy === 'cho_phap_luat' || c.trangThaiPhapLy === 'can_sua' || c.trangThaiPhapLy === 'tu_choi')
    const thieuChuKy = CONTRACTS.filter(c => c.trangThai === 'cho_ky')
    return { sapHetHan, choPhapLuat, thieuChuKy }
  }, [])

  const selectedContract = selectedId ? CONTRACTS.find(c => c.id === selectedId) : null

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý hợp đồng ký gửi</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi và xử lý hợp đồng ký gửi bất động sản</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo hợp đồng
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          label="Tổng hợp đồng"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          sparkData={[5, 8, 6, 10, 9, 12, 10]}
          sparkColor="#2563eb"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Chờ duyệt"
          value={kpiData.choDuyet}
          color="text-amber-600"
          bgColor="bg-amber-50"
          sparkData={[1, 3, 2, 4, 3, 5, 3]}
          sparkColor="#d97706"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          label="Đang hiệu lực"
          value={kpiData.dangHieuLuc}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          sparkData={[3, 4, 5, 4, 6, 5, 7]}
          sparkColor="#059669"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Sắp hết hạn"
          value={kpiData.sapHetHan}
          color="text-orange-600"
          bgColor="bg-orange-50"
          sparkData={[0, 1, 0, 1, 1, 2, 1]}
          sparkColor="#ea580c"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          label="Có điều khoản phát sinh"
          value={kpiData.coDieuKhoan}
          color="text-purple-600"
          bgColor="bg-purple-50"
          sparkData={[2, 3, 2, 4, 3, 5, 4]}
          sparkColor="#7c3aed"
        />
      </div>

      {/* Alert Section */}
      {(alertData.sapHetHan.length > 0 || alertData.choPhapLuat.length > 0 || alertData.thieuChuKy.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {alertData.sapHetHan.length > 0 && (
            <AlertCard
              type="expiring"
              title="Hợp đồng sắp hết hạn"
              description={`${alertData.sapHetHan.map(c => c.ma).join(', ')} cần gia hạn hoặc đóng`}
              count={alertData.sapHetHan.length}
              color="bg-orange-50 border-orange-200 text-orange-800"
              icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          )}
          {alertData.choPhapLuat.length > 0 && (
            <AlertCard
              type="legal"
              title="Chờ pháp luật xử lý"
              description={`${alertData.choPhapLuat.length} hợp đồng cần bộ phận pháp luật duyệt hoặc sửa đổi`}
              count={alertData.choPhapLuat.length}
              color="bg-amber-50 border-amber-200 text-amber-800"
              icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
            />
          )}
          {alertData.thieuChuKy.length > 0 && (
            <AlertCard
              type="missing"
              title="Thiếu chữ ký"
              description={`${alertData.thieuChuKy.map(c => c.ma).join(', ')} chờ chủ nhà ký`}
              count={alertData.thieuChuKy.length}
              color="bg-blue-50 border-blue-200 text-blue-800"
              icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
            />
          )}
        </div>
      )}

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
              placeholder="Tìm kiếm mã HĐ, chủ nhà, BĐS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

          {/* Filter: Trạng thái hợp đồng */}
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

          {/* Filter: Trạng thái pháp lý */}
          <select
            value={filterPhapLy}
            onChange={(e) => setFilterPhapLy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả pháp lý</option>
            {Object.entries(LEGAL_STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>

          {/* Filter: Chủ nhà */}
          <select
            value={filterChuNha}
            onChange={(e) => setFilterChuNha(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none max-w-[180px]"
          >
            {CHU_NHA_OPTIONS.map(o => <option key={o}>{o}</option>)}
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
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mã hợp đồng</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chủ nhà</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bất động sản</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thời hạn</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tiền ĐB</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Pháp lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(c => (
                      <ContractRow
                        key={c.id}
                        contract={c}
                        isSelected={selectedId === c.id}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Hiển thị {filtered.length} / {CONTRACTS.length} hợp đồng</span>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
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
