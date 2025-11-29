import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getPageContent, updatePageContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

const validPages = [
  "home",
  "about",
  "work",
  "services",
  "case-studies",
  "case-studies-page",
  "careers",
  "contact",
  "insights",
  "insights-page",
  "testimonials",
  "testimonials-page",
  "clients",
  "header",
  "seo",
]

export async function GET(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  try {
    const { page } = await params

    if (!validPages.includes(page)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 })
    }

    const content = await getPageContent(page)

    if (content) {
      return NextResponse.json(content)
    }

    // Return default content if not found in database
    const defaultData = getDefaultPageContent(page)
    return NextResponse.json(defaultData || {})
  } catch (error) {
    console.error("Get page content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { page } = await params
    const body = await request.json()

    if (!validPages.includes(page)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 })
    }

    const updated = await updatePageContent(page, body)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update page content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
