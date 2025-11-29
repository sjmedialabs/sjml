import { type NextRequest, NextResponse } from "next/server"
import { downloadFromGridFS, deleteFromGridFS } from "@/lib/gridfs"
import { verifyToken } from "@/lib/jwt"

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

    // Return image with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `inline; filename="${file.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
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
