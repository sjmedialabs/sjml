"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"
import { AdminToast } from "./admin-toast"
import { Plus, Trash2 } from "lucide-react"
import { createDefaultFooter, normalizeFooterContent, type FooterContent, type FooterLink } from "@/lib/footer-content"

export function FooterManager() {
  const [footerData, setFooterData] = useState<FooterContent>(createDefaultFooter())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchFooterData()
  }, [])

  const fetchFooterData = async () => {
    try {
      const res = await fetch("/api/content/footer")
      if (res.ok) {
        const data = await res.json()
        setFooterData(normalizeFooterContent(data))
      }
    } catch (error) {
      console.error("Failed to fetch footer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
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
        setMessage("Footer saved successfully!")
      } else {
        setMessage("Failed to save footer")
      }
    } catch (error) {
      console.error("Save error:", error)
      setMessage("Failed to save footer")
    } finally {
      setSaving(false)
    }
  }

  const updateLink = (
    type: "companyLinks" | "serviceLinks",
    index: number,
    patch: Partial<FooterLink>,
  ) => {
    const links = [...footerData[type]]
    links[index] = { ...links[index], ...patch }
    setFooterData({ ...footerData, [type]: links })
  }

  const addLink = (type: "companyLinks" | "serviceLinks") => {
    setFooterData({
      ...footerData,
      [type]: [...footerData[type], { name: "", href: "/" }],
    })
  }

  const removeLink = (type: "companyLinks" | "serviceLinks", index: number) => {
    setFooterData({
      ...footerData,
      [type]: footerData[type].filter((_, i) => i !== index),
    })
  }

  const loadServicesFromApi = async () => {
    try {
      const res = await fetch("/api/services?all=true")
      if (!res.ok) return
      const services = await res.json()
      if (!Array.isArray(services)) return
      setFooterData({
        ...footerData,
        serviceLinks: services.map((s: { title: string; slug: string }) => ({
          name: s.title,
          href: `/services/${s.slug}`,
        })),
      })
      setMessage("Service links loaded from database.")
    } catch {
      setMessage("Could not load services.")
    }
  }

  if (loading) {
    return <div className="p-4 admin-text-secondary">Loading footer data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold admin-text-primary mb-2">Footer Settings</h2>
          <p className="admin-text-secondary">Manage logo, links, contact info, and social media for the site footer.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Footer"}
        </Button>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold admin-text-primary">Logo & brand</h3>
        <ImageUpload
          label="Footer logo"
          value={footerData.logo ?? ""}
          onChange={(url) => setFooterData({ ...footerData, logo: url })}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Company name</Label>
            <Input
              value={footerData.siteName ?? ""}
              onChange={(e) => setFooterData({ ...footerData, siteName: e.target.value })}
              placeholder="SJ Media Labs"
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={footerData.siteTagline ?? ""}
              onChange={(e) => setFooterData({ ...footerData, siteTagline: e.target.value })}
              placeholder="Branding & Advertising"
            />
          </div>
        </div>
      </div>

      <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold admin-text-primary">Contact</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={footerData.address ?? ""}
            onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
            rows={3}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={footerData.phone ?? ""}
              onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={footerData.email ?? ""}
              onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="copyright">Copyright</Label>
          <Input
            id="copyright"
            value={footerData.copyright ?? ""}
            onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
          />
        </div>
      </div>

      <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center gap-4">
          <h3 className="font-semibold admin-text-primary">Social media</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {(["facebook", "instagram", "linkedin", "twitter", "youtube"] as const).map((key) => (
            <div key={key}>
              <Label className="capitalize">{key === "twitter" ? "X / Twitter" : key}</Label>
              <Input
                value={footerData.socialLinks[key] ?? ""}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    socialLinks: { ...footerData.socialLinks, [key]: e.target.value },
                  })
                }
                placeholder={`https://${key}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold admin-text-primary">Company links</h3>
          <Button variant="outline" size="sm" onClick={() => addLink("companyLinks")}>
            <Plus className="w-4 h-4 mr-1" /> Add link
          </Button>
        </div>
        {footerData.companyLinks.map((link, index) => (
          <div key={index} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <Input
              placeholder="Label"
              value={link.name}
              onChange={(e) => updateLink("companyLinks", index, { name: e.target.value })}
            />
            <Input
              placeholder="/about"
              value={link.href}
              onChange={(e) => updateLink("companyLinks", index, { href: e.target.value })}
            />
            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => removeLink("companyLinks", index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold admin-text-primary">Services links</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadServicesFromApi}>
              Load from services
            </Button>
            <Button variant="outline" size="sm" onClick={() => addLink("serviceLinks")}>
              <Plus className="w-4 h-4 mr-1" /> Add link
            </Button>
          </div>
        </div>
        {footerData.serviceLinks.map((link, index) => (
          <div key={index} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <Input
              placeholder="Service name"
              value={link.name}
              onChange={(e) => updateLink("serviceLinks", index, { name: e.target.value })}
            />
            <Input
              placeholder="/services/branding"
              value={link.href}
              onChange={(e) => updateLink("serviceLinks", index, { href: e.target.value })}
            />
            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => removeLink("serviceLinks", index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
