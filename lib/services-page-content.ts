/** Services overview page (`/services`) content + typography. */

export interface ServicesPageHero {
  label: string
  titleLine1: string
  titleHighlight: string
  description: string
  image: string
}

export interface ServicesPageGrid {
  label: string
}

export interface ServicesPageCta {
  text: string
  buttonText: string
  buttonUrl: string
}

export interface ServicesPageTypography {
  heroLabelFontSize: number
  heroTitleFontSize: number
  heroDescriptionFontSize: number
  gridLabelFontSize: number
  cardTitleFontSize: number
  cardDescriptionFontSize: number
  cardLinkFontSize: number
  cardIconSize: number
  ctaTextFontSize: number
  ctaButtonFontSize: number
}

export interface NormalizedServicesPageContent {
  hero: ServicesPageHero
  grid: ServicesPageGrid
  cta: ServicesPageCta
  typography: ServicesPageTypography
}

export const DEFAULT_SERVICES_PAGE_TYPOGRAPHY: ServicesPageTypography = {
  heroLabelFontSize: 11,
  heroTitleFontSize: 32,
  heroDescriptionFontSize: 14,
  gridLabelFontSize: 11,
  cardTitleFontSize: 14,
  cardDescriptionFontSize: 13,
  cardLinkFontSize: 12,
  cardIconSize: 36,
  ctaTextFontSize: 18,
  ctaButtonFontSize: 12,
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1486718448742-163732cd1540?auto=format&fit=crop&w=1200&q=80"

export function createDefaultServicesPageContent(): NormalizedServicesPageContent {
  return {
    hero: {
      label: "WHAT WE DO",
      titleLine1: "OUR",
      titleHighlight: "SERVICES",
      description:
        "End-to-end branding and advertising solutions designed to help your business stand out, connect with audiences and achieve measurable growth.",
      image: DEFAULT_HERO_IMAGE,
    },
    grid: {
      label: "WHAT WE DO",
    },
    cta: {
      text: "Have a project in mind? Let's build something great together.",
      buttonText: "LET'S TALK",
      buttonUrl: "/contact",
    },
    typography: { ...DEFAULT_SERVICES_PAGE_TYPOGRAPHY },
  }
}

function normalizeTypography(raw?: Partial<ServicesPageTypography>): ServicesPageTypography {
  const d = DEFAULT_SERVICES_PAGE_TYPOGRAPHY
  return {
    heroLabelFontSize: raw?.heroLabelFontSize ?? d.heroLabelFontSize,
    heroTitleFontSize: raw?.heroTitleFontSize ?? d.heroTitleFontSize,
    heroDescriptionFontSize: raw?.heroDescriptionFontSize ?? d.heroDescriptionFontSize,
    gridLabelFontSize: raw?.gridLabelFontSize ?? d.gridLabelFontSize,
    cardTitleFontSize: raw?.cardTitleFontSize ?? d.cardTitleFontSize,
    cardDescriptionFontSize: raw?.cardDescriptionFontSize ?? d.cardDescriptionFontSize,
    cardLinkFontSize: raw?.cardLinkFontSize ?? d.cardLinkFontSize,
    cardIconSize: raw?.cardIconSize ?? d.cardIconSize,
    ctaTextFontSize: raw?.ctaTextFontSize ?? d.ctaTextFontSize,
    ctaButtonFontSize: raw?.ctaButtonFontSize ?? d.ctaButtonFontSize,
  }
}

export function normalizeServicesPageContent(data: Record<string, unknown>): NormalizedServicesPageContent {
  const defaults = createDefaultServicesPageContent()
  const page = (data.servicesPage as Record<string, unknown>) ?? {}
  const heroRaw = (page.hero as Partial<ServicesPageHero>) ?? (data.hero as Partial<ServicesPageHero & { backgroundImage?: string; title?: string }>) ?? {}
  const gridRaw = (page.grid as Partial<ServicesPageGrid>) ?? {}
  const ctaRaw = (page.cta as Partial<ServicesPageCta>) ?? (data.cta as Partial<ServicesPageCta>) ?? {}
  const typoRaw = (page.typography as Partial<ServicesPageTypography>) ?? (data.typography as Partial<ServicesPageTypography>)

  const legacyTitle = (heroRaw.title as string) ?? ""
  const legacyHeroImage =
    heroRaw.image ??
    (heroRaw as { backgroundImage?: string }).backgroundImage ??
    (data.hero as { backgroundImage?: string })?.backgroundImage ??
    defaults.hero.image

  return {
    hero: {
      label: heroRaw.label ?? defaults.hero.label,
      titleLine1:
        heroRaw.titleLine1 ??
        (legacyTitle.toUpperCase().includes("SERVICES") ? "OUR" : legacyTitle.split(" ")[0]?.toUpperCase() || defaults.hero.titleLine1),
      titleHighlight: heroRaw.titleHighlight ?? (legacyTitle.toUpperCase().includes("SERVICES") ? "SERVICES" : defaults.hero.titleHighlight),
      description: heroRaw.description ?? (data.hero as { description?: string })?.description ?? defaults.hero.description,
      image: legacyHeroImage,
    },
    grid: {
      label: gridRaw.label ?? defaults.grid.label,
    },
    cta: {
      text: ctaRaw.text ?? defaults.cta.text,
      buttonText: ctaRaw.buttonText ?? defaults.cta.buttonText,
      buttonUrl: ctaRaw.buttonUrl ?? defaults.cta.buttonUrl,
    },
    typography: normalizeTypography(typoRaw),
  }
}
