import React from 'react'
import CreateTaxState from '../state/CreateTaxState'
import Constants from '../../utils/constants'

export default function CreateLoadingTaxState() {
  return (
    <div>
      <CreateTaxState mode={Constants.MODES.LOADING_VEHICLE} navigateTo="/loading_vehicle/state" />
    </div>
  )
}
