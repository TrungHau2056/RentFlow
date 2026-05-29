import { useState } from 'react'
import { Link } from 'react-router-dom'

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export default function Header({
  userInfo,
  onLogout,
  searchPlaceholder = 'Tìm kiếm...',
  searchHidden = false,
  showCreate = false,
  showSettings = false,
  showMobileMenu = false,
  onMobileMenuToggle,
  roleLabel,
  profileLabel,
  height = 'h-16',
  sticky = false,
}) {
  const [profileOpen, setProfileOpen] = useState(false)

  const initials = userInfo?.hoTen
    ?.split(' ')
    .slice(-2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase() || 'U'

  const defaultLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    window.location.href = '/'
  }

  const handleLogout = onLogout || defaultLogout

  return (
    <header
      className={`${height} bg-white border-b border-outline-variant flex items-center justify-between px-4 sm:px-6 ${
        sticky ? 'sticky top-0 z-20 bg-white/95 backdrop-blur' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {showMobileMenu && (
          <button
            type="button"
            onClick={onMobileMenuToggle}
            aria-label="Mở menu"
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container lg:hidden"
          >
            <MenuIcon />
          </button>
        )}

        <div className={`flex-1 max-w-md ${searchHidden ? 'hidden md:block' : ''}`}>
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {showCreate && (
          <button
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
            title="Tạo mới"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

        <button className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        {showSettings && (
          <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}

        <div className="relative flex items-center gap-2 pl-2 ml-1 border-l border-outline-variant">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="text-on-primary text-xs font-medium">{initials}</span>
          </div>

          {profileLabel || roleLabel ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="hidden sm:flex items-center gap-2 rounded-lg py-1 transition-colors hover:bg-surface-container"
              >
                <div className="text-left">
                  <p className="text-sm text-on-surface leading-tight">{userInfo?.hoTen || 'User'}</p>
                  <p className="text-xs text-on-surface-variant leading-tight">{roleLabel || profileLabel}</p>
                </div>
                <svg className="h-4 w-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-outline-variant bg-white p-2 shadow-xl z-50">
                  <Link
                    to="/tenant/ho-so"
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-on-surface hover:bg-surface-container transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setProfileOpen(false); handleLogout() }}
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-error hover:bg-error-container/20 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-on-surface">{userInfo?.hoTen || 'User'}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-on-surface-variant hover:text-error transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {!userInfo && (
          <Link
            to="/login"
            className="text-sm text-primary-container font-medium hover:text-primary transition-colors"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  )
}
