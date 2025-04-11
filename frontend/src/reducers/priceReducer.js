import PRICE_CONSTANTS from '../constants/priceConstants'

// create price reducer
export const createPriceReducer = (state = {}, action) => {
  switch (action.type) {
    case PRICE_CONSTANTS.NEW_TAX_PRICE_REQUEST:
      return { loading: true, isCreated: false, error: null }
    case PRICE_CONSTANTS.NEW_TAX_PRICE_SUCCESS:
      return { loading: false, price: action.payload, isCreated: true, error: null }
    case PRICE_CONSTANTS.NEW_TAX_PRICE_FAIL:
      return { loading: false, error: action.payload, isCreated: false }
    default:
      return state
  }
}

// List Prices Reducer
export const priceListReducer = (state = { prices: [] }, action) => {
  switch (action.type) {
    case PRICE_CONSTANTS.GET_ALL_PRICES_REQUEST:
      return { loading: true, prices: [], error: null }
    case PRICE_CONSTANTS.GET_ALL_PRICES_SUCCESS:
      return { loading: false, prices: action.payload, error: false }
    case PRICE_CONSTANTS.GET_ALL_PRICES_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// Update Price Reducer
export const updatePriceReducer = (state = {}, action) => {
  switch (action.type) {
    case PRICE_CONSTANTS.UPDATE_TAX_PRICE_REQUEST:
      return { loading: true }
    case PRICE_CONSTANTS.UPDATE_TAX_PRICE_SUCCESS:
      return { loading: false, isUpdated: true }
    case PRICE_CONSTANTS.UPDATE_TAX_PRICE_FAIL:
      return { loading: false, error: action.payload }
    case PRICE_CONSTANTS.RESET_UPDATE_PRICE:
      return {}

    default:
      return state
  }
}
