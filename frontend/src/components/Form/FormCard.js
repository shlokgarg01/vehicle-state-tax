import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react'
import TextInput from './TextInput'
import SelectBox from './SelectBox'
import Button from './Button'
import Loader from '../Loader/Loader'
import { useId } from 'react'

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
  errors = {},
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [localErrors, setLocalErrors] = useState({})
  const uid = useId()

  const togglePassword = () => setShowPassword((prev) => !prev)

  const resetForm = () => {
    setFormData(initialFormData || {})
    setLocalErrors({})
  }

  const getFieldError = (name) => errors?.[name] || localErrors?.[name]

  // Support multiple conditions (AND logic)
  const isFieldVisible = (field) => {
    if (!field.condition) return true

    const conditions = Array.isArray(field.condition) ? field.condition : [field.condition]

    return conditions.every((cond) => {
      return formData[cond.name] === cond.value
    })
  }

  // Improved validation logic
  const validateFields = () => {
    const validationErrors = {}

    fieldConfigs.forEach((field) => {
      if (!isFieldVisible(field)) return

      const { name, label, required, type, validation = {} } = field
      const value = formData?.[name]

      if (required && (!value || value === '')) {
        validationErrors[name] = `${label || name} is required`
        return
      }

      if (type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
        validationErrors[name] = 'Invalid email address'
        return
      }

      if (type === 'number' && value !== '' && isNaN(value)) {
        validationErrors[name] = `${label || name} must be a number`
        return
      }

      if (validation.pattern && value && !validation.pattern.test(value)) {
        validationErrors[name] = validation.error || `${label || name} is invalid`
      }

      if (validation.minLength && value?.length < validation.minLength) {
        validationErrors[name] = validation.error || `${label || name} is too short`
      }

      if (validation.maxLength && value?.length > validation.maxLength) {
        validationErrors[name] = validation.error || `${label || name} is too long`
      }
    })

    return validationErrors
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    const {
      name,
      label,
      type = 'text',
      options,
      placeholder,
      required,
      renderComponent,
      getOptions,
    } = field

    const value = formData?.[name] || ''

    const commonProps = {
      id: `${uid}-${name}`,

      label,
      placeholder: placeholder || '',
      value,
      onChange: (e) => handleChange(name, type === 'number' ? +e.target.value : e.target.value),
      errors: getFieldError(name),
      required,
    }

    // If field has a custom render component
    if (renderComponent) {
      return renderComponent({ ...commonProps, formData, setFormData })
    }

    // Support dynamically generated select options
    const fieldOptions = getOptions ? getOptions(formData) : options || []

    switch (type) {
      case 'select':
        return <SelectBox key={name} options={fieldOptions} {...commonProps} />
      case 'password':
        return (
          <TextInput
            key={name}
            type={showPassword ? 'text' : 'password'}
            showPasswordToggle
            togglePasswordVisibility={togglePassword}
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
              onChange={(e) => handleChange(name, e.target.files[0])}
            />
            {getFieldError(name) && <div className="text-danger">{getFieldError(name)}</div>}
          </div>
        )
      default:
        return <TextInput key={name} type={type} {...commonProps} />
    }
  }

  const visibleFields = fieldConfigs.filter(isFieldVisible)

  return (
    <CContainer className="d-flex justify-content-center px-3">
      <CCard
        className={`rounded-2xl w-100 position-relative ${className}`}
        style={{ maxWidth: '820px' }}
      >
        {loading && <Loader />}

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
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onCancel()
                  resetForm()
                }}
                disabled={isSubmitting}
                color="danger"
              >
                {cancelLabel}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} color="success">
              {isSubmitting ? <>{submitLabel}</> : submitLabel}
            </Button>
          </CCardFooter>
        </form>
      </CCard>
    </CContainer>
  )
}

export default FormCard
