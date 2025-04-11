import React from 'react'
import CreatePricePage from '../state/CreatePricePage'
import Constants from '../../utils/constants'

const createAllIndiaTax = () => {
  return (
    <div>
      {' '}
      <CreatePricePage mode={Constants.MODES.ALL_INDIA_TAX} />
    </div>
  )
}

export default createAllIndiaTax
