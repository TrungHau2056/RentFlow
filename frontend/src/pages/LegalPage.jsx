import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const LEGAL_REQUESTS = [
  {
    id: 1,
    maYeuCau: 'PL-2025-012',
    maHopDong: 'HĐKG-2025-003',
    chuNha: 'Trần Thị Hoa',
    sdtChuNha: '0987 654 321',
    batDongSan: 'Căn hộ Midtown Sài Đồng',
    diaChiBDS: '29 Liễu Giai, Ba Đình, Hà Nội',
    loaiYeuCau: 'duyet_hop_dong',
    mucDoUuTien: 'khan_cap',
    ngayGui: '2025-05-25',
    trangThai: 'cho_duyet',
    nguoiGui: 'Lê Quốc Anh',
    nguoiXuLy: null,
    deadline: '2025-05-28',
    dieuKhoanPhatSinh: [],
    ghiChuPhapLy: '',
    lichSu: [
      { ngay: '2025-05-25', noiDung: 'Gửi yêu cầu duyệt hợp đồng', nguoi: 'Lê Quốc Anh', loai: 'send' },
    ],
  },
  {
    id: 2,
    maYeuCau: 'PL-2025-011',
    maHopDong: 'HĐKG-2025-005',
    chuNha: 'Đỗ Văn Kiên',
    sdtChuNha: '0978 111 222',
    batDongSan: 'Nhà mặt phố Đống Đa',
    diaChiBDS: '88 Láng Hạ, Đống Đa, Hà Nội',
    loaiYeuCau: 'sua_dieu_khoan',
    mucDoUuTien: 'quan_trong',
    ngayGui: '2025-05-19',
    trangThai: 'dang_xet_duyet',
    nguoiGui: 'Phạm Minh Tuấn',
    nguoiXuLy: 'Phạm Thị Hương',
    deadline: '2025-05-26',
    dieuKhoanPhatSinh: [
      {
        id: 1,
        dieuKhoan: 'Quy định sử dụng thang máy chung',
        noiDungCu: 'Chủ nhà chịu toàn bộ chi phí bảo trì thang máy.',
        noiDungMoi: 'Chi phí bảo trì thang máy được chia đều giữa chủ nhà và các đơn vị thuê, theo tỷ lệ diện tích sử dụng.',
        trangThai: 'cho_duyet',
        mucDoRuiRo: 'trung_binh',
        ghiChu: 'Cần bổ sung điều khoản bảo trì định kỳ',
      },
    ],
    ghiChuPhapLy: 'Điều khoản thang máy cần rõ ràng hơn về trách nhiệm bảo trì.',
    lichSu: [
      { ngay: '2025-05-19', noiDung: 'Gửi yêu cầu sửa điều khoản', nguoi: 'Phạm Minh Tuấn', loai: 'send' },
      { ngay: '2025-05-20', noiDung: 'Bắt đầu xem xét', nguoi: 'Phạm Thị Hương', loai: 'review' },
    ],
  },
  {
    id: 3,
    maYeuCau: 'PL-2025-010',
    maHopDong: 'HĐKG-2025-008',
    chuNha: 'Công ty CP Đầu tư ABC',
    sdtChuNha: '024-1234-5678',
    batDongSan: 'Văn phòng hạng B Cầu Giấy',
    diaChiBDS: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    loaiYeuCau: 'tu_choi',
    mucDoUuTien: 'khan_cap',
    ngayGui: '2025-05-29',
    trangThai: 'da_tu_choi',
    nguoiGui: 'Nguyễn Thị Lan',
    nguoiXuLy: 'Phạm Thị Hương',
    deadline: '2025-05-31',
    dieuKhoanPhatSinh: [
      {
        id: 2,
        dieuKhoan: 'Điều khoản bồi thường không rõ ràng',
        noiDungCu: 'Trong trường hợp chấm dứt hợp đồng trước hạn, bên vi phạm phải bồi thường toàn bộ thiệt hại.',
        noiDungMoi: 'Bồi thường theo mức 3 tháng tiền thuê đối với bên vi phạm chấm dứt hợp đồng trước hạn, trừ trường hợp bất khả kháng.',
        trangThai: 'tu_choi',
        mucDoRuiRo: 'cao',
        ghiChu: 'Cần sửa lại theo mẫu chuẩn của công ty',
      },
    ],
    ghiChuPhapLy: 'Điều khoản bồi thường vi phạm quy định nội bộ. Yêu cầu viết lại theo mẫu HĐ-2025.',
    lichSu: [
      { ngay: '2025-05-29', noiDung: 'Gửi yêu cầu duyệt', nguoi: 'Nguyễn Thị Lan', loai: 'send' },
      { ngay: '2025-05-30', noiDung: 'Bắt đầu xem xét', nguoi: 'Phạm Thị Hương', loai: 'review' },
      { ngay: '2025-05-30', noiDung: 'Từ chối - điều khoản bồi thường không đạt', nguoi: 'Phạm Thị Hương', loai: 'reject' },
    ],
  },
  {
    id: 4,
    maYeuCau: 'PL-2025-009',
    maHopDong: 'HĐKG-2025-004',
    chuNha: 'Lê Quốc Bảo',
    sdtChuNha: '0912 345 678',
    batDongSan: 'Nhà phố cổ khu phố cổ',
    diaChiBDS: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    loaiYeuCau: 'duyet_dieu_khoan',
    mucDoUuTien: 'binh_thuong',
    ngayGui: '2025-04-19',
    trangThai: 'da_phe_duyet',
    nguoiGui: 'Trần Văn Hùng',
    nguoiXuLy: 'Phạm Thị Hương',
    deadline: '2025-04-25',
    dieuKhoanPhatSinh: [
      {
        id: 3,
        dieuKhoan: 'Cho phép kinh doanh thương mại tại tầng 1',
        noiDungCu: 'Chỉ sử dụng cho mục đích ở.',
        noiDungMoi: 'Cho phép sử dụng tầng 1 cho mục đích kinh doanh thương mại hợp pháp, không gây ô nhiễm tiếng ồn vượt mức quy định.',
        trangThai: 'da_duyet',
        mucDoRuiRo: 'thap',
        ghiChu: 'Phù hợp quy định địa phương',
      },
    ],
    ghiChuPhapLy: 'Điều khoản phù hợp quy định. Đã phê duyệt.',
    lichSu: [
      { ngay: '2025-04-19', noiDung: 'Gửi yêu cầu duyệt điều khoản', nguoi: 'Trần Văn Hùng', loai: 'send' },
      { ngay: '2025-04-19', noiDung: 'Bắt đầu xem xét', nguoi: 'Phạm Thị Hương', loai: 'review' },
      { ngay: '2025-04-19', noiDung: 'Phê duyệt điều khoản', nguoi: 'Phạm Thị Hương', loai: 'approve' },
    ],
  },
  {
    id: 5,
    maYeuCau: 'PL-2025-013',
    maHopDong: 'HĐKG-2025-010',
    chuNha: 'Vũ Thị Mai',
    sdtChuNha: '0988 777 666',
    batDongSan: 'Kiot mặt đường Kim Mã',
    diaChiBDS: '142 Kim Mã, Ba Đình, Hà Nội',
    loaiYeuCau: 'duyet_hop_dong',
    mucDoUuTien: 'binh_thuong',
    ngayGui: '2025-05-29',
    trangThai: 'dang_xet_duyet',
    nguoiGui: 'Lê Quốc Anh',
    nguoiXuLy: 'Phạm Thị Hương',
    deadline: '2025-06-02',
    dieuKhoanPhatSinh: [],
    ghiChuPhapLy: '',
    lichSu: [
      { ngay: '2025-05-29', noiDung: 'Gửi yêu cầu duyệt hợp đồng', nguoi: 'Lê Quốc Anh', loai: 'send' },
      { ngay: '2025-05-30', noiDung: 'Bắt đầu xem xét', nguoi: 'Phạm Thị Hương', loai: 'review' },
    ],
  },
  {
    id: 6,
    maYeuCau: 'PL-2025-008',
    maHopDong: 'HĐKG-2025-001',
    chuNha: 'Nguyễn Văn Minh',
    sdtChuNha: '0901 234 567',
    batDongSan: 'Biệt thự Vinhomes Cao cấp',
    diaChiBDS: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    loaiYeuCau: 'duyet_dieu_khoan',
    mucDoUuTien: 'quan_trong',
    ngayGui: '2025-03-12',
    trangThai: 'da_phe_duyet',
    nguoiGui: 'Lê Quốc Anh',
    nguoiXuLy: 'Phạm Thị Hương',
    deadline: '2025-03-15',
    dieuKhoanPhatSinh: [
      {
        id: 4,
        dieuKhoan: 'Gia hạn thêm 6 tháng nếu cả hai bên đồng ý',
        noiDungCu: 'Hợp đồng có thời hạn 12 tháng, không tự động gia hạn.',
        noiDungMoi: 'Hợp đồng tự động gia hạn thêm 6 tháng nếu không có bên nào thông báo chấm dứt trước 30 ngày.',
        trangThai: 'da_duyet',
        mucDoRuiRo: 'thap',
        ghiChu: 'Đã được pháp luật duyệt',
      },
      {
        id: 5,
        dieuKhoan: 'Điều chỉnh giá thuê tăng 5% sau tháng thứ 6',
        noiDungCu: 'Giá thuê cố định trong suốt thời hạn hợp đồng.',
        noiDungMoi: 'Giá thuê có thể điều chỉnh tăng tối đa 5% sau tháng thứ 6, với thông báo trước 15 ngày.',
        trangThai: 'cho_duyet',
        mucDoRuiRo: 'trung_binh',
        ghiChu: 'Chờ xác nhận từ chủ nhà',
      },
    ],
    ghiChuPhapLy: 'Điều khoản gia hạn đã duyệt. Điều khoản giá thuê chờ chủ nhà xác nhận.',
    lichSu: [
      { ngay: '2025-03-12', noiDung: 'Gửi yêu cầu duyệt điều khoản phát sinh', nguoi: 'Lê Quốc Anh', loai: 'send' },
      { ngay: '2025-03-12', noiDung: 'Bắt đầu xem xét', nguoi: 'Phạm Thị Hương', loai: 'review' },
      { ngay: '2025-03-13', noiDung: 'Phê duyệt điều khoản gia hạn', nguoi: 'Phạm Thị Hương', loai: 'approve' },
    ],
  },
  {
    id: 7,
    maYeuCau: 'PL-2025-014',
    maHopDong: 'HĐKG-2025-011',
    chuNha: 'Hoàng Đức Thắng',
    sdtChuNha: '0911 222 333',
    batDongSan: 'Căn hộ 3PN The Manor',
    diaChiBDS: 'The Manor, Mai Dich, Cầu Giấy, Hà Nội',
    loaiYeuCau: 'sua_dieu_khoan',
    mucDoUuTien: 'khan_cap',
    ngayGui: '2025-05-10',
    trangThai: 'can_bo_sung',
    nguoiGui: 'Trần Văn Hùng',
    nguoiXuLy: 'Phạm Thị Hương',
    deadline: '2025-05-15',
    dieuKhoanPhatSinh: [
      {
        id: 6,
        dieuKhoan: 'Tạm ngưng hợp đồng do tranh chấp nội thất',
        noiDungCu: 'Bên thuê phải bảo quản nội thất theo hiện trạng.',
        noiDungMoi: 'Bên thuê và chủ nhà cùng kiểm kê nội thất trong vòng 7 ngày kể từ ngày ký. Mọi hư hỏng phát sinh sau kiểm kê do bên thuê chịu.',
        trangThai: 'cho_duyet',
        mucDoRuiRo: 'cao',
        ghiChu: 'Cần bổ sung biên bản kiểm kê nội thất',
      },
    ],
    ghiChuPhapLy: 'Tranh chấp nội thất giữa chủ nhà và khách thuê. Cần biên bản kiểm kê chi tiết.',
    lichSu: [
      { ngay: '2025-05-10', noiDung: 'Gửi yêu cầu sửa điều khoản', nguoi: 'Trần Văn Hùng', loai: 'send' },
      { ngay: '2025-05-11', noiDung: 'Bắt đầu xem xét', nguoi: 'Phạm Thị Hương', loai: 'review' },
      { ngay: '2025-05-12', noiDung: 'Yêu cầu bổ sung biên bản kiểm kê', nguoi: 'Phạm Thị Hương', loai: 'request' },
    ],
  },
  {
    id: 8,
    maYeuCau: 'PL-2025-007',
    maHopDong: 'HĐKG-2025-002',
    chuNha: 'Phạm Minh Tuấn',
    sdtChuNha: '0903 456 789',
    batDongSan: 'Biệt thự sân vườn Tây Hồ',
    diaChiBDS: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    loaiYeuCau: 'duyet_hop_dong',
    mucDoUuTien: 'binh_thuong',
    ngayGui: '2025-02-07',
    trangThai: 'da_phe_duyet',
    nguoiGui: 'Trần Văn Hùng',
    nguoiXuLy: 'Phạm Thị Hương',
    deadline: '2025-02-12',
    dieuKhoanPhatSinh: [],
    ghiChuPhapLy: 'Hợp đồng chuẩn, không có phát sinh.',
    lichSu: [
      { ngay: '2025-02-07', noiDung: 'Gửi yêu cầu duyệt hợp đồng', nguoi: 'Trần Văn Hùng', loai: 'send' },
      { ngay: '2025-02-07', noiDung: 'Bắt đầu xem xét', nguoi: 'Phạm Thị Hương', loai: 'review' },
      { ngay: '2025-02-07', noiDung: 'Phê duyệt', nguoi: 'Phạm Thị Hương', loai: 'approve' },
    ],
  },
]

