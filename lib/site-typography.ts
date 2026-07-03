/** Site-wide typography settings stored in the settings document. */

export interface SiteTypography {
  /** Base font size (px) for h1–h2 / .site-title across public pages */
  headingFontSize: number
  /** Base font size (px) for h3–h6 / .site-subtitle */
  subtitleFontSize: number
  /** Base font size (px) for body text and paragraphs */
  paragraphFontSize: number
}

export const DEFAULT_SITE_TYPOGRAPHY: SiteTypography = {
  headingFontSize: 32,
  subtitleFontSize: 20,
  paragraphFontSize: 16,
}

export function normalizeSiteTypography(data: Record<string, unknown> | null | undefined): SiteTypography {
  const raw = data ?? {}
  return {
    headingFontSize:
      typeof raw.headingFontSize === "number" && raw.headingFontSize > 0
        ? raw.headingFontSize
        : DEFAULT_SITE_TYPOGRAPHY.headingFontSize,
    subtitleFontSize:
      typeof raw.subtitleFontSize === "number" && raw.subtitleFontSize > 0
        ? raw.subtitleFontSize
        : DEFAULT_SITE_TYPOGRAPHY.subtitleFontSize,
    paragraphFontSize:
      typeof raw.paragraphFontSize === "number" && raw.paragraphFontSize > 0
        ? raw.paragraphFontSize
        : DEFAULT_SITE_TYPOGRAPHY.paragraphFontSize,
  }
}

export function siteTypographyStyleVars(typography: SiteTypography): Record<string, string> {
  return {
    "--site-heading-font-size": `${typography.headingFontSize}px`,
    "--site-subtitle-font-size": `${typography.subtitleFontSize}px`,
    "--site-paragraph-font-size": `${typography.paragraphFontSize}px`,
  }
}
