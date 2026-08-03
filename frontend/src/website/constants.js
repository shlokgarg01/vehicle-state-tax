export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.vehiclestatetax.mobile'

export const HELPLINE = '01169310669'
export const WHATSAPP = '6367965873'
export const SUPPORT_EMAIL = 'support@vehiclestatetax.in'

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/tax-pay', label: 'Tax Pay' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

const ordinalSuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

/** Display date: 1st day of the previous calendar month (for legal pages). */
export const getLegalLastUpdatedLabel = () => {
  const now = new Date()
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const day = firstOfLastMonth.getDate()
  const month = firstOfLastMonth.toLocaleDateString('en-IN', { month: 'long' })
  const year = firstOfLastMonth.getFullYear()
  return `${day}${ordinalSuffix(day)} ${month} ${year}`
}
