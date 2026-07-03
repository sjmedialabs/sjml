import { NextResponse } from "next/server"
import { getHomeContent } from "@/lib/models/content"
import { normalizeHomeContent } from "@/lib/home-content"

export const dynamic = "force-dynamic"
export const revalidate = 60

export async function GET() {
  try {
    const content = await getHomeContent()
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }
    return NextResponse.json(normalizeHomeContent(content as unknown as Record<string, unknown>))
  } catch (error) {
    console.error("Get home API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
