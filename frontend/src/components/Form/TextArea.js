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
<<<<<<< HEAD
<<<<<<< HEAD
        <CFormLabel htmlFor={id} style={{ fontSize: '0.8rem' }}>
=======
        <CFormLabel htmlFor={id} style={{ fontSize: '0.9rem' }}>
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
        <CFormLabel htmlFor={id} style={{ fontSize: '0.9rem' }}>
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
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
<<<<<<< HEAD
<<<<<<< HEAD
          fontSize: '0.8rem',
=======
          fontSize: '0.9rem',
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
          fontSize: '0.9rem',
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
          marginBottom: '1rem',
          ...style,
        }}
        text={subText}
        disabled={disabled}
      ></CFormTextarea>
    </>
  )
}
