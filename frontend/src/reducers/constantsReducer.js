import WHATSAPP_CONSTANTS from "../constants/constantsConstants"

const initialState = {
  message: '',
  loading: false,
  error: null,
  isUpdated: false,
}

export const whatsAppMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case WHATSAPP_CONSTANTS.GET_WHATSAPP_MESSAGE_REQUEST:
      return { ...state, loading: true, error: null }
    case WHATSAPP_CONSTANTS.GET_WHATSAPP_MESSAGE_SUCCESS:
      return { ...state, loading: false, message: action.payload }
    case WHATSAPP_CONSTANTS.GET_WHATSAPP_MESSAGE_FAIL:
      return { ...state, loading: false, error: action.payload }
    case WHATSAPP_CONSTANTS.UPDATE_WHATSAPP_MESSAGE_REQUEST:
      return { ...state, loading: true, error: null, isUpdated: false }
    case WHATSAPP_CONSTANTS.UPDATE_WHATSAPP_MESSAGE_SUCCESS:
      return { ...state, loading: false, message: action.payload, isUpdated: true }
    case WHATSAPP_CONSTANTS.UPDATE_WHATSAPP_MESSAGE_FAIL:
      return { ...state, loading: false, error: action.payload, isUpdated: false }
    case WHATSAPP_CONSTANTS.UPDATE_WHATSAPP_MESSAGE_RESET:
      return initialState
    default:
      return state
  }
} 

const constantsInitial = {
  values: {},
  loading: false,
  error: null,
  updating: {},
  updated: {},
  errors: {},
}

export const constantsReducer = (state = constantsInitial, action) => {
  const key = action.meta?.key
  switch (action.type) {
    case WHATSAPP_CONSTANTS.GET_CONSTANT_REQUEST:
      return { ...state, loading: true, error: null }
    case WHATSAPP_CONSTANTS.GET_CONSTANT_SUCCESS:
      return {
        ...state,
        loading: false,
        values: { ...state.values, [key]: action.payload },
      }
    case WHATSAPP_CONSTANTS.GET_CONSTANT_FAIL:
      return { ...state, loading: false, error: action.payload }

    case WHATSAPP_CONSTANTS.UPDATE_CONSTANT_REQUEST:
      return {
        ...state,
        updating: { ...state.updating, [key]: true },
        updated: { ...state.updated, [key]: false },
        errors: { ...state.errors, [key]: null },
      }
    case WHATSAPP_CONSTANTS.UPDATE_CONSTANT_SUCCESS:
      return {
        ...state,
        updating: { ...state.updating, [key]: false },
        updated: { ...state.updated, [key]: true },
        values: { ...state.values, [key]: action.payload },
      }
    case WHATSAPP_CONSTANTS.UPDATE_CONSTANT_FAIL:
      return {
        ...state,
        updating: { ...state.updating, [key]: false },
        updated: { ...state.updated, [key]: false },
        errors: { ...state.errors, [key]: action.payload },
      }
    case WHATSAPP_CONSTANTS.UPDATE_CONSTANT_RESET:
      return {
        ...state,
        updating: { ...state.updating, [key]: false },
        updated: { ...state.updated, [key]: false },
        errors: { ...state.errors, [key]: null },
      }
    default:
      return state
  }
}