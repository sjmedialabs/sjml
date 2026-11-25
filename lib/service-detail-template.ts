/** Shared service / sub-service detail page template. */

export interface ServiceFeatureItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface ServiceOfferingItem {
  id: string
  icon: string
  title: string
  description: string
  points: string[]
}

export interface ServiceAudienceItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface ServiceProcessStep {
  id: string
  stepNumber: string
  title: string
  description: string
  icon: string
}

export interface ServiceDetailCta {
  heading: string
  text: string
  buttonText: string
  buttonUrl: string
}

export interface ServiceDetailTypography {
  categoryLabelFontSize: number
  titleFontSize: number
  heroDescriptionFontSize: number
  introHeadingFontSize: number
  introFontSize: number
  sectionTitleFontSize: number
  featureTitleFontSize: number
  featureDescriptionFontSize: number
  featureIconSize: number
  offeringTitleFontSize: number
  offeringDescriptionFontSize: number
  processLabelFontSize: number
  processTitleFontSize: number
  processStepTitleFontSize: number
  processStepDescriptionFontSize: number
  processIconSize: number
  bottomCtaHeadingFontSize: number
  bottomCtaTextFontSize: number
  bottomCtaButtonFontSize: number
  sidebarCtaHeadingFontSize: number
  sidebarCtaTextFontSize: number
  sidebarCtaButtonFontSize: number
}

export interface ServiceDetailTemplate {
  categoryLabel: string
  title: string
  heroDescription: string
  heroButtonText: string
  heroButtonUrl: string
  introImage: string
  introHeading: string
  introParagraph1: string
  introParagraph2: string
  offeringsEnabled: boolean
  offeringsTitle: string
  offerings: ServiceOfferingItem[]
  valuesEnabled: boolean
  valuesTitle: string
  values: ServiceFeatureItem[]
  audiencesEnabled: boolean
  audiencesTitle: string
  audiences: ServiceAudienceItem[]
  highlightsEnabled: boolean
  highlightsTitle: string
  features: ServiceFeatureItem[]
  processLabel: string
  processTitleLine1: string
  processTitleHighlight: string
  processSteps: ServiceProcessStep[]
  bottomCta: ServiceDetailCta
  sidebarCta: ServiceDetailCta
  typography: ServiceDetailTypography
}

export const DEFAULT_SERVICE_DETAIL_TYPOGRAPHY: ServiceDetailTypography = {
  categoryLabelFontSize: 12,
  titleFontSize: 48,
  heroDescriptionFontSize: 15,
  introHeadingFontSize: 28,
  introFontSize: 15,
  sectionTitleFontSize: 28,
  featureTitleFontSize: 14,
  featureDescriptionFontSize: 13,
  featureIconSize: 36,
  offeringTitleFontSize: 18,
  offeringDescriptionFontSize: 14,
  processLabelFontSize: 11,
  processTitleFontSize: 28,
  processStepTitleFontSize: 12,
  processStepDescriptionFontSize: 12,
  processIconSize: 40,
  bottomCtaHeadingFontSize: 20,
  bottomCtaTextFontSize: 14,
  bottomCtaButtonFontSize: 12,
  sidebarCtaHeadingFontSize: 14,
  sidebarCtaTextFontSize: 13,
  sidebarCtaButtonFontSize: 12,
}

const DEFAULT_HIGHLIGHTS: ServiceFeatureItem[] = [
  {
    id: "1",
    icon: "lightbulb",
    title: "Unique & Original",
    description: "Custom designs crafted exclusively for your brand identity.",
  },
  {
    id: "2",
    icon: "pen",
    title: "Timeless Design",
    description: "Clean, simple designs that remain relevant and impactful for years to come.",
  },
  {
    id: "3",
    icon: "monitor",
    title: "Versatile",
    description: "Delivered in scalable, high-resolution formats for print and digital use.",
  },
  {
    id: "4",
    icon: "target",
    title: "Strategic Approach",
    description: "Every concept is aligned with your brand strategy and target audience.",
  },
]

