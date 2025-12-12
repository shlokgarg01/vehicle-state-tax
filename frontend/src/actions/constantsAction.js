import axiosInstance from '../utils/config'
import WHATSAPP_CONSTANTS from '../constants/constantsConstants'

const PREFIX = 'api/v1/constants/whatsapp_message'
const CONSTANT_PREFIX = 'api/v1/constants'

// Get WhatsApp message
export const getWhatsAppMessage = () => async (dispatch) => {
  try {
    dispatch({ type: WHATSAPP_CONSTANTS.GET_WHATSAPP_MESSAGE_REQUEST })
    
    const { data } = await axiosInstance.get(PREFIX)
    
    dispatch({
      type: WHATSAPP_CONSTANTS.GET_WHATSAPP_MESSAGE_SUCCESS,
      payload: data?.value,
    })
  } catch (error) {
    dispatch({
      type: WHATSAPP_CONSTANTS.GET_WHATSAPP_MESSAGE_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

// Update WhatsApp message
export const updateWhatsAppMessage = (message) => async (dispatch) => {
  try {
    dispatch({ type: WHATSAPP_CONSTANTS.UPDATE_WHATSAPP_MESSAGE_REQUEST })
    
    const { data } = await axiosInstance.put(PREFIX, {
      value: message
    })
    
    dispatch({
      type: WHATSAPP_CONSTANTS.UPDATE_WHATSAPP_MESSAGE_SUCCESS,
      payload: data?.value,
    })
  } catch (error) {
    dispatch({
      type: WHATSAPP_CONSTANTS.UPDATE_WHATSAPP_MESSAGE_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
} 

// Generic get constant by key
export const getConstantByKey = (key) => async (dispatch) => {
  try {
    dispatch({ type: WHATSAPP_CONSTANTS.GET_CONSTANT_REQUEST, meta: { key } })

    const { data } = await axiosInstance.get(`${CONSTANT_PREFIX}/${key}`)

    dispatch({
      type: WHATSAPP_CONSTANTS.GET_CONSTANT_SUCCESS,
      payload: data?.value,
      meta: { key },
    })
  } catch (error) {
    dispatch({
      type: WHATSAPP_CONSTANTS.GET_CONSTANT_FAIL,
      payload: error.response?.data?.message || error.message,
      meta: { key },
    })
  }
}

// Generic update constant by key
export const updateConstantByKey = (key, value) => async (dispatch) => {
  try {
    dispatch({ type: WHATSAPP_CONSTANTS.UPDATE_CONSTANT_REQUEST, meta: { key } })

    const { data } = await axiosInstance.put(`${CONSTANT_PREFIX}/${key}`, { value })

    dispatch({
      type: WHATSAPP_CONSTANTS.UPDATE_CONSTANT_SUCCESS,
      payload: data?.value ?? value,
      meta: { key },
    })
  } catch (error) {
    dispatch({
      type: WHATSAPP_CONSTANTS.UPDATE_CONSTANT_FAIL,
      payload: error.response?.data?.message || error.message,
      meta: { key },
    })
  }
}

export const resetConstantUpdate = (key) => (dispatch) =>
  dispatch({ type: WHATSAPP_CONSTANTS.UPDATE_CONSTANT_RESET, meta: { key } })