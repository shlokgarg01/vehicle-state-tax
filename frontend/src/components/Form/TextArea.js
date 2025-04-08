import React from 'react'
import { CFormLabel, CFormTextarea } from '@coreui/react'

export default function TextArea({
  label,
  placeholder,
  value,
  onChange,
  id,
  style,
  rows = 4,
  subText = '',
  disabled = false,
}) {
  return (
    <>
      {label && (
        <CFormLabel htmlFor={id} style={{ fontSize: '0.9rem' }}>
          {label}
        </CFormLabel>
      )}
      <CFormTextarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          fontSize: '0.9rem',
          marginBottom: '1rem',
          ...style,
        }}
        text={subText}
        disabled={disabled}
      ></CFormTextarea>
    </>
  )
}
