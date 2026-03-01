"use server"

import { uploadToGridFS } from "@/lib/gridfs"

/**
 * Server Action for image upload. Uses serverActions.bodySizeLimit from next.config (e.g. 10mb).
 * Use this from admin ImageUpload instead of POST /api/upload to avoid 1MB Route Handler limit.
 */
export async function uploadImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File | null
    if (!file || !(file instanceof File)) {
      return { error: "No file provided" }
    }
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image (PNG, JPG, GIF, WebP)" }
    }
    if (file.size > 10 * 1024 * 1024) {
      return { error: "File must be less than 10MB" }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    if (buffer.length === 0) {
      return { error: "File is empty or too large. Set serverActions.bodySizeLimit in next.config (e.g. 10mb)." }
    }

    const { url } = await uploadToGridFS(buffer, file.name, file.type)
    return { url }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed"
    console.error("Upload action error:", err)
    return { error: message }
  }
}
