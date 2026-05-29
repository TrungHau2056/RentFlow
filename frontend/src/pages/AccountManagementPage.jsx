import { useState, useMemo, useEffect, useCallback } from 'react'
import quanTriService from '../services/quanTriService'

const ROLE_OPTIONS = ['Tất cả role', 'Admin', 'Môi giới', 'Nhân viên đại lý', 'Pháp luật']

const PERMISSIONS = {
  Admin: [
    { module: 'Quản lý tài khoản', values: [true, true, true, true, true] },
    { module: 'Bất động sản', values: [true, true, true, true, true] },
    { module: 'Hợp đồng & pháp luật', values: [true, true, true, true, true] },
    { module: 'Tài chính & báo cáo', values: [true, true, true, true, true] },
  ],
  'Môi giới': [
    { module: 'Khách hàng', values: [true, true, true, false, false] },
    { module: 'Bất động sản', values: [true, true, true, false, false] },
    { module: 'Lịch xem nhà', values: [true, true, true, false, false] },
    { module: 'Hợp đồng thuê', values: [true, true, false, false, false] },
  ],
  'Nhân viên đại lý': [
    { module: 'Chủ nhà', values: [true, true, true, false, false] },
    { module: 'Hợp đồng ký gửi', values: [true, true, true, false, false] },
    { module: 'Lịch khảo sát', values: [true, true, true, false, true] },
    { module: 'Báo cáo', values: [true, false, false, false, false] },
  ],
  'Pháp luật': [
    { module: 'Hợp đồng ký gửi', values: [true, false, true, false, true] },
    { module: 'Hợp đồng thuê', values: [true, false, true, false, true] },
    { module: 'Hồ sơ pháp lý', values: [true, true, true, false, true] },
    { module: 'Báo cáo tuân thủ', values: [true, false, false, false, true] },
  ],
}

const AUDIT_LOGS = [
  { person: 'Nguyễn Minh Quân', action: 'thay đổi quyền Duyệt hợp đồng', target: 'Role Môi giới', time: 'Hôm nay, 09:40', tone: 'blue' },
  { person: 'Hệ thống bảo mật', action: 'khóa tài khoản sau 5 lần đăng nhập sai', target: 'Vũ Thanh Tùng', time: 'Hôm qua, 21:31', tone: 'orange' },
  { person: 'Phạm Bảo Ngọc', action: 'xác nhận quyền truy cập', target: 'Module Pháp luật', time: '25/05/2026, 14:15', tone: 'green' },
]

const PERMISSION_LABELS = ['Xem', 'Tạo', 'Sửa', 'Xóa', 'Duyệt']

function initials(name) {
  return name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .toUpperCase()
    .join('')
}

const statusMap = (status) => {
  const map = { ACTIVE: 'Đang hoạt động', LOCKED: 'Bị khóa', PENDING: 'Chờ kích hoạt' }
  return map[status] || status
}

const roleMap = (role) => {
  const map = { QUAN_TRI_VIEN: 'Admin', NHAN_VIEN_DAI_LY: 'Nhân viên đại lý', MOI_GIOI: 'Môi giới', PHAP_LUAT: 'Pháp luật' }
  return map[role] || role
}

const mapUser = (u) => ({
  id: u.id,
  name: u.hoTen || '',
  initials: initials(u.hoTen || ''),
  email: u.email || '',
  phone: u.soDienThoai || '',
  role: roleMap(u.tenVaiTro),
  status: statusMap(u.trangThai),
  created: u.ngayTao || '',
  lastLogin: u.lanDangNhapCuoi || '',
  twoFactor: u.haiYeuTo || false,
  attempts: u.soLanThuSai || 0,
  device: u.thietBi || '',
  modules: u.modules || [],
  history: u.lichSu || [],
})

function Icon({ name, className = 'h-5 w-5' }) {
  const paths = {
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8zm7-1a3 3 0 010 6m-14-6a3 3 0 000 6" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M5 13l4 4L19 7" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 11V8a5 5 0 0110 0v3m-11 0h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-3-10l2 2 4-5" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 7h16a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2zm5 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-13 5h20" />,
    document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 3h7l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5M9 13h6m-6 4h6" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 21l-5-5m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />,
    key: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 7a5 5 0 11-3.6 8.47L4 22l-2-2 2-2-1-1 3-3 .53.6A5 5 0 0115 7z" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 9v4m0 4h.01M10.6 3.7L1.8 19a2 2 0 001.74 3h16.92a2 2 0 001.74-3L13.4 3.7a1.62 1.62 0 00-2.8 0z" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    chevron: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />,
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  )
}

