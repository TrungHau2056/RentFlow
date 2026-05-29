export const ROLE_GROUPS = {
  ADMIN: 'ADMIN',
  FINANCE: 'FINANCE',
  LEGAL: 'LEGAL',
  AGENCY: 'AGENCY',
  BROKER: 'BROKER',
}

export const ROLE_ALIASES = {
  ADMIN: ROLE_GROUPS.ADMIN,
  ROLE_ADMIN: ROLE_GROUPS.ADMIN,
  QUAN_TRI_VIEN: ROLE_GROUPS.ADMIN,
  ROLE_QUAN_TRI_VIEN: ROLE_GROUPS.ADMIN,
  KE_TOAN: ROLE_GROUPS.FINANCE,
  ROLE_KE_TOAN: ROLE_GROUPS.FINANCE,
  NHAN_VIEN_KE_TOAN: ROLE_GROUPS.FINANCE,
  ROLE_NHAN_VIEN_KE_TOAN: ROLE_GROUPS.FINANCE,
  TU_VAN_PHAP_LUAT: ROLE_GROUPS.LEGAL,
  BO_PHAN_PHAP_LUAT: ROLE_GROUPS.LEGAL,
  ROLE_TU_VAN_PHAP_LUAT: ROLE_GROUPS.LEGAL,
  ROLE_BO_PHAN_PHAP_LUAT: ROLE_GROUPS.LEGAL,
  NHAN_VIEN_DAI_LY: ROLE_GROUPS.AGENCY,
  ROLE_NHAN_VIEN_DAI_LY: ROLE_GROUPS.AGENCY,
  MOI_GIOI: ROLE_GROUPS.BROKER,
  ROLE_MOI_GIOI: ROLE_GROUPS.BROKER,
}

export const ROLE_LABELS = {
  [ROLE_GROUPS.ADMIN]: 'Quản trị viên',
  [ROLE_GROUPS.FINANCE]: 'Nhân viên tài chính',
  [ROLE_GROUPS.LEGAL]: 'Nhân viên pháp luật',
  [ROLE_GROUPS.AGENCY]: 'Nhân viên đại lý',
  [ROLE_GROUPS.BROKER]: 'Môi giới',
}

export const ROLE_HOME_PATHS = {
  [ROLE_GROUPS.ADMIN]: '/admin',
  [ROLE_GROUPS.FINANCE]: '/admin/tien-dam-bao',
  [ROLE_GROUPS.LEGAL]: '/admin/phap-luat',
  [ROLE_GROUPS.AGENCY]: '/admin/bat-dong-san',
  [ROLE_GROUPS.BROKER]: '/admin/lich-xem-nha',
}

export const ROLE_ALLOWED_PATHS = {
  [ROLE_GROUPS.ADMIN]: ['/admin'],
  [ROLE_GROUPS.FINANCE]: ['/admin/tien-dam-bao', '/admin/hoa-hong', '/admin/bao-cao-thong-ke'],
  [ROLE_GROUPS.LEGAL]: ['/admin/phap-luat', '/admin/hop-dong-ky-gui', '/admin/hop-dong-thue'],
  [ROLE_GROUPS.AGENCY]: [
    '/admin/chu-nha',
    '/admin/khach-hang',
    '/admin/customers',
    '/admin/bat-dong-san',
    '/admin/hop-dong-ky-gui',
    '/admin/hop-dong-thue',
    '/admin/lich-khao-sat',
    '/admin/lich-xem-nha',
    '/admin/phan-cong-moi-gioi',
  ],
  [ROLE_GROUPS.BROKER]: ['/admin/khach-hang', '/admin/customers', '/admin/lich-xem-nha'],
}

export function normalizeInternalRole(role) {
  return ROLE_ALIASES[role] || null
}

export function isInternalAdminRole(role) {
  return Boolean(normalizeInternalRole(role))
}
