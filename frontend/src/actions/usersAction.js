import { USERS_CONSTANTS } from '../constants/usersConstants'
import axiosInstance from '../utils/config'

const PREFIX = '/api/v1/admin'
export const getAndSearchUsers = (params) => async (dispatch) => {
  try {
    dispatch({ type: USERS_CONSTANTS.GET_ALL_USERS_REQUEST })
    const { page = 1, perPage, search } = params
    let url = `${PREFIX}/users?page=${page}&perPage=${perPage}`
    if (search) {
      url += `&search=${search}`
    }
    const { data } = await axiosInstance.get(url)

    dispatch({ type: USERS_CONSTANTS.GET_ALL_USERS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USERS_CONSTANTS.GET_ALL_USERS_FAIL,
      payload: error.response,
    })
  }
}

// delete user
export const deleteSingleUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USERS_CONSTANTS.DELETE_USER_REQUEST })
    await axiosInstance.delete(`${PREFIX}/user/${id}`)

    dispatch({ type: USERS_CONSTANTS.DELETE_USER_SUCCESS, payload: id })
  } catch (error) {
    dispatch({
      type: USERS_CONSTANTS.DELETE_USER_FAIL,
      payload: error.response,
    })
  }
}

export const exportAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USERS_CONSTANTS.EXPORT_USERS_REQUEST })
    const { data } = await axiosInstance.post(`${PREFIX}/users/export`)

    dispatch({
      type: USERS_CONSTANTS.EXPORT_USERS_SUCCESS,
      payload: data.message || 'Export started',
    })
  } catch (error) {
    dispatch({
      type: USERS_CONSTANTS.EXPORT_USERS_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}
