import PRICE_CONSTANTS from '../constants/priceConstants'

// create price reducer
export const createPriceReducer = (state = {}, action) => {
  switch (action.type) {
    case PRICE_CONSTANTS.NEW_TAX_PRICE_REQUEST:
      return { loading: true }
    case PRICE_CONSTANTS.NEW_TAX_PRICE_SUCCESS:
      return { loading: false, price: action.payload }
    case PRICE_CONSTANTS.NEW_TAX_PRICE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// List Prices Reducer
export const priceListReducer = (state = { prices: [] }, action) => {
  switch (action.type) {
    case PRICE_CONSTANTS.GET_ALL_PRICES_REQUEST:
      return { loading: true, prices: [] }
    case PRICE_CONSTANTS.GET_ALL_PRICES_SUCCESS:
      return { loading: false, prices: action.payload, error: false }
    case PRICE_CONSTANTS.GET_ALL_PRICES_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
