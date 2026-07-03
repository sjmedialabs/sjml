/** Homepage content types and normalization (reference layout: Hero, Stats, Services). */

/** Default hero — modern architecture similar to SJML reference */
export const HOME_DEFAULT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1618220464425-e82ee8423ef8?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1511818965862-d3bd57170400?auto=format&fit=crop&w=1920&q=80",
] as const

export const HOME_COLORS = {
  primary: "#fcc50e",
  primaryHover: "#e3b10d",
  secondary: "#161617",
  text: "#000000",
  textOnDark: "#ffffff",
} as const

export interface HeroSlide {
  id: string
  enabled: boolean
  sortOrder: number
  overTitle: string
  headline: string
  headlineLine2: string
  highlightText: string
  description: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  backgroundImage?: string
  backgroundVideo?: string
}

export interface HomeHero {
  enabled: boolean
  showScrollIndicator: boolean
  scrollIndicatorText: string
  /** Hero headline font size in px (default 42) */
  titleFontSize?: number
  /** Carousel max height in px (default 500) */
  maxHeight?: number
  slides: HeroSlide[]
}

export interface HomeStat {
  id: string
  value: string
  label: string
  icon: string
  enabled: boolean
  sortOrder: number
}

export interface HomeServiceCard {
  id: string
  title: string
  description: string
  icon: string
  link: string
  enabled: boolean
  sortOrder: number
}

export interface HomeServicesSection {
  enabled: boolean
  label: string
  title: string
  description: string
  exploreLinkText: string
  exploreLinkUrl: string
  /** Label font size in px (default 11) */
  labelFontSize?: number
  /** Main section heading font size in px (default 38) */
  sectionTitleFontSize?: number
  /** Section description font size in px (default 15) */
  sectionDescriptionFontSize?: number
  /** Service card width in px (default 190) */
  cardWidth?: number
  /** Service card height in px (default 220) */
  cardHeight?: number
  /** Service card title font size in px (default 13) */
  cardTitleFontSize?: number
  /** Service card description font size in px (default 11) */
  cardDescriptionFontSize?: number
  items: HomeServiceCard[]
}

