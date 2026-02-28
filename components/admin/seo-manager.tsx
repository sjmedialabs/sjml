"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  siteName: string
  siteTagline: string
  favicon: string
  ogImage: string
  twitterHandle: string
  googleAnalyticsId: string
  pages: PageSeo[]
}

const defaultData: SeoData = {
  globalTitle: "SJ Media Labs | Transform Your Brand",
  globalDescription: "Strategic brand development, identity design, and brand management to create memorable brand experiences.",
  siteName: "SJ Media Labs",
  siteTagline: "Transform Your Brand",
  favicon: "/favicon.ico",
  ogImage: "/og-image.jpg",
  twitterHandle: "@sjmedialabs",
  googleAnalyticsId: "",
  pages: [
    { page: "Home", title: "", description: "", keywords: "", ogImage: "" },
    { page: "About", title: "", description: "", keywords: "", ogImage: "" },
    { page: "Services", title: "", description: "", keywords: "", ogImage: "" },
    { page: "Work", title: "", description: "", keywords: "", ogImage: "" },
    { page: "Contact", title: "", description: "", keywords: "", ogImage: "" },
    { page: "Case Studies", title: "", description: "", keywords: "", ogImage: "" },
    { page: "Insights", title: "", description: "", keywords: "", ogImage: "" },
    { page: "Careers", title: "", description: "", keywords: "", ogImage: "" },
  ],
}

