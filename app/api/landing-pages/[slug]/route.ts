import { type NextRequest, NextResponse } from "next/server"
import type { Document } from "mongodb"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"
import {
  defaultTemplate1PageData,
  normalizeTemplate1PageData,
  normalizeTemplate1SectionVisibility,
  type Template1PageData,
  type Template1SectionVisibility,
} from "@/components/template-1/default-data"
import {
  normalizeLandingPageSeo,
  type LandingPageSeo,
} from "@/lib/landing-pages"

export const dynamic = "force-dynamic"

interface LandingPageRecord extends Document {
  title: string
  route: string
  slug: string
  status: string
  sections: number
  template: string
  updated: string
  navigation?: string
  sectionData: Template1PageData
  enabledSections: Template1SectionVisibility
  seoData: LandingPageSeo
}

const reservedSlugs = new Set([
  "about",
  "admin",
  "api",
  "careers",
  "case-studies",
  "clients",
  "contact",
  "cookies",
  "industries",
  "insights",
  "privacy",
  "services",
  "template-1",
  "terms",
  "testimonials",
  "work",
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!verifyToken(authHeader.slice("Bearer ".length))) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  try {
    const { slug: currentSlug } = await params
    const body: unknown = await request.json()
    if (!isRecord(body)) {
      return NextResponse.json({ error: "Invalid page details" }, { status: 400 })
    }

    const client = await clientPromise
    const collection = client.db("sjmedialabs").collection<LandingPageRecord>("landingPages")

    if (typeof body.status === "string") {
      if (body.status !== "Enabled" && body.status !== "Disabled") {
        return NextResponse.json({ error: "Invalid page status" }, { status: 400 })
      }

      const result = await collection.findOneAndUpdate(
        { slug: currentSlug },
        { $set: { status: body.status, updated: new Date().toISOString() } },
        { returnDocument: "after" },
      )
      if (!result) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 })
      }
      const { _id, ...page } = result
      return NextResponse.json(page)
    }

    const title = typeof body.title === "string" ? body.title.trim() : ""
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : ""
    const navigation = typeof body.navigation === "string" ? body.navigation : ""
    const template = typeof body.template === "string" ? body.template : "Template 1"
    if (!title || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: "Enter a title and a valid URL slug" }, { status: 400 })
    }
    if (template !== "Template 1") {
      return NextResponse.json({ error: "Select a valid page template" }, { status: 400 })
    }
    if (reservedSlugs.has(slug)) {
      return NextResponse.json({ error: "This URL slug is reserved" }, { status: 400 })
    }

    const existingPage = slug === currentSlug ? null : await collection.findOne({ slug })
    if (existingPage) {
      return NextResponse.json({ error: "This URL slug is already in use" }, { status: 409 })
    }

    const updatedAt = new Date().toISOString()
    const result = await collection.findOneAndUpdate(
      { slug: currentSlug },
      {
        $set: {
          title,
          slug,
          route: `/${slug}`,
          navigation,
          template,
          sectionData: normalizeTemplate1PageData(body.sectionData ?? defaultTemplate1PageData),
          enabledSections: normalizeTemplate1SectionVisibility(body.enabledSections),
          seoData: normalizeLandingPageSeo(body.seoData),
          updated: updatedAt,
        },
      },
      { returnDocument: "after" },
    )
    if (!result) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    const { _id, ...page } = result
    return NextResponse.json(page)
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json({ error: "This URL slug is already in use" }, { status: 409 })
    }
    console.error("Update landing page error:", error)
    return NextResponse.json({ error: "Failed to update landing page" }, { status: 500 })
  }
}
