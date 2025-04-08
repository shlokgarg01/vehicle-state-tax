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
        taxusers: action.taxusers,
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
