import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    // Try to find by slug first, then by id
    let work = await db.collection("works").findOne({ slug: id })
    if (!work) {
      work = await db.collection("works").findOne({ id })
    }

    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 })
    }

    return NextResponse.json(work)
  } catch (error) {
    console.error("Get work error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }
    delete updateData._id

    const result = await db.collection("works").updateOne({ id }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 })
    }

    return NextResponse.json({ ...updateData, id })
  } catch (error) {
    console.error("Update work error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const result = await db.collection("works").deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete work error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
