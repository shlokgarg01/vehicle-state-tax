/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCalendar,
  cilMoney,
  cilPrint,
  cilSync,
  cilCheckCircle,
  cilXCircle,
  cilBriefcase,
  cilInstitution,
  cilSwapHorizontal,
  cilWallet,
} from '@coreui/icons'
import { getDashboardData } from '../../actions/dashboardAction'
import DateSelector from '../../components/Form/DateSelector'
import { formatDateInput } from '../../helpers/Date'

const LedgerReport = () => {
  const dispatch = useDispatch()
  const { loading, data, error } = useSelector((state) => state.dashboard)

  const todayStr = formatDateInput(new Date())
  const dYest = new Date()
  dYest.setDate(dYest.getDate() - 1)
  const yesterdayStr = formatDateInput(dYest)

  const [selectedDate, setSelectedDate] = useState(todayStr)

  const fetchReport = (date) => {
    dispatch(getDashboardData({ startDate: date, endDate: date }))
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    fetchReport(date)
  }

  const setToday = () => {
    setSelectedDate(todayStr)
    fetchReport(todayStr)
  }

  const setYesterday = () => {
    setSelectedDate(yesterdayStr)
    fetchReport(yesterdayStr)
  }

  useEffect(() => {
    fetchReport(selectedDate)
  }, [])

  const counts = data?.counts || {}

  const formatRs = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
  }

  const totalAmount = counts.totalAmount || 0
  const totalCommission = counts.totalCommission || 0
  const govtTaxAmount = counts.govtTaxAmount ?? Math.max(0, totalAmount - totalCommission)
  const totalRefundedAmount = counts.totalRefundedAmount || 0
  const totalWithdrawalsProcessed = counts.totalWithdrawalsProcessed || 0
  const totalWalletAmountUsed = counts.totalWalletAmountUsed || 0

  // Total = Commission + Amount Refunded - Withdrawal Amount - Amount Used from Wallet
  const dayEndBalance =
    counts.expectedDayEndBalance ??
    (totalCommission + totalRefundedAmount - totalWithdrawalsProcessed - totalWalletAmountUsed)

  const categoryLabels = {
    border_tax: 'Border Tax',
    road_tax: 'Road Tax',
    all_india_tax: 'All India Tax',
    all_india_permit: 'All India Permit',
  }

  return (
    <CContainer fluid className="py-3">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .card { border: 1px solid #ddd !important; box-shadow: none !important; }
        }
        .hero-balance-card {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 12px;
        }
        .step-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1.25rem;
        }
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .date-filter-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0 !important;
        }
        .date-filter-card-body {
          padding-top: 0.75rem !important;
          padding-bottom: 0.75rem !important;
        }
        .date-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 0;
          width: 100%;
        }
        .date-filter-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
        }
        .date-filter-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          color: #1e293b;
          margin: 0;
          line-height: 1;
        }
        .preset-btn-group {
          background-color: #f1f5f9;
          padding: 3px;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          margin: 0;
        }
        .preset-btn {
          border: none;
          border-radius: 20px;
          padding: 6px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          background: transparent;
          transition: all 0.2s ease;
          cursor: pointer;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          height: 30px;
          margin: 0;
        }
        .preset-btn.active {
          background-color: #10b981;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }
        .date-picker-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }
        .date-picker-wrapper input[type="date"] {
          height: 36px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          padding: 0 0.75rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          background-color: #f8fafc;
          transition: all 0.2s ease-in-out;
          margin: 0 !important;
          vertical-align: middle;
          display: inline-flex;
          align-items: center;
        }
        .date-picker-wrapper input[type="date"]:focus {
          border-color: #10b981;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
      `}</style>

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 no-print">
        <div>
          <h3 className="fw-bold mb-1">
            <CIcon icon={cilMoney} className="me-2 text-success" />
            Daily Financial Report
          </h3>
          <p className="text-muted small mb-0">
            Simple accounting overview: Commission, Refunds, Withdrawals, Wallet Used & Net Balance.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => fetchReport(selectedDate)}
          >
            <CIcon icon={cilSync} className="me-1" /> Refresh
          </button>
          <button
            className="btn btn-dark btn-sm"
            onClick={() => window.print()}
          >
            <CIcon icon={cilPrint} className="me-1" /> Print Report
          </button>
        </div>
      </div>

      {/* Sleek Vertically Centered Date Selector Bar */}
      <CCard className="mb-4 shadow-sm border-0 no-print date-filter-card">
        <CCardBody className="date-filter-card-body px-3">
          <div className="date-filter-bar">
            {/* Left Controls: Icon + Label + Segmented Presets */}
            <div className="date-filter-left">
              <div className="date-filter-label">
                <CIcon icon={cilCalendar} size="lg" className="text-success" />
                <span>Select Date:</span>
              </div>
              <div className="preset-btn-group">
                <button
                  type="button"
                  className={`preset-btn ${selectedDate === todayStr ? 'active' : ''}`}
                  onClick={setToday}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`preset-btn ${selectedDate === yesterdayStr ? 'active' : ''}`}
                  onClick={setYesterday}
                >
                  Yesterday
                </button>
              </div>
            </div>

            {/* Right Control: Date Picker Input */}
            <div className="date-picker-wrapper">
              <span className="small text-muted fw-semibold d-none d-sm-inline">Custom:</span>
              <DateSelector
                id="reportDate"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
          </div>
        </CCardBody>
      </CCard>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <CSpinner color="success" size="lg" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {/* Main Hero Card: Net Day End Balance */}
          <CCard className="mb-4 shadow-sm border-0 hero-balance-card">
            <CCardBody className="p-4 text-center">
              <div className="text-white-50 text-uppercase fw-bold tracking-wider small">
                Total Net Day End Balance
              </div>
              <div className="display-4 fw-bold my-2">{formatRs(dayEndBalance)}</div>
              <div className="small text-white-50">
                Formula: Commission ({formatRs(totalCommission)}) + Refunded to Wallet ({formatRs(totalRefundedAmount)}) - Withdrawals ({formatRs(totalWithdrawalsProcessed)}) - Used from Wallet ({formatRs(totalWalletAmountUsed)}) = {formatRs(dayEndBalance)}
              </div>
            </CCardBody>
          </CCard>

          {/* Simple Formula Step Cards */}
          <h5 className="fw-bold text-secondary mb-3">
            <CIcon icon={cilCalendar} className="me-2 text-primary" />
            Financial Breakdown for {selectedDate}
          </h5>

          <CRow className="g-3 mb-4">
            {/* 1. Commission */}
            <CCol xs={12} sm={6} md={3}>
              <div className="step-box h-100 shadow-sm border-success">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success">+ Add</span>
                  <CIcon icon={cilBriefcase} size="xl" className="text-success" />
                </div>
                <div className="text-muted small text-uppercase fw-semibold">
                  1. Commission
                </div>
                <div className="fs-3 fw-bold text-success mt-1">
                  + {formatRs(totalCommission)}
                </div>
                <div className="small text-muted mt-1">
                  Our total commission earned.
                </div>
              </div>
            </CCol>

            {/* 2. Amount Refunded to Wallet */}
            <CCol xs={12} sm={6} md={3}>
              <div className="step-box h-100 shadow-sm border-info">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-info text-white">+ Add</span>
                  <CIcon icon={cilXCircle} size="xl" className="text-info" />
                </div>
                <div className="text-muted small text-uppercase fw-semibold">
                  2. Refunded to Wallet
                </div>
                <div className="fs-3 fw-bold text-info mt-1">
                  + {formatRs(totalRefundedAmount)}
                </div>
                <div className="small text-muted mt-1">
                  Amount credited back to user wallets.
                </div>
              </div>
            </CCol>

            {/* 3. Withdrawal Amount */}
            <CCol xs={12} sm={6} md={3}>
              <div className="step-box h-100 shadow-sm border-danger">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-danger">- Deduct</span>
                  <CIcon icon={cilSwapHorizontal} size="xl" className="text-danger" />
                </div>
                <div className="text-muted small text-uppercase fw-semibold">
                  3. Withdrawal Amount
                </div>
                <div className="fs-3 fw-bold text-danger mt-1">
                  - {formatRs(totalWithdrawalsProcessed)}
                </div>
                <div className="small text-muted mt-1">
                  Withdrawals paid out to users.
                </div>
              </div>
            </CCol>

            {/* 4. Amount Used from Wallet */}
            <CCol xs={12} sm={6} md={3}>
              <div className="step-box h-100 shadow-sm border-warning">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-warning text-dark">- Deduct</span>
                  <CIcon icon={cilWallet} size="xl" className="text-warning" />
                </div>
                <div className="text-muted small text-uppercase fw-semibold">
                  4. Used from Wallet
                </div>
                <div className="fs-3 fw-bold text-warning mt-1">
                  - {formatRs(totalWalletAmountUsed)}
                </div>
                <div className="small text-muted mt-1">
                  Wallet balance redeemed for orders.
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Reference Info: Total Collection & Govt Tax */}
          <CRow className="g-3 mb-4">
            <CCol xs={12} md={6}>
              <div className="step-box shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-secondary">
                    <CIcon icon={cilMoney} className="me-1 text-primary" /> Total Amount Collected:
                  </span>
                  <span className="fs-5 fw-bold text-dark">{formatRs(totalAmount)}</span>
                </div>
                <div className="small text-muted">
                  Gross payments received from users for all orders.
                </div>
              </div>
            </CCol>
            <CCol xs={12} md={6}>
              <div className="step-box shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-secondary">
                    <CIcon icon={cilInstitution} className="me-1 text-warning" /> Govt Tax Portion:
                  </span>
                  <span className="fs-5 fw-bold text-dark">{formatRs(govtTaxAmount)}</span>
                </div>
                <div className="small text-muted">
                  Tax portion paid to the government (Total Collected - Commission).
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Simple Order Summary */}
          <h5 className="fw-bold text-secondary mb-3">Order Summary</h5>
          <CRow className="g-3 mb-4">
            <CCol xs={4}>
              <CCard className="border-0 shadow-sm text-center py-3">
                <div className="fs-3 fw-bold text-primary">{counts.totalOrders || 0}</div>
                <div className="text-muted small">Total Orders</div>
              </CCard>
            </CCol>
            <CCol xs={4}>
              <CCard className="border-0 shadow-sm text-center py-3">
                <div className="fs-3 fw-bold text-success">
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  {counts.completedOrders || 0}
                </div>
                <div className="text-muted small">Completed Orders</div>
              </CCard>
            </CCol>
            <CCol xs={4}>
              <CCard className="border-0 shadow-sm text-center py-3">
                <div className="fs-3 fw-bold text-danger">
                  <CIcon icon={cilXCircle} className="me-1" />
                  {counts.cancelledOrders || 0}
                </div>
                <div className="text-muted small">Cancelled Orders</div>
              </CCard>
            </CCol>
          </CRow>

          {/* Simple Clean Table: Category Breakdown */}
          <CCard className="border-0 shadow-sm">
            <CCardBody className="p-0">
              <CTable align="middle" responsive hover className="mb-0">
                <CTableHead className="table-light">
                  <CTableRow>
                    <CTableHeaderCell>Tax Category</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Orders Count</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">Total Collection</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {['border_tax', 'road_tax', 'all_india_tax', 'all_india_permit'].map((catKey) => {
                    const stat = counts.categoryStats?.[catKey] || {}
                    const count = stat.count || (counts[catKey.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] || 0)
                    const amount = stat.amount || 0

                    return (
                      <CTableRow key={catKey}>
                        <CTableDataCell className="fw-semibold">
                          {categoryLabels[catKey] || catKey}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge color="primary">{count}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-end fw-bold">
                          {formatRs(amount)}
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </>
      )}
    </CContainer>
  )
}

export default LedgerReport
