"use client"

import { useState } from "react"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = () => {
    if (isLoggingIn) return
    const email = (document.getElementById("email") as HTMLInputElement)?.value
    const password = (document.getElementById("password") as HTMLInputElement)?.value

    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

    setIsLoggingIn(true)
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("adminToken", data.token)
          const savedToken = localStorage.getItem("adminToken")

          fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
            .then((r) => r.json())
            .then((verifyData) => {
              if (verifyData.valid) {
                window.location.replace("/admin/dashboard")
              } else {
                setIsLoggingIn(false)
                alert("Token verification failed: " + JSON.stringify(verifyData))
              }
            })
        } else {
          setIsLoggingIn(false)
          alert(data.error || "Login failed")
        }
      })
      .catch((err) => {
        console.error("Error:", err)
        setIsLoggingIn(false)
        alert("Network error")
      })
  }

  return (
    <div className="admin-content-area min-h-screen flex items-center justify-center p-4 font-sans bg-white">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-primary rounded inline-flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold">SJ</span>
          </div>
          <h1 className="text-2xl font-bold admin-text-primary mb-2">SJ Media Labs</h1>
          <p className="admin-text-secondary">Admin Portal — Welcome Back</p>
        </div>

        <div className="admin-card border admin-border rounded-lg p-8 shadow-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block admin-text-primary mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 admin-bg-tertiary border admin-border-light rounded admin-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block admin-text-primary mb-2 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                className="w-full p-3 pr-12 admin-bg-tertiary border admin-border-light rounded admin-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex items-center px-3 admin-text-secondary"
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full p-3 bg-primary text-primary-foreground border-none rounded font-semibold cursor-pointer hover:bg-primary/90 transition-colors disabled:cursor-wait disabled:opacity-70"
          >
            {isLoggingIn ? (
              <span className="inline-flex items-center justify-center gap-2">
                <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
