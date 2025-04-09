import { USER_CONSTANTS } from '../constants/userConstants'
import axiosInstance from '../utils/config'

const PREFIX = 'api/v1/auth'

// Login via email & password
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_CONSTANTS.LOGIN_REQUEST })
    const { data } = await axiosInstance.post(`${PREFIX}/login`, { username: email, password })
    localStorage.setItem('token', JSON.stringify(data.token))

    dispatch({ type: USER_CONSTANTS.LOGIN_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({
      type: USER_CONSTANTS.LOGIN_FAIL,
      payload: error.response,
    })
  }
}

// load existing user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_CONSTANTS.LOAD_USER_REQUEST })
    const { data } = await axiosInstance.get(`${PREFIX}/me`)
    dispatch({ type: USER_CONSTANTS.LOAD_USER_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({
      type: USER_CONSTANTS.LOAD_USER_FAIL,
      payload: error.response,
    })
  }
}

// logout user
export const logoutUser = () => async (dispatch) => {
  try {
    await axiosInstance.get(`${PREFIX}/logout`)
    localStorage.clear()
    dispatch({ type: USER_CONSTANTS.LOGOUT_USER_SUCCESS })
  } catch (error) {
    dispatch({
      type: USER_CONSTANTS.LOGOUT_USER_FAIL,
      payload: error.response.data.message,
    })
  }
}

// Used to clear all the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: USER_CONSTANTS.CLEAR_ERRORS,
  })
}
