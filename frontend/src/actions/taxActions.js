import { TAX_CONSTANTS } from '../constants/taxConstants'
import axiosInstance from '../utils/config'

const PREFIX = 'api/v1/state'
const PER_PAGE = 10

// Create a New State
export const createTaxState = (params) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.NEW_TAX_STATE_REQUEST })
    const { data } = await axiosInstance.post(`${PREFIX}/`, params)

    dispatch({ type: TAX_CONSTANTS.NEW_TAX_STATE_SUCCESS, payload: data.state })
  } catch (error) {
    dispatch({
      type: TAX_CONSTANTS.NEW_TAX_STATE_FAIL,
      payload: error.response.data.message,
    })
  }
}

// Get All States
export const getTaxStates = (params) => async (dispatch) => {
  try {
    const { page = 1, perPage = PER_PAGE, mode } = params
    dispatch({ type: TAX_CONSTANTS.GET_ALL_STATES_REQUEST })
    let url = `${PREFIX}?page=${page}&perPage=${perPage}&mode=${mode}`

    const { data } = await axiosInstance.get(url)

    dispatch({
      type: TAX_CONSTANTS.GET_ALL_STATES_SUCCESS,
      states: data.states,
      totalStates: data.totalStates,
      resultsPerPage: data.resultsPerPage,
    })
  } catch (error) {
    dispatch({
      type: TAX_CONSTANTS.GET_ALL_STATES_FAIL,
      payload: error.response.data.message,
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
      payload: error.response.data.message,
    })
  }
}

// Used to clear all the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: TAX_CONSTANTS.CLEAR_ERRORS,
  })
}
