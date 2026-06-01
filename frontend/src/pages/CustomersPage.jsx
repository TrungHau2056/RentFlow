import { useState, useMemo, useEffect, useCallback } from 'react'
import khachHangService from '../services/khachHangService'

const QUAN_HUYEN_OPTIONS = [
  { value: 'cau-giay', label: 'Cầu Giấy' },
  { value: 'tay-ho', label: 'Tây Hồ' },
  { value: 'ba-dinh', label: 'Ba Đình' },
  { value: 'hoan-kiem', label: 'Hoàn Kiếm' },
  { value: 'hai-ba-trung', label: 'Hai Bà Trưng' },
  { value: 'dong-da', label: 'Đống Đa' },
  { value: 'thanh-xuan', label: 'Thanh Xuân' },
  { value: 'ha-dong', label: 'Hà Đông' },
  { value: 'nam-tu-liem', label: 'Nam Từ Liêm' },
  { value: 'bac-tu-liem', label: 'Bắc Từ Liêm' },
]

const LOAI_NHA_OPTIONS = [
  { value: 'can-ho', label: 'Căn hộ' },
  { value: 'nha-rieng', label: 'Nhà riêng' },
  { value: 'biet-thu', label: 'Biệt thự' },
  { value: 'kios', label: 'Kios, mặt bằng' },
  { value: 'studio', label: 'Studio' },
]

const DO_UU_TIEN_OPTIONS = [
  { value: 'thap', label: 'Thấp' },
  { value: 'trung-binh', label: 'Trung bình' },
  { value: 'cao', label: 'Cao' },
  { value: 'rat-cao', label: 'Rất cao' },
]

