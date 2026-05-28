import { useNavigate } from 'react-router-dom'

const CONTRACT_DATA = {
  maHopDong: 'KG-2023-0892',
  trangThai: 'cho_xu_ly',
  chuNha: {
    hoTen: 'Nguyễn Văn A',
  cmnd: '0901234567',
  email: 'a.nguyen@email.com',
  },
  batDongSan: {
    ten: 'Căn hộ Vinhomes Landmark 81',
    diaChi: 'Tầng 45, Căn 02, Quận Bình Thạnh',
  },
  giaTriDinhGia: 8500000000,
  phiHoaHong: 0.02,
  soTienHoaHong: 170000000,
  ngayBatDau: '15/10/2023',
  ngayKetThuc: '15/04/2024',
  hoSoPhapLy: {
    hopLe: true,
    ghiChu: 'Giấy chứng nhận quyền sở hữu bản gốc đã được đối chiếu. Không có tranh chấp tại thời điểm kiểm tra.',
  },
  nguoiDuyet: 'Lê Thị B (Trưởng ban PL)',
  taiLieuDinhKem: [
    { ten: 'Ban_Scan_HopDong.pdf', dungLuong: '2.4 MB', loai: 'pdf' },
    { ten: 'So_Hong_MatTruoc.jpg', dungLuong: '1.1 MB', loai: 'image' },
  ],
  lichSu: [
    {
      buoc: 'Tạo bản nháp',
      nguoiThucHien: 'Trần Văn C (Môi giới)',
      thoiGian: '09:00 - 11/10/2023',
      daHoanThanh: true,
    },
    {
      buoc: 'Pháp lý xác nhận hồ sơ',
      nguoiThucHien: 'Chị chức: Đã kiểm tra bản gốc',
      thoiGian: '10:15 - 12/10/2023',
      daHoanThanh: true,
    },
    {
      buoc: 'Chuyển sang Chờ duyệt cuối',
      nguoiThucHien: 'Bởi Lê Thị B (Pháp lý)',
      thoiGian: '14:30 - 12/10/2023',
      daHoanThanh: true,
    },
  ],
}

const STEPS = [
  { id: 1, label: 'Bản nháp' },
  { id: 2, label: 'Pháp lý kiểm tra' },
  { id: 3, label: 'Chờ duyệt cuối' },
  { id: 4, label: 'Hiệu lực' },
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

export default function ChiTietHopDongKyGuiPage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-blue-900">Chi tiết Hợp đồng Ký gửi</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Sửa đổi
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium transition-colors">
            Duyệt Hợp đồng
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center ml-2">
            <span className="text-white text-sm font-medium">AD</span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-auto p-6">
          {/* Contract ID & Status */}
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-1">Mã hợp đồng: <span className="font-medium text-slate-700">{CONTRACT_DATA.maHopDong}</span></p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Tiến trình phê duyệt</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
                <div className="h-full bg-blue-800" style={{ width: '50%' }} />
              </div>
              <div className="relative flex justify-between">
                {STEPS.map((step, idx) => {
                  const isCompleted = idx < 2
                  const isCurrent = idx === 2
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 ${
                          isCompleted
                            ? 'bg-blue-800 border-blue-800 text-white'
                            : isCurrent
                            ? 'bg-white border-blue-800 text-blue-800'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        isCompleted || isCurrent ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin chung */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Thông tin chung
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    Chờ xử lý
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Chủ nhà (Bên ký gửi)</p>
                    <p className="text-sm font-medium text-slate-800">{CONTRACT_DATA.chuNha.hoTen}</p>
                    <p className="text-xs text-slate-500">{CONTRACT_DATA.chuNha.cmnd} | {CONTRACT_DATA.chuNha.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bất động sản</p>
                    <p className="text-sm font-medium text-slate-800">{CONTRACT_DATA.batDongSan.ten}</p>
                    <p className="text-xs text-slate-500">{CONTRACT_DATA.batDongSan.diaChi}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Giá trị định giá</p>
                    <p className="text-sm font-medium text-slate-800">{formatCurrency(CONTRACT_DATA.giaTriDinhGia)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phí hoa hồng</p>
                    <p className="text-sm font-medium text-slate-800">
                      {CONTRACT_DATA.phiHoaHong * 100}% ({formatCurrency(CONTRACT_DATA.soTienHoaHong)})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Ngày bắt đầu</p>
                    <p className="text-sm font-medium text-slate-800">{CONTRACT_DATA.ngayBatDau}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Ngày kết thúc</p>
                    <p className="text-sm font-medium text-slate-800">{CONTRACT_DATA.ngayKetThuc}</p>
                  </div>
                </div>
              </div>

              {/* Tài liệu đính kèm */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Tài liệu đính kèm
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {CONTRACT_DATA.taiLieuDinhKem.map((file, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                      {file.loai === 'pdf' ? (
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <p className="text-xs font-medium text-slate-700 truncate">{file.ten}</p>
                      <p className="text-xs text-slate-500 mt-1">{file.dungLuong}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Đánh giá Pháp lý */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Đánh giá Pháp lý
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Hồ sơ pháp lý hợp lệ</p>
                    <p className="text-xs text-slate-500">Đã kiểm tra chéo với Sổ TNMT.</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-500 mb-1">Ghi chú từ Bộ phận Pháp lý:</p>
                  <p className="text-sm text-slate-700">{CONTRACT_DATA.hoSoPhapLy.ghiChu}</p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">Người duyệt:</p>
                  <p className="text-sm font-medium text-slate-700">{CONTRACT_DATA.nguoiDuyet}</p>
                </div>
              </div>

              {/* Lịch sử Hợp đồng */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lịch sử Hợp đồng
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                  <div className="space-y-4">
                    {CONTRACT_DATA.lichSu.map((item, idx) => (
                      <div key={idx} className="relative flex gap-3 pl-8">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          item.daHoanThanh ? 'bg-blue-800 border-blue-800' : 'bg-white border-slate-300'
                        }`}>
                          {item.daHoanThanh && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{item.buoc}</p>
                          <p className="text-xs text-slate-500">{item.nguoiThucHien}</p>
                          <p className="text-xs text-slate-400 mt-1">{item.thoiGian}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </>
  )
}
