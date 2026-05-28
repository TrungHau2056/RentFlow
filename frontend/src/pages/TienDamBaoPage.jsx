import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const DEPOSITS = [
  {
    id: 1,
    maPhieu: 'PDB-2025-001',
    tenBDS: 'Biệt thự Vinhomes Cao cấp',
    hopDong: 'HDKG-2025-001',
    ngayThu: '2025-01-01',
    soTien: 10000000,
    status: 'dang_giu',
    ngayCapNhat: '2025-01-01',
    diaChiBDS: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    moiGioi: 'Trần Văn Hùng',
    ngayChoThue: null,
    lichSu: [
      { ngay: '2025-01-01', loai: 'Thu tiền đảm bảo', nguoi: 'Nguyễn Thị Minh', status: 'completed' },
    ],
    refundWorkflow: null,
  },
  {
    id: 2,
    maPhieu: 'PDB-2025-002',
    tenBDS: 'Căn hộ Midtown Sài Đồng',
    hopDong: 'HDKG-2025-002',
    ngayThu: '2025-02-01',
    soTien: 5000000,
    status: 'dang_giu',
    ngayCapNhat: '2025-02-01',
    diaChiBDS: '29 Liễu Giai, Ba Đình, Hà Nội',
    moiGioi: 'Lê Quốc Anh',
    ngayChoThue: null,
    lichSu: [
      { ngay: '2025-02-01', loai: 'Thu tiền đảm bảo', nguoi: 'Phạm Thị Hương', status: 'completed' },
    ],
    refundWorkflow: null,
  },
  {
    id: 3,
    maPhieu: 'PDB-2025-003',
    tenBDS: 'Nhà phố cổ khu phố cổ',
    hopDong: 'HDKG-2024-015',
    ngayThu: '2025-02-01',
    soTien: 8000000,
    status: 'dang_giu',
    ngayCapNhat: '2025-02-01',
    diaChiBDS: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    moiGioi: 'Trần Văn Hùng',
    ngayChoThue: null,
    lichSu: [
      { ngay: '2025-02-01', loai: 'Thu tiền đảm bảo', nguoi: 'Phạm Thị Hương', status: 'completed' },
    ],
    refundWorkflow: null,
  },
  {
    id: 4,
    maPhieu: 'PDB-2024-008',
    tenBDS: 'Biệt thự sân vườn Tây Hồ',
    hopDong: 'HDKG-2024-008',
    ngayThu: '2024-12-01',
    soTien: 15000000,
    status: 'da_hoan_tra',
    ngayCapNhat: '2025-12-15',
    diaChiBDS: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    moiGioi: 'Trần Văn Hùng',
    ngayChoThue: '2025-01-15',
    lichSu: [
      { ngay: '2024-12-01', loai: 'Thu tiền đảm bảo', nguoi: 'Nguyễn Thị Minh', status: 'completed' },
      { ngay: '2025-01-15', loai: 'Nhà đã cho thuê', nguoi: 'Trần Văn Hùng', status: 'completed' },
      { ngay: '2025-12-01', loai: 'Hết hạn hợp đồng', nguoi: 'Nguyễn Thị Minh', status: 'completed' },
      { ngay: '2025-12-10', loai: 'Duyệt hoàn trả', nguoi: 'Nguyễn Thị Minh', status: 'completed' },
      { ngay: '2025-12-15', loai: 'Đã hoàn trả', nguoi: 'Kế toán', status: 'completed' },
    ],
    refundWorkflow: { step: 4 },
  },
  {
    id: 5,
    maPhieu: 'PDB-2025-004',
    tenBDS: 'Căn hộ Studio Times City',
    hopDong: 'HDKG-2025-003',
    ngayThu: '2025-03-01',
    soTien: 3000000,
    status: 'dang_giu',
    ngayCapNhat: '2025-03-01',
    diaChiBDS: 'Tòa T6, Times City, Hai Bà Trưng, Hà Nội',
    moiGioi: 'Lê Quốc Anh',
    ngayChoThue: null,
    lichSu: [
      { ngay: '2025-03-01', loai: 'Thu tiền đảm bảo', nguoi: 'Phạm Thị Hương', status: 'completed' },
    ],
    refundWorkflow: null,
  },
  {
    id: 6,
    maPhieu: 'PDB-2024-005',
    tenBDS: 'Nhà mặt phố Đống Đa',
    hopDong: 'HDKG-2024-005',
    ngayThu: '2024-11-01',
    soTien: 7000000,
    status: 'da_khau_tru',
    ngayCapNhat: '2025-04-20',
    diaChiBDS: '88 Láng Hạ, Đống Đa, Hà Nội',
    moiGioi: 'Trần Văn Hùng',
    ngayChoThue: '2024-12-01',
    lichSu: [
      { ngay: '2024-11-01', loai: 'Thu tiền đảm bảo', nguoi: 'Nguyễn Thị Minh', status: 'completed' },
      { ngay: '2024-12-01', loai: 'Nhà đã cho thuê', nguoi: 'Trần Văn Hùng', status: 'completed' },
      { ngay: '2025-03-15', loai: 'Sửa chữa đường ống – Khấu trừ 2.500.000đ', nguoi: 'Kế toán', status: 'completed' },
      { ngay: '2025-04-20', loai: 'Đã khấu trừ phần phí sửa chữa', nguoi: 'Kế toán', status: 'completed' },
    ],
    refundWorkflow: null,
    khauTru: 2500000,
  },
  {
    id: 7,
    maPhieu: 'PDB-2024-012',
    tenBDS: 'Penthouse Keangnam',
    hopDong: 'HDKG-2024-012',
    ngayThu: '2024-10-01',
    soTien: 20000000,
    status: 'cho_xu_ly_hoan_tra',
    ngayCapNhat: '2025-05-10',
    diaChiBDS: 'Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội',
    moiGioi: 'Trần Văn Hùng',
    ngayChoThue: null,
    lichSu: [
      { ngay: '2024-10-01', loai: 'Thu tiền đảm bảo', nguoi: 'Nguyễn Thị Minh', status: 'completed' },
      { ngay: '2025-03-10', loai: 'Hợp đồng tạm dừng', nguoi: 'Phạm Thị Hương', status: 'completed' },
      { ngay: '2025-05-05', loai: 'Yêu cầu hoàn trả', nguoi: 'Chủ nhà', status: 'completed' },
      { ngay: '2025-05-10', loai: 'Đang xử lý hoàn trả', nguoi: 'Nguyễn Thị Minh', status: 'processing' },
    ],
    refundWorkflow: { step: 2 },
  },
]

