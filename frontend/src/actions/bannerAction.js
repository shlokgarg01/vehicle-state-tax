import axios from 'axios'
import BANNER_CONSTANTS from '../constants/bannerConstants'
import axiosInstance from '../utils/config'

// Create a new banner
const PREFIX = '/api/v1/banner'
export const createBanner = (formData) => async (dispatch) => {
  try {
    dispatch({ type: BANNER_CONSTANTS.CREATE_BANNER_REQUEST })
    const config = {
      isMultipart: true,
    }

    const { data } = await axiosInstance.post(`${PREFIX}/new`, formData, config)
    console.log(data)

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

      const { page = 1, limit, search, status } = params

      const queryParams = new URLSearchParams()
      queryParams.append('page', page)
      if (limit) queryParams.append('limit', limit)
      if (search) queryParams.append('search', search)
      if (status) queryParams.append('status', status)

      const url = `${PREFIX}/all?${queryParams.toString()}`
      console.log(url)
      const { data } = await axiosInstance.get(url)
      console.log(data)
      dispatch({
        type: BANNER_CONSTANTS.GET_BANNERS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: BANNER_CONSTANTS.GET_BANNERS_FAIL,
        payload: error.response?.data?.message || error.message,
      })
    }
  }

// Delete a banner
export const deleteBanner = (id) => async (dispatch) => {
  try {
    dispatch({ type: BANNER_CONSTANTS.DELETE_BANNER_REQUEST })

    await axiosInstance.delete(`${PREFIX}/delete/${id}`)

    dispatch({
      type: BANNER_CONSTANTS.DELETE_BANNER_SUCCESS,
      payload: id,
    })
  } catch (error) {
    dispatch({
      type: BANNER_CONSTANTS.DELETE_BANNER_FAIL,
      payload: error.response || error.message,
    })
  }
}
