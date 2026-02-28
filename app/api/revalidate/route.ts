import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { verifyToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    if (!verifyToken(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { path, paths, tag } = body

    // Revalidate specific path
    if (path) {
      revalidatePath(path)
      return NextResponse.json({ 
        revalidated: true, 
        path,
        message: `Cache cleared for ${path}` 
      })
    }

    // Revalidate multiple paths
    if (paths && Array.isArray(paths)) {
      paths.forEach((p) => revalidatePath(p))
      return NextResponse.json({ 
        revalidated: true, 
        paths,
        message: `Cache cleared for ${paths.length} paths` 
      })
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({ 
        revalidated: true, 
        tag,
        message: `Cache cleared for tag: ${tag}` 
      })
    }

    return NextResponse.json(
      { error: "Please provide path, paths, or tag parameter" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    )
  }
}
