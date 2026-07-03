import { validWorkImages } from "@/lib/work-detail"

export interface WorkInfoCard {
  icon: string
  label: string
  value: string
  displayOrder: number
  enabled: boolean
}

export interface WorkDeliverable {
  icon: string
  title: string
  description: string
  displayOrder: number
  enabled: boolean
}

export interface WorkGalleryItem {
  image: string
  title?: string
  altText?: string
  displayOrder: number
}

export interface WorkProcessStep {
  stepNumber: string
  title: string
  description: string
  displayOrder: number
}

export interface WorkMetric {
  icon: string
  value: string
  title: string
  description: string
  displayOrder: number
  enabled: boolean
}

export interface WorkContentSection {
  enabled: boolean
  sectionNumber: string
  title: string
  description: string
}

export interface WorkSnapshotSection extends WorkContentSection {
  summary: string
  featuredImage: string
  infoCards: WorkInfoCard[]
}

export interface WorkDeliveredSection extends WorkContentSection {
  deliverables: WorkDeliverable[]
}

export interface WorkGallerySection extends WorkContentSection {
  items: WorkGalleryItem[]
}

export interface WorkProcessSection extends WorkContentSection {
  steps: WorkProcessStep[]
}

export interface WorkResultsSection extends WorkContentSection {
  metrics: WorkMetric[]
}

export interface WorkDetailSections {
  snapshot: WorkSnapshotSection
  delivered: WorkDeliveredSection
  gallery: WorkGallerySection
  process: WorkProcessSection
  results: WorkResultsSection
}

function sortByOrder<T extends { displayOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder)
}

function defaultSnapshot(): WorkSnapshotSection {
  return {
    enabled: true,
    sectionNumber: "01",
    title: "Project Snapshot",
    description: "",
    summary: "",
    featuredImage: "",
    infoCards: [],
  }
}

function defaultDelivered(): WorkDeliveredSection {
  return {
    enabled: true,
    sectionNumber: "02",
    title: "What We Delivered",
    description: "",
    deliverables: [],
  }
}

function defaultGallery(): WorkGallerySection {
  return {
    enabled: true,
    sectionNumber: "03",
    title: "Project Gallery",
    description: "",
    items: [],
  }
}

function defaultProcess(): WorkProcessSection {
  return {
    enabled: true,
    sectionNumber: "04",
    title: "Design Process",
    description: "",
    steps: [],
  }
}

function defaultResults(): WorkResultsSection {
  return {
    enabled: true,
    sectionNumber: "05",
    title: "Results & Impact",
    description: "",
    metrics: [],
  }
}

export function createDefaultWorkSections(): WorkDetailSections {
  return {
    snapshot: defaultSnapshot(),
    delivered: defaultDelivered(),
    gallery: defaultGallery(),
    process: defaultProcess(),
    results: defaultResults(),
  }
}

function normalizeInfoCards(cards: unknown): WorkInfoCard[] {
  if (!Array.isArray(cards)) return []
  return sortByOrder(
    cards.map((c, i) => {
      const item = c as Partial<WorkInfoCard>
      return {
        icon: item.icon ?? "",
        label: item.label ?? "",
        value: item.value ?? "",
        displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : i,
        enabled: item.enabled !== false,
      }
    }),
  ).filter((c) => c.enabled && (c.label || c.value))
}

function normalizeDeliverables(items: unknown): WorkDeliverable[] {
  if (!Array.isArray(items)) return []
  return sortByOrder(
    items.map((d, i) => {
      const item = d as Partial<WorkDeliverable>
      return {
        icon: item.icon ?? "",
        title: item.title ?? "",
        description: item.description ?? "",
        displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : i,
        enabled: item.enabled !== false,
      }
    }),
  ).filter((d) => d.enabled && (d.title || d.description))
}

function normalizeGalleryItems(items: unknown): WorkGalleryItem[] {
  if (!Array.isArray(items)) return []
  const mapped: WorkGalleryItem[] = []
  items.forEach((g, i) => {
    const item = g as Partial<WorkGalleryItem>
    const image = item.image ?? ""
    if (!image.trim() || image.includes("placeholder.svg")) return
    mapped.push({
      image,
      title: item.title ?? "",
      altText: item.altText ?? item.title ?? "",
      displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : i,
    })
  })
  return sortByOrder(mapped)
}

function normalizeProcessSteps(steps: unknown): WorkProcessStep[] {
  if (!Array.isArray(steps)) return []
  return sortByOrder(
    steps
      .map((s, i) => {
        const item = s as Partial<WorkProcessStep> & { step?: string }
        const title = item.title ?? ""
        const description = item.description ?? ""
        if (!title && !description) return null
        return {
          stepNumber: item.stepNumber ?? item.step ?? String(i + 1).padStart(2, "0"),
          title,
          description,
          displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : i,
        }
      })
      .filter((s): s is WorkProcessStep => s !== null),
  )
}

function normalizeMetrics(metrics: unknown): WorkMetric[] {
  if (!Array.isArray(metrics)) return []
  return sortByOrder(
    metrics.map((m, i) => {
      const item = m as Partial<WorkMetric>
      return {
        icon: item.icon ?? "",
        value: item.value ?? "",
        title: item.title ?? "",
        description: item.description ?? "",
        displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : i,
        enabled: item.enabled !== false,
      }
    }),
  ).filter((m) => m.enabled && (m.value || m.title || m.description))
}

function mergeSection<T extends WorkContentSection>(defaults: T, raw: Partial<T> | undefined): T {
  if (!raw) return defaults
  return {
    ...defaults,
    ...raw,
    enabled: raw.enabled !== false,
    sectionNumber: raw.sectionNumber ?? defaults.sectionNumber,
    title: raw.title ?? defaults.title,
    description: raw.description ?? defaults.description,
  }
}

