import { type NextRequest, NextResponse } from "next/server"
import { clientPromise } from "@/lib/mongodb"
import type { Document } from "mongodb"
import { verifyToken } from "@/lib/jwt"
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
  navigation: string
  createdAt: string
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

export async function GET() {
  try {
    const client = await clientPromise
    const collection = client.db("sjmedialabs").collection<LandingPageRecord>("landingPages")

    const pages = await collection
      .find({ slug: { $ne: "template-1" } })
      .sort({ title: 1 })
      .toArray()
    return NextResponse.json(
      pages.map(({ _id, ...page }) => ({ ...page, navigation: page.navigation ?? "" })),
    )
  } catch (error) {
    console.error("Get landing pages error:", error)
    return NextResponse.json({ error: "Failed to fetch landing pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!verifyToken(authHeader.slice("Bearer ".length))) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  try {
    const body: unknown = await request.json()
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid page details" }, { status: 400 })
    }

    const data = body as Record<string, unknown>
    const title = typeof data.title === "string" ? data.title.trim() : ""
    const slug = typeof data.slug === "string" ? data.slug.trim().toLowerCase() : ""
    const navigation = typeof data.navigation === "string" ? data.navigation : ""
    const template = data.template
    const sectionData = normalizeTemplate1PageData(data.sectionData ?? defaultTemplate1PageData)
    const seoData = normalizeLandingPageSeo(data.seoData)

    if (!title || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: "Enter a title and a valid URL slug" }, { status: 400 })
    }
    if (reservedSlugs.has(slug)) {
      return NextResponse.json({ error: "This URL slug is reserved" }, { status: 400 })
    }
    if (template !== "Template 1") {
      return NextResponse.json({ error: "Select a valid page template" }, { status: 400 })
    }

    const client = await clientPromise
    const collection = client.db("sjmedialabs").collection<LandingPageRecord>("landingPages")
    await collection.createIndex({ slug: 1 }, { unique: true })

    const existingPage = await collection.findOne({ slug })
    if (existingPage) {
      return NextResponse.json({ error: "This URL slug is already in use" }, { status: 409 })
    }

    const now = new Date().toISOString()
    const page: LandingPageRecord = {
      title,
      route: `/${slug}`,
      slug,
      status: "Disabled",
      sections: 12,
      template: "Template 1",
      navigation,
      createdAt: now,
      updated: now,
      sectionData,
      enabledSections: normalizeTemplate1SectionVisibility(data.enabledSections),
      seoData,
    }

    await collection.insertOne(page)
    const { _id, ...serializedPage } = page
    return NextResponse.json(serializedPage, { status: 201 })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json({ error: "This URL slug is already in use" }, { status: 409 })
    }
    console.error("Create landing page error:", error)
    return NextResponse.json({ error: "Failed to create landing page" }, { status: 500 })
  }
}
