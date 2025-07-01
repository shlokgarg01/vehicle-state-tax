import axiosInstance from '../utils/config'
import WHATSAPP_CONSTANTS from '../constants/constantsConstants'

const PREFIX = 'api/v1/constants/whatsapp_message'

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