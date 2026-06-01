import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import batDongSanService from '../services/batDongSanService'
import hopDongKyGuiService from '../services/hopDongKyGuiService'
import lichHenKhaoSatService from '../services/lichHenKhaoSatService'

const STATUS_STYLES = {
  CHO_DUYET: 'bg-amber-100 text-amber-700 border-amber-200',
  DA_KHAO_SAT: 'bg-blue-100 text-blue-700 border-blue-200',
  DANG_SOAN_HOP_DONG: 'bg-purple-100 text-purple-700 border-purple-200',
  SAN_SANG_CHO_THUE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  DANG_CHO_THUE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  DA_THUE: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  NGUNG_CHO_THUE: 'bg-slate-100 text-slate-600 border-slate-200',
  DA_TRA: 'bg-slate-100 text-slate-600 border-slate-200',
  TU_CHOI: 'bg-red-100 text-red-600 border-red-200',
}

const STATUS_LABELS = {
  CHO_DUYET: 'Chờ duyệt',
  DA_KHAO_SAT: 'Đã khảo sát',
  DANG_SOAN_HOP_DONG: 'Đang soạn hợp đồng',
  SAN_SANG_CHO_THUE: 'Sẵn sàng cho thuê',
  DANG_CHO_THUE: 'Đang cho thuê',
  DA_THUE: 'Đã thuê',
  NGUNG_CHO_THUE: 'Ngừng cho thuê',
  DA_TRA: 'Đã trả',
  TU_CHOI: 'Từ chối',
}

const CONTRACT_STATUS_LABELS = {
  NHAP: 'Nháp',
  CHO_PHE_DUYET: 'Chờ phê duyệt',
  DA_PHE_DUYET: 'Đã phê duyệt',
  DA_KY: 'Đã ký',
  DANG_HIEU_LUC: 'Đang hiệu lực',
  DA_KET_THUC: 'Đã kết thúc',
  TU_CHOI: 'Từ chối',
}

