import React from 'react'
import CreateTaxModeWrapper from '../state/CreateTaxModeWrapper'
import Constants from '../../utils/constants'

const createBorderTaxMode = () => {
  return (
    <div>
      <CreateTaxModeWrapper mode={Constants.MODES.BORDER_TAX} />
    </div>
  )
}

export default createBorderTaxMode
