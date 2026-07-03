import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"
import { sortByDisplayOrder } from "@/lib/service-order"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get("all") === "true"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const client = await clientPromise
    const db = client.db("sjmedialabs")

    if (all) {
      type InsightDoc = { displayOrder?: unknown; date?: unknown; createdAt?: unknown; _id?: { toString(): string }; id?: string }
      const insights = (await db.collection("insights").find({ published: { $ne: false } }).toArray()) as InsightDoc[]
      const sorted = sortByDisplayOrder(insights, (a, b) =>
        String(b.date ?? b.createdAt ?? "").localeCompare(String(a.date ?? a.createdAt ?? "")),
      )
      return NextResponse.json(
        sorted.map((doc) => ({ ...doc, _id: doc._id?.toString(), id: doc.id ?? doc._id?.toString() })),
      )
    }

    const skip = (page - 1) * limit
    const total = await db.collection("insights").countDocuments()
    const insights = await db.collection("insights").find().sort({ date: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({
      insights: insights.map((doc) => ({ ...doc, _id: doc._id.toString(), id: doc.id ?? doc._id.toString() })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Get insights error:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
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

    const insight = {
      ...data,
      id: data.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: data.published !== false,
    }

    await db.collection("insights").insertOne(insight)
    revalidatePath("/insights")
    if (insight.slug) revalidatePath(`/insights/${insight.slug}`)

    return NextResponse.json(insight, { status: 201 })
  } catch (error) {
    console.error("Create insight error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
