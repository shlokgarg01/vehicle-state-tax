import React, { useEffect, useState } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
import Loader from '../../components/Loader/Loader'
import Constants from '../../utils/constants'
import Pagination from '../../components/Pagination/Pagination'

const CompleteOrder = () => {
  const dispatch = useDispatch()
  const { taxes, loading, error, totalPages } = useSelector((state) => state.allTaxes)
  const { user } = useSelector((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(
      getAllTaxes({
        status: Constants.ORDER_STATUS.CLOSED,
        page: currentPage,
        state: user?.states,
      }),
    )
  }, [dispatch, currentPage, user])

  const completedTaxes = taxes?.filter((tax) => tax.status === Constants.ORDER_STATUS.CLOSED)
  return (
    <div>
      {loading && <Loader />}
      {error && <div className="alert alert-danger">Error: {error}</div>}

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
// allTaxes
