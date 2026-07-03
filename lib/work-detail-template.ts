/** Work detail page template — Aurora Skincare mockup structure. */

export interface WorkDetailPillar {
  id: string
  icon: string
  title: string
  description: string
  bullets?: string[]
}

export interface WorkDetailMetric {
  id: string
  icon: string
  value: string
  label: string
}

export interface WorkDetailTestimonial {
  quote: string
  author: string
  role: string
  image: string
}

export interface WorkDetailProjectDetails {
  client: string
  industry: string
  services: string
  duration: string
  team: string
  website: string
}

export interface WorkDetailMeta {
  year: string
  industry: string
  location: string
}

export interface WorkDetailTypography {
  categoryFontSize: number
  titleFontSize: number
  subtitleFontSize: number
  introFontSize: number
  metaFontSize: number
  sectionLabelFontSize: number
  overviewTitleFontSize: number
  overviewTextFontSize: number
  pillarTitleFontSize: number
  pillarTextFontSize: number
  metricValueFontSize: number
  metricLabelFontSize: number
  testimonialFontSize: number
  detailsLabelFontSize: number
  bottomCtaHeadingFontSize: number
  bottomCtaButtonFontSize: number
}

export interface WorkDetailTemplate {
  categoryTags: string
  subtitle: string
  introParagraph: string
  heroImage: string
  meta: WorkDetailMeta
  projectLabel: string
  overviewTitle: string
  overviewText: string
  pillars: WorkDetailPillar[]
  galleryLabel: string
  galleryImages: string[]
  resultsLabel: string
  resultsTitle: string
  resultsText: string
  metrics: WorkDetailMetric[]
  testimonial: WorkDetailTestimonial
  projectDetails: WorkDetailProjectDetails
  projectDetailsLabel?: string
  sideImage: string
  bottomCta: { labelLine?: string; heading: string; buttonText: string; buttonUrl: string }
  typography: WorkDetailTypography
}

export const DEFAULT_WORK_DETAIL_TYPOGRAPHY: WorkDetailTypography = {
  categoryFontSize: 11,
  titleFontSize: 40,
  subtitleFontSize: 16,
  introFontSize: 14,
  metaFontSize: 12,
  sectionLabelFontSize: 11,
  overviewTitleFontSize: 26,
  overviewTextFontSize: 13,
  pillarTitleFontSize: 14,
  pillarTextFontSize: 12,
  metricValueFontSize: 30,
  metricLabelFontSize: 11,
  testimonialFontSize: 14,
  detailsLabelFontSize: 11,
  bottomCtaHeadingFontSize: 22,
  bottomCtaButtonFontSize: 12,
}

export function createDefaultWorkDetailTemplate(title = "Project Title"): WorkDetailTemplate {
  return {
    categoryTags: "BRANDING, PACKAGING",
    subtitle: "Building a premium brand from the ground up.",
    introParagraph:
      "We partnered with the client to create a distinctive brand identity and packaging system that reflects quality, trust and modern aesthetics.",
    heroImage: "",
    meta: { year: "2024", industry: "Skincare", location: "India" },
    projectLabel: "THE PROJECT",
    overviewTitle: "Project Overview",
    overviewText:
      "The client needed a cohesive brand identity that would stand out in a competitive market while communicating premium quality and natural ingredients.",
    pillars: [
      { id: "1", icon: "target", title: "Objective", description: "Create a memorable brand identity that resonates with the target audience." },
      { id: "2", icon: "users", title: "Solution", description: "Developed a complete visual system including logo, packaging and brand guidelines." },
      { id: "3", icon: "lightbulb", title: "Approach", description: "Research-driven design process focused on premium positioning and shelf appeal." },
      {
        id: "4",
        icon: "star",
        title: "Deliverables",
        description: "",
        bullets: ["Brand Identity", "Packaging Design", "Brand Guidelines", "Marketing Collateral", "Social Media Creatives"],
      },
    ],
    galleryLabel: "OUR WORK",
    galleryImages: [],
    resultsLabel: "THE RESULTS",
    resultsTitle: "Impact & Results",
    resultsText: "The new brand identity helped establish strong market presence and increased customer engagement across all touchpoints.",
    metrics: [
      { id: "1", icon: "chart", value: "120%", label: "Increase in Brand Awareness" },
      { id: "2", icon: "users", value: "85%", label: "Growth in Social Media Engagement" },
      { id: "3", icon: "bag", value: "65%", label: "Increase in Online Sales" },
      { id: "4", icon: "star", value: "4.8/5", label: "Average Customer Satisfaction" },
    ],
    testimonial: {
      quote: "SJML transformed our brand into something powerful and memorable. Their team truly understands our vision.",
      author: "Client Name",
      role: "Founder",
      image: "",
    },
    projectDetails: {
      client: title,
      industry: "Skincare",
      services: "Branding, Packaging, Digital",
      duration: "8 Weeks",
      team: "Brand Strategists, Designers, Copywriters",
      website: "",
    },
    projectDetailsLabel: "PROJECT DETAILS",
    sideImage: "",
    bottomCta: {
      labelLine: "Have a project in mind?",
      heading: "Let's create something great together.",
      buttonText: "LET'S TALK",
      buttonUrl: "/contact",
    },
    typography: { ...DEFAULT_WORK_DETAIL_TYPOGRAPHY },
  }
}

