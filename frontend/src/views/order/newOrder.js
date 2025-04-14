import React, { useEffect, useRef, useState } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
import Loader from '../../components/Loader/Loader'
import Constants from '../../utils/constants'

const NewOrder = () => {
  const dispatch = useDispatch()
  const { taxes, loading, error } = useSelector((state) => state.allTaxes)
  const [isUploading, setIsUploading] = useState(false)

  const [displayedTaxes, setDisplayedTaxes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllTaxes({ status: Constants.ORDER_STATUS.CONFIRMED }))
    }
    fetchData()

    let interval = null
    if (!isUploading) {
      interval = setInterval(() => {
        fetchData()
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [dispatch, isUploading])

  useEffect(() => {
    const confirmed = taxes?.filter((t) => t.status === Constants.ORDER_STATUS.CONFIRMED) || []
    setDisplayedTaxes(confirmed)
  }, [taxes])

  const handleRefresh = () => {
    dispatch(getAllTaxes({ status: Constants.ORDER_STATUS.CONFIRMED }))
  }

  return (
    <div>
      {error && <div className="alert alert-danger">Error: {error}</div>}

      {displayedTaxes.length === 0 && (
        <div className="alert alert-warning">No confirmed tax entries found.</div>
      )}

      {displayedTaxes.map((tax) => (
        <TaxCard
          key={tax._id}
          data={tax}
          onUploadComplete={handleRefresh}
          setIsUploading={setIsUploading}
        />
      ))}
    </div>
  )
}

export default NewOrder
