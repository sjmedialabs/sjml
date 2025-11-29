import { type NextRequest, NextResponse } from "next/server"
import { uploadToGridFS, listGridFSFiles } from "@/lib/gridfs"

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

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be less than 10MB" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to GridFS
    const { fileId, url } = await uploadToGridFS(buffer, file.name, file.type)

    return NextResponse.json({
      success: true,
      fileId,
      url,
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
  try {
    // List all uploaded images from GridFS
    const images = await listGridFSFiles(100)

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    })
  } catch (error) {
    console.error("List images error:", error)
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 })
  }
}
