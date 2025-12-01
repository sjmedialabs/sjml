"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function FooterManager() {
  const [footerData, setFooterData] = useState({
    address: "",
    phone: "",
    email: "",
    copyright: "",
    newsletterText: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchFooterData()
  }, [])

  const fetchFooterData = async () => {
    try {
      const res = await fetch("/api/content/footer")
      if (res.ok) {
        const data = await res.json()
        setFooterData(data)
      }
    } catch (error) {
      console.error("Failed to fetch footer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(footerData),
      })

      if (res.ok) {
        alert("Footer saved successfully!")
      } else {
        alert("Failed to save footer")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save footer")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-4">Loading footer data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Footer Settings</h2>
        <p className="text-muted-foreground">Manage your website footer content</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={footerData.address}
            onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
            placeholder="Enter company address"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={footerData.phone}
            onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={footerData.email}
            onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="copyright">Copyright Text</Label>
          <Input
            id="copyright"
            value={footerData.copyright}
            onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
            placeholder="© 2025 Your Company"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newsletterText">Newsletter Text</Label>
          <Textarea
            id="newsletterText"
            value={footerData.newsletterText}
            onChange={(e) => setFooterData({ ...footerData, newsletterText: e.target.value })}
            placeholder="Subscribe to get the latest insights..."
            rows={2}
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Footer"}
        </Button>
      </div>
    </div>
  )
}
