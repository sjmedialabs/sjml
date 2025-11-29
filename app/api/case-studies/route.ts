import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { clientPromise } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

const defaultCaseStudies = [
  {
    id: "1",
    slug: "techcorp-rebranding",
    title: "TechCorp Global Rebranding",
    description: "Complete brand transformation resulting in 250% increase in brand recognition.",
    image: "/tech-branding-project.jpg",
    tags: ["Branding", "Strategy", "Identity"],
    stat1Label: "Brand Recognition",
    stat1Value: "250%",
    stat2Label: "Duration",
    stat2Value: "6 months",
    client: "TechCorp Global",
    industry: "Technology",
    year: "2024",
    challenge:
      "TechCorp needed a complete brand overhaul to compete in the modern tech landscape. Their existing identity was outdated and failed to resonate with their target audience.",
    solution:
      "We developed a comprehensive brand strategy that included a new visual identity, messaging framework, and digital presence. The rebrand focused on innovation, trust, and accessibility.",
    results: [
      "250% increase in brand recognition within 6 months",
      "40% improvement in customer engagement metrics",
      "Successfully attracted 3 major enterprise clients",
      "Featured in 15+ industry publications",
    ],
    gallery: ["/tech-brand-1.jpg", "/tech-brand-2.jpg", "/tech-brand-3.jpg", "/tech-brand-4.jpg"],
    testimonial: {
      quote:
        "The rebranding transformed our business. We've seen unprecedented growth and our brand now truly reflects who we are.",
      author: "Sarah Johnson",
      role: "CEO",
      company: "TechCorp Global",
    },
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "medicare-platform",
    title: "MediCare+ Patient Platform",
    description: "Award-winning healthcare platform serving 2M+ patients.",
    image: "/healthcare-app-interface.png",
    tags: ["UX Design", "Development", "Healthcare"],
    stat1Label: "Active Users",
    stat1Value: "2M+",
    stat2Label: "Duration",
    stat2Value: "8 months",
    client: "MediCare+",
    industry: "Healthcare",
    year: "2024",
    challenge:
      "MediCare+ needed a patient-centric platform that simplified healthcare management while maintaining HIPAA compliance and security standards.",
    solution:
      "We designed and developed an intuitive platform with features like appointment booking, medical records access, telemedicine, and prescription management.",
    results: [
      "2M+ active users within first year",
      "Won Best Healthcare Innovation Award 2024",
      "95% user satisfaction rating",
      "Reduced patient wait times by 60%",
    ],
    gallery: [
      "/healthcare-platform-1.jpg",
      "/healthcare-platform-2.jpg",
      "/healthcare-platform-3.jpg",
      "/healthcare-platform-4.jpg",
    ],
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "unve-design-system",
    title: "Unve Design System",
    description: "Complete design system for modern applications.",
    image: "/design-system-abstract.png",
    tags: ["Design System", "UI/UX", "Components"],
    stat1Label: "Components",
    stat1Value: "120+",
    stat2Label: "Duration",
    stat2Value: "4 months",
    client: "Unve",
    industry: "SaaS",
    year: "2024",
    challenge:
      "Unve needed a scalable design system to maintain consistency across multiple products and enable rapid development.",
    solution:
      "We created a comprehensive design system with reusable components, clear documentation, and a design token system for easy theming.",
    results: [
      "Reduced design-to-development time by 70%",
      "Improved UI consistency across 5 products",
      "Adopted by 50+ developers and designers",
      "Open-sourced with 1000+ GitHub stars",
    ],
    gallery: ["/design-system-1.jpg", "/design-system-2.jpg", "/design-system-3.jpg"],
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

      const caseStudies = await db.collection("case_studies").find(filter).sort({ createdAt: -1 }).toArray()
      if (caseStudies.length === 0) {
        return NextResponse.json(defaultCaseStudies)
      }
      // Convert MongoDB _id to string for JSON serialization
      const serializedCaseStudies = caseStudies.map(cs => ({
        ...cs,
        _id: cs._id.toString()
      }))
      return NextResponse.json(serializedCaseStudies)
    }

    // Paginated results for admin
    const skip = (page - 1) * limit
    const total = await db.collection("case_studies").countDocuments()
    const caseStudies = await db
      .collection("case_studies")
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Convert MongoDB _id to string for JSON serialization
    const serializedCaseStudies = caseStudies.map(cs => ({
      ...cs,
      _id: cs._id.toString()
    }))

    return NextResponse.json({
      caseStudies: serializedCaseStudies.length > 0 ? serializedCaseStudies : defaultCaseStudies,
      pagination: {
        page,
        limit,
        total: total || defaultCaseStudies.length,
        totalPages: Math.ceil((total || defaultCaseStudies.length) / limit),
      },
    })
  } catch (error) {
    console.error("Get case studies error:", error)
    return NextResponse.json({
      caseStudies: defaultCaseStudies,
      pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
    })
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

    const caseStudy = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      isFeatured: data.isFeatured || false,
    }

    await db.collection("case_studies").insertOne(caseStudy)
    return NextResponse.json(caseStudy, { status: 201 })
  } catch (error) {
    console.error("Create case study error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
