import { useMemo, useState } from 'react'

const STATUS_CONFIG = {
  cho_xac_nhan: {
    label: 'Chờ xác nhận',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
  },
  da_xac_nhan: {
    label: 'Đã xác nhận',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot: 'bg-blue-500',
  },
  hoan_thanh: {
    label: 'Hoàn thành',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  da_huy: {
    label: 'Hủy',
    className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    dot: 'bg-rose-500',
  },
}

const WORKFLOW_STEPS = [
  'Đăng ký ký gửi',
  'Tạo lịch khảo sát',
  'Đã khảo sát',
  'Chờ hợp đồng',
  'Hoàn tất',
]

const SURVEYS = [
  {
    id: 'KS-2026-001',
    property: 'Biệt thự Vinhomes Riverside',
    owner: 'Nguyễn Văn Minh',
    phone: '0901 234 567',
    inspector: 'Trần Văn Hùng',
    time: '09:00',
    date: '2026-05-29',
    address: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    status: 'da_xac_nhan',
    note: 'Chủ nhà có mặt, cần kiểm tra hồ bơi và hệ thống điện nước.',
    workflowStep: 2,
    result: null,
  },
  {
    id: 'KS-2026-002',
    property: 'Căn hộ Midtown Sài Đồng',
    owner: 'Trần Thị Hoa',
    phone: '0987 654 321',
    inspector: 'Lê Quốc Anh',
    time: '14:30',
    date: '2026-05-29',
    address: '29 Liễu Giai, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    status: 'cho_xac_nhan',
    note: 'Cần xác nhận lại thang máy và chỗ để xe với ban quản lý.',
    workflowStep: 2,
    result: null,
  },
  {
    id: 'KS-2026-003',
    property: 'Nhà phố cổ Hàng Bài',
    owner: 'Lê Quốc Bảo',
    phone: '0912 345 678',
    inspector: 'Nguyễn Thị Lan',
    time: '10:15',
    date: '2026-05-30',
    address: '56 Hàng Bài, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    status: 'hoan_thanh',
    note: 'Nhà mặt tiền kinh doanh, ưu tiên kiểm tra kết cấu và giấy phép.',
    workflowStep: 3,
    result: {
      rating: 'Cần chỉnh sửa',
      condition: 'Kết cấu tốt, tường tầng 2 có dấu ẩm nhẹ, mặt tiền phù hợp kinh doanh.',
      furniture: 'Nội thất cơ bản, cần bổ sung điều hòa và rèm cửa.',
      images: ['Mặt tiền', 'Phòng khách', 'Tầng 2'],
      attachments: ['bien-ban-khao-sat.pdf'],
      note: 'Đề xuất sửa chống thấm trước khi tạo hợp đồng ký gửi.',
    },
  },
  {
    id: 'KS-2026-004',
    property: 'Biệt thự sân vườn Tây Hồ',
    owner: 'Phạm Minh Tuấn',
    phone: '0903 456 789',
    inspector: 'Phạm Minh Tuấn',
    time: '15:00',
    date: '2026-06-02',
    address: 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    status: 'hoan_thanh',
    note: 'Khảo sát toàn bộ sân vườn, hồ bơi, garage và phòng kỹ thuật.',
    workflowStep: 4,
    result: {
      rating: 'Tốt',
      condition: 'Hiện trạng rất tốt, sân vườn được chăm sóc, hệ thống nước ổn định.',
      furniture: 'Nội thất cao cấp, đủ thiết bị gia dụng và phòng ngủ.',
      images: ['Sân vườn', 'Phòng khách', 'Hồ bơi'],
      attachments: ['hinh-anh-khao-sat.zip', 'bien-ban.pdf'],
      note: 'Đủ điều kiện chuyển sang tạo hợp đồng ký gửi.',
    },
  },
  {
    id: 'KS-2026-005',
    property: 'Nhà mặt phố Đống Đa',
    owner: 'Đỗ Văn Kiên',
    phone: '0978 111 222',
    inspector: 'Lê Quốc Anh',
    time: '08:30',
    date: '2026-06-04',
    address: '88 Láng Hạ, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    status: 'da_huy',
    note: 'Chủ nhà chưa chuẩn bị đủ giấy tờ sở hữu.',
    workflowStep: 2,
    result: null,
  },
]

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const MONTH_DAYS = Array.from({ length: 35 }, (_, index) => index + 1)

function formatDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.cho_xac_nhan

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

function ActionButton({ label, variant = 'secondary', children }) {
  const className = variant === 'primary'
    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
    : variant === 'danger'
      ? 'border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${className}`}
    >
      {children}
      {label}
    </button>
  )
}

