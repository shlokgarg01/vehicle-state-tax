import React from 'react'
import PageHero from '../components/PageHero'
import PlayStoreLink from '../components/PlayStoreLink'

const SERVICES = [
  ['Road Tax Payment', 'Pay state road tax online with instant confirmation.'],
  ['Border Tax', 'Border tax payment support for interstate commercial vehicles.'],
  ['All India Permit & Tax', 'Permit and all-India tax services through the mobile app.'],
  ['Loading Vehicle Tax', 'Tax payment for light, medium, and heavy goods vehicles.'],
  ['Tax Status Check', 'Track payment and order status from your account history.'],
  ['Payment History', 'Access past payments and receipts in the app.'],
]

const ServicesPage = () => (
  <>
    <PageHero
      title="Products & Services"
      subtitle="Digital vehicle tax and related services for owners and operators across India."
    />
    <section>
      <div className="container grid-3">
        {SERVICES.map(([title, text]) => (
          <div className="card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <PlayStoreLink />
      </div>
    </section>
  </>
)

export default ServicesPage
