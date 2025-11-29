import { type NextRequest, NextResponse } from "next/server"
import { addLead } from "@/lib/models/lead"

// Webhook endpoint for Meta Ads and Google Ads lead forms
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const source = request.headers.get("x-lead-source") || "webhook"

    // Handle Meta (Facebook) Lead Ads webhook
    if (body.object === "page" && body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          if (change.field === "leadgen") {
            const leadData = change.value
            await addLead({
              name:
                leadData.field_data?.find((f: { name: string; values: string[] }) => f.name === "full_name")
                  ?.values?.[0] || "Meta Lead",
              email:
                leadData.field_data?.find((f: { name: string; values: string[] }) => f.name === "email")?.values?.[0] ||
                "",
              phone: leadData.field_data?.find((f: { name: string; values: string[] }) => f.name === "phone_number")
                ?.values?.[0],
              message: `Lead from Meta Ads - Form ID: ${leadData.form_id}`,
              source: "meta_ads",
              status: "new",
              campaign: {
                platform: "Meta",
                campaignName: leadData.campaign_name,
                adSetName: leadData.adset_name,
                adName: leadData.ad_name,
              },
            })
          }
        }
      }
      return NextResponse.json({ success: true })
    }

    // Handle Google Ads webhook (via Zapier, Make, or custom integration)
    if (body.google_lead || source === "google_ads") {
      const leadData = body.google_lead || body
      await addLead({
        name: leadData.name || leadData.full_name || "Google Lead",
        email: leadData.email || "",
        phone: leadData.phone || leadData.phone_number,
        message: leadData.message || `Lead from Google Ads - Campaign: ${leadData.campaign_name || "Unknown"}`,
        source: "google_ads",
        status: "new",
        campaign: {
          platform: "Google",
          campaignName: leadData.campaign_name || leadData.campaign,
        },
      })
      return NextResponse.json({ success: true })
    }

    // Generic webhook format
    await addLead({
      name: body.name || body.full_name || "Webhook Lead",
      email: body.email || "",
      phone: body.phone || body.phone_number,
      message: body.message || body.notes || "Lead received via webhook",
      source: "other",
      status: "new",
      campaign: {
        platform: body.platform,
        campaignName: body.campaign || body.campaign_name,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// Verify webhook for Meta (Facebook) - required for setup
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "sjmedialabs_webhook_verify"

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
