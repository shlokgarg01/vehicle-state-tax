import axiosInstance from '../utils/config'
import TAX_MODE_CONSTANTS from '../constants/taxModeContants'
// import { error } from 'console'

const PREFIX = '/api/v1/taxMode'

// Create Tax Mode
export const createTaxMode = (taxModeData) => async (dispatch) => {
  try {
    dispatch({ type: TAX_MODE_CONSTANTS.CREATE_TAX_MODE_REQUEST })

    const { data } = await axiosInstance.post(PREFIX, taxModeData)
    dispatch({ type: TAX_MODE_CONSTANTS.CREATE_TAX_MODE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: TAX_MODE_CONSTANTS.CREATE_TAX_MODE_FAIL,
      payload: error?.response?.data?.message || error.message || error,
    })
  }
}

// Get All Tax Modes
export const getAllTaxModes =
  (search = '', page = 1, perPage = 10, filters = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: TAX_MODE_CONSTANTS.GET_ALL_TAX_MODES_REQUEST })

      const queryParams = new URLSearchParams({
        search,
        page,
        perPage,
        ...filters,
      }).toString()

      const { data } = await axiosInstance.get(`${PREFIX}?${queryParams}`)
      console.log(data)
      dispatch({
        type: TAX_MODE_CONSTANTS.GET_ALL_TAX_MODES_SUCCESS,
        payload: {
          totalTaxModes: data.totalTaxModes,
          taxModes: data.taxModes,
          resultsPerPage: perPage,
          loading: true,
          error: false,
          filteredTaxModesCount: data.filteredTaxModesCount,
        },
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: TAX_MODE_CONSTANTS.GET_ALL_TAX_MODES_FAIL,
        payload: error?.response?.data?.message || error.message || error,
      })
    }
  }

3
// Update Tax Mode
export const updateTaxMode = (id, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: TAX_MODE_CONSTANTS.UPDATE_TAX_MODE_REQUEST })

    const { data } = await axiosInstance.put(`${PREFIX}/${id}`, updatedData)
    dispatch({ type: TAX_MODE_CONSTANTS.UPDATE_TAX_MODE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: TAX_MODE_CONSTANTS.UPDATE_TAX_MODE_FAIL,
      payload: error?.response?.data?.message || error.message || error || error?.message,
    })
  }
}

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: TAX_MODE_CONSTANTS.CLEAR_ERRORS })
}
