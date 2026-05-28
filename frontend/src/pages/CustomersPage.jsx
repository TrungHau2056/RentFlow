import { useState } from 'react'
import { Link } from 'react-router-dom'

const CUSTOMER_DATA = [
  {
    id: 'KH-8492',
    hoTen: 'Trần Thị Bích Ngọc',
    loaiKhach: 'Khách mua',
    trangThai: 'Dang_xem',
    dienThoai: '+84 912 345 678',
    email: 'ngoc.tran@example.com',
    khuVuc: 'Tây Hồ, Ba Đình',
    nganSach: '5 - 8 Tỷ',
    loaiBatDongSan: 'Căn hộ 3PN',
    avatar: null,
  },
  {
    id: 'KH-8493',
    hoTen: 'Nguyễn Văn Minh',
    loaiKhach: 'Khách thuê',
    trangThai: 'Dang_theo_doi',
    dienThoai: '+84 903 456 789',
    email: 'minh.nguyen@example.com',
    khuVuc: 'Cầu Giấy',
    nganSach: '15 - 20 Triệu',
    loaiBatDongSan: 'Căn hộ 2PN',
    avatar: null,
  },
  {
    id: 'KH-8494',
    hoTen: 'Lê Hoàng Anh',
    loaiKhach: 'Khách mua',
    trangThai: 'Da_giao_dich',
    dienThoai: '+84 918 567 890',
    email: 'anh.le@example.com',
    khuVuc: 'Bình Thạnh, TP.HCM',
    nganSach: '10 - 15 Tỷ',
    loaiBatDongSan: 'Biệt thự',
    avatar: null,
  },
  {
    id: 'KH-8495',
    hoTen: 'Phạm Thị Lan',
    loaiKhach: 'Khách thuê',
    trangThai: 'Dang_xem',
    dienThoai: '+84 905 678 901',
    email: 'lan.pham@example.com',
    khuVuc: 'Hoàn Kiếm',
    nganSach: '8 - 12 Triệu',
    loaiBatDongSan: 'Căn hộ 1PN',
    avatar: null,
  },
  {
    id: 'KH-8496',
    hoTen: 'Đỗ Văn Tuấn',
    loaiKhach: 'Khách mua',
    trangThai: 'Dang_theo_doi',
    dienThoai: '+84 913 789 012',
    email: 'tuan.do@example.com',
    khuVuc: 'Nam Từ Liêm',
    nganSach: '7 - 10 Tỷ',
    loaiBatDongSan: 'Căn hộ 3PN',
    avatar: null,
  },
  {
    id: 'KH-8497',
    hoTen: 'Vũ Thị Hồng',
    loaiKhach: 'Khách mua',
    trangThai: 'Da_giao_dich',
    dienThoai: '+84 907 890 123',
    email: 'hong.vu@example.com',
    khuVuc: 'Đống Đa',
    nganSach: '4 - 6 Tỷ',
    loaiBatDongSan: 'Căn hộ 2PN',
    avatar: null,
  },
]

const TRANG_THAI_CONFIG = {
  Dang_xem: { label: 'Đang xem', color: 'bg-orange-100 text-orange-700' },
  Dang_theo_doi: { label: 'Đang theo dõi', color: 'bg-blue-100 text-blue-700' },
  Da_giao_dich: { label: 'Đã giao dịch', color: 'bg-emerald-100 text-emerald-700' },
  Khong_thanh_cong: { label: 'Không thành công', color: 'bg-slate-100 text-slate-600' },
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLoaiKhach, setFilterLoaiKhach] = useState('tat_ca')
  const [filterTrangThai, setFilterTrangThai] = useState('tat_ca')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = CUSTOMER_DATA.filter((item) => {
    const matchSearch = item.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.dienThoai.includes(searchTerm)
    const matchLoaiKhach = filterLoaiKhach === 'tat_ca' || item.loaiKhach === filterLoaiKhach
    const matchTrangThai = filterTrangThai === 'tat_ca' || item.trangThai === filterTrangThai
    return matchSearch && matchLoaiKhach && matchTrangThai
  })

  return (
    <>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold text-slate-800">Quản lý Khách hàng (CRM)</h1>
          <div className="relative max-w-md flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khách hàng, ID, số điện thoại..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center ml-2">
            <span className="text-white text-sm font-medium">AD</span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Danh sách Khách hàng</h2>
              <p className="text-slate-500 text-sm mt-1">
                Quản lý thông tin và tương tác với khách hàng tiềm năng
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm khách hàng
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <select
              value={filterLoaiKhach}
              onChange={(e) => setFilterLoaiKhach(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="tat_ca">Tất cả loại khách</option>
              <option value="Khach_mua">Khách mua</option>
              <option value="Khach_thue">Khách thuê</option>
            </select>

            <select
              value={filterTrangThai}
              onChange={(e) => setFilterTrangThai(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="Dang_xem">Đang xem</option>
              <option value="Dang_theo_doi">Đang theo dõi</option>
              <option value="Da_giao_dich">Đã giao dịch</option>
              <option value="Khong_thanh_cong">Không thành công</option>
            </select>

            <span className="text-sm text-slate-500 ml-auto">
              Tổng: {filteredData.length} khách hàng
            </span>
          </div>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((customer) => (
            <Link
              key={customer.id}
              to={`/admin/customers/${customer.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-slate-600 font-semibold text-sm">
                    {customer.hoTen.split(' ').pop()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {customer.hoTen}
                  </h3>
                  <p className="text-xs text-slate-500">{customer.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  customer.loaiKhach === 'Khach_mua'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {customer.loaiKhach === 'Khach_mua' ? 'Khách mua' : 'Khách thuê'}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="truncate">{customer.dienThoai}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{customer.email}</span>
                </div>
              </div>

              {/* Budget & Area */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                  {customer.nganSach}
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                  {customer.khuVuc}
                </span>
              </div>

              {/* Type */}
              <p className="text-xs text-slate-500 mb-3">
                Loại: <span className="font-medium text-slate-700">{customer.loaiBatDongSan}</span>
              </p>

              {/* Status */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  TRANG_THAI_CONFIG[customer.trangThai]?.color || 'bg-slate-100 text-slate-600'
                }`}>
                  {TRANG_THAI_CONFIG[customer.trangThai]?.label || customer.trangThai}
                </span>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Hiển thị 1-{Math.min(6, filteredData.length)} trong số {filteredData.length} kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-medium text-sm transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-slate-400">...</span>
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}