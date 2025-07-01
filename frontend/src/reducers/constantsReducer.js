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