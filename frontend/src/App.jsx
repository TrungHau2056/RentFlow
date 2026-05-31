import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import BatDongSanPage from './pages/BatDongSanPage'
import QuanLyBatDongSanPage from './pages/QuanLyBatDongSanPage'
import DangKyKyGuiPage from './pages/DangKyKyGuiPage'
import ChiTietBatDongSanPage from './pages/ChiTietBatDongSanPage'
import ChiTietQuanLyBatDongSanPage from './pages/ChiTietQuanLyBatDongSanPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminChuNhaPage from './pages/AdminChuNhaPage'
import AdminBatDongSanPage from './pages/AdminBatDongSanPage'
import AdminLichKhaoSatPage from './pages/AdminLichKhaoSatPage'
import AdminHopDongKyGuiPage from './pages/AdminHopDongKyGuiPage'
import AdminHopDongThuePage from './pages/AdminHopDongThuePage'
import ChiTietHopDongKyGuiPage from './pages/ChiTietHopDongKyGuiPage'
import CustomersPage from './pages/CustomersPage'
import ChiTietKhachHangPage from './pages/ChiTietKhachHangPage'
import LegalPage from './pages/LegalPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TenantDashboardPage from './pages/TenantDashboardPage'
import SavedPropertiesPage from './pages/SavedPropertiesPage'
import ScheduleViewingPage from './pages/ScheduleViewingPage'
import MyViewingSchedulePage from './pages/MyViewingSchedulePage'
import NotificationsPage from './pages/NotificationsPage'
import TenantContractsPage from './pages/TenantContractsPage'
import TenantProfilePage from './pages/TenantProfilePage'
import TenantFindPropertyPage from './pages/TenantFindPropertyPage'
import HopDongKyGuiPage from './pages/HopDongKyGuiPage'
import TienDamBaoPage from './pages/TienDamBaoPage'
import LichKhaoSatPage from './pages/LichKhaoSatPage'
import LichXemNhaPage from './pages/LichXemNhaPage'
import PhanCongMoiGioiPage from './pages/PhanCongMoiGioiPage'
import HoaHongPage from './pages/HoaHongPage'
import ThongBaoPage from './pages/ThongBaoPage'
import BaoCaoThongKePage from './pages/BaoCaoThongKePage'
import AccountManagementPage from './pages/AccountManagementPage'
import AdminLayout from './layouts/AdminLayout'
import DashboardLayout from './layouts/DashboardLayout'
import TenantLayout from './layouts/TenantLayout'
import { isInternalAdminRole } from './config/roles'

// Redirect logged-in users to their role-appropriate dashboard
function HomeRoute() {
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return <Navigate to="/home" replace />

  let user
  try {
    user = JSON.parse(userInfo)
  } catch {
    localStorage.removeItem('userInfo')
    return <Navigate to="/home" replace />
  }

  if (isInternalAdminRole(user.role)) return <Navigate to="/admin" replace />
  if (user.role === 'CHU_NHA') return <Navigate to="/dashboard" replace />
  if (user.role === 'KHACH_THUE' || user.role === 'KHACH_HANG') return <Navigate to="/tenant" replace />
  return <Navigate to="/home" replace />
}

function App() {
  return (
    <Routes>
      {/* Public / Khách thuê routes */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/bat-dong-san" element={<BatDongSanPage />} />
      <Route path="/bat-dong-san/dang-ky" element={<Navigate to="/dashboard/bat-dong-san/dang-ky" replace />} />
      <Route path="/bat-dong-san/:id" element={<ChiTietBatDongSanPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Khách hàng routes */}
      <Route path="/tenant" element={<TenantLayout />}>
        <Route index element={<TenantDashboardPage />} />
        <Route path="nha-da-luu" element={<SavedPropertiesPage />} />
        <Route path="tim-nha" element={<TenantFindPropertyPage />} />
        <Route path="lich-xem" element={<MyViewingSchedulePage />} />
        <Route path="dat-lich-xem" element={<ScheduleViewingPage />} />
        <Route path="thong-bao" element={<NotificationsPage />} />
        <Route path="hop-dong" element={<TenantContractsPage />} />
        <Route path="ho-so" element={<TenantProfilePage />} />
      </Route>

      {/* Chủ nhà routes — shared sidebar via DashboardLayout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="bat-dong-san" element={<QuanLyBatDongSanPage />} />
        <Route path="bat-dong-san/:id" element={<ChiTietQuanLyBatDongSanPage />} />
        <Route path="bat-dong-san/dang-ky" element={<DangKyKyGuiPage />} />
        <Route path="tai-chinh" element={<Navigate to="/dashboard/tien-dam-bao" replace />} />
        <Route path="tien-dam-bao" element={<TienDamBaoPage />} />
        <Route path="hop-dong" element={<HopDongKyGuiPage />} />
        <Route path="lich-khao-sat" element={<LichKhaoSatPage />} />
        <Route path="thong-bao" element={<ThongBaoPage />} />
        <Route path="hop-dong-ky-gui/:id" element={<ChiTietHopDongKyGuiPage />} />
      </Route>

      {/* Admin routes — shared sidebar via AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="chu-nha" element={<AdminChuNhaPage />} />
        <Route path="bat-dong-san" element={<AdminBatDongSanPage />} />
        <Route path="hop-dong-ky-gui" element={<AdminHopDongKyGuiPage />} />
        <Route path="hop-dong-thue" element={<AdminHopDongThuePage />} />
        <Route path="lich-khao-sat" element={<AdminLichKhaoSatPage />} />
        <Route path="lich-xem-nha" element={<LichXemNhaPage />} />
        <Route path="phan-cong-moi-gioi" element={<PhanCongMoiGioiPage />} />
        <Route path="hoa-hong" element={<HoaHongPage />} />
        <Route path="tien-dam-bao" element={<TienDamBaoPage />} />
        <Route path="bao-cao-thong-ke" element={<BaoCaoThongKePage />} />
        <Route path="phap-luat" element={<LegalPage />} />
        <Route path="tai-khoan" element={<AccountManagementPage />} />
        <Route path="khach-hang" element={<CustomersPage />} />
        <Route path="customers" element={<Navigate to="/admin/khach-hang" replace />} />
        <Route path="customers/:id" element={<ChiTietKhachHangPage />} />
        <Route path="hop-dong-ky-gui/:id" element={<ChiTietHopDongKyGuiPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
