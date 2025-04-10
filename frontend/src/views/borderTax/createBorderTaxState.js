import React from 'react'
import CreateTaxState from '../state/CreateTaxState'
import Constants from '../../utils/constants'

export default function CreateBorderTaxState() {
  return (
    <div>
      {' '}
      <CreateTaxState mode={Constants.MODES.BORDER_TAX} navigateTo="/border_tax/state" />
    </div>
  )
}
