import React from 'react'
import PageHero from '../components/PageHero'
import PlayStoreLink from '../components/PlayStoreLink'

const AboutPage = () => (
  <>
    <PageHero
      title="About Us"
      subtitle="Trusted digital vehicle tax services for Indian vehicle owners and transport operators."
    />
    <section className="content-section--wide">
      <div className="container content-block">
        <p>
          <strong>Vehicle State Tax</strong> has been helping users with vehicle tax payment,
          border tax, road tax, permit support, receipt search, and tax status services since 2019.
        </p>
        <p>
          The application and the owner of the app do not represent a government entity. The app
          provides support and information related to official vehicle tax processes. For issues or
          feedback, contact us anytime via helpline or WhatsApp.
        </p>
        <h2>Why choose us</h2>
        <ul>
          <li>Professional service flow inspired by government digital portals</li>
          <li>Fast processing with instant confirmation screens</li>
          <li>Clear customer support for payment and status questions</li>
          <li>Save time — avoid repeated office visits for core tasks</li>
        </ul>
        <div className="hero-actions" style={{ marginTop: '1rem' }}>
          <PlayStoreLink />
        </div>
      </div>
    </section>
  </>
)

export default AboutPage
