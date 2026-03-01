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
import { clientPromise } from "@/lib/mongodb"
import { getClientsPageData } from "@/lib/data/clients-page"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let content
  let services: any[] = []
  let caseStudies: any[] = []
  let insights: any[] = []
  let testimonials: any[] = []
  let trustedByClients: { id: string; name: string; logo: string }[] = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const [homeContent, servicesData, caseStudiesData, insightsData, testimonialsData, clientsPageData] =
      await Promise.all([
        getHomeContent(),
        db.collection("services").find({ isActive: true }).limit(8).toArray(),
        db.collection("case-studies").find({ featured: true }).limit(3).toArray(),
        db.collection("insights").find({ published: true, featured: true }).limit(3).toArray(),
        db.collection("testimonials").find({ featured: true }).limit(3).toArray(),
        getClientsPageData(),
      ])

    content = homeContent
    if (!content) {
      throw new Error("Home content not found in database")
    }

    services = servicesData.map((s) => ({ ...s, id: s._id.toString(), _id: s._id.toString() }))
    caseStudies = caseStudiesData.map((cs) => ({ ...cs, id: cs.id || cs._id.toString(), _id: cs._id.toString() }))
    insights = insightsData.map((i) => ({ ...i, id: i._id.toString(), _id: i._id.toString() }))
    testimonials = testimonialsData.map((t) => ({ ...t, id: t._id.toString(), _id: t._id.toString() }))
    trustedByClients = (clientsPageData.clients || []).map((c) => ({ id: c.id, name: c.name, logo: c.logo || "" }))
  } catch (error) {
    console.error("Failed to fetch home content:", error)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Content Not Available</h1>
          <p className="text-muted-foreground">Home page content has not been set up yet. Please contact the administrator.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection data={content.hero} />
      <StatsSection
        data={content.stats}
        backgroundImage={content.statsSection?.backgroundImage ?? content.statsBackgroundImage}
        title={content.statsSection?.title}
        description={content.statsSection?.description}
      />
      <CaseStudiesSection
        data={caseStudies}
        backgroundImage={content.caseStudiesSection?.backgroundImage ?? content.caseStudiesBackgroundImage}
        title={content.caseStudiesSection?.title}
        description={content.caseStudiesSection?.description}
      />
      <ServicesSection
        data={services}
        backgroundImage={content.servicesSection?.backgroundImage ?? content.servicesBackgroundImage}
        title={content.servicesSection?.title}
        description={content.servicesSection?.description}
      />
      <IndustriesSection
        data={content.industries}
        backgroundImage={content.industriesSection?.backgroundImage ?? content.industriesBackgroundImage}
        title={content.industriesSection?.title}
        description={content.industriesSection?.description}
      />
      <TestimonialsSection
        data={testimonials}
        backgroundImage={content.testimonialsSection?.backgroundImage ?? content.testimonialsBackgroundImage}
        title={content.testimonialsSection?.title}
        description={content.testimonialsSection?.description}
      />
      <InsightsSection
        data={insights}
        backgroundImage={content.insightsSection?.backgroundImage ?? content.insightsBackgroundImage}
        title={content.insightsSection?.title}
        description={content.insightsSection?.description}
      />
      <PlaybookSection
        data={content.playbook}
        backgroundImage={content.playbookSection?.backgroundImage ?? content.playbookBackgroundImage}
        sectionTitle={content.playbookSection?.title}
        sectionDescription={content.playbookSection?.description}
      />
      <TrustedBySection
        data={trustedByClients}
        backgroundImage={content.trustedBySection?.backgroundImage ?? content.trustedByBackgroundImage}
        title={content.trustedBySection?.title}
        description={content.trustedBySection?.description}
      />
      <Footer data={content.footer} />
    </main>
  )
}
