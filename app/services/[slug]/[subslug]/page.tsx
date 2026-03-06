import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { sanitizeHtml } from "@/lib/sanitize-html"
import { Breadcrumbs } from "@/components/breadcrumbs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SubServiceDetailPage(props: {
  params: Promise<{ slug: string; subslug: string }>
}) {
  const params = await props.params
  const { slug: parentSlug, subslug } = params

  let parent: { title: string } | null = null
  let sub: any = null

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

  const hasHtml = sub.fullDescription && /<[a-zA-Z][^>]*>/.test(sub.fullDescription)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="px-4 py-2 max-w-6xl mx-auto pt-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: parent.title, href: `/services/${parentSlug}` },
            { label: sub.name },
          ]}
        />
      </section>

      {/* Banner */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src={sub.bannerImage || "/placeholder.svg?height=400&width=1920"}
          alt={sub.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-6xl w-full mx-auto px-4 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{sub.name}</h1>
          </div>
        </div>
      </section>

      {/* CTA buttons */}
      <section className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-4">
          {sub.portfolioUrl && (
            <a
              href={sub.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-lg font-medium transition-colors"
            >
              View Portfolio →
            </a>
          )}
          {sub.brochureUrl && (
            <a
              href={sub.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#E63946] text-[#E63946] hover:bg-[#E63946]/10 rounded-lg font-medium transition-colors"
            >
              Download Brochure ↓
            </a>
          )}
        </div>
      </section>

      {/* Full description */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {sub.fullDescription ? (
            hasHtml ? (
              <div
                className="service-detail-rich text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.fullDescription) }}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{sub.fullDescription}</p>
            )
          ) : sub.shortDescription ? (
            <p className="text-muted-foreground leading-relaxed">{sub.shortDescription}</p>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  )
}
