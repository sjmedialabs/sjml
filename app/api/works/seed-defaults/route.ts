import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"
import { DEFAULT_WORKS_LIST } from "@/lib/default-works-list"

export const dynamic = "force-dynamic"

/** Seed default portfolio works from mockup (skips slugs that already exist). */
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
    const collection = db.collection("works")

    const existingSlugs = new Set(
      (await collection.find({}, { projection: { slug: 1 } }).toArray()).map((w) => w.slug as string),
    )

    const now = new Date().toISOString()
    const toInsert = DEFAULT_WORKS_LIST.filter((w) => !existingSlugs.has(w.slug)).map((work) => ({
      ...work,
      category: work.categoryTags,
      tags: work.categories,
      createdAt: now,
      updatedAt: now,
    }))

    if (toInsert.length > 0) {
      await collection.insertMany(toInsert)
    }

    revalidatePath("/work")
    DEFAULT_WORKS_LIST.forEach((w) => revalidatePath(`/work/${w.slug}`))

    return NextResponse.json({
      inserted: toInsert.length,
      skipped: DEFAULT_WORKS_LIST.length - toInsert.length,
      total: DEFAULT_WORKS_LIST.length,
    })
  } catch (error) {
    console.error("Seed works error:", error)
    return NextResponse.json({ error: "Failed to seed works" }, { status: 500 })
  }
}
