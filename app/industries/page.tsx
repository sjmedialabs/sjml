import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPageContent } from "@/lib/models/content"
import {
  createDefaultIndustriesPageContent,
  normalizeIndustriesPageContent,
} from "@/lib/industries-page-content"
import { IndustriesHeroSection } from "@/components/industries/industries-hero-section"
import { IndustriesExpertiseSection } from "@/components/industries/industries-expertise-section"
import { IndustriesGridSection } from "@/components/industries/industries-grid-section"
import { IndustriesStatsSection } from "@/components/industries/industries-stats-section"
import { IndustriesCtaSection } from "@/components/industries/industries-cta-section"

export async function generateMetadata() {
  return await generateSeoMetadata("Industries")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function IndustriesPage() {
  let pageContent = createDefaultIndustriesPageContent()

  try {
    const data = await getPageContent("industries")
    if (data) {
      pageContent = normalizeIndustriesPageContent(data as unknown as Record<string, unknown>)
    }
  } catch (error) {
    console.error("Failed to fetch industries data:", error)
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <IndustriesHeroSection data={pageContent.hero} typography={pageContent.typography} />
      <IndustriesExpertiseSection data={pageContent.expertise} typography={pageContent.typography} />
      <IndustriesGridSection cards={pageContent.cards} grid={pageContent.grid} typography={pageContent.typography} />
      <IndustriesStatsSection stats={pageContent.stats} typography={pageContent.typography} />
      <IndustriesCtaSection data={pageContent.cta} typography={pageContent.typography} />
      <Footer />
    </main>
  )
}
