import React from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PlayStoreLink from '../components/PlayStoreLink'

const TaxPayPage = () => (
  <>
    <PageHero
      title="Pay Vehicle Tax"
      subtitle="Use the Vehicle State Tax mobile app to pay road tax, border tax, and related services securely."
    />
    <section className="content-section--wide">
      <div className="container content-block">
        <h2>Pay from the mobile app</h2>
        <p>
          Tax payment is completed in the <strong>Vehicle State Tax</strong> Android app. Download
          the app, sign in with OTP, select your tax type, and pay via UPI or payment gateway.
        </p>
        <div className="hero-actions" id="download" style={{ margin: '1.5rem 0' }}>
          <PlayStoreLink />
          <Link className="btn btn-outline btn-sm" to="/contact">
            Need help? Contact us
          </Link>
        </div>
        <h2>What you need</h2>
        <ul>
          <li>Vehicle number and mobile number registered in the app</li>
          <li>State, tax mode, and vehicle details as per your tax type</li>
          <li>UPI app or payment method for checkout</li>
        </ul>
      </div>
    </section>
  </>
)

export default TaxPayPage
