/**
 * contractStatus.js — Shared contract status config, workflow timeline map,
 * UI badge config, and action policy for consignment contracts (Hợp đồng ký gửi).
 *
 * All pages (AdminHopDongKyGuiPage, HopDongKyGuiPage, LegalPage,
 * ChiTietHopDongKyGuiPage) import from this module instead of defining
 * their own maps.
 */

/* ===================================================================
 * Raw backend statuses (HopDongKyGuiStatus)
 * =================================================================== */

export const HOP_DONG_STATUS = Object.freeze({
  NHAP: 'NHAP',
  CHO_PHE_DUYET: 'CHO_PHE_DUYET',
  CAN_SUA: 'CAN_SUA',
  TU_CHOI: 'TU_CHOI',
  DA_PHE_DUYET: 'DA_PHE_DUYET',
  CHO_KY: 'CHO_KY',
  DA_KY: 'DA_KY',
  HOAN_THANH: 'HOAN_THANH',
  DA_HUY: 'DA_HUY',
})

/* ===================================================================
 * UI status labels — mapping backend raw → display config
 * Each entry: { label, color, dot }
 * =================================================================== */

export const STATUS_UI_CONFIG = Object.freeze({
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  cho_ky: { label: 'Chờ ký', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  dang_hieu_luc: { label: 'Đang hiệu lực', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  sap_het_han: { label: 'Sắp hết hạn', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
  tam_ngung: { label: 'Tạm ngưng', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
  da_huy: { label: 'Đã hủy', color: 'bg-slate-200 text-slate-600 border-slate-300', dot: 'bg-slate-500' },
})

/* ===================================================================
 * Legal status UI config
 * =================================================================== */

export const LEGAL_STATUS_UI_CONFIG = Object.freeze({
  cho_phap_luat: { label: 'Chờ pháp luật', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
  can_sua: { label: 'Cần sửa', color: 'bg-orange-50 text-orange-700', dot: 'bg-orange-400' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700', dot: 'bg-red-400' },
})

/* ===================================================================
 * RAW → UI status mapping
 * =================================================================== */

export const STATUS_MAP = Object.freeze({
  [HOP_DONG_STATUS.NHAP]: 'cho_duyet',
  [HOP_DONG_STATUS.CHO_PHE_DUYET]: 'cho_duyet',
  [HOP_DONG_STATUS.DA_PHE_DUYET]: 'cho_ky',
  [HOP_DONG_STATUS.CHO_KY]: 'cho_ky',
  [HOP_DONG_STATUS.TU_CHOI]: 'tam_ngung',
  [HOP_DONG_STATUS.CAN_SUA]: 'cho_duyet',
  [HOP_DONG_STATUS.DA_KY]: 'dang_hieu_luc',
  [HOP_DONG_STATUS.HOAN_THANH]: 'da_ket_thuc',
  [HOP_DONG_STATUS.DA_HUY]: 'da_huy',
})

export const LEGAL_MAP = Object.freeze({
  [HOP_DONG_STATUS.NHAP]: 'cho_phap_luat',
  [HOP_DONG_STATUS.CHO_PHE_DUYET]: 'cho_phap_luat',
  [HOP_DONG_STATUS.DA_PHE_DUYET]: 'da_duyet',
  [HOP_DONG_STATUS.CHO_KY]: 'da_duyet',
  [HOP_DONG_STATUS.TU_CHOI]: 'tu_choi',
  [HOP_DONG_STATUS.CAN_SUA]: 'can_sua',
  [HOP_DONG_STATUS.DA_KY]: 'da_duyet',
  [HOP_DONG_STATUS.HOAN_THANH]: 'da_duyet',
  [HOP_DONG_STATUS.DA_HUY]: 'da_duyet',
})

/* ===================================================================
 * Workflow step definitions (6 bước theo spec)
 * =================================================================== */

export const WORKFLOW_STEPS = Object.freeze([
  { key: 'soan_thao', label: 'Soạn thảo', step: 1 },
  { key: 'kiem_tra_dk', label: 'Kiểm tra ĐK', step: 2 },
  { key: 'phap_ly', label: 'Pháp lý', step: 3 },
  { key: 'ket_qua_pl', label: 'KQ pháp lý', step: 4 },
  { key: 'ky_ket', label: 'Ký kết', step: 5 },
  { key: 'hieu_luc', label: 'Hiệu lực', step: 6 },
])

/** Map raw backend status → workflow step number (1-6) */
export const WORKFLOW_MAP = Object.freeze({
  [HOP_DONG_STATUS.NHAP]: 1,
  [HOP_DONG_STATUS.CHO_PHE_DUYET]: 2,
  [HOP_DONG_STATUS.CAN_SUA]: 2,
  [HOP_DONG_STATUS.TU_CHOI]: 2,
  [HOP_DONG_STATUS.DA_PHE_DUYET]: 4,
  [HOP_DONG_STATUS.CHO_KY]: 4,
  [HOP_DONG_STATUS.DA_KY]: 5,
  [HOP_DONG_STATUS.HOAN_THANH]: 6,
  [HOP_DONG_STATUS.DA_HUY]: 6,
})

/* ===================================================================
 * Clause status UI config
 * =================================================================== */

export const CLAUSE_STATUS_UI_CONFIG = Object.freeze({
  cho_duyet: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  da_duyet: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  tu_choi: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
})

/* ===================================================================
 * Action policy — which buttons to show for a given role + raw status
 *
 * Returns an array of action descriptors:
 *   { action: string, label: string, icon?: string, variant?: string, condition?: fn }
 *
 * The page renders buttons from this list, checking role gating here.
 * =================================================================== */

/**
 * Resolves available actions for a contract based on user role and contract status.
 *
 * @param {string} rawStatus — raw backend status (e.g. 'NHAP', 'DA_PHE_DUYET')
 * @param {string} roleGroup — normalized role group (ADMIN, AGENCY, LEGAL)
 * @param {object} options  — { coDieuKhoanPhatSinh, chuKyChuNha, chuKyDaiLy }
 * @returns {Array<{action: string, label: string, variant?: string}>}
 */
export function getAvailableActions(rawStatus, roleGroup, options = {}) {
  const { coDieuKhoanPhatSinh, chuKyChuNha, chuKyDaiLy } = options
  const isAdminOrAgency = roleGroup === 'ADMIN' || roleGroup === 'AGENCY'
  const isLegal = roleGroup === 'LEGAL'
  const isAdmin = roleGroup === 'ADMIN'

  const actions = []

  switch (rawStatus) {
    case HOP_DONG_STATUS.NHAP:
      if (isAdminOrAgency) {
        actions.push(
          { action: 'edit', label: 'Chỉnh sửa', variant: 'secondary' },
          { action: 'submit_legal', label: 'Gửi pháp lý', variant: 'primary' },
        )
        // Only show delete for NHAP
        actions.push({ action: 'delete', label: 'Xóa', variant: 'danger' })
      }
      break

    case HOP_DONG_STATUS.CHO_PHE_DUYET:
    case HOP_DONG_STATUS.CAN_SUA:
      if (isAdminOrAgency) {
        if (rawStatus === HOP_DONG_STATUS.CAN_SUA) {
          actions.push({ action: 'edit', label: 'Sửa theo yêu cầu', variant: 'secondary' })
        }
        actions.push({ action: 'submit_legal', label: 'Gửi lại pháp lý', variant: 'primary' })
      }
      if (isLegal) {
        actions.push(
          { action: 'approve', label: 'Phê duyệt', variant: 'success' },
          { action: 'reject', label: 'Từ chối', variant: 'danger' },
          { action: 'request_edit', label: 'Yêu cầu sửa', variant: 'warning' },
        )
      }
      break

    case HOP_DONG_STATUS.DA_PHE_DUYET:
    case HOP_DONG_STATUS.CHO_KY:
      if (isAdminOrAgency && !chuKyDaiLy) {
        actions.push({ action: 'sign_agency', label: 'Ký phía đại lý', variant: 'primary' })
      }
      if (!chuKyChuNha) {
        // ChuNha ký — gating done in HopDongKyGuiPage by checking role
        actions.push({ action: 'sign_owner', label: 'Ký phía chủ nhà', variant: 'primary' })
      }
      break

    case HOP_DONG_STATUS.DA_KY:
      if (isAdminOrAgency) {
        actions.push({ action: 'extend', label: 'Gia hạn', variant: 'secondary' })
      }
      break

    default:
      break
  }

  // De-duplicate by action key
  const seen = new Set()
  return actions.filter((a) => {
    if (seen.has(a.action)) return false
    seen.add(a.action)
    return true
  })
}
