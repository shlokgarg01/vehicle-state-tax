import React from 'react'
import CreateTaxModeWrapper from '../state/CreateTaxModeWrapper'
import Constants from '../../utils/constants'

export default function CreateRoadTaxMode() {
  return (
    <div>
      <CreateTaxModeWrapper mode={Constants.MODES.ROAD_TAX} />
    </div>
  )
}
