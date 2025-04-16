// ignore this page
import DASHBOARD_CONSTANTS from '../constants/dashboardContants'

const initialState = {
  loading: false,
  data: {},
  error: null,
}

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_CONSTANTS.DASHBOARD_REQUEST:
      return { ...state, loading: true, error: null }
    case DASHBOARD_CONSTANTS.DASHBOARD_SUCCESS:
      return { loading: false, data: action.payload, error: null }
    case DASHBOARD_CONSTANTS.DASHBOARD_FAIL:
      return { loading: false, error: action.payload, data: {} }
    default:
      return state
  }
}
