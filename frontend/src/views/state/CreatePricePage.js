import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import CreatePrice from '../state/CreatePrice'
import { createPrice } from '../../actions/priceAction'
import { getTaxStates } from '../../actions/taxActions'
import Constants from '../../utils/constants'

const CreatePricePage = ({ mode }) => {
  const dispatch = useDispatch()
  const { states, loading, error } = useSelector((state) => state.allStates)
  const { loading: priceLoading, error: priceError } = useSelector((state) => state.createPrice)
  console.log('Current mode in CreatePricePage:', mode)

  useEffect(() => {
    dispatch(getTaxStates())
  }, [dispatch])

  const handleSubmit = async (formData) => {
    console.log('Submitting formData:', formData)
    return dispatch(createPrice(formData))
  }

  return (
    <CreatePrice
      states={states}
      stateLoading={loading}
      stateError={error}
      onSubmit={handleSubmit}
      loading={priceLoading}
      error={priceError}
      mode={mode}
    />
  )
}

export default CreatePricePage
