import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const CONTRACTS = [
  {
    id: 1,
    maHopDong: 'HDKG-2025-001',
    tenBDS: 'Biệt thự Vinhomes Cao cấp',
    bdsId: 1,
    ngayKy: '2024-12-20',
    ngayBatDau: '2025-01-01',
    ngayKetThuc: '2026-01-01',
    thoiHan: '12 tháng',
    tienDamBao: 10000000,
    phiKyGui: '5%/năm',
    giaThueDeXuat: '45 triệu/tháng',
    status: 'dang_hieu_luc',
    daiDienDaiLy: 'Nguyễn Thị Minh – Trưởng phòng Pháp lý',
    moiGioi: 'Trần Văn Hùng – Môi giới cao cấp',
    diaChiBDS: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    dienTich: '320 m²',
    loaiBDS: 'Biệt thự',
    dieuKhoanPhatSinh: 'Điều 7: Chủ nhà chịu phí sửa chữa cấu trúc. Điều 8: Đại lý được quyền quảng cáo trên các nền tảng đối tác.',
    dieuKienChamDut: 'Hợp đồng chấm dứt khi: (1) Hết hạn không gia hạn, (2) Vi phạm điều khoản, (3) Thỏa thuận hai bên.',
    tienDamBaoTrangThai: 'dang_giu',
    workflowStep: 5,
    lichSu: [
      { ngay: '2024-12-15', noiDung: 'Tạo hợp đồng', icon: 'create' },
      { ngay: '2024-12-18', noiDung: 'Pháp lý duyệt', icon: 'legal' },
      { ngay: '2024-12-20', noiDung: 'Ký kết hợp đồng', icon: 'sign' },
      { ngay: '2025-01-01', noiDung: 'Có hiệu lực', icon: 'active' },
    ],
  },
  {
    id: 2,
    maHopDong: 'HDKG-2025-002',
    tenBDS: 'Căn hộ Midtown Sài Đồng',
    bdsId: 2,
    ngayKy: '2025-01-12',
    ngayBatDau: '2025-02-01',
    ngayKetThuc: '2026-02-01',
    thoiHan: '12 tháng',
    tienDamBao: 5000000,
    phiKyGui: '5%/năm',
    giaThueDeXuat: '15 triệu/tháng',
    status: 'cho_duyet',
    daiDienDaiLy: 'Nguyễn Thị Minh – Trưởng phòng Pháp lý',
    moiGioi: 'Lê Quốc Anh – Môi giới',
    diaChiBDS: '29 Liễu Giai, Ba Đình, Hà Nội',
    dienTich: '95 m²',
    loaiBDS: 'Căn hộ',
    dieuKhoanPhatSinh: 'Điều 7: Nội thất do chủ nhà cung cấp. Điều 8: Đại lý chịu phí quảng cáo.',
    dieuKienChamDut: 'Hợp đồng chấm dứt khi: (1) Hết hạn không gia hạn, (2) Vi phạm điều khoản, (3) Thỏa thuận hai bên.',
    tienDamBaoTrangThai: 'cho_duyet',
    workflowStep: 3,
    lichSu: [
      { ngay: '2025-01-10', noiDung: 'Tạo hợp đồng', icon: 'create' },
      { ngay: '2025-01-12', noiDung: 'Chờ pháp lý duyệt', icon: 'legal' },
    ],
  },
  {
    id: 3,
    maHopDong: 'HDKG-2024-015',
    tenBDS: 'Nhà phố cổ khu phố cổ',
    bdsId: 3,
    ngayKy: '2025-01-22',
    ngayBatDau: '2025-02-01',
    ngayKetThuc: '2026-02-01',
    thoiHan: '12 tháng',
    tienDamBao: 8000000,
    phiKyGui: '5%/năm',
    giaThueDeXuat: '28 triệu/tháng',
    status: 'cho_ky',
    daiDienDaiLy: 'Phạm Thị Hương – Phó phòng Pháp lý',
    moiGioi: 'Trần Văn Hùng – Môi giới cao cấp',
    diaChiBDS: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    dienTich: '65 m²',
    loaiBDS: 'Nhà phố',
    dieuKhoanPhatSinh: 'Điều 7: Nhà phố kinh doanh, chủ nhà chịu phí cấp phép. Điều 8: Đại lý hỗ trợ thủ tục pháp lý.',
    dieuKienChamDut: 'Hợp đồng chấm dứt khi: (1) Hết hạn không gia hạn, (2) Vi phạm điều khoản, (3) Thỏa thuận hai bên.',
    tienDamBaoTrangThai: 'cho_duyet',
    workflowStep: 4,
    lichSu: [
      { ngay: '2025-01-18', noiDung: 'Tạo hợp đồng', icon: 'create' },
      { ngay: '2025-01-20', noiDung: 'Pháp lý duyệt', icon: 'legal' },
      { ngay: '2025-01-22', noiDung: 'Chờ ký kết', icon: 'sign' },
    ],
  },
  {
    id: 4,
    maHopDong: 'HDKG-2024-008',
    tenBDS: 'Biệt thự sân vườn Tây Hồ',
    bdsId: 4,
    ngayKy: '2024-11-10',
    ngayBatDau: '2024-12-01',
    ngayKetThuc: '2025-12-01',
    thoiHan: '12 tháng',
    tienDamBao: 15000000,
    phiKyGui: '4%/năm',
    giaThueDeXuat: '65 triệu/tháng',
    status: 'da_ket_thuc',
    daiDienDaiLy: 'Nguyễn Thị Minh – Trưởng phòng Pháp lý',
    moiGioi: 'Trần Văn Hùng – Môi giới cao cấp',
    diaChiBDS: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    dienTich: '450 m²',
    loaiBDS: 'Biệt thự',
    dieuKhoanPhatSinh: 'Điều 7: Bể bơi và sân vườn do chủ nhà bảo trì. Điều 8: Đại lý thu hoa hồng 4%.',
    dieuKienChamDut: 'Hợp đồng đã kết thúc theo thỏa thuận. Đã hoàn trả tiền đảm bảo.',
    tienDamBaoTrangThai: 'da_hoan_tra',
    workflowStep: 5,
    lichSu: [
      { ngay: '2024-11-05', noiDung: 'Tạo hợp đồng', icon: 'create' },
      { ngay: '2024-11-08', noiDung: 'Pháp lý duyệt', icon: 'legal' },
      { ngay: '2024-11-10', noiDung: 'Ký kết hợp đồng', icon: 'sign' },
      { ngay: '2024-12-01', noiDung: 'Có hiệu lực', icon: 'active' },
      { ngay: '2025-12-01', noiDung: 'Hết hạn, đã kết thúc', icon: 'end' },
    ],
  },
  {
    id: 5,
    maHopDong: 'HDKG-2025-003',
    tenBDS: 'Căn hộ Studio Times City',
    bdsId: 5,
    ngayKy: '2025-02-05',
    ngayBatDau: '2025-03-01',
    ngayKetThuc: '2026-03-01',
    thoiHan: '12 tháng',
    tienDamBao: 3000000,
    phiKyGui: '5%/năm',
    giaThueDeXuat: '8.5 triệu/tháng',
    status: 'cho_duyet',
    daiDienDaiLy: 'Phạm Thị Hương – Phó phòng Pháp lý',
    moiGioi: 'Lê Quốc Anh – Môi giới',
    diaChiBDS: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    dienTich: '42 m²',
    loaiBDS: 'Căn hộ',
    dieuKhoanPhatSinh: 'Điều 7: Nội thất đầy đủ, chủ nhà chịu phí bảo trì. Điều 8: Đại lý hỗ trợ tìm khách thuê.',
    dieuKienChamDut: 'Hợp đồng chấm dứt khi: (1) Hết hạn không gia hạn, (2) Vi phạm điều khoản, (3) Thỏa thuận hai bên.',
    tienDamBaoTrangThai: 'cho_duyet',
    workflowStep: 3,
    lichSu: [
      { ngay: '2025-02-03', noiDung: 'Tạo hợp đồng', icon: 'create' },
      { ngay: '2025-02-05', noiDung: 'Chờ pháp lý duyệt', icon: 'legal' },
    ],
  },
  {
    id: 6,
    maHopDong: 'HDKG-2024-005',
    tenBDS: 'Nhà mặt phố Đống Đa',
    bdsId: 6,
    ngayKy: '2024-10-25',
    ngayBatDau: '2024-11-01',
    ngayKetThuc: '2025-11-01',
    thoiHan: '12 tháng',
    tienDamBao: 7000000,
    phiKyGui: '5%/năm',
    giaThueDeXuat: '22 triệu/tháng',
    status: 'dang_hieu_luc',
    daiDienDaiLy: 'Nguyễn Thị Minh – Trưởng phòng Pháp lý',
    moiGioi: 'Trần Văn Hùng – Môi giới cao cấp',
    diaChiBDS: '88 Láng Hạ, Đống Đa, Hà Nội',
    dienTich: '85 m²',
    loaiBDS: 'Nhà riêng',
    dieuKhoanPhatSinh: 'Điều 7: Nhà mặt phố phù hợp kinh doanh. Điều 8: Đại lý hỗ trợ quảng cáo đa kênh.',
    dieuKienChamDut: 'Hợp đồng chấm dứt khi: (1) Hết hạn không gia hạn, (2) Vi phạm điều khoản, (3) Thỏa thuận hai bên.',
    tienDamBaoTrangThai: 'dang_giu',
    workflowStep: 5,
    lichSu: [
      { ngay: '2024-10-20', noiDung: 'Tạo hợp đồng', icon: 'create' },
      { ngay: '2024-10-22', noiDung: 'Pháp lý duyệt', icon: 'legal' },
      { ngay: '2024-10-25', noiDung: 'Ký kết hợp đồng', icon: 'sign' },
      { ngay: '2024-11-01', noiDung: 'Có hiệu lực', icon: 'active' },
    ],
  },
  {
    id: 7,
    maHopDong: 'HDKG-2024-012',
    tenBDS: 'Penthouse Keangnam',
    bdsId: 7,
    ngayKy: '2024-09-18',
    ngayBatDau: '2024-10-01',
    ngayKetThuc: '2025-10-01',
    thoiHan: '12 tháng',
    tienDamBao: 20000000,
    phiKyGui: '4%/năm',
    giaThueDeXuat: '55 triệu/tháng',
    status: 'tam_dung',
    daiDienDaiLy: 'Nguyễn Thị Minh – Trưởng phòng Pháp lý',
    moiGioi: 'Trần Văn Hùng – Môi giới cao cấp',
    diaChiBDS: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    dienTich: '180 m²',
    loaiBDS: 'Căn hộ',
    dieuKhoanPhatSinh: 'Điều 7: Nội thất nhập khẩu Ý, chủ nhà chịu phí bảo hiểm. Điều 8: Đại lý thu hoa hồng 4%. Hợp đồng tạm dừng do tranh chấp nội thất.',
    dieuKienChamDut: 'Hợp đồng tạm dừng chờ giải quyết tranh chấp. Sẽ tiếp tục khi hai bên đồng thuận.',
    tienDamBaoTrangThai: 'dang_giu',
    workflowStep: 5,
    lichSu: [
      { ngay: '2024-09-15', noiDung: 'Tạo hợp đồng', icon: 'create' },
      { ngay: '2024-09-17', noiDung: 'Pháp lý duyệt', icon: 'legal' },
      { ngay: '2024-09-18', noiDung: 'Ký kết hợp đồng', icon: 'sign' },
      { ngay: '2024-10-01', noiDung: 'Có hiệu lực', icon: 'active' },
      { ngay: '2025-03-10', noiDung: 'Tạm dừng – Tranh chấp nội thất', icon: 'pause' },
    ],
  },
]

