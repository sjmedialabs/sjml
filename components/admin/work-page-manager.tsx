"use client"

import { AdminToast } from "./admin-toast"
import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowLeft, Star } from "lucide-react"
import { WorkDetailTemplateEditor } from "./work-detail-template-editor"
import { WorkPageContentManager } from "./work-page-content-manager"
import {
  createDefaultWorkDetailTemplate,
  normalizeWorkDetailTemplate,
  type WorkDetailTemplate,
} from "@/lib/work-detail-template"

interface WorkItem {
  id: string
  slug: string
  title: string
  description: string
  image: string
  cardSubtitle: string
  categoryTags: string
  categories: string[]
  displayOrder: number
  category: string
  client: string
  industry: string
  role: string
  technology: string
  year: string
  tags: string[]
  detailTemplate: WorkDetailTemplate
  isActive: boolean
  isFeatured: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const emptyWork: Omit<WorkItem, "id"> = {
  slug: "",
  title: "",
  description: "",
  image: "/placeholder.svg?height=400&width=600",
  cardSubtitle: "",
  categoryTags: "BRANDING",
  categories: ["branding"],
  displayOrder: 999,
  category: "Branding",
  client: "",
  industry: "",
  role: "",
  technology: "",
  year: new Date().getFullYear().toString(),
  tags: [],
  detailTemplate: createDefaultWorkDetailTemplate(),
  isActive: true,
  isFeatured: false,
}

export function WorkPageManager() {
  const [works, setWorks] = useState<WorkItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"list" | "edit" | "pageContent">("list")
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    fetchWorks()
  }, [pagination.page])

  const seedDefaults = async () => {
    if (!confirm("Seed default portfolio works from mockup? Existing slugs will be skipped.")) return
    setSeeding(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/works/seed-defaults", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessage(`Seeded ${data.inserted} works (${data.skipped} skipped)`)
        setTimeout(() => setMessage(""), 4000)
        fetchWorks()
      } else {
        setMessage("Failed to seed works")
      }
    } catch {
      setMessage("Failed to seed works")
    }
    setSeeding(false)
  }

  const normalizeWorkItem = (work: WorkItem & Record<string, unknown>): WorkItem => {
    const title = work.title || ""
    const detailTemplate = work.detailTemplate
      ? { ...createDefaultWorkDetailTemplate(title), ...work.detailTemplate }
      : normalizeWorkDetailTemplate(work as Record<string, unknown>, title)
    return {
      ...work,
      cardSubtitle: work.cardSubtitle ?? work.role ?? "",
      categoryTags: work.categoryTags ?? work.category?.toUpperCase() ?? "",
      categories: work.categories?.length ? work.categories : (work.tags as string[]) ?? [],
      displayOrder: work.displayOrder ?? 999,
      detailTemplate,
    }
  }

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/works?page=${pagination.page}&limit=${pagination.limit}`)
      if (res.ok) {
        const data = await res.json()
        setWorks(data.works || [])
        setPagination(data.pagination || pagination)
      }
    } catch (error) {
      console.error("Failed to fetch works")
    }
    setLoading(false)
  }

  const saveWork = async () => {
    if (!editingWork) return
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const url = isNew ? "/api/works" : `/api/works/${editingWork.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingWork),
      })

      if (res.ok) {
        setMessage(isNew ? "Work created successfully!" : "Work updated successfully!")
        setTimeout(() => setMessage(""), 3000)
        fetchWorks()
        setView("list")
        setEditingWork(null)
        setIsNew(false)
      } else {
        setMessage("Failed to save work")
      }
    } catch {
      setMessage("Failed to save work")
    }
    setSaving(false)
  }

  const deleteWork = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work?")) return
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setMessage("Work deleted successfully!")
        setTimeout(() => setMessage(""), 3000)
        fetchWorks()
      }
    } catch {
      setMessage("Failed to delete work")
    }
  }

  const addNewWork = () => {
    setEditingWork({ ...emptyWork, id: "" } as WorkItem)
    setIsNew(true)
    setView("edit")
  }

  const editWork = (work: WorkItem) => {
    setEditingWork(normalizeWorkItem(work as WorkItem & Record<string, unknown>))
    setIsNew(false)
    setView("edit")
  }

  const updateField = (field: string, value: any) => {
    if (!editingWork) return
    setEditingWork({ ...editingWork, [field]: value })
  }

  const filteredWorks = works.filter(
    (w) =>
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (view === "pageContent") {
    return (
      <div>
        <div className="mb-6">
          <Button variant="outline" onClick={() => setView("list")} className="admin-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
          </Button>
        </div>
        <WorkPageContentManager />
      </div>
    )
  }

  // List View
  if (view === "list") {
    return (
      <div>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold admin-text-primary mb-2">Portfolio / Works Management</h1>
            <p className="admin-text-secondary">Create and manage your portfolio projects. Each work has its own detail page.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setView("pageContent")} className="admin-border">
              Edit Page Content
            </Button>
            <Button variant="outline" onClick={seedDefaults} disabled={seeding} className="admin-border">
              {seeding ? "Seeding..." : "Seed Defaults"}
            </Button>
            <Button onClick={addNewWork}>
              <Plus className="w-4 h-4 mr-2" /> Add Work
            </Button>
          </div>
        </div>

        <AdminToast message={message} onClose={() => setMessage("")} />

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 admin-text-secondary" />
          <Input
            placeholder="Search works..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 admin-bg-secondary admin-border-light admin-text-primary w-64"
          />
        </div>

        {/* Works Table */}
        <div className="admin-card border admin-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b admin-border">
                <th className="text-left p-4 admin-text-secondary font-medium">Project</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Client</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Category</th>
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
              ) : filteredWorks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center admin-text-muted">
                    No works found
                  </td>
                </tr>
              ) : (
                filteredWorks.map((work) => (
                  <tr key={work.id} className="border-b admin-border hover:admin-bg-secondary">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 admin-bg-secondary rounded-lg overflow-hidden">
                          <img
                            src={work.image || "/placeholder.svg"}
                            alt={work.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="admin-text-primary font-medium flex items-center gap-2">
                            {work.title}
                            {work.isFeatured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                          </div>
                          <div className="admin-text-muted text-sm">{work.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 admin-text-secondary">{work.client || "-"}</td>
                    <td className="p-4 admin-text-secondary">{work.category}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${work.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {work.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editWork(work)}
                          className="admin-text-secondary hover:admin-text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWork(work.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t admin-border">
              <div className="text-sm admin-text-secondary">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 admin-text-primary">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Edit View
  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => {
            setView("list")
            setEditingWork(null)
            setIsNew(false)
          }}
          className="admin-text-secondary hover:admin-text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold admin-text-primary">{isNew ? "Create New Work" : "Edit Work"}</h1>
          <p className="admin-text-secondary">Fill in all the details for the portfolio item</p>
        </div>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      {editingWork && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title *</label>
                <Input
                  value={editingWork.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Project title"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Slug *</label>
                <Input
                  value={editingWork.slug}
                  onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="project-slug"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Client</label>
                <Input
                  value={editingWork.client}
                  onChange={(e) => updateField("client", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Card subtitle</label>
                <Input
                  value={editingWork.cardSubtitle}
                  onChange={(e) => updateField("cardSubtitle", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Brand Identity, Packaging Design"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Category tags</label>
                <Input
                  value={editingWork.categoryTags}
                  onChange={(e) => updateField("categoryTags", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="BRANDING, PACKAGING"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Filter categories (comma)</label>
                <Input
                  value={editingWork.categories.join(", ")}
                  onChange={(e) =>
                    updateField(
                      "categories",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim().toLowerCase())
                        .filter(Boolean),
                    )
                  }
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="branding, packaging"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Display order</label>
                <Input
                  type="number"
                  value={editingWork.displayOrder}
                  onChange={(e) => updateField("displayOrder", Number.parseInt(e.target.value) || 999)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Category (legacy)</label>
                <Input
                  value={editingWork.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Branding, Web Design, etc."
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Industry</label>
                <Input
                  value={editingWork.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Role</label>
                <Input
                  value={editingWork.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Branding / Web Design"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Technology</label>
                <Input
                  value={editingWork.technology}
                  onChange={(e) => updateField("technology", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Web | UI | UX"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Year</label>
                <Input
                  value={editingWork.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm admin-text-secondary mb-2">Description</label>
              <Textarea
                value={editingWork.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
                rows={3}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm admin-text-secondary mb-2">Tags (comma separated)</label>
              <Input
                value={editingWork.tags.join(", ")}
                onChange={(e) =>
                  updateField(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                className="admin-bg-tertiary admin-border-light admin-text-primary"
                placeholder="Logo & Identity, Web Design, Development"
              />
            </div>
            <div className="mt-4 flex gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingWork.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="rounded admin-border-light"
                />
                <label htmlFor="isActive" className="text-sm admin-text-primary">
                  Active (visible on website)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={editingWork.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                  className="rounded admin-border-light"
                />
                <label htmlFor="isFeatured" className="text-sm admin-text-primary">
                  Featured (show on homepage)
                </label>
              </div>
            </div>
          </div>

          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-2">Listing thumbnail</h2>
            <p className="text-sm admin-text-muted mb-4">Used on the Work listing page grid.</p>
            <ImageUpload preset="cardWide" label="Thumbnail / card image" value={editingWork.image} onChange={(url) => updateField("image", url)} />
          </div>

          <WorkDetailTemplateEditor
            template={editingWork.detailTemplate}
            onChange={(detailTemplate) => updateField("detailTemplate", detailTemplate)}
          />

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={saveWork}
              disabled={saving || !editingWork.title || !editingWork.slug}
             
            >
              {saving ? "Saving..." : isNew ? "Create Work" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setView("list")
                setEditingWork(null)
                setIsNew(false)
              }}
              className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
