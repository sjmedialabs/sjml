"use client"

import { useState, useEffect } from "react"

interface PageSeo {
  page: string
  title: string
  description: string
  keywords: string
  ogImage: string
}

interface SeoData {
  globalTitle: string
  globalDescription: string
  favicon: string
  ogImage: string
  twitterHandle: string
  googleAnalyticsId: string
  pages: PageSeo[]
}

const defaultData: SeoData = {
  globalTitle: "SJ Media Labs | Transform Your Brand",
  globalDescription:
    "Strategic brand development, identity design, and brand management to create memorable brand experiences.",
  favicon: "/favicon.ico",
  ogImage: "/og-image.jpg",
  twitterHandle: "@sjmedialabs",
  googleAnalyticsId: "",
  pages: [
    { page: "Home", title: "SJ Media Labs | Transform Your Brand", description: "", keywords: "", ogImage: "" },
    { page: "About", title: "About Us | SJ Media Labs", description: "", keywords: "", ogImage: "" },
    { page: "Services", title: "Our Services | SJ Media Labs", description: "", keywords: "", ogImage: "" },
    { page: "Work", title: "Our Work | SJ Media Labs", description: "", keywords: "", ogImage: "" },
    { page: "Contact", title: "Contact Us | SJ Media Labs", description: "", keywords: "", ogImage: "" },
  ],
}

export function SeoManager() {
  const [data, setData] = useState<SeoData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("global")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/seo")
      if (res.ok) {
        const fetchedData = await res.json()
        setData({ ...defaultData, ...fetchedData })
      }
    } catch (error) {
      console.error("Failed to fetch SEO data")
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setMessage("SEO settings saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const updatePageSeo = (index: number, updates: Partial<PageSeo>) => {
    const newPages = [...data.pages]
    newPages[index] = { ...newPages[index], ...updates }
    setData({ ...data, pages: newPages })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">SEO Settings</h1>
        <p className="text-[#888]">Manage search engine optimization for your website</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === "global" ? "bg-[#E63946] text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
          }`}
        >
          Global Settings
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === "pages" ? "bg-[#E63946] text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
          }`}
        >
          Page-Specific SEO
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === "analytics" ? "bg-[#E63946] text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
          }`}
        >
          Analytics
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        {activeTab === "global" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Global SEO Settings</h2>
            <div>
              <label className="block text-sm text-[#888] mb-2">Default Title</label>
              <input
                type="text"
                value={data.globalTitle}
                onChange={(e) => setData({ ...data, globalTitle: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
              <p className="text-xs text-[#666] mt-1">Recommended: 50-60 characters</p>
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Default Description</label>
              <textarea
                value={data.globalDescription}
                onChange={(e) => setData({ ...data, globalDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
              <p className="text-xs text-[#666] mt-1">Recommended: 150-160 characters</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Favicon URL</label>
                <input
                  type="text"
                  value={data.favicon}
                  onChange={(e) => setData({ ...data, favicon: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Default OG Image URL</label>
                <input
                  type="text"
                  value={data.ogImage}
                  onChange={(e) => setData({ ...data, ogImage: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Twitter Handle</label>
              <input
                type="text"
                value={data.twitterHandle}
                onChange={(e) => setData({ ...data, twitterHandle: e.target.value })}
                placeholder="@yourhandle"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
          </div>
        )}

        {activeTab === "pages" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Page-Specific SEO</h2>
            {data.pages.map((page, index) => (
              <div key={page.page} className="p-4 bg-[#0a0a0a] rounded-lg">
                <h3 className="text-white font-medium mb-3">{page.page} Page</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Title</label>
                    <input
                      type="text"
                      value={page.title}
                      onChange={(e) => updatePageSeo(index, { title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Description</label>
                    <textarea
                      value={page.description}
                      onChange={(e) => updatePageSeo(index, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={page.keywords}
                      onChange={(e) => updatePageSeo(index, { keywords: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Analytics Integration</h2>
            <div>
              <label className="block text-sm text-[#888] mb-2">Google Analytics ID</label>
              <input
                type="text"
                value={data.googleAnalyticsId}
                onChange={(e) => setData({ ...data, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
              <p className="text-xs text-[#666] mt-1">Enter your Google Analytics 4 measurement ID</p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-[#222]">
          <button
            onClick={saveData}
            disabled={saving}
            className="px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save SEO Settings"}
          </button>
        </div>
      </div>
    </div>
  )
}
