import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import lichHenKhaoSatService from '../services/lichHenKhaoSatService'
import batDongSanService from '../services/batDongSanService'

const STATUS_CONFIG = {
  CHO_XAC_NHAN: {
    label: 'Chờ xác nhận',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
  },
  DA_XAC_NHAN: {
    label: 'Đã xác nhận',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot: 'bg-blue-500',
  },
  DA_HOAN_THANH: {
    label: 'Hoàn thành',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  DA_HUY: {
    label: 'Hủy',
    className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    dot: 'bg-rose-500',
  },
}

const WORKFLOW_STEPS = ['Tiếp nhận', 'Xác nhận lịch', 'Khảo sát', 'Ghi kết quả', 'Hoàn tất']

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.CHO_XAC_NHAN
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

function KpiCard({ label, value, note, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <span className={`h-10 w-10 rounded-lg ${accent}`} />
      </div>
    </div>
  )
}

function ActionButton({ label, variant = 'secondary', children, onClick, disabled }) {
  const className = variant === 'primary'
    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
    : variant === 'danger'
      ? 'border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      {label}
    </button>
  )
}

function WorkflowTimeline({ currentStep }) {
  return (
    <div className="space-y-0">
      {WORKFLOW_STEPS.map((step, index) => {
        const done = index + 1 < currentStep
        const active = index + 1 === currentStep

        return (
          <div key={step} className="relative flex gap-3 pb-5">
            {index < WORKFLOW_STEPS.length - 1 && (
              <span className="absolute left-[11px] top-7 h-full w-px bg-slate-200" />
            )}
            <span className={`relative mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              done ? 'bg-emerald-600 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {done ? '✓' : index + 1}
            </span>
            <div>
              <p className={`text-sm font-semibold ${active ? 'text-blue-700' : 'text-slate-900'}`}>{step}</p>
              <p className="mt-1 text-xs text-slate-500">
                {done ? 'Đã hoàn tất' : active ? 'Đang xử lý' : 'Chưa thực hiện'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SurveyResultForm({ survey, onSubmit, saving }) {
  const [rating, setRating] = useState(survey.result?.rating || 'Tốt')
  const [condition, setCondition] = useState(survey.result?.condition || '')
  const [furniture, setFurniture] = useState(survey.result?.furniture || '')
  const [ghiChu, setGhiChu] = useState(survey.result?.note || '')

  const handleSubmit = () => {
    if (!onSubmit) return
    const dat = rating === 'Tốt'
    const ketQuaKhaoSat = [rating, condition, furniture].filter(Boolean).join('. ')
    onSubmit({ ketQuaKhaoSat, dat, ghiChu })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">Đánh giá</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {['Tốt', 'Không đạt'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRating(option)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                rating === option
                  ? option === 'Tốt'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-red-600 bg-red-50 text-red-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-900">Hiện trạng nhà</span>
        <textarea
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          rows={3}
          placeholder="Mô tả kết cấu, tường, sàn, điện nước, vệ sinh..."
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-900">Nội thất</span>
        <textarea
          value={furniture}
          onChange={(e) => setFurniture(e.target.value)}
          rows={3}
          placeholder="Tình trạng nội thất, thiết bị bàn giao, hạng mục cần bổ sung..."
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          <span className="text-sm font-semibold text-slate-700">Upload hình ảnh</span>
          <input type="file" multiple accept="image/*" className="mt-3 w-full text-xs text-slate-500" />
        </label>
        <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          <span className="text-sm font-semibold text-slate-700">File đính kèm</span>
          <input type="file" multiple className="mt-3 w-full text-xs text-slate-500" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-900">Ghi chú khảo sát</span>
        <textarea
          value={ghiChu}
          onChange={(e) => setGhiChu(e.target.value)}
          rows={3}
          placeholder="Ghi chú nội bộ, đề xuất xử lý, điều kiện chuyển hợp đồng..."
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <ActionButton label={saving ? 'Đang lưu...' : 'Lưu kết quả'} variant="primary" onClick={handleSubmit} disabled={saving} />
        <ActionButton label="Chuyển sang tạo hợp đồng ký gửi" />
      </div>
    </div>
  )
}

function SurveyDrawer({ survey, onClose, onSaveResult, saving, onStatusChange }) {
  const resultFormRef = useRef(null)
  const [actionLoading, setActionLoading] = useState(null)

  if (!survey) return null

  const handleConfirm = async () => {
    setActionLoading('confirm')
    try {
      await onStatusChange(survey.id, 'DA_XAC_NHAN')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async () => {
    setActionLoading('cancel')
    try {
      await onStatusChange(survey.id, 'DA_HUY')
    } finally {
      setActionLoading(null)
    }
  }

  const scrollToResult = () => {
    resultFormRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <button
        type="button"
        aria-label="Đóng chi tiết lịch khảo sát"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/35"
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col bg-white shadow-2xl sm:w-180">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{survey.id}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{survey.diaChiBatDongSan || survey.property}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={survey.trangThai || survey.status} />
                <span className="text-xs text-slate-500">{formatDate(survey.thoiGian || survey.date)} · {formatTime(survey.thoiGian || survey.date)}</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(survey.trangThai || survey.status) === 'CHO_XAC_NHAN' && (
              <ActionButton label={actionLoading === 'confirm' ? 'Đang xử lý...' : 'Xác nhận lịch'} variant="primary" onClick={handleConfirm} disabled={!!actionLoading} />
            )}
            {(survey.trangThai || survey.status) !== 'DA_HUY' && (survey.trangThai || survey.status) !== 'DA_HOAN_THANH' && (
              <ActionButton label={actionLoading === 'cancel' ? 'Đang xử lý...' : 'Hủy lịch'} variant="danger" onClick={handleCancel} disabled={!!actionLoading} />
            )}
            {(survey.trangThai || survey.status) === 'DA_XAC_NHAN' && (
              <ActionButton label="Cập nhật kết quả" onClick={scrollToResult} />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_240px]">
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thông tin lịch khảo sát</h3>
                <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ['Chủ nhà', survey.tenChuNha || survey.owner],
                    ['Bất động sản', survey.diaChiBatDongSan || survey.property],
                    ['Người phụ trách', survey.tenNhanVien || survey.inspector],
                    ['SĐT chủ nhà', survey.sdtChuNha || survey.phone],
                    ['Khu vực', survey.khuVuc || survey.district],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs font-medium text-slate-500">{label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
                {survey.ghiChu && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-semibold text-amber-700">Ghi chú</p>
                    <p className="mt-1 text-sm text-slate-700">{survey.ghiChu || survey.note}</p>
                  </div>
                )}
              </section>

              <section ref={resultFormRef}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Kết quả khảo sát</h3>
                <div className="mt-3 rounded-lg border border-slate-200 p-4">
                  <SurveyResultForm survey={survey} onSubmit={(data) => onSaveResult(survey.id, data)} saving={saving} />
                </div>
              </section>
            </div>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Workflow Timeline</h3>
              <div className="mt-3 rounded-lg border border-slate-200 p-4">
                <WorkflowTimeline currentStep={survey.workflowStep || 1} />
              </div>
            </section>
          </div>
        </div>
      </aside>
    </>
  )
}

function CreateSurveyDrawer({ onClose, onCreated, property, batDongSanId }) {
  const navigate = useNavigate()
  const [selectedBdsId, setSelectedBdsId] = useState('')
  const [thoiGian, setThoiGian] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [propertyList, setPropertyList] = useState([])

  useEffect(() => {
    batDongSanService.danhSach()
      .then((res) => setPropertyList(res.data || []))
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    const bdsId = property ? Number(batDongSanId) : Number(selectedBdsId)
    if (!bdsId) {
      setError('Vui lòng chọn bất động sản')
      return
    }
    if (!thoiGian) {
      setError('Vui lòng chọn thời gian khảo sát')
      return
    }
    try {
      setSubmitting(true)
      setError('')
      await lichHenKhaoSatService.tao({
        batDongSanId: bdsId,
        thoiGian: new Date(thoiGian).toISOString(),
      })
      onCreated()
      navigate('/admin/lich-khao-sat')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Tạo lịch thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Đóng tạo lịch khảo sát"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/35"
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Tạo lịch khảo sát</h2>
            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {property ? (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Bất động sản đã chọn</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{property.diaChi || property.ten}</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Bất động sản</label>
              <select
                value={selectedBdsId}
                onChange={(e) => setSelectedBdsId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="">Chọn bất động sản</option>
                {propertyList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.diaChi} ({p.loaiNha || '—'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Thời gian khảo sát</label>
            <input
              type="datetime-local"
              value={thoiGian}
              onChange={(e) => setThoiGian(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nhân viên phụ trách</p>
            <p className="text-sm font-medium text-slate-800">Bạn (người tạo lịch)</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-5 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Đang tạo...' : 'Tạo lịch khảo sát'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </aside>
    </>
  )
}

export default function AdminLichKhaoSatPage() {
  const { batDongSanId } = useParams()
  const navigate = useNavigate()
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [reviewSurvey, setReviewSurvey] = useState(null)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createProperty, setCreateProperty] = useState(null)

  const fetchSurveys = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await lichHenKhaoSatService.danhSach()
      setSurveys(res.data || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys()
  }, [])

  const handleSaveResult = async (surveyId, data) => {
    setSaving(true)
    setSaveError(null)
    try {
      await lichHenKhaoSatService.ghiKetQua(surveyId, data)
      await fetchSurveys()
      setSelectedSurvey(null)
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || 'Lỗi lưu kết quả')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (surveyId, trangThai) => {
    try {
      await lichHenKhaoSatService.capNhatTrangThai(surveyId, trangThai)
      await fetchSurveys()
      setSelectedSurvey(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi cập nhật trạng thái')
    }
  }

  useEffect(() => {
    if (batDongSanId) {
      setShowCreate(true)
      batDongSanService.chiTiet(Number(batDongSanId))
        .then((res) => setCreateProperty(res.data))
        .catch(() => {})
    }
  }, [batDongSanId])

  const handleCreated = () => {
    setShowCreate(false)
    fetchSurveys()
  }

  const kpis = useMemo(() => [
    { label: 'Tổng lịch khảo sát', value: surveys.length, note: 'Toàn bộ lịch trong pipeline', accent: 'bg-slate-200' },
    { label: 'Chờ xác nhận', value: surveys.filter((s) => s.trangThai === 'CHO_XAC_NHAN').length, note: 'Cần gọi xác nhận', accent: 'bg-amber-100' },
    { label: 'Đã xác nhận', value: surveys.filter((s) => s.trangThai === 'DA_XAC_NHAN').length, note: 'Sẵn sàng khảo sát', accent: 'bg-blue-100' },
    { label: 'Hoàn thành', value: surveys.filter((s) => s.trangThai === 'DA_HOAN_THANH').length, note: 'Đã có kết quả khảo sát', accent: 'bg-emerald-100' },
    { label: 'Hủy', value: surveys.filter((s) => s.trangThai === 'DA_HUY').length, note: 'Cần xử lý lại lịch', accent: 'bg-rose-100' },
  ], [surveys])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  )
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <p className="text-lg font-semibold text-red-600">{error}</p>
        <button onClick={fetchSurveys} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Thử lại
        </button>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lịch khảo sát</h1>
            <p className="mt-1 text-sm text-slate-500">Quản lý lịch hẹn khảo sát bất động sản</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo lịch khảo sát
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-base font-bold text-slate-900">Danh sách lịch khảo sát</h2>
            <p className="text-sm text-slate-500">Theo dõi nhân viên, chủ nhà và trạng thái xử lý</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  {['Mã lịch', 'Bất động sản', 'Chủ nhà', 'Nhân viên khảo sát', 'Thời gian', 'Trạng thái', 'Đánh giá'].map((column) => (
                    <th key={column} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {surveys.map((survey) => (
                  <tr key={survey.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">#{String(survey.id).padStart(4, '0')}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedSurvey(survey)}
                        className="text-left text-sm font-bold text-slate-900 hover:text-blue-700"
                      >
                        {survey.diaChiBatDongSan}
                        <span className="mt-1 block text-xs font-medium text-slate-500">#{String(survey.batDongSanId).padStart(4, '0')}</span>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{survey.tenChuNha}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{survey.tenNhanVien}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {formatDate(survey.thoiGian)} · {formatTime(survey.thoiGian)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={survey.trangThai} />
                    </td>
                    <td className="px-4 py-4">
                      {survey.trangThai === 'DA_XAC_NHAN' && (
                        <button
                          type="button"
                          onClick={() => setReviewSurvey(survey)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          Đánh giá
                        </button>
                      )}
                      {survey.trangThai === 'DA_HOAN_THANH' && (
                        (() => {
                          const r = survey.ketQuaKhaoSat?.split('.')[0] || 'Đã đánh giá'
                          const isTot = r === 'Tốt'
                          return (
                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${isTot ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${isTot ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              {r}
                            </span>
                          )
                        })()
                      )}
                      {!(survey.trangThai === 'DA_XAC_NHAN' || survey.trangThai === 'DA_HOAN_THANH') && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {saveError && (
        <div className="mx-auto max-w-7xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {saveError}
        </div>
      )}
      <SurveyDrawer survey={selectedSurvey} onClose={() => setSelectedSurvey(null)} onSaveResult={handleSaveResult} saving={saving} onStatusChange={handleStatusChange} />
      {reviewSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReviewSurvey(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400">Đánh giá kết quả khảo sát</p>
                <h3 className="text-lg font-bold text-slate-900">{reviewSurvey.diaChiBatDongSan}</h3>
              </div>
              <button onClick={() => setReviewSurvey(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SurveyResultForm survey={reviewSurvey} onSubmit={(data) => { handleSaveResult(reviewSurvey.id, data); setReviewSurvey(null) }} saving={saving} />
          </div>
        </div>
      )}
      {showCreate && (
        <CreateSurveyDrawer
          onClose={() => { setShowCreate(false); setCreateProperty(null) }}
          onCreated={handleCreated}
          property={createProperty}
          batDongSanId={batDongSanId}
        />
      )}
    </main>
  )
}