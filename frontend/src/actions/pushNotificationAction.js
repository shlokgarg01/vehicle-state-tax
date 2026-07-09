import { PUSH_NOTIFICATION_CONSTANTS } from '../constants/pushNotificationConstants'
import axiosInstance from '../utils/config'
import Constants from '../utils/constants'

const ADMIN_PREFIX = '/api/v1/admin/notifications'

export const sendPushNotification = (payload) => async (dispatch) => {
  try {
    dispatch({ type: PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_REQUEST })

    const { data } = await axiosInstance.post(`${ADMIN_PREFIX}/send`, payload)

    dispatch({
      type: PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_SUCCESS,
      payload: data.data.notification,
    })
  } catch (error) {
    dispatch({
      type: PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const getPushNotifications =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: PUSH_NOTIFICATION_CONSTANTS.GET_PUSH_NOTIFICATIONS_REQUEST })

      const page = params.page || 1
      const perPage = params.perPage || Constants.ITEMS_PER_PAGE
      const { data } = await axiosInstance.get(
        `${ADMIN_PREFIX}?page=${page}&perPage=${perPage}`
      )

      dispatch({
        type: PUSH_NOTIFICATION_CONSTANTS.GET_PUSH_NOTIFICATIONS_SUCCESS,
        payload: data.data,
      })
    } catch (error) {
      dispatch({
        type: PUSH_NOTIFICATION_CONSTANTS.GET_PUSH_NOTIFICATIONS_FAIL,
        payload: error.response?.data?.message || error.message,
      })
    }
  }

export const resetSendPushNotification = () => (dispatch) =>
  dispatch({ type: PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_RESET })
