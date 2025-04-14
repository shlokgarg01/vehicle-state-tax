// actions/orderActions.js
import { TAX_CONSTANTS } from '../constants/taxConstants'
import axiosInstance from '../utils/config'
import Constants from '../utils/constants'

const TAX_PREFIX = '/api/v1/tax'

export const createTax = (taxData) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.CREATE_TAX_REQUEST })

    const { data } = await axiosInstance.post(`${PREFIX}/new`, taxData)

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
      params.perPage = params.perPage || Constants.ITEMS_PER_PAGE

      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v))
        } else {
          searchParams.append(key, value)
        }
      })

      const query = searchParams.toString()
      const { data } = await axiosInstance.get(`${TAX_PREFIX}${query ? `?${query}` : ''}`, {
        withCredentials: true,
      })

      dispatch({
        type: TAX_CONSTANTS.GET_ALL_TAXES_SUCCESS,
        payload: {
          taxes: data.taxes,
          totalTaxes: data.totalTaxes,
          totalPages: Math.ceil(data.totalTaxes / data.resultsPerPage),
          currentPage: data?.currentPage,
        },
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
