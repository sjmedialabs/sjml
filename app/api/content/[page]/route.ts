import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getPageContent, updatePageContent } from "@/lib/models/content"
import { normalizeHeaderContent } from "@/lib/header-content"

const validPages = [
  "home",
  "about",
  "work",
  "services",
  "industries",
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

// Map page keys to their URL paths for revalidation
const pagePathMap: Record<string, string[]> = {
  home: ["/"],
  about: ["/about"],
  work: ["/work"],
  services: ["/services"],
  industries: ["/industries"],
  "case-studies": ["/case-studies"],
  "case-studies-page": ["/case-studies"],
  careers: ["/careers"],
  contact: ["/contact"],
  insights: ["/insights"],
  "insights-page": ["/insights"],
  testimonials: ["/testimonials"],
  "testimonials-page": ["/testimonials"],
  clients: ["/clients"],
  header: ["/", "/about", "/work", "/services", "/industries", "/case-studies", "/careers", "/contact", "/insights", "/testimonials", "/clients"],
  seo: ["/", "/about", "/work", "/services", "/industries", "/case-studies", "/careers", "/contact", "/insights", "/testimonials", "/clients"],
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  try {
    const { page } = await params

    if (!validPages.includes(page)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 })
    }

    const content = await getPageContent(page)

    if (content) {
      if (page === "header") {
        return NextResponse.json(normalizeHeaderContent(content as Record<string, unknown>))
      }
      return NextResponse.json(content)
    }

    if (page === "header") {
      return NextResponse.json(normalizeHeaderContent({}))
    }

    return NextResponse.json({ error: "Content not found" }, { status: 404 })
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
    const tokenPayload = verifyToken(token)
    if (!tokenPayload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { page } = await params
    const body = await request.json()

    if (!validPages.includes(page)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 })
    }

    const updateData = page === "header" ? normalizeHeaderContent(body as Record<string, unknown>) : body
    const updated = await updatePageContent(page, updateData)

    // Revalidate the affected page paths
    const pathsToRevalidate = pagePathMap[page] || [`/${page}`]
    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return NextResponse.json(page === "header" ? normalizeHeaderContent(updated as Record<string, unknown>) : updated)
  } catch (error) {
    console.error("Update page content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
