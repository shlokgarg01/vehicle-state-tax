/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CWidgetStatsA, CCol, CRow, CSpinner, CContainer } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { getDashboardData } from '../../actions/dashboardAction'
import SelectBox from '../../components/Form/SelectBox'
import Button from '../../components/Form/Button'
import DateSelector from '../../components/Form/DateSelector'

const getRandomNumbers = () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * (79 - 40 + 1)) + 40)

const DashboardCard = ({ title, value, color }) => {
  const widgetChartRef1 = useRef(null)

  return (
    <CCol sm={6} md={4} lg={3} className="mb-4">
      <CWidgetStatsA
        color={color}
        value={
          <>
            {value} <div className="fs-8 fw-normal">{title}</div>
          </>
        }
        chart={
          <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '70px' }}
            data={{
              labels: ['', '', '', '', '', '', ''],
              datasets: [
                {
                  label: '',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: getStyle(`--cui-${color}`),
                  data: getRandomNumbers(),
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  min: 30,
                  max: 89,
                  display: false,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                  tension: 0.4,
                },
                point: {
                  radius: 4,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }}
          />
        }
      />
    </CCol>
  )
}

const Home = () => {
  const dispatch = useDispatch()
  const { loading, data, error } = useSelector((state) => state.dashboard)

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getStartEndDate = (daysBefore = 0, end = new Date()) => {
    let end_date = formatDate(end)
    let start_date = formatDate(new Date(new Date().setDate(new Date().getDate() - daysBefore)))
    return { start_date, end_date }
  }

  const initial_filters = {
    startDate: formatDate(new Date(new Date().setDate(new Date().getDate() - 30))),
    endDate: formatDate(new Date()),
  }

  const [startDate, setStartDate] = useState(initial_filters.startDate)
  const [endDate, setEndDate] = useState(initial_filters.endDate)

  const cards = [
    { title: 'Total Orders', value: data?.counts?.totalOrders, color: 'primary' },
    { title: 'Total Amount', value: data?.counts?.totalAmount, color: 'success' },
    { title: 'Total Commission', value: data?.counts?.totalCommission, color: 'info' },
    { title: 'Border Tax', value: data?.counts?.borderTax, color: 'warning' },
    { title: 'Road Tax', value: data?.counts?.roadTax, color: 'secondary' },
    { title: 'All India Tax', value: data?.counts?.allIndiaTax, color: 'info' },
    { title: 'All India Permit', value: data?.counts?.allIndiaPermit, color: 'danger' },
    { title: 'Loading Vehicle', value: data?.counts?.loadingVehicle, color: 'success' },
    { title: 'Users', value: data?.counts?.users, color: 'dark' },
    { title: 'Employees', value: data?.counts?.employees, color: 'primary' },
  ]

  const rangeOptions = [
    { label: 'Last 1 Day', value: 0 },
    { label: 'Last 5 Days', value: 4 },
    { label: 'Last 7 Days', value: 6 },
    { label: 'Last 30 Days', value: 29 },
  ]

  const handleSubmit = () => {
    dispatch(getDashboardData({ startDate, endDate }))
  }

  const handleFilterChange = (e) => {
    let startEndDate = getStartEndDate(e.target.value)
    setStartDate(startEndDate.start_date)
    setEndDate(startEndDate.end_date)
  }

  useEffect(() => {
    handleSubmit()
  }, [])

  return (
    <CContainer fluid className="py-4">
      {/* Filters */}
      <CRow className="mb-3">
        <CCol md={3}>
          <SelectBox
            id="rangeType"
            name="rangeType"
            onChange={handleFilterChange}
            options={rangeOptions}
            defaultOption="Select Range"
          />
        </CCol>
        <CCol md={2}>
          <DateSelector
            placeholder="Start Date"
            value={startDate}
            id="startDate"
            onChange={(e) => setStartDate(e.target.value)}
            marginBottom
          />
        </CCol>
        <CCol md={2}>
          <DateSelector
            placeholder="End Date"
            value={endDate}
            id="startDate"
            onChange={(e) => setEndDate(e.target.value)}
            marginBottom
          />
        </CCol>
        <CCol md={2}>
          <Button
            marginBottom
            fullWidth
            btnSmall
            onClick={handleSubmit}
            title="Search"
            color="success"
          ></Button>
        </CCol>
      </CRow>

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
            <DashboardCard key={idx} title={card.title} value={card.value} color={card.color} />
          ))}
        </CRow>
      )}
    </CContainer>
  )
}

export default Home
