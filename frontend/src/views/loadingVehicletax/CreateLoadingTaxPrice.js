import React from 'react'
import CreatePricePage from '../state/CreatePricePage'
import Constants from '../../utils/constants'

export const CreateLoadingTaxPrice = () => {
  return (
    <div>
      <CreatePricePage mode={Constants.MODES.LOADING_VEHICLE} />
    </div>
  )
}
