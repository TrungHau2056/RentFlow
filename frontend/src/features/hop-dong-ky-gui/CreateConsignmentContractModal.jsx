import { useState } from 'react'
import hopDongKyGuiService from '../../services/hopDongKyGuiService'

/**
 * CreateConsignmentContractModal — Two-step form:
 *   Step 0: Select owner, property, dates, deposit
 *   Step 1: Check/additional clauses, submit
 *
 * Props:
 *   onClose     — close modal
 *   onCreate    — callback after successful creation (refetch list)
 *   chuNhaList  — array of { id, hoTen, ... }
 *   batDongSanList — array of { id, diaChi, chuNhaId, trangThai, ... }
 */
export default function CreateConsignmentContractModal({
  onClose,
  onCreate,
  chuNhaList = [],
  batDongSanList = [],
}) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    chuNhaId: '',
    batDongSanId: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    tienDamBao: '',
    coDieuKhoanPhatSinh: false,
    dieuKhoanPhatSinh: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /* ---------- helpers ---------- */

  const selectedOwner = chuNhaList.find((c) => String(c.id) === String(formData.chuNhaId))
  const selectedBDS = batDongSanList.find((b) => String(b.id) === String(formData.batDongSanId))

  function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
  }

  /* ---------- validation ---------- */

  const validateStep = (stepNum) => {
    setError('')
    if (stepNum === 0) {
      if (!formData.chuNhaId) {
        setError('Vui lòng chọn chủ nhà')
        return false
      }
      if (!formData.batDongSanId) {
        setError('Vui lòng chọn bất động sản')
        return false
      }
      if (!formData.ngayBatDau) {
        setError('Vui lòng chọn ngày bắt đầu')
        return false
      }
      if (!formData.ngayKetThuc) {
        setError('Vui lòng chọn ngày kết thúc')
        return false
      }
      if (formData.ngayKetThuc <= formData.ngayBatDau) {
        setError('Ngày kết thúc phải sau ngày bắt đầu')
        return false
      }
      if (!formData.tienDamBao || Number(formData.tienDamBao) <= 0) {
        setError('Tiền đảm bảo phải lớn hơn 0')
        return false
      }
    }
    if (stepNum === 1) {
      if (formData.coDieuKhoanPhatSinh && !formData.dieuKhoanPhatSinh.trim()) {
        setError('Vui lòng mô tả điều khoản phát sinh')
        return false
      }
    }
    return true
  }

  const goNext = () => {
    if (validateStep(step)) setStep((s) => s + 1)
  }

  const goBack = () => {
    setStep((s) => s - 1)
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const rawId = userInfo?.id
      const employeeId = rawId != null && rawId > 0 ? Number(rawId) : null
      const payload = {
        chuNhaId: Number(formData.chuNhaId),
        batDongSanId: Number(formData.batDongSanId),
        nhanVienId: employeeId,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
        tienDamBao: Number(formData.tienDamBao),
      }

      if (formData.coDieuKhoanPhatSinh) {
        // Có điều khoản phát sinh → tạo NHAP rồi gửi pháp lý duyệt
        const res = await hopDongKyGuiService.tao(payload)
        // BE dùng @ResponseStatus(HttpStatus.OK) nên lỗi cũng trả về 200
        // → cần check status trong body thay vì HTTP status
        if (res?.status !== 201) {
          throw new Error(res?.message || 'Không thể tạo hợp đồng')
        }
        const contractId = res?.data?.id ?? res?.id
        if (!contractId) {
          throw new Error('Không lấy được ID hợp đồng từ phản hồi')
        }
        await hopDongKyGuiService.guiPheDuyet(contractId)
      } else {
        // Không có điều khoản → tạo và ký luôn
        const res = await hopDongKyGuiService.taoVaKy(payload)
        if (res?.status !== 201) {
          throw new Error(res?.message || 'Không thể tạo hợp đồng')
        }
      }

      onCreate()
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo hợp đồng')
    } finally {
      setLoading(false)
    }
  }

  /* ---------- property filtering ---------- */

  // Filter BDS that belong to selected owner and are eligible (DA_KHAO_SAT or available)
  const eligibleBatDongSan = formData.chuNhaId
    ? batDongSanList.filter((bds) => {
        const belongsToOwner = String(bds.chuNhaId) === String(formData.chuNhaId)
        if (!belongsToOwner) return false
        // Accept properties with DA_KHAO_SAT status or no existing active contract
        const status = (bds.trangThai || '').toUpperCase()
        return !status || status === 'DA_KHAO_SAT' || status === 'DA_DANH_GIA' || status === ''
      })
    : batDongSanList

  const changeOwner = (chuNhaId) => {
    setFormData((prev) => ({
      ...prev,
      chuNhaId,
      // Reset BDS when owner changes
      batDongSanId: '',
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tạo hợp đồng ký gửi</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 0 ? 'Soạn thảo hợp đồng ký gửi mới' : step === 1 ? 'Kiểm tra điều khoản phát sinh' : 'Xác nhận thông tin hợp đồng'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                step >= 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              1
            </div>
            <div className={`flex-1 h-0.5 ${step >= 1 ? 'bg-blue-500' : 'bg-slate-200'}`} />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-200'}`} />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </span>
            </div>
          )}

          {/* Step 0: Basic info */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {/* Chủ nhà */}
              <label className="col-span-2">
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Chủ nhà *</span>
                <select
                  value={formData.chuNhaId}
                  onChange={(e) => changeOwner(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">-- Chọn chủ nhà --</option>
                  {chuNhaList.map((cn) => (
                    <option key={cn.id} value={cn.id}>
                      {cn.hoTen}
                    </option>
                  ))}
                </select>
              </label>

              {/* Bất động sản */}
              <label className="col-span-2">
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Bất động sản *
                  {formData.chuNhaId && eligibleBatDongSan.length === 0 && (
                    <span className="text-amber-600 ml-2 font-normal">
                      (Chủ nhà này chưa có BĐS đủ điều kiện)
                    </span>
                  )}
                </span>
                <select
                  value={formData.batDongSanId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, batDongSanId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                  disabled={!formData.chuNhaId}
                >
                  <option value="">-- Chọn bất động sản --</option>
                  {eligibleBatDongSan.map((bds) => (
                    <option key={bds.id} value={bds.id}>
                      {bds.diaChi || bds.tenBatDongSan || `BĐS #${bds.id}`}
                      {bds.trangThai ? ` (${bds.trangThai})` : ''}
                    </option>
                  ))}
                </select>
                {!formData.chuNhaId && (
                  <p className="text-xs text-slate-400 mt-1">Vui lòng chọn chủ nhà trước</p>
                )}
              </label>

              {/* Ngày bắt đầu */}
              <label>
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày bắt đầu *</span>
                <input
                  type="date"
                  value={formData.ngayBatDau}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ngayBatDau: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </label>

              {/* Ngày kết thúc */}
              <label>
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày kết thúc *</span>
                <input
                  type="date"
                  value={formData.ngayKetThuc}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ngayKetThuc: e.target.value }))}
                  min={formData.ngayBatDau || ''}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </label>

              {/* Tiền đảm bảo */}
              <label className="col-span-2">
                <span className="block text-xs font-semibold text-slate-600 mb-1.5">Tiền đảm bảo (VNĐ) *</span>
                <input
                  type="number"
                  value={formData.tienDamBao}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tienDamBao: e.target.value }))}
                  placeholder="10000000"
                  min="1"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </label>
            </div>
          )}

          {/* Step 1: Additional clauses */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Có điều khoản phát sinh?</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kiểm tra xem hợp đồng có điều khoản đặc biệt nào cần lưu ý không
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, coDieuKhoanPhatSinh: false, dieuKhoanPhatSinh: '' }))
                  }
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                    !formData.coDieuKhoanPhatSinh
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Không có
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coDieuKhoanPhatSinh: true }))}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                    formData.coDieuKhoanPhatSinh
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Có điều khoản
                </button>
              </div>

              {formData.coDieuKhoanPhatSinh && (
                <label className="block">
                  <span className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Mô tả điều khoản phát sinh *
                  </span>
                  <textarea
                    value={formData.dieuKhoanPhatSinh}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dieuKhoanPhatSinh: e.target.value }))}
                    placeholder="Mô tả chi tiết các điều khoản đặc biệt cần lưu ý..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    required={formData.coDieuKhoanPhatSinh}
                  />
                </label>
              )}

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-700 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Lưu ý: Nếu có điều khoản phát sinh, hợp đồng sẽ được đánh dấu để bộ phận pháp lý xem xét kỹ hơn.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Review & confirm */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Xác nhận thông tin hợp đồng</p>
                <p className="text-xs text-slate-500 mt-0.5">Vui lòng kiểm tra lại thông tin trước khi tạo</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Chủ nhà</span>
                  <span className="font-medium text-slate-800">{selectedOwner?.hoTen || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bất động sản</span>
                  <span className="font-medium text-slate-800">{selectedBDS?.diaChi || selectedBDS?.tenBatDongSan || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ngày bắt đầu</span>
                  <span className="font-medium text-slate-800">{formData.ngayBatDau || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ngày kết thúc</span>
                  <span className="font-medium text-slate-800">{formData.ngayKetThuc || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tiền đảm bảo</span>
                  <span className="font-medium text-slate-800">{formData.tienDamBao ? formatCurrency(formData.tienDamBao) : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Điều khoản phát sinh</span>
                  <span className="font-medium text-slate-800">{formData.coDieuKhoanPhatSinh ? 'Có' : 'Không'}</span>
                </div>
                {formData.coDieuKhoanPhatSinh && formData.dieuKhoanPhatSinh && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Mô tả:</p>
                    <p className="text-sm text-slate-700 italic">{formData.dieuKhoanPhatSinh}</p>
                  </div>
                )}
              </div>

              {!formData.coDieuKhoanPhatSinh && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-medium text-emerald-700">
                    ✅ Hợp đồng sẽ được tạo và ký ngay (không cần phê duyệt pháp lý)
                  </p>
                </div>
              )}
              {formData.coDieuKhoanPhatSinh && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-medium text-amber-700">
                    ⏳ Hợp đồng sẽ được tạo và gửi cho bộ phận pháp luật phê duyệt
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                disabled={loading}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Quay lại
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Tiếp tục
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo...
                  </span>
                ) : (
                  'Xác nhận tạo hợp đồng'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
