import { CCol } from '@coreui/react'
import React from 'react'

export default function DataRow({ title, data }) {
  return (
    <CCol className="mb-2" style={{ fontSize: 14 }}>
      <strong>{title}:&nbsp;</strong>
      {data}
      <br />
    </CCol>
  )
}
