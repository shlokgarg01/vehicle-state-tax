import React, { useState } from 'react'
import { CForm } from '@coreui/react'
import TextInput from './Form/TextInput'
import Button from './Form/Button'
import SelectBox from './Form/SelectBox'
import DateSelector from './Form/DateSelector'

const filterItemStyle = { minWidth: 0, flex: '1 1 110px' }
const dateItemStyle = { flex: '0 0 118px', width: '118px', minWidth: '118px' }

const TaxOrderFilters = ({ onSearch, onClear, modeOptions, showAmountRefunded = true }) => {
  const [mobile, setMobile] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [mode, setMode] = useState('')
  const [isAmountRefunded, setIsAmountRefunded] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const buildFilters = () => {
    const updatedFilters = {}
    if (mobile) updatedFilters.mobileNumber = mobile
    if (vehicleNo) updatedFilters.vehicleNumber = vehicleNo
    if (mode) updatedFilters.category = mode
    if (showAmountRefunded && isAmountRefunded !== '') {
      updatedFilters.isAmountRefunded = isAmountRefunded === 'yes'
    }
    if (startDate) updatedFilters.startDate = startDate
    if (endDate) updatedFilters.endDate = endDate
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
    setStartDate('')
    setEndDate('')
    onClear()
  }

  return (
    <CForm onSubmit={handleSearch}>
      <div className="d-flex flex-wrap flex-lg-nowrap align-items-end gap-2 mb-3">
        <div style={filterItemStyle}>
          <SelectBox
            placeholder="Mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            id="mode"
            options={modeOptions}
            defaultOption="Mode"
          />
        </div>

        <div style={filterItemStyle}>
          <TextInput
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            id="mobile"
          />
        </div>

        <div style={filterItemStyle}>
          <TextInput
            placeholder="Vehicle Number"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            id="vehicleNo"
          />
        </div>

        {showAmountRefunded && (
          <div style={filterItemStyle}>
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
          </div>
        )}

        <div style={dateItemStyle}>
          <DateSelector
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            id="startDate"
            marginBottom
          />
        </div>

        <div style={dateItemStyle}>
          <DateSelector
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            id="endDate"
            marginBottom
          />
        </div>

        <div className="d-flex gap-2 flex-shrink-0 pb-1">
          <Button title="Search" type="submit" color="success" />
          <Button title="Clear" type="button" color="danger" onClick={handleClear} />
        </div>
      </div>
    </CForm>
  )
}

export default TaxOrderFilters
