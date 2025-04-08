import { EMPLOYEE_CONSTANTS } from '../constants/employeeConstants'
import Constants from '../utils/constants'
import axiosInstance from '../utils/config'

const PREFIX = '/api/v1/admin'

// get all users
export const getAndSearchEmployee = (params) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_REQUEST })

    const {
      page = 1,
      perPage = Constants.ITEMS_PER_PAGE,
      contactNumber = '',
      email = '',
      username = '',
    } = params

    let url = `${PREFIX}/employee?page=${page}&perPage=${perPage}`

    if (contactNumber) url += `&contactNumber=${contactNumber}`
    if (email) url += `&email=${email}`
    if (username) url += `&username=${username}`

    const { data } = await axiosInstance.get(url)
    dispatch({ type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_FAIL,
      payload: error?.response?.data?.message || 'Something went wrong!',
    })
  }
}

// update employee
export const updateSingleEmployee = (id, params) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_REQUEST })
    const { data } = await axiosInstance.put(`${PREFIX}/employee/${id}`, params)
    dispatch({ type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_SUCCESS, payload: data.employee })
    dispatch(getAndSearchEmployee({ page: 1 }))
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_FAIL,
      payload: error.response || 'Update failed',
    })
  }
}

// delete user
export const deleteSingleEmployee = (id) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_REQUEST })
    await axiosInstance.delete(`${PREFIX}/employee/${id}`)

    dispatch({ type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_SUCCESS, payload: id })
    dispatch(getAndSearchEmployee({ page: 1 }))
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_FAIL,
      payload: error.response,
    })
  }
}
