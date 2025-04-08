import { EMPLOYEE_CONSTANTS } from '../constants/employeeConstants'
import Constants from '../utils/constants'
import axiosInstance from '../utils/config'

const PREFIX = '/api/v1/admin'

// get all users
export const getAndSearchEmployee = (params) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_REQUEST })
    const { page = 1, perPage = Constants.ITEMS_PER_PAGE, search } = params
    let url = `${PREFIX}/users?page=${page}&perPage=${perPage}`
    if (search) {
      url += `&search=${search}`
    }
    const { data } = await axiosInstance.get(url)

    dispatch({ type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_SUCCESS,
      payload: error.response,
    })
  }
}

// update employee
export const updateSingleEmployee = (id, params) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_REQUEST })
    const { data } = await axiosInstance.put(`${PREFIX}/employee/${id}`, params)
    dispatch({ type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_FAIL,
      payload: error.response?.data?.message || 'Update failed',
    })
  }
}

// delete user
export const deleteSingleEmployee = (id) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_REQUEST })
    await axiosInstance.delete(`${PREFIX}/user/${id}`)

    dispatch({ type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_SUCCESS, payload: id })
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_FAIL,
      payload: error.response,
    })
  }
}
