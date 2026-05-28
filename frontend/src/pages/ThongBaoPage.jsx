import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const NOTIFICATIONS = [
  {
    id: 1,
    loai: 'khao_sat',
    uuTien: 'quan_trong',
    daDoc: false,
    tieuDe: 'Lịch khảo sát đã được xác nhận',
    noiDung: 'Lịch khảo sát căn hộ Midtown Sài Đồng vào ngày 02/06/2025 lúc 09:00 đã được nhân viên xác nhận. Vui lòng có mặt tại địa chỉ 29 Liễu Giai, Ba Đình.',
    thoiGian: '2025-05-30T09:15:00',
    bdsId: 2,
    tenBDS: 'Căn hộ Midtown Sài Đồng',
    link: '/dashboard/lich-khao-sat',
    chiTiet: {
      nhanVien: 'Trần Văn Hùng',
      sdtNV: '0912 345 678',
      ngayKhaoSat: '02/06/2025',
      gioKhaoSat: '09:00',
      diaChi: '29 Liễu Giai, Ba Đình, Hà Nội',
    },
  },
  {
    id: 2,
    loai: 'khach_quan_tam',
    uuTien: 'quan_trong',
    daDoc: false,
    tieuDe: 'Có khách hàng mới quan tâm đến bất động sản của bạn',
    noiDung: 'Khách hàng Nguyễn Minh Anh (0901 234 567) vừa đăng ký xem biệt thự Vinhomes Cao cấp. Liên hệ ngay để chốt lịch xem nhà.',
    thoiGian: '2025-05-30T08:30:00',
    bdsId: 1,
    tenBDS: 'Biệt thự Vinhomes Cao cấp',
    link: '/dashboard/bat-dong-san/1',
    chiTiet: {
      tenKH: 'Nguyễn Minh Anh',
      sdtKH: '0901 234 567',
      loaiHinh: 'Xem nhà',
      thoiGianDangKy: '30/05/2025 08:30',
    },
  },
  {
    id: 3,
    loai: 'hop_dong',
    uuTien: 'khan_cap',
    daDoc: false,
    tieuDe: 'Hợp đồng ký gửi sắp hết hạn',
    noiDung: 'Hợp đồng ký gửi HĐKG-2025-001 cho biệt thự Vinhomes Cao cấp sẽ hết hạn vào 15/06/2025. Vui lòng liên hệ đại lý để gia hạn.',
    thoiGian: '2025-05-29T14:00:00',
    bdsId: 1,
    tenBDS: 'Biệt thự Vinhomes Cao cấp',
    link: '/dashboard/hop-dong',
    chiTiet: {
      maHD: 'HĐKG-2025-001',
      ngayHetHan: '15/06/2025',
      soNgayConLai: 16,
      trangThai: 'Còn hiệu lực',
    },
  },
  {
    id: 4,
    loai: 'tien_dam_bao',
    uuTien: 'binh_thuong',
    daDoc: false,
    tieuDe: 'Khoản tiền đảm bảo đã được cập nhật',
    noiDung: 'Khoản tiền đảm bảo 50.000.000 VNĐ cho nhà phố cổ khu phố cổ đã được ghi nhận. Trạng thái: Đang giữ.',
    thoiGian: '2025-05-29T10:45:00',
    bdsId: 3,
    tenBDS: 'Nhà phố cổ khu phố cổ',
    link: '/dashboard/tien-dam-bao',
    chiTiet: {
      soTien: '50.000.000 VNĐ',
      trangThai: 'Đang giữ',
      ngayGhiNhan: '29/05/2025',
    },
  },
  {
    id: 5,
    loai: 'hop_dong',
    uuTien: 'quan_trong',
    daDoc: false,
    tieuDe: 'Hợp đồng ký gửi đã được duyệt',
    noiDung: 'Hợp đồng ký gửi HĐKG-2025-003 cho nhà mặt phố Đống Đa đã được bộ phận pháp lý duyệt. Vui lòng đến đại lý ký hợp đồng trong vòng 7 ngày.',
    thoiGian: '2025-05-28T16:20:00',
    bdsId: 6,
    tenBDS: 'Nhà mặt phố Đống Đa',
    link: '/dashboard/hop-dong',
    chiTiet: {
      maHD: 'HĐKG-2025-003',
      ngayDuyet: '28/05/2025',
      hanKy: '04/06/2025',
      diaChiKy: 'Văn phòng đại lý - 123 Nguyễn Thái Học, Ba Đình',
    },
  },
  {
    id: 6,
    loai: 'khao_sat',
    uuTien: 'binh_thuong',
    daDoc: true,
    tieuDe: 'Kết quả khảo sát đã có',
    noiDung: 'Kết quả khảo sát biệt thự Vinhomes Cao cấp: Đánh giá Tốt. Biệt thự ở trạng thái rất tốt, phù hợp cho khách thuê cao cấp.',
    thoiGian: '2025-05-28T11:00:00',
    bdsId: 1,
    tenBDS: 'Biệt thự Vinhomes Cao cấp',
    link: '/dashboard/lich-khao-sat',
    chiTiet: {
      danhGia: 'Tốt',
      nhanVien: 'Trần Văn Hùng',
      ngayKhaoSat: '15/05/2025',
      khuyenNghi: 'Nên định giá 45-50 triệu/tháng.',
    },
  },
  {
    id: 7,
    loai: 'he_thong',
    uuTien: 'binh_thuong',
    daDoc: true,
    tieuDe: 'Cập nhật hệ thống RentFlow',
    noiDung: 'Hệ thống RentFlow đã cập nhật tính năng mới: Theo dõi tiến trình xử lý hợp đồng trực tuyến. Khám phá ngay!',
    thoiGian: '2025-05-27T09:00:00',
    bdsId: null,
    tenBDS: null,
    link: null,
    chiTiet: {
      phienBan: 'v2.5.0',
      tinhNangMoi: 'Theo dõi tiến trình xử lý hợp đồng trực tuyến',
    },
  },
  {
    id: 8,
    loai: 'khach_quan_tam',
    uuTien: 'binh_thuong',
    daDoc: true,
    tieuDe: 'Khách hàng hủy lịch xem nhà',
    noiDung: 'Khách hàng Trần Thị Mai đã hủy lịch xem căn hộ Studio Times City vào ngày 28/05/2025. Lý do: Bận việc cá nhân.',
    thoiGian: '2025-05-27T08:15:00',
    bdsId: 5,
    tenBDS: 'Căn hộ Studio Times City',
    link: '/dashboard/bat-dong-san/5',
    chiTiet: {
      tenKH: 'Trần Thị Mai',
      lyDo: 'Bận việc cá nhân',
      ngayHuy: '27/05/2025',
    },
  },
  {
    id: 9,
    loai: 'tien_dam_bao',
    uuTien: 'khan_cap',
    daDoc: false,
    tieuDe: 'Yêu cầu hoàn trả tiền đảm bảo',
    noiDung: 'Bất động sản "Căn hộ Studio Times City" đã quá 6 tháng chưa cho thuê. Bạn có thể yêu cầu hoàn trả khoản tiền đảm bảo 30.000.000 VNĐ.',
    thoiGian: '2025-05-26T15:30:00',
    bdsId: 5,
    tenBDS: 'Căn hộ Studio Times City',
    link: '/dashboard/tien-dam-bao',
    chiTiet: {
      soTien: '30.000.000 VNĐ',
      thoiGianKhongChoThue: '7 tháng',
      trangThai: 'Chờ xử lý hoàn trả',
    },
  },
  {
    id: 10,
    loai: 'khao_sat',
    uuTien: 'binh_thuong',
    daDoc: true,
    tieuDe: 'Lịch khảo sát đã được lên',
    noiDung: 'Lịch khảo sát kiot mặt đường Kim Mã đã được lên cho ngày 03/06/2025 lúc 14:30. Nhân viên: Lê Quốc Anh.',
    thoiGian: '2025-05-26T10:00:00',
    bdsId: 8,
    tenBDS: 'Kiot mặt đường Kim Mã',
    link: '/dashboard/lich-khao-sat',
    chiTiet: {
      nhanVien: 'Lê Quốc Anh',
      ngayKhaoSat: '03/06/2025',
      gioKhaoSat: '14:30',
      diaChi: '142 Kim Mã, Ba Đình, Hà Nội',
    },
  },
  {
    id: 11,
    loai: 'hop_dong',
    uuTien: 'binh_thuong',
    daDoc: true,
    tieuDe: 'Hợp đồng ký gửi đã có hiệu lực',
    noiDung: 'Hợp đồng ký gửi HĐKG-2025-002 cho biệt thự sân vườn Tây Hồ đã chính thức có hiệu lực từ 25/05/2025.',
    thoiGian: '2025-05-25T09:00:00',
    bdsId: 4,
    tenBDS: 'Biệt thự sân vườn Tây Hồ',
    link: '/dashboard/hop-dong',
    chiTiet: {
      maHD: 'HĐKG-2025-002',
      ngayHieuLuc: '25/05/2025',
      ngayKetThuc: '25/05/2026',
    },
  },
  {
    id: 12,
    loai: 'he_thong',
    uuTien: 'quan_trong',
    daDoc: false,
    tieuDe: 'Yêu cầu cập nhật thông tin cá nhân',
    noiDung: 'Hồ sơ của bạn đang thiếu thông tin số CMND/CCCD và địa chỉ thường trú. Vui lòng cập nhật để hoàn tất quy trình ký gửi.',
    thoiGian: '2025-05-24T14:00:00',
    bdsId: null,
    tenBDS: null,
    link: '/dashboard/ho-so',
    chiTiet: {
      thongTinThieu: ['Số CMND/CCCD', 'Địa chỉ thường trú'],
      hanCapNhat: '07/06/2025',
    },
  },
]

