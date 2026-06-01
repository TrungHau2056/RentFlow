import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

// Options cho các trường select
const LOAI_HOP_DONG_OPTIONS = [
  { value: '', label: 'Chọn loại hợp đồng' },
  { value: 'thue_chinh_thuc', label: 'Thuê chính thức' },
  { value: 'thue_ngan_han', label: 'Thuê ngắn hạn' },
  { value: 'thue_dai_han', label: 'Thuê dài hạn' },
]

const PHUONG_THUC_THANH_TOAN_OPTIONS = [
  { value: '', label: 'Chọn phương thức thanh toán' },
  { value: 'chuyen_khoan', label: 'Chuyển khoản' },
  { value: 'tien_mat', label: 'Tiền mặt' },
  { value: 'thanh_toan_qua_app', label: 'Thanh toán qua App' },
]

const TRANG_THAI_HOP_DONG_OPTIONS = [
  { value: '', label: 'Chọn trạng thái' },
  { value: 'nhap', label: 'Nháp' },
  { value: 'cho_phe_duyet', label: 'Chờ phê duyệt' },
  { value: 'da_phe_duyet', label: 'Đã phê duyệt' },
  { value: 'da_ky', label: 'Đã ký' },
]

function formatVND(value) {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN').format(value)
}

function parseVND(str) {
  if (!str) return 0
  return parseInt(str.replace(/[^0-9]/g, '')) || 0
}

