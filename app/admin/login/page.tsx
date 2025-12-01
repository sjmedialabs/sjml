"use client"

export default function AdminLoginPage() {
  const handleLogin = () => {
    const email = (document.getElementById("email") as HTMLInputElement)?.value
    const password = (document.getElementById("password") as HTMLInputElement)?.value
    
    console.log("Login clicked!", { email, password })
    
    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response:", data)
        if (data.token) {
          console.log("Saving token...")
          localStorage.setItem("adminToken", data.token)
          
          const savedToken = localStorage.getItem("adminToken")
          console.log("Token saved?", savedToken ? "YES" : "NO")
          console.log("Token length:", savedToken?.length)
          
          console.log("Testing token verification...")
          fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${savedToken}` }
          })
            .then(r => r.json())
            .then(verifyData => {
              console.log("Verify response:", verifyData)
              if (verifyData.valid) {
                console.log("Token is valid! Redirecting...")
                console.log("Redirect URL:", window.location.origin + "/admin/dashboard")
                
                // Use replace instead of href to prevent back button issues
                window.location.replace("/admin/dashboard")
              } else {
                alert("Token verification failed: " + JSON.stringify(verifyData))
              }
            })
        } else {
          alert(data.error || "Login failed")
        }
      })
      .catch(err => {
        console.error("Error:", err)
        alert("Network error")
      })
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "#E63946",
            borderRadius: "4px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}>
            <span style={{ color: "white", fontWeight: "bold" }}>SJ</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
            SJ Media Labs
          </h1>
          <p style={{ color: "#999" }}>Admin Portal - Welcome Back</p>
        </div>

        <div style={{
          background: "#111",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "32px"
        }}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="email" style={{ display: "block", color: "white", marginBottom: "8px" }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              defaultValue="admin@sjmedialabs.com"
              style={{
                width: "100%",
                padding: "12px",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="password" style={{ display: "block", color: "white", marginBottom: "8px" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              defaultValue="SJMedia@2025"
              style={{
                width: "100%",
                padding: "12px",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px"
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              background: "#E63946",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Sign In
          </button>

          <div style={{
            marginTop: "24px",
            paddingTop: "24px",
            borderTop: "1px solid #333"
          }}>
            <p style={{ fontSize: "12px", color: "#666", textAlign: "center", marginBottom: "8px" }}>
              Default Credentials
            </p>
            <div style={{
              background: "#1a1a1a",
              borderRadius: "4px",
              padding: "12px",
              fontSize: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#999" }}>Email:</span>
                <span style={{ color: "white", fontFamily: "monospace" }}>admin@sjmedialabs.com</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#999" }}>Password:</span>
                <span style={{ color: "white", fontFamily: "monospace" }}>SJMedia@2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
