import { CFormLabel } from '@coreui/react'
import React from 'react'

export default function DateSelector({
  value,
  onChange,
  label,
  id,
  errors,
  disableBottomMargin,
  marginBottom,
}) {
  return (
    <>
      {label && (
        <>
          <CFormLabel
            htmlFor={id}
            style={{ fontSize: '0.9rem' }}
            className={`${marginBottom ? 'mb-3' : ''}`}
          >
            {label}
          </CFormLabel>
          <br />
        </>
      )}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className={`date-selector ${marginBottom ? 'mb-2' : ''}`}
      />
      {errors && errors[id] && (
        <div
          style={{
            fontSize: '0.9rem',
            marginBottom: !disableBottomMargin ? '0.5rem' : 0,
            marginTop: '0.5rem',
          }}
          className="text-danger"
        >
          {errors[id]}
        </div>
      )}
    </>
  )
}
