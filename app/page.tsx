import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { getHomeContent } from "@/lib/models/content"
import { normalizeHomeContent } from "@/lib/home-content"

export async function generateMetadata() {
  return generateSeoMetadata("Home")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let content
  try {
    content = await getHomeContent()
    if (!content) throw new Error("Home content not found")
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
      <Footer data={(content as { footer?: unknown }).footer} />
    </main>
  )
}
