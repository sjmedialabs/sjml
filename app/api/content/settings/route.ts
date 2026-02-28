import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const collection = await getCollection("content")
    const settingsData = await collection.findOne({ pageKey: "settings" })
    
    if (!settingsData) {
      // Return default settings if not found
      return NextResponse.json({
        siteName: "SJ Media Labs",
        siteTagline: "Transform Your Brand",
        metaTitle: "SJ Media Labs | Transform Your Brand",
        metaDescription: "Strategic brand development, identity design, and brand management.",
        contactEmail: "info@sjmedialabs.com",
        contactPhone: "+91 1234567890",
        socialMedia: {
          facebook: "",
          twitter: "@sjmedialabs",
          instagram: "",
          linkedin: "",
          youtube: ""
        },
        businessHours: "Mon-Fri: 9:00 AM - 6:00 PM",
        address: "Hyderabad, India"
      })
    }
    
    return NextResponse.json(settingsData)
  } catch (error) {
    console.error("Get settings error:", error)
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
    
    // Update or insert settings data
    await collection.updateOne(
      { pageKey: "settings" },
      { 
        $set: { 
          ...data,
          pageKey: "settings",
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    )
    
    // Revalidate all pages since settings affect entire site
    revalidatePath("/", "layout")
    
    // Fetch and return updated data
    const updated = await collection.findOne({ pageKey: "settings" })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