const DEFAULT_VALUES: ServiceFeatureItem[] = [
  {
    id: "1",
    icon: "target",
    title: "Builds Recognition",
    description: "Make your brand instantly identifiable across every touchpoint.",
  },
  {
    id: "2",
    icon: "check",
    title: "Creates Trust",
    description: "A consistent identity builds credibility with customers and partners.",
  },
  {
    id: "3",
    icon: "lightbulb",
    title: "Drives Preference",
    description: "Stand out from competitors and become the preferred choice.",
  },
  {
    id: "4",
    icon: "monitor",
    title: "Supports Growth",
    description: "A strong brand foundation scales with your business over time.",
  },
]

const DEFAULT_AUDIENCES: ServiceAudienceItem[] = [
  { id: "1", icon: "rocket", title: "Startups", description: "Launching new products and brands" },
  { id: "2", icon: "building", title: "SMEs", description: "Growing businesses ready to scale" },
  { id: "3", icon: "briefcase", title: "Established Companies", description: "Refreshing identity and presence" },
  { id: "4", icon: "users", title: "Corporate Organizations", description: "Multi-brand and enterprise needs" },
]

const DEFAULT_OFFERINGS: ServiceOfferingItem[] = [
  {
    id: "1",
    icon: "target",
    title: "Brand Strategy Development",
    description: "We define your brand positioning, unique value proposition, mission, vision, and core messaging.",
    points: ["Brand positioning", "Value proposition", "Mission & vision", "Core messaging"],
  },
  {
    id: "2",
    icon: "pen",
    title: "Brand Identity Design",
    description: "Our creative team builds a complete visual identity that looks professional and consistent everywhere.",
    points: ["Logo design", "Typography system", "Color palette", "Brand guidelines"],
  },
  {
    id: "3",
    icon: "message",
    title: "Brand Messaging & Voice",
    description: "We create powerful brand communication that connects with your audience and improves recall.",
    points: ["Taglines", "Brand story", "Tone of voice", "Messaging guidelines"],
  },
  {
    id: "4",
    icon: "refresh",
    title: "Rebranding Services",
    description: "Modernize your business identity while keeping existing brand value and customer trust intact.",
    points: ["Growing companies", "Direction changes", "Outdated designs", "Mergers & expansions"],
  },
]

const DEFAULT_PROCESS: ServiceProcessStep[] = [
  { id: "1", stepNumber: "01", title: "RESEARCH", description: "Understanding your brand, audience and market.", icon: "search" },
  { id: "2", stepNumber: "02", title: "CONCEPT", description: "Exploring creative directions and visual ideas.", icon: "lightbulb" },
  { id: "3", stepNumber: "03", title: "DESIGN", description: "Crafting refined concepts for review.", icon: "pen" },
  { id: "4", stepNumber: "04", title: "FEEDBACK", description: "Collaborating to refine the chosen direction.", icon: "message" },
  { id: "5", stepNumber: "05", title: "FINALIZE", description: "Perfecting details, colors and typography.", icon: "check" },
  { id: "6", stepNumber: "06", title: "DELIVERY", description: "Handing over all final brand assets.", icon: "delivery" },
]

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
}

