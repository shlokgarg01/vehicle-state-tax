// import axiosInstance from ''
import PRICE_CONSTANTS from '../constants/priceConstants'
import axiosInstance from '../utils/config'

const PREFIX = '/api/v1/price'
// Create new price
export const createPrice = (priceData) => async (dispatch) => {
  try {
    dispatch({ type: PRICE_CONSTANTS.NEW_TAX_PRICE_REQUEST })

    const { data } = await axiosInstance.post(`${PREFIX}`, priceData)

    dispatch({
      type: PRICE_CONSTANTS.NEW_TAX_PRICE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: PRICE_CONSTANTS.NEW_TAX_PRICE_FAIL,
      payload: error?.response?.data?.message || error.message || 'Unknown error',
    })
  }
}

// Get all prices
export const getAllPrices =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: PRICE_CONSTANTS.GET_ALL_PRICES_REQUEST })

      const { page = 1, perPage = 10, search = '', mode, ...filters } = params

      const queryParams = new URLSearchParams({
        page,
        perPage,
        search,
        ...filters,
      })
      if (mode) queryParams.set('mode', mode)
      const { data } = await axiosInstance.get(`${PREFIX}?${queryParams.toString()}`)

      dispatch({
        type: PRICE_CONSTANTS.GET_ALL_PRICES_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: PRICE_CONSTANTS.GET_ALL_PRICES_FAIL,
        payload: error?.response?.data?.message || error.message || 'Unknown error',
      })
    }
  }

// Update tax price
export const updatePrice = (id, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: PRICE_CONSTANTS.UPDATE_TAX_PRICE_REQUEST })

    const { data } = await axiosInstance.put(`${PREFIX}/${id}`, updatedData)

    dispatch({
      type: PRICE_CONSTANTS.UPDATE_TAX_PRICE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRICE_CONSTANTS.UPDATE_TAX_PRICE_FAIL,
      payload: error?.response?.data?.message || error.message || 'Unknown error',
    })
  }
}

// Clear errors
export const clearPriceErrors = () => (dispatch) => {
  dispatch({ type: PRICE_CONSTANTS.CLEAR_ERRORS })
}
