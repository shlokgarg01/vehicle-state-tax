// reducers/orderReducer.js
import { TAX_CONSTANTS } from '../constants/taxConstants'

export const createTaxReducer = (state = {}, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.CREATE_TAX_REQUEST:
      return { loading: true }

    case TAX_CONSTANTS.CREATE_TAX_SUCCESS:
      return { loading: false, tax: action.payload, success: true }

    case TAX_CONSTANTS.CREATE_TAX_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const allTaxesReducer = (state = { taxes: [] }, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.GET_ALL_TAXES_REQUEST:
      return { loading: true, taxes: state.taxes, error: false }

    case TAX_CONSTANTS.GET_ALL_TAXES_SUCCESS:
      return {
        loading: false,
        taxes: action.payload.taxes,
        count: action.payload.count,
        totalPages: action.payload.totalPages,
        error: false,
        currentPage: action.payload.currentPage,
      }

    case TAX_CONSTANTS.GET_ALL_TAXES_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const uploadTaxReducer = (state = {}, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.UPLOAD_TAX_REQUEST:
      return { loading: true }

    case TAX_CONSTANTS.UPLOAD_TAX_SUCCESS:
      return { loading: false, uploaded: true, data: action.payload }

    case TAX_CONSTANTS.UPLOAD_TAX_FAIL:
      return { loading: false, error: action.payload, uploaded: false }
    case TAX_CONSTANTS.UPLOAD_TAX_RESET:
      return {}
    default:
      return state
  }
}
