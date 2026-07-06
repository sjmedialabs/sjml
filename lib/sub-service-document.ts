import type { ServiceDetailTemplate } from "@/lib/service-detail-template"

export interface SubServiceDocument {
  parentSlug: string
  slug: string
  name: string
  bannerImage: string
  shortDescription: string
  fullDescription: string
  metaTitle: string
  metaDescription: string
  detailTemplate: ServiceDetailTemplate
  sections: unknown[]
  pageLayout: Record<string, unknown>
  portfolioUrl: string
  brochureUrl: string
  displayOrder?: number
  isActive: boolean
}

/** Keep bannerImage and detailTemplate.introImage in sync for save/load. */
export function syncSubServiceImages<T extends Record<string, unknown>>(data: T): T {
  const banner = String(data.bannerImage ?? "").trim()
  const rawTemplate = (data.detailTemplate as Partial<ServiceDetailTemplate>) ?? {}
  const intro = String(rawTemplate.introImage ?? "").trim()
  const resolvedImage = intro || banner

  return {
    ...data,
    bannerImage: resolvedImage,
    detailTemplate: {
      ...rawTemplate,
      introImage: resolvedImage,
    },
  } as T
}

export function normalizeSubServiceMeta(data: Record<string, unknown>, fallbackName = ""): {
  metaTitle: string
  metaDescription: string
} {
  const name = String(data.name ?? fallbackName).trim()
  const shortDescription = String(data.shortDescription ?? "").trim()
  return {
    metaTitle: String(data.metaTitle ?? "").trim() || name,
    metaDescription: String(data.metaDescription ?? "").trim() || shortDescription,
  }
}
