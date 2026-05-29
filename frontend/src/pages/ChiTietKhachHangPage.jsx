import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import khachHangService from '../services/khachHangService'

function mapCustomer(data) {
  return {
    id: data.id || data.maKhachHang || '',
    hoTen: data.hoTen || data.tenKhachHang || '',
    trangThai: data.trangThai || 'Dang_xem',
    avatar: data.avatar || null,
    thongTinLienHe: {
      dienThoai: data.soDienThoai || data.dienThoai || '',
      email: data.email || '',
    },
    nhuCau: {
      mucDo: data.mucDo || 'Thường',
      moTa: data.moTaNhuCau || data.moTa || '',
      nganSach: data.nganSach || '',
      khuVuc: data.khuVuc || [],
      loaiBatDongSan: data.loaiBatDongSan || [],
    },
    chuyenVienPhuTrach: data.nhanVienPhuTrach ? {
      hoTen: data.nhanVienPhuTrach.hoTen || '',
      chucVu: data.nhanVienPhuTrach.chucVu || '',
      avatar: data.nhanVienPhuTrach.avatar || null,
      dienThoai: data.nhanVienPhuTrach.soDienThoai || '',
      ngayNhanLead: data.nhanVienPhuTrach.ngayNhanLead || '',
    } : {
      hoTen: '',
      chucVu: '',
      avatar: null,
      dienThoai: '',
      ngayNhanLead: '',
    },
    lichSuTuongTac: (data.lichSuTuongTac || data.lichSu || []).map(item => ({
      id: item.id,
      loai: item.loai,
      tieuDe: item.tieuDe,
      trangThai: item.trangThai,
      thoiGian: item.thoiGian,
      moTa: item.moTa,
      diaDiem: item.diaDiem,
      nguoiThucHien: item.nguoiThucHien,
    })),
  }
}

const TRANG_THAI_CONFIG = {
  Dang_xem: { label: 'Đang xem', color: 'bg-orange-100 text-orange-700' },
  Dang_theo_doi: { label: 'Đang theo dõi', color: 'bg-blue-100 text-blue-700' },
  Da_giao_dich: { label: 'Đã giao dịch', color: 'bg-emerald-100 text-emerald-700' },
}

const TUONG_TAC_ICONS = {
  Da_dan_khach_xem_nha: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Cuoc_goi_tu_van: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Phan_bo_lead: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
}

export default function ChiTietKhachHangPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await khachHangService.chiTiet(id)
      setCustomer(mapCustomer(response.data))
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải thông tin khách hàng')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Đang tải thông tin khách hàng...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button onClick={fetchCustomer} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!customer) return null

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
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-0.5">
              <span>Khách hàng</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-800 font-medium">{customer.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {customer.hoTen}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                TRANG_THAI_CONFIG[customer.trangThai]?.color || 'bg-slate-100 text-slate-600'
              }`}>
                {TRANG_THAI_CONFIG[customer.trangThai]?.label || customer.trangThai}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Sửa hồ sơ
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Ghi nhận Tương tác
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center ml-2">
            <span className="text-white text-sm font-medium">AD</span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin Liên hệ */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-slate-600 font-bold text-lg">TN</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-semibold text-slate-800">Thông tin Liên hệ</h2>
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                        VIP/KHÁCH MUA
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {customer.nhuCau.moTa}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-slate-500">Số điện thoại</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{customer.thongTinLienHe.dienThoai}</p>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Gọi ngay
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-500">Email</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{customer.thongTinLienHe.email}</p>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Gửi Email
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nhu cầu */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3">Nhu cầu Hiển thị (Tóm tắt)</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg">
                      Ngân sách: {customer.nhuCau.nganSach}
                    </span>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg">
                      Khu vực: {customer.nhuCau.khuVuc.join(', ')}
                    </span>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg">
                      Loại: {customer.nhuCau.loaiBatDongSan.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lịch sử Tương tác */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lịch sử Tương tác
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Lọc theo:</span>
                    <select className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
                      <option>Tất cả hoạt động</option>
                      <option>Đã dẫn khách xem nhà</option>
                      <option>Cuộc gọi tư vấn</option>
                      <option>Phân bổ lead</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {customer.lichSuTuongTac.map((tuongTac) => (
                    <div key={tuongTac.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        tuongTac.loai === 'Da_dan_khach_xem_nha' ? 'bg-blue-100 text-blue-600' :
                        tuongTac.loai === 'Cuoc_goi_tu_van' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {TUONG_TAC_ICONS[tuongTac.loai]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-800">{tuongTac.tieuDe}</h3>
                            {tuongTac.trangThai === 'Thanh_cong' && (
                              <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                                Thành công
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{tuongTac.thoiGian}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{tuongTac.moTa}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {tuongTac.diaDiem && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {tuongTac.diaDiem}
                            </div>
                          )}
                          <span>Thực hiện bởi: <strong className="text-slate-700">{tuongTac.nguoiThucHien}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Assigned Broker */}
            <div className="space-y-6">
              {/* Chuyên viên Phụ trách */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-700">Chuyên viên Phụ trách</h2>
                  <button className="text-blue-600 hover:text-blue-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-slate-600 font-semibold text-lg">LT</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">{customer.chuyenVienPhuTrach.hoTen}</h3>
                  <p className="text-sm text-slate-500">{customer.chuyenVienPhuTrach.chucVu}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-slate-600">{customer.chuyenVienPhuTrach.dienThoai}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-600">Đã nhận lead: {customer.chuyenVienPhuTrach.ngayNhanLead}</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors">
                  Nhắn tin nội bộ
                </button>
              </div>

              {/* Ghi chú */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-base font-semibold text-slate-700 mb-4">Ghi chú</h2>
                <textarea
                  placeholder="Thêm ghi chú về khách hàng..."
                  className="w-full h-32 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm resize-none"
                />
                <button className="w-full mt-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                  Lưu ghi chú
                </button>
              </div>
            </div>
          </div>
        </main>
    </>
  )
}
