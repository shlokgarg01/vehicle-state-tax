import React from 'react'
import PageHero from '../components/PageHero'
import { HELPLINE, WHATSAPP, SUPPORT_EMAIL } from '../constants'

const ContactPage = () => (
  <>
    <PageHero
      title="Contact Us"
      subtitle="We are here to help with payments, receipts, and tax status questions."
    />
    <section>
      <div className="container contact-grid">
        <div className="contact-card">
          <h3>Customer support</h3>
          <p>
            <strong>Email:</strong> <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
          <p>
            <strong>Helpline:</strong> <a href={`tel:${HELPLINE}`}>{HELPLINE}</a>
          </p>
          <p>
            <strong>WhatsApp / SMS:</strong>{' '}
            <a href={`https://wa.me/91${WHATSAPP}`}>{WHATSAPP}</a>
          </p>
        </div>
        <div className="contact-card">
          <h3>Office</h3>
          <p>Alwar, Rajasthan, India</p>
          <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
            For payment issues, share your vehicle number and order ID on WhatsApp for faster
            support.
          </p>
        </div>
      </div>
    </section>
  </>
)

export default ContactPage
