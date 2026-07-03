import { getCollection } from "@/lib/mongodb"
import { DEFAULT_SITE_TYPOGRAPHY, normalizeSiteTypography, type SiteTypography } from "@/lib/site-typography"

export async function getSiteTypography(): Promise<SiteTypography> {
  try {
    const collection = await getCollection("content")
    const settings = await collection.findOne({ pageKey: "settings" })
    if (!settings) return DEFAULT_SITE_TYPOGRAPHY
    return normalizeSiteTypography(settings as Record<string, unknown>)
  } catch {
    return DEFAULT_SITE_TYPOGRAPHY
  }
}
