"use client"

export default function AdminLoginPage() {
  const handleLogin = () => {
    const email = (document.getElementById("email") as HTMLInputElement)?.value
    const password = (document.getElementById("password") as HTMLInputElement)?.value

    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

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
                alert("Token verification failed: " + JSON.stringify(verifyData))
              }
            })
        } else {
          alert(data.error || "Login failed")
        }
      })
      .catch((err) => {
        console.error("Error:", err)
        alert("Network error")
      })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-primary rounded inline-flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold">SJ</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">SJ Media Labs</h1>
          <p className="text-[#999]">Admin Portal - Welcome Back</p>
        </div>

        <div className="bg-[#111] border border-[#333] rounded-lg p-8">
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded text-white"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full p-3 bg-primary text-primary-foreground border-none rounded font-medium cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
