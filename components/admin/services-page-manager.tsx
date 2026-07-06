"use client"

import { AdminToast } from "./admin-toast"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowLeft, X } from "lucide-react"
import { ServiceSectionsEditor } from "./service-sections-editor"
import {
  createEmptySections,
  createDefaultPageLayout,
  createDefaultSubServicePageLayout,
  normalizeServiceSections,
  normalizeSubServiceSections,
  normalizeServicePageLayout,
  normalizeSubServicePageLayout,
  PARENT_SERVICE_SECTION_HINTS,
  SUB_SERVICE_SECTION_HINTS,
  type ServiceContentSection,
  type ServicePageLayout,
  type SubServicePageLayout,
} from "@/lib/service-sections"
import { SectionEnableToggle } from "./section-enable-toggle"
import {
  createDefaultServicesPageContent,
  normalizeServicesPageContent,
  type NormalizedServicesPageContent,
} from "@/lib/services-page-content"
import {
  createDefaultServiceDetailTemplate,
  normalizeServiceDetailTemplate,
  type ServiceDetailTemplate,
} from "@/lib/service-detail-template"
import { ServicesOverviewEditor } from "./services-overview-editor"
import { ServiceDetailTemplateEditor } from "./service-detail-template-editor"
import { CompactSelect } from "./admin-compact-fields"
import { SERVICE_ICON_OPTIONS, ServiceCardIconDisplay } from "@/components/services/service-card-icons"
import { sortByDisplayOrder } from "@/lib/service-order"
import { normalizeSubServiceMeta, syncSubServiceImages } from "@/lib/sub-service-document"

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
  sections: ServiceContentSection[]
  pageLayout: ServicePageLayout
  detailTemplate: ServiceDetailTemplate
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
  icon: "branding",
  linkText: "EXPLORE SERVICES",
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
  sections: createEmptySections(),
  pageLayout: createDefaultPageLayout(),
  detailTemplate: createDefaultServiceDetailTemplate(),
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
  metaTitle: string
  metaDescription: string
  portfolioUrl: string
  brochureUrl: string
  displayOrder: number
  isActive: boolean
  sections: ServiceContentSection[]
  pageLayout: SubServicePageLayout
  detailTemplate: ServiceDetailTemplate
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
  const [pageContent, setPageContent] = useState<NormalizedServicesPageContent>(createDefaultServicesPageContent())
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

  useEffect(() => {
    if (subView === "edit" && allServicesForParent.length === 0) {
      fetch("/api/services?all=true")
        .then((r) => r.ok && r.json())
        .then((arr) => setAllServicesForParent(Array.isArray(arr) ? arr : []))
    }
  }, [subView, allServicesForParent.length])

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
      const meta = normalizeSubServiceMeta(editingSub as unknown as Record<string, unknown>, editingSub.name)
      const payload = syncSubServiceImages({
        ...editingSub,
        metaTitle: editingSub.metaTitle?.trim() || meta.metaTitle,
        metaDescription: editingSub.metaDescription?.trim() || meta.metaDescription,
      })
      const url = subIsNew ? "/api/sub-services" : `/api/sub-services/${editingSub.id}`
      const method = subIsNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
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
    setActiveTab("sub-services")
    setEditingSub({
      id: "",
      parentSlug: subParentFilter || (allServicesForParent[0]?.slug ?? ""),
      slug: "",
      name: "",
      bannerImage: "",
      shortDescription: "",
      fullDescription: "",
      metaTitle: "",
      metaDescription: "",
      portfolioUrl: "",
      brochureUrl: "",
      displayOrder: 0,
      isActive: true,
      sections: createEmptySections(),
      pageLayout: createDefaultSubServicePageLayout(),
      detailTemplate: createDefaultServiceDetailTemplate(),
    })
    setSubIsNew(true)
    setSubView("edit")
  }

  const editSubService = (sub: SubServiceItem) => {
    setActiveTab("sub-services")
    const parentTitle = getParentServiceTitle(sub.parentSlug)
    setEditingSub({
      ...sub,
      metaTitle: (sub as SubServiceItem & { metaTitle?: string }).metaTitle ?? sub.name ?? "",
      metaDescription: (sub as SubServiceItem & { metaDescription?: string }).metaDescription ?? sub.shortDescription ?? "",
      sections: normalizeSubServiceSections(sub as unknown as Record<string, unknown>),
      pageLayout: normalizeSubServicePageLayout(sub as unknown as Record<string, unknown>),
      detailTemplate: normalizeServiceDetailTemplate(
        sub as unknown as Record<string, unknown>,
        sub.name,
        parentTitle,
      ),
    })
    setSubIsNew(false)
    setSubView("edit")
  }

  const fetchPageContent = async () => {
    try {
      const res = await fetch("/api/content/services")
      if (res.ok) {
        const data = await res.json()
        setPageContent(normalizeServicesPageContent(data))
      }
    } catch (error) {
      console.error("Failed to fetch page content")
    }
  }

  const savePageContent = async () => {
    setPageContentSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageKey: "services",
          servicesPage: pageContent,
          hero: {
            title: `${pageContent.hero.titleLine1} ${pageContent.hero.titleHighlight}`,
            description: pageContent.hero.description,
            image: pageContent.hero.image,
            backgroundImage: pageContent.hero.image,
            label: pageContent.hero.label,
            titleLine1: pageContent.hero.titleLine1,
            titleHighlight: pageContent.hero.titleHighlight,
          },
          cta: pageContent.cta,
          typography: pageContent.typography,
        }),
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

  const toggleServiceActive = async (service: ServiceItem) => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...service, isActive: !service.isActive }),
      })
      if (res.ok) {
        setMessage(service.isActive ? "Service disabled." : "Service enabled.")
        setTimeout(() => setMessage(""), 3000)
        fetchServices()
      } else {
        setMessage("Failed to update service status")
      }
    } catch {
      setMessage("Failed to update service status")
    }
  }

  const getParentServiceTitle = (parentSlug: string) =>
    allServicesForParent.find((s) => s.slug === parentSlug)?.title || parentSlug

  const addNewService = () => {
    setEditingService({ ...emptyService, id: "" } as ServiceItem)
    setIsNew(true)
    setView("edit")
  }

  const seedDefaultServices = async () => {
    if (!confirm("Load the 8 default services from the mockup? Existing slugs will be skipped.")) return
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/services/seed-defaults", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessage(`Loaded ${data.inserted} services (${data.skipped} skipped — already exist).`)
        setTimeout(() => setMessage(""), 4000)
        fetchServices()
      } else {
        setMessage("Failed to load default services")
      }
    } catch {
      setMessage("Failed to load default services")
    }
  }

  const editService = (service: ServiceItem) => {
    setEditingService({
      ...service,
      sections: normalizeServiceSections(service as unknown as Record<string, unknown>),
      pageLayout: normalizeServicePageLayout(service as unknown as Record<string, unknown>),
      detailTemplate: normalizeServiceDetailTemplate(
        service as unknown as Record<string, unknown>,
        service.title,
        service.title,
      ),
    })
    setIsNew(false)
    setView("edit")
  }

  const updateField = (field: string, value: any) => {
    if (!editingService) return
    setEditingService({ ...editingService, [field]: value })
  }

  const updatePageLayout = (updates: Partial<ServicePageLayout>) => {
    if (!editingService) return
    setEditingService({
      ...editingService,
      pageLayout: { ...editingService.pageLayout, ...updates },
    })
  }

  const updateSubPageLayout = (updates: Partial<SubServicePageLayout>) => {
    if (!editingSub) return
    setEditingSub({
      ...editingSub,
      pageLayout: { ...editingSub.pageLayout, ...updates },
    })
  }

  const filteredServices = sortByDisplayOrder(
    services.filter(
      (s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
    (a, b) => a.title.localeCompare(b.title),
  )

  const cancelSubServiceEdit = () => {
    setSubView("list")
    setEditingSub(null)
    setSubIsNew(false)
  }

  // Sub-Service Edit View
  if (subView === "edit" && editingSub) {
    return (
      <div>
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={cancelSubServiceEdit}
            className="admin-text-secondary hover:admin-text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold admin-text-primary">{subIsNew ? "Add Sub-Service" : "Edit Sub-Service"}</h1>
            <p className="admin-text-secondary">Fill in all the details for the sub-service</p>
          </div>
        </div>

        <AdminToast message={message} onClose={() => setMessage("")} />

        <div className="space-y-6 admin-card border admin-border rounded-xl p-6">
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Meta title (browser tab / SEO)</label>
              <Input
                value={editingSub.metaTitle}
                onChange={(e) => setEditingSub({ ...editingSub, metaTitle: e.target.value })}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
                placeholder={editingSub.name || "Logo Design | SJ Media Labs"}
              />
            </div>
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Meta description (SEO)</label>
              <Input
                value={editingSub.metaDescription}
                onChange={(e) => setEditingSub({ ...editingSub, metaDescription: e.target.value })}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
                placeholder={editingSub.shortDescription || "Short description for search results"}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Banner Image</label>
            <ImageUpload
              value={editingSub.bannerImage}
              onChange={(url) =>
                setEditingSub({
                  ...editingSub,
                  bannerImage: url,
                  detailTemplate: { ...editingSub.detailTemplate, introImage: url },
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Short Description</label>
            <Textarea value={editingSub.shortDescription} onChange={(e) => setEditingSub({ ...editingSub, shortDescription: e.target.value })} className="admin-bg-tertiary admin-border-light admin-text-primary" rows={2} />
          </div>
          <ServiceDetailTemplateEditor
            template={editingSub.detailTemplate}
            onChange={(detailTemplate) =>
              setEditingSub({
                ...editingSub,
                detailTemplate,
                bannerImage: detailTemplate.introImage?.trim() || editingSub.bannerImage,
              })
            }
          />

          {/* Section 5: Gallery images */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold admin-text-primary">Section 5: Images</h2>
                <p className="text-sm admin-text-muted mt-1">Gallery grid shown after content sections.</p>
              </div>
              <div className="flex items-center gap-3">
                <SectionEnableToggle
                  id="sub-gallery-enabled"
                  enabled={editingSub.pageLayout.galleryEnabled}
                  onChange={(enabled) => updateSubPageLayout({ galleryEnabled: enabled })}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateSubPageLayout({
                      galleryImages: [...editingSub.pageLayout.galleryImages, ""],
                    })
                  }
                  className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editingSub.pageLayout.galleryImages.map((img, index) => (
                <div key={index} className="relative">
                  <ImageUpload
                    label={`Image ${index + 1}`}
                    value={img}
                    onChange={(url) => {
                      const next = [...editingSub.pageLayout.galleryImages]
                      next[index] = url
                      updateSubPageLayout({ galleryImages: next })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateSubPageLayout({
                        galleryImages: editingSub.pageLayout.galleryImages.filter((_, i) => i !== index),
                      })
                    }
                    className="absolute top-0 right-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Discover more */}
          <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold admin-text-primary">Section 6: Discover More</h2>
                <p className="text-sm admin-text-muted mt-1">
                  Active parent services appear as clickable pills automatically on the website.
                </p>
              </div>
              <SectionEnableToggle
                id="sub-discover-enabled"
                enabled={editingSub.pageLayout.discoverEnabled}
                onChange={(enabled) => updateSubPageLayout({ discoverEnabled: enabled })}
              />
            </div>
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Section title</label>
              <Input
                value={editingSub.pageLayout.discoverTitle}
                onChange={(e) => updateSubPageLayout({ discoverTitle: e.target.value })}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
                placeholder="Discover more about SJ Media Labs"
              />
            </div>
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Section subtitle</label>
              <Input
                value={editingSub.pageLayout.discoverSubtitle}
                onChange={(e) => updateSubPageLayout({ discoverSubtitle: e.target.value })}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
                placeholder="Optional subtitle"
              />
            </div>
          </div>

          {/* Section 7: Thumbnail images */}
          <div className="admin-card border admin-border rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold admin-text-primary">Section 7: Images</h2>
                <p className="text-sm admin-text-muted mt-1">Shown as 100×100 px thumbnails on the website.</p>
              </div>
              <div className="flex items-center gap-3">
                <SectionEnableToggle
                  id="sub-bottom-images-enabled"
                  enabled={editingSub.pageLayout.bottomImagesEnabled}
                  onChange={(enabled) => updateSubPageLayout({ bottomImagesEnabled: enabled })}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateSubPageLayout({
                      bottomThumbnailImages: [...editingSub.pageLayout.bottomThumbnailImages, ""],
                    })
                  }
                  className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Thumbnail
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {editingSub.pageLayout.bottomThumbnailImages.map((img, index) => (
                <div key={index} className="relative">
                  <ImageUpload
                    label={`Thumbnail ${index + 1}`}
                    value={img}
                    onChange={(url) => {
                      const next = [...editingSub.pageLayout.bottomThumbnailImages]
                      next[index] = url
                      updateSubPageLayout({ bottomThumbnailImages: next })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateSubPageLayout({
                        bottomThumbnailImages: editingSub.pageLayout.bottomThumbnailImages.filter((_, i) => i !== index),
                      })
                    }
                    className="absolute top-0 right-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
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
                {editingSub.brochureUrl && <a href={editingSub.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View</a>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="subActive" checked={editingSub.isActive} onChange={(e) => setEditingSub({ ...editingSub, isActive: e.target.checked })} className="rounded admin-border-light" />
            <label htmlFor="subActive" className="text-sm admin-text-primary">Active</label>
          </div>
          <div className="flex gap-4">
            <Button onClick={saveSubService} disabled={subSaving}>{subSaving ? "Saving…" : subIsNew ? "Create Sub-Service" : "Save Sub-Service"}</Button>
            <Button variant="outline" onClick={cancelSubServiceEdit} className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent">Cancel</Button>
          </div>
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
            <h1 className="text-2xl font-bold admin-text-primary mb-2">Services Management</h1>
            <p className="admin-text-secondary">Manage services page content and individual services</p>
          </div>
          {activeTab === "services" && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={seedDefaultServices}>
                Load Default Services
              </Button>
              <Button onClick={addNewService}>
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>
          )}
          {activeTab === "sub-services" && (
            <Button onClick={addNewSubService}>
              <Plus className="w-4 h-4 mr-2" /> Add Sub-Service
            </Button>
          )}
          {activeTab === "page-content" && (
            <Button onClick={savePageContent} disabled={pageContentSaving}>
              {pageContentSaving ? 'Saving...' : 'Save Page Content'}
            </Button>
          )}
        </div>

        <AdminToast message={message} onClose={() => setMessage("")} />

        {/* Tabs */}
        <div className="flex gap-2 border-b admin-border pb-4 mb-6">
          <button
            onClick={() => setActiveTab('page-content')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'page-content' ? 'bg-primary text-primary-foreground' : 'admin-bg-secondary admin-text-secondary hover:admin-text-primary'}`}
          >
            Page Content
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-primary text-primary-foreground' : 'admin-bg-secondary admin-text-secondary hover:admin-text-primary'}`}
          >
            Services List
          </button>
          <button
            onClick={() => setActiveTab('sub-services')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'sub-services' ? 'bg-primary text-primary-foreground' : 'admin-bg-secondary admin-text-secondary hover:admin-text-primary'}`}
          >
            Sub-Services
          </button>
        </div>

        {/* Page Content Tab */}
        {activeTab === 'page-content' && (
          <ServicesOverviewEditor content={pageContent} onChange={setPageContent} />
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
                <th className="text-left p-4 admin-text-secondary font-medium w-16">Order</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Service</th>
                <th className="text-left p-4 admin-text-secondary font-medium">Slug</th>
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
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center admin-text-muted">
                    No services found
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="border-b admin-border hover:admin-bg-secondary">
                    <td className="p-4 admin-text-secondary tabular-nums">{service.displayOrder ?? "—"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 admin-bg-secondary rounded-lg flex items-center justify-center overflow-hidden p-1.5">
                          {service.icon ? (
                            service.icon.startsWith("/") || service.icon.startsWith("http") ? (
                              <Image
                                src={service.icon}
                                alt={service.title}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            ) : (
                              <ServiceCardIconDisplay icon={service.icon} index={0} />
                            )
                          ) : (
                            <span className="text-primary text-xs">?</span>
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
                          onClick={() => toggleServiceActive(service)}
                          className={service.isActive ? "text-amber-400 hover:text-amber-300" : "text-green-400 hover:text-green-300"}
                        >
                          {service.isActive ? "Disable" : "Enable"}
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
        {activeTab === "sub-services" && (
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
                    <tr><td colSpan={6} className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></td></tr>
                  ) : subServices.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center admin-text-muted">No sub-services found</td></tr>
                  ) : (
                    subServices.map((sub) => (
                      <tr key={sub.id} className="border-b admin-border hover:admin-bg-secondary">
                        <td className="p-4 admin-text-secondary">
                          <div className="admin-text-primary font-medium">{getParentServiceTitle(sub.parentSlug)}</div>
                          <div className="admin-text-muted text-xs">{sub.parentSlug}</div>
                        </td>
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

      <AdminToast message={message} onClose={() => setMessage("")} />

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
              <div>
                <CompactSelect
                  label="Icon preset"
                  value={
                    editingService.icon.startsWith("/") || editingService.icon.startsWith("http")
                      ? ""
                      : editingService.icon || "branding"
                  }
                  onChange={(v) => updateField("icon", v)}
                  options={[{ value: "", label: "Custom image below" }, ...SERVICE_ICON_OPTIONS]}
                />
                {editingService.icon &&
                  !editingService.icon.startsWith("/") &&
                  !editingService.icon.startsWith("http") && (
                    <div className="mt-2 w-10 h-10 p-1.5 admin-bg-secondary rounded-lg">
                      <ServiceCardIconDisplay icon={editingService.icon} index={0} />
                    </div>
                  )}
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Custom icon image (optional)</label>
                <ImageUpload
                  value={
                    editingService.icon.startsWith("/") || editingService.icon.startsWith("http")
                      ? editingService.icon
                      : ""
                  }
                  onChange={(url) => updateField("icon", url || editingService.icon || "branding")}
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
                    <a href={editingService.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View current</a>
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

          <ServiceDetailTemplateEditor
            template={editingService.detailTemplate}
            onChange={(detailTemplate) => setEditingService({ ...editingService, detailTemplate })}
          />

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={saveService}
              disabled={saving || !editingService.title || !editingService.slug}
             
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
