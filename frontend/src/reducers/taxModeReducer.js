import TAX_MODE_CONSTANTS from '../constants/taxModeContants'

const initialStateForGet = {
  taxModes: [],
  resultsPerPage: 10,
  totalTaxModes: 0,
  filteredTaxModesCount: 0,
  loading: false,
  error: null,
}

export const allTaxModesReducer = (state = initialStateForGet, action) => {
  switch (action.type) {
    case TAX_MODE_CONSTANTS.GET_ALL_TAX_MODES_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case TAX_MODE_CONSTANTS.GET_ALL_TAX_MODES_SUCCESS:
      return {
        ...state,
        loading: false,
        taxModes: action.payload.taxModes,
        totalTaxModes: action.payload.total,
        filteredTaxModesCount: action.payload.filteredTaxModesCount,
        resultsPerPage: action.payload.resultsPerPage,
        error: null,
      }

    case TAX_MODE_CONSTANTS.GET_ALL_TAX_MODES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case TAX_MODE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

// update
const initialStateForUpdate = {
  loading: false,
  isUpdated: false,
  error: null,
}

export const updateTaxModeReducer = (state = initialStateForUpdate, action) => {
  switch (action.type) {
    case TAX_MODE_CONSTANTS.UPDATE_TAX_MODE_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case TAX_MODE_CONSTANTS.UPDATE_TAX_MODE_SUCCESS:
      return {
        loading: false,
        isUpdated: true,
        error: null,
      }

    case TAX_MODE_CONSTANTS.UPDATE_TAX_MODE_FAIL:
      return {
        loading: false,
        isUpdated: false,
        error: action.payload,
      }

    case TAX_MODE_CONSTANTS.UPDATE_TAX_MODE_RESET:
      return {
        ...initialState,
      }

    case TAX_MODE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

const initialStateForCreate = {
  loading: false,
  isCreated: false,
  error: null,
}

export const createTaxModeReducer = (state = initialStateForCreate, action) => {
  switch (action.type) {
    case TAX_MODE_CONSTANTS.CREATE_TAX_MODE_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case TAX_MODE_CONSTANTS.CREATE_TAX_MODE_SUCCESS:
      return {
        loading: false,
        isCreated: true,
        error: null,
      }

    case TAX_MODE_CONSTANTS.CREATE_TAX_MODE_FAIL:
      return {
        loading: false,
        isCreated: false,
        error: action.payload,
      }

    case TAX_MODE_CONSTANTS.CREATE_TAX_MODE_RESET:
      return {
        ...initialState,
      }

    case TAX_MODE_CONSTANTS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}
