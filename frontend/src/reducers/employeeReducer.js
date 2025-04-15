import { EMPLOYEE_CONSTANTS } from '../constants/employeeConstants'

const initialState = {
  loading: false,
  success: false,
  employee: null,
  error: null,
}

export const createEmployeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case EMPLOYEE_CONSTANTS.NEW_EMPLOYEE_REQUEST:
      return { ...state, loading: true }

    case EMPLOYEE_CONSTANTS.NEW_EMPLOYEE_SUCCESS:
      return {
        loading: false,
        success: true,
        employee: action.payload,
        error: null,
      }

    case EMPLOYEE_CONSTANTS.NEW_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      }

    case EMPLOYEE_CONSTANTS.RESET_NEW_EMPLOYEE:
      return initialState

    default:
      return state
  }
}
export const employeeGetReducer = (state = { employees: [] }, action) => {
  switch (action.type) {
    case EMPLOYEE_CONSTANTS.GET_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case EMPLOYEE_CONSTANTS.GET_EMPLOYEE_SUCCESS:
      return {
        loading: false,
        employees: action.payload,
        success: true,
        error: null,
      }

    case EMPLOYEE_CONSTANTS.GET_EMPLOYEE_FAIL:
      return {
        loading: false,
        employees: [],
        error: action.payload,
        success: false,
      }

    default:
      return state
  }
}
export const updateSingleEmployee = (state = { employee: {} }, action) => {
  switch (action.type) {
    case EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_SUCCESS:
      return {
        loading: false,
        isUpdated: true,
        employee: action.payload,
        error: null,
      }

    case EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isUpdated: false,
      }

    case EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_RESET:
      return {
        ...state,
        isUpdated: false,
      }

    case EMPLOYEE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
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
        loading: false,
        isDeleted: true,
        error: null,
      }

    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDeleted: false,
      }

    case EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_RESET:
      return {
        ...state,
        isDeleted: false,
      }

    case EMPLOYEE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}
