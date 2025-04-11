import React, { useEffect } from 'react'
import TaxCard from '../state/TaxCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes } from '../../actions/orderActions'
const newOrder = () => {
  const dummyTaxData = {
    state: 'Maharashtra',
    city: 'Mumbai',
    createdAt: new Date().toISOString(),
    vehicleNo: 'MH12AB1234',
    amount: '₹12,500',
    mobile: '9876543210',
    seatingCapacity: 7,
    taxMode: 'Quarterly',
    taxFrom: '2025-01-01',
    taxUpto: '2025-03-31',
    fileUrl: 'https://example.com/sample-tax-slip.pdf',
  }

  const dispatch = useDispatch()

  const { taxes, loading, error } = useSelector((state) => state.allTaxes)

  useEffect(() => {
    dispatch(getAllTaxes())
  }, [dispatch])
  console.log(taxes)

  const completedTaxes = taxes?.filter((tax) => tax.isCompleted === false)
  console.log(completedTaxes)
  return (
    <div>
      {loading && <p>Loading completed taxes...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && completedTaxes?.length === 0 && <p>No completed tax entries found.</p>}

      {completedTaxes?.map((tax) => (
        <TaxCard key={tax._id} data={tax} />
      ))}
    </div>
  )
}

export default newOrder
