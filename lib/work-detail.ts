/** Returns image URLs that are non-empty and not placeholders */
export function validWorkImages(urls: string[] | undefined | null): string[] {
  if (!urls?.length) return []
  return urls.filter(
    (u) =>
      typeof u === "string" &&
      u.trim() !== "" &&
      !u.includes("placeholder.svg") &&
      !u.endsWith("placeholder.svg"),
  )
}

export interface WorkSection4 {
  caption?: string
  rectangleImage?: string
  squareImage1?: string
  squareImage2?: string
}

export interface WorkDetailData {
  id: string
  slug: string
  title: string
  description?: string
  image: string
  industry?: string
  role?: string
  technology?: string
  year?: string
  tags?: string[]
  overview?: { title: string; description: string; points: string[] }
  logoVariations?: string[]
  mobileCarouselImages?: string[]
  mobileCarouselCaption?: string
  section4?: WorkSection4
  process?: Array<{ step: string; title: string; description: string }>
  gallery?: string[]
}