const STATUS_CONFIG = {
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky: { label: 'Chờ ký', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  dang_hieu_luc: { label: 'Đang hiệu lực', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  tam_dung: { label: 'Tạm dừng', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

const DEPOSIT_STATUS = {
  cho_duyet: { label: 'Chờ duyệt', color: 'text-amber-600', icon: 'clock' },
  dang_giu: { label: 'Đang giữ', color: 'text-blue-600', icon: 'shield' },
  da_khau_tru: { label: 'Đã khấu trừ', color: 'text-orange-600', icon: 'minus' },
  da_hoan_tra: { label: 'Đã hoàn trả', color: 'text-emerald-600', icon: 'check' },
}

const WORKFLOW_STEPS = [
  { key: 'tiep_nhan', label: 'Tiếp nhận' },
  { key: 'khao_sat', label: 'Khảo sát' },
  { key: 'phap_luat', label: 'Pháp lý duyệt' },
  { key: 'cho_ky', label: 'Chờ ký' },
  { key: 'hieu_luc', label: 'Hiệu lực' },
]

const ACTIVITY_ICONS = {
  create: { color: 'bg-blue-500', symbol: '+' },
  legal: { color: 'bg-purple-500', symbol: '§' },
  sign: { color: 'bg-emerald-500', symbol: '✓' },
  active: { color: 'bg-indigo-500', symbol: '▶' },
  end: { color: 'bg-slate-400', symbol: '■' },
  pause: { color: 'bg-red-400', symbol: '❚❚' },
  update: { color: 'bg-amber-500', symbol: '↻' },
}

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function KPICard({ icon, label, value, color, bgColor, trend }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-3xl font-bold text-on-surface">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${trend > 0 ? 'text-emerald-600' : trend === 0 ? 'text-slate-500' : 'text-red-500'}`}>
              {trend > 0 && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend > 0 ? `+${trend}%` : trend === 0 ? '—' : `${trend}%`} so với tháng trước
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

function WorkflowTimeline({ currentStep }) {
  return (
    <div className="py-4">
      <div className="flex items-center">
        {WORKFLOW_STEPS.map((step, i) => {
          const stepNum = i + 1
          const isActive = stepNum <= currentStep
          const isCurrent = stepNum === currentStep
          const isLast = i === WORKFLOW_STEPS.length - 1
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isActive
                    ? isCurrent ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {isActive && !isCurrent ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  )
}

function DepositTimeline({ status }) {
  const steps = [
    { key: 'cho_duyet', label: 'Chờ nộp' },
    { key: 'dang_giu', label: 'Đang giữ' },
    { key: 'da_khau_tru', label: 'Khấu trừ' },
    { key: 'da_hoan_tra', label: 'Hoàn trả' },
  ]
  const currentIdx = steps.findIndex(s => s.key === status)

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = i <= currentIdx
        const isCurrent = i === currentIdx
        return (
          <div key={step.key} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-amber-400 ring-2 ring-amber-100' : isActive ? 'bg-blue-500' : 'bg-slate-200'}`} />
              <span className={`text-xs ${isCurrent ? 'text-amber-700 font-medium' : isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${i < currentIdx ? 'bg-blue-300' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ContractRow({ contract, isSelected, onSelect }) {
  const status = STATUS_CONFIG[contract.status]
  return (
    <div
      onClick={() => onSelect(contract.id)}
      className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        {/* Contract ID */}
        <div className="shrink-0 w-40">
          <p className="font-mono text-sm font-semibold text-blue-600">{contract.maHopDong}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{formatDate(contract.ngayKy)}</p>
        </div>

        {/* Property Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface truncate">{contract.tenBDS}</p>
          <p className="text-sm text-on-surface-variant truncate">{contract.diaChiBDS}</p>
        </div>

        {/* Duration */}
        <div className="shrink-0 w-32 text-center">
          <p className="text-sm font-medium text-on-surface">{contract.thoiHan}</p>
          <p className="text-xs text-on-surface-variant">{formatDate(contract.ngayBatDau)} – {formatDate(contract.ngayKetThuc)}</p>
        </div>

        {/* Deposit */}
        <div className="shrink-0 w-36 text-right">
          <p className="text-sm font-semibold text-on-surface">{formatVND(contract.tienDamBao)}</p>
          <span className={`text-xs font-medium ${DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.color}`}>
            {DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.label}
          </span>
        </div>

        {/* Status */}
        <div className="shrink-0">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
        </div>

        {/* Arrow */}
        <div className="shrink-0">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function ContractDetail({ contract, onClose }) {
  if (!contract) return null
  const status = STATUS_CONFIG[contract.status]

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium mb-1">{contract.maHopDong}</p>
            <h3 className="text-white font-bold text-lg">{contract.tenBDS}</h3>
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
        {/* Workflow */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiến trình pháp lý</h4>
          <WorkflowTimeline currentStep={contract.workflowStep} />
        </div>

        {/* Property Info */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Thông tin bất động sản</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Loại</p>
              <p className="text-sm font-medium text-on-surface">{contract.loaiBDS}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Diện tích</p>
              <p className="text-sm font-medium text-on-surface">{contract.dienTich}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Giá thuê đề xuất</p>
              <p className="text-sm font-medium text-blue-600">{contract.giaThueDeXuat}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-on-surface-variant">Phí ký gửi</p>
              <p className="text-sm font-medium text-on-surface">{contract.phiKyGui}</p>
            </div>
          </div>
        </div>

        {/* Contract Terms */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Điều khoản ký gửi</h4>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày bắt đầu</span>
              <span className="font-medium text-on-surface">{formatDate(contract.ngayBatDau)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Ngày kết thúc</span>
              <span className="font-medium text-on-surface">{formatDate(contract.ngayKetThuc)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Thời hạn</span>
              <span className="font-medium text-on-surface">{contract.thoiHan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Phí ký gửi</span>
              <span className="font-medium text-on-surface">{contract.phiKyGui}</span>
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Điều khoản phát sinh</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-100">
            {contract.dieuKhoanPhatSinh}
          </p>
        </div>

        {/* Representatives */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Đại diện</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Đại lý</p>
                <p className="text-sm font-medium text-on-surface">{contract.daiDienDaiLy}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Môi giới</p>
                <p className="text-sm font-medium text-on-surface">{contract.moiGioi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Termination Conditions */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Điều kiện chấm dứt</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed bg-slate-50 p-3 rounded-lg">
            {contract.dieuKienChamDut}
          </p>
        </div>

        {/* Deposit */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Tiền đảm bảo</h4>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-blue-700">{formatVND(contract.tienDamBao)}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.color} bg-white`}>
                {DEPOSIT_STATUS[contract.tienDamBaoTrangThai]?.label}
              </span>
            </div>
            <DepositTimeline status={contract.tienDamBaoTrangThai} />
          </div>
        </div>

        {/* Activity History */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Lịch sử xử lý</h4>
          <div className="space-y-0">
            {contract.lichSu.map((item, i) => {
              const iconCfg = ACTIVITY_ICONS[item.icon] || ACTIVITY_ICONS.update
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full ${iconCfg.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{iconCfg.symbol}</span>
                    </div>
                    {i < contract.lichSu.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-on-surface">{item.noiDung}</p>
                    <p className="text-xs text-on-surface-variant">{formatDate(item.ngay)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            to={`/dashboard/hop-dong-ky-gui/${contract.id}`}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors"
          >
            Xem chi tiết
          </Link>
          <button className="py-2.5 px-4 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-slate-50 transition-colors" title="Tải PDF">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          {contract.status === 'dang_hieu_luc' && (
            <button className="py-2.5 px-4 rounded-lg bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-colors" title="Gia hạn">
              Gia hạn
            </button>
          )}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Bạn chưa có hợp đồng ký gửi nào</h3>
        <p className="text-on-surface-variant text-sm mb-8">
          Đăng ký ký gửi bất động sản để bắt đầu quy trình hợp đồng.
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

export default function HopDongKyGuiPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...CONTRACTS]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.maHopDong.toLowerCase().includes(q) ||
        c.tenBDS.toLowerCase().includes(q) ||
        c.diaChiBDS.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') result = result.filter(c => c.status === filterStatus)
    return result
  }, [searchQuery, filterStatus])

  const kpiData = useMemo(() => ({
    total: CONTRACTS.length,
    active: CONTRACTS.filter(c => c.status === 'dang_hieu_luc').length,
    pending: CONTRACTS.filter(c => ['cho_duyet', 'cho_ky'].includes(c.status)).length,
    ended: CONTRACTS.filter(c => ['da_ket_thuc', 'tam_dung'].includes(c.status)).length,
  }), [])

  const selectedContract = selectedId ? CONTRACTS.find(c => c.id === selectedId) : null

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Hợp đồng ký gửi</h1>
        <p className="text-on-surface-variant text-sm mt-1">Theo dõi hợp đồng ký gửi bất động sản của bạn</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          label="Tổng hợp đồng"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          trend={15}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đang hiệu lực"
          value={kpiData.active}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          trend={10}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Chờ duyệt"
          value={kpiData.pending}
          color="text-amber-600"
          bgColor="bg-amber-50"
          trend={0}
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
          label="Đã kết thúc"
          value={kpiData.ended}
          color="text-slate-600"
          bgColor="bg-slate-50"
          trend={-5}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-outline-variant p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm mã hợp đồng, bất động sản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>

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
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-on-surface-variant">
            Hiển thị <span className="font-semibold text-on-surface">{filtered.length}</span> hợp đồng
          </p>
          {(filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => { setFilterStatus('all'); setSearchQuery('') }}
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

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-6">
          {/* Contract List */}
          <div className="flex-1">
            {/* Table Header */}
            <div className="grid grid-cols-[160px_1fr_128px_144px_auto_32px] gap-4 px-4 py-2.5 mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Mã hợp đồng</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Bất động sản</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide text-center">Thời hạn</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide text-right">Tiền đảm bảo</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Trạng thái</span>
              <span />
            </div>

            <div className="space-y-3">
              {filtered.map(contract => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  isSelected={selectedId === contract.id}
                  onSelect={setSelectedId}
                />
              ))}
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