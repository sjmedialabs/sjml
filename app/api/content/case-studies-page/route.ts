import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/jwt"
import { getCollection } from "@/lib/mongodb"
import { getPageContent, updatePageContent } from "@/lib/models/content"

export const dynamic = "force-dynamic"

const DEFAULT_SECTION = {
  title: "Our Case Studies",
  description: "Real results for real businesses.",
}

function serializeStudy(doc: Record<string, unknown>) {
  const stats = Array.isArray(doc.stats) ? doc.stats : []
  const stat1 = stats[0] as { label?: string; value?: string } | undefined
  const stat2 = stats[1] as { label?: string; value?: string } | undefined

  return {
    id: String(doc._id),
    title: (doc.title as string) || "",
    slug: (doc.slug as string) || "",
    client: (doc.client as string) || "",
    industry: (doc.industry as string) || "",
    year: (doc.year as string) || "",
    tags: (doc.tags as string[]) || [],
    description: (doc.description as string) || "",
    challenge: (doc.challenge as string) || "",
    solution: (doc.solution as string) || "",
    results: (doc.results as string[]) || [],
    image: (doc.image as string) || "",
    gallery: (doc.gallery as string[]) || [],
    stats: [
      { label: stat1?.label || (doc.stat1Label as string) || "", value: stat1?.value || (doc.stat1Value as string) || "" },
      { label: stat2?.label || (doc.stat2Label as string) || "", value: stat2?.value || (doc.stat2Value as string) || "" },
    ],
    testimonial: {
      quote: ((doc.testimonial as { quote?: string })?.quote) || "",
      author: ((doc.testimonial as { author?: string })?.author) || "",
      role: ((doc.testimonial as { role?: string })?.role) || "",
      company: ((doc.testimonial as { company?: string })?.company) || "",
    },
    featured: Boolean(doc.featured),
  }
}

export async function GET() {
  try {
    const collection = await getCollection<Record<string, unknown>>("case-studies")
    const caseStudies = await collection.find({}).sort({ createdAt: -1 }).toArray()

    const pageContent = await getPageContent("case-studies")
    const hero = pageContent?.hero || {}
    const section = pageContent?.section || DEFAULT_SECTION

    return NextResponse.json({
      heroTitle: hero.title ?? "Case Studies",
      heroSubtitle: hero.description ?? hero.subtitle ?? "Discover how we've helped brands achieve extraordinary results.",
      heroImage: hero.image ?? "",
      section: {
        title: section.title ?? DEFAULT_SECTION.title,
        description: section.description ?? DEFAULT_SECTION.description,
      },
      caseStudies: caseStudies.map(serializeStudy),
    })
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
    const collection = await getCollection<Record<string, unknown>>("case-studies")
    const existingPage = await getPageContent("case-studies")

    await updatePageContent("case-studies", {
      pageKey: "case-studies",
      hero: {
        title: data.heroTitle ?? existingPage?.hero?.title ?? "Case Studies",
        description: data.heroSubtitle ?? existingPage?.hero?.description ?? "",
        image: data.heroImage ?? existingPage?.hero?.image ?? "",
      },
      section: {
        title: data.section?.title ?? existingPage?.section?.title ?? DEFAULT_SECTION.title,
        description: data.section?.description ?? existingPage?.section?.description ?? DEFAULT_SECTION.description,
      },
    })

    await collection.deleteMany({})

    if (data.caseStudies && data.caseStudies.length > 0) {
      const studiesToInsert = data.caseStudies.map((study: Record<string, unknown>) => {
        const stats = Array.isArray(study.stats) ? study.stats : []
        const stat1 = stats[0] as { label?: string; value?: string } | undefined
        const stat2 = stats[1] as { label?: string; value?: string } | undefined
        const title = String(study.title ?? "")
        const slug =
          String(study.slug ?? "").trim() ||
          title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

        return {
          slug,
          title,
          client: study.client ?? "",
          industry: study.industry ?? "",
          year: study.year ?? "",
          tags: study.tags ?? [],
          description: study.description ?? "",
          challenge: study.challenge ?? "",
          solution: study.solution ?? "",
          results: study.results ?? [],
          image: study.image ?? "",
          gallery: study.gallery ?? [],
          stats,
          stat1Value: stat1?.value ?? "",
          stat1Label: stat1?.label ?? "",
          stat2Value: stat2?.value ?? "",
          stat2Label: stat2?.label ?? "",
          testimonial: study.testimonial ?? { quote: "", author: "", role: "", company: "" },
          featured: Boolean(study.featured),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })
      await collection.insertMany(studiesToInsert)
    }

    const caseStudies = await collection.find({}).sort({ createdAt: -1 }).toArray()
    const pageContent = await getPageContent("case-studies")
    const hero = pageContent?.hero || {}
    const section = pageContent?.section || DEFAULT_SECTION

    revalidatePath("/case-studies")

    return NextResponse.json({
      heroTitle: hero.title ?? "Case Studies",
      heroSubtitle: hero.description ?? hero.subtitle ?? "",
      heroImage: hero.image ?? "",
      section: {
        title: section.title ?? DEFAULT_SECTION.title,
        description: section.description ?? DEFAULT_SECTION.description,
      },
      caseStudies: caseStudies.map(serializeStudy),
    })
  } catch (error) {
    console.error("Update case studies error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
