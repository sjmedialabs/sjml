import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { ServiceContentSections } from "@/components/service-content-sections"
import {
  normalizeSubServiceSections,
  normalizeSubServicePageLayout,
  validSubServiceImages,
} from "@/lib/service-sections"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface DiscoverService {
  slug: string
  title: string
}

interface SubServiceData {
  name: string
  bannerImage?: string
  portfolioUrl?: string
  brochureUrl?: string
}

export default async function SubServiceDetailPage(props: {
  params: Promise<{ slug: string; subslug: string }>
}) {
  const params = await props.params
  const { slug: parentSlug, subslug } = params

  let parent: { title: string } | null = null
  let sub: SubServiceData | null = null
  let discoverServices: DiscoverService[] = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const parentDoc = await db.collection("services").findOne({ slug: parentSlug }, { projection: { title: 1 } })
    parent = parentDoc ? { title: parentDoc.title as string } : null
    const subDoc = await db.collection("sub-services").findOne({ parentSlug, slug: subslug, isActive: true })
    sub = subDoc ? (subDoc as unknown as SubServiceData & Record<string, unknown>) : null
    const services = await db
      .collection("services")
      .find({ isActive: { $ne: false } })
      .sort({ displayOrder: 1, createdAt: -1 })
      .project({ slug: 1, title: 1 })
      .toArray()
    discoverServices = services.map((s) => ({
      slug: s.slug as string,
      title: s.title as string,
    }))
  } catch (error) {
    console.error("Failed to fetch sub-service:", error)
  }

  if (!parent || !sub) {
    notFound()
  }

  const sections = normalizeSubServiceSections(sub as unknown as Record<string, unknown>)
  const layout = normalizeSubServicePageLayout(sub as unknown as Record<string, unknown>)
  const name = sub.name
  const galleryImages = validSubServiceImages(layout.galleryImages)
  const bottomThumbnails = validSubServiceImages(layout.bottomThumbnailImages)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src={sub.bannerImage || "/placeholder.svg?height=400&width=1920"}
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

      <ServiceContentSections sections={sections} />

      {layout.galleryEnabled && galleryImages.length > 0 && (
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {galleryImages.map((img, index) => (
                <div key={index} className="rounded-2xl overflow-hidden border border-border">
                  <Image
                    src={img}
                    alt={`${name} gallery ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {layout.discoverEnabled && discoverServices.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            {layout.discoverTitle && (
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{layout.discoverTitle}</h2>
            )}
            {layout.discoverSubtitle && (
              <p className="text-lg text-[#E63946] mb-6">{layout.discoverSubtitle}</p>
            )}
            {!layout.discoverSubtitle && layout.discoverTitle && <div className="mb-4" />}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {discoverServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="px-4 py-1.5 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wide border border-[#E63946] bg-transparent text-foreground hover:bg-[#E63946]/10 transition-colors"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {layout.bottomImagesEnabled && bottomThumbnails.length > 0 && (
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {bottomThumbnails.map((img, index) => (
                <div
                  key={index}
                  className="relative w-[100px] h-[100px] shrink-0 rounded-lg overflow-hidden border border-border bg-muted dark:bg-zinc-900"
                >
                  <Image
                    src={img}
                    alt={`${name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
