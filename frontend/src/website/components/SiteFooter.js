import React from 'react'
import { Link } from 'react-router-dom'
import { HELPLINE, WHATSAPP, SUPPORT_EMAIL } from '../constants'
import SiteLogo from './SiteLogo'

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="logo footer-logo">
            <SiteLogo className="site-logo-img--footer" />
          </div>
          <p className="footer-tagline">
            Vehicle State Tax helps users with vehicle tax payment, border tax, road tax, permit
            support, receipt search, and tax status services.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/tax-pay">Tax Pay</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div>
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/refund-cancellation">Refund &amp; Cancellation</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <span className="footer-line">Alwar, Rajasthan, India</span>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <a href={`tel:${HELPLINE}`}>Call: {HELPLINE}</a>
          <a href={`https://wa.me/91${WHATSAPP}`}>WhatsApp: {WHATSAPP}</a>
        </div>
      </div>
      <div className="footer-bottom">Copyright 2026 Vehicle State Tax. All rights reserved.</div>
    </div>
  </footer>
)

export default SiteFooter
