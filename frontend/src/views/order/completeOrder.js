import React, { useEffect } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
import Loader from '../../components/Loader/Loader'
import Constants from '../../utils/constants'

const completeOrder = () => {
  const dispatch = useDispatch()

  const { taxes, loading, error } = useSelector((state) => state.allTaxes)

  useEffect(() => {
    dispatch(getAllTaxes({ status: Constants.ORDER_STATUS.CLOSED }))
  }, [dispatch])

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
    </div>
  )
}

export default completeOrder
// allTaxes
