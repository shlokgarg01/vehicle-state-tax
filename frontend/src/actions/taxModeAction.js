import axios from 'axios'
import {
  CREATE_TAX_MODE_REQUEST,
  CREATE_TAX_MODE_SUCCESS,
  CREATE_TAX_MODE_FAIL,
  GET_ALL_TAX_MODES_REQUEST,
  GET_ALL_TAX_MODES_SUCCESS,
  GET_ALL_TAX_MODES_FAIL,
  UPDATE_TAX_MODE_REQUEST,
  UPDATE_TAX_MODE_SUCCESS,
  UPDATE_TAX_MODE_FAIL,
  CLEAR_ERRORS,
} from '../constants/taxModeContants'
import axiosInstance from '../utils/config'

const PREFIX = '/api/v1/taxMode'
// Create Tax Mode
export const createTaxMode = (taxModeData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TAX_MODE_REQUEST })
    const { data } = await axiosInstance.post(`${PREFIX}`, taxModeData)

    dispatch({ type: CREATE_TAX_MODE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CREATE_TAX_MODE_FAIL,
      payload: error.response || error.message || error,
    })
  }
}

// Get All Tax Modes
export const getAllTaxModes =
  (search = '', page = 1, perPage = 10, filters = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_TAX_MODES_REQUEST })

      const queryParams = new URLSearchParams({
        search,
        page,
        perPage,
        ...filters,
      }).toString()

      const { data } = await axiosInstance.get(`${PREFIX}?${queryParams}`)

      dispatch({
        type: GET_ALL_TAX_MODES_SUCCESS,
        payload: {
          taxModes: data.taxModes,
          total: data.totalTaxModes,
          filtered: data.filteredTaxModesCount,
          resultsPerPage: perPage,
        },
      })
    } catch (error) {
      dispatch({
        type: GET_ALL_TAX_MODES_FAIL,
        payload: error.response?.data?.message || error.message,
      })
    }
  }

// Update Tax Mode
export const updateTaxMode = (id, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TAX_MODE_REQUEST })
    const { data } = await axiosInstance.put(`${PREFIX}/${id}`, updatedData)
    dispatch({ type: UPDATE_TAX_MODE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: UPDATE_TAX_MODE_FAIL,
      payload: error.response || error.message,
    })
  }
}

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS })
}
