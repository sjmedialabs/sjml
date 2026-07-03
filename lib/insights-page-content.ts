/** Insights overview page (`/insights`) content + typography. */

export interface InsightsPageHero {
  label: string
  titleLine1: string
  titleHighlight: string
  description: string
  image: string
}

export interface InsightsPageFilterCategory {
  id: string
  label: string
  value: string
}

export interface InsightsPageLoadMore {
  buttonText: string
  initialVisible: number
  loadBatch: number
}

export interface InsightsPageSidebarNewsletter {
  label: string
  heading: string
  text: string
  placeholder: string
  buttonText: string
}

export interface InsightsPageTypography {
  heroLabelFontSize: number
  heroTitleFontSize: number
  heroDescriptionFontSize: number
  filterFontSize: number
  searchFontSize: number
  cardCategoryFontSize: number
  cardTitleFontSize: number
  cardExcerptFontSize: number
  cardMetaFontSize: number
  loadMoreFontSize: number
  detailCategoryFontSize: number
  detailTitleFontSize: number
  detailMetaFontSize: number
  detailBodyFontSize: number
  detailSectionHeadingFontSize: number
  sidebarHeadingFontSize: number
  sidebarCardTitleFontSize: number
  sidebarCardMetaFontSize: number
  newsletterTextFontSize: number
  newsletterButtonFontSize: number
}

export interface NormalizedInsightsPageContent {
  hero: InsightsPageHero
  filterCategories: InsightsPageFilterCategory[]
  searchPlaceholder: string
  loadMore: InsightsPageLoadMore
  relatedHeading: string
  sidebarNewsletter: InsightsPageSidebarNewsletter
  typography: InsightsPageTypography
}

export const DEFAULT_INSIGHTS_PAGE_TYPOGRAPHY: InsightsPageTypography = {
  heroLabelFontSize: 11,
  heroTitleFontSize: 36,
  heroDescriptionFontSize: 14,
  filterFontSize: 11,
  searchFontSize: 12,
  cardCategoryFontSize: 10,
  cardTitleFontSize: 16,
  cardExcerptFontSize: 13,
  cardMetaFontSize: 11,
  loadMoreFontSize: 11,
  detailCategoryFontSize: 10,
  detailTitleFontSize: 34,
  detailMetaFontSize: 12,
  detailBodyFontSize: 15,
  detailSectionHeadingFontSize: 15,
  sidebarHeadingFontSize: 11,
  sidebarCardTitleFontSize: 13,
  sidebarCardMetaFontSize: 11,
  newsletterTextFontSize: 13,
  newsletterButtonFontSize: 11,
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1486718448742-163732cd1540?auto=format&fit=crop&w=1200&q=80"

const DEFAULT_FILTER_CATEGORIES: InsightsPageFilterCategory[] = [
  { id: "all", label: "ALL", value: "all" },
  { id: "branding", label: "BRANDING", value: "branding" },
  { id: "marketing", label: "MARKETING", value: "marketing" },
  { id: "design", label: "DESIGN", value: "design" },
  { id: "digital", label: "DIGITAL", value: "digital" },
  { id: "business", label: "BUSINESS", value: "business" },
  { id: "industry-trends", label: "INDUSTRY TRENDS", value: "industry-trends" },
]

export function createDefaultInsightsPageContent(): NormalizedInsightsPageContent {
  return {
    hero: {
      label: "INSIGHTS",
      titleLine1: "Ideas. Strategies. Perspectives.",
      titleHighlight: "Insights that inspire.",
      description:
        "Stay updated with the latest trends, insights and industry perspectives from our experts.",
      image: DEFAULT_HERO_IMAGE,
    },
    filterCategories: DEFAULT_FILTER_CATEGORIES.map((c) => ({ ...c })),
    searchPlaceholder: "Search insights...",
    loadMore: {
      buttonText: "LOAD MORE INSIGHTS",
      initialVisible: 6,
      loadBatch: 3,
    },
    relatedHeading: "RELATED INSIGHTS",
    sidebarNewsletter: {
      label: "NEWSLETTER",
      heading: "Stay inspired.",
      text: "Subscribe to get the latest insights and updates delivered to your inbox.",
      placeholder: "Enter your email",
      buttonText: "SUBSCRIBE",
    },
    typography: { ...DEFAULT_INSIGHTS_PAGE_TYPOGRAPHY },
  }
}

export function normalizeInsightsPageContent(data: Record<string, unknown>): NormalizedInsightsPageContent {
  const defaults = createDefaultInsightsPageContent()
  const page = (data.insightsPage as Record<string, unknown>) ?? data
  const heroRaw = (page.hero as Partial<InsightsPageHero>) ?? (data.hero as Partial<InsightsPageHero & { title?: string }>) ?? {}

  return {
    hero: {
      label: heroRaw.label ?? defaults.hero.label,
      titleLine1: heroRaw.titleLine1 ?? (heroRaw as { title?: string }).title?.split(".")[0] ?? defaults.hero.titleLine1,
      titleHighlight: heroRaw.titleHighlight ?? defaults.hero.titleHighlight,
      description: heroRaw.description ?? (heroRaw as { subtitle?: string }).subtitle ?? defaults.hero.description,
      image: heroRaw.image ?? defaults.hero.image,
    },
    filterCategories: Array.isArray(page.filterCategories) && page.filterCategories.length
      ? (page.filterCategories as InsightsPageFilterCategory[])
      : defaults.filterCategories,
    searchPlaceholder: (page.searchPlaceholder as string) ?? defaults.searchPlaceholder,
    loadMore: { ...defaults.loadMore, ...(page.loadMore as Partial<InsightsPageLoadMore>) },
    relatedHeading: (page.relatedHeading as string) ?? defaults.relatedHeading,
    sidebarNewsletter: {
      ...defaults.sidebarNewsletter,
      ...(page.sidebarNewsletter as Partial<InsightsPageSidebarNewsletter>),
      ...(page.newsletter as Partial<InsightsPageSidebarNewsletter>),
      heading:
        (page.sidebarNewsletter as Partial<InsightsPageSidebarNewsletter>)?.heading ??
        (page.newsletter as Partial<InsightsPageSidebarNewsletter>)?.heading ??
        defaults.sidebarNewsletter.heading,
    },
    typography: { ...defaults.typography, ...((page.typography as Partial<InsightsPageTypography>) ?? {}) },
  }
}
