import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const collection = await getCollection<any>("case-studies")
    const caseStudies = await collection.find({}).toArray()
    
    // Transform MongoDB documents
    const transformedStudies = caseStudies.map((doc: any) => ({
      id: doc._id.toString(),
      title: doc.title || "",
      slug: doc.slug || "",
      client: doc.client || "",
      industry: doc.industry || "",
      tags: doc.tags || [],
      description: doc.description || "",
      challenge: doc.challenge || "",
      solution: doc.solution || "",
      results: doc.results || [],
      image: doc.image || "",
      gallery: doc.gallery || [],
      stats: doc.stats || [],
      testimonial: doc.testimonial || { quote: "", author: "", role: "" },
      featured: doc.featured || false,
    }))

    const data = {
      heroTitle: "Case Studies",
      heroSubtitle: "Discover how we've helped brands achieve extraordinary results through innovative strategies and creative execution.",
      categories: ["All", "Branding", "Digital Marketing", "Web Development", "Advertising"],
      caseStudies: transformedStudies,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Get case studies error:", error)
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
    const collection = await getCollection<any>("case-studies")

    // Delete all existing case studies
    await collection.deleteMany({})

    // Insert updated case studies
    if (data.caseStudies && data.caseStudies.length > 0) {
      const studiesToInsert = data.caseStudies.map((study: any) => ({
        slug: study.slug || study.title.toLowerCase().replace(/\s+/g, '-'),
        title: study.title,
        client: study.client,
        industry: study.industry,
        tags: study.tags || [],
        description: study.description,
        challenge: study.challenge,
        solution: study.solution,
        results: study.results || [],
        image: study.image,
        gallery: study.gallery || [],
        stats: study.stats || [],
        stat1Value: study.stats?.[0]?.value || "",
        stat1Label: study.stats?.[0]?.label || "",
        stat2Value: study.stats?.[1]?.value || "",
        stat2Label: study.stats?.[1]?.label || "",
        testimonial: study.testimonial || { quote: "", author: "", role: "" },
        featured: study.featured || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      await collection.insertMany(studiesToInsert)
    }

    // Fetch and return updated data
    const caseStudies = await collection.find({}).toArray()
    const transformedStudies = caseStudies.map((doc: any) => ({
      id: doc._id.toString(),
      title: doc.title || "",
      slug: doc.slug || "",
      client: doc.client || "",
      industry: doc.industry || "",
      tags: doc.tags || [],
      description: doc.description || "",
      challenge: doc.challenge || "",
      solution: doc.solution || "",
      results: doc.results || [],
      image: doc.image || "",
      gallery: doc.gallery || [],
      stats: doc.stats || [],
      testimonial: doc.testimonial || { quote: "", author: "", role: "" },
      featured: doc.featured || false,
    }))

    const responseData = {
      heroTitle: "Case Studies",
      heroSubtitle: "Discover how we've helped brands achieve extraordinary results through innovative strategies and creative execution.",
      categories: ["All", "Branding", "Digital Marketing", "Web Development", "Advertising"],
      caseStudies: transformedStudies,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Update case studies error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
