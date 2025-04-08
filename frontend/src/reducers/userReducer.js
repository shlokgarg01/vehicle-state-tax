import { USER_CONSTANTS } from '../constants/userConstants'

export const loadUserReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_CONSTANTS.LOGIN_REQUEST:
    case USER_CONSTANTS.LOAD_USER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      }
    case USER_CONSTANTS.LOGIN_SUCCESS:
    case USER_CONSTANTS.LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      }
    case USER_CONSTANTS.LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      }
    case USER_CONSTANTS.LOAD_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
      }
    case USER_CONSTANTS.LOGOUT_USER_SUCCESS:
      return {
        loading: false,
        user: null,
        isAuthenticated: false,
      }
    case USER_CONSTANTS.LOGOUT_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case USER_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}
