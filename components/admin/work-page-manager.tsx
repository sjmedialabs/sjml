"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowLeft, Star } from "lucide-react"

interface WorkPageHero {
  title: string
  description: string
  image: string
}

interface WorkItem {
  id: string
  slug: string
  title: string
  description: string
  image: string
  category: string
  client: string
  industry: string
  role: string
  technology: string
  year: string
  tags: string[]
  overview: { title: string; description: string; points: string[] }
  logoVariations: string[]
  gallery: string[]
  process: Array<{ step: string; title: string; description: string }>
  showcase: string[]
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
  category: "Branding",
  client: "",
  industry: "",
  role: "",
  technology: "",
  year: new Date().getFullYear().toString(),
  tags: [],
  overview: { title: "Brand Overview", description: "", points: [] },
  logoVariations: [],
  gallery: [],
  process: [],
  showcase: [],
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
  const [view, setView] = useState<"list" | "edit" | "hero">("list")
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [pageContent, setPageContent] = useState<{ hero?: WorkPageHero; portfolio?: any } | null>(null)
  const [heroData, setHeroData] = useState<WorkPageHero>({
    title: "Elevate Beyond the Ordinary.",
    description: "We're a creative agency dedicated to design that moves brands from good to unforgettable.",
    image: "",
  })
  const [heroSaving, setHeroSaving] = useState(false)

  useEffect(() => {
    fetchWorks()
  }, [pagination.page])

  useEffect(() => {
    if (view === "hero") fetchWorkPageContent()
  }, [view])

  const fetchWorkPageContent = async () => {
    try {
      const res = await fetch("/api/content/work")
      if (res.ok) {
        const data = await res.json()
        setPageContent(data)
        const hero = data?.hero || {}
        setHeroData({
          title: hero.title || "Elevate Beyond the Ordinary.",
          description: hero.description || hero.subtitle || "",
          image: hero.image || "",
        })
      }
    } catch {
      console.error("Failed to fetch work page content")
    }
  }

  const saveHero = async () => {
    setHeroSaving(true)
    try {
      let content = pageContent
      if (!content) {
        const r = await fetch("/api/content/work")
        if (r.ok) content = await r.json()
      }
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/work", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageKey: "work",
          ...content,
          hero: {
            ...content?.hero,
            title: heroData.title,
            description: heroData.description,
            image: heroData.image,
          },
        }),
      })
      if (res.ok) {
        setMessage("Hero saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to save hero")
      }
    } catch {
      setMessage("Failed to save hero")
    }
    setHeroSaving(false)
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
    setEditingWork({ ...work })
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

  // Hero View
  if (view === "hero") {
    return (
      <div>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold admin-text-primary mb-2">Work Page Hero</h1>
            <p className="admin-text-secondary">Edit the hero section (title, description, image) shown on the Work page.</p>
          </div>
          <Button variant="outline" onClick={() => setView("list")} className="admin-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
          </Button>
        </div>
        {message && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
        )}
        <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold admin-text-primary mb-4">Hero Section</h2>
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Title</label>
            <Input
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="admin-input"
              placeholder="Elevate Beyond the Ordinary."
            />
          </div>
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Description</label>
            <Textarea
              value={heroData.description}
              onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
              rows={4}
              className="admin-input"
              placeholder="We're a creative agency dedicated to design..."
            />
          </div>
          <ImageUpload
            label="Hero Background Image"
            value={heroData.image}
            onChange={(url) => setHeroData({ ...heroData, image: url })}
          />
          <Button onClick={saveHero} disabled={heroSaving} className="bg-[#E63946] hover:bg-[#d32f3d]">
            {heroSaving ? "Saving..." : "Save Hero"}
          </Button>
        </div>
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("hero")} className="admin-border">
              Edit Page Hero
            </Button>
            <Button onClick={addNewWork} className="bg-[#E63946] hover:bg-[#d32f3d]">
              <Plus className="w-4 h-4 mr-2" /> Add Work
            </Button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
        )}

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
                    <div className="w-6 h-6 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin mx-auto" />
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

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

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
                <label className="block text-sm admin-text-secondary mb-2">Category</label>
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

          {/* Image */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Featured Image</h2>
            <ImageUpload label="Main Image" value={editingWork.image} onChange={(url) => updateField("image", url)} />
          </div>

          {/* Overview */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Brand Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title</label>
                <Input
                  value={editingWork.overview.title}
                  onChange={(e) => updateField("overview", { ...editingWork.overview, title: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Description</label>
                <Textarea
                  value={editingWork.overview.description}
                  onChange={(e) => updateField("overview", { ...editingWork.overview, description: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Key Points (comma separated)</label>
                <Input
                  value={editingWork.overview.points.join(", ")}
                  onChange={(e) =>
                    updateField("overview", {
                      ...editingWork.overview,
                      points: e.target.value
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean),
                    })
                  }
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold admin-text-primary">Process Steps</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateField("process", [
                    ...editingWork.process,
                    { step: String(editingWork.process.length + 1).padStart(2, "0"), title: "", description: "" },
                  ])
                }
                className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </Button>
            </div>
            <div className="space-y-4">
              {editingWork.process.map((step, index) => (
                <div key={index} className="p-4 admin-bg-tertiary rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm admin-text-secondary">Step {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateField(
                          "process",
                          editingWork.process.filter((_, i) => i !== index),
                        )
                      }
                      className="text-red-400 hover:text-red-300 h-6 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={step.step}
                      onChange={(e) => {
                        const newProcess = [...editingWork.process]
                        newProcess[index].step = e.target.value
                        updateField("process", newProcess)
                      }}
                      placeholder="01"
                      className="admin-card admin-border-light admin-text-primary"
                    />
                    <Input
                      value={step.title}
                      onChange={(e) => {
                        const newProcess = [...editingWork.process]
                        newProcess[index].title = e.target.value
                        updateField("process", newProcess)
                      }}
                      placeholder="Step title"
                      className="admin-card admin-border-light admin-text-primary"
                    />
                  </div>
                  <Textarea
                    value={step.description}
                    onChange={(e) => {
                      const newProcess = [...editingWork.process]
                      newProcess[index].description = e.target.value
                      updateField("process", newProcess)
                    }}
                    placeholder="Step description"
                    className="admin-card admin-border-light admin-text-primary mt-2"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold admin-text-primary">Gallery Images</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateField("gallery", [...editingWork.gallery, ""])}
                className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Image
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {editingWork.gallery.map((img, index) => (
                <div key={index} className="relative">
                  <ImageUpload
                    label={`Image ${index + 1}`}
                    value={img}
                    onChange={(url) => {
                      const newGallery = [...editingWork.gallery]
                      newGallery[index] = url
                      updateField("gallery", newGallery)
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateField(
                        "gallery",
                        editingWork.gallery.filter((_, i) => i !== index),
                      )
                    }
                    className="absolute top-0 right-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={saveWork}
              disabled={saving || !editingWork.title || !editingWork.slug}
              className="bg-[#E63946] hover:bg-[#d32f3d]"
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
