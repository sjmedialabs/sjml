import { getCollection } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"

/**
 * Single source of truth for clients page data.
 * Used by both the admin API and the website so they always show the same data.
 */
export async function getClientsPageData() {
  const collection = await getCollection<any>("clients")
  const clientsData = await collection.find({}).sort({ createdAt: -1 }).toArray()

  const clients = clientsData.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name || "",
    logo: doc.logo || "",
    industry: doc.industry || "",
    website: doc.website || "",
    featured: doc.featured ?? false,
  }))

  const pageContent = await getPageContent("clients")
  const hero = pageContent?.hero || {}

  return {
    heroTitle: hero.title ?? "Our Clients",
    heroSubtitle: hero.description ?? hero.subtitle ?? "Trusted by industry leaders worldwide to deliver exceptional results.",
    heroImage: hero.image ?? "",
    clients,
    stats: pageContent?.stats ?? [],
    cta: pageContent?.cta ?? { title: "", description: "", buttonText: "", buttonUrl: "" },
    content: pageContent,
  }
}
