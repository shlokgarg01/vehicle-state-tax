import React from 'react'
import { CForm, CRow, CCol, CSpinner, CAlert } from '@coreui/react'
import TextInput from './TextInput'
import SelectBox from './SelectBox'
import Button from './Button'
import NoData from '../NoData'

const FilterSearchBar = ({
  fields = [],
  searchValues,
  setSearchValues,
  onSearch,
  onReset,
  error = {},
  cols = { default: 3, buttons: 2 },
  noDataMessage = '',
  loading = false,
  fetchError = '', // Add this prop to display API-related errors
}) => {
  const handleChange = (name, value) => {
    setSearchValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <CForm onSubmit={onSearch} className="mb-3">
        <CRow className="g-3 align-items-end">
          {fields.map((field, idx) => {
            const commonProps = {
              id: field.name,
              label: field.showLabel ? field.label : '',
              placeholder: field.placeholder || '',
              value: searchValues[field.name] || '',
              onChange: (e) => handleChange(field.name, e.target.value),
              errors: error,
            }

            return (
              <CCol xs={12} sm={6} md={4} lg={3} key={idx}>
                {field.type === 'select' ? (
                  <SelectBox {...commonProps} options={field.options || []} />
                ) : field.type === 'custom' ? (
                  field.render({
                    value: searchValues[field.name],
                    onChange: (val) => handleChange(field.name, val),
                    error: error[field.name],
                  })
                ) : (
                  <TextInput {...commonProps} type={field.type || 'text'} />
                )}
              </CCol>
            )
          })}

          <CCol sm={cols.buttons}>
            <Button
              title={loading ? <CSpinner size="sm" /> : 'Search'}
              type="submit"
              color="success"
              btnSmall
              fullWidth
              marginBottom
              disabled={loading}
            />
          </CCol>

          <CCol sm={cols.buttons}>
            <Button
              title="Reset"
              type="button"
              color="danger"
              btnSmall
              fullWidth
              marginBottom
              onClick={onReset}
              disabled={loading}
            />
          </CCol>
        </CRow>
      </CForm>

      {fetchError && (
        <CAlert color="danger" className="mt-2">
          {fetchError}
        </CAlert>
      )}

      {!loading && noDataMessage && <NoData title={noDataMessage} />}
    </>
  )
}

export default FilterSearchBar
