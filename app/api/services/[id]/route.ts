import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    // Try to find by slug first, then by id
    let service = await db.collection("services").findOne({ slug: id })
    if (!service) {
      service = await db.collection("services").findOne({ id })
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Convert MongoDB _id to string for JSON serialization
    const serializedService = {
      ...service,
      _id: service._id.toString()
    }

    return NextResponse.json(serializedService)
  } catch (error) {
    console.error("Get service error:", error)
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

    const result = await db.collection("services").updateOne({ id }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ ...updateData, id })
  } catch (error) {
    console.error("Update service error:", error)
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

    const result = await db.collection("services").deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
