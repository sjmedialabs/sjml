import { NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"

/**
 * GET /api/content/status
 * Returns which content documents exist in DB (for QA / admin).
 * No auth required - only returns page keys, not content.
 */
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const collection = await getCollection<{ pageKey: string }>("content")
    const docs = await collection.find({}, { projection: { pageKey: 1, updatedAt: 1 } }).toArray()
    const status = docs.map((d) => ({
      pageKey: d.pageKey,
      updatedAt: (d as any).updatedAt,
    }))
    return NextResponse.json({
      message: "Content status from database. All website content should come from here.",
      count: status.length,
      pages: status.map((s) => s.pageKey),
      details: status,
    })
  } catch (error) {
    console.error("Content status error:", error)
    return NextResponse.json({ error: "Failed to get content status" }, { status: 500 })
  }
}
