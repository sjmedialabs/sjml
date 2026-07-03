"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowLeft, Star } from "lucide-react"
import { InsightsPageContentManager } from "./insights-page-content-manager"
import { InsightDetailTemplateEditor } from "./insight-detail-template-editor"
import {
  createDefaultInsightDetailTemplate,
  normalizeInsightDetailTemplate,
  type InsightDetailTemplate,
} from "@/lib/insight-detail-template"

interface InsightItem {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  categoryTags: string
  categories: string[]
  category: string
  author: string
  date: string
  readTime: string
  displayOrder: number
  detailTemplate: InsightDetailTemplate
  published: boolean
  featured: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const emptyInsight: Omit<InsightItem, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  image: "/placeholder.svg?height=400&width=600",
  categoryTags: "BRANDING",
  categories: ["branding"],
  category: "Branding",
  author: "SJML Team",
  date: new Date().toISOString().split("T")[0],
  readTime: "5 min read",
  displayOrder: 999,
  detailTemplate: createDefaultInsightDetailTemplate(),
  published: true,
  featured: false,
}

export function InsightsPageManager() {
  const [insights, setInsights] = useState<InsightItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"list" | "edit" | "pageContent">("list")
  const [editingInsight, setEditingInsight] = useState<InsightItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [pagination.page])

  const normalizeInsightItem = (item: Record<string, unknown>): InsightItem => {
    const title = (item.title as string) || ""
    const slug = (item.slug as string) || ""
    const detailTemplate = item.detailTemplate
      ? { ...createDefaultInsightDetailTemplate(title), ...(item.detailTemplate as InsightDetailTemplate) }
      : normalizeInsightDetailTemplate(item, title, slug)
    return {
      id: (item.id as string) ?? "",
      slug,
      title,
      excerpt: (item.excerpt as string) ?? "",
      content: (item.content as string) ?? "",
      image: (item.image as string) ?? "",
      categoryTags: (item.categoryTags as string) ?? ((item.category as string)?.toUpperCase() ?? ""),
      categories: (item.categories as string[])?.length ? (item.categories as string[]) : ["branding"],
      category: (item.category as string) ?? "",
      author: (item.author as string) ?? "SJML Team",
      date: (item.date as string) ?? "",
      readTime: (item.readTime as string) ?? "5 min read",
      displayOrder: (item.displayOrder as number) ?? 999,
      detailTemplate,
      published: item.published !== false,
      featured: Boolean(item.featured),
    }
  }

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/insights?page=${pagination.page}&limit=${pagination.limit}`)
      if (res.ok) {
        const data = await res.json()
        setInsights((data.insights || []).map((i: Record<string, unknown>) => normalizeInsightItem(i)))
        setPagination(data.pagination || pagination)
      }
    } catch {
      console.error("Failed to fetch insights")
    }
    setLoading(false)
  }

  const seedDefaults = async () => {
    if (!confirm("Seed default insights from mockup? Existing slugs will be skipped.")) return
    setSeeding(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/insights/seed-defaults", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessage(`Seeded ${data.inserted} insights (${data.skipped} skipped)`)
        setTimeout(() => setMessage(""), 4000)
        fetchInsights()
      } else {
        setMessage("Failed to seed insights")
      }
    } catch {
      setMessage("Failed to seed insights")
    }
    setSeeding(false)
  }

  const saveInsight = async () => {
    if (!editingInsight) return
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const url = isNew ? "/api/insights" : `/api/insights/${editingInsight.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingInsight),
      })

      if (res.ok) {
        setMessage(isNew ? "Insight created!" : "Insight updated!")
        setTimeout(() => setMessage(""), 3000)
        fetchInsights()
        setView("list")
        setEditingInsight(null)
        setIsNew(false)
      } else {
        setMessage("Failed to save insight")
      }
    } catch {
      setMessage("Failed to save insight")
    }
    setSaving(false)
  }

  const deleteInsight = async (id: string) => {
    if (!confirm("Delete this insight?")) return
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/insights/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setMessage("Insight deleted!")
        setTimeout(() => setMessage(""), 3000)
        fetchInsights()
      }
    } catch {
      setMessage("Failed to delete insight")
    }
  }

  const addNewInsight = () => {
    setEditingInsight({ ...emptyInsight, id: "" } as InsightItem)
    setIsNew(true)
    setView("edit")
  }

  const editInsight = (item: InsightItem) => {
    setEditingInsight(normalizeInsightItem(item as unknown as Record<string, unknown>))
    setIsNew(false)
    setView("edit")
  }

  const updateField = (field: string, value: unknown) => {
    if (!editingInsight) return
    setEditingInsight({ ...editingInsight, [field]: value })
  }

  const filtered = insights.filter(
    (i) =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.categoryTags.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (view === "pageContent") {
    return (
      <div>
        <div className="mb-6">
          <Button variant="outline" onClick={() => setView("list")} className="admin-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
          </Button>
        </div>
        <InsightsPageContentManager />
      </div>
    )
  }

  if (view === "list") {
    return (
      <div>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold admin-text-primary mb-2">Insights / Blog</h1>
            <p className="admin-text-secondary">Manage blog posts and article detail pages.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setView("pageContent")} className="admin-border">
              Edit Page Content
            </Button>
            <Button variant="outline" onClick={seedDefaults} disabled={seeding} className="admin-border">
              {seeding ? "Seeding..." : "Seed Defaults"}
            </Button>
            <Button onClick={addNewInsight}>
              <Plus className="w-4 h-4 mr-2" /> Add Insight
            </Button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
        )}

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 admin-text-secondary" />
          <Input
            placeholder="Search insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 admin-bg-secondary admin-border-light admin-text-primary w-64"
          />
        </div>

        <div className="admin-card border admin-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b admin-border">
                <th className="text-left p-4 admin-text-secondary font-medium">Title</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Category</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Date</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Status</th>
                <th className="text-right p-4 admin-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center admin-text-muted">No insights found</td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b admin-border hover:admin-bg-secondary">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 admin-bg-secondary rounded-lg overflow-hidden">
                          <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="admin-text-primary font-medium flex items-center gap-2">
                            {item.title}
                            {item.featured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                          </div>
                          <div className="admin-text-muted text-sm">{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 admin-text-secondary">{item.categoryTags}</td>
                    <td className="p-4 admin-text-secondary text-sm">{item.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${item.published ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 admin-text-secondary"}`}>
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => editInsight(item)} className="admin-text-secondary hover:admin-text-primary">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteInsight(item.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t admin-border">
              <div className="text-sm admin-text-secondary">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page === 1} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} className="admin-border-light">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 admin-text-primary">{pagination.page} / {pagination.totalPages}</span>
                <Button variant="outline" size="sm" disabled={pagination.page === pagination.totalPages} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} className="admin-border-light">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" onClick={() => { setView("list"); setEditingInsight(null); setIsNew(false) }} className="admin-text-secondary hover:admin-text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold admin-text-primary">{isNew ? "Create Insight" : "Edit Insight"}</h1>
          <p className="admin-text-secondary">Article listing card and detail page content</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      {editingInsight && (
        <div className="space-y-6">
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title *</label>
                <Input value={editingInsight.title} onChange={(e) => updateField("title", e.target.value)} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Slug *</label>
                <Input value={editingInsight.slug} onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Category tags</label>
                <Input value={editingInsight.categoryTags} onChange={(e) => updateField("categoryTags", e.target.value)} className="admin-bg-tertiary admin-border-light admin-text-primary" placeholder="BRANDING" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Filter categories (comma)</label>
                <Input
                  value={editingInsight.categories.join(", ")}
                  onChange={(e) => updateField("categories", e.target.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="branding, marketing"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Author</label>
                <Input value={editingInsight.author} onChange={(e) => updateField("author", e.target.value)} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Date</label>
                <Input type="date" value={editingInsight.date?.split("T")[0] ?? editingInsight.date} onChange={(e) => updateField("date", e.target.value)} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Read time</label>
                <Input value={editingInsight.readTime} onChange={(e) => updateField("readTime", e.target.value)} className="admin-bg-tertiary admin-border-light admin-text-primary" placeholder="6 min read" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Display order</label>
                <Input type="number" value={editingInsight.displayOrder} onChange={(e) => updateField("displayOrder", Number.parseInt(e.target.value) || 999)} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm admin-text-secondary mb-2">Excerpt</label>
              <Textarea value={editingInsight.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} rows={2} className="admin-bg-tertiary admin-border-light admin-text-primary" />
            </div>
            <div className="mt-4">
              <ImageUpload label="Featured image" value={editingInsight.image} onChange={(url) => updateField("image", url)} />
            </div>
            <div className="mt-4 flex gap-4">
              <label className="flex items-center gap-2 text-sm admin-text-secondary">
                <input type="checkbox" checked={editingInsight.featured} onChange={(e) => updateField("featured", e.target.checked)} className="w-4 h-4 accent-primary" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm admin-text-secondary">
                <input type="checkbox" checked={editingInsight.published} onChange={(e) => updateField("published", e.target.checked)} className="w-4 h-4 accent-primary" />
                Published
              </label>
            </div>
          </div>

          <InsightDetailTemplateEditor
            template={editingInsight.detailTemplate}
            onChange={(detailTemplate) => setEditingInsight({ ...editingInsight, detailTemplate })}
          />

          <Button onClick={saveInsight} disabled={saving} className="h-10 px-6">
            {saving ? "Saving..." : isNew ? "Create Insight" : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
