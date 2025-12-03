import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const all = searchParams.get("all") === "true"

    const client = await clientPromise
    const db = client.db("sjmedialabs")

    if (all) {
      // Return all active services for frontend
      const services = await db.collection("services").find({ isActive: true }).sort({ createdAt: -1 }).toArray()
      // Convert MongoDB _id to string for JSON serialization
      const serializedServices = services.map(service => ({
        ...service,
        _id: service._id.toString()
      }))
      return NextResponse.json(serializedServices)
    }

    // Paginated results for admin
    const skip = (page - 1) * limit
    const total = await db.collection("services").countDocuments()
    const services = await db.collection("services").find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // Convert MongoDB _id to string for JSON serialization
    const serializedServices = services.map(service => ({
      ...service,
      _id: service._id.toString()
    }))

    return NextResponse.json({
      services: serializedServices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get services error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
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

    const service = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    }

    await db.collection("services").insertOne(service)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Create service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
