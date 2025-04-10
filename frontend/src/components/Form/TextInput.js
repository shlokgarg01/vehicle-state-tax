import React from 'react'
import { CFormInput, CFormLabel } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Colors from '../../utils/colors'

export default function TextInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  id,
  style = {},
  trailIconClick,
  bg_color,
  refVal,
  maxLength,
  errors = {},
  max_num = null,
  min_num = null,
  trailIcon = null,
  disabled = false,
  disableBottomMargin = false,
  showPasswordToggle = false,
  togglePasswordVisibility = () => {},
}) {
  const hasError = Boolean(errors[id])

  const baseInputStyle = {
    backgroundColor: disabled ? Colors.DISABLED_GRAY : bg_color || '#fff',
    fontSize: '1rem',
    border: hasError ? '1px solid #dc3545' : '1px solid #ced4da',
    borderRadius: 7,
    padding: '0.5rem 0.75rem',
    width: '100%',
    ...style,
  }

  return (
    <div className="w-100">
      {label && (
        <CFormLabel htmlFor={id} style={{ fontSize: '0.9rem' }}>
          {label}
        </CFormLabel>
      )}

      <div
        className="d-flex align-items-center"
        style={{
          position: 'relative',
          backgroundColor: bg_color || '#f8f9fa',
          borderRadius: 7,
        }}
      >
        <CFormInput
          id={id}
          ref={refVal}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          readOnly={disabled}
          max={max_num}
          min={min_num}
          style={{
            ...baseInputStyle,
            paddingRight: showPasswordToggle || trailIcon ? '3rem' : '0.75rem',
          }}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="btn btn-link position-absolute"
            style={{
              right: trailIcon ? '2rem' : '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.85rem',
              padding: 0,
            }}
          >
            {type === 'password' ? 'Show' : 'Hide'}
          </button>
        )}

        {trailIcon && (
          <button
            className="btn position-absolute"
            type="button"
            onClick={trailIconClick}
            style={{
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
            }}
          >
            <CIcon icon={trailIcon} style={{ fontSize: '1.1rem' }} />
          </button>
        )}
      </div>

      {hasError && (
        <div
          className="text-danger"
          style={{
            fontSize: '0.9rem',
            marginTop: '0.5rem',
            marginBottom: !disableBottomMargin ? '0.5rem' : 0,
          }}
        >
          {errors[id]}
        </div>
      )}
    </div>
  )
}