const STATUS_CONFIG = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  dang_xet_duyet: { label: 'Đang xem xét', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  da_phe_duyet: { label: 'Đã phê duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  da_tu_choi: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
  can_bo_sung: { label: 'Cần bổ sung', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
}

const PRIORITY_CONFIG = {
  khan_cap: { label: 'Khẩn cấp', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', pulse: true },
  quan_trong: { label: 'Quan trọng', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  binh_thuong: { label: 'Bình thường', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
}

const LOAI_YEU_CAU_CONFIG = {
  duyet_hop_dong: { label: 'Duyệt hợp đồng', color: 'bg-blue-50 text-blue-700', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  duyet_dieu_khoan: { label: 'Duyệt điều khoản', color: 'bg-purple-50 text-purple-700', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  sua_dieu_khoan: { label: 'Sửa điều khoản', color: 'bg-amber-50 text-amber-700', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
}

const CLAUSE_RISK_CONFIG = {
  cao: { label: 'Rủi ro cao', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  trung_binh: { label: 'Rủi ro TB', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  thap: { label: 'Rủi ro thấp', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
}

const CLAUSE_STATUS = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
}

const LOAI_FILTER = ['Tất cả', 'Duyệt hợp đồng', 'Duyệt điều khoản', 'Sửa điều khoản']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'deadline', label: 'Deadline gần nhất' },
  { key: 'priority', label: 'Ưu tiên cao nhất' },
]

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

function RequestRow({ request, isSelected, onSelect }) {
  const status = STATUS_CONFIG[request.trangThai]
  const priority = PRIORITY_CONFIG[request.mucDoUuTien]
  const loaiYC = LOAI_YEU_CAU_CONFIG[request.loaiYeuCau]
  const daysLeft = daysUntil(request.deadline)
  const isOverdue = daysLeft !== null && daysLeft < 0
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 1

  return (
    <tr
      onClick={() => onSelect(request.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{request.maYeuCau}</p>
        <Link
          to={`/admin/hop-dong-ky-gui/${request.maHopDong}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-slate-400 hover:text-blue-600"
        >
          {request.maHopDong}
        </Link>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-blue-700">{request.chuNha.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{request.chuNha}</p>
            <p className="text-xs text-slate-400 truncate max-w-37.5">{request.batDongSan}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${loaiYC.color}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={loaiYC.icon} />
          </svg>
          {loaiYC.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${priority.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot} ${priority.pulse ? 'animate-pulse' : ''}`} />
          {priority.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-600">{formatDate(request.ngayGui)}</p>
        <p className={`text-xs font-medium ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-slate-400'}`}>
          {isOverdue ? `Quá hạn ${Math.abs(daysLeft)} ngày` : isUrgent ? `Còn ${daysLeft} ngày` : `DL: ${formatDate(request.deadline)}`}
        </p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
    </tr>
  )
}

function ClauseCompare({ clause }) {
  const risk = CLAUSE_RISK_CONFIG[clause.mucDoRuiRo]
  const clauseStatus = CLAUSE_STATUS[clause.trangThai]

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Clause header */}
      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-sm font-semibold text-slate-700">{clause.dieuKhoan}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${risk.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
            {risk.label}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${clauseStatus.color}`}>
            {clauseStatus.label}
          </span>
        </div>
      </div>

      {/* Side-by-side compare */}
      <div className="grid grid-cols-2 divide-x divide-slate-200">
        <div className="p-3">
          <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wide mb-1.5">Nội dung cũ</p>
          <p className="text-sm text-slate-600 leading-relaxed bg-red-50/50 rounded p-2 border border-red-100/50">{clause.noiDungCu}</p>
        </div>
        <div className="p-3">
          <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1.5">Nội dung mới</p>
          <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50/50 rounded p-2 border border-emerald-100/50">{clause.noiDungMoi}</p>
        </div>
      </div>

      {/* Legal note */}
      {clause.ghiChu && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-amber-50/50">
          <p className="text-xs text-amber-700 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {clause.ghiChu}
          </p>
        </div>
      )}
    </div>
  )
}

function LegalDetail({ request, onClose }) {
  if (!request) return null
  const status = STATUS_CONFIG[request.trangThai]
  const priority = PRIORITY_CONFIG[request.mucDoUuTien]
  const loaiYC = LOAI_YEU_CAU_CONFIG[request.loaiYeuCau]
  const daysLeft = daysUntil(request.deadline)
  const isOverdue = daysLeft !== null && daysLeft < 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-900 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-xs mb-1">Yêu cầu pháp lý</p>
            <h3 className="text-white font-bold text-lg">{request.maYeuCau}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${priority.color}`}>
            {priority.label}
          </span>
          <span className={`text-xs font-medium ${loaiYC.color} bg-white/10 px-2 py-1 rounded-md`}>
            {loaiYC.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Contract & Owner Info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin hợp đồng</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Mã hợp đồng</p>
              <Link to={`/admin/hop-dong-ky-gui/${request.maHopDong}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                {request.maHopDong}
              </Link>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Chủ nhà</p>
              <p className="text-sm font-semibold text-slate-800">{request.chuNha}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 mt-2">
            <p className="text-xs text-slate-400">Bất động sản</p>
            <p className="text-sm font-medium text-slate-800">{request.batDongSan}</p>
            <p className="text-xs text-slate-400 mt-0.5">{request.diaChiBDS}</p>
          </div>
        </div>

        {/* Approval Workflow */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quy trình phê duyệt</h4>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Người gửi yêu cầu</span>
              <span className="text-xs font-medium text-slate-700">{request.nguoiGui}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Người xử lý</span>
              <span className="text-xs font-medium text-slate-700">{request.nguoiXuLy || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Ngày gửi</span>
              <span className="text-xs font-medium text-slate-700">{formatDate(request.ngayGui)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Deadline</span>
              <span className={`text-xs font-semibold ${isOverdue ? 'text-red-600' : daysLeft !== null && daysLeft <= 1 ? 'text-amber-600' : 'text-slate-700'}`}>
                {formatDate(request.deadline)}
                {isOverdue && ' (Quá hạn)'}
                {!isOverdue && daysLeft !== null && daysLeft <= 1 && ` (Còn ${daysLeft} ngày)`}
              </span>
            </div>
          </div>
        </div>

        {/* Clauses - Side by side compare */}
        {request.dieuKhoanPhatSinh.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Điều khoản phát sinh — So sánh</h4>
            <div className="space-y-3">
              {request.dieuKhoanPhatSinh.map(clause => (
                <ClauseCompare key={clause.id} clause={clause} />
              ))}
            </div>
          </div>
        )}

        {/* Legal Notes */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ghi chú pháp lý</h4>
          {request.ghiChuPhapLy ? (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <p className="text-sm text-amber-800 leading-relaxed">{request.ghiChuPhapLy}</p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-400 italic">Chưa có ghi chú pháp lý</p>
            </div>
          )}
          {/* Add note input */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Thêm ghi chú pháp lý..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              Thêm
            </button>
          </div>
        </div>

        {/* Risk Markers */}
        {request.dieuKhoanPhatSinh.some(c => c.mucDoRuiRo === 'cao') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800">Đánh dấu rủi ro cao</p>
                <p className="text-xs text-red-600 mt-0.5">Hợp đồng này có điều khoản rủi ro cao, cần xem xét kỹ lưỡng trước khi phê duyệt.</p>
              </div>
            </div>
          </div>
        )}

        {/* Audit History */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch sử xử lý</h4>
          <div className="space-y-0">
            {request.lichSu.map((item, i) => {
              const iconConfig = {
                send: { bg: 'bg-blue-100', color: 'text-blue-600', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                review: { bg: 'bg-amber-100', color: 'text-amber-600', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                approve: { bg: 'bg-emerald-100', color: 'text-emerald-600', icon: 'M5 13l4 4L19 7' },
                reject: { bg: 'bg-red-100', color: 'text-red-600', icon: 'M6 18L18 6M6 6l12 12' },
                request: { bg: 'bg-orange-100', color: 'text-orange-600', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
              }
              const cfg = iconConfig[item.loai] || iconConfig.send
              const isLast = i === request.lichSu.length - 1
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
                  <div className="pb-3">
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
            {(request.trangThai === 'cho_duyet' || request.trangThai === 'dang_xet_duyet' || request.trangThai === 'can_bo_sung') && (
              <>
                <button className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Phê duyệt
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Từ chối
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Yêu cầu sửa
                  </button>
                </div>
              </>
            )}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Chuyển cấp
              </button>
              <button className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PriorityAlert({ title, description, count, color, icon }) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Không có yêu cầu pháp lý</h3>
        <p className="text-slate-500 text-sm">Khi có yêu cầu duyệt pháp lý, chúng sẽ hiển thị tại đây.</p>
      </div>
    </div>
  )
}

export default function LegalPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [filterUuTien, setFilterUuTien] = useState('all')
  const [filterLoai, setFilterLoai] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...LEGAL_REQUESTS]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.maYeuCau.toLowerCase().includes(q) ||
        r.maHopDong.toLowerCase().includes(q) ||
        r.chuNha.toLowerCase().includes(q) ||
        r.batDongSan.toLowerCase().includes(q)
      )
    }
    if (filterTrangThai !== 'all') result = result.filter(r => r.trangThai === filterTrangThai)
    if (filterUuTien !== 'all') result = result.filter(r => r.mucDoUuTien === filterUuTien)
    if (filterLoai !== 'Tất cả') {
      const loaiMap = { 'Duyệt hợp đồng': 'duyet_hop_dong', 'Duyệt điều khoản': 'duyet_dieu_khoan', 'Sửa điều khoản': 'sua_dieu_khoan' }
      result = result.filter(r => r.loaiYeuCau === loaiMap[filterLoai])
    }

    switch (sortBy) {
      case 'deadline': result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); break
      case 'priority': {
        const order = { khan_cap: 0, quan_trong: 1, binh_thuong: 2 }
        result.sort((a, b) => (order[a.mucDoUuTien] || 9) - (order[b.mucDoUuTien] || 9))
        break
      }
      default: result.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui))
    }
    return result
  }, [searchQuery, filterTrangThai, filterUuTien, filterLoai, sortBy])

  const kpiData = useMemo(() => ({
    choDuyet: LEGAL_REQUESTS.filter(r => r.trangThai === 'cho_duyet' || r.trangThai === 'dang_xet_duyet').length,
    dieuKhoanPhatSinh: LEGAL_REQUESTS.reduce((acc, r) => acc + r.dieuKhoanPhatSinh.length, 0),
    daPheDuyet: LEGAL_REQUESTS.filter(r => r.trangThai === 'da_phe_duyet').length,
    daTuChoi: LEGAL_REQUESTS.filter(r => r.trangThai === 'da_tu_choi').length,
  }), [])

  const alertData = useMemo(() => {
    const quaHan = LEGAL_REQUESTS.filter(r => {
      const d = daysUntil(r.deadline)
      return d !== null && d < 0 && r.trangThai !== 'da_phe_duyet' && r.trangThai !== 'da_tu_choi'
    })
    const ruiRoCao = LEGAL_REQUESTS.filter(r => r.dieuKhoanPhatSinh.some(c => c.mucDoRuiRo === 'cao'))
    const khanCap = LEGAL_REQUESTS.filter(r => r.mucDoUuTien === 'khan_cap' && r.trangThai !== 'da_phe_duyet' && r.trangThai !== 'da_tu_choi')
    return { quaHan, ruiRoCao, khanCap }
  }, [])

  const selectedRequest = selectedId ? LEGAL_REQUESTS.find(r => r.id === selectedId) : null

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Duyệt pháp lý hợp đồng</h1>
          <p className="text-slate-500 text-sm mt-1">Xem xét điều khoản phát sinh và phê duyệt hợp đồng</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc nhanh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo yêu cầu
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Hợp đồng chờ duyệt"
          value={kpiData.choDuyet}
          color="text-amber-600"
          bgColor="bg-amber-50"
          sparkData={[2, 4, 3, 5, 4, 6, 4]}
          sparkColor="#d97706"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          label="Điều khoản phát sinh"
          value={kpiData.dieuKhoanPhatSinh}
          color="text-purple-600"
          bgColor="bg-purple-50"
          sparkData={[3, 5, 4, 6, 5, 7, 6]}
          sparkColor="#7c3aed"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          label="Đã phê duyệt"
          value={kpiData.daPheDuyet}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          sparkData={[2, 3, 3, 4, 4, 5, 3]}
          sparkColor="#059669"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
          label="Đã từ chối"
          value={kpiData.daTuChoi}
          color="text-red-600"
          bgColor="bg-red-50"
          sparkData={[0, 1, 0, 1, 0, 0, 1]}
          sparkColor="#dc2626"
        />
      </div>

      {/* Priority Alerts */}
      {(alertData.quaHan.length > 0 || alertData.ruiRoCao.length > 0 || alertData.khanCap.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {alertData.quaHan.length > 0 && (
            <PriorityAlert
              title="Hợp đồng quá hạn duyệt"
              description={`${alertData.quaHan.map(r => r.maYeuCau).join(', ')} cần xử lý ngay`}
              count={alertData.quaHan.length}
              color="bg-red-50 border-red-200 text-red-800"
              icon={<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          )}
          {alertData.ruiRoCao.length > 0 && (
            <PriorityAlert
              title="Điều khoản rủi ro cao"
              description={`${alertData.ruiRoCao.length} yêu cầu có điều khoản đánh giá rủi ro cao`}
              count={alertData.ruiRoCao.length}
              color="bg-amber-50 border-amber-200 text-amber-800"
              icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          )}
          {alertData.khanCap.length > 0 && (
            <PriorityAlert
              title="Yêu cầu khẩn cấp"
              description={`${alertData.khanCap.map(r => r.maYeuCau).join(', ')} cần xử lý ưu tiên`}
              count={alertData.khanCap.length}
              color="bg-orange-50 border-orange-200 text-orange-800"
              icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative min-w-60 flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm mã YC, mã HĐ, chủ nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

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

          {/* Filter: Mức độ ưu tiên */}
          <select
            value={filterUuTien}
            onChange={(e) => setFilterUuTien(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả ưu tiên</option>
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>

          {/* Filter: Loại yêu cầu */}
          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {LOAI_FILTER.map(o => <option key={o}>{o}</option>)}
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
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mã yêu cầu</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chủ nhà / BĐS</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Loại yêu cầu</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ưu tiên</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ngày gửi</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(r => (
                      <RequestRow
                        key={r.id}
                        request={r}
                        isSelected={selectedId === r.id}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Hiển thị {filtered.length} / {LEGAL_REQUESTS.length} yêu cầu</span>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          {selectedRequest && (
            <div className="w-105 shrink-0 hidden xl:block">
              <LegalDetail request={selectedRequest} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
