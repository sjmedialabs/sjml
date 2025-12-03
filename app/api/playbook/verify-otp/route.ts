import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"

// Import WhatsApp service
import { sendOTP as sendViaWhatsApp, isTwilioWhatsAppConfigured } from "@/lib/sms/twilio-whatsapp"

// Store OTPs temporarily (in production, use Redis or a proper cache)
const otpStore = new Map<string, { otp: string; expiresAt: number; name: string }>()

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 })
    }

    // Get stored OTP
    const stored = otpStore.get(phone)

    if (!stored) {
      return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
    }

    // Check if OTP is expired
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone)
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    // Verify OTP
    if (stored.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid - remove it
    otpStore.delete(phone)

    // Log the download request
    try {
      const collection = await getCollection("playbook-downloads")
      await collection.insertOne({
        name: name || stored.name,
        phone,
        downloadedAt: new Date(),
      })
    } catch (error) {
      console.error("Error logging download:", error)
    }

    return NextResponse.json({ success: true, message: "OTP verified successfully" })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Send OTP endpoint
export async function PUT(request: NextRequest) {
  try {
    const { phone, name } = await request.json()

    if (!phone || !name) {
      return NextResponse.json({ error: "Phone and name are required" }, { status: 400 })
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s-()]{10,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with 5 minutes expiry
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      name,
    })

    // Send OTP via WhatsApp
    let otpSent = false
    let sendError = null

    if (isTwilioWhatsAppConfigured()) {
      try {
        otpSent = await sendViaWhatsApp(phone, otp, name)
      } catch (error) {
        console.error("WhatsApp send failed:", error)
        sendError = error
      }
    }

    // Development mode fallback - return OTP in response
    if (!otpSent && process.env.NODE_ENV === "development") {
      console.log(`[DEV MODE] OTP for ${phone}: ${otp}`)
      return NextResponse.json({
        success: true,
        message: "OTP sent (Development Mode)",
        otp, // Only for development
        warning: "WhatsApp/SMS service not configured. Using development mode.",
      })
    }

    if (!otpSent) {
      return NextResponse.json(
        {
          error: "Failed to send OTP. Please try again or contact support.",
          details: process.env.NODE_ENV === "development" ? sendError : undefined,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to your WhatsApp",
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
