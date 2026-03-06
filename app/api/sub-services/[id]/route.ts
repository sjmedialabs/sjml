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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const sub = await db.collection(COLLECTION).findOne({
      $or: [{ _id: ObjectId.isValid(id) ? new ObjectId(id) : null }, { slug: id }],
    })
    if (!sub) return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
    return NextResponse.json(serialize(sub))
  } catch (error) {
    console.error("Get sub-service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.split(" ")[1]
    if (!verifyToken(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const update: Record<string, unknown> = {
      parentSlug: data.parentSlug,
      slug: data.slug,
      name: data.name,
      bannerImage: data.bannerImage,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      portfolioUrl: data.portfolioUrl,
      brochureUrl: data.brochureUrl,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
      updatedAt: new Date(),
    }
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k])

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: id }
    const existing = await db.collection(COLLECTION).findOne(filter)
    if (!existing) return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
    await db.collection(COLLECTION).updateOne(filter, { $set: update })
    const parentSlug = data.parentSlug ?? existing.parentSlug
    revalidatePath("/services")
    if (parentSlug) revalidatePath(`/services/${parentSlug}`)
    return NextResponse.json({ success: true, ...update })
  } catch (error) {
    console.error("Update sub-service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.split(" ")[1]
    if (!verifyToken(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: id }
    const doc = await db.collection(COLLECTION).findOne(filter)
    const result = await db.collection(COLLECTION).deleteOne(filter)
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
    }
    const parentSlug = doc?.parentSlug
    revalidatePath("/services")
    if (parentSlug) revalidatePath(`/services/${parentSlug}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete sub-service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
