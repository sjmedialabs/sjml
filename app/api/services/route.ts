import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

const defaultServices = [
  {
    id: "1",
    slug: "research-strategy",
    title: "Research & Strategy",
    description: "Strategic brand development, identity design, and brand management to create memorable experiences.",
    icon: "research-strategy",
    linkText: "Explore Service",
    image: "/research-strategy-business.jpg",
    fullDescription:
      "We provide comprehensive research and strategy services to help your brand succeed in competitive markets.",
    offerings: [
      "Brand strategy development",
      "Market research",
      "Competitor analysis",
      "Customer insights",
      "Strategic planning",
    ],
    benefits: {
      title: "Benefits of Research & Strategy",
      description:
        "Our strategic approach ensures your brand stands out and connects with your target audience effectively.",
    },
    features: {
      title: "Key Features",
      points: ["Data-driven insights", "Actionable recommendations", "Competitive advantage", "Market positioning"],
    },
    process: [
      { icon: "thinking", title: "Discovery", description: "Understanding your business and goals" },
      { icon: "analysis", title: "Research", description: "Deep market and competitor analysis" },
      { icon: "strategy", title: "Strategy", description: "Creating actionable strategic plans" },
    ],
    faqs: [
      {
        question: "What is included in research services?",
        answer:
          "Our research services include market analysis, competitor research, customer insights, and strategic recommendations.",
      },
      {
        question: "How long does the strategy process take?",
        answer: "Typically 4-6 weeks depending on the scope and complexity of your project.",
      },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const all = searchParams.get("all") === "true"

    const client = await clientPromise
    const db = client.db("sjmedialabs")

    if (all) {
      // Return all active services for frontend
      const services = await db.collection("services").find({ isActive: true }).sort({ createdAt: -1 }).toArray()
      if (services.length === 0) {
        return NextResponse.json(defaultServices)
      }
      // Convert MongoDB _id to string for JSON serialization
      const serializedServices = services.map(service => ({
        ...service,
        _id: service._id.toString()
      }))
      return NextResponse.json(serializedServices)
    }

    // Paginated results for admin
    const skip = (page - 1) * limit
    const total = await db.collection("services").countDocuments()
    const services = await db.collection("services").find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // Convert MongoDB _id to string for JSON serialization
    const serializedServices = services.map(service => ({
      ...service,
      _id: service._id.toString()
    }))

    return NextResponse.json({
      services: serializedServices.length > 0 ? serializedServices : defaultServices,
      pagination: {
        page,
        limit,
        total: total || defaultServices.length,
        totalPages: Math.ceil((total || defaultServices.length) / limit),
      },
    })
  } catch (error) {
    console.error("Get services error:", error)
    return NextResponse.json({ services: defaultServices, pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } })
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

    const service = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    }

    await db.collection("services").insertOne(service)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Create service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
