import { PUSH_NOTIFICATION_CONSTANTS } from '../constants/pushNotificationConstants'

export const sendPushNotificationReducer = (state = {}, action) => {
  switch (action.type) {
    case PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_REQUEST:
      return { loading: true, success: false, error: null }
    case PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_SUCCESS:
      return { loading: false, success: true, notification: action.payload }
    case PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_FAIL:
      return { loading: false, error: action.payload }
    case PUSH_NOTIFICATION_CONSTANTS.SEND_PUSH_NOTIFICATION_RESET:
      return {}
    default:
      return state
  }
}

export const pushNotificationsReducer = (
  state = { notifications: [], total: 0, loading: false },
  action
) => {
  switch (action.type) {
    case PUSH_NOTIFICATION_CONSTANTS.GET_PUSH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true, error: null }
    case PUSH_NOTIFICATION_CONSTANTS.GET_PUSH_NOTIFICATIONS_SUCCESS:
      return {
        loading: false,
        notifications: action.payload.notifications,
        total: action.payload.total,
        page: action.payload.page,
        perPage: action.payload.perPage,
        totalPages: Math.ceil(action.payload.total / action.payload.perPage),
      }
    case PUSH_NOTIFICATION_CONSTANTS.GET_PUSH_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
