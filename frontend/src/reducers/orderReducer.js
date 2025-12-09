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

export const updateTaxReducer = (state = {}, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.UPDATE_TAX_REQUEST:
      return { loading: true }
    case TAX_CONSTANTS.UPDATE_TAX_SUCCESS:
      return { loading: false, tax: action.payload, success: true }
    case TAX_CONSTANTS.UPDATE_TAX_FAIL:
      return { loading: false, error: action.payload }
    case TAX_CONSTANTS.UPDATE_TAX_RESET: 
      return { loading: false, error: null }
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
        totalTaxes: action.payload.totalTaxes,
        totalPages: action.payload.totalPages,
        error: false,
      }
    case TAX_CONSTANTS.GET_ALL_TAXES_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

const initialState = {
  loading: false,
  uploaded: false,
  error: null,
}

export const uploadTaxReducer = (state = initialState, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.UPLOAD_TAX_REQUEST:
      return { ...state, loading: true, uploaded: false, error: null }

    case TAX_CONSTANTS.UPLOAD_TAX_SUCCESS:
      return { ...state, loading: false, uploaded: true } // return { loading: false, uploaded: true, data: action.payload }

    case TAX_CONSTANTS.UPLOAD_TAX_FAIL:
      return { ...state, loading: false, error: action.payload, uploaded: false }

    case TAX_CONSTANTS.UPLOAD_TAX_RESET:
      return initialState

    default:
      return state
  }
}

const sendWhatsAppInitial = {
  loading: false,
  success: false,
  error: null,
  message: null,
  currentOrderId: null,
}

export const sendWhatsAppReducer = (state = sendWhatsAppInitial, action) => {
  switch (action.type) {
    case TAX_CONSTANTS.SEND_WHATSAPP_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
        message: null,
        currentOrderId: action.meta?.orderId || null,
      }
    case TAX_CONSTANTS.SEND_WHATSAPP_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload,
        currentOrderId: action.meta?.orderId || null,
      }
    case TAX_CONSTANTS.SEND_WHATSAPP_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
        currentOrderId: action.meta?.orderId || null,
      }
    case TAX_CONSTANTS.SEND_WHATSAPP_RESET:
      return sendWhatsAppInitial
    default:
      return state
  }
}
