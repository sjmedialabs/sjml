import { type NextRequest, NextResponse } from "next/server"
import { signToken } from "@/lib/jwt"
import { findAdminByEmail, validatePassword, ensureDefaultAdmin } from "@/lib/models/admin"

export async function POST(request: NextRequest) {
  try {
    // Ensure default admin exists
    await ensureDefaultAdmin()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await findAdminByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await validatePassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = signToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      token,
      user: { id: user._id!.toString(), email: user.email, name: user.name, role: user.role },
    })

    // Set HTTP-only cookie for added security
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
