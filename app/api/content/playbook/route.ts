import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getHomeContent, updateHomeContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const content = await getHomeContent()
    return NextResponse.json(content?.playbook || getDefaultPageContent("home").playbook)
  } catch (error) {
    console.error("Get playbook error:", error)
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
    const updated = await updateHomeContent("playbook", data)
    return NextResponse.json(updated?.playbook)
  } catch (error) {
    console.error("Update playbook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
