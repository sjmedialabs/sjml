"use client"

import { AdminToast } from "./admin-toast"
import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { normalizeHeaderContent } from "@/lib/header-content"

interface NavItem {
  id: string
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}

interface HeaderData {
  logo: string
  logoText: string
  phone?: string
  navItems: NavItem[]
  ctaButton: { text: string; href: string }
  showTopBar: boolean
  topBarText: string
}

const defaultData: HeaderData = {
  logo: "",
  logoText: "SJ MEDIA LABS",
  phone: "",
  navItems: [
    { id: "0", label: "HOME", href: "/" },
    { id: "1", label: "ABOUT US", href: "/about" },
    { id: "2", label: "SERVICES", href: "/services" },
    { id: "3", label: "WORK", href: "/work" },
    { id: "4", label: "INDUSTRIES", href: "/industries" },
    { id: "5", label: "INSIGHTS", href: "/insights" },
    { id: "6", label: "CONTACT US", href: "/contact" },
  ],
  ctaButton: { text: "START A PROJECT", href: "/contact" },
  showTopBar: false,
  topBarText: "",
}

export function HeaderManager() {
  const [data, setData] = useState<HeaderData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/header")
      if (res.ok) {
        const fetchedData = await res.json()
        setData(normalizeHeaderContent(fetchedData))
      }
    } catch (error) {
      console.error("Failed to fetch header data")
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const saved = await res.json()
        setData(normalizeHeaderContent(saved))
        setMessage("Header saved successfully!")
      } else {
        const err = await res.json().catch(() => null)
        setMessage(err?.error ? `Failed to save: ${err.error}` : "Failed to save header")
      }
    } catch {
      setMessage("Failed to save header")
    }
    setSaving(false)
  }

  const addNavItem = () => {
    setData({
      ...data,
      navItems: [...data.navItems, { id: Date.now().toString(), label: "New Link", href: "/" }],
    })
  }

  const removeNavItem = (id: string) => {
    setData({ ...data, navItems: data.navItems.filter((item) => item.id !== id) })
  }

  const updateNavItem = (id: string, updates: Partial<NavItem>) => {
    setData({
      ...data,
      navItems: data.navItems.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  if (loading) {
    return <div className="p-4 admin-text-secondary">Loading header data...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold admin-text-primary mb-2">Header / Navigation</h1>
        <p className="admin-text-secondary">Manage your site header and navigation menu</p>
      </div>

      {/* Landing Page Notice */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-6 flex items-start gap-3">
        <span className="text-amber-600 font-bold text-lg leading-none mt-0.5">ℹ️</span>
        <div className="text-sm">
          <p className="font-semibold text-amber-950">Landing Page Notice</p>
          <p className="text-amber-850 mt-1">
            The <strong>Logo</strong>, <strong>Contact Phone</strong>, and <strong>CTA Button</strong> configured here are also automatically fetched and visible in the <strong>landing page header</strong>. (If phone is left blank, it automatically syncs from Footer Settings).
          </p>
        </div>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      {/* Logo Section */}
      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold admin-text-primary mb-2">Logo</h2>
        <p className="text-xs text-amber-700 mb-4">
          Note: This logo is also visible in the landing page header and footer.
        </p>
        <div className="space-y-4">
          <ImageUpload preset="logo" label="Logo Image" value={data.logo} onChange={(url) => setData({ ...data, logo: url })} />
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Logo Text</label>
            <input
              type="text"
              value={data.logoText}
              onChange={(e) => setData({ ...data, logoText: e.target.value })}
              className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Contact Phone Section */}
      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold admin-text-primary mb-2">Contact Phone</h2>
        <p className="text-xs text-amber-700 mb-4">
          Note: This phone number is visible in the landing page header. If left empty, it automatically syncs from the phone number in Footer Settings.
        </p>
        <div>
          <label className="block text-sm admin-text-secondary mb-2">Header Phone Number</label>
          <input
            type="text"
            value={data.phone || ""}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="+91 40 40268570"
            className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Top Bar */}
      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold admin-text-primary mb-4">Announcement Bar</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm admin-text-secondary">
            <input
              type="checkbox"
              checked={data.showTopBar}
              onChange={(e) => setData({ ...data, showTopBar: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            Show announcement bar
          </label>
          {data.showTopBar && (
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Announcement Text</label>
              <input
                type="text"
                value={data.topBarText}
                onChange={(e) => setData({ ...data, topBarText: e.target.value })}
                placeholder="e.g. 🎉 New service launched! Check it out →"
                className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold admin-text-primary">Navigation Links</h2>
          <button
            onClick={addNavItem}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-[4px] hover:bg-primary/90 text-sm"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-3">
          {data.navItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 p-3 admin-bg-tertiary rounded-lg">
              <span className="admin-text-muted text-sm w-6">{index + 1}</span>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateNavItem(item.id, { label: e.target.value })}
                placeholder="Label"
                className="flex-1 px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => updateNavItem(item.id, { href: e.target.value })}
                placeholder="URL"
                className="flex-1 px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm"
              />
              <button onClick={() => removeNavItem(item.id)} className="text-red-500 hover:text-red-400 text-sm px-2">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold admin-text-primary mb-2">CTA Button</h2>
        <p className="text-xs text-amber-700 mb-4">
          Note: This CTA button text and link are also visible in the landing page header.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Button Text</label>
            <input
              type="text"
              value={data.ctaButton.text}
              onChange={(e) => setData({ ...data, ctaButton: { ...data.ctaButton, text: e.target.value } })}
              className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Button Link</label>
            <input
              type="text"
              value={data.ctaButton.href}
              onChange={(e) => setData({ ...data, ctaButton: { ...data.ctaButton, href: e.target.value } })}
              className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      <button
        onClick={saveData}
        disabled={saving}
        className="h-9 px-4 bg-primary text-primary-foreground rounded-[4px] hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save Header Settings"}
      </button>
    </div>
  )
}