export default function TaoHopDongThuePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const lichXemId = searchParams.get('lichXemId')

  const [formData, setFormData] = useState({
    maHopDong: '',
    loaiHopDong: '',
    khachHangId: '',
    batDongSanId: '',
    chuNhaId: '',
    tienThue: '',
    tienCoc: '',
    phuongThucThanhToan: '',
    kyHanThanhToan: '1',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'nhap',
    dieuKhoan: '',
    ghiChu: '',
  })

  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Load dữ liệu từ lịch xem nhà nếu có
  useEffect(() => {
    if (lichXemId) {
      // TODO: Gọi API để lấy thông tin từ lịch xem
      // lichHenXemNhaService.chiTiet(lichXemId).then(res => {
      //   setFormData(prev => ({
      //     ...prev,
      //     khachHangId: res.khachHangId,
      //     batDongSanId: res.batDongSanId,
      //   }))
      // })
      console.log('Loading from viewing schedule:', lichXemId)
    }
  }, [lichXemId])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleVNDChange = (field, value) => {
    // Only allow digits
    const numValue = value.replace(/[^0-9]/g, '')
    setFormData(prev => ({ ...prev, [field]: numValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.khachHangId) newErrors.khachHangId = 'Chưa chọn khách thuê'
    if (!formData.batDongSanId) newErrors.batDongSanId = 'Chưa chọn bất động sản'
    if (!formData.chuNhaId) newErrors.chuNhaId = 'Chưa chọn chủ nhà'
    if (!formData.tienThue) newErrors.tienThue = 'Chưa nhập tiền thuê'
    if (!formData.tienCoc) newErrors.tienCoc = 'Chưa nhập tiền cọc'
    if (!formData.ngayBatDau) newErrors.ngayBatDau = 'Chưa chọn ngày bắt đầu'
    if (!formData.ngayKetThuc) newErrors.ngayKetThuc = 'Chưa chọn ngày kết thúc'

    // Validate ngày kết thúc > ngày bắt đầu
    if (formData.ngayBatDau && formData.ngayKetThuc) {
      if (new Date(formData.ngayKetThuc) <= new Date(formData.ngayBatDau)) {
        newErrors.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      // TODO: Gọi API tạo hợp đồng
      // await hopDongThueService.tao(formData)
      console.log('Creating contract:', formData)
      navigate('/admin/hop-dong-thue')
    } catch (err) {
      console.error('Failed to create contract:', err)
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    if (!validate()) return
    setShowPreview(true)
  }

  // Tính thời hạn hợp đồng (tháng)
  const tinhThoiHan = () => {
    if (!formData.ngayBatDau || !formData.ngayKetThuc) return 0
    const start = new Date(formData.ngayBatDau)
    const end = new Date(formData.ngayKetThuc)
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  }

  const thoiHan = tinhThoiHan()
  const tongGiaTri = parseVND(formData.tienThue) * thoiHan

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/admin/hop-dong-thue" className="hover:text-blue-600">Hợp đồng thuê</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-800 font-medium">Tạo hợp đồng mới</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Lập hợp đồng thuê</h1>
        <p className="text-slate-500 text-sm mt-1">Điền thông tin để tạo hợp đồng thuê bất động sản</p>
      </div>

      {/* Progress indicator */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Thông tin chung', done: true },
            { step: 2, label: 'Điều khoản', done: false },
            { step: 3, label: 'Ký kết', done: false },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  item.done ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {item.step}
                </div>
                <span className={`text-xs mt-1 ${item.done ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </div>
              {i < 2 && <div className="flex-1 h-0.5 mx-3 bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Thông tin hợp đồng */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-5 py-4">
            <h2 className="text-white font-bold text-lg">1. Thông tin hợp đồng</h2>
            <p className="text-blue-200 text-xs mt-0.5">Thông tin chung về hợp đồng thuê</p>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mã hợp đồng</label>
              <input
                type="text"
                value={formData.maHopDong}
                onChange={(e) => handleChange('maHopDong', e.target.value)}
                placeholder="Để trống sẽ tự động tạo"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Loại hợp đồng *</label>
              <select
                value={formData.loaiHopDong}
                onChange={(e) => handleChange('loaiHopDong', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.loaiHopDong ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                {LOAI_HOP_DONG_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.loaiHopDong && <p className="text-xs text-red-600 mt-1">{errors.loaiHopDong}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Trạng thái</label>
              <select
                value={formData.trangThai}
                onChange={(e) => handleChange('trangThai', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {TRANG_THAI_HOP_DONG_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phương thức thanh toán</label>
              <select
                value={formData.phuongThucThanhToan}
                onChange={(e) => handleChange('phuongThucThanhToan', e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {PHUONG_THUC_THANH_TOAN_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Các bên liên quan */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-5 py-4">
            <h2 className="text-white font-bold text-lg">2. Các bên liên quan</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Thông tin về các bên trong hợp đồng</p>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Khách thuê *</label>
              <select
                value={formData.khachHangId}
                onChange={(e) => handleChange('khachHangId', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white ${
                  errors.khachHangId ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                <option value="">Chọn khách thuê</option>
                <option value="1">Nguyễn Văn A</option>
                <option value="2">Trần Thị B</option>
                <option value="3">Lê Văn C</option>
              </select>
              {errors.khachHangId && <p className="text-xs text-red-600 mt-1">{errors.khachHangId}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Chủ nhà *</label>
              <select
                value={formData.chuNhaId}
                onChange={(e) => handleChange('chuNhaId', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white ${
                  errors.chuNhaId ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                <option value="">Chọn chủ nhà</option>
                <option value="1">Phạm Văn D</option>
                <option value="2">Hoàng Thị E</option>
              </select>
              {errors.chuNhaId && <p className="text-xs text-red-600 mt-1">{errors.chuNhaId}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bất động sản *</label>
              <select
                value={formData.batDongSanId}
                onChange={(e) => handleChange('batDongSanId', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white ${
                  errors.batDongSanId ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                <option value="">Chọn bất động sản</option>
                <option value="1">Căn hộ chung cư Royal City - 120m²</option>
                <option value="2">Nhà mặt phố Nguyễn Huệ - 85m²</option>
                <option value="3">Biệt thự Vinhomes Riverside - 350m²</option>
              </select>
              {errors.batDongSanId && <p className="text-xs text-red-600 mt-1">{errors.batDongSanId}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Điều khoản tài chính */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-linear-to-r from-amber-600 to-orange-700 px-5 py-4">
            <h2 className="text-white font-bold text-lg">3. Điều khoản tài chính</h2>
            <p className="text-amber-200 text-xs mt-0.5">Thông tin về giá thuê, thanh toán</p>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tiền thuê (VNĐ/tháng) *</label>
              <input
                type="text"
                value={formData.tienThue ? formatVND(formData.tienThue) : ''}
                onChange={(e) => handleVNDChange('tienThue', e.target.value)}
                placeholder="Nhập số tiền"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.tienThue ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.tienThue && <p className="text-xs text-red-600 mt-1">{errors.tienThue}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tiền cọc (VNĐ) *</label>
              <input
                type="text"
                value={formData.tienCoc ? formatVND(formData.tienCoc) : ''}
                onChange={(e) => handleVNDChange('tienCoc', e.target.value)}
                placeholder="Nhập số tiền cọc"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.tienCoc ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.tienCoc && <p className="text-xs text-red-600 mt-1">{errors.tienCoc}</p>}
              {formData.tienCoc && formData.tienThue && (
                <p className="text-xs text-amber-700 mt-1">
                  = {Math.round(parseVND(formData.tienCoc) / parseVND(formData.tienThue))} tháng thuê
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kỳ hạn thanh toán</label>
              <select
                value={formData.kyHanThanhToan}
                onChange={(e) => handleChange('kyHanThanhToan', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="1">1 tháng</option>
                <option value="3">3 tháng</option>
                <option value="6">6 tháng</option>
                <option value="12">12 tháng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Thời hạn hợp đồng */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-linear-to-r from-purple-600 to-pink-700 px-5 py-4">
            <h2 className="text-white font-bold text-lg">4. Thời hạn hợp đồng</h2>
            <p className="text-purple-200 text-xs mt-0.5">Thời gian hiệu lực của hợp đồng</p>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ngày bắt đầu *</label>
              <input
                type="date"
                value={formData.ngayBatDau}
                onChange={(e) => handleChange('ngayBatDau', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.ngayBatDau ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.ngayBatDau && <p className="text-xs text-red-600 mt-1">{errors.ngayBatDau}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ngày kết thúc *</label>
              <input
                type="date"
                value={formData.ngayKetThuc}
                onChange={(e) => handleChange('ngayKetThuc', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.ngayKetThuc ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.ngayKetThuc && <p className="text-xs text-red-600 mt-1">{errors.ngayKetThuc}</p>}
            </div>
            {thoiHan > 0 && (
              <>
                <div className="col-span-2 bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-600 font-semibold">Thời hạn hợp đồng</p>
                      <p className="text-lg font-bold text-emerald-800">{thoiHan} tháng</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-600 font-semibold">Tổng giá trị hợp đồng</p>
                      <p className="text-lg font-bold text-emerald-800">{formatVND(tongGiaTri)}đ</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 5: Điều khoản khác */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-linear-to-r from-slate-600 to-slate-700 px-5 py-4">
            <h2 className="text-white font-bold text-lg">5. Điều khoản khác</h2>
            <p className="text-slate-200 text-xs mt-0.5">Các điều khoản và ghi chú bổ sung</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Điều khoản hợp đồng</label>
              <textarea
                value={formData.dieuKhoan}
                onChange={(e) => handleChange('dieuKhoan', e.target.value)}
                rows={4}
                placeholder="Nhập các điều khoản chính của hợp đồng..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => handleChange('ghiChu', e.target.value)}
                rows={2}
                placeholder="Ghi chú bổ sung (nếu có)..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/hop-dong-thue')}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Xem trước
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Tạo hợp đồng'}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPreview(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-xs">Xem trước hợp đồng</p>
                  <h3 className="text-white font-bold text-lg">
                    {formData.maHopDong || 'Hợp đồng thuê (chưa có mã)'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Thông tin hợp đồng</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Loại hợp đồng:</span>
                    <p className="font-medium text-slate-800">
                      {LOAI_HOP_DONG_OPTIONS.find(o => o.value === formData.loaiHopDong)?.label || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Trạng thái:</span>
                    <p className="font-medium text-slate-800">
                      {TRANG_THAI_HOP_DONG_OPTIONS.find(o => o.value === formData.trangThai)?.label || '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Các bên liên quan</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách thuê:</span>
                    <span className="font-medium text-slate-800">
                      {formData.khachHangId ? `Khách #${formData.khachHangId}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chủ nhà:</span>
                    <span className="font-medium text-slate-800">
                      {formData.chuNhaId ? `Chủ #${formData.chuNhaId}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bất động sản:</span>
                    <span className="font-medium text-slate-800">
                      {formData.batDongSanId ? `BĐS #${formData.batDongSanId}` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Điều khoản tài chính</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tiền thuê:</span>
                    <span className="font-semibold text-slate-800">{formatVND(formData.tienThue)}đ/tháng</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tiền cọc:</span>
                    <span className="font-semibold text-slate-800">{formatVND(formData.tienCoc)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kỳ hạn thanh toán:</span>
                    <span className="font-medium text-slate-800">{formData.kyHanThanhToan} tháng</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Thời hạn</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày bắt đầu:</span>
                    <span className="font-medium text-slate-800">{formData.ngayBatDau || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày kết thúc:</span>
                    <span className="font-medium text-slate-800">{formData.ngayKetThuc || '—'}</span>
                  </div>
                  {thoiHan > 0 && (
                    <>
                      <div className="flex justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-500">Thời hạn:</span>
                        <span className="font-bold text-emerald-700">{thoiHan} tháng</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tổng giá trị:</span>
                        <span className="font-bold text-emerald-700">{formatVND(tongGiaTri)}đ</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {formData.dieuKhoan && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Điều khoản</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{formData.dieuKhoan}</p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                Xác nhận tạo hợp đồng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
