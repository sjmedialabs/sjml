import { DEFAULT_INSIGHTS_LIST } from "@/lib/default-insights-list"

export interface InsightGridItem {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  categoryTags: string
  categories: string[]
  author: string
  date: string
  readTime: string
  displayOrder?: number
}

function tagToCategorySlug(tag: string): string {
  const lower = tag.trim().toLowerCase()
  if (lower.includes("industry")) return "industry-trends"
  if (lower.includes("market")) return "marketing"
  if (lower.includes("design")) return "design"
  if (lower.includes("digital")) return "digital"
  if (lower.includes("business")) return "business"
  if (lower.includes("brand")) return "branding"
  if (lower.includes("strateg")) return "marketing"
  return lower.replace(/\s+/g, "-")
}

export function normalizeInsightGridItem(doc: Record<string, unknown>): InsightGridItem {
  const categories = (doc.categories as string[])?.length
    ? (doc.categories as string[])
    : [tagToCategorySlug((doc.category as string) || "")]

  return {
    id: (doc.id as string) ?? String(doc._id ?? ""),
    slug: doc.slug as string,
    title: doc.title as string,
    excerpt: (doc.excerpt as string) ?? (doc.description as string) ?? "",
    image: (doc.image as string) ?? "",
    categoryTags: (doc.categoryTags as string) ?? ((doc.category as string)?.toUpperCase() ?? ""),
    categories: categories.filter(Boolean),
    author: (doc.author as string) ?? "SJML Team",
    date: formatInsightDate(doc.date as string),
    readTime: (doc.readTime as string) ?? "5 min read",
    displayOrder: doc.displayOrder as number | undefined,
  }
}

function formatInsightDate(raw?: string): string {
  if (!raw) return ""
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function getDefaultInsightGridItems(): InsightGridItem[] {
  return DEFAULT_INSIGHTS_LIST.map((item) => normalizeInsightGridItem(item as unknown as Record<string, unknown>))
}
