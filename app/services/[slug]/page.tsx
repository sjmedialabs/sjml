import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { sanitizeHtml } from "@/lib/sanitize-html"
import { ServiceFaq } from "@/components/service-faq"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface ServiceData {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  heroImage?: string
  image: string
  fullDescription: string
  offerings: string[]
  benefits: { title: string; description: string }
  features: { title: string; points: string[] }
  process: Array<{ icon: string; title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  portfolioUrl?: string
  brochureUrl?: string
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
export const revalidate = 0 // Enable ISR: Revalidate every hour

// Generate static params for all services to pre-render them at build time
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

  // Resolve icon: use URL if path/http, otherwise treat as key and use generic icon (admin can set full URL later)
  const iconSrc =
    service.icon && (service.icon.startsWith("/") || service.icon.startsWith("http"))
      ? service.icon
      : service.icon
        ? "/icon.svg"
        : null

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="px-4 py-2 max-w-6xl mx-auto pt-20">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]} />
      </section>

      {/* Hero Section - uses hero image (different from content image below) */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={service.heroImage || service.image || "/placeholder.svg?height=400&width=1920"}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center pt-16">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">{service.title}</h1>
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

      {/* Image Showcase */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
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

      {/* Sub-Services */}
      {subServices.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">What we offer</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {subServices.map((sub) => (
                <Link key={sub.id} href={`/services/${service.slug}/${sub.slug}`} className="block border border-border rounded-xl p-5 hover:border-[#E63946] transition-colors">
                  <h3 className="text-[#E63946] font-semibold mb-2">{sub.name}</h3>
                  <p className="text-muted-foreground text-sm">{sub.shortDescription}</p>
                  <span className="text-[#E63946] text-sm font-medium mt-2 inline-flex items-center gap-1">Read more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Offerings */}
      {service.offerings && service.offerings.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">Services We Offer:</h2>
            <div className="flex flex-wrap gap-3">
              {service.offerings.map((offering, index) => (
                <span
                  key={index}
                  className="px-4 py-2 border border-border rounded-full text-foreground text-sm hover:border-[#E63946] transition-colors inline-flex items-center gap-2"
                >
                  {offering} <span className="text-[#E63946]">→</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {service.benefits && service.benefits.title && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              <span className="text-[#E63946]">Benefits</span> {service.benefits.title}
            </h2>
            {service.benefits.description && /<[a-zA-Z][^>]*>/.test(service.benefits.description) ? (
              <div
                className="service-detail-rich text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(service.benefits.description) }}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{service.benefits.description}</p>
            )}
          </div>
        </section>
      )}

      {/* Full Description */}
      {service.fullDescription && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/<[a-zA-Z][^>]*>/.test(service.fullDescription) ? (
              <div
                className="service-detail-rich text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(service.fullDescription) }}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{service.fullDescription}</p>
            )}
          </div>
        </section>
      )}

      {/* Key Features */}
      {service.features && service.features.points && service.features.points.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Key <span className="text-[#E63946]">Features</span>{" "}
              {service.features.title && `of ${service.features.title}`}
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              {service.features.points.map((point, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E63946] rounded-full"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Design Process */}
      {service.process && service.process.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Our <span className="text-[#E63946]">Process</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {service.process.map((step, index) => (
                <div key={index} className="border border-border rounded-xl p-6">
                  <div className="text-[#E63946] text-2xl font-bold mb-4">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="text-foreground font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Frequently Asked <span className="text-[#E63946]">Questions</span>
            </h2>
            <ServiceFaq faqs={service.faqs} />
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