function RoleBadge({ role }) {
  const tones = {
    Admin: 'bg-blue-50 text-blue-700 ring-blue-600/10',
    'Môi giới': 'bg-violet-50 text-violet-700 ring-violet-600/10',
    'Nhân viên đại lý': 'bg-amber-50 text-amber-700 ring-amber-600/10',
    'Pháp luật': 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[role]}`}>{role}</span>
}

function StatusBadge({ status }) {
  const tones = {
    'Đang hoạt động': 'bg-emerald-50 text-emerald-700',
    'Bị khóa': 'bg-orange-50 text-orange-700',
    'Chờ kích hoạt': 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Đang hoạt động' ? 'bg-emerald-500' : status === 'Bị khóa' ? 'bg-orange-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  )
}

function SummaryCard({ card }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    violet: 'bg-violet-50 text-violet-600',
  }
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[card.tone]}`}>
          <Icon name={card.icon} />
        </span>
      </div>
      <p className={`mt-3 text-xs font-medium ${card.tone === 'orange' ? 'text-orange-600' : 'text-slate-400'}`}>{card.detail}</p>
    </div>
  )
}

function PermissionMark({ allowed }) {
  return allowed ? (
    <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <Icon name="check" className="h-4 w-4" />
    </span>
  ) : (
    <span className="mx-auto block h-px w-4 bg-slate-300" />
  )
}

