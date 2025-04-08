import { CFormLabel } from '@coreui/react'
import React from 'react'

<<<<<<< HEAD
export default function DateSelector({ value, onChange, label, id, errors }) {
=======
export default function DateSelector({ value, onChange, label, id, errors, disableBottomMargin }) {
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
  return (
    <>
      {label && (
        <>
<<<<<<< HEAD
          <CFormLabel htmlFor={id} style={{ fontSize: '0.8rem' }}>
=======
          <CFormLabel htmlFor={id} style={{ fontSize: '0.9rem' }}>
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
            {label}
          </CFormLabel>
          <br />
        </>
      )}
      <input type="date" value={value} onChange={onChange} className="date-selector" />
      {errors[id] && (
        <div
          style={{
<<<<<<< HEAD
            fontSize: '0.8rem',
=======
            fontSize: '0.9rem',
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
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
