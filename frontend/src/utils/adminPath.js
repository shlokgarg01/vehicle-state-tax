/** Prefix for admin dashboard routes (marketing site uses `/`). */
export const ADMIN_BASE = '/admin'

export const adminPath = (subpath = '/') => {
  if (subpath === '/' || subpath === '') return ADMIN_BASE
  const normalized = subpath.startsWith('/') ? subpath : `/${subpath}`
  return `${ADMIN_BASE}${normalized}`
}

/** Path segment for nested <Routes> under /admin/* (relative to admin layout). */
export const adminRelativePath = (fullPath) => {
  if (fullPath === ADMIN_BASE || fullPath === `${ADMIN_BASE}/`) return ''
  if (!fullPath.startsWith(`${ADMIN_BASE}/`)) return fullPath.replace(/^\//, '')
  return fullPath.slice(`${ADMIN_BASE}/`.length)
}

export default adminPath
