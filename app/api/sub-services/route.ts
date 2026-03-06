import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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
      const list = await db
        .collection(COLLECTION)
        .find({ parentSlug, isActive: true })
        .sort({ displayOrder: 1, createdAt: -1 })
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
    const list = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ parentSlug: 1, displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

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
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const doc = {
      parentSlug: data.parentSlug ?? "",
      slug: data.slug ?? "",
      name: data.name ?? "",
      bannerImage: data.bannerImage ?? "",
      shortDescription: data.shortDescription ?? "",
      fullDescription: data.fullDescription ?? "",
      portfolioUrl: data.portfolioUrl ?? "",
      brochureUrl: data.brochureUrl ?? "",
      displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : 0,
      isActive: data.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(COLLECTION).insertOne(doc)
    const inserted = await db.collection(COLLECTION).findOne({ _id: result.insertedId })
    revalidatePath("/services")
    if (doc.parentSlug) revalidatePath(`/services/${doc.parentSlug}`)
    return NextResponse.json(serialize(inserted), { status: 201 })
  } catch (error) {
    console.error("Create sub-service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
