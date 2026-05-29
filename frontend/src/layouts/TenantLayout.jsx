import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'

const MENU_ITEMS = [
  { id: 'tong-quan', label: 'Tổng quan', icon: 'dashboard', path: '/tenant' },
  { id: 'tim-nha', label: 'Tìm nhà mới', icon: 'search', path: '/bat-dong-san' },
  { id: 'nha-da-luu', label: 'Nhà đã lưu', icon: 'heart', path: '/tenant/nha-da-luu' },
  { id: 'lich-xem', label: 'Lịch xem nhà', icon: 'calendar', path: '/tenant/lich-xem' },
  { id: 'thong-bao', label: 'Thông báo', icon: 'bell', badge: '3', path: '/tenant/thong-bao' },
  { id: 'hop-dong', label: 'Hợp đồng thuê', icon: 'document', path: '/tenant/hop-dong' },
  { id: 'ho-so', label: 'Hồ sơ cá nhân', icon: 'user', path: '/tenant/ho-so' },
]

function readStoredUser() {
  const stored = localStorage.getItem('userInfo')
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem('userInfo')
    return null
  }
}

function NavIcon({ icon }) {
  const paths = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 3v4m8-4v4M4 10h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />,
    document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 3h7l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5M9 13h6m-6 4h6" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M20 21a8 8 0 00-16 0m12-13a4 4 0 11-8 0 4 4 0 018 0z" />,
  }

  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[icon]}
    </svg>
  )
}

export default function TenantLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userInfo] = useState(readStoredUser)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const activeMenu = MENU_ITEMS.find(item => location.pathname === item.path)?.id || 'tong-quan'

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    navigate('/home')
  }

  if (!userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/40">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary-container">
            <NavIcon icon="user" />
          </div>
          <h1 className="text-xl font-bold text-on-surface">Vui lòng đăng nhập</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Đăng nhập tài khoản khách hàng để truy cập dashboard cá nhân.
          </p>
          <Link to="/login" className="mt-6 block rounded-xl bg-primary-container py-3 text-sm font-semibold text-white hover:bg-primary">
            Đến trang đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  if (userInfo.role !== 'KHACH_THUE' && userInfo.role !== 'KHACH_HANG') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-on-surface">Không có quyền truy cập</h1>
          <p className="mt-2 text-sm text-slate-500">Khu vực này dành cho tài khoản khách hàng.</p>
          <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary-container px-6 py-3 text-sm font-semibold text-white">
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const sidebarContent = (
    <>
      <Link to="/tenant" className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-blue-600/20">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold text-primary">RentFlow</p>
          <p className="text-xs text-slate-500">Cổng khách hàng</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1.5 px-3 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Menu</p>
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
              activeMenu === item.id
                ? 'bg-blue-50 text-primary-container'
                : 'text-slate-600 hover:bg-slate-50 hover:text-on-surface'
            }`}
          >
            <NavIcon icon={item.icon} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="mb-3 rounded-2xl bg-gradient-to-br from-primary-container to-[#2874e8] p-4 text-white">
          <p className="text-xs text-blue-100">Hạng thành viên</p>
          <p className="mt-1 text-sm font-semibold">Premium Member</p>
          <p className="mt-2 text-xs text-blue-100">Ưu tiên hỗ trợ đặt lịch xem nhà</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 16l4-4-4-4m4 4H9m4 8H6a2 2 0 01-2-2V6a2 2 0 012-2h7" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Đóng menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
          <aside className="relative flex h-full w-72 flex-col bg-white shadow-2xl">{sidebarContent}</aside>
        </div>
      )}

      <div className="lg:pl-72">
        <Header
          userInfo={userInfo}
          searchPlaceholder="Tìm nhà theo khu vực, giá thuê..."
          searchHidden
          showMobileMenu
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          profileLabel="Khách hàng"
          sticky
          height="h-20"
          onLogout={logout}
        />

        <main className="p-4 sm:p-6 xl:p-8">
          <Outlet context={{ userInfo }} />
        </main>
      </div>
    </div>
  )
}
