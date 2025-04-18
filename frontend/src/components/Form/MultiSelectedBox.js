import { CFormLabel } from '@coreui/react'
import React from 'react'
import Select from 'react-select'

export default function MultiSelectedBox({
  label,
  id,
  options,
  value,
  onChange,
  placeholder,
  isMultiSelect,
  isSearchable,
  disable = false,
  noOptionsMessage = () => {
    'Nothing found'
  },
}) {
  return (
    <div className="w-100">
      {label && (
        <CFormLabel htmlFor={id} style={{ fontSize: '0.9rem' }}>
          {label}
        </CFormLabel>
      )}
      <Select
        defaultValue={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        isMulti={isMultiSelect}
        isSearchable={isSearchable}
        noOptionsMessage={noOptionsMessage}
        isDisabled={disable}
      />
    </div>
  )
}
