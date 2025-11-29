import { getDatabase } from "@/lib/mongodb"
import { GridFSBucket, ObjectId } from "mongodb"
import { Readable } from "stream"

let gridFSBucket: GridFSBucket | null = null

/**
 * Get or create GridFS bucket instance
 */
export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (gridFSBucket) {
    return gridFSBucket
  }

  const db = await getDatabase()
  gridFSBucket = new GridFSBucket(db, {
    bucketName: "images", // Collection will be images.files and images.chunks
  })

  return gridFSBucket
}

/**
 * Upload a file to GridFS
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param contentType - MIME type of the file
 * @returns Object with fileId and url
 */
export async function uploadToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<{ fileId: string; url: string }> {
  const bucket = await getGridFSBucket()

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        originalName: filename,
        uploadedAt: new Date(),
      },
    })

    const readableStream = Readable.from(buffer)

    readableStream.pipe(uploadStream)

    uploadStream.on("finish", () => {
      const fileId = uploadStream.id.toString()
      const url = `/api/images/${fileId}`
      resolve({ fileId, url })
    })

    uploadStream.on("error", (error) => {
      reject(error)
    })
  })
}

/**
 * Download a file from GridFS
 * @param fileId - The GridFS file ID
 * @returns Object with stream and metadata
 */
export async function downloadFromGridFS(fileId: string): Promise<{
  stream: any
  contentType: string
  filename: string
} | null> {
  try {
    const bucket = await getGridFSBucket()
    const objectId = new ObjectId(fileId)

    // Get file metadata
    const files = await bucket.find({ _id: objectId }).toArray()

    if (files.length === 0) {
      return null
    }

    const file = files[0]
    const stream = bucket.openDownloadStream(objectId)

    return {
      stream,
      contentType: file.contentType || "application/octet-stream",
      filename: file.filename,
    }
  } catch (error) {
    console.error("Error downloading from GridFS:", error)
    return null
  }
}

/**
 * Delete a file from GridFS
 * @param fileId - The GridFS file ID
 * @returns Boolean indicating success
 */
export async function deleteFromGridFS(fileId: string): Promise<boolean> {
  try {
    const bucket = await getGridFSBucket()
    const objectId = new ObjectId(fileId)
    await bucket.delete(objectId)
    return true
  } catch (error) {
    console.error("Error deleting from GridFS:", error)
    return false
  }
}

/**
 * List all files in GridFS
 * @param limit - Maximum number of files to return
 * @returns Array of file metadata
 */
export async function listGridFSFiles(limit: number = 100): Promise<
  Array<{
    id: string
    filename: string
    contentType: string
    size: number
    uploadedAt: Date
    url: string
  }>
> {
  try {
    const bucket = await getGridFSBucket()
    const files = await bucket.find({}).limit(limit).toArray()

    return files.map((file) => ({
      id: file._id.toString(),
      filename: file.filename,
      contentType: file.contentType || "unknown",
      size: file.length,
      uploadedAt: file.uploadDate,
      url: `/api/images/${file._id.toString()}`,
    }))
  } catch (error) {
    console.error("Error listing GridFS files:", error)
    return []
  }
}
