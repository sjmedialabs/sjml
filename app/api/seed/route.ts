import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import {
  defaultHomeContent,
  defaultAboutContent,
  defaultServicesContent,
  defaultWorkContent,
  defaultCaseStudiesContent,
  defaultCareersContent,
  defaultContactContent,
} from "@/lib/defaults"

export async function POST() {
  try {
    const db = await getDatabase()

    // Seed Admin User
    const adminsCollection = db.collection("admins")
    const existingAdmin = await adminsCollection.findOne({ email: "admin@sjmedialabs.com" })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("SJMedia@2025", 12)
      await adminsCollection.insertOne({
        email: "admin@sjmedialabs.com",
        password: hashedPassword,
        name: "Admin",
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Seed Content
    const contentCollection = db.collection("content")

    const pages = [
      { key: "home", data: defaultHomeContent },
      { key: "about", data: defaultAboutContent },
      { key: "services", data: defaultServicesContent },
      { key: "work", data: defaultWorkContent },
      { key: "case-studies", data: defaultCaseStudiesContent },
      { key: "careers", data: defaultCareersContent },
      { key: "contact", data: defaultContactContent },
    ]

    for (const page of pages) {
      const existing = await contentCollection.findOne({ pageKey: page.key })
      if (!existing) {
        await contentCollection.insertOne({
          ...page.data,
          updatedAt: new Date(),
        })
      }
    }

    // Create indexes
    await adminsCollection.createIndex({ email: 1 }, { unique: true })
    await contentCollection.createIndex({ pageKey: 1 }, { unique: true })
    await db.collection("leads").createIndex({ createdAt: -1 })
    await db.collection("leads").createIndex({ source: 1 })
    await db.collection("leads").createIndex({ status: 1 })

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      admin: "admin@sjmedialabs.com / SJMedia@2025",
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to seed the database",
    warning: "This will create default content if it doesn't exist",
  })
}
