/** Work overview page (`/work`) content + typography. */

export interface WorkPageHero {
  label: string
  titleLine1: string
  titleHighlight: string
  description: string
  image: string
}

export interface WorkPageFilterCategory {
  id: string
  label: string
  value: string
}

export interface WorkPageStatItem {
  id: string
  value: string
  label: string
  description: string
  icon: string
}

export interface WorkPageTestimonial {
  quote: string
  author: string
  role: string
}

export interface WorkPageCta {
  textLine1: string
  textHighlight: string
  buttonText: string
  buttonUrl: string
}

export interface WorkPageTypography {
  heroLabelFontSize: number
  heroTitleFontSize: number
  heroDescriptionFontSize: number
  filterFontSize: number
  cardCategoryFontSize: number
  cardTitleFontSize: number
  cardSubtitleFontSize: number
  statValueFontSize: number
  statLabelFontSize: number
  statDescriptionFontSize: number
  testimonialFontSize: number
  ctaTextFontSize: number
  ctaButtonFontSize: number
}

export interface NormalizedWorkPageContent {
  hero: WorkPageHero
  filterCategories: WorkPageFilterCategory[]
  industryFilterLabel: string
  stats: WorkPageStatItem[]
  testimonial: WorkPageTestimonial
  cta: WorkPageCta
  typography: WorkPageTypography
}

export const DEFAULT_WORK_PAGE_TYPOGRAPHY: WorkPageTypography = {
  heroLabelFontSize: 11,
  heroTitleFontSize: 36,
  heroDescriptionFontSize: 14,
  filterFontSize: 11,
  cardCategoryFontSize: 10,
  cardTitleFontSize: 15,
  cardSubtitleFontSize: 12,
  statValueFontSize: 28,
  statLabelFontSize: 13,
  statDescriptionFontSize: 12,
  testimonialFontSize: 14,
  ctaTextFontSize: 18,
  ctaButtonFontSize: 12,
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1486718448742-163732cd1540?auto=format&fit=crop&w=1200&q=80"

const DEFAULT_FILTER_CATEGORIES: WorkPageFilterCategory[] = [
  { id: "all", label: "ALL WORK", value: "all" },
  { id: "branding", label: "BRANDING", value: "branding" },
  { id: "advertising", label: "ADVERTISING", value: "advertising" },
  { id: "digital", label: "DIGITAL", value: "digital" },
  { id: "packaging", label: "PACKAGING", value: "packaging" },
  { id: "motion", label: "MOTION & VIDEO", value: "motion-video" },
  { id: "web", label: "WEB & EXPERIENCE", value: "web-experience" },
]

export function createDefaultWorkPageContent(): NormalizedWorkPageContent {
  return {
    hero: {
      label: "OUR WORK",
      titleLine1: "Work that speaks.",
      titleHighlight: "Results that matter.",
      description:
        "Explore our work across industries. From bold ideas to flawless execution, we help brands connect, engage and grow.",
      image: DEFAULT_HERO_IMAGE,
    },
    filterCategories: DEFAULT_FILTER_CATEGORIES.map((c) => ({ ...c })),
    industryFilterLabel: "ALL INDUSTRIES",
    stats: [
      { id: "s1", value: "500+", label: "Projects Delivered", description: "Successful projects across industries and platforms.", icon: "users" },
      { id: "s2", value: "12+", label: "Years of Experience", description: "A decade of creativity, strategy and execution.", icon: "trophy" },
      { id: "s3", value: "Global", label: "Clients", description: "Trusted by startups, enterprises and global brands.", icon: "globe" },
    ],
    testimonial: {
      quote:
        "SJML transformed our brand into something powerful and memorable. Their team truly understands our vision and delivers beyond expectations.",
      author: "Rohan Mehta",
      role: "CEO, Finova",
    },
    cta: {
      textLine1: "Have a project in mind?",
      textHighlight: "Let's create something great together.",
      buttonText: "LET'S TALK",
      buttonUrl: "/contact",
    },
    typography: { ...DEFAULT_WORK_PAGE_TYPOGRAPHY },
  }
}

function normalizeTypography(raw?: Partial<WorkPageTypography>): WorkPageTypography {
  const d = DEFAULT_WORK_PAGE_TYPOGRAPHY
  return {
    heroLabelFontSize: raw?.heroLabelFontSize ?? d.heroLabelFontSize,
    heroTitleFontSize: raw?.heroTitleFontSize ?? d.heroTitleFontSize,
    heroDescriptionFontSize: raw?.heroDescriptionFontSize ?? d.heroDescriptionFontSize,
    filterFontSize: raw?.filterFontSize ?? d.filterFontSize,
    cardCategoryFontSize: raw?.cardCategoryFontSize ?? d.cardCategoryFontSize,
    cardTitleFontSize: raw?.cardTitleFontSize ?? d.cardTitleFontSize,
    cardSubtitleFontSize: raw?.cardSubtitleFontSize ?? d.cardSubtitleFontSize,
    statValueFontSize: raw?.statValueFontSize ?? d.statValueFontSize,
    statLabelFontSize: raw?.statLabelFontSize ?? d.statLabelFontSize,
    statDescriptionFontSize: raw?.statDescriptionFontSize ?? d.statDescriptionFontSize,
    testimonialFontSize: raw?.testimonialFontSize ?? d.testimonialFontSize,
    ctaTextFontSize: raw?.ctaTextFontSize ?? d.ctaTextFontSize,
    ctaButtonFontSize: raw?.ctaButtonFontSize ?? d.ctaButtonFontSize,
  }
}

export function normalizeWorkPageContent(data: Record<string, unknown>): NormalizedWorkPageContent {
  const defaults = createDefaultWorkPageContent()
  const page = (data.workPage as Record<string, unknown>) ?? data
  const heroRaw = (page.hero as Partial<WorkPageHero>) ?? (data.hero as Partial<WorkPageHero & { subtitle?: string }>) ?? {}

  const legacyTitle = heroRaw.titleLine1 ?? (heroRaw as { title?: string }).title ?? defaults.hero.titleLine1
  const legacyDesc =
    heroRaw.description ??
    (heroRaw as { subtitle?: string }).subtitle ??
    (data.hero as { description?: string })?.description ??
    defaults.hero.description

  return {
    hero: {
      label: heroRaw.label ?? defaults.hero.label,
      titleLine1: legacyTitle.includes(".") ? legacyTitle.split(".").slice(0, 1).join(".") + "." : legacyTitle,
      titleHighlight: heroRaw.titleHighlight ?? defaults.hero.titleHighlight,
      description: legacyDesc,
      image: heroRaw.image ?? defaults.hero.image,
    },
    filterCategories: Array.isArray(page.filterCategories) && page.filterCategories.length
      ? (page.filterCategories as WorkPageFilterCategory[])
      : defaults.filterCategories,
    industryFilterLabel: (page.industryFilterLabel as string) ?? defaults.industryFilterLabel,
    stats: Array.isArray(page.stats) && page.stats.length ? (page.stats as WorkPageStatItem[]) : defaults.stats,
    testimonial: { ...defaults.testimonial, ...(page.testimonial as Partial<WorkPageTestimonial>) },
    cta: { ...defaults.cta, ...(page.cta as Partial<WorkPageCta>) },
    typography: normalizeTypography((page.typography as Partial<WorkPageTypography>) ?? (data.typography as Partial<WorkPageTypography>)),
  }
}
