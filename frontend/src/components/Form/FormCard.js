import React, { useState } from 'react'
import { CCard, CCardHeader, CCardBody, CCardFooter, CContainer, CRow, CCol } from '@coreui/react'
import TextInput from './TextInput'
import SelectBox from './SelectBox'
import Button from './Button'
import Loader from '../Loader/Loader'

const FormCard = ({
  title,
  subtitle,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  columns = 1,
  className = '',
  fieldConfigs = [],
  formData,
  setFormData,
  initialFormData = {},
  errors = {}, // external errors if passed
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [localErrors, setLocalErrors] = useState({})

  const handlePasswordToggle = () => setShowPassword((prev) => !prev)

  const handleReset = () => {
    setFormData(initialFormData)
    setLocalErrors({})
  }

  const visibleFields = fieldConfigs.filter((field) => {
    if (!field.condition) return true
    const { name, value } = field.condition
    return formData[name] === value
  })

  const validateFields = () => {
    const newErrors = {}
    visibleFields.forEach(({ name, label, required, type }) => {
      const value = formData?.[name]

      if (required && (!value || value === '')) {
        newErrors[name] = `${label || name} is required`
      }

      if (type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
        newErrors[name] = 'Invalid email address'
      }

      if (type === 'number' && value !== '' && isNaN(value)) {
        newErrors[name] = `${label || name} must be a number`
      }
    })
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateFields()

    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors)
      return
    }

    setLocalErrors({})
    onSubmit(e)
  }

  const renderField = (field) => {
    const { name, label, type, options, required } = field

    const commonProps = {
      id: field.id || name,
      placeholder: field.placeholder || '',
      value: formData?.[name] || '',
      onChange: (e) =>
        setFormData({
          ...formData,
          [name]: type === 'number' ? +e.target.value : e.target.value,
        }),
      errors: errors?.[name] || localErrors?.[name],
      required,
    }

    switch (type) {
      case 'select':
        return <SelectBox key={name} label={label} options={options} {...commonProps} />
      case 'password':
        return (
          <TextInput
            key={name}
            label={label}
            type={showPassword ? 'text' : 'password'}
            showPasswordToggle
            togglePasswordVisibility={handlePasswordToggle}
            {...commonProps}
          />
        )
      case 'file':
        return (
          <div key={name} className="mb-3">
            <CFormLabel htmlFor={name}>{label}</CFormLabel>
            <input
              type="file"
              id={name}
              name={name}
              className="form-control"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [name]: e.target.files[0], // store the file object
                })
              }
            />
            {errors?.[name] && <div className="text-danger">{errors[name]}</div>}
          </div>
        )

      default:
        return <TextInput key={name} label={label} type={type || 'text'} {...commonProps} />
    }
  }

  return (
    <>
      {loading && (
        <div
          className="position-absolute top-0 bottom-0 start-0 end-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center rounded-2xl"
          style={{ zIndex: 10 }}
        >
          <Loader />
        </div>
      )}
      <CContainer className="d-flex justify-content-center px-3">
        <CCard
          className={`rounded-2xl w-100 position-relative ${className}`}
          style={{ maxWidth: '820px' }}
        >
          <CCardHeader className="bg-light rounded-top p-4">
            <h2 className="h5 mb-1">{title}</h2>
            {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
          </CCardHeader>

          <form onSubmit={handleSubmit}>
            <CCardBody>
              <CRow className="gy-3">
                {visibleFields.map((field) => (
                  <CCol key={field.name} xs={12} md={columns === 2 ? 6 : 12}>
                    {renderField(field)}
                  </CCol>
                ))}
              </CRow>
            </CCardBody>

            <CCardFooter className="d-flex flex-wrap justify-content-end gap-2 p-3">
              {/* <Button
                type="button"
                variant="outline"
                color="secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </Button> */}

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCancel()
                    handleReset()
                  }}
                  disabled={isSubmitting}
                  color="danger"
                >
                  {cancelLabel}
                </Button>
              )}

              <Button type="submit" disabled={isSubmitting} color="success">
                {isSubmitting ? (
                  <>
                    <Loader className="me-2" />
                    {submitLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </CCardFooter>
          </form>
        </CCard>
      </CContainer>
    </>
  )
}

export default FormCard
