import { TAX_USER_CONSTANTS } from '../constants/taxUsersConstants'

export const allTaxUsersReducer = (state = { taxusers: [] }, action) => {
  switch (action.type) {
    case TAX_USER_CONSTANTS.GET_ALL_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case TAX_USER_CONSTANTS.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        taxusers: action.payload,
        success: true,
        resultPerPage: action.resultPerPage,
      }
    case TAX_USER_CONSTANTS.GET_ALL_USERS_FAIL:
      return {
        ...state,
        loading: false,
        taxusers: [],
        error: action.payload,
      }
    default:
      return state
  }
}

export const deleteSingleUser = (state = {}, action) => {
  switch (action.type) {
    case TAX_USER_CONSTANTS.DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case TAX_USER_CONSTANTS.DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: true,
      }
    case TAX_USER_CONSTANTS.DELETE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDeleted: false,
      }
    case TAX_USER_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isDeleted: false,
      }
    default:
      return state
  }
}
