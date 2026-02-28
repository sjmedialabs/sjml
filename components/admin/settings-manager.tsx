"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsData {
  contactEmail: string
  contactPhone: string
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    youtube: string
  }
  businessHours: string
  address: string
  phone: string
  footerLogo: string
}

const defaultSettings: SettingsData = {
  contactEmail: "info@sjmedialabs.com",
  contactPhone: "+91 1234567890",
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: ""
  },
  businessHours: "Mon-Fri: 9:00 AM - 6:00 PM",
  address: "Hyderabad, India",
  phone: "",
  footerLogo: ""
}

export function SettingsManager() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/content/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setMessage("✅ Settings saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("❌ Failed to save settings")
      }
    } catch (error) {
      console.error("Save error:", error)
      setMessage("❌ Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
            <p className="admin-text-secondary">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold admin-text-primary mb-2">General Website Settings</h1>
        <p className="admin-text-secondary">
          Manage contact information and social media links
        </p>
        <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg text-sm text-blue-400">
          ℹ️ For SEO settings (page titles, descriptions, meta tags), go to <strong>SEO Settings</strong> section
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes("✅") 
            ? "bg-green-500/20 border border-green-500/50 text-green-400" 
            : "bg-red-500/20 border border-red-500/50 text-red-400"
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-8 max-w-3xl">
        {/* Contact Info */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold admin-text-primary mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="info@sjmedialabs.com"
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+91 1234567890"
              />
            </div>
            <div>
              <Label>Business Hours</Label>
              <Input
                value={settings.businessHours}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
              />
            </div>
            <div>
              <Label>Address</Label>
              <textarea
                className="admin-input min-h-[60px]"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Hyderabad, India"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold admin-text-primary mb-4">Social Media Links</h2>
          <div className="space-y-4">
            <div>
              <Label>Facebook URL</Label>
              <Input
                value={settings.socialMedia.facebook}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/sjmedialabs"
              />
            </div>
            <div>
              <Label>Twitter/X URL</Label>
              <Input
                value={settings.socialMedia.twitter}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/sjmedialabs"
              />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input
                value={settings.socialMedia.instagram}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/sjmedialabs"
              />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input
                value={settings.socialMedia.linkedin}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialMedia: { ...settings.socialMedia, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/company/sjmedialabs"
              />
            </div>
            <div>
              <Label>YouTube URL</Label>
              <Input
                value={settings.socialMedia.youtube}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialMedia: { ...settings.socialMedia, youtube: e.target.value }
                })}
                placeholder="https://youtube.com/@sjmedialabs"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#E63946] hover:bg-[#d62839] text-white px-8"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
