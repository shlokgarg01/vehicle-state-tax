import React, { useState } from 'react'
import { CRow, CCol, CForm } from '@coreui/react'
import TextInput from './Form/TextInput'
import Button from './Form/Button'
import SelectBox from './Form/SelectBox'

const TaxOrderFilters = ({ onSearch, onClear, modeOptions }) => {
  const [mobile, setMobile] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [mode, setMode] = useState('')
  const [isAmountRefunded, setIsAmountRefunded] = useState('')

  const buildFilters = () => {
    const updatedFilters = {}
    if (mobile) updatedFilters.mobileNumber = mobile
    if (vehicleNo) updatedFilters.vehicleNumber = vehicleNo
    if (mode) updatedFilters.category = mode
    if (isAmountRefunded !== '') {
      updatedFilters.isAmountRefunded = isAmountRefunded === 'yes'
    }
    return updatedFilters
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(buildFilters())
  }

  const handleClear = () => {
    setMobile('')
    setVehicleNo('')
    setMode('')
    setIsAmountRefunded('')
    onClear()
  }

  return (
    <CForm onSubmit={handleSearch}>
      <CRow className="mb-4 g-3">
        <CCol xs={12} lg={2}>
          <SelectBox
            placeholder="Mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            id="mode"
            options={modeOptions}
            defaultOption="Mode"
          />
        </CCol>

        <CCol xs={12} lg={2}>
          <TextInput
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            id="mobile"
          />
        </CCol>

        <CCol xs={12} lg={2}>
          <TextInput
            placeholder="Vehicle Number"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            id="vehicleNo"
          />
        </CCol>

        <CCol xs={12} lg={2}>
          <SelectBox
            placeholder="Amount Refunded"
            value={isAmountRefunded}
            onChange={(e) => setIsAmountRefunded(e.target.value)}
            id="isAmountRefunded"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            defaultOption="Amount Refunded"
          />
        </CCol>

        <CCol xs={12} lg={4}>
          <CRow className="g-2">
            <CCol xs={6}>
              <Button title="Search" type="submit" color="success" fullWidth fullHeight />
            </CCol>
            <CCol xs={6}>
              <Button
                title="Clear"
                type="button"
                color="danger"
                fullWidth
                fullHeight
                onClick={handleClear}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default TaxOrderFilters
