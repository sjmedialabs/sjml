import { getCollection } from "@/lib/mongodb"
import { normalizeScripts, type SiteScript } from "@/lib/site-scripts"

export async function getSiteScripts(): Promise<SiteScript[]> {
  try {
    const collection = await getCollection("content")
    const doc = await collection.findOne({ pageKey: "scripts" })
    return normalizeScripts(doc)
  } catch (error) {
    console.error("Failed to fetch site scripts:", error)
    return []
  }
}
