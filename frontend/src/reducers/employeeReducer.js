import { EMPLOYEE_CONSTANTS } from '../constants/employeeConstants'

export const employeeGetReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case EMPLOYEE_CONSTANTS.GET_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case EMPLOYEE_CONSTANTS.GET_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        success: true,
        resultsPerPage: action.resultsPerPage,
      }
    case EMPLOYEE_CONSTANTS.GET_EMPLOYEE_SUCCESS:
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

export const employeeDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: true,
      }
    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDeleted: false,
      }
    case EMPLOYEE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isDeleted: false,
      }
    default:
      return state
  }
}

export const updateSingleEmployee = (state = {}, action) => {
  switch (action.type) {
    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: true,
      }
    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDeleted: false,
      }
    case EMPLOYEE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isDeleted: false,
      }
    default:
      return state
  }
}
