import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const SURVEYS = [
  {
    id: 1,
    tenBDS: 'Căn hộ Midtown Sài Đồng',
    bdsId: 2,
    ngayKhaoSat: '2025-06-02',
    gioKhaoSat: '09:00',
    diaChi: '29 Liễu Giai, Ba Đình, Hà Nội',
    nhanVien: 'Trần Văn Hùng',
    sdtNV: '0912 345 678',
    chucVu: 'Môi giới cao cấp',
    status: 'cho_xac_nhan',
    ghiChu: 'Cần kiểm tra nội thất và hệ thống điện nước. Chủ nhà có mặt lúc khảo sát.',
    ketQua: null,
    hinhAnh: [],
    workflowStep: 2,
    ngayDangKy: '2025-05-25',
  },
  {
    id: 2,
    tenBDS: 'Kiot mặt đường Kim Mã',
    bdsId: 8,
    ngayKhaoSat: '2025-06-03',
    gioKhaoSat: '14:30',
    diaChi: '142 Kim Mã, Ba Đình, Hà Nội',
    nhanVien: 'Lê Quốc Anh',
    sdtNV: '0987 654 321',
    chucVu: 'Môi giới',
    status: 'cho_xac_nhan',
    ghiChu: 'Kiot mặt đường, cần đánh giá lưu lượng người qua lại và tiềm năng kinh doanh.',
    ketQua: null,
    hinhAnh: [],
    workflowStep: 2,
    ngayDangKy: '2025-05-28',
  },
  {
    id: 3,
    tenBDS: 'Nhà phố cổ khu phố cổ',
    bdsId: 3,
    ngayKhaoSat: '2025-05-28',
    gioKhaoSat: '10:00',
    diaChi: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    nhanVien: 'Trần Văn Hùng',
    sdtNV: '0912 345 678',
    chucVu: 'Môi giới cao cấp',
    status: 'da_xac_nhan',
    ghiChu: 'Nhà phố kinh doanh, cần kiểm tra kết cấu và giấy phép kinh doanh.',
    ketQua: null,
    hinhAnh: [],
    workflowStep: 2,
    ngayDangKy: '2025-05-20',
  },
  {
    id: 4,
    tenBDS: 'Biệt thự Vinhomes Cao cấp',
    bdsId: 1,
    ngayKhaoSat: '2025-05-15',
    gioKhaoSat: '08:30',
    diaChi: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    nhanVien: 'Trần Văn Hùng',
    sdtNV: '0912 345 678',
    chucVu: 'Môi giới cao cấp',
    status: 'da_hoan_thanh',
    ghiChu: 'Biệt thự cao cấp, kiểm tra toàn bộ tiện ích và hồ bơi.',
    ketQua: {
      danhGia: 'Tốt',
      chiTiet: 'Bất động sản ở trạng thái rất tốt. Kết cấu vững chắc, nội thất cao cấp, hồ bơi và sân vườn được bảo trì tốt. Phù hợp cho khách thuê cao cấp.',
      khuyenNghi: 'Nên định giá 45-50 triệu/tháng. Có thể tiếp xúc khách thuê doanh nhân nước ngoài.',
      trangThaiXuLy: 'Chờ ký hợp đồng',
      hinhAnh: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      ],
    },
    hinhAnh: [],
    workflowStep: 3,
    ngayDangKy: '2025-05-10',
  },
  {
    id: 5,
    tenBDS: 'Nhà mặt phố Đống Đa',
    bdsId: 6,
    ngayKhaoSat: '2025-04-20',
    gioKhaoSat: '15:00',
    diaChi: '88 Láng Hạ, Đống Đa, Hà Nội',
    nhanVien: 'Lê Quốc Anh',
    sdtNV: '0987 654 321',
    chucVu: 'Môi giới',
    status: 'da_hoan_thanh',
    ghiChu: 'Nhà mặt phố, kiểm tra mặt tiền và chỗ để xe.',
    ketQua: {
      danhGia: 'Khá',
      chiTiet: 'Nhà mặt tiền rộng, vị trí kinh doanh tốt. Cần sửa chữa nhẹ phần mái và sơn lại tường. Chỗ để xe đủ cho 2 ô tô.',
      khuyenNghi: 'Nên sửa chữa nhỏ trước khi cho thuê. Định giá 20-22 triệu/tháng.',
      trangThaiXuLy: 'Đang hiển thị',
      hinhAnh: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      ],
    },
    hinhAnh: [],
    workflowStep: 4,
    ngayDangKy: '2025-04-15',
  },
  {
    id: 6,
    tenBDS: 'Căn hộ Studio Times City',
    bdsId: 5,
    ngayKhaoSat: '2025-05-10',
    gioKhaoSat: '11:00',
    diaChi: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    nhanVien: 'Lê Quốc Anh',
    sdtNV: '0987 654 321',
    chucVu: 'Môi giới',
    status: 'da_huy',
    ghiChu: 'Chủ nhà yêu cầu hủy do việc cá nhân.',
    ketQua: null,
    hinhAnh: [],
    workflowStep: 2,
    ngayDangKy: '2025-05-05',
    lyDoHuy: 'Chủ nhà bận việc cá nhân, yêu cầu dời lịch.',
  },
  {
    id: 7,
    tenBDS: 'Biệt thự sân vườn Tây Hồ',
    bdsId: 4,
    ngayKhaoSat: '2025-03-10',
    gioKhaoSat: '09:00',
    diaChi: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    nhanVien: 'Trần Văn Hùng',
    sdtNV: '0912 345 678',
    chucVu: 'Môi giới cao cấp',
    status: 'da_hoan_thanh',
    ghiChu: 'Biệt thự sân vườn, kiểm tra toàn bộ khuôn viên.',
    ketQua: {
      danhGia: 'Xuất sắc',
      chiTiet: 'Biệt thự sân vườn rộng 450m², khu vực yên tĩnh gần hồ Tây. Bể bơi riêng, garage 2 xe, an ninh 24/7. Trạng thái hoàn hảo.',
      khuyenNghi: 'Định giá 60-65 triệu/tháng. Khách mục tiêu: chuyên gia nước ngoài, lãnh đạo doanh nghiệp.',
      trangThaiXuLy: 'Đã cho thuê',
      hinhAnh: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop',
      ],
    },
    hinhAnh: [],
    workflowStep: 5,
    ngayDangKy: '2025-03-05',
  },
]

