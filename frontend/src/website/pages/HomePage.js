import React from 'react'
import { Link } from 'react-router-dom'
import PlayStoreLink from '../components/PlayStoreLink'

const FEATURES = [
  ['Tax Payment', 'Pay applicable state and road tax with a guided digital flow.'],
  ['Digital Receipt', 'Receive clear payment confirmation and downloadable receipt layout.'],
  ['Status Check', 'Check tax status using your vehicle number and owner details.'],
  ['Secure Payment', 'UPI and payment gateway options designed for safe transactions.'],
  ['Smart Reminders', 'Get tax due alerts, digital receipts, and history in the mobile app.'],
  ['Online Support', 'Helpline and WhatsApp support for payment and status questions.'],
]

const STEPS = [
  ['Enter Details', 'Add vehicle number, owner name, state, and vehicle type.'],
  ['Review Tax', 'Confirm the payable amount and selected tax service.'],
  ['Pay Securely', 'Choose UPI or payment gateway to complete payment.'],
  ['Get Receipt', 'View success confirmation and keep your payment receipt.'],
]

const HomePage = () => (
  <>
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="hero-badge">Fast, trusted, mobile-first tax service</span>
          <h1>Vehicle State Tax</h1>
          <p className="hero-lead">
            Pay state vehicle tax, road tax, and track payment status from one secure mobile
            application built for Indian vehicle owners and transport operators.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-sm" to="/tax-pay">
              Pay Tax Now
            </Link>
            <PlayStoreLink />
          </div>
        </div>
        <div className="hero-card">
          <h3>Current Tax Summary</h3>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Vehicle No. MH 12 AB 1234</p>
          <p className="amount">₹ 4,850</p>
          <ul className="check-list">
            <li>
              <strong>Road Tax</strong> — Due Today
            </li>
            <li>
              <strong>Payment Security</strong> — Verified
            </li>
            <li>
              <strong>Receipt</strong> — Instant
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section className="alt">
      <div className="container">
        <div className="section-title">
          <h2>Features Built For Everyday Vehicle Tax Needs</h2>
          <p>
            Simple, secure, and quick tools for private owners, commercial operators, and frequent
            interstate travelers.
          </p>
        </div>
        <div className="grid-3">
          {FEATURES.map(([title, text]) => (
            <div className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section>
      <div className="container">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>Complete your vehicle tax payment in a few guided steps.</p>
        </div>
        <div className="steps" style={{ maxWidth: 640, margin: '0 auto' }}>
          {STEPS.map(([title, text], i) => (
            <div className="step" key={title}>
              <span className="step-num">{i + 1}</span>
              <div>
                <strong>{title}</strong>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)' }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="alt">
      <div className="container">
        <div className="stat-grid">
          <div className="stat">
            <strong>24×7</strong> App access
          </div>
          <div className="stat">
            <strong>Secure</strong> Digital payments
          </div>
          <div className="stat">
            <strong>100%</strong> Digital receipt
          </div>
        </div>
      </div>
    </section>

    <section>
      <div className="container">
        <div className="section-title">
          <h2>FAQ</h2>
        </div>
        <div className="faq" style={{ maxWidth: 720, margin: '0 auto' }}>
          <details>
            <summary>Can I pay tax for any state?</summary>
            <p style={{ color: 'var(--muted)', margin: '0.75rem 0 0' }}>
              The app supports state selection during payment. Availability depends on supported
              state integrations and service rules.
            </p>
          </details>
          <details>
            <summary>Which payment methods are supported?</summary>
            <p style={{ color: 'var(--muted)', margin: '0.75rem 0 0' }}>
              UPI and secure payment gateway options are included in the payment flow.
            </p>
          </details>
          <details>
            <summary>Do I get a receipt?</summary>
            <p style={{ color: 'var(--muted)', margin: '0.75rem 0 0' }}>
              Yes. The payment flow shows a success confirmation and receipt after payment.
            </p>
          </details>
        </div>
      </div>
    </section>
  </>
)

export default HomePage
