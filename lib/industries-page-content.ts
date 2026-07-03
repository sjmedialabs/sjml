/** Industries page (`/industries`) content + typography. */

export interface IndustriesPageHero {
  label: string
  titleLine1: string
  titleHighlight: string
  description: string
  image: string
}

export interface IndustriesPageExpertise {
  label: string
  titleLine1: string
  titleLine2: string
  description: string
}

export interface IndustryCardItem {
  id: string
  title: string
  description: string
  image: string
  icon: string
  linkText: string
  linkUrl: string
  displayOrder: number
  isActive: boolean
}

export interface IndustryStatItem {
  id: string
  value: string
  label: string
  description: string
  icon: string
}

export interface IndustriesPageGrid {
  exploreButtonText: string
  exploreButtonUrl: string
}

export interface IndustriesPageCta {
  label: string
  heading: string
  text: string
  buttonText: string
  buttonUrl: string
}

export interface IndustriesPageTypography {
  heroLabelFontSize: number
  heroTitleFontSize: number
  heroDescriptionFontSize: number
  expertiseLabelFontSize: number
  expertiseTitleFontSize: number
  expertiseDescriptionFontSize: number
  cardTitleFontSize: number
  cardDescriptionFontSize: number
  cardLinkFontSize: number
  cardIconSize: number
  exploreButtonFontSize: number
  statValueFontSize: number
  statLabelFontSize: number
  statDescriptionFontSize: number
  statIconSize: number
  ctaLabelFontSize: number
  ctaHeadingFontSize: number
  ctaTextFontSize: number
  ctaButtonFontSize: number
}

export interface NormalizedIndustriesPageContent {
  hero: IndustriesPageHero
  expertise: IndustriesPageExpertise
  grid: IndustriesPageGrid
  cards: IndustryCardItem[]
  stats: IndustryStatItem[]
  cta: IndustriesPageCta
  typography: IndustriesPageTypography
}

