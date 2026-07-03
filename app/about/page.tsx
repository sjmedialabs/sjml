import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPageContent } from "@/lib/models/content"
import { normalizeAboutContent, createDefaultAboutContent } from "@/lib/about-content"
import { AboutHeroSection } from "@/components/about/about-hero-section"
import { WhoWeAreSection } from "@/components/about/who-we-are-section"
import { ValuesJourneySection } from "@/components/about/values-journey-section"

export async function generateMetadata() {
  return await generateSeoMetadata("About")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AboutPage() {
  let about = createDefaultAboutContent()

  try {
    const data = await getPageContent("about")
    if (data) {
      about = normalizeAboutContent(data as unknown as Record<string, unknown>)
    }
  } catch (error) {
    console.error("Failed to fetch about data:", error)
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <AboutHeroSection data={about.hero} />
      <WhoWeAreSection data={about.whoWeAre} />
      <ValuesJourneySection values={about.valuesSection} journey={about.journeySection} />
      <Footer />
    </main>
  )
}
