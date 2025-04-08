import { TAX_USER_CONSTANTS } from '../constants/taxUsersConstants'
// import { USER_CONSTANTS } from '../constants/userConstants'
import axiosInstance from '../utils/config'

const PREFIX = 'http://localhost:4000/api/v1/admin'
const PER_PAGE = 10
// get all users
export const getAndSearchUsers = (params) => async (dispatch) => {
  try {
    dispatch({ type: TAX_USER_CONSTANTS.GET_ALL_USERS_REQUEST })
    const { page = 1, perPage = PER_PAGE, contactNumber } = params
    let url = `${PREFIX}/users?page=${page}&perPage=${perPage}`
    if (contactNumber) {
      url += `&contactNumber=${contactNumber}`
    }
    const { data } = await axiosInstance.get(url)
    console.log(data)

    console.log(data.users)

    dispatch({ type: TAX_USER_CONSTANTS.GET_ALL_USERS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: TAX_USER_CONSTANTS.GET_ALL_USERS_FAIL,
      payload: error.response,
    })
  }
}
export const deleteSingleUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: TAX_USER_CONSTANTS.DELETE_USER_REQUEST })
    await axiosInstance.delete(`${PREFIX}/user/${id}`)

    dispatch({ type: TAX_USER_CONSTANTS.DELETE_USER_SUCCESS, payload: id })
  } catch (error) {
    dispatch({
      type: TAX_USER_CONSTANTS.DELETE_USER_FAIL,
      payload: error.response,
    })
  }
}

export const updateEmployee = (id, params) => async (dispatch) => {}
