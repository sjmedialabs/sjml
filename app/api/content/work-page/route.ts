import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getPageContent, updatePageContent } from "@/lib/models/content"
import { createDefaultWorkPageContent, normalizeWorkPageContent } from "@/lib/work-page-content"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const raw = await getPageContent("work")
    if (raw) {
      return NextResponse.json(normalizeWorkPageContent(raw as Record<string, unknown>))
    }
    return NextResponse.json(createDefaultWorkPageContent())
  } catch (error) {
    console.error("Get work page content error:", error)
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

    const body = await request.json()
    const normalized = normalizeWorkPageContent(body)

    await updatePageContent("work", {
      pageKey: "work",
      workPage: normalized,
      hero: {
        title: `${normalized.hero.titleLine1} ${normalized.hero.titleHighlight}`,
        description: normalized.hero.description,
        image: normalized.hero.image,
        label: normalized.hero.label,
        titleLine1: normalized.hero.titleLine1,
        titleHighlight: normalized.hero.titleHighlight,
      },
      typography: normalized.typography,
    })

    revalidatePath("/work")

    return NextResponse.json(normalized)
  } catch (error) {
    console.error("Update work page content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
