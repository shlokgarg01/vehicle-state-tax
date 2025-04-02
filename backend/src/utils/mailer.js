import nodemailer, { createTransport } from "nodemailer";
const transport = createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
const sendMail = async (to, subject, text) => {
  try {
    let info = await transport.sendMail({
      from: "",
      to: ",",
      subject: "",
      text: "",
    });
    console.log("Email sent: ", info.messageId);
  } catch (error) {}
};
