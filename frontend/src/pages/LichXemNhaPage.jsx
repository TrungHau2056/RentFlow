import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

// ── Mock data ────────────────────────────────────────────────────────
const MOCK_SCHEDULES = [
  {
    id: 1,
    ma: 'LX-2025-001',
    khachHang: 'Nguyễn Văn Minh',
    sdtKH: '0901 234 567',
    emailKH: 'nguyenvanminh@email.com',
    batDongSan: 'Căn hộ 2PN Vinhomes Times City',
    diaChiBDS: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaBDS: 15000000,
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    ngayXem: '2025-05-28',
    gioXem: '09:00',
    hinhThuc: 'truc_tiep',
    trangThai: 'cho_xac_nhan',
    ghiChu: 'Khách muốn xem thêm căn cùng tầng',
    lyDoHuy: null,
    ketQua: null,
    nhanXetKH: null,
    ghiChuMG: null,
    lichSu: [
      { ngay: '2025-05-25', noiDung: 'Tạo lịch xem', nguoi: 'Trần Văn Hùng', loai: 'create' },
    ],
  },
  {
    id: 2,
    ma: 'LX-2025-002',
    khachHang: 'Lê Thị Hương',
    sdtKH: '0988 555 666',
    emailKH: 'lethihuong@email.com',
    batDongSan: 'Nhà mặt phố Cầu Giấy',
    diaChiBDS: '122 Cầu Giấy, Cầu Giấy, Hà Nội',
    loaiBDS: 'Nhà phố',
    giaBDS: 35000000,
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    ngayXem: '2025-05-29',
    gioXem: '14:00',
    hinhThuc: 'di_cung_moi_gioi',
    trangThai: 'da_xac_nhan',
    ghiChu: 'Khách muốn khảo sát kỹ hạ tầng xung quanh',
    lyDoHuy: null,
    ketQua: null,
    nhanXetKH: null,
    ghiChuMG: null,
    lichSu: [
      { ngay: '2025-05-26', noiDung: 'Tạo lịch xem', nguoi: 'Nguyễn Thị Lan', loai: 'create' },
      { ngay: '2025-05-27', noiDung: 'Xác nhận lịch xem', nguoi: 'Nguyễn Thị Lan', loai: 'confirm' },
    ],
  },
  {
    id: 3,
    ma: 'LX-2025-003',
    khachHang: 'Phạm Đức Anh',
    sdtKH: '0965 111 222',
    emailKH: 'phamducanh@email.com',
    batDongSan: 'Căn hộ 3PN The Manor',
    diaChiBDS: 'The Manor, Mai Dịch, Cầu Giấy, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaBDS: 28000000,
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    ngayXem: '2025-05-27',
    gioXem: '10:30',
    hinhThuc: 'truc_tiep',
    trangThai: 'da_xem',
    ghiChu: null,
    lyDoHuy: null,
    ketQua: 'quan_tam',
    nhanXetKH: 'Thích layout phòng khách rộng, cần thời gian suy nghĩ',
    ghiChuMG: 'Khách tiềm năng cao, nên theo sát trong 3 ngày',
    lichSu: [
      { ngay: '2025-05-24', noiDung: 'Tạo lịch xem', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2025-05-25', noiDung: 'Xác nhận lịch xem', nguoi: 'Lê Quốc Anh', loai: 'confirm' },
      { ngay: '2025-05-27', noiDung: 'Hoàn thành xem nhà — Quan tâm', nguoi: 'Lê Quốc Anh', loai: 'complete' },
    ],
  },
  {
    id: 4,
    ma: 'LX-2025-004',
    khachHang: 'Vũ Minh Trí',
    sdtKH: '0965 333 444',
    emailKH: 'vuminhtri@email.com',
    batDongSan: 'Nhà mặt phố Đống Đa',
    diaChiBDS: '88 Láng Hạ, Đống Đa, Hà Nội',
    loaiBDS: 'Nhà phố',
    giaBDS: 22000000,
    moiGioi: 'Phạm Minh Tuấn',
    sdtMoiGioi: '0903 456 789',
    ngayXem: '2025-05-26',
    gioXem: '15:00',
    hinhThuc: 'video_call',
    trangThai: 'da_huy',
    ghiChu: 'Khách bận đột xuất',
    lyDoHuy: 'Lịch trình công việc thay đổi, xin dời sang tuần sau',
    ketQua: null,
    nhanXetKH: null,
    ghiChuMG: null,
    lichSu: [
      { ngay: '2025-05-23', noiDung: 'Tạo lịch xem', nguoi: 'Phạm Minh Tuấn', loai: 'create' },
      { ngay: '2025-05-24', noiDung: 'Xác nhận lịch xem', nguoi: 'Phạm Minh Tuấn', loai: 'confirm' },
      { ngay: '2025-05-26', noiDung: 'Hủy lịch xem', nguoi: 'Vũ Minh Trí', loai: 'cancel' },
    ],
  },
  {
    id: 5,
    ma: 'LX-2025-005',
    khachHang: 'Trần Hương Giang',
    sdtKH: '0988 777 888',
    emailKH: 'tranhuonggiang@email.com',
    batDongSan: 'Căn hộ Studio Times City',
    diaChiBDS: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaBDS: 8000000,
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    ngayXem: '2025-05-30',
    gioXem: '11:00',
    hinhThuc: 'truc_tiep',
    trangThai: 'cho_xac_nhan',
    ghiChu: 'Khách muốn xem vào buổi sáng',
    lyDoHuy: null,
    ketQua: null,
    nhanXetKH: null,
    ghiChuMG: null,
    lichSu: [
      { ngay: '2025-05-27', noiDung: 'Tạo lịch xem', nguoi: 'Lê Quốc Anh', loai: 'create' },
    ],
  },
  {
    id: 6,
    ma: 'LX-2025-006',
    khachHang: 'Đỗ Quang Hải',
    sdtKH: '0905 222 333',
    emailKH: 'doquanghai@email.com',
    batDongSan: 'Kiot mặt đường Kim Mã',
    diaChiBDS: '142 Kim Mã, Ba Đình, Hà Nội',
    loaiBDS: 'Kiot',
    giaBDS: 12000000,
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    ngayXem: '2025-05-28',
    gioXem: '16:00',
    hinhThuc: 'di_cung_moi_gioi',
    trangThai: 'doi_lich',
    ghiChu: 'Khách yêu cầu dời sang 30/5',
    lyDoHuy: 'Trời mưa lớn, khách xin dời lịch',
    ketQua: null,
    nhanXetKH: null,
    ghiChuMG: null,
    lichSu: [
      { ngay: '2025-05-25', noiDung: 'Tạo lịch xem', nguoi: 'Nguyễn Thị Lan', loai: 'create' },
      { ngay: '2025-05-26', noiDung: 'Xác nhận lịch xem', nguoi: 'Nguyễn Thị Lan', loai: 'confirm' },
      { ngay: '2025-05-28', noiDung: 'Dời lịch — khách xin dời do thời tiết', nguoi: 'Nguyễn Thị Lan', loai: 'reschedule' },
    ],
  },
  {
    id: 7,
    ma: 'LX-2025-007',
    khachHang: 'Mai Phương Thảo',
    sdtKH: '0966 777 888',
    emailKH: 'maiphuongthao@email.com',
    batDongSan: 'Văn phòng hạng B Cầu Giấy',
    diaChiBDS: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    loaiBDS: 'Văn phòng',
    giaBDS: 35000000,
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    ngayXem: '2025-05-25',
    gioXem: '09:30',
    hinhThuc: 'truc_tiep',
    trangThai: 'da_xem',
    ghiChu: null,
    lyDoHuy: null,
    ketQua: 'khong_quan_tam',
    nhanXetKH: 'Diện tích nhỏ hơn mong đợi, vị trí không phù hợp',
    ghiChuMG: 'Khách cần văn phòng từ 80m2 trở lên, nên giới thiệu BDS khác',
    lichSu: [
      { ngay: '2025-05-22', noiDung: 'Tạo lịch xem', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-05-23', noiDung: 'Xác nhận lịch xem', nguoi: 'Trần Văn Hùng', loai: 'confirm' },
      { ngay: '2025-05-25', noiDung: 'Hoàn thành xem nhà — Không quan tâm', nguoi: 'Trần Văn Hùng', loai: 'complete' },
    ],
  },
  {
    id: 8,
    ma: 'LX-2025-008',
    khachHang: 'Công ty TNHH ABC',
    sdtKH: '024-3555-7890',
    emailKH: 'info@abctech.vn',
    batDongSan: 'Shophouse Sun Grand City',
    diaChiBDS: 'Sun Grand City, Thụy Khuê, Tây Hồ, Hà Nội',
    loaiBDS: 'Shophouse',
    giaBDS: 45000000,
    moiGioi: 'Phạm Minh Tuấn',
    sdtMoiGioi: '0903 456 789',
    ngayXem: '2025-05-31',
    gioXem: '10:00',
    hinhThuc: 'di_cung_moi_gioi',
    trangThai: 'da_xac_nhan',
    ghiChu: 'Đại diện công ty xem trước, sẽ quyết định sau',
    lyDoHuy: null,
    ketQua: null,
    nhanXetKH: null,
    ghiChuMG: null,
    lichSu: [
      { ngay: '2025-05-27', noiDung: 'Tạo lịch xem', nguoi: 'Phạm Minh Tuấn', loai: 'create' },
      { ngay: '2025-05-28', noiDung: 'Xác nhận lịch xem', nguoi: 'Phạm Minh Tuấn', loai: 'confirm' },
    ],
  },
  {
    id: 9,
    ma: 'LX-2025-009',
    khachHang: 'Hoàng Đức Thắng',
    sdtKH: '0911 222 333',
    emailKH: 'hoangducthang@email.com',
    batDongSan: 'Căn hộ 3PN The Manor',
    diaChiBDS: 'The Manor, Mai Dịch, Cầu Giấy, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaBDS: 28000000,
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    ngayXem: '2025-05-24',
    gioXem: '14:00',
    hinhThuc: 'truc_tiep',
    trangThai: 'da_xem',
    ghiChu: null,
    lyDoHuy: null,
    ketQua: 'cho_quyet_dinh',
    nhanXetKH: 'Căn đẹp nhưng giá hơi cao so với ngân sách, cần thảo luận thêm với gia đình',
    ghiChuMG: 'Khách hẹn phản hồi sau 2 ngày. Cần gọi lại 26/05.',
    lichSu: [
      { ngay: '2025-05-21', noiDung: 'Tạo lịch xem', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2025-05-22', noiDung: 'Xác nhận lịch xem', nguoi: 'Lê Quốc Anh', loai: 'confirm' },
      { ngay: '2025-05-24', noiDung: 'Hoàn thành xem nhà — Chờ quyết định', nguoi: 'Lê Quốc Anh', loai: 'complete' },
    ],
  },
  {
    id: 10,
    ma: 'LX-2025-010',
    khachHang: 'Nguyễn Đức Anh',
    sdtKH: '0911 444 555',
    emailKH: 'nguyenducanh@email.com',
    batDongSan: 'Căn hộ 2PN Vinhomes Times City',
    diaChiBDS: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaBDS: 15000000,
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    ngayXem: '2025-05-23',
    gioXem: '11:00',
    hinhThuc: 'video_call',
    trangThai: 'da_xem',
    ghiChu: null,
    lyDoHuy: null,
    ketQua: 'quan_tam',
    nhanXetKH: 'Rất thích căn này, muốn xem trực tiếp lần 2',
    ghiChuMG: 'Đã tạo lịch xem trực tiếp lần 2, chờ xác nhận',
    lichSu: [
      { ngay: '2025-05-20', noiDung: 'Tạo lịch xem (video)', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-05-21', noiDung: 'Xác nhận lịch xem', nguoi: 'Trần Văn Hùng', loai: 'confirm' },
      { ngay: '2025-05-23', noiDung: 'Hoàn thành xem nhà (video) — Quan tâm', nguoi: 'Trần Văn Hùng', loai: 'complete' },
    ],
  },
]

const STATUS_CONFIG = {
  cho_xac_nhan: { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  da_xac_nhan: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  da_xem: { label: 'Đã xem', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  da_huy: { label: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
  doi_lich: { label: 'Dời lịch', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400' },
}

const HINH_THUC_CONFIG = {
  truc_tiep: { label: 'Trực tiếp', color: 'text-blue-600 bg-blue-50', icon: '🏠' },
  video_call: { label: 'Video call', color: 'text-violet-600 bg-violet-50', icon: '📹' },
  di_cung_moi_gioi: { label: 'Đi cùng MG', color: 'text-teal-600 bg-teal-50', icon: '🤝' },
}

const KET_QUA_CONFIG = {
  quan_tam: { label: 'Quan tâm', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-400' },
  khong_quan_tam: { label: 'Không quan tâm', color: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-400' },
  cho_quyet_dinh: { label: 'Chờ quyết định', color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
}

const MOI_GIOI_OPTIONS = ['Tất cả', 'Trần Văn Hùng', 'Lê Quốc Anh', 'Phạm Minh Tuấn', 'Nguyễn Thị Lan']
const STATUS_OPTIONS = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đã xem', 'Đã hủy', 'Dời lịch']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'oldest', label: 'Cũ nhất' },
  { key: 'date_asc', label: 'Ngày xem gần nhất' },
  { key: 'date_desc', label: 'Ngày xem xa nhất' },
]

// ── Helpers ──────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatShortDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function getDayName(dateStr) {
  if (!dateStr) return ''
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  return days[new Date(dateStr).getDay()]
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

// ── KPI Card ─────────────────────────────────────────────────────────
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

// ── Alert card ───────────────────────────────────────────────────────
function AlertCard({ icon, title, count, detail, variant = 'amber' }) {
  const styles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  }
  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${styles[variant]}`}>
      <span className="text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-80 mt-0.5">{detail}</p>
      </div>
      {count > 0 && (
        <span className="text-sm font-bold bg-white/60 rounded-lg px-2.5 py-1 shrink-0">{count}</span>
      )}
    </div>
  )
}

// ── Calendar day cell ────────────────────────────────────────────────
function CalendarDay({ date, schedules, isSelected, onSelect }) {
  const isToday = new Date().toDateString() === date.toDateString()
  return (
    <div
      onClick={() => onSelect(date)}
      className={`min-h-28 border border-slate-200 rounded-lg p-2 cursor-pointer transition-colors hover:bg-blue-50/50 ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50/30' : isToday ? 'bg-blue-50/20' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-semibold ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
          {getDayName(date)}
        </span>
        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
          isToday ? 'bg-blue-600 text-white' : 'text-slate-700'
        }`}>
          {date.getDate()}
        </span>
      </div>
      <div className="space-y-1">
        {schedules.slice(0, 3).map((s) => {
          const st = STATUS_CONFIG[s.trangThai]
          return (
            <div key={s.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${st.color}`}>
              {s.gioXem} {s.khachHang.split(' ').pop()}
            </div>
          )
        })}
        {schedules.length > 3 && (
          <p className="text-[10px] text-slate-400 pl-1">+{schedules.length - 3} khác</p>
        )}
      </div>
    </div>
  )
}

// ── Schedule row (table mode) ────────────────────────────────────────
function ScheduleRow({ schedule, isSelected, onSelect }) {
  const status = STATUS_CONFIG[schedule.trangThai]
  const hinhThuc = HINH_THUC_CONFIG[schedule.hinhThuc]

  return (
    <tr
      onClick={() => onSelect(schedule.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{schedule.ma}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-cyan-700">{schedule.khachHang.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{schedule.khachHang}</p>
            <p className="text-xs text-slate-400">{schedule.sdtKH}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700 truncate max-w-37.5">{schedule.batDongSan}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-violet-700">{schedule.moiGioi.charAt(0)}</span>
          </div>
          <p className="text-sm text-slate-700">{schedule.moiGioi}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-medium text-slate-800">{formatShortDate(schedule.ngayXem)}</p>
        <p className="text-xs text-slate-400">{getDayName(schedule.ngayXem)}, {schedule.gioXem}</p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${hinhThuc.color}`}>
          {hinhThuc.icon} {hinhThuc.label}
        </span>
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

// ── Detail panel ─────────────────────────────────────────────────────
function ScheduleDetail({ schedule, onClose, onUpdateResult }) {
  if (!schedule) return null
  const status = STATUS_CONFIG[schedule.trangThai]
  const hinhThuc = HINH_THUC_CONFIG[schedule.hinhThuc]
  const ketQua = schedule.ketQua ? KET_QUA_CONFIG[schedule.ketQua] : null

  const timelineIcon = {
    create: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    confirm: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    complete: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    cancel: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    reschedule: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  }
  const timelineColor = {
    create: 'bg-blue-500',
    confirm: 'bg-emerald-500',
    complete: 'bg-emerald-500',
    cancel: 'bg-red-500',
    reschedule: 'bg-purple-500',
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">Lịch xem nhà</p>
            <h3 className="text-white font-bold text-lg">{schedule.ma}</h3>
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
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${hinhThuc.color}`}>
            {hinhThuc.icon} {hinhThuc.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Customer info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Khách hàng</h4>
          <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{schedule.khachHang.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{schedule.khachHang}</p>
                <p className="text-xs text-slate-500">{schedule.sdtKH} · {schedule.emailKH}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Property info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Bất động sản</h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-sm font-semibold text-slate-800">{schedule.batDongSan}</p>
            <p className="text-xs text-slate-500 mt-0.5">{schedule.diaChiBDS}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-white rounded-md px-2 py-0.5 text-slate-600 border border-slate-200">{schedule.loaiBDS}</span>
              <span className="text-xs font-semibold text-blue-700">{formatVND(schedule.giaBDS)}đ/tháng</span>
            </div>
          </div>
        </div>

        {/* Broker info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Môi giới phụ trách</h4>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{schedule.moiGioi.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{schedule.moiGioi}</p>
                <p className="text-xs text-slate-500">{schedule.sdtMoiGioi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Viewing time */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thời gian xem</h4>
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{formatDate(schedule.ngayXem)} ({getDayName(schedule.ngayXem)})</p>
                <p className="text-xs text-slate-500">Giờ: {schedule.gioXem} · {hinhThuc.icon} {hinhThuc.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {schedule.ghiChu && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ghi chú</h4>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-sm text-amber-800">
              {schedule.ghiChu}
            </div>
          </div>
        )}

        {/* Cancel / reschedule reason */}
        {schedule.lyDoHuy && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {schedule.trangThai === 'da_huy' ? 'Lý do hủy' : 'Lý do dời lịch'}
            </h4>
            <div className={`rounded-lg p-3 border text-sm ${
              schedule.trangThai === 'da_huy' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-purple-50 border-purple-100 text-purple-800'
            }`}>
              {schedule.lyDoHuy}
            </div>
          </div>
        )}

        {/* Result */}
        {schedule.ketQua && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Kết quả sau xem nhà</h4>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 space-y-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${ketQua.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${ketQua.dot}`} />
                {ketQua.label}
              </span>
              {schedule.nhanXetKH && (
                <div>
                  <p className="text-xs font-semibold text-slate-600">Nhận xét khách hàng:</p>
                  <p className="text-sm text-slate-700">{schedule.nhanXetKH}</p>
                </div>
              )}
              {schedule.ghiChuMG && (
                <div>
                  <p className="text-xs font-semibold text-slate-600">Ghi chú môi giới:</p>
                  <p className="text-sm text-slate-700">{schedule.ghiChuMG}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity timeline */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch sử hoạt động</h4>
          <div className="space-y-0">
            {schedule.lichSu.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ${timelineColor[item.loai] || 'bg-slate-400'}`}>
                    {timelineIcon[item.loai]}
                  </div>
                  {i < schedule.lichSu.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-0.5" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm text-slate-700">{item.noiDung}</p>
                  <p className="text-xs text-slate-400">{formatDate(item.ngay)} · {item.nguoi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          {schedule.trangThai === 'cho_xac_nhan' && (
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Xác nhận lịch
            </button>
          )}
          {(schedule.trangThai === 'cho_xac_nhan' || schedule.trangThai === 'da_xac_nhan') && (
            <>
              <button className="w-full bg-white hover:bg-slate-50 text-purple-700 border border-purple-200 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Dời lịch
              </button>
              <button className="w-full bg-white hover:bg-slate-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Hủy lịch
              </button>
            </>
          )}
          {schedule.trangThai === 'da_xac_nhan' && (
            <button
              onClick={() => onUpdateResult(schedule)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cập nhật kết quả
            </button>
          )}
          {schedule.trangThai === 'da_xem' && schedule.ketQua === 'quan_tam' && (
            <Link
              to="/admin/hop-dong-thue"
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors text-center"
            >
              Tạo hợp đồng thuê
            </Link>
          )}
          {schedule.trangThai === 'da_xem' && !schedule.ketQua && (
            <button
              onClick={() => onUpdateResult(schedule)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cập nhật kết quả
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Result update modal ──────────────────────────────────────────────
function ResultModal({ schedule, onClose }) {
  const [ketQua, setKetQua] = useState('')
  const [nhanXet, setNhanXet] = useState('')
  const [ghiChuMG, setGhiChuMG] = useState('')

  if (!schedule) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal header */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-xs">Cập nhật kết quả</p>
              <h3 className="text-white font-bold text-lg">{schedule.ma}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Schedule summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Khách hàng</p>
                <p className="font-medium text-slate-800">{schedule.khachHang}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Bất động sản</p>
                <p className="font-medium text-slate-800 truncate">{schedule.batDongSan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Ngày xem</p>
                <p className="font-medium text-slate-800">{formatDate(schedule.ngayXem)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Môi giới</p>
                <p className="font-medium text-slate-800">{schedule.moiGioi}</p>
              </div>
            </div>
          </div>

          {/* Result select */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kết quả xem nhà *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'quan_tam', label: 'Quan tâm', color: 'border-emerald-300 bg-emerald-50 text-emerald-700', activeColor: 'border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300' },
                { key: 'khong_quan_tam', label: 'Không quan tâm', color: 'border-red-300 bg-red-50 text-red-700', activeColor: 'border-red-500 bg-red-100 text-red-800 ring-2 ring-red-300' },
                { key: 'cho_quyet_dinh', label: 'Chờ quyết định', color: 'border-amber-300 bg-amber-50 text-amber-700', activeColor: 'border-amber-500 bg-amber-100 text-amber-800 ring-2 ring-amber-300' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setKetQua(opt.key)}
                  className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                    ketQua === opt.key ? opt.activeColor : opt.color
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer comment */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nhận xét khách hàng</label>
            <textarea
              value={nhanXet}
              onChange={(e) => setNhanXet(e.target.value)}
              rows={3}
              placeholder="Ghi nhận ý kiến của khách hàng sau khi xem..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Broker note */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú môi giới</label>
            <textarea
              value={ghiChuMG}
              onChange={(e) => setGhiChuMG(e.target.value)}
              rows={2}
              placeholder="Đánh giá và đề xuất từ môi giới..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <p className="text-xs text-slate-400 italic">Kết quả sẽ tự động lưu vào lịch sử làm việc khách hàng.</p>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onClose}
              disabled={!ketQua}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                ketQua
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Lưu kết quả
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────
export default function LichXemNhaPage() {
  const [viewMode, setViewMode] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tất cả')
  const [filterMoiGioi, setFilterMoiGioi] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [resultModal, setResultModal] = useState(null)
  const [selectedCalDate, setSelectedCalDate] = useState(null)
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return { month: now.getMonth(), year: now.getFullYear() }
  })

  const selected = useMemo(() => MOCK_SCHEDULES.find(s => s.id === selectedId), [selectedId])

  const filtered = useMemo(() => {
    let list = [...MOCK_SCHEDULES]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.ma.toLowerCase().includes(q) ||
        s.khachHang.toLowerCase().includes(q) ||
        s.batDongSan.toLowerCase().includes(q) ||
        s.moiGioi.toLowerCase().includes(q)
      )
    }

    if (filterStatus !== 'Tất cả') {
      const statusMap = {
        'Chờ xác nhận': 'cho_xac_nhan',
        'Đã xác nhận': 'da_xac_nhan',
        'Đã xem': 'da_xem',
        'Đã hủy': 'da_huy',
        'Dời lịch': 'doi_lich',
      }
      list = list.filter(s => s.trangThai === statusMap[filterStatus])
    }

    if (filterMoiGioi !== 'Tất cả') {
      list = list.filter(s => s.moiGioi === filterMoiGioi)
    }

    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => b.id - a.id)
        break
      case 'oldest':
        list.sort((a, b) => a.id - b.id)
        break
      case 'date_asc':
        list.sort((a, b) => new Date(a.ngayXem) - new Date(b.ngayXem))
        break
      case 'date_desc':
        list.sort((a, b) => new Date(b.ngayXem) - new Date(a.ngayXem))
        break
    }

    return list
  }, [search, filterStatus, filterMoiGioi, sortBy])

  // KPI values
  const kpi = useMemo(() => ({
    total: MOCK_SCHEDULES.length,
    choXacNhan: MOCK_SCHEDULES.filter(s => s.trangThai === 'cho_xac_nhan').length,
    daXacNhan: MOCK_SCHEDULES.filter(s => s.trangThai === 'da_xac_nhan').length,
    daXem: MOCK_SCHEDULES.filter(s => s.trangThai === 'da_xem').length,
    daHuy: MOCK_SCHEDULES.filter(s => s.trangThai === 'da_huy').length,
  }), [])

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const { month, year } = calMonth
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const days = []

    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({ date: d, isCurrentMonth: false })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    return days
  }, [calMonth])

  const getSchedulesForDate = (date) => {
    return MOCK_SCHEDULES.filter(s => {
      const sd = new Date(s.ngayXem)
      return sd.getFullYear() === date.getFullYear() && sd.getMonth() === date.getMonth() && sd.getDate() === date.getDate()
    })
  }

  const monthLabel = new Date(calMonth.year, calMonth.month).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý lịch xem nhà</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi và điều phối lịch xem bất động sản của khách hàng</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo lịch xem
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          label="Tổng lịch xem"
          value={kpi.total}
          color="text-blue-600" bgColor="bg-blue-100"
          sparkData={[6, 8, 5, 10, 7, 9, 10]} sparkColor="#2563eb"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Chờ xác nhận"
          value={kpi.choXacNhan}
          color="text-amber-600" bgColor="bg-amber-100"
          sparkData={[2, 3, 1, 2, 3, 2, 2]} sparkColor="#d97706"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đã xác nhận"
          value={kpi.daXacNhan}
          color="text-blue-600" bgColor="bg-blue-100"
          sparkData={[1, 2, 3, 1, 2, 2, 2]} sparkColor="#2563eb"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>}
          label="Đã hoàn thành"
          value={kpi.daXem}
          color="text-emerald-600" bgColor="bg-emerald-100"
          sparkData={[3, 2, 4, 3, 4, 3, 4]} sparkColor="#059669"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>}
          label="Đã hủy"
          value={kpi.daHuy}
          color="text-red-600" bgColor="bg-red-100"
          sparkData={[1, 0, 1, 0, 1, 1, 1]} sparkColor="#dc2626"
        />
      </div>

      {/* Alert section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AlertCard
          icon="⏰"
          title="Lịch xem sắp tới"
          count={MOCK_SCHEDULES.filter(s => (s.trangThai === 'cho_xac_nhan' || s.trangThai === 'da_xac_nhan') && new Date(s.ngayXem) >= new Date()).length}
          detail="Cần xác nhận và chuẩn bị cho lịch xem trong 48h tới"
          variant="amber"
        />
        <AlertCard
          icon="🔄"
          title="Yêu cầu dời lịch"
          count={MOCK_SCHEDULES.filter(s => s.trangThai === 'doi_lich').length}
          detail="Khách hàng yêu cầu đổi thời gian xem nhà"
          variant="blue"
        />
        <AlertCard
          icon="📋"
          title="Chưa cập nhật kết quả"
          count={MOCK_SCHEDULES.filter(s => s.trangThai === 'da_xem' && !s.ketQua).length}
          detail="Lịch xem đã hoàn thành nhưng chưa ghi nhận kết quả"
          variant="red"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã lịch, khách hàng, BĐS, môi giới..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select
              value={filterMoiGioi}
              onChange={(e) => setFilterMoiGioi(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {MOI_GIOI_OPTIONS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SORT_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>

            {/* View mode toggle */}
            <div className="flex rounded-xl border border-slate-300 overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                  viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {viewMode === 'list' ? (
            /* Table view */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Mã lịch</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Khách hàng</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Bất động sản</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Môi giới</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ngày giờ</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Hình thức</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-slate-400">Không tìm thấy lịch xem nào</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map(s => (
                        <ScheduleRow key={s.id} schedule={s} isSelected={selectedId === s.id} onSelect={setSelectedId} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Calendar view */
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              {/* Calendar nav */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => setCalMonth(m => ({ ...m, month: m.month === 0 ? 11 : m.month - 1, year: m.month === 0 ? m.year - 1 : m.year }))}
                  className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-bold text-slate-800 capitalize">{monthLabel}</h3>
                <button
                  onClick={() => setCalMonth(m => ({ ...m, month: m.month === 11 ? 0 : m.month + 1, year: m.month === 11 ? m.year + 1 : m.year }))}
                  className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map(({ date, isCurrentMonth }, i) => {
                  const schedules = isCurrentMonth ? getSchedulesForDate(date) : []
                  const isSel = selectedCalDate && selectedCalDate.toDateString() === date.toDateString()
                  return (
                    <CalendarDay
                      key={i}
                      date={date}
                      schedules={schedules}
                      isSelected={isSel}
                      onSelect={(d) => {
                        setSelectedCalDate(d)
                        if (schedules.length > 0) setSelectedId(schedules[0].id)
                      }}
                    />
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className="text-xs text-slate-500">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="hidden xl:block w-105 shrink-0">
            <ScheduleDetail
              schedule={selected}
              onClose={() => setSelectedId(null)}
              onUpdateResult={(s) => setResultModal(s)}
            />
          </div>
        )}
      </div>

      {/* Empty state when no selection */}
      {!selected && (
        <div className="hidden xl:flex items-center justify-center w-105 shrink-0">
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm text-slate-400">Chọn lịch xem để xem chi tiết</p>
          </div>
        </div>
      )}

      {/* Result update modal */}
      {resultModal && (
        <ResultModal
          schedule={resultModal}
          onClose={() => setResultModal(null)}
        />
      )}
    </div>
  )
}
