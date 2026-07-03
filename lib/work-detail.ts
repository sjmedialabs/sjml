/** Returns image URLs that are non-empty and not placeholders */
export function validWorkImages(urls: string[] | undefined | null): string[] {
  if (!urls?.length) return []
  return urls.filter(
    (u) =>
      typeof u === "string" &&
      u.trim() !== "" &&
      !u.includes("placeholder.svg") &&
      !u.endsWith("placeholder.svg"),
  )
}

export function isValidWorkImage(url: string | undefined): boolean {
  return !!url && url.trim() !== "" && !url.includes("placeholder.svg")
}

export interface WorkDetailData {
  id: string
  slug: string
  title: string
  description?: string
  image: string
  cardSubtitle?: string
  categoryTags?: string
  categories?: string[]
  displayOrder?: number
  category?: string
  client?: string
  industry?: string
  role?: string
  technology?: string
  year?: string
  tags?: string[]
  isActive?: boolean
  isFeatured?: boolean
  detailTemplate?: import("@/lib/work-detail-template").WorkDetailTemplate
  sections?: import("@/lib/work-sections").WorkDetailSections
  /** @deprecated Legacy fields — migrated via normalizeWorkSections */
  overview?: { title: string; description: string; points: string[] }
  logoVariations?: string[]
  mobileCarouselImages?: string[]
  mobileCarouselCaption?: string
  section4?: {
    caption?: string
    rectangleImage?: string
    squareImage1?: string
    squareImage2?: string
  }
  process?: Array<{ step: string; title: string; description: string }>
  gallery?: string[]
}
