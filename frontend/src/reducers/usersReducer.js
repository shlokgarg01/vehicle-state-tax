import { USERS_CONSTANTS } from '../constants/usersConstants'

export const usersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USERS_CONSTANTS.GET_ALL_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case USERS_CONSTANTS.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        success: true,
        resultsPerPage: action.resultsPerPage,
      }
    case USERS_CONSTANTS.GET_ALL_USERS_FAIL:
      return {
        ...state,
        loading: false,
        users: [],
        error: action.payload,
      }
    default:
      return state
  }
}

export const deleteSingleUser = (state = {}, action) => {
  switch (action.type) {
    case USERS_CONSTANTS.DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case USERS_CONSTANTS.DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: true,
      }
    case USERS_CONSTANTS.DELETE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDeleted: false,
      }
    case USERS_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isDeleted: false,
      }
    default:
      return state
  }
}