function CalendarEvent({ survey, onOpen }) {
  const config = STATUS_CONFIG[survey.status]

  return (
    <button
      type="button"
      onClick={() => onOpen(survey)}
      className={`w-full truncate rounded-md px-2 py-1 text-left text-xs font-semibold ${config.className}`}
    >
      {survey.time} · {survey.property}
    </button>
  )
}

function CalendarView({ mode, surveys, onOpen }) {
  const surveysByDate = useMemo(() => (
    surveys.reduce((acc, survey) => {
      acc[survey.date] = acc[survey.date] || []
      acc[survey.date].push(survey)
      return acc
    }, {})
  ), [surveys])

  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const daySurveys = surveysByDate[todayStr] || []
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - today.getDay() + 1 + i)
    return d.toISOString().slice(0, 10)
  })

  if (mode === 'day') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-bold text-slate-900">Day View · {today.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h2>
          <p className="text-sm text-slate-500">Lịch khảo sát trong ngày</p>
        </div>
        <div className="divide-y divide-slate-100">
          {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((slot) => {
            const slotSurveys = daySurveys.filter((survey) => survey.time.startsWith(slot.slice(0, 2)))

            return (
              <div key={slot} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 px-4 py-3">
                <span className="text-xs font-semibold text-slate-400">{slot}</span>
                <div className="space-y-2">
                  {slotSurveys.length > 0 ? (
                    slotSurveys.map((survey) => <CalendarEvent key={survey.id} survey={survey} onOpen={onOpen} />)
                  ) : (
                    <div className="h-7 rounded-md border border-dashed border-slate-200" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (mode === 'week') {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-bold text-slate-900">Week View · {new Date(weekDates[0]).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {new Date(weekDates[6]).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</h2>
          <p className="text-sm text-slate-500">Điều phối nhân viên khảo sát trong tuần</p>
        </div>
        <div className="grid min-w-[840px] grid-cols-7 divide-x divide-slate-100 overflow-x-auto">
          {weekDates.map((date, index) => (
            <div key={date} className="min-h-[320px] p-3">
              <div className="mb-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{WEEK_DAYS[index]}</p>
                <p className="text-sm font-semibold text-slate-900">{formatDate(date).slice(0, 5)}</p>
              </div>
              <div className="space-y-2">
                {(surveysByDate[date] || []).map((survey) => (
                  <CalendarEvent key={survey.id} survey={survey} onOpen={onOpen} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Month View · Tháng 6/2026</h2>
          <p className="text-sm text-slate-500">Tổng quan lịch khảo sát theo tháng</p>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="px-3 py-2 text-center text-xs font-bold text-slate-500">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {MONTH_DAYS.map((day) => {
          const date = `2026-06-${String(day).padStart(2, '0')}`
          const daySurveysInMonth = surveysByDate[date] || []

          return (
            <div key={day} className="min-h-28 border-b border-r border-slate-100 p-2">
              <p className="mb-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-slate-600">
                {day}
              </p>
              <div className="space-y-1">
                {daySurveysInMonth.slice(0, 2).map((survey) => (
                  <CalendarEvent key={survey.id} survey={survey} onOpen={onOpen} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
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

function SurveyResultForm({ survey }) {
  const [rating, setRating] = useState(survey.result?.rating || 'Tốt')

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">Đánh giá</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {['Tốt', 'Cần chỉnh sửa', 'Không đạt'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRating(option)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                rating === option
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
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
          defaultValue={survey.result?.condition || ''}
          rows={3}
          placeholder="Mô tả kết cấu, tường, sàn, điện nước, vệ sinh..."
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-900">Nội thất</span>
        <textarea
          defaultValue={survey.result?.furniture || ''}
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
          defaultValue={survey.result?.note || ''}
          rows={3}
          placeholder="Ghi chú nội bộ, đề xuất xử lý, điều kiện chuyển hợp đồng..."
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <ActionButton label="Lưu kết quả" variant="primary" />
        <ActionButton label="Chuyển sang tạo hợp đồng ký gửi" />
      </div>
    </div>
  )
}

function SurveyDrawer({ survey, onClose }) {
  if (!survey) return null

  return (
    <>
      <button
        type="button"
        aria-label="Đóng chi tiết lịch khảo sát"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/35"
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col bg-white shadow-2xl sm:w-[720px]">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{survey.id}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{survey.property}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={survey.status} />
                <span className="text-xs text-slate-500">{formatDate(survey.date)} · {survey.time}</span>
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
            <ActionButton label="Xác nhận lịch" variant="primary" />
            <ActionButton label="Dời lịch" />
            <ActionButton label="Hủy lịch" variant="danger" />
            <ActionButton label="Cập nhật kết quả" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_240px]">
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thông tin lịch khảo sát</h3>
                <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ['Chủ nhà', survey.owner],
                    ['Bất động sản', survey.property],
                    ['Địa chỉ', survey.address],
                    ['Người phụ trách', survey.inspector],
                    ['SĐT chủ nhà', survey.phone],
                    ['Khu vực', survey.district],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs font-medium text-slate-500">{label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-700">Ghi chú</p>
                  <p className="mt-1 text-sm text-slate-700">{survey.note}</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Survey Result Form</h3>
                <div className="mt-3 rounded-lg border border-slate-200 p-4">
                  <SurveyResultForm survey={survey} />
                </div>
              </section>
            </div>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Workflow Timeline</h3>
              <div className="mt-3 rounded-lg border border-slate-200 p-4">
                <WorkflowTimeline currentStep={survey.workflowStep} />
              </div>
            </section>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function AdminLichKhaoSatPage() {
  const [calendarMode, setCalendarMode] = useState('week')
  const [selectedSurvey, setSelectedSurvey] = useState(SURVEYS[0])

  const kpis = useMemo(() => [
    { label: 'Tổng lịch khảo sát', value: SURVEYS.length, note: 'Toàn bộ lịch trong pipeline', accent: 'bg-slate-200' },
    { label: 'Chờ xác nhận', value: SURVEYS.filter((survey) => survey.status === 'cho_xac_nhan').length, note: 'Cần gọi xác nhận', accent: 'bg-amber-100' },
    { label: 'Đã xác nhận', value: SURVEYS.filter((survey) => survey.status === 'da_xac_nhan').length, note: 'Sẵn sàng khảo sát', accent: 'bg-blue-100' },
    { label: 'Hoàn thành', value: SURVEYS.filter((survey) => survey.status === 'hoan_thanh').length, note: 'Đã có kết quả khảo sát', accent: 'bg-emerald-100' },
    { label: 'Hủy', value: SURVEYS.filter((survey) => survey.status === 'da_huy').length, note: 'Cần xử lý lại lịch', accent: 'bg-rose-100' },
  ], [])

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lịch khảo sát</h1>
            <p className="mt-1 text-sm text-slate-500">Quản lý lịch hẹn khảo sát bất động sản</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
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

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Calendar View</h2>
              <p className="text-sm text-slate-500">Lịch hiện đại theo ngày, tuần, tháng giống Google Calendar</p>
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {[
                ['day', 'Day View'],
                ['week', 'Week View'],
                ['month', 'Month View'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCalendarMode(value)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    calendarMode === value ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <CalendarView mode={calendarMode} surveys={SURVEYS} onOpen={setSelectedSurvey} />

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-base font-bold text-slate-900">Danh sách lịch khảo sát</h2>
            <p className="text-sm text-slate-500">Theo dõi nhân viên, chủ nhà và trạng thái xử lý</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  {['Mã lịch', 'Bất động sản', 'Chủ nhà', 'Nhân viên khảo sát', 'Ngày giờ', 'Trạng thái'].map((column) => (
                    <th key={column} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {SURVEYS.map((survey) => (
                  <tr key={survey.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">{survey.id}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedSurvey(survey)}
                        className="text-left text-sm font-bold text-slate-900 hover:text-blue-700"
                      >
                        {survey.property}
                        <span className="mt-1 block text-xs font-medium text-slate-500">{survey.address}</span>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{survey.owner}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{survey.inspector}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">{formatDate(survey.date)} · {survey.time}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={survey.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <SurveyDrawer survey={selectedSurvey} onClose={() => setSelectedSurvey(null)} />
    </main>
  )
}
