import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedClientsSection } from "@/components/featured-clients-section"
import { getHomeContent } from "@/lib/models/content"
import { normalizeHomeContent } from "@/lib/home-content"
import { getClientsPageData } from "@/lib/data/clients-page"

export async function generateMetadata() {
  return generateSeoMetadata("Home")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let content
  let featuredClients: any[] = []

  try {
    const [homeContent, clientsData] = await Promise.all([
      getHomeContent(),
      getClientsPageData().catch(() => null),
    ])

    content = homeContent
    if (!content) throw new Error("Home content not found")

    if (clientsData?.clients) {
      featuredClients = clientsData.clients.filter((c: any) => c.featured && c.logo)
    }
  } catch (error) {
    console.error("Failed to fetch home content:", error)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Content Not Available</h1>
          <p className="text-muted-foreground">
            Home page content has not been set up yet. Please contact the administrator.
          </p>
        </div>
      </main>
    )
  }

  const home = normalizeHomeContent(content as unknown as Record<string, unknown>)

  return (
    <main className="home-page min-h-screen pt-16">
      <Header />
      <HeroSection data={home.hero} />
      <StatsSection data={home.stats} />
      <ServicesSection data={home.servicesSection} />
      {featuredClients.length > 0 && <FeaturedClientsSection clients={featuredClients} />}
      <Footer data={(content as { footer?: unknown }).footer} />
    </main>
  )
}
