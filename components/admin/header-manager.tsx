"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface NavItem {
  id: string
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}

interface HeaderData {
  logo: string
  logoText: string
  navItems: NavItem[]
  ctaButton: { text: string; href: string }
  showTopBar: boolean
  topBarText: string
}

const defaultData: HeaderData = {
  logo: "/logo.svg",
  logoText: "SJ MEDIA LABS",
  navItems: [
    { id: "1", label: "About", href: "/about" },
    { id: "2", label: "Work", href: "/work" },
    { id: "3", label: "Services", href: "/services" },
    { id: "4", label: "Case Studies", href: "/case-studies" },
    { id: "5", label: "Insights", href: "/insights" },
    { id: "6", label: "Clients", href: "/clients" },
    { id: "7", label: "Testimonials", href: "/testimonials" },
    { id: "8", label: "Careers", href: "/careers" },
    { id: "9", label: "Contact", href: "/contact" },
  ],
  ctaButton: { text: "Start a project", href: "/contact" },
  showTopBar: false,
  topBarText: "",
}

export function HeaderManager() {
  const [data, setData] = useState<HeaderData>(defaultData)
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
        setData({ ...defaultData, ...fetchedData })
      }
    } catch (error) {
      console.error("Failed to fetch header data")
    }
  }

  const saveData = async () => {
    setSaving(true)
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
        setMessage("Header saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Header / Navigation</h1>
        <p className="text-[#888]">Manage your site header and navigation menu</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      {/* Logo Section */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Logo</h2>
        <div className="space-y-4">
          <ImageUpload label="Logo Image" value={data.logo} onChange={(url) => setData({ ...data, logo: url })} />
          <div>
            <label className="block text-sm text-[#888] mb-2">Logo Text</label>
            <input
              type="text"
              value={data.logoText}
              onChange={(e) => setData({ ...data, logoText: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
            />
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Announcement Bar</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-[#888]">
            <input
              type="checkbox"
              checked={data.showTopBar}
              onChange={(e) => setData({ ...data, showTopBar: e.target.checked })}
              className="w-4 h-4 accent-[#E63946]"
            />
            Show announcement bar
          </label>
          {data.showTopBar && (
            <div>
              <label className="block text-sm text-[#888] mb-2">Announcement Text</label>
              <input
                type="text"
                value={data.topBarText}
                onChange={(e) => setData({ ...data, topBarText: e.target.value })}
                placeholder="e.g. 🎉 New service launched! Check it out →"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Navigation Links</h2>
          <button
            onClick={addNavItem}
            className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] text-sm"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-3">
          {data.navItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
              <span className="text-[#666] text-sm w-6">{index + 1}</span>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateNavItem(item.id, { label: e.target.value })}
                placeholder="Label"
                className="flex-1 px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => updateNavItem(item.id, { href: e.target.value })}
                placeholder="URL"
                className="flex-1 px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
              />
              <button onClick={() => removeNavItem(item.id)} className="text-red-500 hover:text-red-400 text-sm px-2">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">CTA Button</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#888] mb-2">Button Text</label>
            <input
              type="text"
              value={data.ctaButton.text}
              onChange={(e) => setData({ ...data, ctaButton: { ...data.ctaButton, text: e.target.value } })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#888] mb-2">Button Link</label>
            <input
              type="text"
              value={data.ctaButton.href}
              onChange={(e) => setData({ ...data, ctaButton: { ...data.ctaButton, href: e.target.value } })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
            />
          </div>
        </div>
      </div>

      <button
        onClick={saveData}
        disabled={saving}
        className="px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save Header Settings"}
      </button>
    </div>
  )
}
