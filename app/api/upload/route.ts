import { type NextRequest, NextResponse } from "next/server"
import { uploadToGridFS, listGridFSFiles } from "@/lib/gridfs"

export const dynamic = "force-dynamic"
// Allow larger body for image uploads (Next.js may still apply global limit from next.config)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image (PNG, JPG, GIF, WebP)" }, { status: 400 })
    }

    // 10MB max
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be less than 10MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (buffer.length === 0) {
      return NextResponse.json(
        { error: "File is empty or too large. Check next.config serverActions.bodySizeLimit (e.g. 10mb)." },
        { status: 400 },
      )
    }

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
    const message = error instanceof Error ? error.message : "Upload failed"
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed", detail: message },
      { status: 500 },
    )
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
