import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { ServiceContentSections } from "@/components/service-content-sections"
import { normalizeSubServiceSections } from "@/lib/service-sections"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SubServiceDetailPage(props: {
  params: Promise<{ slug: string; subslug: string }>
}) {
  const params = await props.params
  const { slug: parentSlug, subslug } = params

  let parent: { title: string } | null = null
  let sub: Record<string, unknown> | null = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    parent = await db.collection("services").findOne({ slug: parentSlug }, { projection: { title: 1 } })
    sub = await db.collection("sub-services").findOne({ parentSlug, slug: subslug, isActive: true })
  } catch (error) {
    console.error("Failed to fetch sub-service:", error)
  }

  if (!parent || !sub) {
    notFound()
  }

  const sections = normalizeSubServiceSections(sub)
  const name = (sub.name as string) ?? ""

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src={(sub.bannerImage as string) || "/placeholder.svg?height=400&width=1920"}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="absolute inset-0 z-[2] flex items-end">
          <div className="max-w-6xl w-full mx-auto px-4 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white light:text-foreground">{name}</h1>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-4">
          {sub.portfolioUrl && (
            <a
              href={sub.portfolioUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-lg font-medium transition-colors"
            >
              View Portfolio →
            </a>
          )}
          {sub.brochureUrl && (
            <a
              href={sub.brochureUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#E63946] text-[#E63946] hover:bg-[#E63946]/10 rounded-lg font-medium transition-colors"
            >
              Download Brochure ↓
            </a>
          )}
        </div>
      </section>

      <ServiceContentSections sections={sections} />

      <Footer />
    </main>
  )
}
