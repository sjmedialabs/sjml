import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { verifyToken, type TokenPayload } from "@/lib/jwt"
import { findAdminById } from "@/lib/models/admin"

/**
 * Validates whether a token payload corresponds to an admin or superadmin.
 */
async function validateAdminRole(payload: TokenPayload): Promise<boolean> {
  if (payload.role === "admin" || payload.role === "superadmin") {
    return true
  }
  // Fallback for legacy tokens without an explicit role field
  if (!payload.role && payload.userId) {
    try {
      const user = await findAdminById(payload.userId)
      if (user && (user.role === "admin" || user.role === "superadmin")) {
        return true
      }
    } catch {
      return false
    }
  }
  return false
}

/**
 * Checks whether the current Server Component or Route Handler request
 * originates from an authenticated admin or superadmin.
 * Checks an optional query token first, then falls back to HTTP-only cookies.
 */
export async function isAdminOrSuperadmin(queryToken?: string | null): Promise<boolean> {
  // 1. Check query token if provided
  if (queryToken && typeof queryToken === "string") {
    const payload = verifyToken(queryToken)
    if (payload && (await validateAdminRole(payload))) {
      return true
    }
  }

  // 2. Check HTTP-only cookies
  try {
    const cookieStore = await cookies()
    const token =
      cookieStore.get("admin_token")?.value ||
      cookieStore.get("token")?.value

    if (token) {
      const payload = verifyToken(token)
      if (payload && (await validateAdminRole(payload))) {
        return true
      }
    }
  } catch {
    // cookies() may throw when called outside a request context
  }

  return false
}

/**
 * Validates an incoming API request (checking Bearer Authorization header or cookies)
 * and returns the authenticated admin TokenPayload if valid.
 */
export async function getAuthenticatedAdminFromRequest(
  request: NextRequest,
): Promise<TokenPayload | null> {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization")
  let token: string | null = null

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice("Bearer ".length).trim()
  }

  // 2. Fall back to cookie on the request
  if (!token) {
    token =
      request.cookies.get("admin_token")?.value ||
      request.cookies.get("token")?.value ||
      null
  }

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const isValidRole = await validateAdminRole(payload)
  return isValidRole ? payload : null
}
