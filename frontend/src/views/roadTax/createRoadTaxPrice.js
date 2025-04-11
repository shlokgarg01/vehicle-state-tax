import CreatePricePage from '../state/CreatePricePage'
import Constants from '../../utils/constants'

export default function CreateRoadTaxPrice() {
  return (
    <div>
      <CreatePricePage mode={Constants.MODES.ROAD_TAX} />
    </div>
  )
}
