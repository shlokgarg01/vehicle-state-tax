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
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import { getAllTaxes } from '../../actions/orderActions'

const TaxSearch = () => {
  const dispatch = useDispatch()

  const [mobile, setMobile] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')

  const { loading, taxes = [], error } = useSelector((state) => state.allTaxes || {})

  useEffect(() => {
    dispatch(getAllTaxes()) // fetch initial list
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()

    const filters = {}
    if (mobile) filters.mobileNumber = mobile
    if (vehicleNo) filters.vehicleNumber = vehicleNo

    dispatch(getAllTaxes(filters))
  }

  const handleClear = () => {
    setMobile('')
    setVehicleNo('')
    dispatch(getAllTaxes()) // reset list
  }

  return (
    <div className="p-4">
      <CForm onSubmit={handleSearch}>
        <CRow className="mb-4 align-items-end">
          <CCol xs={12} md={4}>
            <TextInput
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              id="mobile"
            />
          </CCol>

          <CCol xs={12} md={4}>
            <TextInput
              label="Vehicle Number"
              placeholder="Enter Vehicle Number"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              id="vehicleNo"
            />
          </CCol>

          <CCol xs={12} md={4}>
            <CRow className="g-2">
              <CCol xs={12} sm={6}>
                <Button
                  title="Search"
                  type="submit"
                  color="success"
                  fullWidth
                  btnSmall
                  marginBottom
                  fullHeight
                />
              </CCol>
              <CCol xs={12} sm={6}>
                <Button
                  title="Clear"
                  type="button"
                  color="danger"
                  fullWidth
                  btnSmall
                  marginBottom
                  fullHeight
                  onClick={handleClear}
                />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CForm>

      {/* Error / Loading */}
      {error && <div className="text-danger mb-3 text-center fw-semibold">{error}</div>}
      {loading ? (
        <div className="text-center fw-bold">Loading...</div>
      ) : (
        <CTable hover responsive bordered>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>State</CTableHeaderCell>
              <CTableHeaderCell>Border</CTableHeaderCell>
              <CTableHeaderCell>Vehicle No.</CTableHeaderCell>
              <CTableHeaderCell>Vehicle Type</CTableHeaderCell>
              <CTableHeaderCell>Category</CTableHeaderCell>
              <CTableHeaderCell>Weight</CTableHeaderCell>
              <CTableHeaderCell>Seat Capacity</CTableHeaderCell>
              <CTableHeaderCell>Chasis No.</CTableHeaderCell>
              <CTableHeaderCell>Mobile</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Tax Mode</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Is Completed</CTableHeaderCell>
              <CTableHeaderCell>Tax Period</CTableHeaderCell>
              <CTableHeaderCell>File</CTableHeaderCell>

              <CTableHeaderCell>Order ID</CTableHeaderCell>

              <CTableHeaderCell>Created At</CTableHeaderCell>
              <CTableHeaderCell>Updated At</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {taxes.length > 0 ? (
              taxes.map((item, index) => (
                <CTableRow key={item._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.state}</CTableDataCell>
                  <CTableDataCell>{item.border || '—'}</CTableDataCell>
                  <CTableDataCell>{item.vehicleNumber}</CTableDataCell>
                  <CTableDataCell>{item.vehicleType || '—'}</CTableDataCell>
                  <CTableDataCell>{item.category || '—'}</CTableDataCell>
                  <CTableDataCell>{item.weight || '—'}</CTableDataCell>
                  <CTableDataCell>{item.seatCapacity || '—'}</CTableDataCell>
                  <CTableDataCell>{item.chasisNumber || '—'}</CTableDataCell>
                  <CTableDataCell>{item.mobileNumber}</CTableDataCell>
                  <CTableDataCell>{item.amount}</CTableDataCell>
                  <CTableDataCell>{item.taxMode}</CTableDataCell>
                  <CTableDataCell>{item.status || '—'}</CTableDataCell>
                  <CTableDataCell>{item.isCompleted ? 'Yes' : 'No'}</CTableDataCell>
                  <CTableDataCell>
                    {item.startDate ? new Date(item.startDate).toLocaleDateString() : '—'} to{' '}
                    {item.endDate ? new Date(item.endDate).toLocaleDateString() : '—'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.fileUrl ? (
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    ) : (
                      '—'
                    )}
                  </CTableDataCell>
                 
                  <CTableDataCell>{item.orderId || '—'}</CTableDataCell>
                
                  <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>{new Date(item.updatedAt).toLocaleString()}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="21" className="text-center text-danger">
                  No data found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      )}
    </div>
  )
}

export default TaxSearch
