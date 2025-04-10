import React from 'react'
import Constants from '../../utils/constants'
import CreateTaxModeWrapper from '../state/CreateTaxModeWrapper'

const CreateLoadingTaxMode = () => {
  return (
    <div>
      <CreateTaxModeWrapper mode={Constants.MODES.LOADING_VEHICLE} />
    </div>
  )
}

export default CreateLoadingTaxMode
