import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { sortByDisplayOrder } from "@/lib/service-order"
import {
  createDefaultInsightsPageContent,
  normalizeInsightsPageContent,
} from "@/lib/insights-page-content"
import { normalizeInsightGridItem, getDefaultInsightGridItems, type InsightGridItem } from "@/lib/insight-grid-item"
import { InsightsHeroSection } from "@/components/insights/insights-hero-section"
import { InsightsGridSection } from "@/components/insights/insights-grid-section"

export async function generateMetadata() {
  return await generateSeoMetadata("Insights")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InsightsPage() {
  let pageContent = createDefaultInsightsPageContent()
  let posts: InsightGridItem[] = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const [rawContent, insightsData] = await Promise.all([
      getPageContent("insights"),
      db.collection("insights").find({ published: { $ne: false } }).toArray(),
    ])

    if (rawContent) {
      pageContent = normalizeInsightsPageContent(rawContent as unknown as Record<string, unknown>)
    }

    const mapped = sortByDisplayOrder(
      insightsData.map((doc) => normalizeInsightGridItem(doc as Record<string, unknown>)),
    )
    posts = mapped.length > 0 ? mapped : getDefaultInsightGridItems()
  } catch (error) {
    console.error("Failed to fetch insights:", error)
    posts = getDefaultInsightGridItems()
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <InsightsHeroSection data={pageContent.hero} typography={pageContent.typography} />
      <InsightsGridSection
        posts={posts}
        filterCategories={pageContent.filterCategories}
        searchPlaceholder={pageContent.searchPlaceholder}
        loadMore={pageContent.loadMore}
        typography={pageContent.typography}
      />
      <Footer />
    </main>
  )
}
