import Twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = Twilio(accountSid, authToken);
const sendSms = async (donorPhoneNumber, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: donorPhoneNumber,
    });
    console.log(`SMS sent to ${donorPhoneNumber}: ${response.sid}`);
    process.exit(0);
  } catch (error) {
    console.error(`Failed to send SMS to ${donorPhoneNumber}: ${error.message}`);
    process.exit(1);
  }
};

export { sendSms };
