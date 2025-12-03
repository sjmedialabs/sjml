// Twilio SMS Service for OTP
// Install: npm install twilio

import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

let client: any = null

if (accountSid && authToken) {
  client = twilio(accountSid, authToken)
}

export async function sendOTP(phone: string, otp: string, name: string): Promise<boolean> {
  if (!client) {
    console.error("Twilio client not configured. Check environment variables.")
    return false
  }

  try {
    const message = await client.messages.create({
      body: `Hi ${name}, your OTP for downloading the Brand Strategy Playbook is: ${otp}. Valid for 5 minutes.`,
      from: fromNumber,
      to: phone,
    })

    console.log("OTP sent successfully:", message.sid)
    return true
  } catch (error) {
    console.error("Error sending OTP via Twilio:", error)
    return false
  }
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && fromNumber)
}
