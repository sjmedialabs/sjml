import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"
import { DEFAULT_INSIGHTS_LIST } from "@/lib/default-insights-list"

export const dynamic = "force-dynamic"

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
    const collection = db.collection("insights")

    const existingSlugs = new Set(
      (await collection.find({}, { projection: { slug: 1 } }).toArray()).map((d) => d.slug as string),
    )

    const now = new Date().toISOString()
    const toInsert = DEFAULT_INSIGHTS_LIST.filter((p) => !existingSlugs.has(p.slug)).map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }))

    if (toInsert.length > 0) {
      await collection.insertMany(toInsert)
    }

    revalidatePath("/insights")
    DEFAULT_INSIGHTS_LIST.forEach((p) => revalidatePath(`/insights/${p.slug}`))

    return NextResponse.json({
      inserted: toInsert.length,
      skipped: DEFAULT_INSIGHTS_LIST.length - toInsert.length,
      total: DEFAULT_INSIGHTS_LIST.length,
    })
  } catch (error) {
    console.error("Seed insights error:", error)
    return NextResponse.json({ error: "Failed to seed insights" }, { status: 500 })
  }
}
