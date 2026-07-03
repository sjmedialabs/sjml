import { createDefaultStats, type HomeStat } from "@/lib/home-content"

export interface AboutHero {
  titleLine1: string
  titleHighlight: string
  taglineLine1: string
  taglineLine2: string
  description: string
  image: string
}

export interface AboutWhoWeAre {
  label: string
  titleLine1: string
  titleLine2: string
  titleHighlight: string
  description: string
  buttonText: string
  buttonUrl: string
  image: string
}

export interface AboutValuesTypography {
  sectionLabelFontSize: number
  itemTitleFontSize: number
  itemDescriptionFontSize: number
  iconCircleSize: number
  iconGlyphSize: number
}

export interface AboutJourneyTypography {
  sectionLabelFontSize: number
  iconSize: number
  statValueFontSize: number
  statLabelFontSize: number
  statDescriptionFontSize: number
}

export const DEFAULT_VALUES_TYPOGRAPHY: AboutValuesTypography = {
  sectionLabelFontSize: 11,
  itemTitleFontSize: 13,
  itemDescriptionFontSize: 14,
  iconCircleSize: 48,
  iconGlyphSize: 20,
}

export const DEFAULT_JOURNEY_TYPOGRAPHY: AboutJourneyTypography = {
  sectionLabelFontSize: 11,
  iconSize: 32,
  statValueFontSize: 26,
  statLabelFontSize: 11,
  statDescriptionFontSize: 13,
}

export interface AboutValueItem {
  id: string
  title: string
  description: string
  icon: string
}

export interface AboutJourneyStat {
  id: string
  value: string
  label: string
  description: string
  icon: string
}

export interface AboutValuesSection {
  label: string
  items: AboutValueItem[]
  typography: AboutValuesTypography
}

export interface AboutJourneySection {
  label: string
  items: AboutJourneyStat[]
  typography: AboutJourneyTypography
}

