/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
import Loader from '../../components/Loader/Loader'
import Constants from '../../utils/constants'
import Pagination from '../../components/Pagination/Pagination'
import TaxOrderFilters from '../../components/TaxOrderFilters'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'

const CompleteOrder = () => {
  const dispatch = useDispatch()
  const { taxes, loading, error, totalPages, totalTaxes } = useSelector((state) => state.allTaxes)
  const { user } = useSelector((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({})

  const fetchTaxes = (page, appliedFilters = filters) => {
    dispatch(
      getAllTaxes({
        status: Constants.ORDER_STATUS.CLOSED,
        state: user?.states,
        category: user?.categories,
        perPage: Constants.ITEMS_PER_PAGE,
        ...appliedFilters,
        page,
      })
    )
  }

  useEffect(() => {
    fetchTaxes(currentPage)
  }, [dispatch, currentPage, user])

  const handleSearch = (appliedFilters) => {
    setFilters(appliedFilters)
    setCurrentPage(1)
    fetchTaxes(1, appliedFilters)
  }

  const handleClear = () => {
    setFilters({})
    setCurrentPage(1)
    dispatch(
      getAllTaxes({
        status: Constants.ORDER_STATUS.CLOSED,
        state: user?.states,
        category: user?.categories,
        perPage: Constants.ITEMS_PER_PAGE,
        page: 1,
      })
    )
  }

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

  const completedTaxes = taxes?.filter((tax) => tax.status === Constants.ORDER_STATUS.CLOSED)

  return (
    <div className="p-4">
      <TaxOrderFilters onSearch={handleSearch} onClear={handleClear} modeOptions={modeOptions} />

      {loading && <Loader />}
      {error && <div className="alert alert-danger">Error: {error}</div>}

      <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
        <h4 className="mb-0" />
        <h6 className="text-muted">
          Total Completed Taxes: <span className="fw-bold">{totalTaxes || 0}</span>
        </h6>
      </div>

      {!loading && completedTaxes?.length === 0 && (
        <div className="alert alert-warning">No pending tax entries found.</div>
      )}

      {completedTaxes?.map((tax) => (
        <TaxCard key={tax._id} data={tax} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={Constants.ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default CompleteOrder
