import { useMemo, useState } from 'react'

const USERS = [
  {
    id: 1,
    name: 'Nguyễn Minh Quân',
    initials: 'MQ',
    email: 'admin@rentflow.vn',
    phone: '0902 114 229',
    role: 'Admin',
    status: 'Đang hoạt động',
    created: '12/03/2024',
    lastLogin: 'Hôm nay, 08:42',
    twoFactor: true,
    attempts: 0,
    device: 'MacBook Pro - Chrome, Hà Nội',
    modules: ['Toàn bộ hệ thống', 'Quản trị bảo mật', 'Báo cáo'],
    history: ['Cập nhật quyền Nhân viên đại lý', 'Xuất báo cáo truy cập hệ thống'],
  },
  {
    id: 2,
    name: 'Lê Thu Hương',
    initials: 'TH',
    email: 'huong.mg@rentflow.vn',
    phone: '0988 326 551',
    role: 'Môi giới',
    status: 'Đang hoạt động',
    created: '04/11/2024',
    lastLogin: 'Hôm nay, 09:16',
    twoFactor: true,
    attempts: 1,
    device: 'iPhone 15 - Safari, Ba Đình',
    modules: ['Bất động sản', 'Lịch xem nhà', 'Khách hàng'],
    history: ['Đặt lịch xem căn hộ RF-2041', 'Cập nhật hồ sơ khách thuê'],
  },
  {
    id: 3,
    name: 'Trần Đức Anh',
    initials: 'ĐA',
    email: 'ducanh.daily@rentflow.vn',
    phone: '0914 882 102',
    role: 'Nhân viên đại lý',
    status: 'Đang hoạt động',
    created: '21/01/2025',
    lastLogin: 'Hôm qua, 16:28',
    twoFactor: false,
    attempts: 2,
    device: 'Windows 11 - Edge, Cầu Giấy',
    modules: ['Chủ nhà', 'Hợp đồng ký gửi', 'Lịch khảo sát'],
    history: ['Tạo hồ sơ chủ nhà mới', 'Gửi hợp đồng chờ duyệt'],
  },
  {
    id: 4,
    name: 'Phạm Bảo Ngọc',
    initials: 'BN',
    email: 'ngoc.phaply@rentflow.vn',
    phone: '0963 571 488',
    role: 'Pháp luật',
    status: 'Đang hoạt động',
    created: '09/05/2024',
    lastLogin: '25/05/2026, 14:11',
    twoFactor: true,
    attempts: 0,
    device: 'Dell XPS - Chrome, Đống Đa',
    modules: ['Pháp luật', 'Hợp đồng thuê', 'Hợp đồng ký gửi'],
    history: ['Phê duyệt hồ sơ pháp lý RF-HD-319', 'Yêu cầu bổ sung giấy tờ'],
  },
  {
    id: 5,
    name: 'Vũ Thanh Tùng',
    initials: 'TT',
    email: 'tung.mg@rentflow.vn',
    phone: '0977 640 301',
    role: 'Môi giới',
    status: 'Bị khóa',
    created: '17/02/2025',
    lastLogin: '18/05/2026, 21:30',
    twoFactor: false,
    attempts: 5,
    device: 'Thiết bị lạ - IP 171.240.xxx.xxx',
    modules: ['Bất động sản', 'Lịch xem nhà'],
    history: ['Tài khoản bị khóa tự động', '5 lần đăng nhập thất bại'],
  },
  {
    id: 6,
    name: 'Hoàng Hải Yến',
    initials: 'HY',
    email: 'yen.daily@rentflow.vn',
    phone: '0904 731 910',
    role: 'Nhân viên đại lý',
    status: 'Chờ kích hoạt',
    created: '25/05/2026',
    lastLogin: 'Chưa đăng nhập',
    twoFactor: false,
    attempts: 0,
    device: 'Chưa có thiết bị',
    modules: ['Chủ nhà', 'Bất động sản'],
    history: ['Gửi email kích hoạt tài khoản'],
  },
]

const ROLE_OPTIONS = ['Tất cả role', 'Admin', 'Môi giới', 'Nhân viên đại lý', 'Pháp luật']

const KPI_CARDS = [
  { label: 'Tổng tài khoản', value: '248', detail: '+12 tháng này', tone: 'blue', icon: 'users' },
  { label: 'Đang hoạt động', value: '231', detail: '93,1% tổng số', tone: 'green', icon: 'check' },
  { label: 'Tài khoản bị khóa', value: '05', detail: 'Cần xem xét', tone: 'orange', icon: 'lock' },
  { label: 'Role Admin', value: '04', detail: 'Quyền cao nhất', tone: 'violet', icon: 'shield' },
  { label: 'Role Môi giới', value: '126', detail: '+8 đang hoạt động', tone: 'blue', icon: 'briefcase' },
  { label: 'Role Pháp luật', value: '12', detail: '2 yêu cầu mới', tone: 'green', icon: 'document' },
]

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
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" placeholder="Nhập tên nhân viên" />
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-slate-600">Email công việc</span>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" placeholder="email@rentflow.vn" />
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-slate-600">Role</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100">
              {ROLE_OPTIONS.slice(1).map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2.5 text-sm text-slate-600">
          <input defaultChecked type="checkbox" className="h-4 w-4 accent-blue-600" />
          Yêu cầu bật xác thực hai lớp khi đăng nhập lần đầu
        </label>
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Hủy</button>
          <button type="button" onClick={onCreate} className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">Tạo & gửi lời mời</button>
        </div>
      </div>
    </div>
  )
}

export default function AccountManagementPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tất cả role')
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [selectedId, setSelectedId] = useState(1)
  const [permissionRole, setPermissionRole] = useState('Admin')
  const [mobileDetail, setMobileDetail] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return USERS.filter((user) => {
      const matchesQuery = !query || `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(query)
      const matchesRole = roleFilter === 'Tất cả role' || user.role === roleFilter
      const matchesStatus = statusFilter === 'Tất cả trạng thái' || user.status === statusFilter
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [roleFilter, search, statusFilter])

  const selectedUser = USERS.find((user) => user.id === selectedId) || USERS[0]

  const chooseUser = (user) => {
    setSelectedId(user.id)
    setPermissionRole(user.role)
    setMobileDetail(true)
  }

  const showAction = (message) => {
    setNotice(`${message} cho ${selectedUser.name}`)
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
          <p className="mt-1 text-sm text-slate-500">Quản lý người dùng nội bộ và quyền truy cập hệ thống</p>
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
                <p className="mt-1 text-xs text-slate-500">Hiển thị {filteredUsers.length} trên 248 tài khoản</p>
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
            <UserDetail user={selectedUser} onAction={showAction} />
          </div>
        </aside>
      </div>

      {mobileDetail && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-3 backdrop-blur-sm xl:hidden" onClick={() => setMobileDetail(false)}>
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex justify-end px-4 pt-3">
              <button type="button" onClick={() => setMobileDetail(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><Icon name="close" /></button>
            </div>
            <UserDetail user={selectedUser} onAction={showAction} inModal />
          </div>
        </div>
      )}

      {createOpen && <CreateAccountModal onClose={() => setCreateOpen(false)} onCreate={() => { setCreateOpen(false); setNotice('Đã tạo lời mời kích hoạt tài khoản mới') }} />}
    </div>
  )
}
