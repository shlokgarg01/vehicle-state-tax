// src/pages/tax/CreateTaxModeWrapper.js
// React & Redux imports
import React, { useEffect, useState } from 'react'
import CreateTaxMode from './CreateTaxMode'
import { useDispatch, useSelector } from 'react-redux'

// Action creators to fetch tax states and create a tax mode
import { getTaxStates } from '../../actions/taxActions'
import { createTaxMode } from '../../actions/taxModeAction'

export default function CreateTaxModeWrapper({ mode }) {
  const dispatch = useDispatch()

  const { states } = useSelector((state) => state.allStates)
  const { loading, error } = useSelector((state) => state.taxMode)
  const [submitted, setSubmitted] = useState(false)
  const [page] = useState(1)
  const [perPage] = useState(50)

  useEffect(() => {
    if (mode) {
      dispatch(getTaxStates({ mode, page, perPage }))
    }
  }, [dispatch, mode, page, perPage])

  const handleCreateTaxMode = (formData) => {
    dispatch(createTaxMode(formData))
    setSubmitted(true)
  }

  const filteredStates = (states || []).filter((state) => state.mode === mode)
  console.log(filteredStates)
  return (
    <div>
      <CreateTaxMode
        states={filteredStates}
        onSubmit={handleCreateTaxMode}
        loading={loading}
        error={submitted ? error : null}
        mode={mode}
      />
    </div>
  )
}
