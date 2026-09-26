import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"
import { normalizeScripts, validateScriptAssignments } from "@/lib/site-scripts"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const collection = await getCollection("content")
    const doc = await collection.findOne({ pageKey: "scripts" })
    return NextResponse.json({ scripts: normalizeScripts(doc) })
  } catch (error) {
    console.error("Get scripts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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
    const scripts = normalizeScripts(data)
    const validationError = validateScriptAssignments(scripts)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const collection = await getCollection("content")
    await collection.updateOne(
      { pageKey: "scripts" },
      {
        $set: {
          pageKey: "scripts",
          scripts,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    revalidatePath("/", "layout")

    const updated = await collection.findOne({ pageKey: "scripts" })
    return NextResponse.json({ scripts: normalizeScripts(updated) })
  } catch (error) {
    console.error("Update scripts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
