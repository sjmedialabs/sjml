import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getPageContent, updatePageContent } from "@/lib/models/content"
import {
  createDefaultContactPageContent,
  normalizeContactPageContent,
} from "@/lib/contact-page-content"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const raw = await getPageContent("contact")
    if (raw) {
      return NextResponse.json(normalizeContactPageContent(raw as Record<string, unknown>))
    }
    return NextResponse.json(createDefaultContactPageContent())
  } catch (error) {
    console.error("Get contact page content error:", error)
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
    const normalized = normalizeContactPageContent(body)

    await updatePageContent("contact", {
      pageKey: "contact",
      contactPage: normalized,
      hero: {
        title: `${normalized.hero.titleLine1} ${normalized.hero.titleHighlight} ${normalized.hero.titleLine2}`.trim(),
        description: normalized.hero.description,
        image: normalized.hero.image,
        titleLine1: normalized.hero.titleLine1,
        titleHighlight: normalized.hero.titleHighlight,
        titleLine2: normalized.hero.titleLine2,
      },
      form: normalized.form,
      info: normalized.info,
      map: normalized.map,
      bottomCta: normalized.bottomCta,
      typography: normalized.typography,
    })

    revalidatePath("/contact")

    return NextResponse.json(normalized)
  } catch (error) {
    console.error("Update contact page content error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
