import { execFile } from "child_process"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { promisify } from "util"
import { type NextRequest, NextResponse } from "next/server"
import { downloadFromGridFS, deleteFromGridFS } from "@/lib/gridfs"
import { verifyToken } from "@/lib/jwt"

const execFileAsync = promisify(execFile)
const IMAGE_CACHE_DIR = path.join(process.cwd(), ".image-cache")
const COMPRESS_OVER_BYTES = 280 * 1024

function isCompressibleImage(buffer: Buffer, filename: string, contentType: string) {
  const type = contentType.toLowerCase()
  const name = filename.toLowerCase()
  if (type.includes("svg") || type.includes("gif") || type.includes("pdf") || name.endsWith(".svg") || name.endsWith(".gif") || name.endsWith(".pdf")) {
    return false
  }
  if (type.startsWith("image/")) return true
  if (/\.(png|jpe?g|webp)$/.test(name)) return true
  if (buffer.length < 12) return false
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return true
  return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP"
}

async function compressedImage(id: string, buffer: Buffer, filename: string, contentType: string) {
  if (!isCompressibleImage(buffer, filename, contentType)) return null
  if (buffer.length < COMPRESS_OVER_BYTES) return null

  await mkdir(IMAGE_CACHE_DIR, { recursive: true })
  const cachedPath = path.join(IMAGE_CACHE_DIR, `${id}.webp`)
  try {
    const cached = await readFile(cachedPath)
    if (cached.length > 0) return { buffer: cached, contentType: "image/webp" }
  } catch {
    // Cache miss.
  }

  const sourcePath = path.join(IMAGE_CACHE_DIR, `${id}.src`)
  const outputPath = path.join(IMAGE_CACHE_DIR, `${id}.tmp.webp`)
  await writeFile(sourcePath, buffer)
  try {
    await execFileAsync("convert", [
      sourcePath,
      "-auto-orient",
      "-resize",
      "1600x1600>",
      "-strip",
      "-quality",
      "72",
      outputPath,
    ])
    const optimized = await readFile(outputPath)
    if (optimized.length === 0 || optimized.length >= buffer.length) return null
    await writeFile(cachedPath, optimized)
    return { buffer: optimized, contentType: "image/webp" }
  } catch (error) {
    console.error("Image compression failed:", error)
    return null
  }
}

export const dynamic = "force-dynamic"

/**
 * GET /api/images/[id]
 * Serve an image from GridFS
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    const file = await downloadFromGridFS(id)

    if (!file) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of file.stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    const isPdf = file.filename?.toLowerCase().endsWith(".pdf") || file.contentType?.toLowerCase().includes("pdf")
    const originalType = isPdf ? "application/pdf" : file.contentType || "image/jpeg"
    const optimized = isPdf ? null : await compressedImage(id, buffer, file.filename || "", originalType)
    const body = optimized?.buffer ?? buffer
    const contentType = optimized?.contentType ?? originalType

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${file.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 })
  }
}

/**
 * DELETE /api/images/[id]
 * Delete an image from GridFS (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    const success = await deleteFromGridFS(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
