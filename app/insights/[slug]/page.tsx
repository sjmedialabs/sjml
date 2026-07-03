import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { sortByDisplayOrder } from "@/lib/service-order"
import {
  createDefaultInsightsPageContent,
  normalizeInsightsPageContent,
} from "@/lib/insights-page-content"
import { normalizeInsightDetailTemplate } from "@/lib/insight-detail-template"
import { normalizeInsightGridItem, getDefaultInsightGridItems } from "@/lib/insight-grid-item"
import { DEFAULT_INSIGHTS_LIST } from "@/lib/default-insights-list"
import { InsightDetailBreadcrumbs, InsightDetailContent } from "@/components/insights/insight-detail-content"
import { InsightDetailSidebar } from "@/components/insights/insight-detail-sidebar"
import { generateSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const insight = await db.collection("insights").findOne({ slug, published: { $ne: false } })
    if (insight) {
      const base = await generateSeoMetadata("Insights")
      return {
        ...base,
        title: `${insight.title} | ${typeof base.title === "string" ? base.title.split("|").pop()?.trim() || "SJ Media Labs" : "SJ Media Labs"}`,
        description: (insight.excerpt as string) || base.description,
      }
    }
  } catch {
    /* fall through */
  }
  return generateSeoMetadata("Insights")
}

export default async function InsightDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await props.params
  const slug = rawSlug.replace(/\.+$/, "").trim()
  let insight: Record<string, unknown> | null = null
  let pageContent = createDefaultInsightsPageContent()
  let related = getDefaultInsightGridItems()

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const [rawContent, bySlug, allInsights] = await Promise.all([
      getPageContent("insights"),
      db.collection("insights").findOne({ slug, published: { $ne: false } }),
      db.collection("insights").find({ published: { $ne: false } }).toArray(),
    ])

    if (rawContent) {
      pageContent = normalizeInsightsPageContent(rawContent as unknown as Record<string, unknown>)
    }

    if (bySlug) {
      insight = { ...bySlug, id: bySlug._id?.toString() ?? bySlug.id }
    } else {
      const fallback = DEFAULT_INSIGHTS_LIST.find((p) => p.slug === slug)
      if (fallback) {
        insight = fallback as unknown as Record<string, unknown>
        related = getDefaultInsightGridItems()
      }
    }

    if (allInsights.length) {
      related = sortByDisplayOrder(allInsights.map((doc) => normalizeInsightGridItem(doc as Record<string, unknown>)))
    } else {
      related = getDefaultInsightGridItems()
    }
  } catch (error) {
    console.error("Failed to fetch insight:", error)
    const fallback = DEFAULT_INSIGHTS_LIST.find((p) => p.slug === slug)
    if (fallback) {
      insight = fallback as unknown as Record<string, unknown>
      related = getDefaultInsightGridItems()
    }
  }

  if (!insight) notFound()

  const title = insight.title as string
  const defaultRecord = DEFAULT_INSIGHTS_LIST.find((p) => p.slug === slug)
  const rawTemplate = (insight.detailTemplate as Partial<import("@/lib/insight-detail-template").InsightDetailTemplate>) ?? {}
  let template = normalizeInsightDetailTemplate(insight, title, slug)

  if (defaultRecord?.detailTemplate) {
    const mock = defaultRecord.detailTemplate
    template = {
      ...template,
      sections:
        !rawTemplate.sections?.length || rawTemplate.sections.length < mock.sections.length
          ? mock.sections
          : template.sections,
      introParagraph: rawTemplate.introParagraph || mock.introParagraph,
      closingStatement: rawTemplate.closingStatement || mock.closingStatement || "",
      typography: { ...mock.typography, ...template.typography },
    }
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <InsightDetailBreadcrumbs title={title} />
      <section className="insight-detail-page">
        <div className="site-container insight-detail-layout">
          <InsightDetailContent
            title={title}
            categoryTags={(insight.categoryTags as string) ?? (insight.category as string)?.toUpperCase() ?? ""}
            date={normalizeInsightGridItem(insight).date}
            readTime={(insight.readTime as string) ?? "5 min read"}
            author={(insight.author as string) ?? "SJML Team"}
            image={(insight.image as string) ?? ""}
            template={template}
          />
          <InsightDetailSidebar
            related={related}
            relatedHeading={pageContent.relatedHeading}
            newsletter={pageContent.sidebarNewsletter}
            typography={pageContent.typography}
            currentSlug={slug}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