function formatVND(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function toLocalDateString(arr) {
  if (!arr || arr.length < 3) return null
  const [y, m, d] = arr
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function ChiTietQuanLyBatDongSanPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('tong-quan')
  const [property, setProperty] = useState(null)
  const [contracts, setContracts] = useState([])
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      batDongSanService.chiTiet(Number(id)),
      hopDongKyGuiService.theoBDS(Number(id)),
      lichHenKhaoSatService.theoBatDongSan(Number(id)),
    ])
      .then(([bdsRes, hdRes, surveyRes]) => {
        setProperty(bdsRes.data)
        setContracts(hdRes.data || [])
        setSurveys(surveyRes?.data || [])
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message || 'Không thể tải dữ liệu')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const pendingSurvey = surveys.find(s => s.trangThai === 'CHO_XAC_NHAN')

  const handleConfirmSurvey = () => {
    if (!pendingSurvey) return
    setActionLoading(true)
    lichHenKhaoSatService.capNhatTrangThai(pendingSurvey.id, 'DA_XAC_NHAN')
      .then(() => fetchData())
      .catch(() => {})
      .finally(() => setActionLoading(false))
  }

  const handleCancelSurvey = () => {
    if (!pendingSurvey) return
    setActionLoading(true)
    lichHenKhaoSatService.capNhatTrangThai(pendingSurvey.id, 'DA_HUY')
      .then(() => fetchData())
      .catch(() => {})
      .finally(() => setActionLoading(false))
  }

  const TABS = [
    { id: 'tong-quan', label: 'Tổng quan' },
    { id: 'hop-dong', label: 'Hợp đồng' },
  ]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 text-on-surface-variant">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 underline">Thử lại</button>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <p className="text-on-surface-variant">Không tìm thấy bất động sản</p>
        <Link to="/dashboard/bat-dong-san" className="mt-4 inline-block text-blue-600 underline">Quay lại danh sách</Link>
      </div>
    )
  }

  const ngayTao = property.ngayTao ? toLocalDateString(property.ngayTao) : null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
              <Link to="/dashboard/bat-dong-san" className="hover:text-primary-container">Bất động sản</Link>
              <span>/</span>
              <span className="text-on-surface">Chi tiết</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">
              {property.loaiNha || 'Bất động sản'} - {property.diaChi}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[property.trangThai] || 'bg-slate-100 text-slate-600'}`}>
            ● {STATUS_LABELS[property.trangThai] || property.trangThai}
          </span>
          <span className="text-sm text-on-surface-variant">
            Mã BĐS: #{String(id).padStart(4, '0')}
          </span>
        </div>
      </div>

      {pendingSurvey && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Lịch khảo sát đang chờ xác nhận</p>
              <p className="text-sm text-amber-700">
                Nhân viên <strong>{pendingSurvey.tenNhanVien}</strong> sẽ khảo sát lúc{' '}
                <strong>{new Date(pendingSurvey.thoiGian).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</strong>,{' '}
                ngày <strong>{new Date(pendingSurvey.thoiGian).toLocaleDateString('vi-VN')}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirmSurvey}
              disabled={actionLoading}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
            <button
              onClick={handleCancelSurvey}
              disabled={actionLoading}
              className="px-5 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy lịch
            </button>
          </div>
        </div>
      )}

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

      {activeTab === 'tong-quan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-outline-variant p-5">
              <h3 className="font-semibold text-on-surface mb-4">Thông tin cơ bản</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Địa chỉ</p>
                  <p className="text-sm font-medium text-on-surface">{property.diaChi || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Loại nhà</p>
                  <p className="text-sm font-medium text-on-surface">{property.loaiNha || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Diện tích</p>
                  <p className="text-sm font-medium text-on-surface">{property.dienTich ? `${property.dienTich} m²` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Giá thuê</p>
                  <p className="text-sm font-medium text-blue-600">{property.giaThue ? formatVND(property.giaThue) : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Phòng ngủ</p>
                  <p className="text-sm font-medium text-on-surface">{property.soPhongNgu != null ? `${property.soPhongNgu} PN` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Phòng vệ sinh</p>
                  <p className="text-sm font-medium text-on-surface">{property.soPhongVeSinh != null ? `${property.soPhongVeSinh} VS` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Hướng</p>
                  <p className="text-sm font-medium text-on-surface">{property.huong || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Giá đề xuất</p>
                  <p className="text-sm font-medium text-on-surface">{property.giaDeXuat ? formatVND(property.giaDeXuat) : '—'}</p>
                </div>
              </div>
            </div>

            {property.moTa && (
              <div className="bg-white rounded-xl border border-outline-variant p-5">
                <h3 className="font-semibold text-on-surface mb-3">Mô tả</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{property.moTa}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-outline-variant p-5">
              <h3 className="font-semibold text-on-surface mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Chủ nhà</span>
                  <span className="text-sm font-semibold text-on-surface">{property.tenChuNha || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Ngày tạo</span>
                  <span className="text-sm font-semibold text-on-surface">{ngayTao || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Trạng thái</span>
                  <span className={`text-sm font-semibold ${property.trangThai === 'SAN_SANG_CHO_THUE' || property.trangThai === 'DANG_CHO_THUE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {STATUS_LABELS[property.trangThai] || property.trangThai}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant p-5">
              <h3 className="font-semibold text-on-surface mb-4">Thao tác nhanh</h3>
              <div className="space-y-2">
                <Link
                  to={`/dashboard/bat-dong-san/${id}/edit`}
                  className="w-full block py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm text-center transition-colors"
                >
                  Chỉnh sửa thông tin
                </Link>
                <Link
                  to="/dashboard/bat-dong-san/dang-ky"
                  className="w-full block py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container font-medium text-sm text-center transition-colors"
                >
                  Thêm bất động sản mới
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hop-dong' && (
        <div className="bg-white rounded-xl border border-outline-variant p-6">
          <h3 className="font-semibold text-on-surface mb-6">Danh sách hợp đồng</h3>

          {contracts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-on-surface-variant text-sm">Chưa có hợp đồng nào cho bất động sản này</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Mã HĐ</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Ngày ký</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Thời hạn</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Tiền đảm bảo</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Trạng thái</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-on-surface-variant uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-outline-variant hover:bg-surface-container-low">
                      <td className="py-4 px-4 text-sm font-medium text-on-surface">#{String(contract.id).padStart(5, '0')}</td>
                      <td className="py-4 px-4 text-sm text-on-surface-variant">{formatDate(contract.ngayKy)}</td>
                      <td className="py-4 px-4 text-sm text-on-surface-variant">
                        {formatDate(contract.ngayBatDau)} - {formatDate(contract.ngayKetThuc)}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-on-surface">{contract.tienDamBao ? formatVND(contract.tienDamBao) : '—'}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          {CONTRACT_STATUS_LABELS[contract.trangThai] || contract.trangThai}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/dashboard/hop-dong-ky-gui/${contract.id}`}
                          className="text-sm text-blue-600 font-medium hover:text-blue-700"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
