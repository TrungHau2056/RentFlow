import { useState } from 'react'

const SYSTEM_INFO = [
  { label: 'Tên hệ thống', value: 'RentFlow' },
  { label: 'Phiên bản', value: '1.0.0' },
  { label: 'Môi trường', value: 'Production' },
  { label: 'Cơ sở dữ liệu', value: 'PostgreSQL 15' },
  { label: 'Lần bảo trì gần nhất', value: '—' },
]

function Toggle({ label, description, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${on ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

export default function CaiDatPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 800)
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h1>
        <p className="mt-1 text-sm text-slate-500">Cấu hình và quản lý nền tảng RentFlow</p>
      </header>

      {/* Thông tin hệ thống */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Thông tin hệ thống</h2>
          <p className="text-sm text-slate-500">Thông tin cơ bản về phiên bản và môi trường</p>
        </div>
        <dl className="divide-y divide-slate-100 px-5">
          {SYSTEM_INFO.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <dt className="text-sm font-medium text-slate-500">{label}</dt>
              <dd className="text-sm font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Cấu hình chung */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Cấu hình chung</h2>
          <p className="text-sm text-slate-500">Quản lý tính năng và thông báo hệ thống</p>
        </div>
        <div className="divide-y divide-slate-100 px-5">
          <Toggle label="Email thông báo" description="Gửi email khi có sự kiện mới (hợp đồng, lịch hẹn, thanh toán)" defaultChecked />
          <Toggle label="Tự động duyệt hợp đồng" description="Phê duyệt tự động hợp đồng ký gửi khi đủ điều kiện" />
          <Toggle label="Chế độ bảo trì" description="Tạm khóa hệ thống để nâng cấp, người dùng sẽ thấy trang bảo trì" />
          <Toggle label="Xác thực 2 yếu tố bắt buộc" description="Yêu cầu tất cả nhân viên bật xác thực 2 yếu tố" />
        </div>
      </section>

      {/* Quản lý dữ liệu */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Quản lý dữ liệu</h2>
          <p className="text-sm text-slate-500">Sao lưu, xuất và dọn dẹp dữ liệu hệ thống</p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <svg className="mx-auto mb-2 h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Sao lưu dữ liệu
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg className="mx-auto mb-2 h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất báo cáo
          </button>
          <button
            type="button"
            className="rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            <svg className="mx-auto mb-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa cache
          </button>
        </div>
      </section>

      {/* Lưu */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </main>
  )
}
