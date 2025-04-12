import React, { useEffect, useRef, useState } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
import Loader from '../../components/Loader/Loader'
import Constants from '../../utils/constants'

const NewOrder = () => {
  const dispatch = useDispatch()
  const { taxes, loading, error } = useSelector((state) => state.allTaxes)
  const [isUploading, setIsUploading] = useState(false) // 🆕 added

  const [displayedTaxes, setDisplayedTaxes] = useState([])
  const previousIdsRef = useRef(new Set())

  // 👇 Live polling every 5 seconds

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllTaxes())
    }

    fetchData()

    let interval = null
    if (!isUploading) {
      interval = setInterval(() => {
        fetchData()
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [dispatch, isUploading]) // depend on isUploading
  // console.log('taxes list', taxes)
  // 👇 When taxes change, check for new ones
  useEffect(() => {
    const confirmed = taxes?.filter((t) => t.status === Constants.ORDER_STATUS.CONFIRMED) || []
    const currentIds = new Set(confirmed.map((t) => t._id))
    const newTaxAdded = [...currentIds].some((id) => !previousIdsRef.current.has(id))
    // console.log(confirm)
    // console.log('confirmed data', confirmed)

    // console.log('new added data', newTaxAdded)
    // console.log('recent data', currentIds)

    if (newTaxAdded) {
      previousIdsRef.current = currentIds
      setDisplayedTaxes(confirmed)
    }
    // else don't update UI
  }, [taxes])
  const handleRefresh = () => {
    dispatch(getAllTaxes({ status: Constants.ORDER_STATUS.CONFIRMED }))
  }
  return (
    <div>
      {isUploading && <Loader />}

      {error && <div className="alert alert-danger">Error: {error}</div>}

      {!loading && displayedTaxes.length === 0 && (
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
