/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CForm,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import { getAllTaxes } from '../../actions/orderActions'
import NoData from '../../components/NoData'
import Loader from '../../components/Loader/Loader'
import SelectBox from '../../components/Form/SelectBox'
import Constants from '../../utils/constants'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'
import Pagination from '../../components/Pagination/Pagination'
import { getDateFromDateString } from '../../helpers/Date'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

const TaxSearch = () => {
  const dispatch = useDispatch()

  const [mobile, setMobile] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [mode, setMode] = useState('')
  const [filterStatus, _] = useState([
    Constants.ORDER_STATUS.CONFIRMED,
    Constants.ORDER_STATUS.CLOSED,
  ])

  const {
    loading,
    taxes = [],
    error,
    totalPages,
    totalTaxes,
  } = useSelector((state) => state.allTaxes || {})
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
    dispatch(getAllTaxes({ page: 1, perPage: Constants.ITEMS_PER_PAGE, status: filterStatus }))
  }

  useEffect(() => {
    dispatch(
      getAllTaxes({ ...filters, status: filterStatus, page: 1, perPage: Constants.ITEMS_PER_PAGE }),
    )
  }, [dispatch, currentPage])

  const modeOptions = Object.entries(Constants.MODES).map(([key, value]) => ({
    value: key,
    label: removeUnderScoreAndCapitalize(value),
  }))

  return (
    <div className="p-4">
      <CForm onSubmit={handleSearch}>
        <CRow className="mb-4 g-3 align-items-end">
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
                <Button
                  title="Search"
                  type="submit"
                  color="success"
                  fullWidth
                  btnSmall
                  fullHeight
                />
              </CCol>
              <CCol xs={6}>
                <Button
                  title="Clear"
                  type="button"
                  color="danger"
                  fullWidth
                  btnSmall
                  fullHeight
                  onClick={handleClear}
                />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CForm>

      {/* Error / Loading */}
      {hasSearched && (
        <CCard>
          <CCardHeader>
            <strong>
              Tax Entry List {(currentPage - 1) * 10 + 1}–{(currentPage - 1) * 10 + taxes.length} of{' '}
              {totalTaxes}
            </strong>
          </CCardHeader>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-danger text-center fw-semibold py-3">{error}</div>
          ) : taxes.length === 0 ? (
            <NoData title="No Tax Entries Found" />
          ) : (
            <CCardBody>
              <CTable striped hover responsive className="table-sm compact-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>S.No</CTableHeaderCell>
                    <CTableHeaderCell>State</CTableHeaderCell>
                    <CTableHeaderCell>Border</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle No.</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Seat Capacity</CTableHeaderCell>
                    <CTableHeaderCell>Mobile</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Tax Mode</CTableHeaderCell>
                    <CTableHeaderCell>Tax From</CTableHeaderCell>
                    <CTableHeaderCell>Tax Upto</CTableHeaderCell>
                    <CTableHeaderCell>File</CTableHeaderCell>
                    <CTableHeaderCell>Created</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {taxes.map((item, index) => (
                    <CTableRow key={item._id || index}>
                      <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>

                      <CTableDataCell>
                        {item.state ? removeUnderScoreAndCapitalize(item?.state) : null}
                      </CTableDataCell>
                      <CTableDataCell>{item.border || '-'}</CTableDataCell>
                      <CTableDataCell>{item.vehicleNumber}</CTableDataCell>
                      <CTableDataCell>
                        {removeUnderScoreAndCapitalize(item.category) || '-'}
                      </CTableDataCell>
                      <CTableDataCell>{item.seatCapacity || '-'}</CTableDataCell>
                      <CTableDataCell>{item.mobileNumber}</CTableDataCell>
                      <CTableDataCell>{item.amount}</CTableDataCell>
                      <CTableDataCell>{removeUnderScoreAndCapitalize(item.taxMode)}</CTableDataCell>
                      <CTableDataCell>
                        {item.startDate ? getDateFromDateString(item.startDate) : '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.endDate ? getDateFromDateString(item.endDate) : '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.fileUrl ? (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                            <CIcon icon={cilCloudDownload} className="me-2" />
                          </a>
                        ) : (
                          '-'
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{getDateFromDateString(item.createdAt)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          )}
        </CCard>
      )}
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
