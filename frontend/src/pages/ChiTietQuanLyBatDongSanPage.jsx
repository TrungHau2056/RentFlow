import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const PROPERTY_DETAIL = {
  id: 1,
  title: 'Biệt thự Phố Cổ cao cấp',
  address: '123 Hàng Ngang, Hoàn Kiếm, Hà Nội',
  price: '45.5 Tỷ',
  area: '320 m²',
  bedrooms: 4,
  bathrooms: 5,
  floors: 3,
  direction: 'Đông Nam',
  legalStatus: 'Sổ đỏ chính chủ',
  status: 'Dang_Cho_Thue',
  statusLabel: 'Đang cho thuê',
  ngayDangKy: '2024-01-15',
  luotXem: 1247,
  tienIch: ['Bể bơi', 'Gym', 'Sân vườn', 'Garage', 'An ninh 24/7', 'Thang máy'],
}

const CONTRACTS = [
  {
    id: 1,
    tenantName: 'Nguyễn Văn A',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    price: '15.000.000 đ/tháng',
    status: 'Con_Hieu_Luc',
  },
]

const ACTIVITIES = [
  { id: 1, type: 'lich_xem', message: 'Lịch xem nhà', time: 'Hôm nay, 14:00' },
  { id: 2, type: 'thanh_toan', message: 'Nhận tiền thuê', time: 'Hôm qua' },
  { id: 3, type: 'bao_tri', message: 'Bảo trì điều hòa', time: '3 ngày trước' },
]

