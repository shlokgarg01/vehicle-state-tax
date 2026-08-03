import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from '../components/TopBar'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import '../marketing.scss'

const PAGE_TITLES = {
  '/': 'Vehicle State Tax | Secure Road Tax Payment',
  '/services': 'Services | Vehicle State Tax',
  '/tax-pay': 'Tax Pay | Vehicle State Tax',
  '/about': 'About Us | Vehicle State Tax',
  '/contact': 'Contact Us | Vehicle State Tax',
  '/terms': 'Terms & Conditions | Vehicle State Tax',
  '/privacy': 'Privacy Policy | Vehicle State Tax',
  '/refund-cancellation': 'Refund & Cancellation Policy | Vehicle State Tax',
}

const MarketingLayout = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = PAGE_TITLES[pathname] || 'Vehicle State Tax'
  }, [pathname])

  return (
    <div className="marketing-site">
      <TopBar />
      <SiteHeader />
      <main className="site-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export default MarketingLayout
