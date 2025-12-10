import config from '../config/config.js'
import axios from 'axios'
import nodemailer from "nodemailer";

export const sendOtpSMS = async (options) => {
  const { contactNumbers, otp } = options;
  let url = `http://sms.messageindia.in/v2/sendSMS?username=${config.sms.username}&message=${otp} is the OTP for your login at GURGAON CAB SERVICE&sendername=${config.sms.senderName}&smstype=${config.sms.smsType}&numbers=${contactNumbers}&apikey=${config.sms.apiKey}`;

  await axios.get(url);
  return null;
};

export const sendTaxViaWhatsApp = async (params) => {
  const { contactNumber, vehicleNumber, fileUrl, filename } = params;
  let url = `${config.whatsapp.baseUrl}/${config.whatsapp.waId}/messages`;

  const whatsappParams = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": `91${contactNumber}`,
    "type": "template",
    "template": {
      "name": "device_recovery",
      "language": {
        "code": "en_US"
      },
      "components": [
        {
          "type": "header",
          "parameters": [
            {
              "type": "document",
              "document": {
                "link": fileUrl,
                filename
              }
            }
          ]
        },
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": vehicleNumber
            }
          ]
        }
      ]
    },
    "biz_opaque_callback_data": "{{BizOpaqueCallbackData}}"
  }

  try {
    await axios.post(url, whatsappParams, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.whatsapp.token}`
      }
    });
  } catch (e) {
    console.log(`Error while sending WhatsApp message to ${contactNumber} - `, e.message)
    return false;
  }

  return true;
};

export const sendWelcomeMessage = async (params) => {
  const { contactNumber } = params;
  let url = `${config.whatsapp.baseUrl}/${config.whatsapp.waId}/messages`;

  const welcomeParams = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": `91${contactNumber}`,
    "type": "template",
    "template": {
        "name": "welcome_message",
        "language": {
            "code": "en_US"
        },
        "components": [
            {
                "type": "body",
                "parameters": []
            }
        ]
    },
    "biz_opaque_callback_data": "{{BizOpaqueCallbackData}}"
  }

  try {
    await axios.post(url, welcomeParams, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.whatsapp.token}`
      }
    });
  } catch (e) {
    console.log(`Error while sending welcome message to ${contactNumber} - `, e.message)
    return false;
  }

  return true;
};

export const sendUsersListOnMail = async (filePath) => {
  let emaiIds = JSON.parse(config.mail.usersTo).join(',')
  let bccEmailIds = JSON.parse(config.mail.bccUsersTo)

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.mail.from,
        pass: config.mail.pass,
      },
    });

    await transporter.sendMail({
      from: config.mail.from,
      to: emaiIds,
      bcc: bccEmailIds,
      subject: "Vehicle State Tax User's list",
      text: "Attached is the latest list of all users in Vehicle State Tax.",
      attachments: [
        {
          filename: "users.csv",
          path: filePath,
        },
      ],
    });
  } catch (e) {
    console.log(`Error while sending Users list on email - ${e.message}`)
  }

  return;
}