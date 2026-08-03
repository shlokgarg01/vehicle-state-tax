import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import './scss/style.scss'
import 'react-toastify/dist/ReactToastify.css'

const MarketingLayout = React.lazy(() => import('./website/layout/MarketingLayout'))
const HomePage = React.lazy(() => import('./website/pages/HomePage'))
const ServicesPage = React.lazy(() => import('./website/pages/ServicesPage'))
const TaxPayPage = React.lazy(() => import('./website/pages/TaxPayPage'))
const AboutPage = React.lazy(() => import('./website/pages/AboutPage'))
const ContactPage = React.lazy(() => import('./website/pages/ContactPage'))
const TermsPage = React.lazy(() => import('./website/pages/TermsPage'))
const PrivacyPage = React.lazy(() => import('./website/pages/PrivacyPage'))
const RefundCancellationPage = React.lazy(() => import('./website/pages/RefundCancellationPage'))
const AdminApp = React.lazy(() => import('./AdminApp'))

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="tax-pay" element={<TaxPayPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="refund-cancellation" element={<RefundCancellationPage />} />
        </Route>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)

export default App
