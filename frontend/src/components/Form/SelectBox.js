import React from 'react'
import { CFormSelect, CFormLabel } from '@coreui/react'

export default function SelectBox({
  label,
  id,
  onChange,
  defaultOption,
  options,
  value,
  width,
  disabled = false,
  disableBottomMargin = false,
  errors = {},
}) {
  return (
    <>
      {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
      <CFormSelect
        disabled={disabled}
        className={`${disableBottomMargin ? '' : 'mb-2'} ${errors[id] && 'border-danger'}`}
        id={id}
        aria-label={label}
        onChange={onChange}
        style={{
<<<<<<< HEAD
          fontSize: '0.8rem',
=======
          fontSize: '0.9rem',
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
          width: width ? width : null,
        }}
        value={value}
      >
        <option value="">{defaultOption}</option>
        {options}
      </CFormSelect>
      {errors[id] && (
        <div
          style={{
<<<<<<< HEAD
            fontSize: '0.8rem',
=======
            fontSize: '0.9rem',
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
            marginBottom: '0.5rem',
          }}
          className="text-danger"
        >
          {errors[id]}
        </div>
      )}
    </>
  )
}