const STATUS_STYLES = {
  Dang_Cho_Thue: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Da_Cho_Thue: 'bg-blue-100 text-blue-700 border-blue-200',
  Con_Trong: 'bg-amber-100 text-amber-700 border-amber-200',
  Het_Han: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function ChiTietQuanLyBatDongSanPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('tong-quan')

  const TABS = [
    { id: 'tong-quan', label: 'Tổng quan', icon: 'overview' },
    { id: 'hop-dong', label: 'Hợp đồng', icon: 'contract' },
    { id: 'khach-thue', label: 'Khách thuê', icon: 'users' },
    { id: 'lich-su', label: 'Lịch sử', icon: 'history' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
                <Link to="/dashboard/bat-dong-san" className="hover:text-primary-container">Bất động sản</Link>
                <span>/</span>
                <span className="text-on-surface">Chi tiết</span>
              </div>
              <h1 className="text-2xl font-bold text-on-surface">{PROPERTY_DETAIL.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/dashboard/bat-dong-san/${id}/edit`}
                className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </Link>
              <button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-medium text-sm transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm hợp đồng
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[PROPERTY_DETAIL.status]}`}>
              ● {PROPERTY_DETAIL.statusLabel}
            </span>
            <span className="text-sm text-on-surface-variant">
              Mã BĐS: #BDS{String(id).padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-1 bg-surface-container-low rounded-xl p-1 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'tong-quan' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                <div className="grid grid-cols-3">
                  <div className="col-span-2">
                    <img
                      src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop"
                      alt="Property"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                  <div className="grid grid-rows-2 gap-1">
                    <img
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
                      alt="Property 2"
                      className="w-full h-full object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
                      alt="Property 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-white rounded-xl border border-outline-variant p-5">
                <h3 className="font-semibold text-on-surface mb-4">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Địa chỉ</p>
                    <p className="text-sm font-medium text-on-surface">{PROPERTY_DETAIL.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Giá</p>
                    <p className="text-sm font-medium text-primary-container">{PROPERTY_DETAIL.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Diện tích</p>
                    <p className="text-sm font-medium text-on-surface">{PROPERTY_DETAIL.area}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Hướng</p>
                    <p className="text-sm font-medium text-on-surface">{PROPERTY_DETAIL.direction}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-outline-variant p-5">
                <h3 className="font-semibold text-on-surface mb-3">Mô tả</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Biệt thự cao cấp tại khu vực trung tâm, thiết kế hiện đại với đầy đủ tiện nghi.
                  Phù hợp cho gia đình đa thế hệ hoặc làm văn phòng công ty.
                </p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl border border-outline-variant p-5">
                <h3 className="font-semibold text-on-surface mb-4">Tiện ích</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PROPERTY_DETAIL.tienIch.map((tienIch) => (
                    <div key={tienIch} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <svg className="w-4 h-4 text-primary-container" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {tienIch}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-xl border border-outline-variant p-5">
                <h3 className="font-semibold text-on-surface mb-4">Thống kê</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Lượt xem</span>
                    <span className="text-sm font-semibold text-on-surface">{PROPERTY_DETAIL.luotXem}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Ngày đăng ký</span>
                    <span className="text-sm font-semibold text-on-surface">{PROPERTY_DETAIL.ngayDangKy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Trạng thái</span>
                    <span className="text-sm font-semibold text-emerald-600">Đang hoạt động</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-outline-variant p-5">
                <h3 className="font-semibold text-on-surface mb-4">Thao tác nhanh</h3>
                <div className="space-y-2">
                  <button className="w-full py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-medium text-sm transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Đặt lịch xem nhà
                  </button>
                  <button className="w-full py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container font-medium text-sm transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Nhắn tin
                  </button>
                  <button className="w-full py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container font-medium text-sm transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Chia sẻ
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-outline-variant p-5">
                <h3 className="font-semibold text-on-surface mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                  {ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'lich_xem' ? 'bg-blue-500' :
                        activity.type === 'thanh_toan' ? 'bg-emerald-500' :
                        'bg-amber-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-on-surface">{activity.message}</p>
                        <p className="text-xs text-on-surface-variant">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hop-dong' && (
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-on-surface">Danh sách hợp đồng</h3>
              <button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-medium text-sm transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo hợp đồng mới
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Mã HĐ</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Khách thuê</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Thời hạn</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Giá thuê</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Trạng thái</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRACTS.map((contract) => (
                    <tr key={contract.id} className="border-b border-outline-variant hover:bg-surface-container-low">
                      <td className="py-4 px-4 text-sm font-medium text-on-surface">#{String(contract.id).padStart(5, '0')}</td>
                      <td className="py-4 px-4 text-sm text-on-surface">{contract.tenantName}</td>
                      <td className="py-4 px-4 text-sm text-on-surface-variant">
                        {contract.startDate} - {contract.endDate}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-primary-container">{contract.price}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Còn hiệu lực
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-sm text-primary-container font-medium hover:text-primary">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'khach-thue' && (
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="font-semibold text-on-surface mb-6">Thông tin khách thuê</h3>
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
                <span className="text-on-primary text-xl font-bold">NA</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-on-surface">Nguyễn Văn A</h4>
                <p className="text-sm text-on-surface-variant">0988.123.456 • NguyenVanA@email.com</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container font-medium text-sm transition-colors">
                  Nhắn tin
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-medium text-sm transition-colors">
                  Gọi điện
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lich-su' && (
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="font-semibold text-on-surface mb-6">Lịch sử hoạt động</h3>
            <div className="space-y-4">
              {[
                { date: 'Hôm nay, 14:00', event: 'Lịch xem nhà được đặt', type: 'lich_xem' },
                { date: 'Hôm qua, 09:30', event: 'Nhận thanh toán tiền thuê tháng', type: 'payment' },
                { date: '3 ngày trước', event: 'Hợp đồng được gia hạn', type: 'contract' },
                { date: '1 tuần trước', event: 'Cập nhật thông tin BĐS', type: 'update' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'lich_xem' ? 'bg-blue-100' :
                    item.type === 'payment' ? 'bg-emerald-100' :
                    item.type === 'contract' ? 'bg-purple-100' :
                    'bg-slate-100'
                  }`}>
                    {item.type === 'lich_xem' ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : item.type === 'payment' ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : item.type === 'contract' ? (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{item.event}</p>
                    <p className="text-xs text-on-surface-variant">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  )
}