export function SeoManager() {
  const [data, setData] = useState<SeoData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/seo")
      if (res.ok) {
        const fetchedData = await res.json()
        // Remove _id and other MongoDB fields before setting state
        const { _id, __v, ...cleanData } = fetchedData
        setData({ ...defaultData, ...cleanData })
      }
    } catch (error) {
      console.error("Failed to fetch SEO data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    setSaving(true)
    setMessage("")
    
    try {
      const token = localStorage.getItem("adminToken")
      
      // Remove any MongoDB-specific fields before sending
      const { ...cleanData } = data
      
      const res = await fetch("/api/content/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanData),
      })
      
      if (res.ok) {
        setMessage("✅ SEO settings saved successfully! Changes will appear after cache clear.")
        setTimeout(() => setMessage(""), 5000)
      } else {
        const errorData = await res.json()
        setMessage(`❌ Failed to save SEO settings: ${errorData.error || 'Unknown error'}`)
        console.error("Save failed:", errorData)
      }
    } catch (error) {
      console.error("Save error:", error)
      setMessage("❌ Error saving SEO settings")
    } finally {
      setSaving(false)
    }
  }

  const updatePageSeo = (index: number, updates: Partial<PageSeo>) => {
    const newPages = [...data.pages]
    newPages[index] = { ...newPages[index], ...updates }
    setData({ ...data, pages: newPages })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
            <p className="admin-text-secondary">Loading SEO settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold admin-text-primary mb-2">
          SEO & Meta Tags Management
        </h1>
        <p className="admin-text-secondary">
          Control all SEO settings, meta tags, and search engine optimization for your entire website
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.includes("✅") 
            ? "bg-green-500/10 border-green-500/50 text-green-400" 
            : "bg-red-500/10 border-red-500/50 text-red-400"
        }`}>
          {message}
        </div>
      )}

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="global">🌐 Global Settings</TabsTrigger>
          <TabsTrigger value="pages">📄 Page-Specific SEO</TabsTrigger>
          <TabsTrigger value="social">🔗 Social Media</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics & Tracking</TabsTrigger>
        </TabsList>

        {/* GLOBAL SETTINGS */}
        <TabsContent value="global">
          <div className="space-y-6 max-w-4xl">
            <div className="admin-card p-6">
              <h2 className="text-xl font-semibold admin-text-primary mb-4">
                Default SEO (Fallback for all pages)
              </h2>
              <p className="text-sm admin-text-secondary mb-6">
                These settings apply to all pages unless overridden by page-specific settings
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Site Name</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Your brand/company name (e.g., "SJ Media Labs")
                  </p>
                  <Input
                    value={data.siteName}
                    onChange={(e) => setData({ ...data, siteName: e.target.value })}
                    placeholder="SJ Media Labs"
                    className="text-base"
                  />
                </div>

                <div>
                  <Label className="text-base">Site Tagline</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Short description of what you do (e.g., "Transform Your Brand")
                  </p>
                  <Input
                    value={data.siteTagline}
                    onChange={(e) => setData({ ...data, siteTagline: e.target.value })}
                    placeholder="Transform Your Brand"
                    className="text-base"
                  />
                </div>

                <div>
                  <Label className="text-base">Default Page Title</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Appears in browser tab and search results (max 60 characters)
                  </p>
                  <Input
                    value={data.globalTitle}
                    onChange={(e) => setData({ ...data, globalTitle: e.target.value })}
                    placeholder="SJ Media Labs | Transform Your Brand"
                    maxLength={60}
                    className="text-base"
                  />
                  <p className="text-xs mt-1 text-right admin-text-secondary">
                    {data.globalTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label className="text-base">Default Meta Description</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Appears in search results below the title (max 160 characters)
                  </p>
                  <textarea
                    className="admin-input min-h-[100px] text-base"
                    value={data.globalDescription}
                    onChange={(e) => setData({ ...data, globalDescription: e.target.value })}
                    placeholder="Strategic brand development, identity design, and brand management..."
                    maxLength={160}
                  />
                  <p className="text-xs mt-1 text-right admin-text-secondary">
                    {data.globalDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <Label className="text-base">Favicon</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Small icon shown in browser tab (path to favicon file)
                  </p>
                  <Input
                    value={data.favicon}
                    onChange={(e) => setData({ ...data, favicon: e.target.value })}
                    placeholder="/favicon.ico"
                    className="text-base"
                  />
                </div>

                <div>
                  <Label className="text-base">Default Open Graph Image</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Image shown when sharing on social media (1200x630px recommended)
                  </p>
                  <Input
                    value={data.ogImage}
                    onChange={(e) => setData({ ...data, ogImage: e.target.value })}
                    placeholder="/og-image.jpg"
                    className="text-base"
                  />
                  {data.ogImage && (
                    <div className="mt-2 p-2 admin-card">
                      <img 
                        src={data.ogImage} 
                        alt="OG Preview" 
                        className="max-w-xs rounded border border-[#333]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* PAGE-SPECIFIC SEO */}
        <TabsContent value="pages">
          <div className="space-y-6 max-w-4xl">
            <div className="admin-card p-6 mb-6">
              <h2 className="text-xl font-semibold admin-text-primary mb-2">
                Customize SEO for Each Page
              </h2>
              <p className="text-sm admin-text-secondary">
                Override default settings for specific pages. Leave blank to use global defaults.
              </p>
            </div>

            {data.pages.map((page, index) => (
              <div key={page.page} className="admin-card p-6">
                <h3 className="text-lg font-semibold admin-text-primary mb-4 flex items-center gap-2">
                  <span className="text-[#E63946]">●</span> {page.page} Page
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Page Title</Label>
                    <p className="text-xs admin-text-secondary mb-2">
                      Specific title for this page (e.g., "About Us | SJ Media Labs")
                    </p>
                    <Input
                      value={page.title}
                      onChange={(e) => updatePageSeo(index, { title: e.target.value })}
                      placeholder={`${page.page} | ${data.siteName}`}
                      maxLength={60}
                    />
                    <p className="text-xs mt-1 text-right admin-text-secondary">
                      {page.title.length}/60 characters
                    </p>
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <p className="text-xs admin-text-secondary mb-2">
                      Describe what users will find on this page
                    </p>
                    <textarea
                      className="admin-input min-h-[80px]"
                      value={page.description}
                      onChange={(e) => updatePageSeo(index, { description: e.target.value })}
                      placeholder={`Learn more about ${page.page.toLowerCase()}...`}
                      maxLength={160}
                    />
                    <p className="text-xs mt-1 text-right admin-text-secondary">
                      {page.description.length}/160 characters
                    </p>
                  </div>

                  <div>
                    <Label>Keywords (SEO)</Label>
                    <p className="text-xs admin-text-secondary mb-2">
                      Comma-separated keywords relevant to this page
                    </p>
                    <Input
                      value={page.keywords}
                      onChange={(e) => updatePageSeo(index, { keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <Label>Custom OG Image (Optional)</Label>
                    <p className="text-xs admin-text-secondary mb-2">
                      Custom image for social sharing (leave blank to use default)
                    </p>
                    <Input
                      value={page.ogImage}
                      onChange={(e) => updatePageSeo(index, { ogImage: e.target.value })}
                      placeholder={data.ogImage}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* SOCIAL MEDIA */}
        <TabsContent value="social">
          <div className="space-y-6 max-w-4xl">
            <div className="admin-card p-6">
              <h2 className="text-xl font-semibold admin-text-primary mb-4">
                Social Media Integration
              </h2>
              <p className="text-sm admin-text-secondary mb-6">
                Configure how your content appears when shared on social platforms
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Twitter Handle</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Your Twitter/X username (e.g., @sjmedialabs)
                  </p>
                  <Input
                    value={data.twitterHandle}
                    onChange={(e) => setData({ ...data, twitterHandle: e.target.value })}
                    placeholder="@sjmedialabs"
                    className="text-base"
                  />
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">ℹ️ Open Graph Info</h4>
                  <p className="text-sm admin-text-secondary">
                    Your Open Graph (OG) image and meta tags are automatically generated from your SEO settings above. 
                    When someone shares your website link on Facebook, LinkedIn, or other platforms, they'll see:
                  </p>
                  <ul className="text-sm admin-text-secondary mt-2 space-y-1 list-disc list-inside">
                    <li>Title: Page-specific title or global title</li>
                    <li>Description: Page-specific description or global description</li>
                    <li>Image: Custom OG image or default image</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics">
          <div className="space-y-6 max-w-4xl">
            <div className="admin-card p-6">
              <h2 className="text-xl font-semibold admin-text-primary mb-4">
                Analytics & Tracking
              </h2>
              <p className="text-sm admin-text-secondary mb-6">
                Set up tracking tools to monitor your website's performance
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Google Analytics ID</Label>
                  <p className="text-xs admin-text-secondary mb-2">
                    Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
                  </p>
                  <Input
                    value={data.googleAnalyticsId}
                    onChange={(e) => setData({ ...data, googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                    className="text-base font-mono"
                  />
                </div>

                {data.googleAnalyticsId && (
                  <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                    <p className="text-sm text-green-400">
                      ✅ Google Analytics is configured and will track visitors
                    </p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Implementation Note</h4>
                  <p className="text-sm admin-text-secondary">
                    After adding your Google Analytics ID, you'll need to add the GA tracking script to your website's layout.
                    Contact your developer to implement the tracking code in the root layout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* SAVE BUTTON */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#333]">
        <div className="text-sm admin-text-secondary">
          💡 Remember to clear cache after saving: <code className="text-[#E63946] bg-black/30 px-2 py-1 rounded">rm -rf .next/cache && pm2 restart sjml-app</code>
        </div>
        <Button
          onClick={saveData}
          disabled={saving}
          className="bg-[#E63946] hover:bg-[#d62839] text-white px-8 py-3 text-base"
        >
          {saving ? "Saving..." : "💾 Save All SEO Settings"}
        </Button>
      </div>
    </div>
  )
}
