// AWS SNS Service for OTP
// Install: npm install @aws-sdk/client-sns

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function sendOTP(phone: string, otp: string, name: string): Promise<boolean> {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("AWS credentials not configured. Check environment variables.")
    return false
  }

  try {
    const params = {
      Message: `Hi ${name}, your OTP for downloading the Brand Strategy Playbook is: ${otp}. Valid for 5 minutes.`,
      PhoneNumber: phone,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional", // Use "Transactional" for OTPs
        },
      },
    }

    const command = new PublishCommand(params)
    const response = await snsClient.send(command)

    console.log("OTP sent successfully:", response.MessageId)
    return true
  } catch (error) {
    console.error("Error sending OTP via AWS SNS:", error)
    return false
  }
}

export function isAWSSNSConfigured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
}
