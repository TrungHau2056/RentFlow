export function decodeJwtPayload(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonStr = atob(payload)
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

export function extractUserFromJwt(token, email) {
  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const scope = payload.scope || ''
  const role = scope.startsWith('ROLE_') ? scope.slice(5) : scope

  return {
    id: payload.jti || 0,
    hoTen: email?.split('@')[0] || 'User',
    email: email || payload.sub || '',
    role: role || 'KHACH_HANG',
    avatar: null,
  }
}
