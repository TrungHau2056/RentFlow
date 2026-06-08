import { useState } from 'react'

function readStoredUser() {
  const stored = localStorage.getItem('userInfo')
  if (!stored) return null
  try { return JSON.parse(stored) } catch { return null }
}

export default function HoSoCaNhanPage() {
  const userInfo = readStoredUser()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    hoTen: userInfo?.hoTen || '',
    email: userInfo?.email || '',
    soDienThoai: '',
    diaChi: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setEditing(false)
    }, 800)
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-on-surface">Hồ sơ cá nhân</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Quản lý thông tin tài khoản và bảo mật</p>
      </header>

      {/* Thông tin cá nhân */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="border-b border-outline-variant px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-on-surface">Thông tin cá nhân</h2>
              <p className="text-sm text-on-surface-variant">Cập nhật thông tin liên hệ và địa chỉ</p>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-primary-container transition hover:bg-slate-50"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-on-surface">Họ và tên</span>
                  <input
                    type="text"
                    value={form.hoTen}
                    onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
                    disabled={!editing}
                    className="mt-1.5 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-on-surface">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="mt-1.5 w-full rounded-lg border border-outline-variant bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-on-surface">Số điện thoại</span>
                  <input
                    type="tel"
                    value={form.soDienThoai}
                    onChange={(e) => setForm({ ...form, soDienThoai: e.target.value })}
                    disabled={!editing}
                    placeholder="0912 345 678"
                    className="mt-1.5 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-on-surface">Địa chỉ</span>
                  <input
                    type="text"
                    value={form.diaChi}
                    onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                    disabled={!editing}
                    placeholder="Số nhà, đường, quận, Hà Nội"
                    className="mt-1.5 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
              </div>
              {editing && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary disabled:opacity-50"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-lg border border-outline-variant bg-white px-5 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Đổi mật khẩu */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="border-b border-outline-variant px-5 py-4">
          <h2 className="text-base font-bold text-on-surface">Đổi mật khẩu</h2>
          <p className="text-sm text-on-surface-variant">Cập nhật mật khẩu để bảo vệ tài khoản</p>
        </div>
        <div className="p-5">
          <div className="max-w-md space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-on-surface">Mật khẩu hiện tại</span>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại"
                className="mt-1.5 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-on-surface">Mật khẩu mới</span>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                placeholder="Ít nhất 6 ký tự"
                className="mt-1.5 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-on-surface">Xác nhận mật khẩu mới</span>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
                className="mt-1.5 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition placeholder:text-slate-400 focus:border-primary-container focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <button
              type="button"
              className="rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary"
            >
              Cập nhật mật khẩu
            </button>
          </div>
        </div>
      </section>

      {/* Bảo mật */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="border-b border-outline-variant px-5 py-4">
          <h2 className="text-base font-bold text-on-surface">Bảo mật tài khoản</h2>
          <p className="text-sm text-on-surface-variant">Quản lý xác thực và phiên đăng nhập</p>
        </div>
        <div className="divide-y divide-slate-100 px-5">
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-semibold text-on-surface">Xác thực hai yếu tố</p>
              <p className="mt-0.5 text-xs text-on-surface-variant">Bảo vệ tài khoản bằng ứng dụng xác thực</p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-primary-container transition hover:bg-slate-50"
            >
              Thiết lập
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-semibold text-on-surface">Phiên đăng nhập</p>
              <p className="mt-0.5 text-xs text-on-surface-variant">Quản lý các thiết bị đang đăng nhập</p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Đăng xuất tất cả
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
