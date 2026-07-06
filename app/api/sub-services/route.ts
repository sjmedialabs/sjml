import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getDisplayOrder, sortByDisplayOrder } from "@/lib/service-order"
import { createDefaultServiceDetailTemplate } from "@/lib/service-detail-template"
import { normalizeSubServiceMeta, syncSubServiceImages } from "@/lib/sub-service-document"

export const dynamic = "force-dynamic"
const COLLECTION = "sub-services"

function serialize(doc: any) {
  if (!doc) return null
  return { ...doc, _id: doc._id.toString(), id: doc._id.toString() }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentSlug = searchParams.get("parentSlug")
    const slug = searchParams.get("slug")
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    if (parentSlug && slug) {
      const one = await db.collection(COLLECTION).findOne({ parentSlug, slug, isActive: true })
      if (!one) return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
      return NextResponse.json(serialize(one))
    }

    if (parentSlug) {
      const list = await db.collection(COLLECTION).find({ parentSlug, isActive: true }).toArray()
      const sorted = sortByDisplayOrder(list)
      return NextResponse.json(sorted.map(serialize))
    }

    const nav = searchParams.get("nav") === "true"
    if (nav) {
      const list = await db
        .collection(COLLECTION)
        .find({ isActive: true })
        .sort({ parentSlug: 1, displayOrder: 1, createdAt: -1 })
        .toArray()
      return NextResponse.json(list.map(serialize))
    }

    // Admin: all sub-services, optionally filter by parent
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const parent = searchParams.get("parent")
    const skip = (page - 1) * limit
    const filter = parent ? { parentSlug: parent } : {}
    const total = await db.collection(COLLECTION).countDocuments(filter)
    const allItems = await db.collection(COLLECTION).find(filter).toArray()
    const sorted = sortByDisplayOrder(allItems, (a, b) => String(a.parentSlug).localeCompare(String(b.parentSlug)))
    const list = sorted.slice(skip, skip + limit)

    return NextResponse.json({
      subServices: list.map(serialize),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Get sub-services error:", error)
    return NextResponse.json({ error: "Failed to fetch sub-services" }, { status: 500 })
  }
}

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

    const data = await request.json()
    const synced = syncSubServiceImages(data as Record<string, unknown>)
    const meta = normalizeSubServiceMeta(synced, String(synced.name ?? ""))
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const parentTitle = synced.parentTitle ?? synced.parentSlug ?? ""
    const doc = {
      parentSlug: synced.parentSlug ?? "",
      slug: synced.slug ?? "",
      name: synced.name ?? "",
      bannerImage: synced.bannerImage ?? "",
      shortDescription: synced.shortDescription ?? "",
      fullDescription: synced.fullDescription ?? "",
      metaTitle: meta.metaTitle,
      metaDescription: meta.metaDescription,
      detailTemplate:
        synced.detailTemplate ??
        createDefaultServiceDetailTemplate(String(synced.name ?? ""), String(parentTitle).toUpperCase()),
      sections: Array.isArray(synced.sections) ? synced.sections : [],
      pageLayout: synced.pageLayout ?? {},
      portfolioUrl: synced.portfolioUrl ?? "",
      brochureUrl: synced.brochureUrl ?? "",
      displayOrder: getDisplayOrder(synced.displayOrder),
      isActive: synced.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(COLLECTION).insertOne(doc)
    const inserted = await db.collection(COLLECTION).findOne({ _id: result.insertedId })
    revalidatePath("/services")
    if (doc.parentSlug) {
      revalidatePath(`/services/${doc.parentSlug}`)
      if (doc.slug) revalidatePath(`/services/${doc.parentSlug}/${doc.slug}`)
    }
    return NextResponse.json(serialize(inserted), { status: 201 })
  } catch (error) {
    console.error("Create sub-service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
