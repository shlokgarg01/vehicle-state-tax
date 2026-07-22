import React, { useEffect, useRef, useState, useCallback } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
import Constants from '../../utils/constants'
import PaymentPendingFilters from '../../components/PaymentPendingFilters'

const PaymentPendingOrder = () => {
  const dispatch = useDispatch()
  const { taxes, error, totalTaxes } = useSelector((state) => state.allTaxes)
  const { user } = useSelector((state) => state.user)

  const [displayedTaxes, setDisplayedTaxes] = useState([])
  const [searchFilters, setSearchFilters] = useState({})

  const fetchData = useCallback(() => {
    const query = {
      status: Constants.ORDER_STATUS.PAYMENT_PENDING,
      sort: 'asc',
      perPage: 100,
      ...searchFilters,
      state: user?.states,
    }

    if (!searchFilters.category && user?.categories?.length) {
      query.category = user.categories
    }

    dispatch(getAllTaxes(query))
  }, [dispatch, searchFilters, user?.states, user?.categories])

  useEffect(() => {
    fetchData()

    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    const pending =
      taxes?.filter((t) => t.status === Constants.ORDER_STATUS.PAYMENT_PENDING) || []
    setDisplayedTaxes(pending)
  }, [taxes])

  const refreshTimeoutRef = useRef(null)

  const handleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    refreshTimeoutRef.current = setTimeout(fetchData, 100)
  }, [fetchData])

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  const handleClearFilters = () => {
    setSearchFilters({})
  }

  return (
    <div>
      {error && <div className="alert alert-danger">Error: {error}</div>}

      <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
        <h4 className="mb-0">Payment Pending</h4>
        <h6 className="text-muted mb-0">
          Total Pending Payments: <span className="fw-bold">{totalTaxes || 0}</span>
        </h6>
      </div>

      <PaymentPendingFilters user={user} onSearch={handleSearch} onClear={handleClearFilters} />

      {displayedTaxes.length === 0 && (
        <div className="alert alert-warning">No payment pending orders found.</div>
      )}

      {displayedTaxes.map((tax) => (
        <TaxCard
          key={tax._id}
          data={tax}
          onConfirmComplete={handleRefresh}
          showStatus
        />
      ))}
    </div>
  )
}

export default PaymentPendingOrder
