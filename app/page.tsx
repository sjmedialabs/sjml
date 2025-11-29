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
import { clientPromise } from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  let content
  let services: any[] = []
  let caseStudies: any[] = []
  let insights: any[] = []
  let testimonials: any[] = []
  let clients: any[] = []

  try {
    // Fetch home page content (hero, stats, etc.)
    content = await getHomeContent()
    if (!content) {
      content = getDefaultPageContent("home")
    }

    // Fetch dynamic content from respective collections
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    // Fetch services
    const servicesData = await db.collection("services").find({ isActive: true }).limit(8).toArray()
    services = servicesData.map(s => ({ ...s, id: s._id.toString(), _id: s._id.toString() }))

    // Fetch case studies
    const caseStudiesData = await db.collection("case-studies").find({ featured: true }).limit(3).toArray()
    caseStudies = caseStudiesData.map(cs => ({ ...cs, id: cs._id.toString(), _id: cs._id.toString() }))

    // Fetch insights
    const insightsData = await db.collection("insights").find({ published: true, featured: true }).limit(3).toArray()
    insights = insightsData.map(i => ({ ...i, id: i._id.toString(), _id: i._id.toString() }))

    // Fetch testimonials
    const testimonialsData = await db.collection("testimonials").find({ featured: true }).limit(3).toArray()
    testimonials = testimonialsData.map(t => ({ ...t, id: t._id.toString(), _id: t._id.toString() }))

    // Fetch clients
    const clientsData = await db.collection("clients").find({ featured: true }).limit(8).toArray()
    clients = clientsData.map(c => ({ ...c, id: c._id.toString(), _id: c._id.toString() }))
  } catch (error) {
    console.error("Failed to fetch home content:", error)
    content = getDefaultPageContent("home")
  }

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection data={content.hero} />
      <StatsSection data={content.stats} backgroundImage={content.statsBackgroundImage} />
      <CaseStudiesSection data={caseStudies} backgroundImage={content.caseStudiesBackgroundImage} />
      <ServicesSection data={services} backgroundImage={content.servicesBackgroundImage} />
      <IndustriesSection data={content.industries} backgroundImage={content.industriesBackgroundImage} />
      <TestimonialsSection data={testimonials} backgroundImage={content.testimonialsBackgroundImage} />
      <InsightsSection data={insights} backgroundImage={content.insightsBackgroundImage} />
      <PlaybookSection data={content.playbook} backgroundImage={content.playbookBackgroundImage} />
      <TrustedBySection data={clients} backgroundImage={content.trustedByBackgroundImage} />
      <Footer data={content.footer} />
    </main>
  )
}
