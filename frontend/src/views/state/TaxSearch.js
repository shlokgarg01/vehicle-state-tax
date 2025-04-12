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
import { removeUserScoreAndCapitalize } from '../../helpers/strings'
import Pagination from '../../components/Pagination/Pagination'
const TaxSearch = () => {
  const dispatch = useDispatch()

  const [mobile, setMobile] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [mode, setMode] = useState('')
  const {
    loading,
    taxes = [],
    error,
    count,
    totalPages,
    currentPage,
  } = useSelector((state) => state.allTaxes || {})
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    dispatch(getAllTaxes()) // fetch initial list
  }, [dispatch])

  const [filters, setFilters] = useState({})

  const handleSearch = (e) => {
    e.preventDefault()
    setHasSearched(true)
    const updatedFilters = {}
    if (mobile) updatedFilters.mobileNumber = mobile
    if (vehicleNo) updatedFilters.vehicleNumber = vehicleNo
    if (mode) updatedFilters.category = mode

    setFilters(updatedFilters)
    console.log('Filters being applied:', updatedFilters)

    dispatch(getAllTaxes({ ...updatedFilters, page: 1, perPage: 10 }))
  }

  const handlePageChange = (page) => {
    dispatch(getAllTaxes({ ...filters, page, perPage: 10 }))
  }
  console.log(taxes, totalPages)
  const handleClear = () => {
    setMobile('')
    setVehicleNo('')
    setMode('')
    setHasSearched(false)
    setFilters({})
    dispatch(getAllTaxes({ page: 1, perPage: 10 }))
  }
  useEffect(() => {
    dispatch(getAllTaxes({ page: 1, perPage: 10 }))
  }, [dispatch])

  const modeOptions = Object.entries(Constants.MODES).map(([key, value]) => ({
    value: key,
    label: removeUserScoreAndCapitalize(value),
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
              {count}
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
                    <CTableHeaderCell>S.N</CTableHeaderCell>
                    <CTableHeaderCell>State</CTableHeaderCell>
                    <CTableHeaderCell>Border</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle No.</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle Type</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Weight</CTableHeaderCell>
                    <CTableHeaderCell>Seat Capacity</CTableHeaderCell>
                    <CTableHeaderCell>Chassis No.</CTableHeaderCell>
                    <CTableHeaderCell>Mobile</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Tax Mode</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Is Completed</CTableHeaderCell>
                    <CTableHeaderCell>Tax From</CTableHeaderCell>
                    <CTableHeaderCell>Tax Upto</CTableHeaderCell>
                    <CTableHeaderCell>File</CTableHeaderCell>
                    <CTableHeaderCell>Order ID</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableHeaderCell>Updated At</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {taxes.map((item, index) => (
                    <CTableRow key={item._id || index}>
                      <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>

                      <CTableDataCell>{item.state}</CTableDataCell>
                      <CTableDataCell>{item.border || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.vehicleNumber}</CTableDataCell>
                      <CTableDataCell>{item.vehicleType || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.category || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.weight || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.seatCapacity || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.chasisNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.mobileNumber}</CTableDataCell>
                      <CTableDataCell>{item.amount}</CTableDataCell>
                      <CTableDataCell>{item.taxMode}</CTableDataCell>
                      <CTableDataCell>
                        <span
                          className={`badge bg-${item.status === 'active' ? 'success' : 'secondary'}`}
                        >
                          {item.status}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>{item.isCompleted ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell>
                        {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.fileUrl ? (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{item.orderId || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                      <CTableDataCell>{new Date(item.updatedAt).toLocaleString()}</CTableDataCell>
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default TaxSearch
