import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for uploaded images (in production, use cloud storage like Vercel Blob)
const uploadedImages: Map<string, string> = new Map()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be less than 5MB" }, { status: 400 })
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Generate unique ID
    const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Store in memory
    uploadedImages.set(id, dataUrl)

    // Return the data URL directly (for simplicity in preview)
    // In production, you would upload to cloud storage and return a proper URL
    return NextResponse.json({
      url: dataUrl,
      id,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  // List all uploaded images
  const images = Array.from(uploadedImages.entries()).map(([id, url]) => ({
    id,
    url: url.substring(0, 50) + "...", // Truncate for listing
  }))

  return NextResponse.json({ images, count: images.length })
}
