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
    const featured = searchParams.get("featured") === "true"

    const client = await clientPromise
    const db = client.db("sjmedialabs")

    if (all) {
      const filter: any = { isActive: true }
      if (featured) filter.isFeatured = true

      const works = await db.collection("works").find(filter).sort({ createdAt: -1 }).toArray()
      // Convert MongoDB _id to string for JSON serialization
      const serializedWorks = works.map(work => ({
        ...work,
        _id: work._id.toString()
      }))
      return NextResponse.json(serializedWorks)
    }

    // Paginated results for admin
    const skip = (page - 1) * limit
    const total = await db.collection("works").countDocuments()
    const works = await db.collection("works").find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // Convert MongoDB _id to string for JSON serialization
    const serializedWorks = works.map(work => ({
      ...work,
      _id: work._id.toString()
    }))

    return NextResponse.json({
      works: serializedWorks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get works error:", error)
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 })
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

    const work = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      isFeatured: data.isFeatured || false,
    }

    await db.collection("works").insertOne(work)
    return NextResponse.json(work, { status: 201 })
  } catch (error) {
    console.error("Create work error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
