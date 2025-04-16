// ignore this page
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
  CContainer,
  CFormSelect,
  CButton,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import { getDashboardData } from '../../actions/dashboardAction'

const Home = () => {
  const dispatch = useDispatch()
  const { loading, data, error } = useSelector((state) => state.dashboard)

  const [filters, setFilters] = useState({
    month: '',
    year: '',
    date: '',
    rangeType: '',
  })

  // Fetch dashboard data when filters change
  useEffect(() => {
    dispatch(getDashboardData(filters))
  }, [dispatch, filters])

  // Handle select & input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target

    if (name === 'rangeType' && value) {
      setFilters({
        rangeType: value,
        month: '',
        year: '',
        date: '',
      })
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
        ...(name !== 'rangeType' && { rangeType: '' }),
      }))
    }
  }

  // Clear all filters
  const handleReset = () => {
    setFilters({ month: '', year: '', date: '', rangeType: '' })
  }
  console.log(data)
  const cards = [
    { title: 'Total Taxes', value: data?.counts?.taxes },
    { title: 'Seat Types', value: data?.seatTypes },
    { title: 'States', value: data?.states },
    { title: 'Monthly Taxes', value: data?.monthlyTaxes },
    { title: 'Yearly Taxes', value: data?.yearlyTaxes },
    { title: 'Admins', value: data?.adminCount },
    { title: 'Users', value: data?.counts?.users },
    { title: 'Add Now', value: data?.addNow },
  ]
  console.log('Cards:', cards)
  console.log(data) // logs {} because action.payload = undefined

  return (
    <CContainer fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Admin Dashboard</h2>
      </div>

      {/* Filters */}
      <CRow className="mb-3 align-items-end">
        <CCol md={3}>
          <CFormLabel htmlFor="month">Filter by Month</CFormLabel>
          <CFormSelect id="month" name="month" value={filters.month} onChange={handleFilterChange}>
            <option value="">All Months</option>
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((monthName, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={3}>
          <CFormLabel htmlFor="rangeType">Quick Date Range</CFormLabel>
          <CFormSelect
            id="rangeType"
            name="rangeType"
            value={filters.rangeType}
            onChange={handleFilterChange}
          >
            <option value="">Select Range</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
          </CFormSelect>
        </CCol>

        <CCol md={3}>
          <CFormLabel htmlFor="year">Filter by Year</CFormLabel>
          <CFormSelect id="year" name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">All Years</option>
            {[2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={3}>
          <CFormLabel htmlFor="date">Filter by Specific Date</CFormLabel>
          <CFormInput
            type="date"
            id="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </CCol>

        <CCol md={3}>
          <CButton color="secondary" className="w-100" onClick={handleReset}>
            Reset Filters
          </CButton>
        </CCol>
      </CRow>

      {/* Dashboard Data */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '50vh' }}
        >
          <CSpinner color="primary" size="lg" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <CRow>
          {cards.map((card, idx) => (
            <CCol sm={6} md={4} lg={3} key={idx} className="mb-4">
              <CCard className="text-center shadow-sm border-0 h-100">
                <CCardBody>
                  <div className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                    {card.title}
                  </div>
                  <h3 className="fw-semibold">{card.value ?? 0}</h3>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}
    </CContainer>
  )
}

export default Home