function normalizeTypography(raw?: Partial<WorkDetailTypography>): WorkDetailTypography {
  const d = DEFAULT_WORK_DETAIL_TYPOGRAPHY
  return { ...d, ...raw }
}

export function normalizeWorkDetailTemplate(data: Record<string, unknown>, title = ""): WorkDetailTemplate {
  const defaults = createDefaultWorkDetailTemplate(title || "Project")
  const raw = (data.detailTemplate as Partial<WorkDetailTemplate>) ?? {}
  const sections = data.sections as Record<string, unknown> | undefined

  const categoryTags =
    raw.categoryTags ??
    (Array.isArray(data.tags) ? (data.tags as string[]).join(", ").toUpperCase() : "") ??
    (data.category as string)?.toUpperCase() ??
    defaults.categoryTags

  return {
    categoryTags,
    subtitle:
      raw.subtitle ??
      ((data.description as string)
        ? `${(data.description as string).split(".")[0]}.`
        : defaults.subtitle),
    introParagraph: raw.introParagraph ?? (data.description as string) ?? defaults.introParagraph,
    heroImage: raw.heroImage ?? (data.image as string) ?? defaults.heroImage,
    meta: {
      year: raw.meta?.year ?? (data.year as string) ?? defaults.meta.year,
      industry: raw.meta?.industry ?? (data.industry as string) ?? defaults.meta.industry,
      location: raw.meta?.location ?? defaults.meta.location,
    },
    projectLabel: raw.projectLabel ?? defaults.projectLabel,
    overviewTitle: raw.overviewTitle ?? defaults.overviewTitle,
    overviewText:
      raw.overviewText ??
      ((sections?.snapshot as { summary?: string })?.summary) ??
      defaults.overviewText,
    pillars: raw.pillars?.length ? raw.pillars : defaults.pillars,
    galleryLabel: raw.galleryLabel ?? defaults.galleryLabel,
    galleryImages:
      raw.galleryImages?.length
        ? raw.galleryImages
        : (((sections?.gallery as { items?: Array<{ image: string }> })?.items)?.map((i) => i.image).filter(Boolean) ??
          defaults.galleryImages),
    resultsLabel: raw.resultsLabel ?? defaults.resultsLabel,
    resultsTitle: raw.resultsTitle ?? defaults.resultsTitle,
    resultsText: raw.resultsText ?? defaults.resultsText,
    metrics: raw.metrics?.length ? raw.metrics : defaults.metrics,
    testimonial: { ...defaults.testimonial, ...raw.testimonial },
    projectDetails: {
      client: raw.projectDetails?.client ?? (data.client as string) ?? title ?? defaults.projectDetails.client,
      industry: raw.projectDetails?.industry ?? (data.industry as string) ?? defaults.projectDetails.industry,
      services: raw.projectDetails?.services ?? defaults.projectDetails.services,
      duration: raw.projectDetails?.duration ?? defaults.projectDetails.duration,
      team: raw.projectDetails?.team ?? defaults.projectDetails.team,
      website: raw.projectDetails?.website ?? defaults.projectDetails.website,
    },
    sideImage: raw.sideImage ?? defaults.sideImage,
    projectDetailsLabel: raw.projectDetailsLabel ?? defaults.projectDetailsLabel,
    bottomCta: { ...defaults.bottomCta, ...raw.bottomCta },
    typography: normalizeTypography(raw.typography),
  }
}

export const WORK_PILLAR_ICON_PRESETS = ["target", "users", "lightbulb", "star"] as const
export const WORK_METRIC_ICON_PRESETS = ["chart", "users", "bag", "star"] as const
