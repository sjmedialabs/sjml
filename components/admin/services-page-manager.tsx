"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowLeft } from "lucide-react"

interface ServiceItem {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  linkText: string
  fullDescription: string
  image: string
  offerings: string[]
  benefits: { title: string; description: string }
  features: { title: string; points: string[] }
  process: Array<{ icon: string; title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  isActive: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const emptyService: Omit<ServiceItem, "id"> = {
  slug: "",
  title: "",
  description: "",
  icon: "",
  linkText: "Explore Service",
  fullDescription: "",
  image: "",
  offerings: [],
  benefits: { title: "", description: "" },
  features: { title: "", points: [] },
  process: [],
  faqs: [],
  isActive: true,
}

interface PageContent {
  hero: {
    title: string
    highlightedWords: string[]
    backgroundImage: string
    watermark: string
  }
  section: {
    title: string
    subtitle: string
    description: string
  }
}

export function ServicesPageManager() {
  const [activeTab, setActiveTab] = useState<"services" | "page-content">("services")
  const [services, setServices] = useState<ServiceItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"list" | "edit">("list")
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [pageContent, setPageContent] = useState<PageContent>({
    hero: { title: "", highlightedWords: [], backgroundImage: "", watermark: "SERVICES" },
    section: { title: "", subtitle: "", description: "" }
  })
  const [pageContentSaving, setPageContentSaving] = useState(false)

  useEffect(() => {
    fetchServices()
    fetchPageContent()
  }, [pagination.page])

  const fetchPageContent = async () => {
    try {
      const res = await fetch('/api/content/services')
      if (res.ok) {
        const data = await res.json()
        if (data.hero) setPageContent(data)
      }
    } catch (error) {
      console.error('Failed to fetch page content')
    }
  }

  const savePageContent = async () => {
    setPageContentSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/content/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pageKey: 'services', ...pageContent })
      })
      if (res.ok) {
        setMessage('Page content saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save page content')
      }
    } catch {
      setMessage('Failed to save page content')
    }
    setPageContentSaving(false)
  }

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/services?page=${pagination.page}&limit=${pagination.limit}`)
      if (res.ok) {
        const data = await res.json()
        setServices(data.services || [])
        setPagination(data.pagination || pagination)
      }
    } catch (error) {
      console.error("Failed to fetch services")
    }
    setLoading(false)
  }

  const saveService = async () => {
    if (!editingService) return
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const url = isNew ? "/api/services" : `/api/services/${editingService.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingService),
      })

      if (res.ok) {
        setMessage(isNew ? "Service created successfully!" : "Service updated successfully!")
        setTimeout(() => setMessage(""), 3000)
        fetchServices()
        setView("list")
        setEditingService(null)
        setIsNew(false)
      } else {
        setMessage("Failed to save service")
      }
    } catch {
      setMessage("Failed to save service")
    }
    setSaving(false)
  }

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setMessage("Service deleted successfully!")
        setTimeout(() => setMessage(""), 3000)
        fetchServices()
      }
    } catch {
      setMessage("Failed to delete service")
    }
  }

  const addNewService = () => {
    setEditingService({ ...emptyService, id: "" } as ServiceItem)
    setIsNew(true)
    setView("edit")
  }

  const editService = (service: ServiceItem) => {
    setEditingService({ ...service })
    setIsNew(false)
    setView("edit")
  }

  const updateField = (field: string, value: any) => {
    if (!editingService) return
    setEditingService({ ...editingService, [field]: value })
  }

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // List View
  if (view === "list") {
    return (
      <div>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Services Management</h1>
            <p className="text-[#888]">Manage services page content and individual services</p>
          </div>
          {activeTab === "services" && (
            <Button onClick={addNewService} className="bg-[#E63946] hover:bg-[#d32f3d]">
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </Button>
          )}
          {activeTab === "page-content" && (
            <Button onClick={savePageContent} disabled={pageContentSaving} className="bg-[#E63946] hover:bg-[#d32f3d]">
              {pageContentSaving ? 'Saving...' : 'Save Page Content'}
            </Button>
          )}
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#222] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('page-content')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'page-content' ? 'bg-[#E63946] text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
          >
            Page Content
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-[#E63946] text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
          >
            Services List
          </button>
        </div>

        {/* Page Content Tab */}
        {activeTab === 'page-content' && (
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888] mb-2">Background Image</label>
                  <ImageUpload
                    value={pageContent.hero.backgroundImage}
                    onChange={(url) => setPageContent({...pageContent, hero: {...pageContent.hero, backgroundImage: url}})}
                    label="Upload Background"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Hero Title</label>
                  <Input
                    value={pageContent.hero.title}
                    onChange={(e) => setPageContent({...pageContent, hero: {...pageContent.hero, title: e.target.value}})}
                    className="bg-[#0a0a0a] border-[#333] text-white"
                    placeholder="Redefining Digital Success..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Watermark Text</label>
                  <Input
                    value={pageContent.hero.watermark}
                    onChange={(e) => setPageContent({...pageContent, hero: {...pageContent.hero, watermark: e.target.value}})}
                    className="bg-[#0a0a0a] border-[#333] text-white"
                    placeholder="SERVICES"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Section Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888] mb-2">Section Title</label>
                  <Input
                    value={pageContent.section.title}
                    onChange={(e) => setPageContent({...pageContent, section: {...pageContent.section, title: e.target.value}})}
                    className="bg-[#0a0a0a] border-[#333] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Section Subtitle</label>
                  <Input
                    value={pageContent.section.subtitle}
                    onChange={(e) => setPageContent({...pageContent, section: {...pageContent.section, subtitle: e.target.value}})}
                    className="bg-[#0a0a0a] border-[#333] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Section Description</label>
                  <Textarea
                    value={pageContent.section.description}
                    onChange={(e) => setPageContent({...pageContent, section: {...pageContent.section, description: e.target.value}})}
                    className="bg-[#0a0a0a] border-[#333] text-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services List Tab */}
        {activeTab === 'services' && (
          <>
            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-[#333] text-white w-64"
              />
            </div>

            {/* Services Table */}
            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-4 text-[#888] font-medium">Service</th>
                <th className="text-left p-4 text-[#888] font-medium">Slug</th>
                <th className="text-left p-4 text-[#888] font-medium">Status</th>
                <th className="text-right p-4 text-[#888] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#666]">
                    No services found
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#222] rounded-lg flex items-center justify-center overflow-hidden">
                          {service.icon && (service.icon.startsWith('/') || service.icon.startsWith('http')) ? (
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-[#E63946] text-xs">?</span>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">{service.title}</div>
                          <div className="text-[#666] text-sm truncate max-w-xs">{service.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#888]">{service.slug}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${service.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editService(service)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteService(service.id)}
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
            <div className="flex items-center justify-between p-4 border-t border-[#222]">
              <div className="text-sm text-[#888]">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 text-white">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
          </>
        )}
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
            setEditingService(null)
            setIsNew(false)
          }}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isNew ? "Create New Service" : "Edit Service"}</h1>
          <p className="text-[#888]">Fill in all the details for the service</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      {editingService && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Title *</label>
                <Input
                  value={editingService.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  placeholder="Service title"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Slug *</label>
                <Input
                  value={editingService.slug}
                  onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  placeholder="service-slug"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-[#888] mb-2">Service Icon</label>
                <ImageUpload
                  value={editingService.icon}
                  onChange={(url) => updateField("icon", url)}
                  maxSizeMB={1}
                  maxWidth={512}
                  maxHeight={512}
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Link Text</label>
                <Input
                  value={editingService.linkText}
                  onChange={(e) => updateField("linkText", e.target.value)}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-[#888] mb-2">Short Description (for card)</label>
              <Textarea
                value={editingService.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="bg-[#0a0a0a] border-[#333] text-white"
                rows={2}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-[#888] mb-2">Full Description (for detail page)</label>
              <Textarea
                value={editingService.fullDescription}
                onChange={(e) => updateField("fullDescription", e.target.value)}
                className="bg-[#0a0a0a] border-[#333] text-white"
                rows={4}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={editingService.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="rounded border-[#333]"
              />
              <label htmlFor="isActive" className="text-sm text-white">
                Active (visible on website)
              </label>
            </div>
          </div>

          {/* Image */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Service Image</h2>
            <ImageUpload
              label="Featured Image"
              value={editingService.image}
              onChange={(url) => updateField("image", url)}
            />
          </div>

          {/* Offerings */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Service Offerings</h2>
            <Textarea
              value={editingService.offerings.join("\n")}
              onChange={(e) =>
                updateField(
                  "offerings",
                  e.target.value
                    .split("\n")
                    .map((o) => o.trim())
                    .filter(Boolean),
                )
              }
              className="bg-[#0a0a0a] border-[#333] text-white"
              placeholder="Brand strategy&#10;Visual identity, modern design&#10;Web design and development&#10;(one per line)"
              rows={5}
            />
          </div>

          {/* Benefits */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Benefits Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Title</label>
                <Input
                  value={editingService.benefits.title}
                  onChange={(e) => updateField("benefits", { ...editingService.benefits, title: e.target.value })}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Description</label>
                <Textarea
                  value={editingService.benefits.description}
                  onChange={(e) => updateField("benefits", { ...editingService.benefits, description: e.target.value })}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Key Features</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Title</label>
                <Input
                  value={editingService.features.title}
                  onChange={(e) => updateField("features", { ...editingService.features, title: e.target.value })}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Feature Points (comma separated)</label>
                <Textarea
                  value={editingService.features.points.join(", ")}
                  onChange={(e) =>
                    updateField("features", {
                      ...editingService.features,
                      points: e.target.value
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean),
                    })
                  }
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Process Steps</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateField("process", [...editingService.process, { icon: "", title: "", description: "" }])
                }
                className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </Button>
            </div>
            <div className="space-y-4">
              {editingService.process.map((step, index) => (
                <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-[#888]">Step {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateField(
                          "process",
                          editingService.process.filter((_, i) => i !== index),
                        )
                      }
                      className="text-red-400 hover:text-red-300 h-6 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={step.title}
                      onChange={(e) => {
                        const newProcess = [...editingService.process]
                        newProcess[index].title = e.target.value
                        updateField("process", newProcess)
                      }}
                      placeholder="Step title"
                      className="bg-[#111] border-[#333] text-white"
                    />
                    <Input
                      value={step.icon}
                      onChange={(e) => {
                        const newProcess = [...editingService.process]
                        newProcess[index].icon = e.target.value
                        updateField("process", newProcess)
                      }}
                      placeholder="Icon name"
                      className="bg-[#111] border-[#333] text-white"
                    />
                  </div>
                  <Textarea
                    value={step.description}
                    onChange={(e) => {
                      const newProcess = [...editingService.process]
                      newProcess[index].description = e.target.value
                      updateField("process", newProcess)
                    }}
                    placeholder="Step description"
                    className="bg-[#111] border-[#333] text-white mt-2"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">FAQs</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateField("faqs", [...editingService.faqs, { question: "", answer: "" }])}
                className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Add FAQ
              </Button>
            </div>
            <div className="space-y-4">
              {editingService.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-[#888]">FAQ {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateField(
                          "faqs",
                          editingService.faqs.filter((_, i) => i !== index),
                        )
                      }
                      className="text-red-400 hover:text-red-300 h-6 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                  <Input
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...editingService.faqs]
                      newFaqs[index].question = e.target.value
                      updateField("faqs", newFaqs)
                    }}
                    placeholder="Question"
                    className="bg-[#111] border-[#333] text-white mb-2"
                  />
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...editingService.faqs]
                      newFaqs[index].answer = e.target.value
                      updateField("faqs", newFaqs)
                    }}
                    placeholder="Answer"
                    className="bg-[#111] border-[#333] text-white"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={saveService}
              disabled={saving || !editingService.title || !editingService.slug}
              className="bg-[#E63946] hover:bg-[#d32f3d]"
            >
              {saving ? "Saving..." : isNew ? "Create Service" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setView("list")
                setEditingService(null)
                setIsNew(false)
              }}
              className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
