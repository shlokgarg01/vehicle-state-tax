import { EMPLOYEE_CONSTANTS } from '../constants/employeeConstants'

export const employeeGetReducer = (state = { employees: [] }, action) => {
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
        employees: action.payload,
        success: true,
        resultsPerPage: action.resultsPerPage,
      }
    case EMPLOYEE_CONSTANTS.GET_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        employees: [],
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

export const updateSingleEmployee = (state = { employee: [] }, action) => {
  switch (action.type) {
    case EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: true,
        employee: action.payload,
      }
    case EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isUpdated: false,
      }
    case EMPLOYEE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isUpdated: false,
      }
    default:
      return state
  }
}