const STATUS_CONFIG = {
  dang_giu: { label: 'Đang giữ', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  da_khau_tru: { label: 'Đã khấu trừ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  da_hoan_tra: { label: 'Đã hoàn trả', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  cho_xu_ly_hoan_tra: { label: 'Chờ xử lý hoàn trả', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
}

const REFUND_STEPS = [
  { key: 'gui_yeu_cau', label: 'Gửi yêu cầu' },
  { key: 'dang_xu_ly', label: 'Đang xử lý' },
  { key: 'da_duyet', label: 'Đã duyệt' },
  { key: 'da_hoan_tra', label: 'Đã hoàn trả' },
]

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function KPICard({ icon, label, value, color, bgColor, isCurrency }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{label}</p>
          <p className="text-2xl font-bold text-on-surface">{isCurrency ? formatVND(value) : value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className={color}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

function DepositFlow() {
  const steps = [
    { label: 'Đóng tiền', icon: '💰', color: 'bg-blue-500' },
    { label: 'Đang giữ', icon: '🛡️', color: 'bg-indigo-500' },
    { label: 'Nhà thuê', icon: '🏠', color: 'bg-emerald-500' },
    { label: 'Khấu trừ', icon: '✂️', color: 'bg-orange-500' },
    { label: 'Quá 6T', icon: '⏰', color: 'bg-amber-500' },
    { label: 'Hoàn trả', icon: '↩️', color: 'bg-slate-500' },
  ]

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6">
      <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-5">Quy trình xử lý tiền đảm bảo</h3>
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-11 h-11 rounded-full ${step.color} flex items-center justify-center text-lg shadow-sm`}>
                {step.icon}
              </div>
              <span className="text-[10px] text-on-surface-variant mt-2 text-center leading-tight font-medium">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 flex items-center justify-center mx-1">
                <div className="h-px flex-1 bg-slate-200" />
                <svg className="w-3.5 h-3.5 text-slate-300 shrink-0 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function RefundTimeline({ currentStep }) {
  return (
    <div className="py-3">
      <div className="flex items-center">
        {REFUND_STEPS.map((step, i) => {
          const stepNum = i + 1
          const isActive = stepNum <= currentStep
          const isCurrent = stepNum === currentStep
          const isLast = i === REFUND_STEPS.length - 1
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
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
    </div>
  )
}

function DepositRow({ deposit, isSelected, onSelect }) {
  const status = STATUS_CONFIG[deposit.status]
  return (
    <div
      onClick={() => onSelect(deposit.id)}
      className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
        isSelected ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-outline-variant'
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="shrink-0 w-36">
          <p className="font-mono text-sm font-semibold text-blue-600">{deposit.maPhieu}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{formatDate(deposit.ngayThu)}</p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface truncate">{deposit.tenBDS}</p>
          <p className="text-sm text-on-surface-variant truncate">HĐ: {deposit.hopDong}</p>
        </div>

        <div className="shrink-0 w-44 text-right">
          <p className="text-base font-bold text-on-surface">{formatVND(deposit.soTien)}</p>
          {deposit.khauTru && (
            <p className="text-xs text-orange-600">Khấu trừ: {formatVND(deposit.khauTru)}</p>
          )}
        </div>

        <div className="shrink-0">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${status.color}`}>
            ● {status.label}
          </span>
        </div>

        <div className="shrink-0">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function DepositDetail({ deposit, onClose }) {
  if (!deposit) return null
  const status = STATUS_CONFIG[deposit.status]
  const isOver6Months = !deposit.ngayChoThue && deposit.status === 'dang_giu' &&
    (Date.now() - new Date(deposit.ngayThu).getTime()) > 180 * 24 * 60 * 60 * 1000

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium mb-1">{deposit.maPhieu}</p>
            <h3 className="text-white font-bold text-lg">{deposit.tenBDS}</h3>
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
        {/* Amount */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 text-center">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Số tiền đảm bảo</p>
          <p className="text-3xl font-bold text-blue-700">{formatVND(deposit.soTien)}</p>
          {deposit.khauTru && (
            <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-center gap-4">
              <span className="text-xs text-blue-600">Khấu trừ: <strong>{formatVND(deposit.khauTru)}</strong></span>
              <span className="text-xs text-blue-600">Còn lại: <strong>{formatVND(deposit.soTien - deposit.khauTru)}</strong></span>
            </div>
          )}
        </div>

        {/* Refund Request Alert */}
        {isOver6Months && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-800">Quá 6 tháng chưa cho thuê</h4>
                <p className="text-xs text-amber-700 mt-1">Bất động sản đã quá 6 tháng chưa có khách thuê. Bạn có thể yêu cầu hoàn trả tiền đảm bảo.</p>
                <button className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-lg transition-colors">
                  Yêu cầu hoàn trả tiền đảm bảo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refund Timeline */}
        {deposit.refundWorkflow && (
          <div>
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Tiến trình hoàn trả</h4>
            <RefundTimeline currentStep={deposit.refundWorkflow.step} />
          </div>
        )}

        {/* Property Info */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Thông tin bất động sản</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm bg-slate-50 rounded-lg p-3">
              <span className="text-on-surface-variant">Địa chỉ</span>
              <span className="font-medium text-on-surface text-right max-w-[60%]">{deposit.diaChiBDS}</span>
            </div>
            <div className="flex justify-between text-sm bg-slate-50 rounded-lg p-3">
              <span className="text-on-surface-variant">Hợp đồng</span>
              <Link to={`/dashboard/hop-dong-ky-gui/${deposit.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                {deposit.hopDong}
              </Link>
            </div>
            <div className="flex justify-between text-sm bg-slate-50 rounded-lg p-3">
              <span className="text-on-surface-variant">Môi giới</span>
              <span className="font-medium text-on-surface">{deposit.moiGioi}</span>
            </div>
            <div className="flex justify-between text-sm bg-slate-50 rounded-lg p-3">
              <span className="text-on-surface-variant">Ngày thu</span>
              <span className="font-medium text-on-surface">{formatDate(deposit.ngayThu)}</span>
            </div>
            <div className="flex justify-between text-sm bg-slate-50 rounded-lg p-3">
              <span className="text-on-surface-variant">Ngày cho thuê</span>
              <span className="font-medium text-on-surface">{deposit.ngayChoThue ? formatDate(deposit.ngayChoThue) : 'Chưa cho thuê'}</span>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Lịch sử giao dịch</h4>
          <div className="space-y-0">
            {deposit.lichSu.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${
                    item.status === 'completed' ? 'bg-blue-500' : 'bg-amber-400 ring-2 ring-amber-100'
                  }`} />
                  {i < deposit.lichSu.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                </div>
                <div className="pb-4 flex-1">
                  <p className="text-sm font-medium text-on-surface">{item.loai}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-on-surface-variant">{formatDate(item.ngay)}</span>
                    <span className="text-xs text-on-surface-variant">• {item.nguoi}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            to={`/dashboard/hop-dong-ky-gui/${deposit.id}`}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors"
          >
            Xem hợp đồng
          </Link>
          <button className="py-2.5 px-4 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-slate-50 transition-colors" title="Tải biên lai">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button className="py-2.5 px-4 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-slate-50 transition-colors" title="Liên hệ hỗ trợ">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Chưa có khoản tiền đảm bảo nào</h3>
        <p className="text-on-surface-variant text-sm mb-8">
          Tiền đảm bảo sẽ được ghi nhận khi bạn ký hợp đồng ký gửi bất động sản.
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

export default function TienDamBaoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...DEPOSITS]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(d =>
        d.maPhieu.toLowerCase().includes(q) ||
        d.tenBDS.toLowerCase().includes(q) ||
        d.hopDong.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') result = result.filter(d => d.status === filterStatus)
    return result
  }, [searchQuery, filterStatus])

  const kpiData = useMemo(() => ({
    total: DEPOSITS.reduce((sum, d) => sum + d.soTien, 0),
    holding: DEPOSITS.filter(d => d.status === 'dang_giu').reduce((sum, d) => sum + d.soTien, 0),
    deducted: DEPOSITS.filter(d => d.status === 'da_khau_tru').reduce((sum, d) => sum + d.soTien, 0),
    refunded: DEPOSITS.filter(d => d.status === 'da_hoan_tra').reduce((sum, d) => sum + d.soTien, 0),
  }), [])

  const selectedDeposit = selectedId ? DEPOSITS.find(d => d.id === selectedId) : null

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Quản lý tiền đảm bảo</h1>
        <p className="text-on-surface-variant text-sm mt-1">Theo dõi trạng thái khoản tiền đảm bảo của các bất động sản ký gửi</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          label="Tổng tiền đảm bảo"
          value={kpiData.total}
          color="text-blue-600"
          bgColor="bg-blue-50"
          isCurrency
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          label="Đang giữ"
          value={kpiData.holding}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          isCurrency
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Đã khấu trừ"
          value={kpiData.deducted}
          color="text-orange-600"
          bgColor="bg-orange-50"
          isCurrency
        />
        <KPICard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>}
          label="Đã hoàn trả"
          value={kpiData.refunded}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          isCurrency
        />
      </div>

      {/* Deposit Flow Infographic */}
      <div className="mb-6">
        <DepositFlow />
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
              placeholder="Tìm kiếm mã phiếu, bất động sản..."
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
            Hiển thị <span className="font-semibold text-on-surface">{filtered.length}</span> khoản tiền đảm bảo
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
          {/* Deposit List */}
          <div className="flex-1">
            {/* Table Header */}
            <div className="grid grid-cols-[144px_1fr_176px_auto_32px] gap-4 px-4 py-2.5 mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Mã phiếu</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Bất động sản</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide text-right">Số tiền</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Trạng thái</span>
              <span />
            </div>

            <div className="space-y-3">
              {filtered.map(deposit => (
                <DepositRow
                  key={deposit.id}
                  deposit={deposit}
                  isSelected={selectedId === deposit.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedDeposit && (
            <div className="w-[420px] shrink-0 hidden xl:block">
              <DepositDetail deposit={selectedDeposit} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}