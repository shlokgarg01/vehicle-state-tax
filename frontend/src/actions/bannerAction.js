import axios from 'axios'
import BANNER_CONSTANTS from '../constants/bannerConstants'
import axiosInstance from '../utils/config'

const PREFIX = '/api/v1/banner'
// Create a new banner
export const createBanner = (formData) => async (dispatch) => {
  try {
    dispatch({ type: BANNER_CONSTANTS.CREATE_BANNER_REQUEST })
    const config = {
      isMultipart: true,
    }

    const { data } = await axiosInstance.post(`${PREFIX}/new`, formData, config)

    dispatch({
      type: BANNER_CONSTANTS.CREATE_BANNER_SUCCESS,
      payload: data.banner,
    })
  } catch (error) {
    dispatch({
      type: BANNER_CONSTANTS.CREATE_BANNER_FAIL,
      payload: error.response || error.message,
    })
  }
}

// Fetch all banners
export const getBanners =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: BANNER_CONSTANTS.GET_BANNERS_REQUEST })

      const { page, perPage, title = '', status = '' } = params

      const queryParams = new URLSearchParams()

      if (page) queryParams.append('page', page)
      if (perPage) queryParams.append('perPage', perPage)
      if (title) queryParams.append('title', title)
      if (status) queryParams.append('status', status)

      const queryString = queryParams.toString()
      const url = queryString ? `${PREFIX}/all?${queryString}` : `${PREFIX}/all`

      const { data } = await axiosInstance.get(url)

      dispatch({
        type: BANNER_CONSTANTS.GET_BANNERS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: BANNER_CONSTANTS.GET_BANNERS_FAIL,
        payload: error?.response?.data?.message || 'Something went wrong!',
      })
    }
  }

// Delete a banner
export const deleteBanner = (id) => async (dispatch) => {
  try {
    dispatch({ type: BANNER_CONSTANTS.DELETE_BANNER_REQUEST })

    const response = await axiosInstance.delete(`${PREFIX}/delete/${id}`)

    dispatch({
      type: BANNER_CONSTANTS.DELETE_BANNER_SUCCESS,
      payload: id,
    })
  } catch (error) {
    const errorMsg = error?.response || error.message

    dispatch({
      type: BANNER_CONSTANTS.DELETE_BANNER_FAIL,
      payload: error.response || error.message,
    })
  }
}
