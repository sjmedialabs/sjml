"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, CheckCircle2, Eye, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  defaultTemplate1PageData,
  defaultTemplate1SectionVisibility,
  normalizeTemplate1PageData,
  normalizeTemplate1SectionVisibility,
  type Template1PageData,
  type Template1SectionVisibility,
} from "@/components/template-1/default-data"
import { defaultLandingPageSeo, type LandingPageSeo } from "@/lib/landing-pages"
import { Template1SectionEditor } from "./template-1-section-editor"

const templateOptions = ["Template 1"] as const
const templateOnePageSections = 12

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface LandingPageFormProps {
  page?: {
    title: string
    route: string
    slug: string
    status: string
    sections: number
    template: string
    updated: string
    navigation?: string
    sectionData?: Template1PageData
    enabledSections?: Template1SectionVisibility
    seoData?: LandingPageSeo
  }
  onCancel: () => void
  onAction: (message: string) => void
  onSaved: (page: {
    title: string
    route: string
    slug: string
    status: string
    sections: number
    template: string
    updated: string
    navigation?: string
    sectionData: Template1PageData
    enabledSections: Template1SectionVisibility
    seoData: LandingPageSeo
  }) => void
}

export function LandingPageForm({ page, onCancel, onAction, onSaved }: LandingPageFormProps) {
  const [template, setTemplate] = useState(page?.template ?? templateOptions[0])
  const [title, setTitle] = useState(page?.title ?? "")
  const [slug, setSlug] = useState(page?.slug ?? "")
  const [slugEdited, setSlugEdited] = useState(Boolean(page))
  const [navigation, setNavigation] = useState(page?.navigation ?? "")
  const [sectionData, setSectionData] = useState(() =>
    normalizeTemplate1PageData(page?.sectionData ?? defaultTemplate1PageData),
  )
  const [enabledSections, setEnabledSections] = useState(() =>
    normalizeTemplate1SectionVisibility(
      page?.enabledSections ?? defaultTemplate1SectionVisibility,
    ),
  )
  const [seoData, setSeoData] = useState<LandingPageSeo>({
    ...defaultLandingPageSeo,
    ...page?.seoData,
  })
  const initialValues = useRef({
    template,
    title,
    slug,
    navigation,
    sectionData,
    enabledSections,
    seoData,
  })
  const hasChanges =
    JSON.stringify({
      template,
      title,
      slug,
      navigation,
      sectionData,
      enabledSections,
      seoData,
    }) !== JSON.stringify(initialValues.current)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (hasChanges) setIsSaved(false)
  }, [hasChanges])

  async function createPage() {
    if (isSaving || (page && !hasChanges)) return
    setIsSaving(true)
    setIsSaved(false)
    setErrorMessage("")

    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("Your admin session has expired. Please sign in again.")
      }

      const response = await fetch(
        page
          ? `/api/landing-pages/${encodeURIComponent(page.slug)}`
          : "/api/landing-pages",
        {
          method: page ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            slug,
            navigation,
            template,
            sectionData,
            enabledSections,
            seoData,
          }),
        },
      )
      const result: unknown = await response.json()
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : page
              ? "Failed to update page"
              : "Failed to create page"
        throw new Error(message)
      }

      if (
        typeof result !== "object" ||
        result === null ||
        !("title" in result) ||
        !("route" in result) ||
        !("slug" in result) ||
        !("status" in result) ||
        !("sections" in result) ||
        !("template" in result) ||
        !("updated" in result) ||
        typeof result.title !== "string" ||
        typeof result.route !== "string" ||
        typeof result.slug !== "string" ||
        typeof result.status !== "string" ||
        typeof result.sections !== "number" ||
        typeof result.template !== "string" ||
        typeof result.updated !== "string"
      ) {
        throw new Error("The server returned an invalid page")
      }

      initialValues.current = {
        template,
        title,
        slug,
        navigation,
        sectionData,
        enabledSections,
        seoData,
      }
      setIsSaved(true)
      onAction(page ? "Landing page saved successfully" : "Landing page created successfully")

      onSaved({
        title: result.title,
        route: result.route,
        slug: result.slug,
        status: result.status,
        sections: result.sections,
        template: result.template,
        updated: result.updated,
        navigation,
        sectionData,
        enabledSections,
        seoData,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create page"
      setErrorMessage(message)
      onAction(`❌ ${message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const pageDetails = (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          Page Title
        </label>
        <Input
          className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
          onChange={(event) => {
            setTitle(event.target.value)
            if (!slugEdited) setSlug(toSlug(event.target.value))
          }}
          placeholder="e.g. Performance Marketing Agency"
          required
          value={title}
        />
      </div>
      <div>
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          URL Slug
        </label>
        <Input
          className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary font-mono"
          onChange={(event) => {
            setSlugEdited(true)
            setSlug(toSlug(event.target.value))
          }}
          placeholder="auto-generated from title"
          required
          value={slug}
        />
        <span className="mt-1.5 block text-xs admin-text-muted">
          Route preview: /{slug || "page-slug"}
        </span>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          Select Template
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templateOptions.map((option) => (
            <div className="relative" key={option}>
              <input
                checked={template === option}
                className="peer sr-only"
                id={`landing-page-template-${option}`}
                name="landing-page-template"
                onChange={() => setTemplate(option)}
                type="radio"
                value={option}
              />
              <label
                className={`flex min-h-24 cursor-pointer flex-col justify-between rounded-xl border p-4 pr-12 transition-all ${
                  template === option
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "admin-border admin-card hover:border-black/20"
                }`}
                htmlFor={`landing-page-template-${option}`}
              >
                <span className="text-base font-semibold admin-text-primary">{option}</span>
                <span className="mt-2 text-xs admin-text-secondary">
                  {option === "Template 1"
                    ? `${templateOnePageSections} editable page sections`
                    : "Page template"}
                </span>
              </label>
              <button
                aria-label={`Preview ${option}`}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border admin-border admin-bg-secondary admin-text-secondary transition-colors hover:text-primary hover:border-primary"
                onClick={() => {
                  window.open("/template-1?preview=1", "_blank", "noopener,noreferrer")
                  onAction("Opening template preview")
                }}
                title={`Preview ${option}`}
                type="button"
              >
                <Eye aria-hidden="true" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {/* Top Header */}
      <div className="mb-8 flex justify-between items-start gap-4 flex-wrap">
        <div>
          <button
            onClick={onCancel}
            type="button"
            className="text-sm admin-text-secondary hover:admin-text-primary transition-colors mb-2 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Landing Pages
          </button>
          <h1 className="text-2xl font-bold admin-text-primary mb-2">
            {page ? `Edit: ${page.title}` : "Create New Landing Page"}
          </h1>
          <p className="admin-text-secondary">
            {page
              ? "Manage the selected template sections, content overrides, and SEO configuration."
              : "Enter basic details to create a page. You can customize its sections afterward."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onAction("Page editing cancelled")
              onCancel()
            }}
            className="admin-border-light admin-text-secondary hover:admin-bg-secondary bg-transparent"
            type="button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isSaving || (Boolean(page) && !hasChanges)}
            onClick={() => void createPage()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            type="button"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                {page ? "Saving..." : "Creating..."}
              </>
            ) : page ? (
              "Save Changes"
            ) : (
              "Create Page"
            )}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {isSaved && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          Landing page changes saved successfully!
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Main Content */}
      {page && template === "Template 1" ? (
        <div className="w-full space-y-6">
          {/* Collapsible/Editable basic settings */}
          <div className="w-full admin-card border admin-border rounded-xl p-6">
            <h2 className="text-lg font-semibold admin-text-primary mb-4">Page Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">
                  Page Title
                </label>
                <Input
                  className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Page title"
                  required
                  value={title}
                />
              </div>
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">
                  URL Route
                </label>
                <div className="flex gap-2">
                  <Input
                    className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary font-mono"
                    onChange={(event) => setSlug(toSlug(event.target.value))}
                    placeholder="slug"
                    required
                    value={slug}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="admin-border-light admin-text-secondary hover:admin-bg-secondary h-11 px-3 text-xs bg-transparent shrink-0"
                  >
                    <a href={`/${slug}?preview=1`} target="_blank" rel="noreferrer">
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </a>
                  </Button>
                </div>
                <span className="mt-1.5 block text-xs admin-text-muted">
                  Full route: /{slug}
                </span>
              </div>
            </div>
          </div>

          {/* Section-by-section Editor */}
          <Template1SectionEditor
            data={sectionData}
            onChange={setSectionData}
            enabledSections={enabledSections}
            onEnabledSectionsChange={setEnabledSections}
            seoData={seoData}
            onSeoChange={setSeoData}
            onAction={onAction}
          />
        </div>
      ) : page ? (
        <div className="admin-card border admin-border rounded-xl p-6 text-sm admin-text-muted">
          No section editor is available for this template.
        </div>
      ) : (
        <div className="admin-card border admin-border rounded-xl p-6">
          <h2 className="text-lg font-semibold admin-text-primary mb-4">Page Details</h2>
          {pageDetails}
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t admin-border">
        <p className="text-sm admin-text-secondary">
          {page
            ? `Configure the ${template} sections and SEO metadata above.`
            : `Your page will be created using ${template} (${templateOnePageSections} editable sections).`}
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onAction("Page editing cancelled")
              onCancel()
            }}
            className="admin-border-light admin-text-secondary hover:admin-bg-secondary bg-transparent"
            type="button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isSaving || (Boolean(page) && !hasChanges)}
            onClick={() => void createPage()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            type="button"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                {page ? "Saving..." : "Creating..."}
              </>
            ) : page ? (
              "Save Changes"
            ) : (
              "Create Page"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
