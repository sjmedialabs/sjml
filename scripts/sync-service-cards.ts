import { MongoClient } from "mongodb"
import { DEFAULT_SERVICES_LIST } from "../lib/default-services-list"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required")
  process.exit(1)
}

/** Sync overview card fields (title, description, icon, linkText) for default service slugs. */
async function syncServiceCards() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("sjmedialabs")
    const collection = db.collection("services")

    for (const service of DEFAULT_SERVICES_LIST) {
      const result = await collection.updateOne(
        { slug: service.slug },
        {
          $set: {
            title: service.title,
            description: service.description,
            icon: service.icon,
            linkText: service.linkText,
            displayOrder: service.displayOrder,
            isActive: true,
            updatedAt: new Date().toISOString(),
          },
        },
      )
      if (result.matchedCount) {
        console.log(`Updated card fields: ${service.title}`)
      }
    }
  } finally {
    await client.close()
  }
}

syncServiceCards().catch((err) => {
  console.error(err)
  process.exit(1)
})
