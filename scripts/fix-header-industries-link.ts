import { MongoClient } from "mongodb"
import { normalizeHeaderContent } from "../lib/header-content"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required")
  process.exit(1)
}

async function fixHeaderIndustriesLink() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("sjmedialabs")
    const doc = await db.collection("content").findOne({ pageKey: "header" })
    if (!doc) {
      console.log("No header document found")
      return
    }

    const normalized = normalizeHeaderContent(doc as Record<string, unknown>)
    await db.collection("content").updateOne(
      { pageKey: "header" },
      {
        $set: {
          navItems: normalized.navItems,
          updatedAt: new Date(),
        },
      },
    )

    console.log("Header nav updated:")
    normalized.navItems.forEach((item) => console.log(`  ${item.label} → ${item.href}`))
  } finally {
    await client.close()
  }
}

fixHeaderIndustriesLink().catch((err) => {
  console.error(err)
  process.exit(1)
})
