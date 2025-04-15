import { EMPLOYEE_CONSTANTS } from '../constants/employeeConstants'
import Constants from '../utils/constants'
import axiosInstance from '../utils/config'

const PREFIX = '/api/v1/admin/employee'

// Create Employee
export const createEmployee = (employeeData) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.NEW_EMPLOYEE_REQUEST })

    const { data } = await axiosInstance.post(`${PREFIX}/create`, employeeData)
    dispatch({
      type: EMPLOYEE_CONSTANTS.NEW_EMPLOYEE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: EMPLOYEE_CONSTANTS.NEW_EMPLOYEE_FAIL,
      payload: error?.response?.data?.message || error.message,
    })
  }
}

// actions/employeeAction.js
export const getAllEmployees =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_REQUEST })

      const {
        page = 1,
        perPage = Constants.ITEMS_PER_PAGE,
        search = '', // generic search
        // assuming you want to filter managers
        sort = '-createdAt',
      } = params

      const queryParams = new URLSearchParams({
        page,
        perPage,
        sort,
        ...(search && { search }),
      })

      const { data } = await axiosInstance.get(`${PREFIX}?${queryParams.toString()}`)
      console.log(data)
      dispatch({
        type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: EMPLOYEE_CONSTANTS.GET_EMPLOYEE_FAIL,
        payload: error?.response?.data?.message || 'Something went wrong!',
      })
    }
  }

// Update Employee
export const updateSingleEmployee = (id, params) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_REQUEST })

    const { data } = await axiosInstance.put(`${PREFIX}/${id}`, params)

    dispatch({
      type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_SUCCESS,
      payload: data.employee,
    })
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_FAIL,
      payload: error?.response?.data?.message || 'Update failed',
    })
  }
}

// Delete Employee
export const deleteSingleEmployee = (id) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_REQUEST })

    await axiosInstance.delete(`${PREFIX}/${id}`)

    dispatch({
      type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_SUCCESS,
      payload: id,
    })
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_FAIL,
      payload: error?.response?.data?.message || 'Delete failed',
    })
  }
}
