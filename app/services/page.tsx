import { generateSeoMetadata } from "@/lib/seo"

export async function generateMetadata() {
  return await generateSeoMetadata("Services")
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { PageHero } from "@/components/page-hero"

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Enable ISR: Revalidate every hour

export default async function ServicesPage() {
  let services: any[] = []
  let content: any = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    // Fetch page content and services in parallel
    const [pageContent, servicesData] = await Promise.all([
      getPageContent("services"),
      db.collection("services").find({ isActive: true }).sort({ createdAt: -1 }).toArray(),
    ])

    content = pageContent
    if (!content) {
      throw new Error("Services page content not found")
    }
    
    // Serialize MongoDB _id
    services = servicesData.map((service) => ({
      ...service,
      _id: service._id.toString()
    }))
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Content Not Available</h2>
          <p className="text-muted-foreground">Services page content has not been set up yet. Please contact the administrator.</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const section = content.section
  const heroImage = hero.image || hero.backgroundImage || ""
  const heroTitle = hero.title || ""
  const heroDescription = hero.description || ""

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <PageHero title={heroTitle} description={heroDescription} image={heroImage} />

      {/* Services Grid Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-[#E63946] italic">{section.title}</span>
            </h2>
            <h3 className="text-2xl md:text-3xl text-[#E63946] italic mb-6">{section.subtitle}</h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">{section.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {services.map((service: any) => {
              const iconSrc =
                service.icon && (service.icon.startsWith("/") || service.icon.startsWith("http"))
                  ? service.icon
                  : service.icon
                    ? "/icon.svg"
                    : null
              const imageSrc = service.image && (service.image.startsWith("/") || service.image.startsWith("http")) ? service.image : null
              const hasVisual = iconSrc || imageSrc
              return (
                <div
                  key={service.id || service._id || service.slug}
                  className="bg-background border border-border rounded-2xl p-6 hover:border-border transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-5 overflow-hidden bg-secondary/50">
                    {hasVisual ? (
                      imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={service.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Image
                          src={iconSrc!}
                          alt={service.title}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      )
                    ) : null}
                  </div>
                  <h3 className="text-[#E63946] font-semibold text-lg mb-3">{service.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{service.description}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[#E63946] text-sm font-medium hover:underline inline-flex items-center gap-2"
                  >
                    {service.linkText || "Read More"} <span className="text-lg">→</span>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