const LEAD_STATUS = {
  lead_moi: {
    label: 'Lead mới',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  },
  dang_tu_van: {
    label: 'Đang tư vấn',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  dang_dam_phan: {
    label: 'Đang đàm phán',
    className: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  },
  da_ky_hop_dong: {
    label: 'Đã ký hợp đồng',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
}

const ACTIVITY_STYLE = {
  call: { label: 'Gọi điện', className: 'bg-blue-100 text-blue-700' },
  message: { label: 'Nhắn tin', className: 'bg-cyan-100 text-cyan-700' },
  viewing: { label: 'Xem nhà', className: 'bg-amber-100 text-amber-700' },
  negotiation: { label: 'Đàm phán', className: 'bg-violet-100 text-violet-700' },
  contract: { label: 'Ký hợp đồng', className: 'bg-emerald-100 text-emerald-700' },
  meeting: { label: 'Meeting', className: 'bg-slate-100 text-slate-700' },
  follow_up: { label: 'Follow-up', className: 'bg-rose-100 text-rose-700' },
}

const TABS = [
  { id: 'profile', label: 'Thông tin cá nhân' },
  { id: 'demand', label: 'Nhu cầu thuê' },
  { id: 'viewings', label: 'Lịch xem nhà' },
  { id: 'activity', label: 'Lịch sử làm việc' },
  { id: 'contracts', label: 'Hợp đồng thuê' },
]

function initials(name) {
  return name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function StatusBadge({ status }) {
  const config = LEAD_STATUS[status] || LEAD_STATUS.lead_moi
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}

function ActivityIcon({ type }) {
  const config = ACTIVITY_STYLE[type] || ACTIVITY_STYLE.follow_up

  return (
    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.className}`}>
      {type === 'call' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.5 1.2l-1.5.75a11 11 0 005.72 5.72l.75-1.5a1 1 0 011.2-.5l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V5z" />
        </svg>
      )}
      {type === 'message' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 12h8m-8-4h8m-8 8h5m-9 4l2.5-3H19a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h1" />
        </svg>
      )}
      {type === 'viewing' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M2.5 12C3.7 7.9 7.5 5 12 5s8.3 2.9 9.5 7c-1.2 4.1-5 7-9.5 7s-8.3-2.9-9.5-7z" />
        </svg>
      )}
      {type === 'negotiation' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 12h8M12 8v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
      {type === 'contract' && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6L19 8.4V19a2 2 0 01-2 2z" />
        </svg>
      )}
      {(type === 'meeting' || type === 'follow_up') && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
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

function QuickActionButton({ label, children }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      {children}
      {label}
    </button>
  )
}

function DrawerSection({ title, children }) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function ActivityTimeline({ activities, compact = false }) {
  return (
    <div className="space-y-0">
      {activities.map((activity, index) => (
        <div key={`${activity.time}-${activity.title}`} className="relative flex gap-3 pb-5">
          {index < activities.length - 1 && (
            <span className="absolute left-4 top-9 h-full w-px bg-slate-200" />
          )}
          <ActivityIcon type={activity.type} />
          <div className={compact ? 'min-w-0' : ''}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                {ACTIVITY_STYLE[activity.type]?.label || 'Hoạt động'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{activity.time} · {activity.by}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function EditDemandModal({ customer, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    loaiBatDongSan: customer.loaiBatDongSan || (customer.propertyType ? customer.propertyType.split(', ').filter(Boolean) : []),
    khuVuc: customer.khuVuc || (customer.area ? customer.area.split(', ').filter(Boolean) : []),
    nganSach: customer.nganSach || customer.budget || '',
    doUuTien: customer.doUuTien || customer.priority || 'trung-binh',
    moTa: customer.moTa || customer.demand || '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.nganSach) {
      setError('Vui lòng nhập ngân sách')
      return
    }
    await onSave(formData)
  }

  const toggleArrayValue = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ghi nhận nhu cầu tìm nhà</h2>
            <p className="text-xs text-slate-500 mt-0.5">Cập nhật nhu cầu của khách hàng {customer.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <span className="block text-xs font-semibold text-slate-600 mb-1.5">Loại bất động sản *</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LOAI_NHA_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleArrayValue('loaiBatDongSan', option.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    formData.loaiBatDongSan.includes(option.value)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-600 mb-1.5">Khu vực quan tâm *</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUAN_HUYEN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleArrayValue('khuVuc', option.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    formData.khuVuc.includes(option.value)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="block text-xs font-semibold text-slate-600 mb-1.5">Ngân sách (VNĐ/tháng) *</span>
              <input
                type="text"
                value={formData.nganSach}
                onChange={(e) => setFormData(prev => ({ ...prev, nganSach: e.target.value }))}
                placeholder="10.000.000 - 15.000.000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label>
              <span className="block text-xs font-semibold text-slate-600 mb-1.5">Độ ưu tiên *</span>
              <select
                value={formData.doUuTien}
                onChange={(e) => setFormData(prev => ({ ...prev, doUuTien: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {DO_UU_TIEN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1.5">Mô tả chi tiết</span>
            <textarea
              value={formData.moTa}
              onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
              placeholder="Mô tả thêm các yêu cầu khác về nội thất, tiện ích, hướng nhà..."
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </label>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu nhu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CustomerDrawer({ customer, activeTab, setActiveTab, onClose, onEditDemand }) {
  if (!customer) return null

  return (
    <>
      <button
        type="button"
        aria-label="Đóng chi tiết khách hàng"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/35"
      />

      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl sm:w-[620px]">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                {initials(customer.name)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{customer.id}</p>
                <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusBadge status={customer.status} />
                  <span className="text-xs text-slate-500">{customer.area} · {customer.broker}</span>
                </div>
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

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <QuickActionButton label="Phân công">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m8-4.13a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
            </QuickActionButton>
            <QuickActionButton label="Đặt lịch">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </QuickActionButton>
            <QuickActionButton label="Ghi chú">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </QuickActionButton>
            <QuickActionButton label="Chuyển lead">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </QuickActionButton>
          </div>
        </div>

        <div className="border-b border-slate-200 px-5">
          <div className="flex gap-2 overflow-x-auto py-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'profile' && (
            <DrawerSection title="Thông tin cá nhân">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ['Họ tên', customer.name],
                  ['SĐT', customer.phone],
                  ['Email', customer.email],
                  ['CCCD', customer.cccd],
                  ['Địa chỉ', customer.address],
                  ['Nguồn lead', customer.source],
                  ['Môi giới phụ trách', customer.broker],
                  ['Liên hệ gần nhất', customer.lastContact],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <dt className="text-xs font-medium text-slate-500">{label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </DrawerSection>
          )}

          {activeTab === 'demand' && (
            <DrawerSection title="Nhu cầu thuê">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700">Thông tin nhu cầu</h4>
                <button
                  type="button"
                  onClick={onEditDemand}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ['Loại nhà', customer.propertyType],
                  ['Khu vực', customer.area],
                  ['Ngân sách', customer.budget],
                  ['Độ ưu tiên', customer.priority],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-blue-50 p-4">
                <p className="text-xs font-medium text-blue-700">Mô tả nhu cầu</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{customer.demand}</p>
              </div>
            </DrawerSection>
          )}

          {activeTab === 'viewings' && (
            <DrawerSection title="Danh sách lịch hẹn">
              {customer.viewingSchedules.length > 0 ? (
                <div className="space-y-3">
                  {customer.viewingSchedules.map((schedule) => (
                    <div key={schedule.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{schedule.property}</p>
                          <p className="mt-1 text-xs text-slate-500">{schedule.id} · {schedule.time}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  Chưa có lịch xem nhà.
                </div>
              )}
            </DrawerSection>
          )}

          {activeTab === 'activity' && (
            <DrawerSection title="Call, meeting, follow-up">
              <ActivityTimeline activities={customer.activities} />
            </DrawerSection>
          )}

          {activeTab === 'contracts' && (
            <DrawerSection title="Danh sách hợp đồng thuê">
              {customer.contracts.length > 0 ? (
                <div className="space-y-3">
                  {customer.contracts.map((contract) => (
                    <div key={contract.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-900">{contract.id}</p>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {contract.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{contract.property}</p>
                      <p className="mt-1 text-xs text-slate-500">{contract.period} · {contract.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  Chưa có hợp đồng thuê.
                </div>
              )}
            </DrawerSection>
          )}
        </div>
      </aside>
    </>
  )
}

const mapCustomer = (c) => ({
  id: c.id || '',
  name: c.hoTen || '',
  phone: c.soDienThoai || '',
  email: c.email || '',
  demand: c.nhuCau || c.demand || '',
  propertyType: c.loaiBatDongSan || c.propertyType || '',
  area: c.khuVuc || c.area || '',
  budget: c.nganSach || c.budget || '',
  broker: c.moiGioiPhuTrach || c.broker || '',
  status: c.trangThai || c.status || 'lead_moi',
  source: c.nguonLead || c.source || '',
  cccd: c.cccd || '',
  address: c.diaChi || c.address || '',
  lastContact: c.lanLienHeCuoi || c.lastContact || '',
  priority: c.doUuTien || c.priority || '',
  viewingSchedules: c.lichXemNha || c.viewingSchedules || [],
  activities: c.lichSuHoatDong || c.activities || [],
  contracts: c.hopDongThue || c.contracts || [],
})

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [areaFilter, setAreaFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [brokerFilter, setBrokerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [editDemandOpen, setEditDemandOpen] = useState(false)
  const [editDemandLoading, setEditDemandLoading] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await khachHangService.danhSach()
      setCustomers((res?.data || []).map(mapCustomer))
    } catch (err) {
      console.error('Failed to fetch customers:', err)
      setError('Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const areas = useMemo(() => Array.from(new Set(customers.map((customer) => customer.area))), [customers])
  const budgets = useMemo(() => Array.from(new Set(customers.map((customer) => customer.budget))), [customers])
  const brokers = useMemo(() => Array.from(new Set(customers.map((customer) => customer.broker))), [customers])

  const filteredCustomers = useMemo(() => (
    customers.filter((customer) => {
      const matchesArea = areaFilter === 'all' || customer.area === areaFilter
      const matchesBudget = budgetFilter === 'all' || customer.budget === budgetFilter
      const matchesBroker = brokerFilter === 'all' || customer.broker === brokerFilter
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

      return matchesArea && matchesBudget && matchesBroker && matchesStatus
    })
  ), [areaFilter, brokerFilter, budgetFilter, statusFilter, customers])

  const kpis = useMemo(() => [
    { label: 'Tổng khách hàng', value: customers.length, note: 'Khách thuê trong CRM', accent: 'bg-slate-200' },
    { label: 'Lead mới', value: customers.filter((customer) => customer.status === 'lead_moi').length, note: 'Cần gọi tư vấn', accent: 'bg-blue-100' },
    { label: 'Đang tư vấn', value: customers.filter((customer) => customer.status === 'dang_tu_van').length, note: 'Đang chăm sóc nhu cầu', accent: 'bg-amber-100' },
    { label: 'Đã ký hợp đồng', value: customers.filter((customer) => customer.status === 'da_ky_hop_dong').length, note: 'Chuyển thành khách thuê', accent: 'bg-emerald-100' },
  ], [customers])

  const recentActivities = useMemo(
    () => customers.flatMap((customer) => (
      customer.activities.slice(0, 1).map((activity) => ({
        ...activity,
        title: `${customer.name}: ${activity.title}`,
      }))
    )).slice(0, 5),
    [customers],
  )

  function openDrawer(customer, tab = 'profile') {
    setSelectedCustomer(customer)
    setActiveTab(tab)
  }

  const handleSaveDemand = async (formData) => {
    setEditDemandLoading(true)
    try {
      const rawId = selectedCustomer.id
      await khachHangService.capNhatNhuCau(rawId, formData)
      await fetchCustomers()
      const updated = await khachHangService.chiTiet(rawId)
      setSelectedCustomer(mapCustomer(updated?.data || updated))
      setEditDemandOpen(false)
    } catch (err) {
      console.error('Failed to update demand:', err)
    } finally {
      setEditDemandLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý khách hàng</h1>
            <p className="mt-1 text-sm text-slate-500">
              {loading && (
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  Đang tải...
                </span>
              )}
              {!loading && (error || 'Theo dõi khách thuê và cơ hội kinh doanh')}
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm khách hàng
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khu vực quan tâm</span>
              <select
                value={areaFilter}
                onChange={(event) => setAreaFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả khu vực</option>
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khoảng giá</span>
              <select
                value={budgetFilter}
                onChange={(event) => setBudgetFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả ngân sách</option>
                {budgets.map((budget) => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Môi giới phụ trách</span>
              <select
                value={brokerFilter}
                onChange={(event) => setBrokerFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả môi giới</option>
                {brokers.map((broker) => (
                  <option key={broker} value={broker}>{broker}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái lead</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả trạng thái</option>
                {Object.entries(LEAD_STATUS).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">CRM Table</h2>
                <p className="text-sm text-slate-500">Hiển thị {filteredCustomers.length} khách thuê phù hợp</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <QuickActionButton label="Phân công môi giới">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m8-4.13a4 4 0 10-8 0 4 4 0 008 0z" />
                  </svg>
                </QuickActionButton>
                <QuickActionButton label="Đặt lịch xem">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </QuickActionButton>
                <QuickActionButton label="Tạo ghi chú">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </QuickActionButton>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1040px] w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {['Họ tên', 'SĐT', 'Email', 'Nhu cầu thuê', 'Khu vực', 'Ngân sách', 'Môi giới', 'Trạng thái'].map((column) => (
                      <th key={column} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="transition hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openDrawer(customer)}
                          className="flex items-center gap-3 text-left"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                            {initials(customer.name)}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-slate-900">{customer.name}</span>
                            <span className="block text-xs text-slate-500">{customer.id} · {customer.source}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{customer.phone}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{customer.email}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{customer.demand}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{customer.area}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{customer.budget}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{customer.broker}</td>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => openDrawer(customer, 'activity')}>
                          <StatusBadge status={customer.status} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">CRM Activity Timeline</h2>
                <p className="text-sm text-slate-500">Gọi điện, nhắn tin, xem nhà, đàm phán, ký hợp đồng</p>
              </div>
            </div>
            <div className="mt-4">
              <ActivityTimeline activities={recentActivities} compact />
            </div>
          </aside>
        </section>
      </div>

      <CustomerDrawer
        customer={selectedCustomer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={() => setSelectedCustomer(null)}
        onEditDemand={() => setEditDemandOpen(true)}
      />

      {editDemandOpen && selectedCustomer && (
        <EditDemandModal
          customer={selectedCustomer}
          onClose={() => setEditDemandOpen(false)}
          onSave={handleSaveDemand}
          loading={editDemandLoading}
        />
      )}
    </main>
  )
}
