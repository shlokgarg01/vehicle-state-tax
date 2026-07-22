import React, { useState } from 'react'
import { CForm } from '@coreui/react'
import TextInput from './Form/TextInput'
import Button from './Form/Button'
import SelectBox from './Form/SelectBox'
import DateSelector from './Form/DateSelector'
import Constants from '../utils/constants'
import { removeUnderScoreAndCapitalize } from '../helpers/strings'

const filterItemStyle = { minWidth: 0, flex: '1 1 110px' }
const dateItemStyle = { flex: '0 0 118px', width: '118px', minWidth: '118px' }

const PaymentPendingFilters = ({ onSearch, onClear, user, compact = false }) => {
  const [mobile, setMobile] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [mode, setMode] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const modeOptions =
    user?.categories?.length > 0
      ? Object.entries(Constants.MODES)
          .filter(([_, value]) => user.categories.includes(value))
          .map(([key, value]) => ({
            value: key,
            label: removeUnderScoreAndCapitalize(value),
          }))
      : Object.entries(Constants.MODES).map(([key, value]) => ({
          value: key,
          label: removeUnderScoreAndCapitalize(value),
        }))

  const buildFilters = () => {
    const filters = {}
    if (mobile.trim()) filters.mobileNumber = mobile.trim()
    if (vehicleNo.trim()) filters.vehicleNumber = vehicleNo.trim()
    if (mode) filters.category = mode
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate
    return filters
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(buildFilters())
  }

  const handleClear = () => {
    setMobile('')
    setVehicleNo('')
    setMode('')
    setStartDate('')
    setEndDate('')
    onClear()
  }

  return (
    <CForm onSubmit={handleSubmit} className={compact ? 'mb-3' : 'mb-4'}>
      <div className="d-flex flex-wrap flex-lg-nowrap align-items-end gap-2">
        <div style={filterItemStyle}>
          <SelectBox
            placeholder="Category"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            id="pending-filter-mode"
            options={modeOptions}
            defaultOption="Category"
          />
        </div>
        <div style={filterItemStyle}>
          <TextInput
            placeholder="Vehicle No."
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            id="pending-filter-vehicle"
          />
        </div>
        <div style={filterItemStyle}>
          <TextInput
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            id="pending-filter-mobile"
          />
        </div>
        <div style={dateItemStyle}>
          <DateSelector
            placeholder="From"
            value={startDate}
            id="pending-filter-start"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div style={dateItemStyle}>
          <DateSelector
            placeholder="To"
            value={endDate}
            id="pending-filter-end"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2">
          <Button btnSmall type="submit" title="Search" color="success" />
          <Button btnSmall type="button" title="Clear" color="secondary" onClick={handleClear} />
        </div>
      </div>
    </CForm>
  )
}

export default PaymentPendingFilters
