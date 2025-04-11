import { TAX_CONSTANTS } from '../constants/taxConstants'
import Constants from '../utils/constants'
import axiosInstance from '../utils/config'

const PREFIX = 'api/v1/state'

// Create a New State
export const createTaxState = (params) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.NEW_TAX_STATE_REQUEST })
    const { data } = await axiosInstance.post(`${PREFIX}`, params)
    console.log(data)
    dispatch({ type: TAX_CONSTANTS.NEW_TAX_STATE_SUCCESS, payload: data.state })
  } catch (error) {
    console.log(error)
    dispatch({
      type: TAX_CONSTANTS.NEW_TAX_STATE_FAIL,
      payload: error?.message || error || 'Something went wrong',
    })
  }
}

// Get All States
export const getTaxStates =
  (params = {}) =>
  async (dispatch) => {
    try {
      const { page = 1, perPage = Constants.ITEMS_PER_PAGE, mode } = params

      dispatch({ type: TAX_CONSTANTS.GET_ALL_STATES_REQUEST })

      let url = `${PREFIX}`

      if (mode) {
        url += `?mode=${mode}`
      } else {
        url += `?page=${page}&perPage=${perPage}`
      }

      const { data } = await axiosInstance.get(url)

      dispatch({
        type: TAX_CONSTANTS.GET_ALL_STATES_SUCCESS,
        states: data.states,
        totalStates: data.totalStates,
        resultsPerPage: data.resultsPerPage,
        filteredStatesCount: data.filteredStatesCount,
      })
    } catch (error) {
      dispatch({
        type: TAX_CONSTANTS.GET_ALL_STATES_FAIL,
        payload: error.response?.data || error.message || error || error.response,
      })
    }
  }

// Update State
export const updateState = (id, params) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.UPDATE_STATE_REQUEST })
    await axiosInstance.put(`${PREFIX}/${id}`, params)

    dispatch({ type: TAX_CONSTANTS.UPDATE_STATE_SUCCESS })
  } catch (error) {
    dispatch({
      type: TAX_CONSTANTS.UPDATE_STATE_SUCCESS,
      payload: error.response,
    })
  }
}

// Used to clear all the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: TAX_CONSTANTS.CLEAR_ERRORS,
  })
}
