import { MongoClient } from "mongodb"
import { DEFAULT_SERVICES_LIST } from "../lib/default-services-list"
import { createEmptySections, createDefaultPageLayout } from "../lib/service-sections"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required")
  process.exit(1)
}

async function seedDefaultServices() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("sjmedialabs")
    const collection = db.collection("services")

    const existingSlugs = new Set(
      (await collection.find({}, { projection: { slug: 1 } }).toArray()).map((s) => s.slug as string),
    )

    const now = new Date().toISOString()
    const toInsert = DEFAULT_SERVICES_LIST.filter((s) => !existingSlugs.has(s.slug)).map((service) => ({
      ...service,
      image: "",
      heroImage: "",
      fullDescription: "",
      offerings: [],
      benefits: { title: "", description: "" },
      features: { title: "", points: [] },
      process: [],
      faqs: [],
      sections: createEmptySections(),
      pageLayout: createDefaultPageLayout(),
      portfolioUrl: "",
      brochureUrl: "",
      createdAt: now,
      updatedAt: now,
    }))

    if (toInsert.length === 0) {
      console.log("All 8 default services already exist — nothing to insert.")
      return
    }

    await collection.insertMany(toInsert)
    console.log(`Inserted ${toInsert.length} default services:`)
    toInsert.forEach((s) => console.log(`  - ${s.title} (${s.slug})`))
  } finally {
    await client.close()
  }
}

seedDefaultServices().catch((err) => {
  console.error(err)
  process.exit(1)
})
