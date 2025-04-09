// src/components/Form/SelectInput.jsx
import React from 'react'
import { CFormLabel, CFormSelect } from '@coreui/react'

const SelectInput = ({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  errors = {},
}) => {
  return (
    <div className="mb-3">
      {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
      <CFormSelect id={id} value={value} onChange={onChange} disabled={disabled} aria-label={label}>
        <option value="">{placeholder}</option>
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ),
        )}
      </CFormSelect>
      {errors[id] && <div className="text-danger">{errors[id]}</div>}
    </div>
  )
}

export default SelectInput
