import { DEFAULT_WORKS_LIST } from "@/lib/default-works-list"

export interface WorkGridItem {
  id: string
  slug: string
  title: string
  image: string
  cardSubtitle: string
  categoryTags: string
  categories: string[]
  industry?: string
  isVideo?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  branding: "BRANDING",
  advertising: "ADVERTISING",
  digital: "DIGITAL",
  packaging: "PACKAGING",
  "motion-video": "MOTION & VIDEO",
  "web-experience": "WEB & EXPERIENCE",
}

function tagToCategorySlug(tag: string): string {
  const lower = tag.trim().toLowerCase()
  if (lower.includes("motion") || lower.includes("video")) return "motion-video"
  if (lower.includes("web") || lower.includes("experience")) return "web-experience"
  if (lower.includes("packaging")) return "packaging"
  if (lower.includes("advertis")) return "advertising"
  if (lower.includes("digital")) return "digital"
  if (lower.includes("brand")) return "branding"
  return lower.replace(/\s+/g, "-")
}

function slugToLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, " ").toUpperCase()
}

function buildCategoryTags(categories: string[], fallback?: string): string {
  if (categories.length) return categories.map(slugToLabel).join(", ")
  return fallback?.toUpperCase() ?? ""
}

function extractCardSubtitle(work: Record<string, unknown>): string {
  const explicit = work.cardSubtitle as string | undefined
  if (explicit?.trim()) return explicit.trim()

  const role = work.role as string | undefined
  if (role?.trim()) return role.trim()

  const detailTemplate = work.detailTemplate as { pillars?: Array<{ bullets?: string[] }> } | undefined
  const deliverables = detailTemplate?.pillars?.find((p) => p.bullets?.length)?.bullets
  if (deliverables?.length) return deliverables.slice(0, 2).join(", ")

  const description = work.description as string | undefined
  if (description?.trim()) {
    const first = description.split(".")[0]?.trim()
    if (first && first.length < 80) return first
  }

  return ""
}

/** Normalize a MongoDB work document into a grid card item. */
export function normalizeWorkGridItem(work: Record<string, unknown>): WorkGridItem {
  const rawCategories = (work.categories as string[])?.length
    ? (work.categories as string[])
    : ((work.tags as string[]) ?? []).map(tagToCategorySlug)

  const categories = [...new Set(rawCategories.filter(Boolean))]
  const categoryTags =
    (work.categoryTags as string)?.trim() ||
    buildCategoryTags(categories, work.category as string)

  const isVideo =
    categories.includes("motion-video") ||
    categoryTags.toUpperCase().includes("MOTION") ||
    categoryTags.toUpperCase().includes("VIDEO")

  return {
    id: (work.id as string) ?? String(work._id ?? ""),
    slug: work.slug as string,
    title: work.title as string,
    image: (work.image as string) ?? "",
    cardSubtitle: extractCardSubtitle(work),
    categoryTags,
    categories,
    industry: work.industry as string | undefined,
    isVideo,
  }
}

/** Default grid items from mockup seed data — used when DB has no works. */
export function getDefaultWorkGridItems(): WorkGridItem[] {
  return DEFAULT_WORKS_LIST.map((work) =>
    normalizeWorkGridItem({
      ...work,
      category: work.categoryTags,
    }),
  )
}
