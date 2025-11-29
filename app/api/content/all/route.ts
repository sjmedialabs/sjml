import { NextResponse } from "next/server"
import { getHomeContent, getPageContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const homeContent = (await getHomeContent()) || getDefaultPageContent("home")

    const pages = ["about", "work", "services", "case-studies", "careers", "contact"]
    const pageContent: Record<string, any> = {}

    for (const page of pages) {
      const content = await getPageContent(page)
      pageContent[page] = content || getDefaultPageContent(page)
    }

    return NextResponse.json({
      home: homeContent,
      pages: pageContent,
    })
  } catch (error) {
    console.error("Get all content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
