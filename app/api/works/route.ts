import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

const defaultWorks = [
  {
    id: "1",
    slug: "urvi-constructions",
    title: "URVI CONSTRUCTIONS",
    description: "Complete brand identity and web design for a leading construction company",
    image: "/construction-branding.jpg",
    category: "Branding",
    client: "URVI Constructions",
    industry: "Real Estate",
    role: "Branding / Web Design",
    technology: "Web | UI | UX",
    year: "2025",
    tags: ["Logo & Identity", "Web Design", "Development"],
    overview: {
      title: "Brand Overview",
      description: "Complete brand identity redesign for a premier construction company.",
      points: ["Branding and identity", "Websites and digital platforms", "Content strategy"],
    },
    logoVariations: [],
    gallery: [],
    process: [
      { step: "01", title: "Discovery", description: "Understanding the brand vision and goals" },
      { step: "02", title: "Design", description: "Creating visual identity and web layouts" },
      { step: "03", title: "Development", description: "Building the final website" },
    ],
    showcase: [],
    isActive: true,
    isFeatured: false,
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
    const featured = searchParams.get("featured") === "true"

    const client = await clientPromise
    const db = client.db("sjmedialabs")

    if (all) {
      const filter: any = { isActive: true }
      if (featured) filter.isFeatured = true

      const works = await db.collection("works").find(filter).sort({ createdAt: -1 }).toArray()
      if (works.length === 0) {
        return NextResponse.json(defaultWorks)
      }
      return NextResponse.json(works)
    }

    // Paginated results for admin
    const skip = (page - 1) * limit
    const total = await db.collection("works").countDocuments()
    const works = await db.collection("works").find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({
      works: works.length > 0 ? works : defaultWorks,
      pagination: {
        page,
        limit,
        total: total || defaultWorks.length,
        totalPages: Math.ceil((total || defaultWorks.length) / limit),
      },
    })
  } catch (error) {
    console.error("Get works error:", error)
    return NextResponse.json({ works: defaultWorks, pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } })
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

    const work = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      isFeatured: data.isFeatured || false,
    }

    await db.collection("works").insertOne(work)
    return NextResponse.json(work, { status: 201 })
  } catch (error) {
    console.error("Create work error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
