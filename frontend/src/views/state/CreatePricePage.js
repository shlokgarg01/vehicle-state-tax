import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTaxStates } from '../../actions/taxActions'
import CreatePrice from './CreatePrice'

const CreatePricePage = ({ mode }) => {
  const dispatch = useDispatch()
  const { states, loading, error } = useSelector((state) => state.allStates)

  const [page] = useState(1)
  const [perPage] = useState(650)
  useEffect(() => {
    if (mode) {
      dispatch(getTaxStates({ mode, page, perPage }))
    }
  }, [dispatch, mode, page, perPage])

  return <CreatePrice states={states || []} stateLoading={loading} mode={mode} stateError={error} />
}

export default CreatePricePage
