import { TAX_CONSTANTS } from '../constants/taxConstants'

export const createStateReducer = (state = { state: {} }, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.NEW_TAX_STATE_REQUEST:
      return {
        loading: true,
        isStateCreated: false,
      }
    case TAX_CONSTANTS.NEW_TAX_STATE_SUCCESS:
      return {
        ...state,
        loading: false,
        isStateCreated: true,
        state: action.payload,
      }
    case TAX_CONSTANTS.NEW_TAX_STATE_FAIL:
      return {
        ...state,
        loading: false,
        isStateCreated: false,
        state: null,
      }
    case TAX_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        isStateCreated: false,
        error: null,
      }
    default:
      return state
  }
}

export const allStatesReducer = (state = { states: [] }, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.GET_ALL_STATES_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case TAX_CONSTANTS.GET_ALL_STATES_SUCCESS:
      return {
        ...state,
        loading: false,
        states: action.states,
        totalStates: action.totalStates,
        resultsPerPage: action.resultsPerPage,
        filteredStatesCount: action.filteredStatesCount,
      }

    case TAX_CONSTANTS.GET_ALL_STATES_FAIL:
      return {
        ...state,
        loading: false,
        states: [],
        error: action.payload,
      }
    case TAX_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const updateStateReducer = (state = {}, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.UPDATE_STATE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case TAX_CONSTANTS.UPDATE_STATE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: true,
      }
    case TAX_CONSTANTS.UPDATE_STATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isUpdated: false,
      }
    case TAX_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isUpdated: false,
      }
    default:
      return state
  }
}
