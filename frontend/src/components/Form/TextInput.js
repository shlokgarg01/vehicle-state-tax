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
  id,
  style,
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
}) {
  return (
    <>
      {trailIcon ? (
        <>
          <div
            className="input-group"
            style={{
              ...style,
              borderRadius: 7,
              paddingRight: 5,
              outline: 'none',
            }}
          >
            <CFormInput
              id={id}
              type={type}
              placeholder={placeholder}
              aria-label="sm input"
              value={value}
              onChange={onChange}
              readOnly={disabled}
              ref={refVal}
              maxLength={maxLength}
              style={{
                backgroundColor: disabled ? Colors.DISABLED_GRAY : null,
                fontSize: '0.4rem',
                marginBottom: 0,
                ...style,
                border: 0,
              }}
              className="custom-input"
            />
            <span className="input-group-append">
              <button className="btn" type="button" onClick={trailIconClick}>
                <CIcon icon={trailIcon} />
              </button>
            </span>
          </div>
          {errors[id] && (
            <div
              style={{
                fontSize: '0.8rem',
              }}
              className="text-danger"
            >
              {errors[id]}
            </div>
          )}
        </>
      ) : (
        <>
          {label && (
            <CFormLabel htmlFor={id} style={{ fontSize: '0.8rem' }}>
              {label}
            </CFormLabel>
          )}
          <CFormInput
            id={id}
            ref={refVal}
            type={type}
            placeholder={placeholder}
            aria-label="sm input"
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className={`${errors[id] && 'border-danger'}`}
            style={{
              fontSize: '0.8rem',
              backgroundColor: disabled ? Colors.DISABLED_GRAY : null,
              marginBottom: !disableBottomMargin && !errors[id] ? '1rem' : 0,
              ...style,
            }}
            readOnly={disabled}
            max={max_num}
            min={min_num}
          />
          {errors[id] && (
            <div
              style={{
                fontSize: '0.8rem',
                marginBottom: !disableBottomMargin ? '0.5rem' : 0,
                marginTop: '0.5rem',
              }}
              className="text-danger"
            >
              {errors[id]}
            </div>
          )}
        </>
      )}
    </>
  )
}
