import { useState, useMemo, useEffect, useCallback } from 'react'
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

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatDateTimeLocal(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
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

function CreateSurveyModal({ batDongSanId, property, onClose, onCreated }) {
  const navigate = useNavigate()
  const [thoiGian, setThoiGian] = useState('')
  const [selectedBdsId, setSelectedBdsId] = useState(batDongSanId || '')
  const [propertyList, setPropertyList] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!batDongSanId) {
      batDongSanService.danhSach().then((res) => setPropertyList(res.data || [])).catch(() => {})
    }
  }, [batDongSanId])

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
      <button type="button" aria-label="Đóng" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/35" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Tạo lịch khảo sát</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {property ? (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Bất động sản</p>
              <p className="text-sm font-bold text-slate-900">{property.diaChi}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-blue-600">
                <span>{property.loaiNha}</span>
                <span>·</span>
                <span>{property.dienTich ? `${property.dienTich}m²` : ''}</span>
              </div>
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
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [createProperty, setCreateProperty] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const fetchSurveys = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchSurveys()
  }, [fetchSurveys])

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
                  {['Mã lịch', 'Bất động sản', 'Chủ nhà', 'Nhân viên khảo sát', 'Thời gian', 'Trạng thái'].map((column) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showCreate && (
        <CreateSurveyModal
          batDongSanId={batDongSanId}
          property={createProperty}
          onClose={() => { setShowCreate(false); navigate('/admin/lich-khao-sat') }}
          onCreated={handleCreated}
        />
      )}
    </main>
  )
}
