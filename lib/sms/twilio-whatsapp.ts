// Twilio WhatsApp Service for OTP
// Uses the same twilio package as SMS
// Requires WhatsApp sandbox setup or approved WhatsApp Business Account

import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER // Format: whatsapp:+14155238886

let client: any = null

if (accountSid && authToken) {
  client = twilio(accountSid, authToken)
}

export async function sendOTP(phone: string, otp: string, name: string): Promise<boolean> {
  console.log("[WhatsApp] Attempting to send OTP")
  console.log("[WhatsApp] Config:", { accountSid, hasAuthToken: !!authToken, fromWhatsAppNumber })
  console.log("[WhatsApp] To phone:", phone)
  
  if (!client) {
    console.error("Twilio WhatsApp client not configured. Check environment variables.")
    console.error("Missing:", {
      accountSid: !accountSid,
      authToken: !authToken,
      fromWhatsAppNumber: !fromWhatsAppNumber
    })
    return false
  }

  // Format phone number for WhatsApp (must include whatsapp: prefix)
  const toWhatsApp = phone.startsWith("whatsapp:") ? phone : `whatsapp:${phone}`
  console.log("[WhatsApp] Formatted to:", toWhatsApp)
  
  try {
    const message = await client.messages.create({
      body: `Hi ${name},\n\nYour OTP for downloading the Brand Strategy Playbook is:\n\n*${otp}*\n\nValid for 5 minutes.\n\nDo not share this code with anyone.`,
      from: fromWhatsAppNumber,
      to: toWhatsApp,
    })

    console.log("WhatsApp OTP sent successfully:", message.sid)
    console.log("Message status:", message.status)
    return true
  } catch (error) {
    console.error("Error sending OTP via WhatsApp:", error)
    return false
  }
}

export function isTwilioWhatsAppConfigured(): boolean {
  return !!(accountSid && authToken && fromWhatsAppNumber)
}
