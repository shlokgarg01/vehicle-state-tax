// ignore this page
import axios from 'axios'
import DASHBOARD_CONSTANTS from '../constants/dashboardContants'
import axiosInstance from '../utils/config'
const PREFIX = 'api/v1/admin/dashboard'

export const getDashboardData =
  (filters = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: DASHBOARD_CONSTANTS.DASHBOARD_REQUEST })
      const query = new URLSearchParams(filters).toString() // no need for encodeURIComponent again

      const { data } = await axiosInstance.get(`${PREFIX}?${query}`)
      console.log('dashboard data', data)
      dispatch({
        type: DASHBOARD_CONSTANTS.DASHBOARD_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: DASHBOARD_CONSTANTS.DASHBOARD_FAIL,
        payload: error.response?.data?.message || error.message || 'Something went wrong',
      })
    }
  }
