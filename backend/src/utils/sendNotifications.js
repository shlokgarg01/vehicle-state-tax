import config from '../config/config.js'
import axios from 'axios'

export const sendOtpSMS = async (options) => {
  const { contactNumbers, otp } = options;
  let url = `http://sms.messageindia.in/v2/sendSMS?username=${config.sms.username}&message=${otp} is the OTP for your login at GURGAON CAB SERVICE&sendername=${config.sms.senderName}&smstype=${config.sms.smsType}&numbers=${contactNumbers}&apikey=${config.sms.apiKey}`;

  await axios.get(url);
  return null;
};
