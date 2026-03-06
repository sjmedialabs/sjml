import { type NextRequest, NextResponse } from "next/server"
import { uploadToGridFS } from "@/lib/gridfs"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const ALLOWED_TYPES = ["application/pdf"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be less than 20MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    if (buffer.length === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    const { fileId, url } = await uploadToGridFS(buffer, file.name, file.type)
    return NextResponse.json({ success: true, url, fileId, filename: file.name })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