export interface NormalizedAboutContent {
  hero: AboutHero
  whoWeAre: AboutWhoWeAre
  valuesSection: AboutValuesSection
  journeySection: AboutJourneySection
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1486718448742-163732cd1540?auto=format&fit=crop&w=1200&q=80"

const DEFAULT_WHO_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"

export function createDefaultAboutContent(): NormalizedAboutContent {
  const homeStats = createDefaultStats()
  return {
    hero: {
      titleLine1: "ABOUT",
      titleHighlight: "US",
      taglineLine1: "We don't just create brands,",
      taglineLine2: "we build strong connections.",
      description:
        "SJML is a branding and advertising agency driven by creativity, strategy and results. We partner with businesses to create meaningful brands and impactful communication that inspire, engage and grow.",
      image: DEFAULT_HERO_IMAGE,
    },
    whoWeAre: {
      label: "WHO WE ARE",
      titleLine1: "Creative Minds.",
      titleLine2: "Strategic Thinkers.",
      titleHighlight: "Result Driven.",
      description:
        "Founded with a passion for creativity and a commitment to excellence, SJML helps businesses of all sizes stand out in a crowded marketplace. Our team of strategists, designers, marketers and storytellers work together to turn ideas into powerful brand experiences.",
      buttonText: "OUR STORY",
      buttonUrl: "/contact",
      image: DEFAULT_WHO_IMAGE,
    },
    valuesSection: {
      label: "OUR VALUES",
      typography: { ...DEFAULT_VALUES_TYPOGRAPHY },
      items: [
        {
          id: "1",
          title: "CREATIVITY",
          description: "We believe in ideas that are original, impactful and meaningful.",
          icon: "creativity",
        },
        {
          id: "2",
          title: "STRATEGY",
          description: "Every idea is backed by research, insight and a clear strategy.",
          icon: "strategy",
        },
        {
          id: "3",
          title: "COLLABORATION",
          description: "We work as an extension of your team to deliver the best results.",
          icon: "collaboration",
        },
        {
          id: "4",
          title: "RESULTS",
          description: "We are committed to delivering measurable impact and real growth.",
          icon: "results",
        },
      ],
    },
    journeySection: {
      label: "OUR JOURNEY IN NUMBERS",
      typography: { ...DEFAULT_JOURNEY_TYPOGRAPHY },
      items: homeStats.map((s, i) => ({
        id: s.id,
        value: s.value,
        label: s.label,
        description: defaultJourneyDescriptions[i] ?? "",
        icon: s.icon,
      })),
    },
  }
}

const defaultJourneyDescriptions = [
  "Trusted by startups, enterprises and brands across industries.",
  "Successful branding and advertising projects that make an impact.",
  "A decade of creativity, strategy and delivering results that matter.",
  "Serving clients across India and international markets.",
]

function normalizeValuesTypography(raw?: Partial<AboutValuesTypography>): AboutValuesTypography {
  const d = DEFAULT_VALUES_TYPOGRAPHY
  return {
    sectionLabelFontSize: raw?.sectionLabelFontSize ?? d.sectionLabelFontSize,
    itemTitleFontSize: raw?.itemTitleFontSize ?? d.itemTitleFontSize,
    itemDescriptionFontSize: raw?.itemDescriptionFontSize ?? d.itemDescriptionFontSize,
    iconCircleSize: raw?.iconCircleSize ?? d.iconCircleSize,
    iconGlyphSize: raw?.iconGlyphSize ?? d.iconGlyphSize,
  }
}

function normalizeJourneyTypography(raw?: Partial<AboutJourneyTypography>): AboutJourneyTypography {
  const d = DEFAULT_JOURNEY_TYPOGRAPHY
  return {
    sectionLabelFontSize: raw?.sectionLabelFontSize ?? d.sectionLabelFontSize,
    iconSize: raw?.iconSize ?? d.iconSize,
    statValueFontSize: raw?.statValueFontSize ?? d.statValueFontSize,
    statLabelFontSize: raw?.statLabelFontSize ?? d.statLabelFontSize,
    statDescriptionFontSize: raw?.statDescriptionFontSize ?? d.statDescriptionFontSize,
  }
}

function mapLegacyStats(raw: unknown): AboutJourneyStat[] {
  const defaults = createDefaultAboutContent().journeySection.items
  if (!Array.isArray(raw)) return defaults
  return raw.map((s, i) => {
    const item = s as Partial<AboutJourneyStat & HomeStat>
    return {
      id: item.id ?? String(i + 1),
      value: item.value ?? defaults[i]?.value ?? "",
      label: item.label ?? defaults[i]?.label ?? "",
      description: item.description ?? defaults[i]?.description ?? "",
      icon: item.icon ?? defaults[i]?.icon ?? "users",
    }
  })
}

function mapLegacyValues(raw: unknown): AboutValueItem[] {
  const defaults = createDefaultAboutContent().valuesSection.items
  if (!Array.isArray(raw) || raw.length === 0) return defaults
  return raw.map((v, i) => {
    const item = v as Partial<AboutValueItem>
    const preset = ["creativity", "strategy", "collaboration", "results"][i] ?? "creativity"
    return {
      id: item.id ?? String(i + 1),
      title: (item.title ?? defaults[i]?.title ?? "").toUpperCase(),
      description: item.description ?? defaults[i]?.description ?? "",
      icon: item.icon ?? preset,
    }
  })
}

export function normalizeAboutContent(data: Record<string, unknown>): NormalizedAboutContent {
  const defaults = createDefaultAboutContent()
  const page = (data.aboutPage as Record<string, unknown>) ?? {}
  type LegacyHero = Partial<AboutHero> & {
    title?: string
    taglineBefore?: string
    taglineHighlight?: string
  }
  type LegacyWho = Partial<AboutWhoWeAre> & { badge?: string; title?: string; highlightedTitle?: string }

  const heroRaw =
    (page.hero as LegacyHero) ??
    (data.hero as LegacyHero) ??
    {}
  const whoRaw =
    (page.whoWeAre as LegacyWho) ??
    (data.about as LegacyWho) ??
    {}
  const valuesRaw = (page.valuesSection as Partial<AboutValuesSection>) ?? {}
  const journeyRaw = (page.journeySection as Partial<AboutJourneySection>) ?? {}

  const legacyHeroTitle = (heroRaw.title as string) ?? (data.heroTitle as string) ?? ""
  const legacyHeroDesc =
    (heroRaw.description as string) ??
    (data.heroDescription as string) ??
    (data.hero as { description?: string })?.description ??
    ""

  return {
    hero: {
      titleLine1: heroRaw.titleLine1 ?? (legacyHeroTitle.includes(" ") ? legacyHeroTitle.split(" ")[0]?.toUpperCase() : "ABOUT") ?? defaults.hero.titleLine1,
      titleHighlight:
        heroRaw.titleHighlight ??
        (legacyHeroTitle.toLowerCase().includes("us") ? "US" : legacyHeroTitle.split(" ").slice(1).join(" ").toUpperCase() || "US"),
      taglineLine1:
        heroRaw.taglineLine1 ??
        heroRaw.taglineBefore ??
        defaults.hero.taglineLine1,
      taglineLine2:
        heroRaw.taglineLine2 ??
        heroRaw.taglineHighlight ??
        defaults.hero.taglineLine2,
      description: legacyHeroDesc || defaults.hero.description,
      image:
        heroRaw.image ??
        (data.heroBackgroundImage as string) ??
        (data.hero as { image?: string })?.image ??
        defaults.hero.image,
    },
    whoWeAre: {
      label: whoRaw.label ?? (whoRaw.badge as string)?.toUpperCase() ?? defaults.whoWeAre.label,
      titleLine1: whoRaw.titleLine1 ?? whoRaw.title ?? defaults.whoWeAre.titleLine1,
      titleLine2: whoRaw.titleLine2 ?? defaults.whoWeAre.titleLine2,
      titleHighlight: whoRaw.titleHighlight ?? whoRaw.highlightedTitle ?? defaults.whoWeAre.titleHighlight,
      description: whoRaw.description ?? defaults.whoWeAre.description,
      buttonText: whoRaw.buttonText ?? defaults.whoWeAre.buttonText,
      buttonUrl: whoRaw.buttonUrl ?? defaults.whoWeAre.buttonUrl,
      image: whoRaw.image ?? defaults.whoWeAre.image,
    },
    valuesSection: {
      label: valuesRaw.label ?? defaults.valuesSection.label,
      typography: normalizeValuesTypography(
        (valuesRaw.typography as Partial<AboutValuesTypography>) ?? undefined,
      ),
      items: valuesRaw.items?.length ? mapLegacyValues(valuesRaw.items) : mapLegacyValues(data.values ?? (data.about as { values?: unknown })?.values),
    },
    journeySection: {
      label: journeyRaw.label ?? defaults.journeySection.label,
      typography: normalizeJourneyTypography(
        (journeyRaw.typography as Partial<AboutJourneyTypography>) ?? undefined,
      ),
      items: journeyRaw.items?.length ? mapLegacyStats(journeyRaw.items) : mapLegacyStats(data.stats),
    },
  }
}
