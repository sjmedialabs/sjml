export const SERVICE_SECTION_COUNT = 4

export interface ServiceContentSection {
  title: string
  subtitle: string
  description: string
  enabled: boolean
}

export interface ServicePageLayout {
  heroEnabled: boolean
  imageEnabled: boolean
  offeringsEnabled: boolean
  offeringsTitle: string
  faqEnabled: boolean
  faqTitle: string
  faqSubtitle: string
}

/** Admin hints — maps to the four legacy content blocks on service detail pages. */
export const PARENT_SERVICE_SECTION_HINTS = [
  "Overview (formerly full description)",
  "Benefits",
  "Key features",
  "Process",
] as const

export const SUB_SERVICE_SECTION_HINTS = [
  "Section 1",
  "Section 2",
  "Section 3",
  "Section 4",
] as const

export function createDefaultPageLayout(): ServicePageLayout {
  return {
    heroEnabled: true,
    imageEnabled: true,
    offeringsEnabled: true,
    offeringsTitle: "",
    faqEnabled: true,
    faqTitle: "",
    faqSubtitle: "",
  }
}

export function normalizeServicePageLayout(data: Record<string, unknown>): ServicePageLayout {
  const layout = data.pageLayout as Partial<ServicePageLayout> | undefined
  return {
    heroEnabled: layout?.heroEnabled !== false,
    imageEnabled: layout?.imageEnabled !== false,
    offeringsEnabled: layout?.offeringsEnabled !== false,
    offeringsTitle: layout?.offeringsTitle ?? "",
    faqEnabled: layout?.faqEnabled !== false,
    faqTitle: layout?.faqTitle ?? "",
    faqSubtitle: layout?.faqSubtitle ?? "",
  }
}

export function createEmptySections(): ServiceContentSection[] {
  return Array.from({ length: SERVICE_SECTION_COUNT }, () => ({
    title: "",
    subtitle: "",
    description: "",
    enabled: true,
  }))
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function featuresToHtml(features?: { title?: string; points?: string[] }): string {
  if (!features?.points?.length) return ""
  return `<ul>${features.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`
}

function processToHtml(process?: Array<{ title?: string; description?: string }>): string {
  if (!process?.length) return ""
  return process
    .filter((step) => step.title || step.description)
    .map((step, index) => {
      const title = step.title ? `<h3>${escapeHtml(step.title)}</h3>` : `<h3>Step ${index + 1}</h3>`
      const body = step.description ? `<p>${escapeHtml(step.description)}</p>` : ""
      return `${title}${body}`
    })
    .join("")
}

function readSectionsFromArray(sections: unknown): ServiceContentSection[] | null {
  if (!Array.isArray(sections) || sections.length === 0) return null
  const normalized = createEmptySections()
  sections.slice(0, SERVICE_SECTION_COUNT).forEach((section, index) => {
    const item = section as Partial<ServiceContentSection>
    normalized[index] = {
      title: item.title ?? "",
      subtitle: item.subtitle ?? "",
      description: item.description ?? "",
      enabled: item.enabled !== false,
    }
  })
  return normalized
}

/** Normalize parent service content into four sections, migrating legacy fields when needed. */
export function normalizeServiceSections(data: Record<string, unknown>): ServiceContentSection[] {
  const fromArray = readSectionsFromArray(data.sections)
  if (fromArray) return fromArray

  const benefits = data.benefits as { title?: string; description?: string } | undefined
  const features = data.features as { title?: string; points?: string[] } | undefined
  const process = data.process as Array<{ title?: string; description?: string }> | undefined

  return [
    {
      title: "",
      subtitle: "",
      description: (data.fullDescription as string) ?? "",
      enabled: true,
    },
    {
      title: benefits?.title ?? "",
      subtitle: "",
      description: benefits?.description ?? "",
      enabled: true,
    },
    {
      title: features?.title ?? "",
      subtitle: "",
      description: featuresToHtml(features),
      enabled: true,
    },
    {
      title: "",
      subtitle: "",
      description: processToHtml(process),
      enabled: true,
    },
  ]
}

/** Normalize sub-service content into four sections, migrating legacy fullDescription when needed. */
export function normalizeSubServiceSections(data: Record<string, unknown>): ServiceContentSection[] {
  const fromArray = readSectionsFromArray(data.sections)
  if (fromArray) return fromArray

  const sections = createEmptySections()
  sections[0].description = (data.fullDescription as string) ?? ""
  return sections
}

export function sectionIsVisible(section: ServiceContentSection): boolean {
  if (section.enabled === false) return false
  return !!(section.title?.trim() || section.subtitle?.trim() || section.description?.trim())
}