export const DEFAULT_INDUSTRIES_TYPOGRAPHY: IndustriesPageTypography = {
  heroLabelFontSize: 11,
  heroTitleFontSize: 36,
  heroDescriptionFontSize: 14,
  expertiseLabelFontSize: 11,
  expertiseTitleFontSize: 28,
  expertiseDescriptionFontSize: 14,
  cardTitleFontSize: 15,
  cardDescriptionFontSize: 12,
  cardLinkFontSize: 11,
  cardIconSize: 22,
  exploreButtonFontSize: 12,
  statValueFontSize: 28,
  statLabelFontSize: 11,
  statDescriptionFontSize: 12,
  statIconSize: 32,
  ctaLabelFontSize: 11,
  ctaHeadingFontSize: 22,
  ctaTextFontSize: 14,
  ctaButtonFontSize: 12,
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1486718448742-163732cd1540?auto=format&fit=crop&w=1200&q=80"

const DEFAULT_CARDS: IndustryCardItem[] = [
  {
    id: "ind-1",
    title: "Real Estate & Construction",
    description: "Branding and marketing solutions that help developers and builders stand out in competitive markets.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    icon: "real-estate",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 0,
    isActive: true,
  },
  {
    id: "ind-2",
    title: "Healthcare & Wellness",
    description: "Trusted communication strategies that connect healthcare brands with patients and communities.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    icon: "healthcare",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "ind-3",
    title: "Education & Training",
    description: "Engaging brand experiences that inspire learners and elevate educational institutions.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    icon: "education",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "ind-4",
    title: "Retail & E-commerce",
    description: "Creative campaigns and digital strategies that drive footfall, clicks and conversions.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    icon: "retail",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "ind-5",
    title: "IT & Technology",
    description: "Modern branding for tech companies that need to communicate innovation with clarity.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    icon: "technology",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "ind-6",
    title: "Manufacturing & Industrial",
    description: "Strong brand identities for industrial businesses competing in global markets.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    icon: "manufacturing",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "ind-7",
    title: "Finance & Insurance",
    description: "Credibility-building brand strategies for financial services and insurance providers.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    icon: "finance",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: "ind-8",
    title: "Food & Beverages",
    description: "Appetizing brand design and marketing that makes food brands impossible to ignore.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    icon: "food",
    linkText: "VIEW OUR WORK",
    linkUrl: "/work",
    displayOrder: 7,
    isActive: true,
  },
]

const DEFAULT_STATS: IndustryStatItem[] = [
  {
    id: "stat-1",
    value: "25+",
    label: "INDUSTRIES SERVED",
    description: "Diverse experience. Smarter solutions.",
    icon: "users",
  },
  {
    id: "stat-2",
    value: "500+",
    label: "HAPPY CLIENTS",
    description: "Trusted by startups, SMEs and enterprises.",
    icon: "briefcase",
  },
  {
    id: "stat-3",
    value: "5000+",
    label: "PROJECTS DELIVERED",
    description: "Creative. Strategic. Results-driven.",
    icon: "rocket",
  },
  {
    id: "stat-4",
    value: "GLOBAL",
    label: "PRESENCE",
    description: "Serving clients across India and beyond.",
    icon: "globe",
  },
]

export function createDefaultIndustriesPageContent(): NormalizedIndustriesPageContent {
  return {
    hero: {
      label: "INDUSTRIES",
      titleLine1: "Experience Across Industries.",
      titleHighlight: "Impact That Lasts.",
      description:
        "We partner with businesses from diverse industries to solve their unique challenges and create meaningful brand experiences that drive growth and results.",
      image: DEFAULT_HERO_IMAGE,
    },
    expertise: {
      label: "OUR EXPERTISE",
      titleLine1: "We understand your industry.",
      titleLine2: "We grow your brand.",
      description:
        "Every industry has its own dynamics, audience and challenges. Our strategic approach and creative execution help businesses stand out, connect better and achieve measurable success.",
    },
    grid: {
      exploreButtonText: "EXPLORE MORE INDUSTRIES",
      exploreButtonUrl: "/contact",
    },
    cards: DEFAULT_CARDS.map((c) => ({ ...c })),
    stats: DEFAULT_STATS.map((s) => ({ ...s })),
    cta: {
      label: "LET'S BUILD SOMETHING GREAT",
      heading: "Your industry. Our expertise. Extraordinary results.",
      text: "Let's collaborate to create strategies and experiences that move your business forward.",
      buttonText: "LET'S TALK",
      buttonUrl: "/contact",
    },
    typography: { ...DEFAULT_INDUSTRIES_TYPOGRAPHY },
  }
}

function normalizeTypography(raw?: Partial<IndustriesPageTypography>): IndustriesPageTypography {
  const d = DEFAULT_INDUSTRIES_TYPOGRAPHY
  return {
    heroLabelFontSize: raw?.heroLabelFontSize ?? d.heroLabelFontSize,
    heroTitleFontSize: raw?.heroTitleFontSize ?? d.heroTitleFontSize,
    heroDescriptionFontSize: raw?.heroDescriptionFontSize ?? d.heroDescriptionFontSize,
    expertiseLabelFontSize: raw?.expertiseLabelFontSize ?? d.expertiseLabelFontSize,
    expertiseTitleFontSize: raw?.expertiseTitleFontSize ?? d.expertiseTitleFontSize,
    expertiseDescriptionFontSize: raw?.expertiseDescriptionFontSize ?? d.expertiseDescriptionFontSize,
    cardTitleFontSize: raw?.cardTitleFontSize ?? d.cardTitleFontSize,
    cardDescriptionFontSize: raw?.cardDescriptionFontSize ?? d.cardDescriptionFontSize,
    cardLinkFontSize: raw?.cardLinkFontSize ?? d.cardLinkFontSize,
    cardIconSize: raw?.cardIconSize ?? d.cardIconSize,
    exploreButtonFontSize: raw?.exploreButtonFontSize ?? d.exploreButtonFontSize,
    statValueFontSize: raw?.statValueFontSize ?? d.statValueFontSize,
    statLabelFontSize: raw?.statLabelFontSize ?? d.statLabelFontSize,
    statDescriptionFontSize: raw?.statDescriptionFontSize ?? d.statDescriptionFontSize,
    statIconSize: raw?.statIconSize ?? d.statIconSize,
    ctaLabelFontSize: raw?.ctaLabelFontSize ?? d.ctaLabelFontSize,
    ctaHeadingFontSize: raw?.ctaHeadingFontSize ?? d.ctaHeadingFontSize,
    ctaTextFontSize: raw?.ctaTextFontSize ?? d.ctaTextFontSize,
    ctaButtonFontSize: raw?.ctaButtonFontSize ?? d.ctaButtonFontSize,
  }
}

function mapCards(raw: unknown): IndustryCardItem[] {
  const defaults = createDefaultIndustriesPageContent().cards
  if (!Array.isArray(raw) || raw.length === 0) return defaults
  return raw.map((item, i) => {
    const c = item as Partial<IndustryCardItem>
    return {
      id: c.id ?? defaults[i]?.id ?? String(i + 1),
      title: c.title ?? defaults[i]?.title ?? "",
      description: c.description ?? defaults[i]?.description ?? "",
      image: c.image ?? defaults[i]?.image ?? "",
      icon: c.icon ?? defaults[i]?.icon ?? "real-estate",
      linkText: c.linkText ?? defaults[i]?.linkText ?? "VIEW OUR WORK",
      linkUrl: c.linkUrl ?? defaults[i]?.linkUrl ?? "/work",
      displayOrder: typeof c.displayOrder === "number" ? c.displayOrder : i,
      isActive: c.isActive !== false,
    }
  })
}

function mapStats(raw: unknown): IndustryStatItem[] {
  const defaults = createDefaultIndustriesPageContent().stats
  if (!Array.isArray(raw) || raw.length === 0) return defaults
  return raw.map((item, i) => {
    const s = item as Partial<IndustryStatItem>
    return {
      id: s.id ?? defaults[i]?.id ?? String(i + 1),
      value: s.value ?? defaults[i]?.value ?? "",
      label: s.label ?? defaults[i]?.label ?? "",
      description: s.description ?? defaults[i]?.description ?? "",
      icon: s.icon ?? defaults[i]?.icon ?? "users",
    }
  })
}

export function normalizeIndustriesPageContent(data: Record<string, unknown>): NormalizedIndustriesPageContent {
  const defaults = createDefaultIndustriesPageContent()
  const page = (data.industriesPage as Record<string, unknown>) ?? data
  const heroRaw = (page.hero as Partial<IndustriesPageHero>) ?? {}
  const expertiseRaw = (page.expertise as Partial<IndustriesPageExpertise>) ?? {}
  const gridRaw = (page.grid as Partial<IndustriesPageGrid>) ?? {}
  const ctaRaw = (page.cta as Partial<IndustriesPageCta>) ?? {}
  const typoRaw = (page.typography as Partial<IndustriesPageTypography>) ?? (data.typography as Partial<IndustriesPageTypography>)

  return {
    hero: {
      label: heroRaw.label ?? defaults.hero.label,
      titleLine1: heroRaw.titleLine1 ?? defaults.hero.titleLine1,
      titleHighlight: heroRaw.titleHighlight ?? defaults.hero.titleHighlight,
      description: heroRaw.description ?? defaults.hero.description,
      image: heroRaw.image ?? defaults.hero.image,
    },
    expertise: {
      label: expertiseRaw.label ?? defaults.expertise.label,
      titleLine1: expertiseRaw.titleLine1 ?? defaults.expertise.titleLine1,
      titleLine2: expertiseRaw.titleLine2 ?? defaults.expertise.titleLine2,
      description: expertiseRaw.description ?? defaults.expertise.description,
    },
    grid: {
      exploreButtonText: gridRaw.exploreButtonText ?? defaults.grid.exploreButtonText,
      exploreButtonUrl: gridRaw.exploreButtonUrl ?? defaults.grid.exploreButtonUrl,
    },
    cards: mapCards(page.cards),
    stats: mapStats(page.stats),
    cta: {
      label: ctaRaw.label ?? defaults.cta.label,
      heading: ctaRaw.heading ?? defaults.cta.heading,
      text: ctaRaw.text ?? defaults.cta.text,
      buttonText: ctaRaw.buttonText ?? defaults.cta.buttonText,
      buttonUrl: ctaRaw.buttonUrl ?? defaults.cta.buttonUrl,
    },
    typography: normalizeTypography(typoRaw),
  }
}

export const INDUSTRY_STAT_ICON_PRESETS = ["users", "briefcase", "rocket", "globe", "layers", "trophy"] as const