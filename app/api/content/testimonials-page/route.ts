import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"
import { getPageContent, updatePageContent } from "@/lib/models/content"

export const dynamic = "force-dynamic"

const DEFAULT_CTA = { title: "", description: "", buttonText: "", buttonUrl: "" }

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
      cta: pageContent?.cta ?? DEFAULT_CTA,
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

    await updatePageContent("testimonials", {
      pageKey: "testimonials",
      hero: {
        title: data.heroTitle ?? existingPage?.hero?.title ?? "",
        description: data.heroSubtitle ?? existingPage?.hero?.description ?? "",
        image: data.heroImage ?? existingPage?.hero?.image ?? "",
      },
      cta: data.cta ?? existingPage?.cta ?? DEFAULT_CTA,
    })

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

    const pageContent = await getPageContent("testimonials")
    const hero = pageContent?.hero || {}
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

    revalidatePath("/testimonials")

    return NextResponse.json({
      heroTitle: hero.title ?? "What Our Clients Say",
      heroSubtitle: hero.description ?? hero.subtitle ?? "",
      heroImage: hero.image ?? "",
      cta: pageContent?.cta ?? DEFAULT_CTA,
      testimonials: transformed,
    })
  } catch (error) {
    console.error("Update testimonials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
