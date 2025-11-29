import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getLeads, addLead } from "@/lib/models/lead"

export const dynamic = "force-dynamic"

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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const all = searchParams.get("all") === "true"
    const status = searchParams.get("status")
    const source = searchParams.get("source")

    const allLeads = await getLeads()
    
    // Apply filters
    let filteredLeads = allLeads
    if (status && status !== "all") {
      filteredLeads = filteredLeads.filter((lead) => lead.status === status)
    }
    if (source && source !== "all") {
      filteredLeads = filteredLeads.filter((lead) => lead.source === source)
    }

    // Return all for export
    if (all) {
      return NextResponse.json({ leads: filteredLeads })
    }

    // Paginate
    const total = filteredLeads.length
    const skip = (page - 1) * limit
    const paginatedLeads = filteredLeads.slice(skip, skip + limit)

    // Serialize MongoDB _id to string
    const serializedLeads = paginatedLeads.map((lead) => ({
      ...lead,
      id: lead._id?.toString() || "",
      _id: lead._id?.toString(),
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      leads: serializedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
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
      subject: body.subject,
      message: body.message || "",
      service: body.service,
      budget: body.budget,
      source: body.source || "website",
      status: "new",
    })

    // Serialize the response
    const serializedLead = {
      ...newLead,
      id: newLead._id?.toString() || "",
      _id: newLead._id?.toString(),
      createdAt: newLead.createdAt.toISOString(),
      updatedAt: newLead.updatedAt.toISOString(),
    }

    return NextResponse.json(serializedLead, { status: 201 })
  } catch (error) {
    console.error("Add lead error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
