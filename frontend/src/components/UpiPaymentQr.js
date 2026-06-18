import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { buildUpiPaymentUri } from '../helpers/upi'

const UpiPaymentQr = ({ upiId, amount, payeeName, note, size = 120 }) => {
  const uri = buildUpiPaymentUri({ upiId, amount, payeeName, note })
  if (!uri) return null

  return (
    <div className="text-center mt-2">
      <div
        className="d-inline-block p-2 bg-white rounded border"
        style={{ lineHeight: 0 }}
      >
        <QRCodeSVG value={uri} size={size} level="M" />
      </div>
      <div className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
        Scan to pay via UPI
      </div>
    </div>
  )
}

export default UpiPaymentQr