export interface NormalizedHomeContent {
  hero: HomeHero
  stats: HomeStat[]
  servicesSection: HomeServicesSection
  footer?: Record<string, unknown>
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function createDefaultHero(): HomeHero {
  return {
    enabled: true,
    showScrollIndicator: true,
    scrollIndicatorText: "SCROLL DOWN",
    titleFontSize: 42,
    maxHeight: 500,
    slides: [
      {
        id: "1",
        enabled: true,
        sortOrder: 0,
        overTitle: "WE BUILD BRANDS THAT",
        headline: "INSPIRE.",
        headlineLine2: "CONNECT.",
        highlightText: "PERFORM.",
        description:
          "SJML is a branding and advertising agency that creates meaningful brands, impactful campaigns and digital experiences that drive real business results.",
        primaryButtonText: "OUR SERVICES",
        primaryButtonUrl: "/services",
        secondaryButtonText: "VIEW OUR WORK",
        secondaryButtonUrl: "/work",
        backgroundImage: HOME_DEFAULT_HERO_IMAGES[0],
      },
      {
        id: "2",
        enabled: true,
        sortOrder: 1,
        overTitle: "WE BUILD BRANDS THAT",
        headline: "INSPIRE.",
        headlineLine2: "CONNECT.",
        highlightText: "PERFORM.",
        description:
          "Strategy-led creative that helps brands stand out, connect with audiences, and deliver measurable results.",
        primaryButtonText: "OUR SERVICES",
        primaryButtonUrl: "/services",
        secondaryButtonText: "VIEW OUR WORK",
        secondaryButtonUrl: "/work",
        backgroundImage: HOME_DEFAULT_HERO_IMAGES[1],
      },
      {
        id: "3",
        enabled: true,
        sortOrder: 2,
        overTitle: "WE BUILD BRANDS THAT",
        headline: "INSPIRE.",
        headlineLine2: "CONNECT.",
        highlightText: "PERFORM.",
        description:
          "From identity to campaigns, SJ Media Labs partners with ambitious brands to grow with clarity and impact.",
        primaryButtonText: "OUR SERVICES",
        primaryButtonUrl: "/services",
        secondaryButtonText: "VIEW OUR WORK",
        secondaryButtonUrl: "/work",
        backgroundImage: HOME_DEFAULT_HERO_IMAGES[2],
      },
    ],
  }
}

export function createDefaultStats(): HomeStat[] {
  return [
    { id: "1", value: "500+", label: "HAPPY CLIENTS", icon: "users", enabled: true, sortOrder: 0 },
    { id: "2", value: "1500+", label: "PROJECTS DELIVERED", icon: "layers", enabled: true, sortOrder: 1 },
    { id: "3", value: "12+", label: "YEARS OF EXPERIENCE", icon: "trophy", enabled: true, sortOrder: 2 },
    { id: "4", value: "GLOBAL", label: "CLIENTELE", icon: "globe", enabled: true, sortOrder: 3 },
  ]
}

export function createDefaultServicesSection(): HomeServicesSection {
  return {
    enabled: true,
    label: "WHAT WE DO",
    title: "End-to-End Branding & Advertising Solutions",
    description:
      "From strategy to execution, we offer everything your brand needs to stand out and grow.",
    exploreLinkText: "EXPLORE ALL SERVICES",
    exploreLinkUrl: "/services",
    labelFontSize: 11,
    sectionTitleFontSize: 38,
    sectionDescriptionFontSize: 15,
    cardWidth: 190,
    cardHeight: 220,
    cardTitleFontSize: 13,
    cardDescriptionFontSize: 11,
    items: [
      {
        id: "1",
        title: "BRANDING",
        description: "Strategic identity design and brand systems that resonate with your audience.",
        icon: "",
        link: "/services",
        enabled: true,
        sortOrder: 0,
      },
      {
        id: "2",
        title: "ADVERTISING",
        description: "Creative campaigns that capture attention and convert across every channel.",
        icon: "",
        link: "/services",
        enabled: true,
        sortOrder: 1,
      },
      {
        id: "3",
        title: "DIGITAL MARKETING",
        description: "Data-driven strategies to grow your reach, engagement, and revenue online.",
        icon: "",
        link: "/services",
        enabled: true,
        sortOrder: 2,
      },
      {
        id: "4",
        title: "WEB & EXPERIENCE",
        description: "High-performance websites and digital experiences built for conversion.",
        icon: "",
        link: "/services",
        enabled: true,
        sortOrder: 3,
      },
    ],
  }
}

function withHeroImageFallback(slides: HeroSlide[]): HeroSlide[] {
  return slides.map((s, i) => ({
    ...s,
    backgroundImage:
      s.backgroundImage?.trim() && !s.backgroundImage.includes("placeholder.svg")
        ? s.backgroundImage
        : HOME_DEFAULT_HERO_IMAGES[i % HOME_DEFAULT_HERO_IMAGES.length],
  }))
}

function migrateHeadlineLines(headline: string, headlineLine2?: string): { headline: string; headlineLine2: string } {
  if (headlineLine2?.trim()) {
    return { headline: headline.trim(), headlineLine2: headlineLine2.trim() }
  }
  const trimmed = headline.trim()
  const splitAt = trimmed.indexOf(". ")
  if (splitAt !== -1 && splitAt < trimmed.length - 2) {
    return {
      headline: trimmed.slice(0, splitAt + 1).trim(),
      headlineLine2: trimmed.slice(splitAt + 2).trim(),
    }
  }
  return { headline: trimmed, headlineLine2: "" }
}

function normalizeSlides(raw: Record<string, unknown>, options?: { forAdmin?: boolean }): HeroSlide[] {
  const slides = raw.slides as Partial<HeroSlide>[] | undefined
  if (Array.isArray(slides) && slides.length > 0) {
    const mapped = sortByOrder(
      slides.map((s, i) => {
        const lines = migrateHeadlineLines(s.headline ?? "", s.headlineLine2)
        return {
          id: s.id ?? String(i + 1),
          enabled: s.enabled !== false,
          sortOrder: typeof s.sortOrder === "number" ? s.sortOrder : i,
          overTitle: s.overTitle ?? "",
          headline: lines.headline,
          headlineLine2: lines.headlineLine2,
          highlightText: s.highlightText ?? "",
          description: s.description ?? "",
          primaryButtonText: s.primaryButtonText ?? "OUR SERVICES",
          primaryButtonUrl: s.primaryButtonUrl ?? "/services",
          secondaryButtonText: s.secondaryButtonText ?? "VIEW OUR WORK",
          secondaryButtonUrl: s.secondaryButtonUrl ?? "/work",
          backgroundImage: s.backgroundImage ?? "",
          backgroundVideo: s.backgroundVideo ?? "",
        }
      }),
    )
    const visible = options?.forAdmin ? mapped : mapped.filter((s) => s.enabled)
    return withHeroImageFallback(visible)
  }

  const legacy = raw as {
    title?: string
    description?: string
    rotatingWords?: string[]
    primaryButtonText?: string
    primaryButtonUrl?: string
    secondaryButtonText?: string
    secondaryButtonUrl?: string
    backgroundImage?: string
  }

  const words = legacy.rotatingWords?.filter(Boolean) ?? []
  const legacyLines = migrateHeadlineLines(legacy.title ?? "INSPIRE. CONNECT.")
  return withHeroImageFallback([
    {
      id: "1",
      enabled: true,
      sortOrder: 0,
      overTitle: "WE BUILD BRANDS THAT",
      headline: legacyLines.headline,
      headlineLine2: legacyLines.headlineLine2,
      highlightText: words[0] ?? "PERFORM.",
      description: legacy.description ?? "",
      primaryButtonText: legacy.primaryButtonText ?? "OUR SERVICES",
      primaryButtonUrl: legacy.primaryButtonUrl ?? "/services",
      secondaryButtonText: legacy.secondaryButtonText ?? "VIEW OUR WORK",
      secondaryButtonUrl: legacy.secondaryButtonUrl ?? "/work",
      backgroundImage: legacy.backgroundImage ?? "",
    },
  ])
}

function normalizeStats(raw: unknown): HomeStat[] {
  const presetByIndex = ["users", "layers", "trophy", "globe"] as const
  const isPreset = (v: string) => presetByIndex.includes(v as (typeof presetByIndex)[number])
  if (!Array.isArray(raw) || raw.length === 0) return createDefaultStats()
  return sortByOrder(
    raw.map((s, i) => {
      const item = s as Partial<HomeStat>
      const iconCandidate = item.icon?.trim() ?? ""
      const icon =
        iconCandidate && (isPreset(iconCandidate) || iconCandidate.startsWith("/") || iconCandidate.startsWith("http"))
          ? iconCandidate
          : presetByIndex[i % presetByIndex.length]
      return {
        id: item.id ?? String(i + 1),
        value: item.value ?? "",
        label: item.label ?? "",
        icon,
        enabled: item.enabled !== false,
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : i,
      }
    }),
  ).filter((s) => s.enabled && (s.value || s.label))
}

function normalizeServiceItems(raw: unknown, legacyServices: unknown): HomeServiceCard[] {
  const sectionItems = (raw as { items?: Partial<HomeServiceCard>[] })?.items
  if (Array.isArray(sectionItems) && sectionItems.length > 0) {
    return sortByOrder(
      sectionItems.map((s, i) => ({
        id: s.id ?? String(i + 1),
        title: s.title ?? "",
        description: s.description ?? "",
        icon: s.icon ?? "",
        link: s.link ?? "/services",
        enabled: s.enabled !== false,
        sortOrder: typeof s.sortOrder === "number" ? s.sortOrder : i,
      })),
    ).filter((s) => s.enabled && s.title)
  }

  if (Array.isArray(legacyServices) && legacyServices.length > 0) {
    return sortByOrder(
      legacyServices.map((s, i) => {
        const item = s as {
          id?: string
          title?: string
          description?: string
          icon?: string
          link?: string
          slug?: string
        }
        return {
          id: item.id ?? String(i + 1),
          title: item.title ?? "",
          description: item.description ?? "",
          icon: item.icon ?? "",
          link: item.link ?? (item.slug ? `/services/${item.slug}` : "/services"),
          enabled: true,
          sortOrder: i,
        }
      }),
    ).filter((s) => s.title)
  }

  return createDefaultServicesSection().items
}

export function normalizeHomeContent(
  data: Record<string, unknown>,
  options?: { forAdmin?: boolean },
): NormalizedHomeContent {
  const heroRaw = (data.hero as Record<string, unknown>) ?? {}
  const heroDefaults = createDefaultHero()
  const servicesSectionRaw = (data.homeServicesSection as Partial<HomeServicesSection>) ?? {}
  const legacyMeta = (data.servicesSection as { title?: string; description?: string }) ?? {}
  const defaults = createDefaultServicesSection()

  return {
    hero: {
      enabled: (heroRaw.enabled as boolean | undefined) !== false,
      showScrollIndicator: (heroRaw.showScrollIndicator as boolean | undefined) !== false,
      scrollIndicatorText: (heroRaw.scrollIndicatorText as string) ?? "SCROLL DOWN",
      titleFontSize:
        typeof heroRaw.titleFontSize === "number" ? heroRaw.titleFontSize : heroDefaults.titleFontSize,
      maxHeight: typeof heroRaw.maxHeight === "number" ? heroRaw.maxHeight : heroDefaults.maxHeight,
      slides: normalizeSlides(heroRaw, options),
    },
    stats: normalizeStats(data.stats),
    servicesSection: {
      enabled: servicesSectionRaw.enabled !== false,
      label: servicesSectionRaw.label ?? defaults.label,
      title: servicesSectionRaw.title ?? legacyMeta.title ?? defaults.title,
      description: servicesSectionRaw.description ?? legacyMeta.description ?? defaults.description,
      exploreLinkText: servicesSectionRaw.exploreLinkText ?? defaults.exploreLinkText,
      exploreLinkUrl: servicesSectionRaw.exploreLinkUrl ?? defaults.exploreLinkUrl,
      labelFontSize:
        typeof servicesSectionRaw.labelFontSize === "number" ? servicesSectionRaw.labelFontSize : defaults.labelFontSize,
      sectionTitleFontSize:
        typeof servicesSectionRaw.sectionTitleFontSize === "number"
          ? servicesSectionRaw.sectionTitleFontSize
          : defaults.sectionTitleFontSize,
      sectionDescriptionFontSize:
        typeof servicesSectionRaw.sectionDescriptionFontSize === "number"
          ? servicesSectionRaw.sectionDescriptionFontSize
          : defaults.sectionDescriptionFontSize,
      cardWidth:
        typeof servicesSectionRaw.cardWidth === "number" ? servicesSectionRaw.cardWidth : defaults.cardWidth,
      cardHeight:
        typeof servicesSectionRaw.cardHeight === "number" ? servicesSectionRaw.cardHeight : defaults.cardHeight,
      cardTitleFontSize:
        typeof servicesSectionRaw.cardTitleFontSize === "number"
          ? servicesSectionRaw.cardTitleFontSize
          : defaults.cardTitleFontSize,
      cardDescriptionFontSize:
        typeof servicesSectionRaw.cardDescriptionFontSize === "number"
          ? servicesSectionRaw.cardDescriptionFontSize
          : defaults.cardDescriptionFontSize,
      items: normalizeServiceItems(data.homeServicesSection, data.services),
    },
    footer: data.footer as Record<string, unknown> | undefined,
  }
}
