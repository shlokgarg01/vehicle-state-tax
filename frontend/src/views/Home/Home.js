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
} from '@coreui/react'
import { getDashboardData } from '../../actions/dashboardAction'
import SelectBox from '../../components/Form/SelectBox'
import Button from '../../components/Form/Button'
const DashboardCard = ({ title, value }) => (
  <CCol sm={6} md={4} lg={3} className="mb-4">
    <CCard className="text-center shadow-sm border-0 h-100">
      <CCardBody>
        <div className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
          {title}
        </div>
        <h3 className="fw-semibold">{value ?? 0}</h3>
      </CCardBody>
    </CCard>
  </CCol>
)

const Home = () => {
  const dispatch = useDispatch()
  const { loading, data, error } = useSelector((state) => state.dashboard)

  const [filters, setFilters] = useState({
    filter: '',
  })

  const cards = [
    { title: 'Total Orders', value: data?.counts?.totalOrders },
    { title: 'Border Tax', value: data?.counts?.borderTax },
    { title: 'Road Tax', value: data?.counts?.roadTax },
    { title: 'All India Tax', value: data?.counts?.allIndiaTax },
    { title: 'All India Permit', value: data?.counts?.allIndiaPermit },
    { title: 'Loading Vehicle', value: data?.counts?.loadingVehicle },
    { title: 'Admins', value: data?.counts?.admin },
    { title: 'Users', value: data?.counts?.users },
    { title: 'Employees', value: data?.counts?.employees },
  ]

  const rangeOptions = [
    { label: 'Last 1 Day', value: '1d' },
    { label: 'Last 5 Days', value: '5d' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last Week', value: 'lastWeek' },
    { label: 'Last Month', value: 'lastMonth' },
  ]
  useEffect(() => {
    dispatch(getDashboardData(filters))
  }, [dispatch, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleReset = () => {
    setFilters({ filter: '' })
  }

  return (
    <CContainer fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Admin Dashboard</h2>
      </div>

      {/* Filters */}
      <CRow className="mb-3 align-items-end">
        <CCol md={3}>
          <SelectBox
            id="rangeType"
            name="rangeType"
            label="Select Range"
            value={filters.rangeType}
            onChange={handleFilterChange}
            options={rangeOptions}
            defaultOption="Select Range"
          />
        </CCol>
        <CCol md={3}>
          <Button onClick={handleReset} title="Reset Filters" color="danger"></Button>
        </CCol>
      </CRow>

      {/* Dashboard Stats */}
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
            <DashboardCard key={idx} title={card.title} value={card.value} />
          ))}
        </CRow>
      )}
    </CContainer>
  )
}

export default Home
