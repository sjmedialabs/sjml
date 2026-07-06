/** Shared service / sub-service detail page template. */

export interface ServiceFeatureItem {
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
  introFontSize: number
  featureTitleFontSize: number
  featureDescriptionFontSize: number
  featureIconSize: number
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
  introParagraph1: string
  introParagraph2: string
  introImage: string
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
  categoryLabelFontSize: 11,
  titleFontSize: 36,
  introFontSize: 14,
  featureTitleFontSize: 13,
  featureDescriptionFontSize: 12,
  featureIconSize: 36,
  processLabelFontSize: 11,
  processTitleFontSize: 24,
  processStepTitleFontSize: 11,
  processStepDescriptionFontSize: 11,
  processIconSize: 40,
  bottomCtaHeadingFontSize: 18,
  bottomCtaTextFontSize: 13,
  bottomCtaButtonFontSize: 12,
  sidebarCtaHeadingFontSize: 14,
  sidebarCtaTextFontSize: 12,
  sidebarCtaButtonFontSize: 12,
}

const LOGO_DESIGN_FEATURES: ServiceFeatureItem[] = [
  {
    id: "1",
    icon: "lightbulb",
    title: "Unique & Original",
    description: "Custom logos designed exclusively for your brand identity.",
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
    description: "Every logo concept is aligned with your brand strategy and target audience.",
  },
]

const LOGO_DESIGN_PROCESS: ServiceProcessStep[] = [
  { id: "1", stepNumber: "01", title: "RESEARCH", description: "Understanding your brand, audience and market.", icon: "search" },
  { id: "2", stepNumber: "02", title: "CONCEPT", description: "Exploring creative directions and visual ideas.", icon: "lightbulb" },
  { id: "3", stepNumber: "03", title: "DESIGN", description: "Crafting refined logo concepts for review.", icon: "pen" },
  { id: "4", stepNumber: "04", title: "FEEDBACK", description: "Collaborating to refine the chosen direction.", icon: "message" },
  { id: "5", stepNumber: "05", title: "FINALIZE", description: "Perfecting details, colors and typography.", icon: "check" },
  { id: "6", stepNumber: "06", title: "DELIVERY", description: "Handing over all final brand assets.", icon: "delivery" },
]

export function createDefaultServiceDetailTemplate(title = "", categoryLabel = ""): ServiceDetailTemplate {
  const displayTitle = title || "Service Title"
  const category = categoryLabel || "SERVICE"

  return {
    categoryLabel: category.toUpperCase(),
    title: displayTitle,
    introParagraph1:
      "Your logo is the face of your brand. We design distinctive, memorable logos that communicate your brand's essence and make a strong first impression.",
    introParagraph2: "",
    introImage: "",
    features: LOGO_DESIGN_FEATURES.map((f) => ({ ...f })),
    processLabel: "OUR PROCESS",
    processTitleLine1: `OUR ${displayTitle.toUpperCase()}`,
    processTitleHighlight: "PROCESS",
    processSteps: LOGO_DESIGN_PROCESS.map((s) => ({ ...s })),
    bottomCta: {
      heading: "Ready to create a logo that sets your brand apart?",
      text: "Let's design a logo that leaves a lasting impression.",
      buttonText: "GET STARTED",
      buttonUrl: "/contact",
    },
    sidebarCta: {
      heading: "Have a project in mind?",
      text: "Let's create a logo that represents your brand perfectly.",
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
    introFontSize: raw?.introFontSize ?? d.introFontSize,
    featureTitleFontSize: raw?.featureTitleFontSize ?? d.featureTitleFontSize,
    featureDescriptionFontSize: raw?.featureDescriptionFontSize ?? d.featureDescriptionFontSize,
    featureIconSize: raw?.featureIconSize ?? d.featureIconSize,
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

function mapFeatures(raw: unknown): ServiceFeatureItem[] {
  const defaults = createDefaultServiceDetailTemplate().features
  if (!Array.isArray(raw) || raw.length === 0) return defaults
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

function mapProcessSteps(raw: unknown): ServiceProcessStep[] {
  const defaults = createDefaultServiceDetailTemplate().processSteps
  if (!Array.isArray(raw) || raw.length === 0) return defaults
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

/** Normalize detail template from MongoDB service or sub-service document. */
export function normalizeServiceDetailTemplate(
  data: Record<string, unknown>,
  fallbackTitle = "",
  fallbackCategory = "",
): ServiceDetailTemplate {
  const defaults = createDefaultServiceDetailTemplate(fallbackTitle, fallbackCategory)
  const raw = (data.detailTemplate as Partial<ServiceDetailTemplate>) ?? {}
  const sections = data.sections as Array<{ description?: string }> | undefined

  return {
    categoryLabel: raw.categoryLabel ?? fallbackCategory.toUpperCase() ?? defaults.categoryLabel,
    title: raw.title ?? fallbackTitle ?? defaults.title,
    introParagraph1:
      raw.introParagraph1 ??
      (data.shortDescription as string) ??
      sections?.[0]?.description?.split("\n\n")[0] ??
      (data.fullDescription as string)?.split("\n\n")[0] ??
      defaults.introParagraph1,
    introParagraph2:
      raw.introParagraph2 ??
      sections?.[0]?.description?.split("\n\n")[1] ??
      (data.fullDescription as string)?.split("\n\n")[1] ??
      defaults.introParagraph2,
    introImage:
      raw.introImage?.trim() ||
      (data.bannerImage as string)?.trim() ||
      (data.image as string)?.trim() ||
      defaults.introImage,
    features: raw.features?.length ? mapFeatures(raw.features) : defaults.features,
    processLabel: raw.processLabel ?? defaults.processLabel,
    processTitleLine1: raw.processTitleLine1 ?? defaults.processTitleLine1,
    processTitleHighlight: raw.processTitleHighlight ?? defaults.processTitleHighlight,
    processSteps: raw.processSteps?.length ? mapProcessSteps(raw.processSteps) : defaults.processSteps,
    bottomCta: normalizeCta(raw.bottomCta, defaults.bottomCta),
    sidebarCta: normalizeCta(raw.sidebarCta, defaults.sidebarCta),
    typography: normalizeTypography(raw.typography),
  }
}

export const SERVICE_FEATURE_ICON_PRESETS = ["lightbulb", "pen", "monitor", "target"] as const
export const SERVICE_PROCESS_ICON_PRESETS = ["search", "lightbulb", "pen", "message", "check", "delivery"] as const
