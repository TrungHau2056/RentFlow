import { Link, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'

const MENU_ITEMS = [
  { path: '/dashboard/bat-dong-san', label: 'Nhà ký gửi', icon: 'building' },
  { path: '/dashboard/bat-dong-san/dang-ky', label: 'Đăng ký ký gửi', icon: 'plus' },
  { path: '/dashboard/hop-dong', label: 'Hợp đồng ký gửi', icon: 'contract' },
  { path: '/dashboard/tien-dam-bao', label: 'Tiền đảm bảo', icon: 'money' },
  { path: '/dashboard/lich-khao-sat', label: 'Lịch khảo sát', icon: 'calendar' },
  { path: '/dashboard/thong-bao', label: 'Thông báo', icon: 'bell' },
]

const ICONS = {

  building: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  contract: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  money: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zm-8 12h4" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21a8 8 0 00-16 0m12-13a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
    </svg>
  ),
}

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

export default function DashboardLayout() {
  const location = useLocation()
  const [userInfo] = useState(readStoredUser)
  const isChuNha = userInfo?.role === 'CHU_NHA'

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Bạn chưa đăng nhập</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Vui lòng đăng nhập để truy cập trang quản lý.
          </p>
          <a href="/" className="inline-block bg-primary-container hover:bg-primary text-on-primary font-semibold py-3 px-8 rounded-lg transition-colors">
            Đăng nhập ngay
          </a>
        </div>
      </div>
    )
  }

  if (!isChuNha) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Không có quyền truy cập</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Tài khoản của bạn không có quyền truy cập trang quản lý chủ nhà.
          </p>
          <a href="/" className="inline-block bg-surface-container hover:bg-surface-container-low text-on-surface font-semibold py-3 px-8 rounded-lg transition-colors border border-outline-variant">
            Về trang chủ
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant shrink-0 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-outline-variant">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
            <svg className="w-6 h-6 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-primary font-semibold text-base leading-tight">RentFlow</h1>
            <p className="text-on-surface-variant text-xs">Cổng quản lý</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 flex-1">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-container/10 text-primary-container font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                  {ICONS[item.icon]}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Add Property Button */}
        <div className="p-3 border-t border-outline-variant mt-auto">
          <Link
            to="/dashboard/bat-dong-san/dang-ky"
            className="w-full bg-primary-container hover:bg-primary text-on-primary font-medium text-sm py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm bất động sản mới
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userInfo={userInfo}
          searchPlaceholder="Tìm kiếm bất động sản..."
          showSettings
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
