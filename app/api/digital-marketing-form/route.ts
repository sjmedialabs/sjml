import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import { sendDigitalMarketingFormEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check - if this hidden field is filled, it's a bot
    if (body._honeypot) {
      // Silently succeed to not tip off the bot
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Timing check - reject if submitted in under 3 seconds
    if (body._loadedAt) {
      const elapsed = Date.now() - Number(body._loadedAt)
      if (elapsed < 3000) {
        return NextResponse.json({ success: true }, { status: 200 })
      }
    }

    // Validate required fields
    if (!body.companyName?.trim()) {
      return NextResponse.json({ error: "Company Name is required" }, { status: 400 })
    }
    if (!body.contactPerson?.trim()) {
      return NextResponse.json({ error: "Contact Person is required" }, { status: 400 })
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email.trim())) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Phone validation (required)
    if (!body.phone?.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }
    if (body.phone?.trim()) {
      const digits = body.phone.replace(/\D/g, "")
      if (digits.length < 10) {
        return NextResponse.json({ error: "Phone number must have at least 10 digits" }, { status: 400 })
      }
    }

    // Remove internal fields before storing
    const { _honeypot, _loadedAt, ...formData } = body

    // Store in MongoDB
    try {
      const collection = await getCollection("digital_marketing_submissions")
      await collection.insertOne({
        ...formData,
        submittedAt: new Date(),
        status: "new",
      })
    } catch (dbError) {
      console.error("Failed to store submission in DB:", dbError)
      // Continue even if DB fails - still try to send email
    }

    // Send email
    try {
      await sendDigitalMarketingFormEmail(formData)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Log the submission data so it's not lost
      console.log("FORM SUBMISSION DATA (email failed):", JSON.stringify(formData, null, 2))
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Digital marketing form submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
