import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"
import { DEFAULT_SERVICES_LIST } from "@/lib/default-services-list"
import { createEmptySections, createDefaultPageLayout } from "@/lib/service-sections"

export const dynamic = "force-dynamic"

/** Seed the 8 default services from the mockup (skips slugs that already exist). */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.split(" ")[1]
    if (!verifyToken(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const collection = db.collection("services")

    const existingSlugs = new Set(
      (await collection.find({}, { projection: { slug: 1 } }).toArray()).map((s) => s.slug as string),
    )

    const now = new Date().toISOString()
    const toInsert = DEFAULT_SERVICES_LIST.filter((s) => !existingSlugs.has(s.slug)).map((service) => ({
      ...service,
      image: "",
      heroImage: "",
      fullDescription: "",
      offerings: [],
      benefits: { title: "", description: "" },
      features: { title: "", points: [] },
      process: [],
      faqs: [],
      sections: createEmptySections(),
      pageLayout: createDefaultPageLayout(),
      portfolioUrl: "",
      brochureUrl: "",
      createdAt: now,
      updatedAt: now,
    }))

    if (toInsert.length > 0) {
      await collection.insertMany(toInsert)
    }

    revalidatePath("/")
    revalidatePath("/services")

    return NextResponse.json({
      inserted: toInsert.length,
      skipped: DEFAULT_SERVICES_LIST.length - toInsert.length,
      total: DEFAULT_SERVICES_LIST.length,
    })
  } catch (error) {
    console.error("Seed services error:", error)
    return NextResponse.json({ error: "Failed to seed services" }, { status: 500 })
  }
}