export function createDefaultServiceDetailTemplate(title = "", categoryLabel = ""): ServiceDetailTemplate {
  const displayTitle = title || "Service Title"
  const category = categoryLabel || "SERVICE"

  return {
    categoryLabel: category.toUpperCase(),
    title: displayTitle,
    heroDescription: `Explore our ${displayTitle.toLowerCase()} services designed to help your brand stand out and grow.`,
    heroButtonText: "LET'S TALK",
    heroButtonUrl: "/contact",
    introImage: "",
    introHeading: `Build a powerful ${displayTitle.toLowerCase()} that stands out & drives growth`,
    introParagraph1:
      "Your brand is more than just a logo — it is the complete experience people have with your business. We help companies create strong, memorable, and impactful identities.",
    introParagraph2:
      "We combine strategy, creative design, and market insights to develop work that reflects your vision and connects emotionally with your customers.",
    offeringsEnabled: true,
    offeringsTitle: `Our ${displayTitle} Services`,
    offerings: DEFAULT_OFFERINGS.map((item) => ({ ...item, points: [...item.points] })),
    valuesEnabled: true,
    valuesTitle: `Why Strong ${displayTitle} Matters`,
    values: DEFAULT_VALUES.map((item) => ({ ...item })),
    audiencesEnabled: true,
    audiencesTitle: "Who We Work With",
    audiences: DEFAULT_AUDIENCES.map((item) => ({ ...item })),
    highlightsEnabled: true,
    highlightsTitle: "",
    features: DEFAULT_HIGHLIGHTS.map((item) => ({ ...item })),
    processLabel: "OUR PROCESS",
    processTitleLine1: `OUR ${displayTitle.toUpperCase()}`,
    processTitleHighlight: "PROCESS",
    processSteps: DEFAULT_PROCESS.map((item) => ({ ...item })),
    bottomCta: {
      heading: `Ready to elevate your ${displayTitle.toLowerCase()}?`,
      text: "Let's build something that leaves a lasting impression.",
      buttonText: "GET STARTED",
      buttonUrl: "/contact",
    },
    sidebarCta: {
      heading: "Have a project in mind?",
      text: "Let's create something that represents your brand perfectly.",
      buttonText: "LET'S TALK",
      buttonUrl: "/contact",
    },
    typography: { ...DEFAULT_SERVICE_DETAIL_TYPOGRAPHY },
  }
}

function normalizeTypography(raw?: Partial<ServiceDetailTypography>): ServiceDetailTypography {
  const d = DEFAULT_SERVICE_DETAIL_TYPOGRAPHY
  return {
    categoryLabelFontSize: raw?.categoryLabelFontSize ?? d.categoryLabelFontSize,
    titleFontSize: raw?.titleFontSize ?? d.titleFontSize,
    heroDescriptionFontSize: raw?.heroDescriptionFontSize ?? d.heroDescriptionFontSize,
    introHeadingFontSize: raw?.introHeadingFontSize ?? d.introHeadingFontSize,
    introFontSize: raw?.introFontSize ?? d.introFontSize,
    sectionTitleFontSize: raw?.sectionTitleFontSize ?? d.sectionTitleFontSize,
    featureTitleFontSize: raw?.featureTitleFontSize ?? d.featureTitleFontSize,
    featureDescriptionFontSize: raw?.featureDescriptionFontSize ?? d.featureDescriptionFontSize,
    featureIconSize: raw?.featureIconSize ?? d.featureIconSize,
    offeringTitleFontSize: raw?.offeringTitleFontSize ?? d.offeringTitleFontSize,
    offeringDescriptionFontSize: raw?.offeringDescriptionFontSize ?? d.offeringDescriptionFontSize,
    processLabelFontSize: raw?.processLabelFontSize ?? d.processLabelFontSize,
    processTitleFontSize: raw?.processTitleFontSize ?? d.processTitleFontSize,
    processStepTitleFontSize: raw?.processStepTitleFontSize ?? d.processStepTitleFontSize,
    processStepDescriptionFontSize: raw?.processStepDescriptionFontSize ?? d.processStepDescriptionFontSize,
    processIconSize: raw?.processIconSize ?? d.processIconSize,
    bottomCtaHeadingFontSize: raw?.bottomCtaHeadingFontSize ?? d.bottomCtaHeadingFontSize,
    bottomCtaTextFontSize: raw?.bottomCtaTextFontSize ?? d.bottomCtaTextFontSize,
    bottomCtaButtonFontSize: raw?.bottomCtaButtonFontSize ?? d.bottomCtaButtonFontSize,
    sidebarCtaHeadingFontSize: raw?.sidebarCtaHeadingFontSize ?? d.sidebarCtaHeadingFontSize,
    sidebarCtaTextFontSize: raw?.sidebarCtaTextFontSize ?? d.sidebarCtaTextFontSize,
    sidebarCtaButtonFontSize: raw?.sidebarCtaButtonFontSize ?? d.sidebarCtaButtonFontSize,
  }
}

