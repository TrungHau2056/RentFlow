import { useState } from 'react'

const STATS_DATA = {
  tongTienDamBao: '4.250.000.000',
  tongDoanhThu: '850.000.000',
  khoanChoDuyet: '125.000.000',
  khoanCanHoan: '45.000.000',
}

const TRANSACTIONS = [
  {
    id: 'TXN-8924',
    hopDong: 'HD-2023-045',
    khachHang: 'Nguyễn Văn A',
    batDongSan: 'Căn hộ A12-05',
    loaiHinh: 'thanh_toan',
    soTien: 15000000,
    ngayThucHien: '2024-10-15',
    trangThai: 'da_hoan_thanh',
  },
  {
    id: 'TXN-8925',
    hopDong: 'HD-2023-112',
    khachHang: 'Trần Thị B',
    batDongSan: 'Biệt thự V-08',
    loaiHinh: 'dat_coc',
    soTien: 45000000,
    ngayThucHien: '2024-10-16',
    trangThai: 'cho_xu_ly',
  },
  {
    id: 'TXN-8910',
    hopDong: 'HD-2022-089',
    khachHang: 'Lê Văn C',
    batDongSan: 'Nhà phố T-15',
    loaiHinh: 'hoan_tra',
    soTien: -30000000,
    ngayThucHien: '2024-10-12',
    trangThai: 'da_hoan_thanh',
  },
  {
    id: 'TXN-8930',
    hopDong: 'HD-2024-001',
    khachHang: 'Phạm Thị D',
    batDongSan: 'Căn hộ B5-12',
    loaiHinh: 'thanh_toan',
    soTien: 12000000,
    ngayThucHien: '2024-10-18',
    trangThai: 'cho_duyet',
  },
  {
    id: 'TXN-8931',
    hopDong: 'HD-2024-002',
    khachHang: 'Hoàng Văn E',
    batDongSan: 'Biệt thự C3',
    loaiHinh: 'dat_coc',
    soTien: 50000000,
    ngayThucHien: '2024-10-19',
    trangThai: 'da_hoan_thanh',
  },
]

const LOAI_GIAO_DICH = {
  thanh_toan: { label: 'Thanh toán', color: 'blue' },
  dat_coc: { label: 'Đặt cọc', color: 'amber' },
  hoan_tra: { label: 'Hoàn trả', color: 'purple' },
}

const TRANG_THAI = {
  da_hoan_thanh: { label: 'Đã nhận', color: 'emerald' },
  cho_xu_ly: { label: 'Chờ xử lý', color: 'amber' },
  cho_duyet: { label: 'Chờ duyệt', color: 'orange' },
  da_tu_choi: { label: 'Từ chối', color: 'slate' },
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

export default function TaiChinhPage() {
  const [filterThoiGian, setFilterThoiGian] = useState('tat_ca')
  const [filterTrangThai, setFilterTrangThai] = useState('tat_ca')
  const [filterLoaiHinh, setFilterLoaiHinh] = useState('tat_ca')

  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    if (filterTrangThai !== 'tat_ca' && tx.trangThai !== filterTrangThai) return false
    if (filterLoaiHinh !== 'tat_ca' && tx.loaiHinh !== filterLoaiHinh) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">Quản lý Tiền đảm bảo & Tài chính</h1>
              <p className="text-on-surface-variant text-sm mt-1">
                Theo dõi và quản lý dòng tiền, tiền đặt cọc và các khoản thanh toán.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Xuất báo cáo
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-medium text-sm transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo giao dịch
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Deposit */}
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">Tất cả</span>
            </div>
            <p className="text-xs text-on-surface-variant uppercase mb-1">Tổng tiền đảm bảo đang giữ</p>
            <p className="text-2xl font-bold text-on-surface">{formatCurrency(Number(STATS_DATA.tongTienDamBao))}</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12%
              </span>
            </div>
            <p className="text-xs text-on-surface-variant uppercase mb-1">Tổng doanh thu tháng này</p>
            <p className="text-2xl font-bold text-on-surface">{formatCurrency(Number(STATS_DATA.tongDoanhThu))}</p>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">5 giao dịch</span>
            </div>
            <p className="text-xs text-on-surface-variant uppercase mb-1">Khoản thanh toán chờ duyệt</p>
            <p className="text-2xl font-bold text-on-surface">{formatCurrency(Number(STATS_DATA.khoanChoDuyet))}</p>
          </div>

          {/* Pending Refunds */}
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">2 hợp đồng</span>
            </div>
            <p className="text-xs text-on-surface-variant uppercase mb-1">Khoản cần hoàn trả</p>
            <p className="text-2xl font-bold text-on-surface">{formatCurrency(Number(STATS_DATA.khoanCanHoan))}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-outline-variant p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-on-surface">Danh sách giao dịch</h3>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={filterThoiGian}
                onChange={(e) => setFilterThoiGian(e.target.value)}
                className="px-3 py-2 rounded-lg border border-outline-variant bg-white text-sm text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
              >
                <option value="tat_ca">Tất cả thời gian</option>
                <option value="hom_nay">Hôm nay</option>
                <option value="tuan_nay">Tuần này</option>
                <option value="thang_nay">Tháng này</option>
              </select>

              <select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                className="px-3 py-2 rounded-lg border border-outline-variant bg-white text-sm text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
              >
                <option value="tat_ca">Tất cả trạng thái</option>
                <option value="da_hoan_thanh">Đã nhận</option>
                <option value="cho_xu_ly">Chờ xử lý</option>
                <option value="cho_duyet">Chờ duyệt</option>
              </select>

              <select
                value={filterLoaiHinh}
                onChange={(e) => setFilterLoaiHinh(e.target.value)}
                className="px-3 py-2 rounded-lg border border-outline-variant bg-white text-sm text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
              >
                <option value="tat_ca">Tất cả loại hình</option>
                <option value="thanh_toan">Thanh toán</option>
                <option value="dat_coc">Đặt cọc</option>
                <option value="hoan_tra">Hoàn trả</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Mã GD / Hợp đồng</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Loại hình</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Số tiền</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Ngày thực hiện</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Trạng thái</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-outline-variant hover:bg-surface-container-low">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{tx.id}</p>
                        <p className="text-xs text-on-surface-variant">{tx.hopDong}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-on-surface">{tx.khachHang}</p>
                        <p className="text-xs text-on-surface-variant">{tx.batDongSan}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        tx.loaiHinh === 'thanh_toan' ? 'bg-blue-100 text-blue-700' :
                        tx.loaiHinh === 'dat_coc' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {LOAI_GIAO_DICH[tx.loaiHinh]?.label}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-right font-medium ${
                      tx.soTien < 0 ? 'text-red-600' : 'text-on-surface'
                    }`}>
                      {formatCurrency(Math.abs(tx.soTien))}
                    </td>
                    <td className="py-4 px-4 text-sm text-on-surface-variant">
                      {new Date(tx.ngayThucHien).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        tx.trangThai === 'da_hoan_thanh' ? 'bg-emerald-100 text-emerald-700' :
                        tx.trangThai === 'cho_xu_ly' ? 'bg-amber-100 text-amber-700' :
                        tx.trangThai === 'cho_duyet' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {TRANG_THAI[tx.trangThai]?.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-sm text-primary-container font-medium hover:text-primary transition-colors">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant">
            <p className="text-sm text-on-surface-variant">
              Hiển thị 1–5 trong số 124 giao dịch
            </p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-on-surface-variant px-2">Trang 1 / 42</span>
              <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