const LOAI_CONFIG = {
  khao_sat: {
    label: 'Khảo sát',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </>
    ),
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  hop_dong: {
    label: 'Hợp đồng',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </>
    ),
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  khach_quan_tam: {
    label: 'Khách quan tâm',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </>
    ),
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
  tien_dam_bao: {
    label: 'Tiền đảm bảo',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </>
    ),
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
  },
  he_thong: {
    label: 'Hệ thống',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
    borderColor: 'border-slate-200',
  },
}

const UU_TIEN_CONFIG = {
  binh_thuong: { label: 'Bình thường', dot: 'bg-slate-300' },
  quan_trong: { label: 'Quan trọng', dot: 'bg-amber-400' },
  khan_cap: { label: 'Khẩn cấp', dot: 'bg-red-500' },
}

const TAB_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'chua_doc', label: 'Chưa đọc' },
  { key: 'khao_sat', label: 'Khảo sát' },
  { key: 'hop_dong', label: 'Hợp đồng' },
  { key: 'khach_quan_tam', label: 'Khách quan tâm' },
  { key: 'tien_dam_bao', label: 'Tiền đảm bảo' },
  { key: 'he_thong', label: 'Hệ thống' },
]

function formatTimeAgo(dateStr) {
  const now = new Date('2025-05-30T12:00:00')
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatFullTime(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function KPICard({ icon, label, value, color, bgColor, accent }) {
  return (
    <div className={`bg-white rounded-xl border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden ${accent ? 'border-amber-200' : 'border-outline-variant'}`}>
      {accent && <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-3xl font-bold text-on-surface">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className={color}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

function PriorityAlert({ notification, onRead, onSelect }) {
  const loai = LOAI_CONFIG[notification.loai]
  const isUrgent = notification.uuTien === 'khan_cap'

  return (
    <div className={`rounded-xl border p-4 ${isUrgent ? 'bg-red-50/50 border-red-200' : 'bg-amber-50/50 border-amber-200'} hover:shadow-md transition-all cursor-pointer`}
      onClick={() => onSelect(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${isUrgent ? 'bg-red-100' : 'bg-amber-100'} flex items-center justify-center shrink-0`}>
          {isUrgent ? (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${isUrgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              {isUrgent ? 'Khẩn cấp' : 'Quan trọng'}
            </span>
            <span className="text-xs text-on-surface-variant">{formatTimeAgo(notification.thoiGian)}</span>
          </div>
          <h4 className="text-sm font-semibold text-on-surface mb-1">{notification.tieuDe}</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{notification.noiDung}</p>
        </div>
        {!notification.daDoc && (
          <button
            onClick={(e) => { e.stopPropagation(); onRead(notification.id) }}
            className="shrink-0 text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>
    </div>
  )
}

function NotificationCard({ notification, isSelected, onSelect, onRead, onDelete }) {
  const loai = LOAI_CONFIG[notification.loai]
  const uuTien = UU_TIEN_CONFIG[notification.uuTien]

  return (
    <div
      onClick={() => onSelect(notification.id)}
      className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : notification.daDoc ? 'border-outline-variant' : 'border-outline-variant border-l-4 border-l-blue-500'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={`w-10 h-10 rounded-xl ${loai.bgColor} flex items-center justify-center shrink-0`}>
            <svg className={`w-5 h-5 ${loai.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {loai.icon}
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${loai.bgColor} ${loai.iconColor}`}>
                {loai.label}
              </span>
              {!notification.daDoc && (
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Chưa đọc" />
              )}
              {notification.uuTien !== 'binh_thuong' && (
                <span className={`w-2 h-2 rounded-full ${uuTien.dot} shrink-0`} title={uuTien.label} />
              )}
              <span className="text-xs text-on-surface-variant ml-auto whitespace-nowrap">{formatTimeAgo(notification.thoiGian)}</span>
            </div>
            <h4 className={`text-sm mb-1 ${notification.daDoc ? 'font-medium text-on-surface-variant' : 'font-semibold text-on-surface'}`}>
              {notification.tieuDe}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{notification.noiDung}</p>

            {/* Property link */}
            {notification.tenBDS && (
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate">{notification.tenBDS}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1 shrink-0">
            {!notification.daDoc && (
              <button
                onClick={(e) => { e.stopPropagation(); onRead(notification.id) }}
                className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors"
                title="Đánh dấu đã đọc"
              >
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
              title="Xóa thông báo"
            >
              <svg className="w-4 h-4 text-slate-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationDetail({ notification, onClose, onRead }) {
  if (!notification) return null
  const loai = LOAI_CONFIG[notification.loai]
  const uuTien = UU_TIEN_CONFIG[notification.uuTien]

  const detailSections = []
  if (notification.chiTiet) {
    Object.entries(notification.chiTiet).forEach(([key, value]) => {
      const labels = {
        nhanVien: 'Nhân viên phụ trách',
        sdtNV: 'Số điện thoại',
        ngayKhaoSat: 'Ngày khảo sát',
        gioKhaoSat: 'Giờ khảo sát',
        diaChi: 'Địa chỉ',
        tenKH: 'Khách hàng',
        sdtKH: 'Số điện thoại',
        loaiHinh: 'Loại hình',
        thoiGianDangKy: 'Thời gian đăng ký',
        maHD: 'Mã hợp đồng',
        ngayHetHan: 'Ngày hết hạn',
        soNgayConLai: 'Số ngày còn lại',
        trangThai: 'Trạng thái',
        ngayDuyet: 'Ngày duyệt',
        hanKy: 'Hạn ký',
        diaChiKy: 'Địa chỉ ký',
        ngayHieuLuc: 'Ngày hiệu lực',
        ngayKetThuc: 'Ngày kết thúc',
        soTien: 'Số tiền',
        ngayGhiNhan: 'Ngày ghi nhận',
        thoiGianKhongChoThue: 'Thời gian không cho thuê',
        danhGia: 'Đánh giá',
        khuyenNghi: 'Khuyến nghị',
        lyDo: 'Lý do',
        ngayHuy: 'Ngày hủy',
        phienBan: 'Phiên bản',
        tinhNangMoi: 'Tính năng mới',
        thongTinThieu: 'Thông tin thiếu',
        hanCapNhat: 'Hạn cập nhật',
      }
      if (key === 'sdtNV' || key === 'sdtKH') {
        detailSections.push(
          <div key={key} className="flex items-center justify-between py-2">
            <span className="text-sm text-on-surface-variant">{labels[key] || key}</span>
            <a href={`tel:${String(value).replace(/\s/g, '')}`} className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              {value}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        )
      } else if (key === 'soNgayConLai') {
        detailSections.push(
          <div key={key} className="flex items-center justify-between py-2">
            <span className="text-sm text-on-surface-variant">{labels[key] || key}</span>
            <span className={`text-sm font-semibold ${value <= 7 ? 'text-red-600' : value <= 14 ? 'text-amber-600' : 'text-on-surface'}`}>{value} ngày</span>
          </div>
        )
      } else if (Array.isArray(value)) {
        detailSections.push(
          <div key={key} className="py-2">
            <span className="text-sm text-on-surface-variant block mb-2">{labels[key] || key}</span>
            <div className="space-y-1">
              {value.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )
      } else {
        detailSections.push(
          <div key={key} className="flex items-center justify-between py-2">
            <span className="text-sm text-on-surface-variant">{labels[key] || key}</span>
            <span className="text-sm text-on-surface font-medium">{value}</span>
          </div>
        )
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className={`bg-linear-to-r ${notification.uuTien === 'khan_cap' ? 'from-red-600 to-red-700' : 'from-blue-600 to-indigo-700'} p-5`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {loai.icon}
              </svg>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-0.5">{loai.label}</p>
              <h3 className="text-white font-bold text-base leading-snug">{notification.tieuDe}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${notification.uuTien === 'khan_cap' ? 'bg-red-900/40 text-red-200' : notification.uuTien === 'quan_trong' ? 'bg-amber-900/40 text-amber-200' : 'bg-white/10 text-white/70'}`}>
            {uuTien.label}
          </span>
          <span className="text-white/60 text-xs">{formatFullTime(notification.thoiGian)}</span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Full Content */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Nội dung</h4>
          <p className="text-sm text-on-surface leading-relaxed">{notification.noiDung}</p>
        </div>

        {/* Property Info */}
        {notification.tenBDS && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Bất động sản liên quan</p>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium text-blue-800">{notification.tenBDS}</span>
            </div>
          </div>
        )}

        {/* Detail Info */}
        {detailSections.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Chi tiết</h4>
            <div className="bg-slate-50 rounded-lg p-4 divide-y divide-slate-100">
              {detailSections}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        {notification.link && (
          <div className="flex gap-2">
            <Link
              to={notification.link}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors"
            >
              {notification.loai === 'khao_sat' && 'Xem lịch khảo sát'}
              {notification.loai === 'hop_dong' && 'Xem hợp đồng'}
              {notification.loai === 'khach_quan_tam' && 'Xem bất động sản'}
              {notification.loai === 'tien_dam_bao' && 'Xem tiền đảm bảo'}
              {notification.loai === 'he_thong' && 'Cập nhật ngay'}
            </Link>
          </div>
        )}

        {/* Mark as Read */}
        {!notification.daDoc && (
          <button
            onClick={() => onRead(notification.id)}
            className="w-full py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            Đánh dấu đã đọc
          </button>
        )}
      </div>
    </div>
  )
}

function ActivityTimeline({ notifications }) {
  const recent = [...notifications]
    .sort((a, b) => new Date(b.thoiGian) - new Date(a.thoiGian))
    .slice(0, 8)

  return (
    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
      <div className="p-4 border-b border-outline-variant">
        <h3 className="font-semibold text-on-surface">Hoạt động gần đây</h3>
        <p className="text-xs text-on-surface-variant mt-0.5">Cập nhật hệ thống và trạng thái workflow</p>
      </div>
      <div className="p-4">
        <div className="space-y-0">
          {recent.map((n, i) => {
            const loai = LOAI_CONFIG[n.loai]
            return (
              <div key={n.id} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg ${loai.bgColor} flex items-center justify-center shrink-0`}>
                    <svg className={`w-4 h-4 ${loai.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {loai.icon}
                    </svg>
                  </div>
                  {i < recent.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-on-surface font-medium leading-snug">{n.tieuDe}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-on-surface-variant">{formatTimeAgo(n.thoiGian)}</span>
                    {!n.daDoc && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Bạn chưa có thông báo nào</h3>
        <p className="text-on-surface-variant text-sm mb-8">
          Mọi cập nhật về bất động sản, hợp đồng, lịch khảo sát sẽ hiển thị tại đây.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Về trang tổng quan
        </Link>
      </div>
    </div>
  )
}

export default function ThongBaoPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...notifications]
    if (activeTab === 'chua_doc') {
      result = result.filter(n => !n.daDoc)
    } else if (activeTab !== 'all') {
      result = result.filter(n => n.loai === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(n =>
        n.tieuDe.toLowerCase().includes(q) ||
        n.noiDung.toLowerCase().includes(q) ||
        (n.tenBDS && n.tenBDS.toLowerCase().includes(q))
      )
    }
    return result.sort((a, b) => new Date(b.thoiGian) - new Date(a.thoiGian))
  }, [notifications, activeTab, searchQuery])

  const kpiData = useMemo(() => ({
    total: notifications.length,
    chuaDoc: notifications.filter(n => !n.daDoc).length,
    quanTrong: notifications.filter(n => n.uuTien !== 'binh_thuong').length,
    homNay: notifications.filter(n => {
      const today = new Date('2025-05-30')
      const d = new Date(n.thoiGian)
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    }).length,
  }), [notifications])

  const priorityNotifications = useMemo(() =>
    notifications.filter(n => n.uuTien !== 'binh_thuong' && !n.daDoc),
  [notifications])

  const selectedNotification = selectedId ? notifications.find(n => n.id === selectedId) : null

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, daDoc: true } : n))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, daDoc: true })))
  }

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Thông báo</h1>
          <p className="text-on-surface-variant text-sm mt-1">Theo dõi các cập nhật mới nhất từ hệ thống</p>
        </div>
        {kpiData.chuaDoc > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
          label="Tổng thông báo"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          label="Chưa đọc"
          value={kpiData.chuaDoc}
          color="text-amber-600"
          bgColor="bg-amber-50"
          accent
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          label="Quan trọng"
          value={kpiData.quanTrong}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Hôm nay"
          value={kpiData.homNay}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Priority Notifications */}
      {priorityNotifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Thông báo ưu tiên
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {priorityNotifications.map(n => (
              <PriorityAlert key={n.id} notification={n} onRead={handleMarkRead} onSelect={setSelectedId} />
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-outline-variant p-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {TAB_OPTIONS.map(tab => {
              const count = tab.key === 'all'
                ? notifications.length
                : tab.key === 'chua_doc'
                  ? notifications.filter(n => !n.daDoc).length
                  : notifications.filter(n => n.loai === tab.key).length
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSelectedId(null) }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-on-surface-variant hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-blue-200' : 'text-on-surface-variant/60'}`}>
                      ({count})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm thông báo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          {/* Main Column: List + Timeline */}
          <div className="flex-1 min-w-0">
            {/* Notification List */}
            <div className="space-y-3 mb-6">
              {filtered.map(n => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  isSelected={selectedId === n.id}
                  onSelect={setSelectedId}
                  onRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Activity Timeline */}
            <ActivityTimeline notifications={notifications} />
          </div>

          {/* Detail Panel */}
          {selectedNotification && (
            <div className="w-[420px] shrink-0 hidden xl:block">
              <NotificationDetail
                notification={selectedNotification}
                onClose={() => setSelectedId(null)}
                onRead={handleMarkRead}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
