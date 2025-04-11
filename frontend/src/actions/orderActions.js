// actions/orderActions.js
import { TAX_CONSTANTS } from '../constants/taxConstants'
import axiosInstance from '../utils/config'
const TAX_PREFIX = '/api/v1/tax'
export const createTax = (taxData) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.CREATE_TAX_REQUEST })

    const { data } = await axiosInstance.post(`${PREFIX}/new`, taxData)
    console.log(data)
    dispatch({
      type: TAX_CONSTANTS.CREATE_TAX_SUCCESS,
      payload: data.taxEntry,
    })
  } catch (error) {
    dispatch({
      type: TAX_CONSTANTS.CREATE_TAX_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const getAllTaxes =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: TAX_CONSTANTS.GET_ALL_TAXES_REQUEST })

      const query = new URLSearchParams(params).toString()
      const { data } = await axiosInstance.get(`${TAX_PREFIX}?${query}`, { withCredentials: true })
      console.log(data)
      dispatch({
        type: TAX_CONSTANTS.GET_ALL_TAXES_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: TAX_CONSTANTS.GET_ALL_TAXES_FAIL,
        payload: error.response?.data?.message || error.message,
      })
    }
  }

export const uploadTax = (formData) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.UPLOAD_TAX_REQUEST })

    const { data } = await axiosInstance.post(`${TAX_PREFIX}/upload_tax`, formData, {
      isMultipart: true, // Triggers multipart handling in interceptor
    })
    console.log(data)
    dispatch({
      type: TAX_CONSTANTS.UPLOAD_TAX_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: TAX_CONSTANTS.UPLOAD_TAX_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}
