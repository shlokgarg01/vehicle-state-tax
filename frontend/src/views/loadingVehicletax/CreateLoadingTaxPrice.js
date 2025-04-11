import CreatePricePage from '../state/CreatePricePage'
import Constants from '../../utils/constants'

export default function CreateLoadingTaxPrice() {
  return (
    <div>
      <CreatePricePage mode={Constants.MODES.LOADING_VEHICLE} />
    </div>
  )
}
