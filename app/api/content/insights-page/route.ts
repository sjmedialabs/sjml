import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  authorImage: string
  date: string
  readTime: string
  tags: string[]
  featured: boolean
  published: boolean
}

interface InsightsData {
  heroTitle: string
  heroSubtitle: string
  categories: string[]
  posts: BlogPost[]
}

export async function GET() {
  try {
    const collection = await getCollection<any>("insights")
    const insights = await collection.find({}).toArray()
    
    // Transform MongoDB documents to BlogPost format
    const posts: BlogPost[] = insights.map((doc: any) => ({
      id: doc.id || doc._id.toString(),
      title: doc.title || "",
      slug: doc.slug || "",
      excerpt: doc.excerpt || "",
      content: doc.content || "",
      image: doc.image || "",
      category: doc.category || "",
      author: doc.author || "",
      authorImage: doc.authorImage || "",
      date: doc.date || "",
      readTime: doc.readTime || "",
      tags: doc.tags || [],
      featured: doc.featured || false,
      published: doc.published || false,
    }))

    // Extract unique categories from posts
    const categoriesSet = new Set<string>()
    posts.forEach(post => {
      if (post.category) categoriesSet.add(post.category)
    })
    const categories = ["All", ...Array.from(categoriesSet)]

    const data: InsightsData = {
      heroTitle: "Insights & Resources",
      heroSubtitle: "Expert perspectives on branding, marketing, and digital transformation.",
      categories,
      posts,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Get insights error:", error)
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

    const data: InsightsData = await request.json()
    const collection = await getCollection<any>("insights")

    // Delete all existing insights
    await collection.deleteMany({})

    // Insert updated posts
    if (data.posts && data.posts.length > 0) {
      const postsToInsert = data.posts.map(post => ({
        ...post,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      await collection.insertMany(postsToInsert)
    }

    // Fetch and return updated data
    const insights = await collection.find({}).toArray()
    const posts: BlogPost[] = insights.map((doc: any) => ({
      id: doc.id || doc._id.toString(),
      title: doc.title || "",
      slug: doc.slug || "",
      excerpt: doc.excerpt || "",
      content: doc.content || "",
      image: doc.image || "",
      category: doc.category || "",
      author: doc.author || "",
      authorImage: doc.authorImage || "",
      date: doc.date || "",
      readTime: doc.readTime || "",
      tags: doc.tags || [],
      featured: doc.featured || false,
      published: doc.published || false,
    }))

    const categoriesSet = new Set<string>()
    posts.forEach(post => {
      if (post.category) categoriesSet.add(post.category)
    })
    const categories = ["All", ...Array.from(categoriesSet)]

    const responseData: InsightsData = {
      heroTitle: data.heroTitle || "Insights & Resources",
      heroSubtitle: data.heroSubtitle || "Expert perspectives on branding, marketing, and digital transformation.",
      categories,
      posts,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Update insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
