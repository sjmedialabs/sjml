"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ImageUpload } from "./image-upload"
import { RichTextEditor } from "./rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowLeft, X } from "lucide-react"

interface ServiceItem {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  linkText: string
  fullDescription: string
  heroImage: string
  image: string
  offerings: string[]
  benefits: { title: string; description: string }
  features: { title: string; points: string[] }
  process: Array<{ icon: string; title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  isActive: boolean
  displayOrder?: number
  portfolioUrl?: string
  brochureUrl?: string
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
  heroImage: "",
  image: "",
  offerings: [],
  benefits: { title: "", description: "" },
  features: { title: "", points: [] },
  process: [],
  faqs: [],
  isActive: true,
  displayOrder: 0,
  portfolioUrl: "",
  brochureUrl: "",
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

interface SubServiceItem {
  id: string
  _id?: string
  parentSlug: string
  slug: string
  name: string
  bannerImage: string
  shortDescription: string
  fullDescription: string
  portfolioUrl: string
  brochureUrl: string
  displayOrder: number
  isActive: boolean
}

export function ServicesPageManager() {
  const [activeTab, setActiveTab] = useState<"services" | "page-content" | "sub-services">("services")
  const [services, setServices] = useState<ServiceItem[]>([])
  const [allServicesForParent, setAllServicesForParent] = useState<ServiceItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"list" | "edit">("list")
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [pageContent, setPageContent] = useState<PageContent>({
    hero: { title: "", description: "", highlightedWords: [], backgroundImage: "", watermark: "SERVICES" } as PageContent["hero"],
    section: { title: "", subtitle: "", description: "" }
  })
  const [pageContentSaving, setPageContentSaving] = useState(false)
  const [subServices, setSubServices] = useState<SubServiceItem[]>([])
  const [subPagination, setSubPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [subLoading, setSubLoading] = useState(false)
  const [subSaving, setSubSaving] = useState(false)
  const [editingSub, setEditingSub] = useState<SubServiceItem | null>(null)
  const [subView, setSubView] = useState<"list" | "edit">("list")
  const [subParentFilter, setSubParentFilter] = useState("")
  const [subIsNew, setSubIsNew] = useState(false)

  useEffect(() => {
    fetchServices()
    fetchPageContent()
  }, [pagination.page])

  useEffect(() => {
    if (activeTab === "sub-services") {
      fetchSubServices()
      fetch("/api/services?all=true").then((r) => r.ok && r.json().then((arr) => setAllServicesForParent(Array.isArray(arr) ? arr : [])))
    }
  }, [activeTab, subPagination.page, subParentFilter])

  const fetchSubServices = async () => {
    setSubLoading(true)
    try {
      const params = new URLSearchParams({ page: String(subPagination.page), limit: String(subPagination.limit) })
      if (subParentFilter) params.set("parent", subParentFilter)
      const res = await fetch(`/api/sub-services?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSubServices(data.subServices || [])
        setSubPagination((p) => ({ ...p, ...data.pagination, total: data.pagination?.total ?? 0, totalPages: data.pagination?.totalPages ?? 0 }))
      }
    } catch (_) {}
    setSubLoading(false)
  }

  const saveSubService = async () => {
    if (!editingSub) return
    setSubSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const url = subIsNew ? "/api/sub-services" : `/api/sub-services/${editingSub.id}`
      const method = subIsNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingSub),
      })
      if (res.ok) {
        setMessage(subIsNew ? "Sub-service created." : "Sub-service updated.")
        setTimeout(() => setMessage(""), 3000)
        fetchSubServices()
        setSubView("list")
        setEditingSub(null)
        setSubIsNew(false)
      } else setMessage("Failed to save sub-service")
    } catch (_) {
      setMessage("Failed to save sub-service")
    }
    setSubSaving(false)
  }

  const deleteSubService = async (id: string) => {
    if (!confirm("Delete this sub-service?")) return
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/sub-services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        setMessage("Sub-service deleted.")
        setTimeout(() => setMessage(""), 3000)
        fetchSubServices()
      }
    } catch (_) {}
  }

  const addNewSubService = () => {
    setEditingSub({
      id: "",
      parentSlug: subParentFilter || (allServicesForParent[0]?.slug ?? ""),
      slug: "",
      name: "",
      bannerImage: "",
      shortDescription: "",
      fullDescription: "",
      portfolioUrl: "",
      brochureUrl: "",
      displayOrder: 0,
      isActive: true,
    })
    setSubIsNew(true)
    setSubView("edit")
  }

  const editSubService = (sub: SubServiceItem) => {
    setEditingSub({ ...sub })
    setSubIsNew(false)
    setSubView("edit")
  }

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
        body: JSON.stringify({
          pageKey: 'services',
          ...pageContent,
          hero: {
            ...pageContent.hero,
            image: pageContent.hero.backgroundImage ?? (pageContent.hero as any).image ?? ''
          }
        })
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
            <h1 className="text-2xl font-bold admin-text-primary mb-2">Services Management</h1>
            <p className="admin-text-secondary">Manage services page content and individual services</p>
          </div>
          {activeTab === "services" && (
            <Button onClick={addNewService} className="bg-[#E63946] hover:bg-[#d32f3d]">
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </Button>
          )}
          {activeTab === "sub-services" && (
            <Button onClick={addNewSubService} className="bg-[#E63946] hover:bg-[#d32f3d]">
              <Plus className="w-4 h-4 mr-2" /> Add Sub-Service
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
        <div className="flex gap-2 border-b admin-border pb-4 mb-6">
          <button
            onClick={() => setActiveTab('page-content')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'page-content' ? 'bg-[#E63946] admin-text-primary' : 'admin-bg-secondary admin-text-secondary hover:admin-text-primary'}`}
          >
            Page Content
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-[#E63946] admin-text-primary' : 'admin-bg-secondary admin-text-secondary hover:admin-text-primary'}`}
          >
            Services List
          </button>
          <button
            onClick={() => setActiveTab('sub-services')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'sub-services' ? 'bg-[#E63946] admin-text-primary' : 'admin-bg-secondary admin-text-secondary hover:admin-text-primary'}`}
          >
            Sub-Services
          </button>
        </div>

        {/* Page Content Tab */}
        {activeTab === 'page-content' && (
          <div className="space-y-6">
            <div className="admin-card border admin-border rounded-xl p-6">
              <h3 className="text-lg font-semibold admin-text-primary mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Background Image</label>
                  <ImageUpload
                    value={pageContent.hero.backgroundImage}
                    onChange={(url) => setPageContent({...pageContent, hero: {...pageContent.hero, backgroundImage: url}})}
                    label="Upload Background"
                  />
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Hero Title</label>
                  <Input
                    value={pageContent.hero.title}
                    onChange={(e) => setPageContent({...pageContent, hero: {...pageContent.hero, title: e.target.value}})}
                    className="admin-bg-tertiary admin-border-light admin-text-primary"
                    placeholder="Redefining Digital Success..."
                  />
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Hero Description</label>
                  <Textarea
                    value={(pageContent.hero as any).description ?? ""}
                    onChange={(e) => setPageContent({...pageContent, hero: {...pageContent.hero, description: e.target.value}})}
                    rows={3}
                    className="admin-bg-tertiary admin-border-light admin-text-primary"
                    placeholder="Comprehensive solutions to elevate your brand..."
                  />
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Watermark Text</label>
                  <Input
                    value={pageContent.hero.watermark}
                    onChange={(e) => setPageContent({...pageContent, hero: {...pageContent.hero, watermark: e.target.value}})}
                    className="admin-bg-tertiary admin-border-light admin-text-primary"
                    placeholder="SERVICES"
                  />
                </div>
              </div>
            </div>

            <div className="admin-card border admin-border rounded-xl p-6">
              <h3 className="text-lg font-semibold admin-text-primary mb-4">Section Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Section Title</label>
                  <Input
                    value={pageContent.section.title}
                    onChange={(e) => setPageContent({...pageContent, section: {...pageContent.section, title: e.target.value}})}
                    className="admin-bg-tertiary admin-border-light admin-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Section Subtitle</label>
                  <Input
                    value={pageContent.section.subtitle}
                    onChange={(e) => setPageContent({...pageContent, section: {...pageContent.section, subtitle: e.target.value}})}
                    className="admin-bg-tertiary admin-border-light admin-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Section Description</label>
                  <Textarea
                    value={pageContent.section.description}
                    onChange={(e) => setPageContent({...pageContent, section: {...pageContent.section, description: e.target.value}})}
                    className="admin-bg-tertiary admin-border-light admin-text-primary"
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 admin-text-secondary" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 admin-bg-secondary admin-border-light admin-text-primary w-64"
              />
            </div>

            {/* Services Table */}
            <div className="admin-card border admin-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b admin-border">
                <th className="text-left p-4 admin-text-secondary font-medium">Service</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Slug</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Status</th>
                <th className="text-right p-4 admin-text-secondary font-medium">Actions</th>
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
                  <td colSpan={4} className="p-8 text-center admin-text-muted">
                    No services found
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="border-b admin-border hover:admin-bg-secondary">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 admin-bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
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
                          <div className="admin-text-primary font-medium">{service.title}</div>
                          <div className="admin-text-muted text-sm truncate max-w-xs">{service.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 admin-text-secondary">{service.slug}</td>
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
                          className="admin-text-secondary hover:admin-text-primary"
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
          </>
        )}

        {/* Sub-Services Tab */}
        {activeTab === "sub-services" && subView === "list" && (
          <>
            <div className="mb-6 flex gap-4 items-center">
              <label className="text-sm admin-text-secondary">Parent service:</label>
              <select
                value={subParentFilter}
                onChange={(e) => setSubParentFilter(e.target.value)}
                className="admin-bg-tertiary admin-border-light admin-text-primary rounded px-3 py-2"
              >
                <option value="">All</option>
                {allServicesForParent.map((s) => (
                  <option key={s.id} value={s.slug}>{s.title}</option>
                ))}
              </select>
            </div>
            <div className="admin-card border admin-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b admin-border">
                    <th className="text-left p-4 admin-text-secondary font-medium">Parent</th>
                    <th className="text-left p-4 admin-text-secondary font-medium">Name</th>
                    <th className="text-left p-4 admin-text-secondary font-medium">Slug</th>
                    <th className="text-left p-4 admin-text-secondary font-medium">Order</th>
                    <th className="text-left p-4 admin-text-secondary font-medium">Status</th>
                    <th className="text-right p-4 admin-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subLoading ? (
                    <tr><td colSpan={6} className="p-8 text-center"><div className="w-6 h-6 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin mx-auto" /></td></tr>
                  ) : subServices.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center admin-text-muted">No sub-services found</td></tr>
                  ) : (
                    subServices.map((sub) => (
                      <tr key={sub.id} className="border-b admin-border hover:admin-bg-secondary">
                        <td className="p-4 admin-text-secondary">{sub.parentSlug}</td>
                        <td className="p-4 admin-text-primary font-medium">{sub.name}</td>
                        <td className="p-4 admin-text-secondary">{sub.slug}</td>
                        <td className="p-4 admin-text-secondary">{sub.displayOrder ?? 0}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${sub.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {sub.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => editSubService(sub)} className="admin-text-secondary hover:admin-text-primary"><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSubService(sub.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {subPagination.totalPages > 1 && (
                <div className="flex justify-between p-4 border-t admin-border">
                  <span className="text-sm admin-text-secondary">{subPagination.total} total</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={subPagination.page === 1} onClick={() => setSubPagination((p) => ({ ...p, page: p.page - 1 }))} className="admin-border-light text-gray-300"> <ChevronLeft className="w-4 h-4" /> </Button>
                    <span className="px-3 py-1 admin-text-primary">{subPagination.page} / {subPagination.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={subPagination.page >= subPagination.totalPages} onClick={() => setSubPagination((p) => ({ ...p, page: p.page + 1 }))} className="admin-border-light text-gray-300"> <ChevronRight className="w-4 h-4" /> </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "sub-services" && subView === "edit" && editingSub && (
          <div className="space-y-6 admin-card border admin-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold admin-text-primary">{subIsNew ? "New Sub-Service" : "Edit Sub-Service"}</h2>
              <Button variant="ghost" onClick={() => { setSubView("list"); setEditingSub(null); }} className="admin-text-secondary">Cancel</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Parent Service *</label>
                <select
                  value={editingSub.parentSlug}
                  onChange={(e) => setEditingSub({ ...editingSub, parentSlug: e.target.value })}
                  className="w-full admin-bg-tertiary admin-border-light admin-text-primary rounded px-3 py-2"
                >
                  {allServicesForParent.map((s) => (
                    <option key={s.id} value={s.slug}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Display Order</label>
                <Input type="number" value={editingSub.displayOrder ?? 0} onChange={(e) => setEditingSub({ ...editingSub, displayOrder: Number(e.target.value) || 0 })} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Name *</label>
                <Input value={editingSub.name} onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })} className="admin-bg-tertiary admin-border-light admin-text-primary" placeholder="Logo Design" />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Slug *</label>
                <Input value={editingSub.slug} onChange={(e) => setEditingSub({ ...editingSub, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="admin-bg-tertiary admin-border-light admin-text-primary" placeholder="logo-design" />
              </div>
            </div>
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Banner Image</label>
              <ImageUpload value={editingSub.bannerImage} onChange={(url) => setEditingSub({ ...editingSub, bannerImage: url })} />
            </div>
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Short Description</label>
              <Textarea value={editingSub.shortDescription} onChange={(e) => setEditingSub({ ...editingSub, shortDescription: e.target.value })} className="admin-bg-tertiary admin-border-light admin-text-primary" rows={2} />
            </div>
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Full Description</label>
              <RichTextEditor value={editingSub.fullDescription ?? ""} onChange={(html) => setEditingSub({ ...editingSub, fullDescription: html })} placeholder="Full description…" minHeight="160px" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Portfolio URL</label>
                <Input value={editingSub.portfolioUrl ?? ""} onChange={(e) => setEditingSub({ ...editingSub, portfolioUrl: e.target.value })} className="admin-bg-tertiary admin-border-light admin-text-primary" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Brochure PDF</label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="application/pdf" className="admin-bg-tertiary admin-border-light max-w-xs" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const form = new FormData()
                    form.append("file", file)
                    try {
                      const token = localStorage.getItem("adminToken")
                      const res = await fetch("/api/upload/file", { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form })
                      const data = await res.json()
                      if (data?.url) setEditingSub((s) => s ? { ...s, brochureUrl: data.url } : s)
                    } catch (_) {}
                    e.target.value = ""
                  }} />
                  {editingSub.brochureUrl && <a href={editingSub.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#E63946] hover:underline">View</a>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="subActive" checked={editingSub.isActive} onChange={(e) => setEditingSub({ ...editingSub, isActive: e.target.checked })} className="rounded admin-border-light" />
              <label htmlFor="subActive" className="text-sm admin-text-primary">Active</label>
            </div>
            <Button onClick={saveSubService} disabled={subSaving} className="bg-[#E63946] hover:bg-[#d32f3d]">{subSaving ? "Saving…" : "Save Sub-Service"}</Button>
          </div>
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
          className="admin-text-secondary hover:admin-text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold admin-text-primary">{isNew ? "Create New Service" : "Edit Service"}</h1>
          <p className="admin-text-secondary">Fill in all the details for the service</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      {editingService && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title *</label>
                <Input
                  value={editingService.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Service title"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Slug *</label>
                <Input
                  value={editingService.slug}
                  onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="service-slug"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm admin-text-secondary mb-2">Service Icon</label>
                <ImageUpload
                  value={editingService.icon}
                  onChange={(url) => updateField("icon", url)}
                  maxSizeMB={1}
                  maxWidth={512}
                  maxHeight={512}
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Link Text</label>
                <Input
                  value={editingService.linkText}
                  onChange={(e) => updateField("linkText", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm admin-text-secondary mb-2">Short Description (for card)</label>
              <Textarea
                value={editingService.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
                rows={2}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm admin-text-secondary mb-2">Full Description (for detail page)</label>
              <p className="text-xs admin-text-muted mb-2">Use the toolbar for headings, lists, and bold/italic. Formatting will appear the same on the website.</p>
              <RichTextEditor
                value={editingService.fullDescription ?? ""}
                onChange={(html) => updateField("fullDescription", html)}
                placeholder="Write your service description with headings, lists, and paragraphs…"
                minHeight="240px"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Display Order</label>
                <Input
                  type="number"
                  value={editingService.displayOrder ?? 0}
                  onChange={(e) => updateField("displayOrder", Number(e.target.value) || 0)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="0"
                />
                <p className="text-xs admin-text-muted mt-1">Lower numbers appear first on /services</p>
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Portfolio URL</label>
                <Input
                  value={editingService.portfolioUrl ?? ""}
                  onChange={(e) => updateField("portfolioUrl", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="https://..."
                />
                <p className="text-xs admin-text-muted mt-1">Shows &quot;View Portfolio&quot; when set</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm admin-text-secondary mb-2">Brochure PDF</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Input
                    type="file"
                    accept="application/pdf"
                    className="admin-bg-tertiary admin-border-light admin-text-primary max-w-xs"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const form = new FormData()
                      form.append("file", file)
                      try {
                        const token = localStorage.getItem("adminToken")
                        const res = await fetch("/api/upload/file", { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form })
                        const data = await res.json()
                        if (data?.url) updateField("brochureUrl", data.url)
                      } catch (_) {}
                      e.target.value = ""
                    }}
                  />
                  {editingService.brochureUrl && (
                    <a href={editingService.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#E63946] hover:underline">View current</a>
                  )}
                </div>
                <p className="text-xs admin-text-muted mt-1">Shows &quot;Download Brochure&quot; when set</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={editingService.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="rounded admin-border-light"
              />
              <label htmlFor="isActive" className="text-sm admin-text-primary">
                Active (visible on website)
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="admin-card border admin-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Images</h2>
            <p className="text-sm admin-text-muted -mt-2">Use different images for the hero (top banner) and the content section below so the page doesn’t repeat the same image.</p>
            <ImageUpload
              label="Hero image (top banner on detail page)"
              value={editingService.heroImage ?? ""}
              onChange={(url) => updateField("heroImage", url)}
            />
            <ImageUpload
              label="Service / content image (section below hero)"
              value={editingService.image}
              onChange={(url) => updateField("image", url)}
            />
          </div>

          {/* Offerings */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Service Offerings</h2>
            <p className="text-sm admin-text-muted mb-3">Add offerings as tags. Type an offering (multiple words allowed) and press Enter to add.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {editingService.offerings.map((offering, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E63946]/10 border border-[#E63946]/30 text-foreground text-sm"
                >
                  {offering}
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "offerings",
                        editingService.offerings.filter((_, i) => i !== index),
                      )
                    }
                    className="p-0.5 rounded hover:bg-[#E63946]/20 text-muted-foreground hover:text-foreground"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="e.g. Brand strategy, Visual identity, Web design and development"
              className="admin-bg-tertiary admin-border-light admin-text-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  const input = e.currentTarget
                  const value = input.value.trim()
                  if (value) {
                    updateField("offerings", [...editingService.offerings, value])
                    input.value = ""
                  }
                }
              }}
              onBlur={(e) => {
                const value = e.target.value.trim()
                if (value) {
                  updateField("offerings", [...editingService.offerings, value])
                  e.target.value = ""
                }
              }}
            />
          </div>

          {/* Benefits */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Benefits Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title</label>
                <Input
                  value={editingService.benefits.title}
                  onChange={(e) => updateField("benefits", { ...editingService.benefits, title: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Description</label>
                <RichTextEditor
                  value={editingService.benefits.description ?? ""}
                  onChange={(html) => updateField("benefits", { ...editingService.benefits, description: html })}
                  placeholder="Benefits description (headings and lists supported)"
                  minHeight="120px"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Key Features</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title</label>
                <Input
                  value={editingService.features.title}
                  onChange={(e) => updateField("features", { ...editingService.features, title: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Feature Points (comma separated)</label>
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
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  rows={2}
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
                  updateField("process", [...editingService.process, { icon: "", title: "", description: "" }])
                }
                className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </Button>
            </div>
            <div className="space-y-4">
              {editingService.process.map((step, index) => (
                <div key={index} className="p-4 admin-bg-tertiary rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm admin-text-secondary">Step {index + 1}</span>
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
                      className="admin-card admin-border-light admin-text-primary"
                    />
                    <Input
                      value={step.icon}
                      onChange={(e) => {
                        const newProcess = [...editingService.process]
                        newProcess[index].icon = e.target.value
                        updateField("process", newProcess)
                      }}
                      placeholder="Icon name"
                      className="admin-card admin-border-light admin-text-primary"
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
                    className="admin-card admin-border-light admin-text-primary mt-2"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold admin-text-primary">FAQs</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateField("faqs", [...editingService.faqs, { question: "", answer: "" }])}
                className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Add FAQ
              </Button>
            </div>
            <div className="space-y-4">
              {editingService.faqs.map((faq, index) => (
                <div key={index} className="p-4 admin-bg-tertiary rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm admin-text-secondary">FAQ {index + 1}</span>
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
                    className="admin-card admin-border-light admin-text-primary mb-2"
                  />
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...editingService.faqs]
                      newFaqs[index].answer = e.target.value
                      updateField("faqs", newFaqs)
                    }}
                    placeholder="Answer"
                    className="admin-card admin-border-light admin-text-primary"
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
