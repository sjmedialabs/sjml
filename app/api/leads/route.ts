import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getLeads, addLead } from "@/lib/models/lead"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const leads = await getLeads()
    return NextResponse.json(leads)
  } catch (error) {
    console.error("Get leads error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const newLead = await addLead({
      name: body.name || "",
      email: body.email,
      phone: body.phone,
      company: body.company,
      message: body.message,
      service: body.service,
      budget: body.budget,
      source: body.source || "website",
      status: "new",
    })

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error("Add lead error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
