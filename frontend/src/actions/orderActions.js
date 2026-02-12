// actions/orderActions.js
import { TAX_CONSTANTS } from '../constants/taxConstants'
import axiosInstance from '../utils/config'
import Constants from '../utils/constants'

const TAX_PREFIX = '/api/v1/tax'
const ADMIN_TAX_PREFIX = '/api/v1/admin/tax'

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

export const updateTax = (id, taxData) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.UPDATE_TAX_REQUEST })
    const { data } = await axiosInstance.put(`${TAX_PREFIX}/${id}`, taxData)

    dispatch({
      type: TAX_CONSTANTS.UPDATE_TAX_SUCCESS,
      payload: data.data.tax,
    })
  } catch (error) {
    dispatch({
      type: TAX_CONSTANTS.UPDATE_TAX_FAIL,
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

export const resendTaxWhatsApp = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: TAX_CONSTANTS.SEND_WHATSAPP_REQUEST, meta: { orderId } })
    const { data } = await axiosInstance.post(`${ADMIN_TAX_PREFIX}/send-whatsapp`, { orderId })

    dispatch({
      type: TAX_CONSTANTS.SEND_WHATSAPP_SUCCESS,
      payload: data.message || 'WhatsApp notification sent',
      meta: { orderId },
    })
  } catch (error) {
    dispatch({
      type: TAX_CONSTANTS.SEND_WHATSAPP_FAIL,
      payload: error.response?.data?.message || error.message,
      meta: { orderId },
    })
  }
}
