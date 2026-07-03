/** Insight detail page template structure. */

export interface InsightDetailSection {
  id: string
  heading: string
  paragraphs: string[]
}

export interface InsightDetailShareLink {
  id: string
  platform: string
  url: string
}

export interface InsightDetailTypography {
  categoryFontSize: number
  titleFontSize: number
  metaFontSize: number
  introFontSize: number
  sectionHeadingFontSize: number
  bodyFontSize: number
  shareLabelFontSize: number
}

export interface InsightDetailTemplate {
  introParagraph: string
  sections: InsightDetailSection[]
  closingStatement: string
  shareLabel: string
  shareLinks: InsightDetailShareLink[]
  typography: InsightDetailTypography
}

export const DEFAULT_INSIGHT_DETAIL_TYPOGRAPHY: InsightDetailTypography = {
  categoryFontSize: 10,
  titleFontSize: 34,
  metaFontSize: 12,
  introFontSize: 15,
  sectionHeadingFontSize: 15,
  bodyFontSize: 15,
  shareLabelFontSize: 12,
}

export function createDefaultInsightDetailTemplate(title = "Article Title"): InsightDetailTemplate {
  return {
    introParagraph: `An introduction to ${title} and why it matters for modern brands.`,
    sections: [
      {
        id: "1",
        heading: "1. Key takeaway",
        paragraphs: ["Add your first insight section content here."],
      },
    ],
    closingStatement: "",
    shareLabel: "Share this article:",
    shareLinks: [
      { id: "fb", platform: "facebook", url: "#" },
      { id: "li", platform: "linkedin", url: "#" },
      { id: "x", platform: "twitter", url: "#" },
      { id: "link", platform: "link", url: "#" },
    ],
    typography: { ...DEFAULT_INSIGHT_DETAIL_TYPOGRAPHY },
  }
}

export function normalizeInsightDetailTemplate(
  data: Record<string, unknown>,
  title = "",
  slug = "",
): InsightDetailTemplate {
  const defaults = createDefaultInsightDetailTemplate(title || "Article")
  const raw = (data.detailTemplate as Partial<InsightDetailTemplate>) ?? {}

  const legacyContent = data.content as string | undefined
  let sections = raw.sections?.length ? raw.sections : defaults.sections
  let introParagraph = raw.introParagraph ?? defaults.introParagraph
  let closingStatement = raw.closingStatement ?? defaults.closingStatement ?? ""

  if (!raw.sections?.length && legacyContent && !/<[a-zA-Z]/.test(legacyContent)) {
    const blocks = legacyContent.split(/\n\n+/).filter(Boolean)
    if (blocks.length > 1) {
      introParagraph = blocks[0]
      sections = blocks.slice(1).map((block, i) => ({
        id: String(i + 1),
        heading: `${i + 1}. Insight`,
        paragraphs: [block],
      }))
    } else if (blocks[0]) {
      introParagraph = blocks[0]
    }
  }

  const shareLinks = raw.shareLinks?.length
    ? raw.shareLinks
    : defaults.shareLinks.map((link) => ({
        ...link,
        url: link.platform === "link" ? `/insights/${slug}` : link.url,
      }))

  return {
    introParagraph,
    sections,
    closingStatement: raw.closingStatement ?? defaults.closingStatement ?? "",
    shareLabel: raw.shareLabel ?? defaults.shareLabel,
    shareLinks,
    typography: { ...defaults.typography, ...raw.typography },
  }
}
