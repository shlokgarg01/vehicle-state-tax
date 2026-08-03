import React from 'react'
import { HELPLINE, WHATSAPP } from '../constants'

const TopBar = () => (
  <div className="top-bar">
    <div className="container">
      Secure digital vehicle tax services · Call Helpline:{' '}
      <a href={`tel:${HELPLINE}`}>{HELPLINE}</a> · WhatsApp/SMS:{' '}
      <a href={`https://wa.me/91${WHATSAPP}`}>{WHATSAPP}</a>
    </div>
  </div>
)

export default TopBar
