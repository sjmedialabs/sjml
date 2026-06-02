import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { ServiceFaq } from "@/components/service-faq"
import { ServiceContentSections } from "@/components/service-content-sections"
import {
  normalizeServiceSections,
  normalizeServicePageLayout,
} from "@/lib/service-sections"

interface ServiceData {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  heroImage?: string
  image: string
  offerings: string[]
  faqs: Array<{ question: string; answer: string }>
  portfolioUrl?: string
  brochureUrl?: string
  sections?: Array<{ title: string; subtitle: string; description: string; enabled?: boolean }>
  pageLayout?: {
    heroEnabled?: boolean
    imageEnabled?: boolean
    offeringsEnabled?: boolean
    offeringsTitle?: string
    faqEnabled?: boolean
    faqTitle?: string
    faqSubtitle?: string
  }
  fullDescription?: string
  benefits?: { title?: string; description?: string }
  features?: { title?: string; points?: string[] }
  process?: Array<{ title?: string; description?: string }>
}

interface SubServiceData {
  id: string
  slug: string
  name: string
  shortDescription: string
  portfolioUrl?: string
  brochureUrl?: string
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const services = await db.collection("services").find({}, { projection: { slug: 1 } }).toArray()
    return services.map((service) => ({
      slug: service.slug,
    }))
  } catch (e) {
    return []
  }
}

export default async function ServiceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params
  let service: ServiceData | null = null

  let subServices: SubServiceData[] = []
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const data = await db.collection("services").findOne({ slug })
    if (data) {
      service = { ...data, id: data._id.toString() } as unknown as ServiceData
    }
    const subs = await db.collection("sub-services").find({ parentSlug: slug, isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).toArray()
    subServices = subs.map((s: any) => ({ id: s._id.toString(), slug: s.slug, name: s.name, shortDescription: s.shortDescription || "", portfolioUrl: s.portfolioUrl, brochureUrl: s.brochureUrl }))
  } catch (error) {
    console.error("Failed to fetch service:", error)
  }

  if (!service) {
    notFound()
  }

  const sections = normalizeServiceSections(service as unknown as Record<string, unknown>)
  const layout = normalizeServicePageLayout(service as unknown as Record<string, unknown>)

  const iconSrc =
    service.icon && (service.icon.startsWith("/") || service.icon.startsWith("http"))
      ? service.icon
      : service.icon
        ? "/icon.svg"
        : null

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {layout.heroEnabled && (
        <section className="pt-24 pb-16 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
          <div className="absolute inset-0">
            <Image
              src={service.heroImage || service.image || "/placeholder.svg?height=400&width=1920"}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="hero-overlay" aria-hidden="true" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-16">
            {iconSrc && (
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image
                    src={iconSrc}
                    alt={service.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white light:text-foreground">{service.title}</h1>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {service.portfolioUrl && (
                <a href={service.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors">
                  View Portfolio <span>→</span>
                </a>
              )}
              {service.brochureUrl && (
                <a href={service.brochureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-lg font-medium transition-colors">
                  Download Brochure <span>↓</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {layout.imageEnabled && (
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={service.image || "/placeholder.svg?height=400&width=800"}
                alt={service.title}
                width={800}
                height={400}
                className="w-full"
              />
            </div>
          </div>
        </section>
      )}

      {layout.offeringsEnabled && subServices.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="service-offerings-heading mb-6">
              {layout.offeringsTitle || "Services We offer:"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {subServices.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/services/${service.slug}/${sub.slug}`}
                  className="service-offering-pill"
                >
                  {sub.name}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ServiceContentSections sections={sections} />

      {layout.faqEnabled && service.faqs && service.faqs.length > 0 && (
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            {(layout.faqTitle || layout.faqSubtitle) && (
              <div className="mb-2">
                {layout.faqTitle && (
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{layout.faqTitle}</h2>
                )}
                {layout.faqSubtitle && (
                  <p className={`text-lg text-[#E63946] ${layout.faqTitle ? "mt-2" : ""}`}>{layout.faqSubtitle}</p>
                )}
              </div>
            )}
            <ServiceFaq faqs={service.faqs} />
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
