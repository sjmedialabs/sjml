"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Eye, EyeOff } from "lucide-react"

export function SettingsManager() {
  const [settings, setSettings] = useState({
    siteName: "SJ Media Labs",
    siteTagline: "Digital Agency",
    metaTitle: "SJ Media Labs | Transform Your Brand",
    metaDescription: "Strategic brand development, identity design, and brand management.",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState(false)

  const handleSaveSettings = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      })
      alert("Settings saved successfully!")
    } catch (error) {
      alert("Failed to save settings")
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(passwordData),
      })
      alert("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      alert("Failed to change password")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[#888]">Manage site settings and admin credentials.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Site Settings */}
        <Card className="bg-[#111] border-[#222]">
          <CardHeader>
            <CardTitle className="text-white">Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Site Name</Label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Site Tagline</Label>
              <Input
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Meta Title</Label>
              <Input
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Meta Description</Label>
              <Input
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <Button onClick={handleSaveSettings} className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-[#111] border-[#222]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Change Password</CardTitle>
            <button onClick={() => setShowPasswords(!showPasswords)} className="text-[#888] hover:text-white">
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Current Password</Label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">New Password</Label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Confirm New Password</Label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
