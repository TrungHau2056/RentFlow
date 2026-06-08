/**
 * contractMappers.js — Shared mapper functions from API response
 * to view models for admin list, owner list, detail, and legal request.
 *
 * These centralize the shape transformation so all pages get consistent
 * data regardless of API response structure.
 */

import { STATUS_MAP, LEGAL_MAP, WORKFLOW_MAP, STATUS_UI_CONFIG, LEGAL_STATUS_UI_CONFIG } from './contractStatus'

/* ---------- helpers ---------- */

function formatVND(value) {
  if (value == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(value)
}

export function formatCurrency(value) {
  if (value == null) return '—'
  return formatVND(value) + ' VNĐ'
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function calcThoiHan(ngayBatDau, ngayKetThuc) {
  if (!ngayBatDau || !ngayKetThuc) return null
  const start = new Date(ngayBatDau)
  const end = new Date(ngayKetThuc)
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
}

/* ---------- shared status resolver ---------- */

function resolveStatus(rawStatus, ngayKetThuc) {
  const uiStatus = STATUS_MAP[rawStatus] || 'cho_duyet'
  if (uiStatus === 'dang_hieu_luc' && ngayKetThuc) {
    const daysLeft = daysUntil(ngayKetThuc)
    if (daysLeft !== null && daysLeft <= 30) return 'sap_het_han'
  }
  return uiStatus
}

/* ---------- mappers ---------- */

/**
 * Map a raw API contract item to the admin list / detail view model.
 * Used by AdminHopDongKyGuiPage and ChiTietHopDongKyGuiPage (admin view).
 */
export function mapContractToAdminView(item) {
  const rawStatus = item.trangThai || ''
  const ngayBatDau = item.ngayBatDau || item.ngayKy
  const ngayKetThuc = item.ngayKetThuc
  const uiStatus = resolveStatus(rawStatus, ngayKetThuc)

  return {
    id: item.id,
    ma: `HĐKG-${String(item.id).padStart(4, '0')}`,
    chuNha: item.tenChuNha || '',
    sdtChuNha: item.sdtChuNha || '',
    emailChuNha: item.emailChuNha || '',
    batDongSan: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    diaChiBDS: item.diaChiBatDongSan || '',
    loaiBDS: item.loaiBatDongSan || '',
    giaThue: item.giaThue || 0,
    ngayKy: item.ngayKy || '',
    thoiHan: calcThoiHan(ngayBatDau, ngayKetThuc) || 0,
    ngayBatDau: ngayBatDau || '',
    ngayHetHan: ngayKetThuc || '',
    tienDamBao: item.tienDamBao || 0,
    trangThai: uiStatus,
    trangThaiPhapLy: LEGAL_MAP[rawStatus] || 'cho_phap_luat',
    rawStatus,
    nhanVien: item.tenNhanVien || '',
    coDieuKhoanPhatSinh: !!item.coDieuKhoanPhatSinh,
    dieuKhoanPhatSinh: Array.isArray(item.dieuKhoanPhatSinh)
      ? item.dieuKhoanPhatSinh
      : item.dieuKhoanPhatSinh ? [{ noiDung: item.dieuKhoanPhatSinh }] : [],
    workflowStep: WORKFLOW_MAP[rawStatus] || 1,
    // Signature tracking
    chuKyChuNha: item.chuKyChuNha || null,
    chuKyDaiLy: item.chuKyDaiLy || null,
    // Legal result
    ketQuaPhapLy: item.ketQuaPhapLy || null,
    // BDS status
    trangThaiBatDongSan: item.trangThaiBatDongSan || '',
    // History
    lichSu: Array.isArray(item.lichSu) ? item.lichSu : [],
  }
}

/**
 * Map a raw API contract item to the owner (Chủ nhà) list view model.
 * Used by HopDongKyGuiPage.
 */
export function mapContractToOwnerView(item) {
  const rawStatus = item.trangThai || ''
  const ngayBatDau = item.ngayBatDau || item.ngayKy
  const ngayKetThuc = item.ngayKetThuc
  const uiStatus = resolveStatus(rawStatus, ngayKetThuc)
  const thoiHan = calcThoiHan(ngayBatDau, ngayKetThuc)

  return {
    id: item.id,
    maHopDong: `HĐKG-${String(item.id).padStart(4, '0')}`,
    tenBDS: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    bdsId: item.batDongSanId,
    ngayKy: item.ngayKy || '',
    ngayBatDau: ngayBatDau || '',
    ngayKetThuc: ngayKetThuc || '',
    thoiHan: thoiHan ? `${thoiHan} tháng` : '—',
    tienDamBao: item.tienDamBao || 0,
    trangThai: uiStatus,
    rawStatus,
    // Deposit status
    tienDamBaoTrangThai: (rawStatus === 'DA_KY' || rawStatus === 'HOAN_THANH') ? 'dang_giu' : 'cho_duyet',
    workflowStep: WORKFLOW_MAP[rawStatus] || 1,
    diaChiBDS: item.diaChiBatDongSan || '',
    loaiBDS: item.loaiBatDongSan || '',
    dienTich: item.dienTich || '',
    giaThue: item.giaThue,
    daiDienDaiLy: item.tenNhanVien || '—',
    // Signature tracking
    chuKyChuNha: item.chuKyChuNha || null,
    chuKyDaiLy: item.chuKyDaiLy || null,
    // Legal result
    ketQuaPhapLy: item.ketQuaPhapLy || null,
    lichSu: Array.isArray(item.lichSu) ? item.lichSu : [],
  }
}

/**
 * Map a raw API contract item to a legal request view model.
 * Used by LegalPage.
 */
export function mapContractToLegalRequest(item, type = 'ky_gui') {
  const isKyGui = type === 'ky_gui'
  const rawStatus = item.trangThai || ''
  return {
    id: item.id,
    loaiHopDong: type,
    maYeuCau: isKyGui ? `KG-${item.id}` : `HDT-${item.id}`,
    maHopDong: isKyGui ? `HĐKG-${String(item.id).padStart(4, '0')}` : `HĐT-${String(item.id).padStart(4, '0')}`,
    chuNha: isKyGui ? (item.tenChuNha || '') : (item.tenKhachHang || ''),
    batDongSan: item.diaChiBatDongSan || `BĐS #${item.batDongSanId}`,
    diaChiBDS: item.diaChiBatDongSan || '',
    loaiYeuCau: 'duyet_hop_dong',
    mucDoUuTien: 'binh_thuong',
    ngayGui: item.ngayKy || item.ngayBatDau || '',
    trangThai: LEGAL_MAP[rawStatus] || 'cho_phap_luat',
    rawStatus,
    nguoiGui: isKyGui ? (item.tenNhanVien || '') : (item.tenNhanVienMoiGioi || ''),
    nguoiXuLy: null,
    deadline: item.ngayKetThuc || '',
    coDieuKhoanPhatSinh: !!item.coDieuKhoanPhatSinh,
    dieuKhoanPhatSinh: Array.isArray(item.dieuKhoanPhatSinh)
      ? item.dieuKhoanPhatSinh
      : item.dieuKhoanPhatSinh ? [{ noiDung: item.dieuKhoanPhatSinh }] : [],
    ghiChuPhapLy: item.ketQuaPhapLy?.ghiChu || '',
    lichSu: Array.isArray(item.lichSu) ? item.lichSu : [],
  }
}

/**
 * Map a raw API detail response to the detail page view model.
 * Used by ChiTietHopDongKyGuiPage (shared between admin and owner views).
 */
export function mapContractToDetailView(data) {
  const rawStatus = data.trangThai || ''
  const ngayBatDau = data.ngayBatDau || data.ngayKy
  const ngayKetThuc = data.ngayKetThuc || data.ngayHetHan
  const uiStatus = STATUS_MAP[rawStatus] || 'cho_duyet'

  return {
    id: data.id,
    maHopDong: data.maHopDong || data.ma || `HĐKG-${String(data.id).padStart(4, '0')}`,
    trangThai: uiStatus,
    rawStatus,
    chuNha: {
      hoTen: data.chuNha?.hoTen || data.tenChuNha || '',
      sdt: data.chuNha?.sdt || data.sdtChuNha || '',
      email: data.chuNha?.email || data.emailChuNha || '',
    },
    batDongSan: {
      ten: data.batDongSan?.ten || data.tenBatDongSan || '',
      diaChi: data.batDongSan?.diaChi || data.diaChiBatDongSan || '',
      loai: data.loaiBatDongSan || '',
      dienTich: data.dienTich || '',
    },
    giaTriDinhGia: data.giaTriDinhGia || data.giaTri || 0,
    tienDamBao: data.tienDamBao || 0,
    ngayBatDau: ngayBatDau || '',
    ngayKetThuc: ngayKetThuc || '',
    nhanVien: data.tenNhanVien || '',
    // Legal
    hoSoPhapLy: {
      hopLe: data.hoSoPhapLy?.hopLe ?? data.ketQuaPhapLy?.duyet ?? true,
      ghiChu: data.hoSoPhapLy?.ghiChu || data.ketQuaPhapLy?.ghiChu || '',
    },
    nguoiDuyet: data.ketQuaPhapLy?.tenNguoiDuyet || data.nguoiDuyet || '',
    ketQuaPhapLy: data.ketQuaPhapLy || null,
    // Signatures
    chuKyChuNha: data.chuKyChuNha || null,
    chuKyDaiLy: data.chuKyDaiLy || null,
    // BDS status
    trangThaiBatDongSan: data.trangThaiBatDongSan || '',
    // Documents
    taiLieuDinhKem: (data.taiLieuDinhKem || data.taiLieu || []).map((f) => ({
      ten: f.ten || f.tenFile || '',
      dungLuong: f.dungLuong || '',
      loai: f.loai || 'pdf',
    })),
    // Workflow
    workflowStep: WORKFLOW_MAP[rawStatus] || 1,
    // History
    lichSu: (data.lichSu || []).map((item) => ({
      buoc: item.buoc || item.noiDung || '',
      nguoiThucHien: item.nguoiThucHien || item.nguoi || '',
      thoiGian: item.thoiGian || item.ngay || '',
      daHoanThanh: item.daHoanThanh ?? true,
    })),
  }
}

/**
 * Get the UI config object for a contract status key.
 */
export function getStatusConfig(uiStatusKey) {
  return STATUS_UI_CONFIG[uiStatusKey] || STATUS_UI_CONFIG.cho_duyet
}

export function getLegalStatusConfig(legalStatusKey) {
  return LEGAL_STATUS_UI_CONFIG[legalStatusKey] || LEGAL_STATUS_UI_CONFIG.cho_phap_luat
}
