/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { CRow, CCol, CForm } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import { getAllTaxes } from '../../actions/orderActions'
import Loader from '../../components/Loader/Loader'
import SelectBox from '../../components/Form/SelectBox'
import Constants from '../../utils/constants'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'
import Pagination from '../../components/Pagination/Pagination'
import TaxCard from './TaxCard.js'

const TaxSearch = () => {
  const dispatch = useDispatch()

  const [mobile, setMobile] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [mode, setMode] = useState('')
  const [filterStatus, _] = useState([
    Constants.ORDER_STATUS.CONFIRMED,
    Constants.ORDER_STATUS.CLOSED,
  ])

  const { loading, taxes = [], totalPages } = useSelector((state) => state.allTaxes || {})
  const { user } = useSelector((state) => state.user)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({})

  const handleSearch = (e) => {
    e.preventDefault()
    setHasSearched(true)
    const updatedFilters = {}
    if (mobile) updatedFilters.mobileNumber = mobile
    if (vehicleNo) updatedFilters.vehicleNumber = vehicleNo
    if (mode) updatedFilters.category = mode

    setFilters(updatedFilters)

    dispatch(
      getAllTaxes({
        ...updatedFilters,
        status: filterStatus,
        state: user?.states,
        page: 1,
        perPage: Constants.ITEMS_PER_PAGE,
      }),
    )
  }

  const handleClear = () => {
    setMobile('')
    setVehicleNo('')
    setMode('')
    setHasSearched(false)
    setFilters({})
    dispatch(
      getAllTaxes({
        page: 1,
        perPage: Constants.ITEMS_PER_PAGE,
        status: filterStatus,
        state: user?.states,
      }),
    )
  }

  useEffect(() => {
    dispatch(
      getAllTaxes({
        ...filters,
        status: filterStatus,
        page: 1,
        perPage: Constants.ITEMS_PER_PAGE,
        state: user?.states,
      }),
    )
  }, [dispatch, currentPage])

  const modeOptions = Object.entries(Constants.MODES).map(([key, value]) => ({
    value: key,
    label: removeUnderScoreAndCapitalize(value),
  }))

  return loading ? (
    <Loader />
  ) : (
    <div className="p-4">
      <CForm onSubmit={handleSearch}>
        <CRow className="mb-4 g-3">
          {/* Mode Select */}
          <CCol xs={12} lg={3}>
            <SelectBox
              placeholder="Mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              id="mode"
              options={modeOptions}
              defaultOption="Select Mode"
            />
          </CCol>

          {/* Mobile Number */}
          <CCol xs={12} lg={3}>
            <TextInput
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              id="mobile"
            />
          </CCol>

          {/* Vehicle Number */}
          <CCol xs={12} lg={3}>
            <TextInput
              placeholder="Enter Vehicle Number"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              id="vehicleNo"
            />
          </CCol>

          {/* Buttons */}
          <CCol xs={12} lg={3}>
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

      {hasSearched && taxes.map((tax) => <TaxCard key={tax._id} data={tax} />)}
      {hasSearched && taxes.length > 0 && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default TaxSearch