const STATUS_CONFIG = {
  cho_xac_nhan: { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  da_xac_nhan: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  da_hoan_thanh: { label: 'Đã hoàn thành', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  da_huy: { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

const WORKFLOW_STEPS = [
  { key: 'dang_ky', label: 'Đăng ký' },
  { key: 'cho_khao_sat', label: 'Chờ khảo sát' },
  { key: 'da_khao_sat', label: 'Đã khảo sát' },
  { key: 'cho_ky_hd', label: 'Chờ ký HĐ' },
  { key: 'dang_xu_ly', label: 'Đang xử lý' },
]

const TAB_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
  { key: 'da_xac_nhan', label: 'Đã xác nhận' },
  { key: 'da_hoan_thanh', label: 'Đã hoàn thành' },
  { key: 'da_huy', label: 'Đã hủy' },
]

const DAYS_VN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

function getDayOfWeek(dateStr) {
  return DAYS_VN[new Date(dateStr).getDay()]
}

function KPICard({ icon, label, value, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
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
              <span className={`text-[10px] mt-1.5 text-center leading-tight whitespace-nowrap ${isCurrent ? 'text-amber-700 font-semibold' : isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
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

function CalendarView({ surveys, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const monthName = new Date(year, month).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  const surveysByDate = useMemo(() => {
    const map = {}
    surveys.forEach(s => {
      const d = s.ngayKhaoSat
      if (!map[d]) map[d] = []
      map[d].push(s)
    })
    return map
  }, [surveys])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrevMonth - firstDay + 1 + i, isCurrentMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true })
  }
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, isCurrentMonth: false })
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant">
        <h3 className="text-base font-semibold text-on-surface capitalize">{monthName}</h3>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-outline-variant">
        {DAYS_VN.map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-on-surface-variant">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dateStr = cell.isCurrentMonth
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
            : null
          const daySurveys = dateStr ? (surveysByDate[dateStr] || []) : []
          const isToday = cell.isCurrentMonth && cell.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()

          return (
            <div
              key={i}
              onClick={() => daySurveys.length > 0 && onSelectDate(dateStr)}
              className={`min-h-[80px] p-1.5 border-b border-r border-slate-100 ${
                cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/50'
              } ${daySurveys.length > 0 ? 'cursor-pointer hover:bg-blue-50/50' : ''}`}
            >
              <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                isToday ? 'bg-blue-600 text-white' : cell.isCurrentMonth ? 'text-on-surface' : 'text-slate-400'
              }`}>
                {cell.day}
              </div>
              {daySurveys.map(s => {
                const cfg = STATUS_CONFIG[s.status]
                return (
                  <div key={s.id} className={`px-1.5 py-0.5 rounded text-[10px] font-medium mb-0.5 truncate ${cfg.color}`}>
                    {s.gioKhaoSat} {s.tenBDS.split(' ').slice(0, 2).join(' ')}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SurveyCard({ survey, isSelected, onSelect }) {
  const status = STATUS_CONFIG[survey.status]
  return (
    <div
      onClick={() => onSelect(survey.id)}
      className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <span className="text-blue-600 text-sm font-bold">{survey.gioKhaoSat}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">{getDayOfWeek(survey.ngayKhaoSat)}, {formatDateShort(survey.ngayKhaoSat)}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
        </div>

        <h3 className="font-semibold text-on-surface mb-1">{survey.tenBDS}</h3>
        <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{survey.diaChi}</span>
        </p>

        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{survey.nhanVien} – {survey.chucVu}</span>
        </div>
      </div>
    </div>
  )
}

function SurveyDetail({ survey, onClose }) {
  if (!survey) return null
  const status = STATUS_CONFIG[survey.status]

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs mb-1">Lịch khảo sát</p>
            <h3 className="text-white font-bold text-lg">{survey.tenBDS}</h3>
            <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
              ● {status.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Date & Time */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex flex-col items-center justify-center text-white shrink-0">
              <span className="text-xs font-medium leading-none">{getDayOfWeek(survey.ngayKhaoSat)}</span>
              <span className="text-xl font-bold leading-none mt-0.5">{new Date(survey.ngayKhaoSat).getDate()}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-on-surface">{formatDate(survey.ngayKhaoSat)}</p>
              <p className="text-sm text-on-surface-variant">Giờ khảo sát: <strong className="text-on-surface">{survey.gioKhaoSat}</strong></p>
            </div>
          </div>
        </div>

        {/* Workflow */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiến trình xử lý</h4>
          <WorkflowTimeline currentStep={survey.workflowStep} />
        </div>

        {/* Staff Info */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Nhân viên phụ trách</h4>
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-semibold text-sm">{survey.nhanVien.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface">{survey.nhanVien}</p>
              <p className="text-sm text-on-surface-variant">{survey.chucVu}</p>
            </div>
            <a href={`tel:${survey.sdtNV.replace(/\s/g, '')}`} className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors" title={survey.sdtNV}>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5 ml-1">SĐT: {survey.sdtNV}</p>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Địa chỉ khảo sát</h4>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-on-surface flex items-start gap-2">
              <svg className="w-4 h-4 text-on-surface-variant mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {survey.diaChi}
            </p>
          </div>
        </div>

        {/* Notes */}
        {survey.ghiChu && (
          <div>
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Ghi chú khảo sát</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed bg-amber-50 p-4 rounded-lg border border-amber-100">
              {survey.ghiChu}
            </p>
          </div>
        )}

        {/* Cancel Reason */}
        {survey.lyDoHuy && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">Lý do hủy</h4>
            <p className="text-sm text-red-600">{survey.lyDoHuy}</p>
          </div>
        )}

        {/* Survey Result */}
        {survey.ketQua && (
          <div>
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Kết quả khảo sát</h4>
            <div className="space-y-3">
              {/* Rating */}
              <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  survey.ketQua.danhGia === 'Xuất sắc' ? 'bg-emerald-500' :
                  survey.ketQua.danhGia === 'Tốt' ? 'bg-blue-500' : 'bg-amber-500'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Đánh giá: {survey.ketQua.danhGia}</p>
                  <p className="text-xs text-on-surface-variant">Trạng thái: {survey.ketQua.trangThaiXuLy}</p>
                </div>
              </div>

              {/* Detail */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Chi tiết</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{survey.ketQua.chiTiet}</p>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Khuyến nghị</p>
                <p className="text-sm text-blue-800 leading-relaxed">{survey.ketQua.khuyenNghi}</p>
              </div>

              {/* Photos */}
              {survey.ketQua.hinhAnh?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Hình ảnh khảo sát</p>
                  <div className="grid grid-cols-2 gap-2">
                    {survey.ketQua.hinhAnh.map((img, i) => (
                      <img key={i} src={img} alt={`Khảo sát ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {survey.status === 'cho_xac_nhan' && (
            <>
              <button className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors">
                Xác nhận lịch
              </button>
              <button className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-slate-50 transition-colors">
                Đổi lịch
              </button>
            </>
          )}
          {(survey.status === 'cho_xac_nhan' || survey.status === 'da_xac_nhan') && (
            <button className="py-2.5 px-4 rounded-lg border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-colors">
              Hủy lịch
            </button>
          )}
          <a
            href={`tel:${survey.sdtNV.replace(/\s/g, '')}`}
            className="py-2.5 px-4 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-slate-50 transition-colors"
            title="Liên hệ nhân viên"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-20">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Chưa có lịch khảo sát nào</h3>
        <p className="text-on-surface-variant text-sm mb-8">
          Đăng ký ký gửi bất động sản để được lên lịch khảo sát với nhân viên đại lý.
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

export default function LichKhaoSatPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...SURVEYS]
    if (activeTab !== 'all') result = result.filter(s => s.status === activeTab)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.tenBDS.toLowerCase().includes(q) ||
        s.diaChi.toLowerCase().includes(q) ||
        s.nhanVien.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeTab, searchQuery])

  const kpiData = useMemo(() => ({
    total: SURVEYS.length,
    choXacNhan: SURVEYS.filter(s => s.status === 'cho_xac_nhan').length,
    daXacNhan: SURVEYS.filter(s => s.status === 'da_xac_nhan').length,
    daHoanThanh: SURVEYS.filter(s => s.status === 'da_hoan_thanh').length,
  }), [])

  const selectedSurvey = selectedId ? SURVEYS.find(s => s.id === selectedId) : null

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Lịch khảo sát</h1>
        <p className="text-on-surface-variant text-sm mt-1">Theo dõi lịch hẹn khảo sát bất động sản với đại lý</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          label="Tổng lịch khảo sát"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Chờ xác nhận"
          value={kpiData.choXacNhan}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đã xác nhận"
          value={kpiData.daXacNhan}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>}
          label="Đã hoàn thành"
          value={kpiData.daHoanThanh}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-outline-variant p-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {TAB_OPTIONS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedId(null) }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-on-surface-variant hover:bg-slate-50'}`}
                title="Danh sách"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 transition-colors ${viewMode === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-on-surface-variant hover:bg-slate-50'}`}
                title="Lịch"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'calendar' ? (
        <CalendarView surveys={filtered} onSelectDate={() => setViewMode('list')} />
      ) : (
        <div className="flex gap-6">
          {/* Survey List */}
          <div className="flex-1">
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map(survey => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  isSelected={selectedId === survey.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedSurvey && (
            <div className="w-[420px] shrink-0 hidden xl:block">
              <SurveyDetail survey={selectedSurvey} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}