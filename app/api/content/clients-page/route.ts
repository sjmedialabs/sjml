import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"
import { getPageContent, updatePageContent } from "@/lib/models/content"
import { getClientsPageData } from "@/lib/data/clients-page"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await getClientsPageData()
    return NextResponse.json({
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      heroImage: data.heroImage,
      clients: data.clients,
      stats: data.stats,
      cta: data.cta,
    })
  } catch (error) {
    console.error("Get clients page error:", error)
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
    const collection = await getCollection<any>("clients")
    const existingPage = await getPageContent("clients")

    // Hero/content doc update (clients list lives only in the "clients" collection)
    if (data.heroTitle != null || data.heroSubtitle != null || data.heroImage != null) {
      await updatePageContent("clients", {
        pageKey: "clients",
        hero: {
          title: data.heroTitle ?? existingPage?.hero?.title ?? "Our Clients",
          description: data.heroSubtitle ?? existingPage?.hero?.description ?? "",
          image: data.heroImage ?? existingPage?.hero?.image ?? "",
        },
        stats: existingPage?.stats ?? [],
        cta: existingPage?.cta ?? { title: "", description: "", buttonText: "", buttonUrl: "" },
        industries: existingPage?.industries ?? [],
        clients: [], // not used; client list is only in db.collection("clients")
      })
    }

    // Single source of truth: replace entire clients collection with admin payload
    await collection.deleteMany({})
    if (data.clients && data.clients.length > 0) {
      const toInsert = data.clients.map((c: any) => ({
        name: c.name || "",
        logo: c.logo || "",
        industry: c.industry || "",
        website: c.website || "",
        featured: Boolean(c.featured),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      await collection.insertMany(toInsert)
    }

    const clientsData = await collection.find({}).sort({ createdAt: -1 }).toArray()
    const clients = clientsData.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name || "",
      logo: doc.logo || "",
      industry: doc.industry || "",
      website: doc.website || "",
      featured: doc.featured ?? false,
    }))

    const pageContent = await getPageContent("clients")
    const hero = pageContent?.hero || {}

    revalidatePath("/clients")

    return NextResponse.json({
      heroTitle: hero.title ?? "Our Clients",
      heroSubtitle: hero.description ?? hero.subtitle ?? "",
      heroImage: hero.image ?? "",
      clients,
      stats: pageContent?.stats ?? [],
      cta: pageContent?.cta ?? {},
    })
  } catch (error) {
    console.error("Update clients page error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
