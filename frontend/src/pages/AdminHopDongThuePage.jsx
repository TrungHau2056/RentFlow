import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const CONTRACTS = [
  {
    id: 1,
    ma: 'HĐT-2025-001',
    khachThue: 'Công ty CP Giải pháp Số',
    sdtKhachThue: '024-3888-1234',
    emailKhachThue: 'contact@gpsolutions.vn',
    chuNha: 'Nguyễn Văn Minh',
    sdtChuNha: '0901 234 567',
    batDongSan: 'Biệt thự Vinhomes Cao cấp',
    diaChiBDS: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    loaiBDS: 'Biệt thự',
    giaThue: 50000000,
    tienCoc: 100000000,
    ngayBatDau: '2025-04-01',
    ngayKetThuc: '2026-03-31',
    thoiHan: 12,
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'dang_hieu_luc',
    workflowStep: 5,
    lichSuThanhToan: [
      { ky: 'T4/2025', soTien: 50000000, trangThai: 'da_thanh_toan', ngayTT: '2025-04-01' },
      { ky: 'T5/2025', soTien: 50000000, trangThai: 'da_thanh_toan', ngayTT: '2025-05-01' },
    ],
    lichSu: [
      { ngay: '2025-03-10', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-03-15', noiDung: 'Khách thuê ký hợp đồng', nguoi: 'Công ty GPS', loai: 'sign' },
      { ngay: '2025-03-20', noiDung: 'Chủ nhà ký hợp đồng', nguoi: 'Nguyễn Văn Minh', loai: 'sign' },
      { ngay: '2025-04-01', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
      { ngay: '2025-04-01', noiDung: 'Thanh toán tháng 4', nguoi: 'Công ty GPS', loai: 'payment' },
    ],
  },
  {
    id: 2,
    ma: 'HĐT-2025-002',
    khachThue: 'Nguyễn Hoàng Anh',
    sdtKhachThue: '0912 888 999',
    emailKhachThue: 'hoanganh.nguyen@email.com',
    chuNha: 'Phạm Minh Tuấn',
    sdtChuNha: '0903 456 789',
    batDongSan: 'Biệt thự sân vườn Tây Hồ',
    diaChiBDS: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    loaiBDS: 'Biệt thự',
    giaThue: 65000000,
    tienCoc: 195000000,
    ngayBatDau: '2025-03-01',
    ngayKetThuc: '2027-02-28',
    thoiHan: 24,
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'dang_hieu_luc',
    workflowStep: 5,
    lichSuThanhToan: [
      { ky: 'T3/2025', soTien: 65000000, trangThai: 'da_thanh_toan', ngayTT: '2025-03-01' },
      { ky: 'T4/2025', soTien: 65000000, trangThai: 'da_thanh_toan', ngayTT: '2025-04-01' },
      { ky: 'T5/2025', soTien: 65000000, trangThai: 'da_thanh_toan', ngayTT: '2025-05-01' },
    ],
    lichSu: [
      { ngay: '2025-02-15', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-02-20', noiDung: 'Ký kết thành công', nguoi: 'Nguyễn Hoàng Anh', loai: 'sign' },
      { ngay: '2025-03-01', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
    ],
  },
  {
    id: 3,
    ma: 'HĐT-2025-003',
    khachThue: 'Phạm Thị Ngọc',
    sdtKhachThue: '0987 111 222',
    emailKhachThue: 'phamthingoc@email.com',
    chuNha: 'Trần Thị Hoa',
    sdtChuNha: '0987 654 321',
    batDongSan: 'Căn hộ Midtown Sài Đồng',
    diaChiBDS: '29 Liễu Giai, Ba Đình, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaThue: 15000000,
    tienCoc: 30000000,
    ngayBatDau: null,
    ngayKetThuc: null,
    thoiHan: 12,
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    trangThai: 'cho_ky',
    workflowStep: 4,
    lichSuThanhToan: [],
    lichSu: [
      { ngay: '2025-05-20', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2025-05-22', noiDung: 'Chủ nhà đã ký', nguoi: 'Trần Thị Hoa', loai: 'sign' },
      { ngay: '2025-05-25', noiDung: 'Chờ khách thuê ký', nguoi: 'Hệ thống', loai: 'pending' },
    ],
  },
  {
    id: 4,
    ma: 'HĐT-2025-004',
    khachThue: 'Lê Quang Vinh',
    sdtKhachThue: '0903 777 888',
    emailKhachThue: 'lequangvinh@email.com',
    chuNha: 'Lê Quốc Bảo',
    sdtChuNha: '0912 345 678',
    batDongSan: 'Nhà phố cổ khu phố cổ',
    diaChiBDS: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    loaiBDS: 'Nhà phố',
    giaThue: 25000000,
    tienCoc: 50000000,
    ngayBatDau: '2025-05-01',
    ngayKetThuc: '2025-10-31',
    thoiHan: 6,
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'sap_het_han',
    workflowStep: 5,
    lichSuThanhToan: [
      { ky: 'T5/2025', soTien: 25000000, trangThai: 'da_thanh_toan', ngayTT: '2025-05-01' },
    ],
    lichSu: [
      { ngay: '2025-04-25', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2025-04-28', noiDung: 'Ký kết thành công', nguoi: 'Lê Quang Vinh', loai: 'sign' },
      { ngay: '2025-05-01', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
    ],
  },
  {
    id: 5,
    ma: 'HĐT-2025-005',
    khachThue: 'Vũ Minh Trí',
    sdtKhachThue: '0965 333 444',
    emailKhachThue: 'vuminhtri@email.com',
    chuNha: 'Đỗ Văn Kiên',
    sdtChuNha: '0978 111 222',
    batDongSan: 'Nhà mặt phố Đống Đa',
    diaChiBDS: '88 Láng Hạ, Đống Đa, Hà Nội',
    loaiBDS: 'Nhà phố',
    giaThue: 22000000,
    tienCoc: 44000000,
    ngayBatDau: '2025-05-15',
    ngayKetThuc: '2026-05-14',
    thoiHan: 12,
    moiGioi: 'Phạm Minh Tuấn',
    sdtMoiGioi: '0903 456 789',
    trangThai: 'dang_hieu_luc',
    workflowStep: 5,
    lichSuThanhToan: [
      { ky: 'T5/2025', soTien: 22000000, trangThai: 'da_thanh_toan', ngayTT: '2025-05-15' },
    ],
    lichSu: [
      { ngay: '2025-05-10', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Phạm Minh Tuấn', loai: 'create' },
      { ngay: '2025-05-12', noiDung: 'Ký kết thành công', nguoi: 'Vũ Minh Trí', loai: 'sign' },
      { ngay: '2025-05-15', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
    ],
  },
  {
    id: 6,
    ma: 'HĐT-2025-006',
    khachThue: 'Trần Hương Giang',
    sdtKhachThue: '0988 555 666',
    emailKhachThue: 'tranhuonggiang@email.com',
    chuNha: 'Nguyễn Thị Lan',
    sdtChuNha: '0965 432 109',
    batDongSan: 'Căn hộ Studio Times City',
    diaChiBDS: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaThue: 8000000,
    tienCoc: 16000000,
    ngayBatDau: '2025-05-01',
    ngayKetThuc: '2025-10-31',
    thoiHan: 6,
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    trangThai: 'sap_het_han',
    workflowStep: 5,
    lichSuThanhToan: [
      { ky: 'T5/2025', soTien: 8000000, trangThai: 'da_thanh_toan', ngayTT: '2025-05-01' },
    ],
    lichSu: [
      { ngay: '2025-04-28', noiDung: 'Tạo hợp đồng', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2025-05-01', noiDung: 'Ký kết và có hiệu lực', nguoi: 'Trần Hương Giang', loai: 'sign' },
    ],
  },
  {
    id: 7,
    ma: 'HĐT-2024-010',
    khachThue: 'Công ty TNHH ABC',
    sdtKhachThue: '024-3555-7890',
    emailKhachThue: 'info@abctech.vn',
    chuNha: 'Phạm Hữu Đức',
    sdtChuNha: '0904 555 666',
    batDongSan: 'Shophouse Sun Grand City',
    diaChiBDS: 'Sun Grand City, Thụy Khuê, Tây Hồ, Hà Nội',
    loaiBDS: 'Shophouse',
    giaThue: 45000000,
    tienCoc: 90000000,
    ngayBatDau: '2024-07-01',
    ngayKetThuc: '2025-06-30',
    thoiHan: 12,
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    trangThai: 'sap_het_han',
    workflowStep: 5,
    lichSuThanhToan: [
      { ky: 'T4/2025', soTien: 45000000, trangThai: 'da_thanh_toan', ngayTT: '2025-04-01' },
      { ky: 'T5/2025', soTien: 45000000, trangThai: 'tre_han', ngayTT: null },
    ],
    lichSu: [
      { ngay: '2024-06-25', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Nguyễn Thị Lan', loai: 'create' },
      { ngay: '2024-07-01', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
      { ngay: '2025-05-20', noiDung: 'Thanh toán tháng 5 trễ hạn', nguoi: 'Hệ thống', loai: 'payment' },
    ],
  },
  {
    id: 8,
    ma: 'HĐT-2024-008',
    khachThue: 'Nguyễn Đức Anh',
    sdtKhachThue: '0911 444 555',
    emailKhachThue: 'nguyenducanh@email.com',
    chuNha: 'Hoàng Đức Thắng',
    sdtChuNha: '0911 222 333',
    batDongSan: 'Căn hộ 3PN The Manor',
    diaChiBDS: 'The Manor, Mai Dich, Cầu Giấy, Hà Nội',
    loaiBDS: 'Căn hộ',
    giaThue: 28000000,
    tienCoc: 56000000,
    ngayBatDau: '2024-09-01',
    ngayKetThuc: '2025-08-31',
    thoiHan: 12,
    moiGioi: 'Trần Văn Hùng',
    sdtMoiGioi: '0912 345 678',
    trangThai: 'da_huy',
    workflowStep: 6,
    lichSuThanhToan: [],
    lichSu: [
      { ngay: '2024-08-25', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Trần Văn Hùng', loai: 'create' },
      { ngay: '2024-09-01', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
      { ngay: '2025-05-10', noiDung: 'Hủy hợp đồng do tranh chấp', nguoi: 'Phạm Thị Hương', loai: 'cancel' },
    ],
  },
  {
    id: 9,
    ma: 'HĐT-2025-007',
    khachThue: 'Mai Phương Thảo',
    sdtKhachThue: '0966 777 888',
    emailKhachThue: 'maiphuongthao@email.com',
    chuNha: 'Công ty CP Đầu tư ABC',
    sdtChuNha: '024-1234-5678',
    batDongSan: 'Văn phòng hạng B Cầu Giấy',
    diaChiBDS: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    loaiBDS: 'Văn phòng',
    giaThue: 35000000,
    tienCoc: 105000000,
    ngayBatDau: null,
    ngayKetThuc: null,
    thoiHan: 24,
    moiGioi: 'Nguyễn Thị Lan',
    sdtMoiGioi: '0912 888 999',
    trangThai: 'cho_ky',
    workflowStep: 3,
    lichSuThanhToan: [],
    lichSu: [
      { ngay: '2025-05-28', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Nguyễn Thị Lan', loai: 'create' },
    ],
  },
  {
    id: 10,
    ma: 'HĐT-2024-005',
    khachThue: 'Đỗ Quang Hải',
    sdtKhachThue: '0905 222 333',
    emailKhachThue: 'doquanghai@email.com',
    chuNha: 'Vũ Thị Mai',
    sdtChuNha: '0988 777 666',
    batDongSan: 'Kiot mặt đường Kim Mã',
    diaChiBDS: '142 Kim Mã, Ba Đình, Hà Nội',
    loaiBDS: 'Kiot',
    giaThue: 12000000,
    tienCoc: 24000000,
    ngayBatDau: '2024-01-01',
    ngayKetThuc: '2024-12-31',
    thoiHan: 12,
    moiGioi: 'Lê Quốc Anh',
    sdtMoiGioi: '0987 654 321',
    trangThai: 'da_ket_thuc',
    workflowStep: 6,
    lichSuThanhToan: [],
    lichSu: [
      { ngay: '2023-12-20', noiDung: 'Tạo hợp đồng thuê', nguoi: 'Lê Quốc Anh', loai: 'create' },
      { ngay: '2024-01-01', noiDung: 'Hợp đồng có hiệu lực', nguoi: 'Hệ thống', loai: 'active' },
      { ngay: '2024-12-31', noiDung: 'Hợp đồng kết thúc', nguoi: 'Hệ thống', loai: 'expire' },
    ],
  },
]

const STATUS_CONFIG = {
  cho_ky: { label: 'Chờ ký', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  dang_hieu_luc: { label: 'Đang hiệu lực', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  sap_het_han: { label: 'Sắp hết hạn', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
  da_huy: { label: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
}

const WORKFLOW_STEPS = [
  { key: 'dat_lich', label: 'Đặt lịch' },
  { key: 'dam_phan', label: 'Đàm phán' },
  { key: 'tao_hd', label: 'Tạo HĐ' },
  { key: 'ky_hd', label: 'Ký HĐ' },
  { key: 'dang_thue', label: 'Đang thuê' },
  { key: 'ket_thuc', label: 'Kết thúc' },
]

const PAYMENT_STATUS = {
  da_thanh_toan: { label: 'Đã thanh toán', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  tre_han: { label: 'Trễ hạn', color: 'text-red-600', bg: 'bg-red-50' },
  cho_thanh_toan: { label: 'Chờ thanh toán', color: 'text-amber-600', bg: 'bg-amber-50' },
}

const MOI_GIOI_OPTIONS = ['Tất cả', 'Trần Văn Hùng', 'Lê Quốc Anh', 'Phạm Minh Tuấn', 'Nguyễn Thị Lan']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'expiring', label: 'Sắp hết hạn' },
  { key: 'value_desc', label: 'Giá trị cao nhất' },
  { key: 'value_asc', label: 'Giá trị thấp nhất' },
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

function ContractRow({ contract, isSelected, onSelect }) {
  const status = STATUS_CONFIG[contract.trangThai]
  const daysLeft = daysUntil(contract.ngayKetThuc)

  return (
    <tr
      onClick={() => onSelect(contract.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{contract.ma}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-cyan-700">{contract.khachThue.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{contract.khachThue}</p>
            <p className="text-xs text-slate-400">{contract.sdtKhachThue}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-blue-700">{contract.chuNha.charAt(0)}</span>
          </div>
          <p className="text-sm text-slate-700 truncate">{contract.chuNha}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700 truncate max-w-37.5">{contract.batDongSan}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">{formatVND(contract.giaThue)}đ</p>
        <p className="text-xs text-slate-400">/tháng</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-600">{formatDate(contract.ngayBatDau)}</p>
        <p className="text-xs text-slate-400">{formatDate(contract.ngayKetThuc)}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{contract.moiGioi}</p>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        {daysLeft !== null && contract.trangThai === 'dang_hieu_luc' && daysLeft <= 60 && (
          <p className="text-xs text-orange-600 font-medium mt-0.5">Còn {daysLeft} ngày</p>
        )}
      </td>
    </tr>
  )
}

function ContractDetail({ contract, onClose }) {
  if (!contract) return null
  const status = STATUS_CONFIG[contract.trangThai]
  const daysLeft = daysUntil(contract.ngayKetThuc)
  const hasLatePayment = contract.lichSuThanhToan.some(p => p.trangThai === 'tre_han')

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs mb-1">Hợp đồng thuê</p>
            <h3 className="text-white font-bold text-lg">{contract.ma}</h3>
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
          {contract.ngayKetThuc && daysLeft !== null && daysLeft <= 60 && contract.trangThai === 'dang_hieu_luc' && (
            <span className="text-xs font-medium text-orange-300 bg-white/10 px-2 py-1 rounded-md">
              Còn {daysLeft} ngày
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Tenant Info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Khách thuê</h4>
          <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{contract.khachThue.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{contract.khachThue}</p>
                <p className="text-xs text-slate-500">{contract.sdtKhachThue} · {contract.emailKhachThue}</p>
              </div>
              <a href={`tel:${contract.sdtKhachThue.replace(/\s/g, '')}`} className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center hover:bg-cyan-200 transition-colors">
                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Landlord Info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Chủ nhà</h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{contract.chuNha.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{contract.chuNha}</p>
                <p className="text-xs text-slate-500">{contract.sdtChuNha}</p>
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
            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 mt-1.5 inline-block">{contract.loaiBDS}</span>
          </div>
        </div>

        {/* Rental Terms */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Điều khoản thuê</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Giá thuê</p>
              <p className="text-sm font-bold text-slate-800">{formatVND(contract.giaThue)}đ</p>
              <p className="text-[10px] text-slate-400">/tháng</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Tiền cọc</p>
              <p className="text-sm font-bold text-slate-800">{formatVND(contract.tienCoc)}đ</p>
              <p className="text-[10px] text-slate-400">{Math.round(contract.tienCoc / contract.giaThue)} tháng thuê</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày bắt đầu</p>
              <p className="text-sm font-semibold text-slate-800">{formatDate(contract.ngayBatDau)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Ngày kết thúc</p>
              <p className={`text-sm font-semibold ${daysLeft !== null && daysLeft <= 60 ? 'text-orange-600' : 'text-slate-800'}`}>
                {formatDate(contract.ngayKetThuc)}
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 mt-2 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">Tổng giá trị hợp đồng</p>
                <p className="text-lg font-bold text-emerald-800">{formatVND(contract.giaThue * contract.thoiHan)}đ</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-600">Thời hạn</p>
                <p className="text-sm font-semibold text-emerald-800">{contract.thoiHan} tháng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {contract.lichSuThanhToan.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch sử thanh toán</h4>
            <div className="space-y-1.5">
              {contract.lichSuThanhToan.map((pt, i) => {
                const payStatus = PAYMENT_STATUS[pt.trangThai]
                return (
                  <div key={i} className={`rounded-lg p-2.5 ${payStatus.bg} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${payStatus.color === 'text-emerald-600' ? 'bg-emerald-400' : payStatus.color === 'text-red-600' ? 'bg-red-400' : 'bg-amber-400'}`} />
                      <span className="text-sm text-slate-700">{pt.ky}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-800">{formatVND(pt.soTien)}đ</span>
                      <span className={`text-[10px] font-medium ${payStatus.color}`}>{payStatus.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {hasLatePayment && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-xs text-red-700 font-medium">Có khoản thanh toán trễ hạn</span>
              </div>
            )}
          </div>
        )}

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

        {/* Workflow */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tiến trình hợp đồng</h4>
          <WorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Activity History */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lịch sử hoạt động</h4>
          <div className="space-y-0">
            {contract.lichSu.map((item, i) => {
              const iconConfig = {
                create: { bg: 'bg-blue-100', color: 'text-blue-600', icon: 'M12 4v16m8-8H4' },
                sign: { bg: 'bg-indigo-100', color: 'text-indigo-600', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                active: { bg: 'bg-cyan-100', color: 'text-cyan-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                payment: { bg: 'bg-emerald-100', color: 'text-emerald-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                pending: { bg: 'bg-amber-100', color: 'text-amber-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                expire: { bg: 'bg-slate-100', color: 'text-slate-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                cancel: { bg: 'bg-red-100', color: 'text-red-600', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
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
            {contract.trangThai === 'dang_hieu_luc' && (
              <>
                <button className="w-full py-2.5 rounded-lg border border-amber-300 text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Gia hạn hợp đồng
                </button>
                <button className="w-full py-2.5 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Kết thúc hợp đồng
                </button>
              </>
            )}
            {contract.trangThai === 'cho_ky' && (
              <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Gửi ký hợp đồng
              </button>
            )}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất PDF
              </button>
              <button className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertCard({ title, description, count, color, icon }) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có hợp đồng thuê nào</h3>
        <p className="text-slate-500 text-sm mb-8">Khi có hợp đồng thuê mới, chúng sẽ hiển thị tại đây.</p>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo hợp đồng thuê
        </button>
      </div>
    </div>
  )
}

export default function AdminHopDongThuePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState('all')
  const [filterMoiGioi, setFilterMoiGioi] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...CONTRACTS]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.ma.toLowerCase().includes(q) ||
        c.khachThue.toLowerCase().includes(q) ||
        c.chuNha.toLowerCase().includes(q) ||
        c.batDongSan.toLowerCase().includes(q)
      )
    }
    if (filterTrangThai !== 'all') result = result.filter(c => c.trangThai === filterTrangThai)
    if (filterMoiGioi !== 'Tất cả') result = result.filter(c => c.moiGioi === filterMoiGioi)

    switch (sortBy) {
      case 'expiring': result.sort((a, b) => {
        if (!a.ngayKetThuc) return 1
        if (!b.ngayKetThuc) return -1
        return new Date(a.ngayKetThuc) - new Date(b.ngayKetThuc)
      }); break
      case 'value_desc': result.sort((a, b) => b.giaThue - a.giaThue); break
      case 'value_asc': result.sort((a, b) => a.giaThue - b.giaThue); break
      default: result.sort((a, b) => {
        const dateA = a.lichSu[0]?.ngay || a.ngayBatDau || ''
        const dateB = b.lichSu[0]?.ngay || b.ngayBatDau || ''
        return new Date(dateB) - new Date(dateA)
      })
    }
    return result
  }, [searchQuery, filterTrangThai, filterMoiGioi, sortBy])

  const kpiData = useMemo(() => ({
    total: CONTRACTS.length,
    dangHieuLuc: CONTRACTS.filter(c => c.trangThai === 'dang_hieu_luc').length,
    sapHetHan: CONTRACTS.filter(c => c.trangThai === 'sap_het_han').length,
    choKy: CONTRACTS.filter(c => c.trangThai === 'cho_ky').length,
    daKetThuc: CONTRACTS.filter(c => c.trangThai === 'da_ket_thuc' || c.trangThai === 'da_huy').length,
  }), [])

  const alertData = useMemo(() => {
    const sapHetHan = CONTRACTS.filter(c => c.trangThai === 'sap_het_han')
    const treHan = CONTRACTS.filter(c => c.lichSuThanhToan.some(p => p.trangThai === 'tre_han'))
    const choKy = CONTRACTS.filter(c => c.trangThai === 'cho_ky')
    return { sapHetHan, treHan, choKy }
  }, [])

  const selectedContract = selectedId ? CONTRACTS.find(c => c.id === selectedId) : null

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý hợp đồng thuê</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi và quản lý hợp đồng thuê bất động sản</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo hợp đồng thuê
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
          label="Tổng hợp đồng thuê"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          sparkData={[6, 8, 7, 10, 9, 12, 10]}
          sparkColor="#2563eb"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          label="Đang hiệu lực"
          value={kpiData.dangHieuLuc}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          sparkData={[3, 4, 5, 4, 5, 6, 4]}
          sparkColor="#059669"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Sắp hết hạn"
          value={kpiData.sapHetHan}
          color="text-orange-600"
          bgColor="bg-orange-50"
          sparkData={[1, 1, 2, 2, 3, 3, 3]}
          sparkColor="#ea580c"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
          label="Chờ ký"
          value={kpiData.choKy}
          color="text-amber-600"
          bgColor="bg-amber-50"
          sparkData={[1, 2, 1, 2, 2, 3, 2]}
          sparkColor="#d97706"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          label="Đã kết thúc"
          value={kpiData.daKetThuc}
          color="text-slate-500"
          bgColor="bg-slate-50"
          sparkData={[1, 1, 2, 2, 2, 3, 2]}
          sparkColor="#64748b"
        />
      </div>

      {/* Alert Section */}
      {(alertData.sapHetHan.length > 0 || alertData.treHan.length > 0 || alertData.choKy.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {alertData.sapHetHan.length > 0 && (
            <AlertCard
              title="Hợp đồng sắp hết hạn"
              description={`${alertData.sapHetHan.map(c => c.ma).join(', ')} cần gia hạn hoặc đóng`}
              count={alertData.sapHetHan.length}
              color="bg-orange-50 border-orange-200 text-orange-800"
              icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          )}
          {alertData.treHan.length > 0 && (
            <AlertCard
              title="Thanh toán trễ hạn"
              description={`${alertData.treHan.length} hợp đồng có khoản thanh toán trễ`}
              count={alertData.treHan.length}
              color="bg-red-50 border-red-200 text-red-800"
              icon={<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          )}
          {alertData.choKy.length > 0 && (
            <AlertCard
              title="Hợp đồng chờ ký"
              description={`${alertData.choKy.map(c => c.ma).join(', ')} đang chờ ký kết`}
              count={alertData.choKy.length}
              color="bg-amber-50 border-amber-200 text-amber-800"
              icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
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
              placeholder="Tìm kiếm mã HĐ, khách thuê, chủ nhà..."
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

          {/* Filter: Môi giới */}
          <select
            value={filterMoiGioi}
            onChange={(e) => setFilterMoiGioi(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {MOI_GIOI_OPTIONS.map(o => <option key={o}>{o}</option>)}
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
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mã HĐ</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Khách thuê</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chủ nhà</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bất động sản</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Giá thuê</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thời hạn</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Môi giới</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
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
            <div className="w-105 shrink-0 hidden xl:block">
              <ContractDetail contract={selectedContract} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