function normalizeCta(raw: Partial<ServiceDetailCta> | undefined, defaults: ServiceDetailCta): ServiceDetailCta {
  return {
    heading: raw?.heading ?? defaults.heading,
    text: raw?.text ?? defaults.text,
    buttonText: raw?.buttonText ?? defaults.buttonText,
    buttonUrl: raw?.buttonUrl ?? defaults.buttonUrl,
  }
}

function mapFeatures(raw: unknown, defaults: ServiceFeatureItem[]): ServiceFeatureItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaults.map((item) => ({ ...item }))
  return raw.map((item, i) => {
    const f = item as Partial<ServiceFeatureItem>
    return {
      id: f.id ?? String(i + 1),
      icon: f.icon ?? defaults[i]?.icon ?? "lightbulb",
      title: f.title ?? defaults[i]?.title ?? "",
      description: f.description ?? defaults[i]?.description ?? "",
    }
  })
}

function mapOfferings(raw: unknown, defaults: ServiceOfferingItem[]): ServiceOfferingItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaults.map((item) => ({ ...item, points: [...item.points] }))
  return raw.map((item, i) => {
    const o = item as Partial<ServiceOfferingItem>
    const points = Array.isArray(o.points) ? o.points.map(String).filter(Boolean) : defaults[i]?.points ?? []
    return {
      id: o.id ?? String(i + 1),
      icon: o.icon ?? defaults[i]?.icon ?? "target",
      title: o.title ?? defaults[i]?.title ?? "",
      description: o.description ?? defaults[i]?.description ?? "",
      points,
    }
  })
}

function mapAudiences(raw: unknown, defaults: ServiceAudienceItem[]): ServiceAudienceItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaults.map((item) => ({ ...item }))
  return raw.map((item, i) => {
    const a = item as Partial<ServiceAudienceItem>
    return {
      id: a.id ?? String(i + 1),
      icon: a.icon ?? defaults[i]?.icon ?? "users",
      title: a.title ?? defaults[i]?.title ?? "",
      description: a.description ?? defaults[i]?.description ?? "",
    }
  })
}

function mapProcessSteps(raw: unknown): ServiceProcessStep[] {
  const defaults = DEFAULT_PROCESS
  if (!Array.isArray(raw) || raw.length === 0) return defaults.map((item) => ({ ...item }))
  return raw.map((item, i) => {
    const s = item as Partial<ServiceProcessStep>
    return {
      id: s.id ?? String(i + 1),
      stepNumber: s.stepNumber ?? String(i + 1).padStart(2, "0"),
      title: s.title ?? defaults[i]?.title ?? "",
      description: s.description ?? defaults[i]?.description ?? "",
      icon: s.icon ?? defaults[i]?.icon ?? "search",
    }
  })
}

