import { NextResponse } from "next/server"
import { clientPromise } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const clients = await db.collection("clients").find({ featured: true }).sort({ createdAt: -1 }).toArray()
    
    // Serialize MongoDB _id
    const serializedClients = clients.map(c => ({
      ...c,
      _id: c._id.toString()
    }))
    
    return NextResponse.json(serializedClients)
  } catch (error) {
    console.error("Get clients error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
