import React from 'react'
import { CFormSelect, CFormLabel } from '@coreui/react'

export default function SelectBox({
  label,
  id,
  onChange,
  defaultOption,
  options = [],
  value,
  width,
  name,
  disabled = false,
  disableBottomMargin = false,
  errors = {},
}) {
  return (
    <>
      {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
      <CFormSelect
        disabled={disabled}
        className={`${disableBottomMargin ? '' : 'mb-2'} ${errors[id] ? 'border-danger' : ''}`}
        id={id}
        name={name}
        aria-label={label}
        onChange={onChange}
        style={{
          fontSize: '0.9rem',
          width: width || null,
        }}
        value={value}
      >
        {!value && <option value="">{defaultOption}</option>}
        {options.map((opt) => (
          <option key={opt.key || opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </CFormSelect>
      {errors[id] && (
        <div
          style={{
            fontSize: '0.9rem',
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
