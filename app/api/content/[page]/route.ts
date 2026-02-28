import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getPageContent, updatePageContent } from "@/lib/models/content"

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

// Map page keys to their URL paths for revalidation
const pagePathMap: Record<string, string[]> = {
  home: ["/"],
  about: ["/about"],
  work: ["/work"],
  services: ["/services"],
  "case-studies": ["/case-studies"],
  "case-studies-page": ["/case-studies"],
  careers: ["/careers"],
  contact: ["/contact"],
  insights: ["/insights"],
  "insights-page": ["/insights"],
  testimonials: ["/testimonials"],
  "testimonials-page": ["/testimonials"],
  clients: ["/clients"],
  header: ["/", "/about", "/work", "/services", "/case-studies", "/careers", "/contact", "/insights", "/testimonials", "/clients"],
  seo: ["/", "/about", "/work", "/services", "/case-studies", "/careers", "/contact", "/insights", "/testimonials", "/clients"],
}

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

    // Revalidate the affected page paths
    const pathsToRevalidate = pagePathMap[page] || [`/${page}`]
    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update page content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
