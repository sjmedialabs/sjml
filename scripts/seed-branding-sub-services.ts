import { MongoClient } from "mongodb"
import { DEFAULT_BRANDING_SUB_SERVICES } from "../lib/default-branding-sub-services"
import { createDefaultServiceDetailTemplate } from "../lib/service-detail-template"
import { createEmptySections, createDefaultSubServicePageLayout } from "../lib/service-sections"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required")
  process.exit(1)
}

async function seedBrandingSubServices() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("sjmedialabs")
    const collection = db.collection("sub-services")

    for (const sub of DEFAULT_BRANDING_SUB_SERVICES) {
      const existing = await collection.findOne({ parentSlug: sub.parentSlug, slug: sub.slug })
      const detailTemplate =
        sub.detailTemplate ?? createDefaultServiceDetailTemplate(sub.name, "BRANDING")

      if (existing) {
        await collection.updateOne(
          { _id: existing._id },
          {
            $set: {
              name: sub.name,
              displayOrder: sub.displayOrder,
              isActive: sub.isActive,
              shortDescription: sub.shortDescription,
              detailTemplate,
              updatedAt: new Date(),
            },
          },
        )
        console.log(`Updated: ${sub.name}`)
      } else {
        await collection.insertOne({
          ...sub,
          detailTemplate,
          bannerImage: "",
          fullDescription: "",
          sections: createEmptySections(),
          pageLayout: createDefaultSubServicePageLayout(),
          portfolioUrl: "",
          brochureUrl: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        console.log(`Inserted: ${sub.name}`)
      }
    }
  } finally {
    await client.close()
  }
}

seedBrandingSubServices().catch((err) => {
  console.error(err)
  process.exit(1)
})