function deriveIntroFromLegacy(html: string, defaults: ServiceDetailTemplate) {
  const plain = stripHtml(html)
  if (!plain) {
    return {
      introHeading: defaults.introHeading,
      introParagraph1: defaults.introParagraph1,
      introParagraph2: defaults.introParagraph2,
      heroDescription: defaults.heroDescription,
    }
  }

  const lines = plain
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  const heading = lines[0] || defaults.introHeading
  const bodyLines = lines.slice(1)
  const stopIndex = bodyLines.findIndex((line) =>
    /^(our .+ services|why strong|who we work with|let'?s build)/i.test(line),
  )
  const introLines = stopIndex >= 0 ? bodyLines.slice(0, stopIndex) : bodyLines
  const paragraph1 = introLines[0] || defaults.introParagraph1
  const paragraph2 = introLines.slice(1).join(" ") || defaults.introParagraph2

  return {
    introHeading: heading,
    introParagraph1: paragraph1,
    introParagraph2: paragraph2,
    heroDescription: paragraph1.slice(0, 160),
  }
}

/** Normalize detail template from MongoDB service or sub-service document. */
export function normalizeServiceDetailTemplate(
  data: Record<string, unknown>,
  fallbackTitle = "",
  fallbackCategory = "",
): ServiceDetailTemplate {
  const defaults = createDefaultServiceDetailTemplate(fallbackTitle, fallbackCategory)
  const raw = (data.detailTemplate as Partial<ServiceDetailTemplate> & Record<string, unknown>) ?? {}
  const sections = data.sections as Array<{ description?: string }> | undefined

  const legacyIntro =
    raw.introParagraph1 ??
    (data.shortDescription as string) ??
    sections?.[0]?.description ??
    (data.fullDescription as string) ??
    ""

  const derived = deriveIntroFromLegacy(String(legacyIntro || ""), defaults)
  const hasStructuredIntro = Boolean(raw.introHeading || (raw.introParagraph1 && !/<[a-zA-Z][^>]*>/.test(String(raw.introParagraph1))))

  return {
    categoryLabel: String(raw.categoryLabel ?? fallbackCategory.toUpperCase() ?? defaults.categoryLabel),
    title: String(raw.title ?? fallbackTitle ?? defaults.title),
    heroDescription: String(raw.heroDescription ?? derived.heroDescription),
    heroButtonText: String(raw.heroButtonText ?? defaults.heroButtonText),
    heroButtonUrl: String(raw.heroButtonUrl ?? defaults.heroButtonUrl),
    introImage:
      String(raw.introImage ?? "").trim() ||
      String(data.bannerImage ?? "").trim() ||
      String(data.image ?? "").trim() ||
      defaults.introImage,
    introHeading: String(raw.introHeading ?? (hasStructuredIntro ? defaults.introHeading : derived.introHeading)),
    introParagraph1: hasStructuredIntro
      ? String(raw.introParagraph1 ?? defaults.introParagraph1)
      : derived.introParagraph1,
    introParagraph2: hasStructuredIntro
      ? String(raw.introParagraph2 ?? defaults.introParagraph2)
      : derived.introParagraph2,
    offeringsEnabled:
      raw.offeringsEnabled ?? (Array.isArray(raw.offerings) && raw.offerings.length > 0) ?? false,
    offeringsTitle: String(raw.offeringsTitle ?? defaults.offeringsTitle),
    offerings: mapOfferings(raw.offerings, defaults.offerings),
    valuesEnabled: raw.valuesEnabled ?? (Array.isArray(raw.values) && raw.values.length > 0) ?? false,
    valuesTitle: String(raw.valuesTitle ?? defaults.valuesTitle),
    values: mapFeatures(raw.values, defaults.values),
    audiencesEnabled:
      raw.audiencesEnabled ?? (Array.isArray(raw.audiences) && raw.audiences.length > 0) ?? false,
    audiencesTitle: String(raw.audiencesTitle ?? defaults.audiencesTitle),
    audiences: mapAudiences(raw.audiences, defaults.audiences),
    highlightsEnabled: raw.highlightsEnabled ?? defaults.highlightsEnabled,
    highlightsTitle: String(raw.highlightsTitle ?? defaults.highlightsTitle),
    features: mapFeatures(raw.features, defaults.features),
    processLabel: String(raw.processLabel ?? defaults.processLabel),
    processTitleLine1: String(raw.processTitleLine1 ?? defaults.processTitleLine1),
    processTitleHighlight: String(raw.processTitleHighlight ?? defaults.processTitleHighlight),
    processSteps: mapProcessSteps(raw.processSteps),
    bottomCta: normalizeCta(raw.bottomCta, defaults.bottomCta),
    sidebarCta: normalizeCta(raw.sidebarCta, defaults.sidebarCta),
    typography: normalizeTypography(raw.typography),
  }
}

export const SERVICE_FEATURE_ICON_PRESETS = [
  "lightbulb",
  "pen",
  "monitor",
  "target",
  "check",
  "message",
  "search",
  "delivery",
  "rocket",
  "building",
  "briefcase",
  "users",
  "refresh",
] as const

export const SERVICE_PROCESS_ICON_PRESETS = [
  "search",
  "lightbulb",
  "pen",
  "message",
  "check",
  "delivery",
  "target",
  "rocket",
] as const

export const SERVICE_OFFERING_ICON_PRESETS = SERVICE_FEATURE_ICON_PRESETS
export const SERVICE_AUDIENCE_ICON_PRESETS = ["rocket", "building", "briefcase", "users", "target", "lightbulb"] as const
