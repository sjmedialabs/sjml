import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getHomeContent, updateHomeContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

export async function GET() {
  try {
    const content = await getHomeContent()

    if (content) {
      return NextResponse.json(content)
    }

    // Return default content if database is empty
    const defaultContent = getDefaultPageContent("home")
    return NextResponse.json(defaultContent)
  } catch (error) {
    console.error("Get home content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    if (!verifyToken(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { section, data } = await request.json()

    const validSections = [
      "hero",
      "stats",
      "caseStudies",
      "services",
      "industries",
      "testimonials",
      "insights",
      "playbook",
      "partners",
      "footer",
      "settings",
      "statsBackgroundImage",
      "servicesBackgroundImage",
      "industriesBackgroundImage",
      "caseStudiesBackgroundImage",
      "testimonialsBackgroundImage",
      "insightsBackgroundImage",
      "trustedByBackgroundImage",
      "playbookBackgroundImage",
    ]

    if (!validSections.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 })
    }

    const updatedContent = await updateHomeContent(section, data)
    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error("Update home content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
