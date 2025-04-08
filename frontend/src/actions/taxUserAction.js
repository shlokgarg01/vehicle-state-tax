import { TAX_USER_CONSTANTS } from '../constants/taxUsersConstants'
// import { USER_CONSTANTS } from '../constants/userConstants'
import axiosInstance from '../utils/config'

const PREFIX = 'http://localhost:4000/api/v1/admin'
const PER_PAGE = 10
// get all users
export const getAndSearchUsers = (params) => async (dispatch) => {
  try {
    dispatch({ type: TAX_USER_CONSTANTS.GET_ALL_USERS_REQUEST })
    // const { page = 1, perPage = PER_PAGE, contactNumber } = params
    let url = `${PREFIX}/users`
    const { data } = await axiosInstance.get(url)
    console.log(data)

    console.log(data.users)
    console.log(data.count)

    dispatch({ type: TAX_USER_CONSTANTS.GET_ALL_USERS_SUCCESS, payload: data.users })
  } catch (error) {
    dispatch({
      type: TAX_USER_CONSTANTS.GET_ALL_USERS_FAIL,
      payload: error.response,
    })
  }
}