function UserDetail({ user, onAction, inModal = false }) {
  if (!user) return null
  return (
    <div className={`${inModal ? '' : 'rounded-2xl border border-slate-200 bg-white'} overflow-hidden`}>
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">{user.initials}</span>
            <div>
              <h3 className="font-semibold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <StatusBadge status={user.status} />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
          <span className="text-xs text-slate-500">Vai trò hiện tại</span>
          <RoleBadge role={user.role} />
        </div>
      </div>

      <div className="space-y-5 p-5">
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quyền truy cập module</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.modules.map((module) => (
              <span key={module} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700">{module}</span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="shield" className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-slate-800">Bảo mật tài khoản</h4>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Xác thực 2FA</span><span className={user.twoFactor ? 'font-semibold text-emerald-600' : 'font-semibold text-orange-600'}>{user.twoFactor ? 'Đã bật' : 'Chưa bật'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Lần thử đăng nhập lỗi</span><span className="font-semibold text-slate-700">{user.attempts} lần</span></div>
            <div className="pt-1 text-slate-500">Thiết bị gần nhất</div>
            <p className="font-medium text-slate-700">{user.device}</p>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hoạt động gần đây</h4>
          <div className="mt-3 space-y-3">
            {user.history.map((entry) => (
              <div key={entry} className="flex gap-2.5 text-xs text-slate-600">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                {entry}
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button type="button" onClick={() => onAction('Gửi yêu cầu đặt lại mật khẩu')} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">Reset mật khẩu</button>
          <button type="button" onClick={() => onAction('Mở chỉnh sửa vai trò')} className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">Đổi role</button>
          <button type="button" onClick={() => onAction('Mở trình chỉnh sửa quyền')} className="rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700">Chỉnh sửa quyền</button>
          <button type="button" onClick={() => onAction('Xác nhận khóa tài khoản')} className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-100">Khóa tài khoản</button>
        </div>
        <button type="button" onClick={() => onAction('Xác nhận xóa tài khoản')} className="w-full rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">Xóa tài khoản</button>
      </div>
    </div>
  )
}

function CreateAccountModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({ hoTen: '', email: '', tenVaiTro: 'Nhân viên đại lý', haiYeuTo: true })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tạo tài khoản nội bộ</h2>
            <p className="mt-1 text-sm text-slate-500">Gán vai trò và gửi lời mời kích hoạt bảo mật.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-slate-600">Họ và tên</span>
            <input value={formData.hoTen} onChange={(e) => setFormData((prev) => ({ ...prev, hoTen: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" placeholder="Nhập tên nhân viên" />
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-slate-600">Email công việc</span>
            <input value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" placeholder="email@rentflow.vn" />
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-slate-600">Role</span>
            <select value={formData.tenVaiTro} onChange={(e) => setFormData((prev) => ({ ...prev, tenVaiTro: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100">
              {ROLE_OPTIONS.slice(1).map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2.5 text-sm text-slate-600">
          <input checked={formData.haiYeuTo} onChange={(e) => setFormData((prev) => ({ ...prev, haiYeuTo: e.target.checked }))} type="checkbox" className="h-4 w-4 accent-blue-600" />
          Yêu cầu bật xác thực hai lớp khi đăng nhập lần đầu
        </label>
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Hủy</button>
          <button type="button" onClick={() => onCreate(formData)} className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">Tạo & gửi lời mời</button>
        </div>
      </div>
    </div>
  )
}

export default function AccountManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tất cả role')
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [selectedId, setSelectedId] = useState(null)
  const [permissionRole, setPermissionRole] = useState('Admin')
  const [mobileDetail, setMobileDetail] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await quanTriService.danhSachTaiKhoan()
      const mapped = (res?.data || []).map(mapUser)
      setUsers(mapped)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (selectedId === null && users.length > 0) {
      setSelectedId(users[0].id)
    }
  }, [users, selectedId])

  const KPI_CARDS = useMemo(() => [
    { label: 'Tổng tài khoản', value: String(users.length), detail: '+12 tháng này', tone: 'blue', icon: 'users' },
    { label: 'Đang hoạt động', value: String(users.filter((u) => u.status === 'Đang hoạt động').length), detail: users.length ? `${Math.round(users.filter((u) => u.status === 'Đang hoạt động').length / users.length * 100)}% tổng số` : '0% tổng số', tone: 'green', icon: 'check' },
    { label: 'Tài khoản bị khóa', value: String(users.filter((u) => u.status === 'Bị khóa').length), detail: 'Cần xem xét', tone: 'orange', icon: 'lock' },
    { label: 'Role Admin', value: String(users.filter((u) => u.role === 'Admin').length), detail: 'Quyền cao nhất', tone: 'violet', icon: 'shield' },
    { label: 'Role Môi giới', value: String(users.filter((u) => u.role === 'Môi giới').length), detail: `${users.filter((u) => u.role === 'Môi giới' && u.status === 'Đang hoạt động').length} đang hoạt động`, tone: 'blue', icon: 'briefcase' },
    { label: 'Role Pháp luật', value: String(users.filter((u) => u.role === 'Pháp luật').length), detail: '2 yêu cầu mới', tone: 'green', icon: 'document' },
  ], [users])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesQuery = !query || `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(query)
      const matchesRole = roleFilter === 'Tất cả role' || user.role === roleFilter
      const matchesStatus = statusFilter === 'Tất cả trạng thái' || user.status === statusFilter
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [roleFilter, search, statusFilter, users])

  const selectedUser = users.find((user) => user.id === selectedId) || (users.length > 0 ? users[0] : null)

  const chooseUser = (user) => {
    setSelectedId(user.id)
    setPermissionRole(user.role)
    setMobileDetail(true)
  }

  const showAction = async (message) => {
    if (!selectedUser) return
    if (message === 'Xác nhận khóa tài khoản') {
      const newStatus = selectedUser.status === 'Bị khóa' ? 'ACTIVE' : 'LOCKED'
      try {
        await quanTriService.doiTrangThai(selectedUser.id, newStatus)
        setNotice(`${newStatus === 'LOCKED' ? 'Đã khóa' : 'Đã mở khóa'} tài khoản ${selectedUser.name}`)
        fetchUsers()
      } catch {
        setNotice('Không thể thay đổi trạng thái tài khoản')
      }
    } else if (message === 'Xác nhận xóa tài khoản') {
      try {
        await quanTriService.xoaTaiKhoan(selectedUser.id)
        setNotice(`Đã xóa tài khoản ${selectedUser.name}`)
        setSelectedId(null)
        fetchUsers()
      } catch {
        setNotice('Không thể xóa tài khoản')
      }
    } else if (message === 'Mở chỉnh sửa vai trò') {
      setNotice(`Chức năng đổi role cho ${selectedUser.name} đang phát triển`)
    } else if (message === 'Mở trình chỉnh sửa quyền') {
      setNotice(`Chức năng chỉnh sửa quyền cho ${selectedUser.name} đang phát triển`)
    } else if (message === 'Gửi yêu cầu đặt lại mật khẩu') {
      setNotice(`Đã gửi yêu cầu đặt lại mật khẩu cho ${selectedUser.name}`)
    } else {
      setNotice(`${message} cho ${selectedUser.name}`)
    }
  }

  const handleCreate = async (data) => {
    try {
      await quanTriService.taoTaiKhoan(data)
      setCreateOpen(false)
      setNotice('Đã tạo lời mời kích hoạt tài khoản mới')
      fetchUsers()
    } catch {
      setNotice('Không thể tạo tài khoản')
    }
  }

  return (
    <div className="dashboard-panel-enter mx-auto max-w-[1440px]">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-600">
            <Icon name="shield" className="h-4 w-4" />
            BẢO MẬT & PHÂN QUYỀN
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý tài khoản &amp; phân quyền</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading && (
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                Đang tải...
              </span>
            )}
            {!loading && (error || 'Quản lý người dùng nội bộ và quyền truy cập hệ thống')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none">
            {ROLE_OPTIONS.map((role) => <option key={role}>{role}</option>)}
          </select>
          <button type="button" onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
            <Icon name="plus" className="h-4 w-4" />
            Tạo tài khoản
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <span className="flex items-center gap-2"><Icon name="check" className="h-4 w-4" />{notice}</span>
          <button type="button" onClick={() => setNotice('')} className="text-blue-500 hover:text-blue-700"><Icon name="close" className="h-4 w-4" /></button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {KPI_CARDS.map((card) => <SummaryCard key={card.label} card={card} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Danh sách tài khoản nội bộ</h2>
                <p className="mt-1 text-xs text-slate-500">Hiển thị {filteredUsers.length} trên {users.length} tài khoản</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, email, SĐT..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-56" />
                </div>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-blue-500 focus:outline-none">
                  <option>Tất cả trạng thái</option>
                  <option>Đang hoạt động</option>
                  <option>Bị khóa</option>
                  <option>Chờ kích hoạt</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[820px] w-full">
                <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Người dùng</th>
                    <th className="px-4 py-3">Số điện thoại</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Ngày tạo</th>
                    <th className="px-5 py-3">Đăng nhập cuối</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} onClick={() => chooseUser(user)} className={`cursor-pointer border-t border-slate-100 text-sm transition hover:bg-blue-50/45 ${selectedId === user.id ? 'bg-blue-50/70' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">{user.initials}</span>
                          <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{user.phone}</td>
                      <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                      <td className="px-4 py-4 text-slate-500">{user.created}</td>
                      <td className="px-5 py-4 text-slate-600">{user.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredUsers.length && (
                <div className="px-6 py-12 text-center text-sm text-slate-500">Không tìm thấy tài khoản phù hợp bộ lọc.</div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Ma trận phân quyền module</h2>
                <p className="mt-1 text-xs text-slate-500">Kiểm soát thao tác theo từng role trong hệ thống RBAC</p>
              </div>
              <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
                {ROLE_OPTIONS.slice(1).map((role) => (
                  <button key={role} type="button" onClick={() => setPermissionRole(role)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${permissionRole === role ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{role}</button>
                ))}
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400">
                    <th className="py-3 text-left">Module</th>
                    {PERMISSION_LABELS.map((label) => <th key={label} className="px-3 py-3 text-center">{label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS[permissionRole].map((permission) => (
                    <tr key={permission.module} className="border-t border-slate-100">
                      <td className="py-3.5 font-medium text-slate-700">{permission.module}</td>
                      {permission.values.map((allowed, index) => <td key={PERMISSION_LABELS[index]} className="px-3 py-3.5"><PermissionMark allowed={allowed} /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Nhật ký kiểm toán</h2>
                <p className="mt-1 text-xs text-slate-500">Mọi thay đổi phân quyền đều được ghi nhận</p>
              </div>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Xem tất cả</button>
            </div>
            <div className="divide-y divide-slate-100">
              {AUDIT_LOGS.map((log) => (
                <div key={log.time} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${log.tone === 'orange' ? 'bg-orange-500' : log.tone === 'green' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <p className="text-slate-600"><span className="font-semibold text-slate-800">{log.person}</span> {log.action} <span className="font-medium text-blue-700">{log.target}</span></p>
                  </div>
                  <span className="pl-5 text-xs text-slate-400 sm:pl-0">{log.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-0">
            {selectedUser && <UserDetail user={selectedUser} onAction={showAction} />}
          </div>
        </aside>
      </div>

      {mobileDetail && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-3 backdrop-blur-sm xl:hidden" onClick={() => setMobileDetail(false)}>
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex justify-end px-4 pt-3">
              <button type="button" onClick={() => setMobileDetail(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><Icon name="close" /></button>
            </div>
            <UserDetail user={selectedUser} onAction={showAction} inModal />
          </div>
        </div>
      )}

      {createOpen && <CreateAccountModal onClose={() => setCreateOpen(false)} onCreate={handleCreate} />}
    </div>
  )
}
