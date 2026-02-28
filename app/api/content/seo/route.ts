import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const collection = await getCollection("content")
    const seoData = await collection.findOne({ pageKey: "seo" })
    
    if (!seoData) {
      return NextResponse.json({ error: "SEO not found. Configure in admin." }, { status: 404 })
    }

    return NextResponse.json(seoData)
  } catch (error) {
    console.error("Get SEO error:", error)
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
    const collection = await getCollection("content")
    
    // Remove _id from data to prevent MongoDB error
    const { _id, ...updateData } = data
    
    // Update or insert SEO data
    await collection.updateOne(
      { pageKey: "seo" },
      { 
        $set: { 
          ...updateData,
          pageKey: "seo",
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    )
    
    // Fetch and return updated data
    const updated = await collection.findOne({ pageKey: "seo" })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update SEO error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
