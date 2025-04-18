import React, { useEffect, useRef, useState } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
import Constants from '../../utils/constants'
import { showToast } from '../../utils/toast'

const NewOrder = () => {
  const dispatch = useDispatch()
  const { taxes, error } = useSelector((state) => state.allTaxes)
  const { uploaded } = useSelector((state) => state.uploadTax || {})
  const { user } = useSelector((state) => state.user)
  const [isUploading, setIsUploading] = useState(false)

  const [displayedTaxes, setDisplayedTaxes] = useState([])
  const [taxFilters, _] = useState({
    status: Constants.ORDER_STATUS.CONFIRMED,
    sort: 'asc',
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getAllTaxes({ ...taxFilters, state: user?.states }))
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

  useEffect(() => {
    if (uploaded) {
      showToast('Tax Uploaded successfully.')
    }
  }, [uploaded])

  const handleRefresh = () => {
    dispatch(getAllTaxes({ ...taxFilters, state: user?.states }))
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
