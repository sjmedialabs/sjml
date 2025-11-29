import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { ServicesSection } from "@/components/services-section"
import { IndustriesSection } from "@/components/industries-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { InsightsSection } from "@/components/insights-section"
import { PlaybookSection } from "@/components/playbook-section"
import { TrustedBySection } from "@/components/trusted-by-section"
import { Footer } from "@/components/footer"
import { getHomeContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let content

  try {
    content = await getHomeContent()
    if (!content) {
      content = getDefaultPageContent("home")
    }
  } catch (error) {
    console.error("Failed to fetch home content:", error)
    content = getDefaultPageContent("home")
  }

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection data={content.hero} />
      <StatsSection data={content.stats} backgroundImage={content.statsBackgroundImage} />
      <CaseStudiesSection data={content.caseStudies} backgroundImage={content.caseStudiesBackgroundImage} />
      <ServicesSection data={content.services} backgroundImage={content.servicesBackgroundImage} />
      <IndustriesSection data={content.industries} backgroundImage={content.industriesBackgroundImage} />
      <TestimonialsSection data={content.testimonials} backgroundImage={content.testimonialsBackgroundImage} />
      <InsightsSection data={content.insights} backgroundImage={content.insightsBackgroundImage} />
      <PlaybookSection data={content.playbook} backgroundImage={content.playbookBackgroundImage} />
      <TrustedBySection data={content.partners} backgroundImage={content.trustedByBackgroundImage} />
      <Footer data={content.footer} />
    </main>
  )
}
