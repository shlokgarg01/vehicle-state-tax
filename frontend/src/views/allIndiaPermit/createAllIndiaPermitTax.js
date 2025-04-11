import React from 'react'
import CreatePricePage from '../state/CreatePricePage'
import Constants from '../../utils/constants'

const createAllIndiaPermitTax = () => {
  return (
    <div>
      <CreatePricePage mode={Constants.MODES.ALL_INDIA_PERMIT} />
    </div>
  )
}

export default createAllIndiaPermitTax
