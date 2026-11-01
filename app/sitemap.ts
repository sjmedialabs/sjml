import type { MetadataRoute } from "next"
import { clientPromise } from "@/lib/mongodb"
import { SITE_URL } from "@/lib/seo"

const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/work",
  "/contact",
  "/clients",
  "/industries",
  "/careers",
  "/privacy",
  "/terms",
  "/cookies",
  "/insights",
  "/case-studies",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }))

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const [services, subs, works, insights] = await Promise.all([
      db.collection("services").find({ isActive: { $ne: false } }, { projection: { slug: 1 } }).toArray(),
      db.collection("sub-services").find({ isActive: true }, { projection: { slug: 1, parentSlug: 1 } }).toArray(),
      db.collection("works").find({}, { projection: { slug: 1 } }).toArray(),
      db.collection("insights").find({ published: { $ne: false } }, { projection: { slug: 1 } }).toArray(),
    ])
    for (const service of services) {
      if (service.slug) entries.push({ url: `${SITE_URL}/services/${service.slug}`, lastModified: now })
    }
    for (const sub of subs) {
      if (sub.parentSlug && sub.slug) entries.push({ url: `${SITE_URL}/services/${sub.parentSlug}/${sub.slug}`, lastModified: now })
    }
    for (const work of works) {
      if (work.slug) entries.push({ url: `${SITE_URL}/work/${work.slug}`, lastModified: now })
    }
    for (const insight of insights) {
      if (insight.slug) entries.push({ url: `${SITE_URL}/insights/${insight.slug}`, lastModified: now })
    }
  } catch {
    /* Static pages still ship if the database is unavailable. */
  }

  return entries
}
