import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import {
  createDefaultServicesPageContent,
  normalizeServicesPageContent,
} from "@/lib/services-page-content"
import { sortByDisplayOrder } from "@/lib/service-order"
import { ServicesHeroSection } from "@/components/services/services-hero-section"
import { ServicesGridSection } from "@/components/services/services-grid-section"
import { ServicesCtaBanner } from "@/components/services/services-cta-banner"

export async function generateMetadata() {
  return await generateSeoMetadata("Services")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ServicesPage() {
  let pageContent = createDefaultServicesPageContent()
  let services: Array<{
    id: string
    slug: string
    title: string
    description: string
    icon: string
    linkText?: string
  }> = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const [rawContent, servicesData] = await Promise.all([
      getPageContent("services"),
      db.collection("services").find({ isActive: true }).toArray(),
    ])

    if (rawContent) {
      pageContent = normalizeServicesPageContent(rawContent as unknown as Record<string, unknown>)
    }

    const orderedServices = sortByDisplayOrder(servicesData, (a, b) => {
      const aCreated = a.createdAt ? new Date(a.createdAt as string).getTime() : 0
      const bCreated = b.createdAt ? new Date(b.createdAt as string).getTime() : 0
      return bCreated - aCreated
    })

    services = orderedServices.map((service) => ({
      id: (service.id as string) || service._id.toString(),
      slug: service.slug as string,
      title: service.title as string,
      description: service.description as string,
      icon: (service.icon as string) || "",
      linkText: service.linkText as string | undefined,
    }))
  } catch (error) {
    console.error("Failed to fetch services:", error)
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <ServicesHeroSection data={pageContent.hero} typography={pageContent.typography} />
      <ServicesGridSection label={pageContent.grid.label} services={services} typography={pageContent.typography} />
      <ServicesCtaBanner data={pageContent.cta} typography={pageContent.typography} />
      <Footer />
    </main>
  )
}
