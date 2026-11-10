export interface LandingPageSeo {
  title: string
  description: string
  keywords: string
  ogImage: string
}

export const defaultLandingPageSeo: LandingPageSeo = {
  title: "",
  description: "",
  keywords: "",
  ogImage: "",
}

export function normalizeLandingPageSeo(value: unknown): LandingPageSeo {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { ...defaultLandingPageSeo }
  }
  const data = value as Record<string, unknown>
  return {
    title: typeof data.title === "string" ? data.title.trim() : "",
    description: typeof data.description === "string" ? data.description.trim() : "",
    keywords: typeof data.keywords === "string" ? data.keywords.trim() : "",
    ogImage: typeof data.ogImage === "string" ? data.ogImage.trim() : "",
  }
}
