import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"
import { getPageContent, updatePageContent } from "@/lib/models/content"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const collection = await getCollection<any>("testimonials")
    const testimonials = await collection.find({}).sort({ createdAt: -1 }).toArray()

    const transformed = testimonials.map((doc: any) => ({
      id: doc._id.toString(),
      quote: doc.quote || "",
      author: doc.author || "",
      role: doc.role || "",
      company: doc.company || "",
      image: doc.image || "",
      rating: doc.rating ?? 5,
      featured: doc.featured ?? false,
    }))

    const pageContent = await getPageContent("testimonials")
    const hero = pageContent?.hero || {}

    return NextResponse.json({
      heroTitle: hero.title ?? "What Our Clients Say",
      heroSubtitle: hero.description ?? hero.subtitle ?? "Don't just take our word for it. Hear from the brands we've helped transform.",
      heroImage: hero.image ?? "",
      testimonials: transformed,
    })
  } catch (error) {
    console.error("Get testimonials error:", error)
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
    const collection = await getCollection<any>("testimonials")

    const existingPage = await getPageContent("testimonials")
    if (data.heroTitle != null || data.heroSubtitle != null || data.heroImage != null) {
      await updatePageContent("testimonials", {
        pageKey: "testimonials",
        hero: {
          title: data.heroTitle ?? existingPage?.hero?.title ?? "",
          description: data.heroSubtitle ?? existingPage?.hero?.description ?? "",
          image: data.heroImage ?? existingPage?.hero?.image ?? "",
        },
        cta: existingPage?.cta ?? { title: "", description: "", buttonText: "", buttonUrl: "" },
      })
    }

    await collection.deleteMany({})
    if (data.testimonials && data.testimonials.length > 0) {
      const toInsert = data.testimonials.map((t: any) => ({
        quote: t.quote || "",
        author: t.author || "",
        role: t.role || "",
        company: t.company || "",
        image: t.image || "",
        rating: typeof t.rating === "number" ? t.rating : 5,
        featured: Boolean(t.featured),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      await collection.insertMany(toInsert)
    }

    const testimonials = await collection.find({}).sort({ createdAt: -1 }).toArray()
    const transformed = testimonials.map((doc: any) => ({
      id: doc._id.toString(),
      quote: doc.quote || "",
      author: doc.author || "",
      role: doc.role || "",
      company: doc.company || "",
      image: doc.image || "",
      rating: doc.rating ?? 5,
      featured: doc.featured ?? false,
    }))

    const pageContent = await getPageContent("testimonials")
    const hero = pageContent?.hero || {}

    revalidatePath("/")
    revalidatePath("/testimonials")

    return NextResponse.json({
      heroTitle: hero.title ?? "What Our Clients Say",
      heroSubtitle: hero.description ?? hero.subtitle ?? "",
      heroImage: hero.image ?? "",
      testimonials: transformed,
    })
  } catch (error) {
    console.error("Update testimonials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
