"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted!")
    console.log("Email:", email)
    console.log("Password length:", password.length)
    
    setLoading(true)
    setError("")

    try {
      console.log("Sending request to /api/auth/login...")
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("Response status:", res.status)
      const data = await res.json()
      console.log("Response data:", data)

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      console.log("Login successful, storing token...")
      localStorage.setItem("adminToken", data.token)
      console.log("Redirecting to dashboard...")
      router.push("/admin/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#E63946] rounded flex items-center justify-center">
              <span className="text-white font-bold">SJ</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-xl">SJ Media Labs</span>
              <span className="text-[#666] text-xs">Admin Portal</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[#999]">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-[#111] border border-[#333] rounded-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sjmedialabs.com"
                className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#666]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#666] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white py-6">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock size={18} />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333]">
            <p className="text-xs text-[#666] text-center mb-2">Default Credentials (For Testing)</p>
            <div className="bg-[#1a1a1a] rounded p-3 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#999]">Email:</span>
                <span className="text-white font-mono">admin@sjmedialabs.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#999]">Password:</span>
                <span className="text-white font-mono">SJMedia@2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
