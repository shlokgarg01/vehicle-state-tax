import { WALLET_CONSTANTS } from '../constants/walletConstants'
import axiosInstance from '../utils/config'
import Constants from '../utils/constants'

const ADMIN_WALLET_PREFIX = '/api/v1/admin/wallet'
const ADMIN_TAX_PREFIX = '/api/v1/admin/tax'

export const getWithdrawals =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: WALLET_CONSTANTS.GET_WITHDRAWALS_REQUEST })

      const page = params.page || 1
      const perPage = params.perPage || Constants.ITEMS_PER_PAGE
      const status = params.status || ''
      const { startDate, endDate } = params

      let url = `${ADMIN_WALLET_PREFIX}/withdrawals?page=${page}&perPage=${perPage}`
      if (status) url += `&status=${status}`
      if (startDate) url += `&startDate=${startDate}`
      if (endDate) url += `&endDate=${endDate}`

      const { data } = await axiosInstance.get(url)
      dispatch({
        type: WALLET_CONSTANTS.GET_WITHDRAWALS_SUCCESS,
        payload: data.data,
      })
    } catch (error) {
      dispatch({
        type: WALLET_CONSTANTS.GET_WITHDRAWALS_FAIL,
        payload: error.response?.data?.message || error.message,
      })
    }
  }

export const completeWithdrawal = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_REQUEST })
    const { data } = await axiosInstance.put(
      `${ADMIN_WALLET_PREFIX}/withdrawals/${id}/complete`,
      formData,
      { isMultipart: true }
    )
    dispatch({
      type: WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_SUCCESS,
      payload: data.data.withdrawal,
    })
  } catch (error) {
    dispatch({
      type: WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const rejectWithdrawal = (id, rejectionReason) => async (dispatch) => {
  try {
    dispatch({ type: WALLET_CONSTANTS.REJECT_WITHDRAWAL_REQUEST })
    const { data } = await axiosInstance.put(
      `${ADMIN_WALLET_PREFIX}/withdrawals/${id}/reject`,
      { rejectionReason }
    )
    dispatch({
      type: WALLET_CONSTANTS.REJECT_WITHDRAWAL_SUCCESS,
      payload: data.data.withdrawal,
    })
  } catch (error) {
    dispatch({
      type: WALLET_CONSTANTS.REJECT_WITHDRAWAL_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const refundTaxToWallet = (taxId, password) => async (dispatch) => {
  try {
    dispatch({ type: WALLET_CONSTANTS.REFUND_TO_WALLET_REQUEST, meta: { taxId } })
    const { data } = await axiosInstance.post(
      `${ADMIN_TAX_PREFIX}/${taxId}/refund-to-wallet`,
      { password }
    )
    dispatch({
      type: WALLET_CONSTANTS.REFUND_TO_WALLET_SUCCESS,
      payload: data.data.tax,
      meta: { taxId },
    })
  } catch (error) {
    dispatch({
      type: WALLET_CONSTANTS.REFUND_TO_WALLET_FAIL,
      payload: error.response?.data?.message || error.message,
      meta: { taxId },
    })
  }
}
