import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { createDefaultWorkPageContent, normalizeWorkPageContent } from "@/lib/work-page-content"
import { sortByDisplayOrder } from "@/lib/service-order"
import { normalizeWorkGridItem, getDefaultWorkGridItems, type WorkGridItem } from "@/lib/work-grid-item"
import { WorkHeroSection } from "@/components/work/work-hero-section"
import { WorkGridSection } from "@/components/work/work-grid-section"
import { WorkStatsSection } from "@/components/work/work-stats-section"
import { WorkCtaSection } from "@/components/work/work-cta-section"

export async function generateMetadata() {
  return await generateSeoMetadata("Work")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function WorkPage() {
  let pageContent = createDefaultWorkPageContent()
  let works: WorkGridItem[] = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const [rawContent, worksData] = await Promise.all([
      getPageContent("work"),
      db.collection("works").find({ isActive: { $ne: false } }).toArray(),
    ])

    if (rawContent) {
      pageContent = normalizeWorkPageContent(rawContent as unknown as Record<string, unknown>)
    }

    const mapped = sortByDisplayOrder(
      worksData.map((work) => normalizeWorkGridItem(work as Record<string, unknown>)),
    )
    works = mapped.length > 0 ? mapped : getDefaultWorkGridItems()
  } catch (error) {
    console.error("Failed to fetch works:", error)
    works = getDefaultWorkGridItems()
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <WorkHeroSection data={pageContent.hero} typography={pageContent.typography} />
      <WorkGridSection
        works={works}
        filterCategories={pageContent.filterCategories}
        industryFilterLabel={pageContent.industryFilterLabel}
        typography={pageContent.typography}
      />
      <WorkStatsSection
        stats={pageContent.stats}
        testimonial={pageContent.testimonial}
        typography={pageContent.typography}
      />
      <WorkCtaSection data={pageContent.cta} typography={pageContent.typography} />
      <Footer />
    </main>
  )
}