/** Build info cards from legacy industry/role/technology/year fields */
function legacyInfoCards(data: Record<string, unknown>): WorkInfoCard[] {
  const fields: Array<{ label: string; value: string }> = [
    { label: "Industry", value: (data.industry as string) ?? "" },
    { label: "Role", value: (data.role as string) ?? "" },
    { label: "Technology", value: (data.technology as string) ?? "" },
    { label: "Year", value: (data.year as string) ?? "" },
    { label: "Client", value: (data.client as string) ?? "" },
  ]
  return fields
    .filter((f) => f.value.trim())
    .map((f, i) => ({
      icon: "",
      label: f.label,
      value: f.value,
      displayOrder: i,
      enabled: true,
    }))
}

function legacyDeliverables(data: Record<string, unknown>): WorkDeliverable[] {
  const overview = data.overview as { points?: string[] } | undefined
  const points = overview?.points ?? []
  return points.map((title, i) => ({
    icon: "",
    title,
    description: "",
    displayOrder: i,
    enabled: true,
  }))
}

function legacyGalleryItems(data: Record<string, unknown>): WorkGalleryItem[] {
  const images: string[] = []
  const gallery = validWorkImages(data.gallery as string[] | undefined)
  const mobile = validWorkImages(data.mobileCarouselImages as string[] | undefined)
  const section4 = data.section4 as
    | { rectangleImage?: string; squareImage1?: string; squareImage2?: string }
    | undefined

  images.push(...gallery, ...mobile)
  if (section4?.rectangleImage) images.push(section4.rectangleImage)
  if (section4?.squareImage1) images.push(section4.squareImage1)
  if (section4?.squareImage2) images.push(section4.squareImage2)

  const unique = [...new Set(images.filter((u) => u && !u.includes("placeholder.svg")))]
  return unique.map((image, i) => ({
    image,
    title: "",
    altText: "",
    displayOrder: i,
  }))
}

function legacyProcessSteps(data: Record<string, unknown>): WorkProcessStep[] {
  const process = data.process as Array<{ step?: string; title?: string; description?: string }> | undefined
  if (!process?.length) return []
  return process.map((p, i) => ({
    stepNumber: p.step ?? String(i + 1).padStart(2, "0"),
    title: p.title ?? "",
    description: p.description ?? "",
    displayOrder: i,
  }))
}

/** Normalize work detail sections, migrating legacy fields when new structure is absent */
export function normalizeWorkSections(data: Record<string, unknown>): WorkDetailSections {
  const stored = data.sections as Partial<WorkDetailSections> | undefined
  const defaults = createDefaultWorkSections()

  if (stored?.snapshot?.title || stored?.snapshot?.summary || stored?.snapshot?.infoCards?.length) {
    const snapshot = mergeSection(defaults.snapshot, stored.snapshot)
    return {
      snapshot: {
        ...snapshot,
        summary: stored.snapshot?.summary ?? snapshot.summary,
        featuredImage: stored.snapshot?.featuredImage ?? snapshot.featuredImage,
        infoCards: normalizeInfoCards(stored.snapshot?.infoCards),
      },
      delivered: {
        ...mergeSection(defaults.delivered, stored.delivered),
        deliverables: normalizeDeliverables(stored.delivered?.deliverables),
      },
      gallery: {
        ...mergeSection(defaults.gallery, stored.gallery),
        items: normalizeGalleryItems(stored.gallery?.items),
      },
      process: {
        ...mergeSection(defaults.process, stored.process),
        steps: normalizeProcessSteps(stored.process?.steps),
      },
      results: {
        ...mergeSection(defaults.results, stored.results),
        metrics: normalizeMetrics(stored.results?.metrics),
      },
    }
  }

  const overview = data.overview as { title?: string; description?: string; points?: string[] } | undefined
  const infoCards = legacyInfoCards(data)
  const deliverables = legacyDeliverables(data)
  const galleryItems = legacyGalleryItems(data)
  const steps = legacyProcessSteps(data)

  return {
    snapshot: {
      ...defaults.snapshot,
      title: overview?.title ? "Project Snapshot" : defaults.snapshot.title,
      summary: overview?.description ?? (data.description as string) ?? "",
      featuredImage: (data.image as string) ?? "",
      infoCards: infoCards.length ? infoCards : defaults.snapshot.infoCards,
    },
    delivered: {
      ...defaults.delivered,
      title: overview?.title || defaults.delivered.title,
      description: overview?.description ? "" : defaults.delivered.description,
      deliverables: deliverables.length ? deliverables : defaults.delivered.deliverables,
    },
    gallery: {
      ...defaults.gallery,
      items: galleryItems.length ? galleryItems : defaults.gallery.items,
    },
    process: {
      ...defaults.process,
      steps: steps.length ? steps : defaults.process.steps,
    },
    results: defaults.results,
  }
}

export interface AdjacentWork {
  slug: string
  title: string
  image: string
}

export function getAdjacentWorks(
  works: Array<{ slug: string; title: string; image?: string }>,
  currentSlug: string,
): { previous: AdjacentWork | null; next: AdjacentWork | null } {
  const index = works.findIndex((w) => w.slug === currentSlug)
  if (index === -1) return { previous: null, next: null }

  const toAdjacent = (w: { slug: string; title: string; image?: string }): AdjacentWork => ({
    slug: w.slug,
    title: w.title,
    image: w.image ?? "",
  })

  return {
    previous: index < works.length - 1 ? toAdjacent(works[index + 1]) : null,
    next: index > 0 ? toAdjacent(works[index - 1]) : null,
  }
}
