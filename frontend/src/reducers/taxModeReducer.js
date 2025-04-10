import {
  CREATE_TAX_MODE_REQUEST,
  CREATE_TAX_MODE_SUCCESS,
  CREATE_TAX_MODE_FAIL,
  GET_ALL_TAX_MODES_REQUEST,
  GET_ALL_TAX_MODES_SUCCESS,
  GET_ALL_TAX_MODES_FAIL,
  UPDATE_TAX_MODE_REQUEST,
  UPDATE_TAX_MODE_SUCCESS,
  UPDATE_TAX_MODE_FAIL,
  CLEAR_ERRORS,
} from '../constants/taxModeContants'

export const taxModeReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_TAX_MODE_REQUEST:
    case UPDATE_TAX_MODE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      }

    case CREATE_TAX_MODE_SUCCESS:
      return {
        loading: false,
        isCreated: true,
        error: false,
      }

    case UPDATE_TAX_MODE_SUCCESS:
      return {
        loading: false,
        isUpdated: true,
        error: false,
      }

    case CREATE_TAX_MODE_FAIL:
    case UPDATE_TAX_MODE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isCreated: false,
        isUpdated: false,
      }

    default:
      return state
  }
}
const initialState = {
  taxModes: [],
  resultsPerPage: 10,
  totalTaxModes: 0,
  filteredTaxModesCount: 0,
  loading: false,
  error: null,
}

export const allTaxModesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TAX_MODES_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case GET_ALL_TAX_MODES_SUCCESS:
      return {
        ...state,
        loading: false,
        taxModes: action.payload.taxModes,
        totalTaxModes: action.payload.total,
        filteredTaxModesCount: action.payload.filtered,
        resultsPerPage: action.payload.resultsPerPage,
        error: null,
      }

    case GET_ALL_TAX_MODES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}
