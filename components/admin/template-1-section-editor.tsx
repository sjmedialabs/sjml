"use client"

import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import { RichTextEditor } from "./rich-text-editor"
import {
  landingProjectFromWork,
  type Template1PageData,
  type Template1SecondaryWorkItem,
  type Template1SectionVisibility,
} from "@/components/template-1/default-data"
import { normalizeWorkGridItem, type WorkGridItem } from "@/lib/work-grid-item"
import { validatePhoneTextWithCountryCode } from "@/components/template-1/form-validation"
import type { LandingPageSeo } from "@/lib/landing-pages"
import {
  resolveImageSpec,
  type ImageUploadSpec,
} from "@/lib/admin-media-specs"

interface Template1SectionEditorProps {
  data: Template1PageData
  onChange: (data: Template1PageData) => void
  enabledSections: Template1SectionVisibility
  onEnabledSectionsChange: (enabledSections: Template1SectionVisibility) => void
  seoData: LandingPageSeo
  onSeoChange: (data: LandingPageSeo) => void
  onAction: (message: string) => void
}

const sectionLabels: Record<keyof Template1PageData, string> = {
  header: "Header",
  hero: "Hero",
  experience: "Experience",
  challenge: "Challenge",
  services: "Services",
  work: "Work",
  whySjml: "Why SJML",
  process: "Process",
  clients: "Clients",
  faq: "FAQ",
  cta: "CTA",
  footer: "Footer",
}

const twoColumnSections = new Set([
  "challenge",
  "services",
  "whySjml",
  "process",
  "clients",
  "faq",
])

const lockedHeroFormFieldKeys = new Set([
  "fullNameLabel",
  "fullNamePlaceholder",
  "emailLabel",
  "emailPlaceholder",
  "phoneLabel",
  "phonePlaceholder",
  "messageLabel",
  "messagePlaceholder",
  "privacyText",
  "privacyLinkText",
  "privacyLinkHref",
])

const hiddenHeaderFooterFieldKeys = new Set([
  "logoText",
  "taglineLine1",
  "taglineLine2",
  "phoneHref",
  "emailHref",
])

const hiddenFeaturedWorkFieldKeys = new Set([
  "challengeLabel",
  "challengeText",
  "approachLabel",
  "approachText",
  "evidenceLabel",
  "evidenceText",
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function formatLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase())
}

function limitDigits(text: string, maxDigits: number) {
  let digitCount = 0
  let result = ""
  for (const ch of text) {
    if (/\d/.test(ch)) {
      if (digitCount >= maxDigits) continue
      digitCount += 1
    }
    result += ch
  }
  return result
}

function sanitizePhoneTextInput(raw: string) {
  const cleaned = raw.replace(/[^\d+\s()-]/g, "")
  const hasLeadingPlus = cleaned.startsWith("+")
  const withoutPlus = cleaned.replace(/\+/g, "")

  if (hasLeadingPlus) {
    const withSeparator = withoutPlus.match(/^([1-9]\d{0,2})([\s()-]+)(.*)$/)
    if (withSeparator) {
      const [, countryCode, separator, rest] = withSeparator
      return `+${countryCode}${separator}${limitDigits(rest, 10)}`
    }
    if (withoutPlus.startsWith("91")) {
      return `+${limitDigits(withoutPlus, 12)}`
    }
    return `+${limitDigits(withoutPlus, 13)}`
  }

  return limitDigits(withoutPlus, 10)
}

function updateAtPath<T>(root: T, path: string[], value: unknown): T {
  const updated = structuredClone(root)
  let current: unknown = updated

  for (const part of path.slice(0, -1)) {
    if (Array.isArray(current)) {
      current = current[Number(part)]
    } else if (isRecord(current)) {
      current = current[part]
    } else {
      return root
    }
  }

  const finalPart = path[path.length - 1]
  if (Array.isArray(current)) {
    current[Number(finalPart)] = value
  } else if (isRecord(current)) {
    current[finalPart] = value
  }

  return updated
}

function getSectionImageSpec(path: string[]): ImageUploadSpec {
  const section = path[0]
  if (section === "header" || section === "footer") {
    return resolveImageSpec("logo")
  }
  if (section === "work" && path[1] === "featured") {
    return resolveImageSpec("caseStudy")
  }
  if (section === "whySjml") {
    return resolveImageSpec("cardWide", {
      recommendedWidth: 1280,
      recommendedHeight: 800,
      hint: "16:10 showcase image for the Why SJML section.",
    })
  }
  return resolveImageSpec("generic")
}

interface DeleteConfirmationRequest {
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
}

function SimpleImageUpload({
  label,
  value,
  spec = resolveImageSpec("generic"),
  onChange,
  onAction,
  onRequestDelete,
}: {
  label: string
  value: string
  spec?: ImageUploadSpec
  onChange: (value: string) => void
  onAction: (message: string) => void
  onRequestDelete: (request: DeleteConfirmationRequest) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      const message = "Choose an image file."
      setErrorMessage(message)
      onAction(`❌ ${message}`)
      return
    }
    if (file.size > spec.maxSizeMB * 1024 * 1024) {
      const message = `Image must be smaller than ${spec.maxSizeMB}MB.`
      setErrorMessage(message)
      onAction(`❌ ${message}`)
      return
    }

    setErrorMessage("")
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Server actions are rejected behind the reverse proxy (Host is rewritten to
      // localhost, so the origin check fails). The rest of the admin uploads through
      // this route, which is not subject to that check.
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result: { url?: unknown; error?: unknown } = await response
        .json()
        .catch(() => ({}))
      const url = typeof result.url === "string" ? result.url : ""
      if (!response.ok || !url) {
        const message =
          typeof result.error === "string" && result.error
            ? result.error
            : "Image upload failed."
        throw new Error(message)
      }
      onChange(url)
      onAction("Image uploaded successfully")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed."
      setErrorMessage(message)
      onAction(`❌ ${message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-w-0">
      <span className="mb-1.5 block text-sm text-[#525252]">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        {value && (
          <img
            alt={`${label} preview`}
            className="h-12 w-12 rounded border border-[#d1d5db] object-cover"
            src={value}
          />
        )}
        <input
          accept="image/*"
          className="sr-only"
          onChange={(event) => void handleFileChange(event)}
          ref={inputRef}
          type="file"
        />
        <button
          className="inline-flex min-h-10 items-center gap-2 rounded bg-[#eef3f8] px-4 py-2 text-sm font-medium text-[#526783] transition-colors hover:bg-[#e2eaf2] disabled:cursor-wait disabled:opacity-60"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Upload aria-hidden="true" size={16} />
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
        {value && (
          <span className="flex items-center gap-2 text-sm text-[#526783]">
            Image uploaded
            <ConfirmDeleteDialog
              trigger={
                <button
                  aria-label={`Remove ${label}`}
                  className="rounded p-1 text-[#526783] hover:bg-[#eef3f8]"
                  type="button"
                >
                  <X aria-hidden="true" size={16} />
                </button>
              }
              title={`Remove ${label.toLowerCase()}?`}
              description="This file will be removed from this content."
              confirmLabel="Remove"
              onConfirm={() => {
                onChange("")
                onAction(`${label} removed`)
              }}
            />
          </span>
        )}
      </div>
      {errorMessage && (
        <p aria-live="polite" className="mt-1.5 text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

function WorkProjectsPicker({
  projects,
  onChange,
  onAction,
  onRequestDelete,
}: {
  projects: Template1SecondaryWorkItem[]
  onChange: (projects: Template1SecondaryWorkItem[]) => void
  onAction: (message: string) => void
  onRequestDelete: (request: DeleteConfirmationRequest) => void
}) {
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([])
  const [works, setWorks] = useState<WorkGridItem[]>([])
  const [category, setCategory] = useState("")
  const [selectedWorkId, setSelectedWorkId] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadOptions() {
      try {
        const [categoryResponse, worksResponse] = await Promise.all([
          fetch("/api/content/work-page"),
          fetch("/api/works?all=true"),
        ])

        if (cancelled) return

        if (categoryResponse.ok) {
          const data = await categoryResponse.json()
          const options = Array.isArray(data.filterCategories)
            ? data.filterCategories
                .filter(
                  (item: { value?: string; label?: string }) =>
                    item?.value && item.value !== "all",
                )
                .map((item: { value: string; label?: string }) => ({
                  value: item.value,
                  label: item.label || item.value,
                }))
            : []
          setCategories(options)
        }

        if (worksResponse.ok) {
          const data = await worksResponse.json()
          const records = Array.isArray(data) ? data : []
          setWorks(
            records.map((work: Record<string, unknown>) => normalizeWorkGridItem(work)),
          )
        }
      } catch (error) {
        console.error("Failed to load landing page works:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadOptions()
    return () => {
      cancelled = true
    }
  }, [])

  const worksInCategory = category
    ? works.filter((work) => work.categories.includes(category))
    : []
  const selectedKeys = new Set(
    projects.flatMap((project) => [project.workId, project.slug, project.id].filter(Boolean)),
  )

  function addSelectedWork() {
    const work = worksInCategory.find((item) => item.id === selectedWorkId)
    if (!work) return
    if (selectedKeys.has(work.id) || selectedKeys.has(work.slug)) {
      onAction("This work is already in the list")
      return
    }
    onChange([...projects, landingProjectFromWork(work)])
    setSelectedWorkId("")
    onAction("Project added")
  }

  const selectClassName =
    "w-full h-10 px-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary bg-transparent"

  return (
    <div className="min-w-0 space-y-4 md:col-span-2">
      <div className="rounded-xl border admin-border admin-card p-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold admin-text-primary">Add a project</h4>
          <p className="text-xs admin-text-secondary mt-0.5">
            Choose a category, then a work from that category. The selected work appears in this section.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-1.5">
              Category
            </label>
            <select
              className={selectClassName}
              value={category}
              disabled={isLoading}
              onChange={(event) => {
                setCategory(event.target.value)
                setSelectedWorkId("")
              }}
            >
              <option value="">{isLoading ? "Loading categories..." : "Select a category"}</option>
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-1.5">
              Work
            </label>
            <select
              className={selectClassName}
              value={selectedWorkId}
              disabled={!category || isLoading}
              onChange={(event) => setSelectedWorkId(event.target.value)}
            >
              <option value="">
                {!category
                  ? "Select a category first"
                  : worksInCategory.length === 0
                    ? "No works in this category"
                    : "Select a work"}
              </option>
              {worksInCategory.map((work) => (
                <option key={work.id} value={work.id} disabled={selectedKeys.has(work.id) || selectedKeys.has(work.slug)}>
                  {work.title}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="admin-border-light admin-text-primary hover:admin-bg-secondary bg-transparent h-10"
            disabled={!selectedWorkId}
            onClick={addSelectedWork}
            type="button"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Project
          </Button>
        </div>
      </div>

      <h4 className="text-sm font-semibold admin-text-primary">
        Projects ({projects.length})
      </h4>

      {projects.length === 0 ? (
        <p className="text-sm admin-text-secondary">No projects selected yet.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div
              key={project.id || project.slug || index}
              className="flex items-center gap-3 rounded-xl border admin-border admin-card p-3"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-[#F3F2EE]">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium admin-text-primary truncate">
                  {project.title || "Untitled work"}
                </p>
                <p className="text-xs admin-text-secondary truncate">
                  {project.category || "No category"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-8 w-8 p-0 shrink-0"
                onClick={() => {
                  const projectTitle = project.title?.trim()
                    ? `"${project.title.trim()}"`
                    : `Project ${index + 1}`
                  onRequestDelete({
                    title: "Delete Project?",
                    description: `Are you sure you want to remove ${projectTitle} from this section?`,
                    onConfirm: () => {
                      onChange(projects.filter((_, projectIndex) => projectIndex !== index))
                      onAction("Project removed")
                    },
                  })
                }}
                title="Remove project"
                aria-label="Remove project"
                type="button"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionFields({
  value,
  path,
  onChange,
  onAction,
  onRequestDelete,
  cmsFooterAddress,
}: {
  value: unknown
  path: string[]
  onChange: (path: string[], value: unknown) => void
  onAction: (message: string) => void
  onRequestDelete: (request: DeleteConfirmationRequest) => void
  cmsFooterAddress?: string
}) {
  const newlyAddedItemRef = useRef<HTMLFieldSetElement | null>(null)
  const pendingScrollIndex = useRef<number | null>(null)

  useEffect(() => {
    if (pendingScrollIndex.current === null || !newlyAddedItemRef.current) return

    newlyAddedItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    newlyAddedItemRef.current
      .querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")
      ?.focus({ preventScroll: true })
    pendingScrollIndex.current = null
  }, [value])

  if (typeof value === "string") {
    const fieldName = path[path.length - 1] ?? ""
    if (fieldName === "narrativeHtml" || fieldName.endsWith("Html")) {
      return (
        <div className="min-w-0 md:col-span-2">
          <RichTextEditor
            label={formatLabel(fieldName.replace(/Html$/, ""))}
            description="Format the narrative with rich text (bolding, lists, headings, and paragraph structure)."
            value={value}
            onChange={(html) => onChange(path, html)}
          />
        </div>
      )
    }

    const isImageField = /(?:image|logo|photo|icon)(?:url)?$/i.test(fieldName)
    const displayFieldName =
      path[0] === "hero" && path.length === 2
        ? fieldName === "formOverline"
          ? "Form Overline"
          : fieldName === "formTitle"
            ? "Form Title"
            : fieldName === "submitButtonText"
              ? "Form Submit Button Text"
              : fieldName.replace(/Label$/, "").replace(/Placeholder$/, "")
        : fieldName
    const label = /href$/i.test(displayFieldName)
      ? `${formatLabel(displayFieldName.replace(/href$/i, ""))} Redirection URL`.trim()
      : formatLabel(displayFieldName)
    if (isImageField) {
      return (
        <SimpleImageUpload
          label={label}
          spec={getSectionImageSpec(path)}
          onChange={(url) => onChange(path, url)}
          onAction={onAction}
          onRequestDelete={onRequestDelete}
          value={value}
        />
      )
    }

    const isPhoneField = fieldName === "phoneText"
    const isEmailField = fieldName === "emailText"
    const isFooterAddressField = path[0] === "footer" && fieldName === "addressText"
    const phoneValidationError = isPhoneField
      ? validatePhoneTextWithCountryCode(value)
      : null
    const resolvedDisplayValue =
      isFooterAddressField &&
      cmsFooterAddress &&
      (!value.trim() || value.trim() === "Hyderabad, Telangana, India")
        ? cmsFooterAddress
        : value
    const inputClassName =
      "w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
    const isLongText =
      isFooterAddressField ||
      (!isPhoneField &&
        !isEmailField &&
        (resolvedDisplayValue.length > 60 || resolvedDisplayValue.includes("\n")))
    const spansFullWidth =
      isLongText ||
      isFooterAddressField ||
      /description|answer|statement|subtitle/i.test(fieldName)
    const rows = Math.min(
      10,
      Math.max(
        isFooterAddressField ? 3 : 4,
        resolvedDisplayValue.split("\n").length,
        Math.ceil(resolvedDisplayValue.length / 60),
      ),
    )

    return (
      <div className={`block min-w-0 ${spansFullWidth ? "sm:col-span-2 md:col-span-2" : ""}`}>
        <label className="block text-sm font-medium admin-text-secondary mb-1.5">{label}</label>
        {isLongText ? (
          <textarea
            className={`${inputClassName} ${isFooterAddressField ? "min-h-24" : "min-h-32"} resize-y`}
            onChange={(event) => onChange(path, event.target.value)}
            placeholder={
              isFooterAddressField ? cmsFooterAddress || "Enter full address" : undefined
            }
            rows={rows}
            value={resolvedDisplayValue}
          />
        ) : (
          <>
            <input
              aria-invalid={Boolean(phoneValidationError)}
              className={`${inputClassName}${
                phoneValidationError ? " border-red-500 focus:border-red-500" : ""
              }`}
              inputMode={isPhoneField ? "tel" : isEmailField ? "email" : undefined}
              onChange={(event) =>
                onChange(
                  path,
                  isPhoneField
                    ? sanitizePhoneTextInput(event.target.value)
                    : event.target.value,
                )
              }
              placeholder={
                isPhoneField
                  ? "+91 40 40268570"
                  : isEmailField
                    ? "info@sjmedialabs.com"
                    : undefined
              }
              type={isPhoneField ? "tel" : isEmailField ? "email" : "text"}
              value={resolvedDisplayValue}
            />
            {isPhoneField &&
              (phoneValidationError ? (
                <p aria-live="polite" className="mt-1.5 text-xs text-red-600">
                  {phoneValidationError}
                </p>
              ) : (
                <p className="mt-1.5 text-xs admin-text-muted">
                  Include country code + 10-digit number (e.g. +91 9876543210).
                </p>
              ))}
          </>
        )}
      </div>
    )
  }

  if (typeof value === "number") {
    const fieldName = path[path.length - 1] ?? ""
    if (fieldName === "headlineFontSize" || fieldName === "formTitleFontSize") {
      const isFormTitle = fieldName === "formTitleFontSize"
      const min = isFormTitle ? 14 : 20
      const max = isFormTitle ? 48 : 96
      const step = isFormTitle ? 1 : 2
      const sizes = []
      for (let size = min; size <= max; size += step) sizes.push(size)
      if (!sizes.includes(value)) sizes.push(value)
      sizes.sort((a, b) => a - b)
      return (
        <div className="block min-w-0">
          <label className="block text-sm font-medium admin-text-secondary mb-1.5">
            {isFormTitle ? "Form title size" : "Title size"}
          </label>
          <select
            className="w-full h-10 px-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary bg-transparent"
            value={value}
            onChange={(event) => onChange(path, Number(event.target.value))}
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
      )
    }
  }

  if (Array.isArray(value)) {
    const isClientsList = path[0] === "clients" && path[path.length - 1] === "clients"
    const isFaqList = path[0] === "faq" && path[path.length - 1] === "faqs"
    const isWorkProjectsList = path[0] === "work" && path[path.length - 1] === "projects"
    const isServicesList = path[0] === "services" && path[path.length - 1] === "services"

    if (isWorkProjectsList) {
      const projects = value.filter(isRecord).map((item) => item as unknown as Template1SecondaryWorkItem)
      return (
        <WorkProjectsPicker
          projects={projects}
          onChange={(next) => onChange(path, next)}
          onAction={onAction}
          onRequestDelete={onRequestDelete}
        />
      )
    }
    const isWhySjmlList = path[0] === "whySjml" && path[path.length - 1] === "points"
    const isProcessList = path[0] === "process" && path[path.length - 1] === "steps"

    return (
      <div className="min-w-0 space-y-4 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <h4 className="text-sm font-semibold admin-text-primary">
            {formatLabel(path[path.length - 1] ?? "")} ({value.length})
          </h4>
          {(isClientsList || isFaqList || isServicesList || isWhySjmlList || isProcessList) && (
            <Button
              variant="outline"
              size="sm"
              className="admin-border-light admin-text-primary hover:admin-bg-secondary bg-transparent"
              onClick={() => {
                pendingScrollIndex.current = value.length
                onChange(path, [
                  ...value,
                  isClientsList
                    ? { id: `client-${crypto.randomUUID()}`, name: "", logoUrl: "" }
                      : isFaqList
                      ? { id: `faq-${crypto.randomUUID()}`, question: "", answer: "" }
                      : isServicesList
                          ? {
                              id: `service-${crypto.randomUUID()}`,
                              number: String(value.length + 1).padStart(2, "0"),
                              title: "",
                              tags: "",
                              description: "",
                            }
                          : isWhySjmlList
                            ? {
                                id: `why-${crypto.randomUUID()}`,
                                number: String(value.length + 1).padStart(2, "0"),
                                title: "",
                                description: "",
                              }
                            : {
                                id: `step-${crypto.randomUUID()}`,
                                number: String(value.length + 1).padStart(2, "0"),
                                title: "",
                                description: "",
                              },
                ])
                onAction(
                  isClientsList
                    ? "Client added"
                    : isFaqList
                      ? "FAQ added"
                      : isServicesList
                          ? "Service added"
                          : isWhySjmlList
                            ? "Point added"
                            : "Step added",
                )
              }}
              type="button"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {isClientsList
                ? "Add Client"
                : isFaqList
                  ? "Add FAQ"
                  : isServicesList
                      ? "Add Service"
                      : isWhySjmlList
                        ? "Add Point"
                        : "Add Step"}
            </Button>
          )}
        </div>
        {value.map((item, index) => (
          <fieldset
            className="block min-w-0 rounded-xl border admin-border admin-card p-5 break-inside-avoid relative"
            key={index}
            ref={(element) => {
              if (index === pendingScrollIndex.current) {
                newlyAddedItemRef.current = element
              }
            }}
          >
            <legend className="px-2 text-xs font-semibold uppercase tracking-wider admin-text-secondary">
              {isClientsList
                ? `Client ${index + 1}`
                : isFaqList
                  ? `FAQ ${index + 1}`
                  : isServicesList
                      ? `Service ${index + 1}: ${(isRecord(item) && typeof item.title === "string" && item.title.replace(/\n/g, " ")) || `Service ${index + 1}`}`
                      : isWhySjmlList
                        ? `Point ${index + 1}: ${(isRecord(item) && typeof item.title === "string" && item.title) || `Point ${index + 1}`}`
                        : isProcessList
                          ? `Step ${index + 1}: ${(isRecord(item) && typeof item.title === "string" && item.title) || `Step ${index + 1}`}`
                          : `Item ${index + 1}`}
            </legend>
            {isClientsList && isRecord(item) ? (
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Client Name
                  </label>
                  <input
                    className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "name"], event.target.value)
                    }
                    placeholder="Client name"
                    value={typeof item.name === "string" ? item.name : ""}
                  />
                </div>
                <SimpleImageUpload
                  label="Logo"
                  onChange={(url) =>
                    onChange([...path, String(index), "logoUrl"], url)
                  }
                  onAction={onAction}
                  value={typeof item.logoUrl === "string" ? item.logoUrl : ""}
                />
                <div className="sm:col-span-2">
                  <ConfirmDeleteDialog
                    trigger={
                      <button
                        className="rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        type="button"
                      >
                        Delete client
                      </button>
                    }
                    title="Delete this client?"
                    description="This client will be removed from this section."
                    onConfirm={() => {
                      onChange(
                        path,
                        value.filter((_, clientIndex) => clientIndex !== index),
                      )
                      onAction("Client deleted")
                    }}
                  />
                </div>
              </div>
            ) : isFaqList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4">
                <div className="block min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium admin-text-secondary">
                      Question
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-8 w-8 p-0"
                      onClick={() => {
                        const questionText =
                          typeof item.question === "string" && item.question.trim()
                            ? `"${item.question.trim()}"`
                            : `FAQ ${index + 1}`
                        onRequestDelete({
                          title: "Delete FAQ?",
                          description: `Are you sure you want to delete ${questionText}? This action cannot be undone.`,
                          onConfirm: () => {
                            onChange(
                              path,
                              value.filter((_, faqIndex) => faqIndex !== index),
                            )
                            onAction("FAQ deleted")
                          },
                        })
                      }}
                      title="Delete FAQ"
                      aria-label="Delete FAQ"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <input
                    className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "question"], event.target.value)
                    }
                    value={typeof item.question === "string" ? item.question : ""}
                  />
                </div>
                <div className="block min-w-0">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Answer
                  </label>
                  <textarea
                    className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary min-h-28 resize-y"
                    onChange={(event) =>
                      onChange([...path, String(index), "answer"], event.target.value)
                    }
                    rows={4}
                    value={typeof item.answer === "string" ? item.answer : ""}
                  />
                </div>
              </div>
            ) : isServicesList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-12 flex flex-col sm:flex-row sm:items-end gap-4">
                  <div className="shrink-0">
                    <label className="block text-sm font-medium admin-text-secondary mb-1.5 whitespace-nowrap">
                      Service Number
                    </label>
                    <div
                      aria-readonly="true"
                      className="w-20 h-10 px-3 admin-input rounded-lg text-sm admin-text-muted opacity-75 cursor-not-allowed select-none flex items-center justify-center"
                      title="Automatically set from the service position in the list"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                      Service Title
                    </label>
                    <input
                      className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                      onChange={(event) =>
                        onChange([...path, String(index), "title"], event.target.value)
                      }
                      placeholder="e.g. Website & Conversion Optimization"
                      value={typeof item.title === "string" ? item.title : ""}
                    />
                  </div>
                  <div className="flex sm:items-end justify-end shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-10 w-10 p-0 flex items-center justify-center shrink-0"
                      onClick={() => {
                        const serviceTitle =
                          typeof item.title === "string" && item.title.trim()
                            ? `"${item.title.replace(/\n/g, " ").trim()}"`
                            : `Service ${index + 1}`
                        onRequestDelete({
                          title: "Delete Service?",
                          description: `Are you sure you want to delete ${serviceTitle}? This action cannot be undone.`,
                          onConfirm: () => {
                            onChange(
                              path,
                              value
                                .filter((_, serviceIndex) => serviceIndex !== index)
                                .map((serviceItem, nextIndex) =>
                                  isRecord(serviceItem)
                                    ? {
                                        ...serviceItem,
                                        number: String(nextIndex + 1).padStart(2, "0"),
                                      }
                                    : serviceItem,
                                ),
                            )
                            onAction("Service deleted")
                          },
                        })
                      }}
                      title="Delete Service"
                      aria-label="Delete Service"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="sm:col-span-12">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Service Tags / Channels
                  </label>
                  <input
                    className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "tags"], event.target.value)
                    }
                    placeholder="e.g. WEB EXPERIENCE / UX / CONVERSION"
                    value={typeof item.tags === "string" ? item.tags : ""}
                  />
                </div>
                <div className="sm:col-span-12">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary min-h-20 resize-y"
                    onChange={(event) =>
                      onChange([...path, String(index), "description"], event.target.value)
                    }
                    placeholder="Describe this service offering and value proposition"
                    rows={3}
                    value={typeof item.description === "string" ? item.description : ""}
                  />
                </div>
              </div>
            ) : isWhySjmlList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-12 flex flex-col sm:flex-row sm:items-end gap-4">
                  <div className="shrink-0">
                    <label className="block text-sm font-medium admin-text-secondary mb-1.5 whitespace-nowrap">
                      Point Number
                    </label>
                    <div
                      aria-readonly="true"
                      className="w-20 h-10 px-3 admin-input rounded-lg text-sm admin-text-muted opacity-75 cursor-not-allowed select-none flex items-center justify-center"
                      title="Automatically set from the point position in the list"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                      Point Title
                    </label>
                    <input
                      className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                      onChange={(event) =>
                        onChange([...path, String(index), "title"], event.target.value)
                      }
                      placeholder="e.g. Creative That Connects"
                      value={typeof item.title === "string" ? item.title : ""}
                    />
                  </div>
                  <div className="flex sm:items-end justify-end shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-10 w-10 p-0 flex items-center justify-center shrink-0"
                      onClick={() => {
                        const pointTitle =
                          typeof item.title === "string" && item.title.trim()
                            ? `"${item.title.trim()}"`
                            : `Point ${index + 1}`
                        onRequestDelete({
                          title: "Delete Point?",
                          description: `Are you sure you want to delete ${pointTitle}? This action cannot be undone.`,
                          onConfirm: () => {
                            onChange(
                              path,
                              value
                                .filter((_, pointIndex) => pointIndex !== index)
                                .map((pointItem, nextIndex) =>
                                  isRecord(pointItem)
                                    ? {
                                        ...pointItem,
                                        number: String(nextIndex + 1).padStart(2, "0"),
                                      }
                                    : pointItem,
                                ),
                            )
                            onAction("Point deleted")
                          },
                        })
                      }}
                      title="Delete Point"
                      aria-label="Delete Point"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="sm:col-span-12">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary min-h-20 resize-y"
                    onChange={(event) =>
                      onChange([...path, String(index), "description"], event.target.value)
                    }
                    placeholder="Describe this reason or capability..."
                    rows={3}
                    value={typeof item.description === "string" ? item.description : ""}
                  />
                </div>
              </div>
            ) : isProcessList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-12 flex flex-col sm:flex-row sm:items-end gap-4">
                  <div className="shrink-0">
                    <label className="block text-sm font-medium admin-text-secondary mb-1.5 whitespace-nowrap">
                      Step Number
                    </label>
                    <div
                      aria-readonly="true"
                      className="w-20 h-10 px-3 admin-input rounded-lg text-sm admin-text-muted opacity-75 cursor-not-allowed select-none flex items-center justify-center"
                      title="Automatically set from the step position in the list"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                      Step Title
                    </label>
                    <input
                      className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                      onChange={(event) =>
                        onChange([...path, String(index), "title"], event.target.value)
                      }
                      placeholder="e.g. Discover"
                      value={typeof item.title === "string" ? item.title : ""}
                    />
                  </div>
                  <div className="flex sm:items-end justify-end shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-10 w-10 p-0 flex items-center justify-center shrink-0"
                      onClick={() => {
                        const stepTitle =
                          typeof item.title === "string" && item.title.trim()
                            ? `"${item.title.trim()}"`
                            : `Step ${index + 1}`
                        onRequestDelete({
                          title: "Delete Step?",
                          description: `Are you sure you want to delete ${stepTitle}? This action cannot be undone.`,
                          onConfirm: () => {
                            onChange(
                              path,
                              value
                                .filter((_, stepIndex) => stepIndex !== index)
                                .map((stepItem, nextIndex) =>
                                  isRecord(stepItem)
                                    ? {
                                        ...stepItem,
                                        number: String(nextIndex + 1).padStart(2, "0"),
                                      }
                                    : stepItem,
                                ),
                            )
                            onAction("Step deleted")
                          },
                        })
                      }}
                      title="Delete Step"
                      aria-label="Delete Step"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="sm:col-span-12">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary min-h-20 resize-y"
                    onChange={(event) =>
                      onChange([...path, String(index), "description"], event.target.value)
                    }
                    placeholder="Describe this step in your process..."
                    rows={3}
                    value={typeof item.description === "string" ? item.description : ""}
                  />
                </div>
              </div>
            ) : (
              <SectionFields
                onChange={onChange}
                onAction={onAction}
                onRequestDelete={onRequestDelete}
                cmsFooterAddress={cmsFooterAddress}
                path={[...path, String(index)]}
                value={item}
              />
            )}
          </fieldset>
        ))}
      </div>
    )
  }

  if (isRecord(value)) {
    const useTwoColumns = path.length === 1 && twoColumnSections.has(path[0])
    const lastSegment = path[path.length - 1] ?? ""
    const isNamedNestedSection = path.length > 1 && Number.isNaN(Number(lastSegment))

    const gridContent = (
      <div
        className={`grid min-w-0 grid-cols-1 gap-4 ${
          useTwoColumns ? "md:grid-cols-2" : "sm:grid-cols-2"
        }`}
      >
        {Object.entries(value)
          .filter(
            ([key]) =>
              key.toLowerCase() !== "id" &&
              key !== "ctaHref" &&
              !(
                path.length === 1 &&
                (path[0] === "header" || path[0] === "footer") &&
                hiddenHeaderFooterFieldKeys.has(key)
              ) &&
              !(
                path.length === 1 &&
                path[0] === "hero" &&
                lockedHeroFormFieldKeys.has(key)
              ) &&
              !(path.length === 1 && path[0] === "work" && key === "featured") &&
              !(
                path.length === 2 &&
                path[0] === "work" &&
                path[1] === "featured" &&
                hiddenFeaturedWorkFieldKeys.has(key)
              ),
          )
          .map(([key, child]) => (
            <SectionFields
              key={[...path, key].join(".")}
              onChange={onChange}
              onAction={onAction}
              onRequestDelete={onRequestDelete}
              cmsFooterAddress={cmsFooterAddress}
              path={[...path, key]}
              value={child}
            />
          ))}
      </div>
    )

    if (isNamedNestedSection) {
      const legendLabel =
        path[0] === "work" && lastSegment === "featured"
          ? "Featured Project"
          : formatLabel(lastSegment)
      return (
        <fieldset className="sm:col-span-2 md:col-span-2 min-w-0 rounded-xl border admin-border admin-card p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider admin-text-secondary">
            {legendLabel}
          </legend>
          {gridContent}
        </fieldset>
      )
    }

    return gridContent
  }

  return null
}

export function Template1SectionEditor({
  data,
  onChange,
  enabledSections,
  onEnabledSectionsChange,
  seoData,
  onSeoChange,
  onAction,
}: Template1SectionEditorProps) {
  const [activeSection, setActiveSection] = useState<keyof Template1PageData | "seo">("hero")
  const [pendingDelete, setPendingDelete] = useState<DeleteConfirmationRequest | null>(null)
  const [cmsFooterAddress, setCmsFooterAddress] = useState("")

  useEffect(() => {
    let cancelled = false
    async function loadCmsFooterAddress() {
      try {
        const res = await fetch("/api/content/footer")
        if (!res.ok || cancelled) return
        const json = await res.json()
        const normalized = normalizeFooterContent(json)
        if (!cancelled && normalized.address) {
          setCmsFooterAddress(normalized.address.trim())
        }
      } catch (error) {
        console.error("Failed to fetch CMS footer address:", error)
      }
    }
    void loadCmsFooterAddress()
    return () => {
      cancelled = true
    }
  }, [])

  function updateField(path: string[], value: unknown) {
    onChange(updateAtPath(data, path, value))
  }

  const tabs: Array<{
    key: keyof Template1PageData | "seo"
    label: string
  }> = [
    { key: "header", label: "Header" },
    ...Object.entries(sectionLabels)
      .filter(([key]) => key !== "header" && key !== "footer")
      .map(([key, label]) => ({
        key: key as keyof Template1PageData,
        label,
      })),
    { key: "footer", label: "Footer" },
    { key: "seo", label: "SEO" },
  ]
  const activeLabel = tabs.find((tab) => tab.key === activeSection)?.label ?? "SEO"
  const showScrollIndicator = data.hero.showScrollIndicator !== false

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2 mb-6 overflow-x-auto pb-1.5 flex-nowrap scrollbar-thin">
        {tabs.map(({ key, label }) => {
          const active = activeSection === key
          return (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex-1 text-center justify-center min-w-fit px-2.5 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "admin-bg-secondary admin-text-secondary hover:admin-text-primary"
              }`}
              type="button"
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Editor Panel Card */}
      <div className="w-full admin-card border admin-border rounded-xl p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b admin-border">
          <div>
            <h3 className="text-xl font-bold admin-text-primary">
              {activeLabel === "SEO" ? "SEO Metadata" : activeLabel}
            </h3>
            <p className="text-sm admin-text-secondary mt-0.5">
              Configure content, overrides, and settings for the {activeLabel.toLowerCase()} section.
            </p>
          </div>
          {activeSection !== "seo" && (
            <div className="flex items-center gap-3">
              <span className="text-sm admin-text-secondary font-medium">
                {enabledSections[activeSection] ? "Enabled" : "Disabled"}
              </span>
              <button
                aria-checked={enabledSections[activeSection]}
                aria-label={`${enabledSections[activeSection] ? "Disable" : "Enable"} ${activeLabel} section`}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  enabledSections[activeSection] ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => {
                  onEnabledSectionsChange({
                    ...enabledSections,
                    [activeSection]: !enabledSections[activeSection],
                  })
                  onAction(
                    `${activeLabel} section ${enabledSections[activeSection] ? "disabled" : "enabled"}`,
                  )
                }}
                role="switch"
                type="button"
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    enabledSections[activeSection] ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Notice for Header */}
        {activeSection === "header" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex items-start gap-3">
            <span className="text-amber-600 font-bold text-lg leading-none mt-0.5">ℹ️</span>
            <div className="text-sm">
              <p className="font-semibold text-amber-950">Header Contact & Logo Notice</p>
              <p className="text-amber-850 mt-1">
                The Header <strong>Logo</strong>, <strong>Contact Phone</strong>, and <strong>CTA button</strong> are automatically fetched from the main site&apos;s <strong>Header Settings</strong> and <strong>Footer Settings</strong>. Any values configured below serve as page-specific overrides.
              </p>
            </div>
          </div>
        )}

        {/* Notice for Footer */}
        {activeSection === "footer" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex items-start gap-3">
            <span className="text-amber-600 font-bold text-lg leading-none mt-0.5">ℹ️</span>
            <div className="text-sm">
              <p className="font-semibold text-amber-950">Footer Contact & Logo Notice</p>
              <p className="text-amber-850 mt-1">
                The Footer <strong>Logo</strong> and contact details (<strong>Phone</strong>, <strong>Email</strong>, <strong>Address</strong>, and <strong>Copyright</strong>) are automatically fetched from the main site&apos;s <strong>Footer Settings</strong>. Any values configured below serve as page-specific overrides.
              </p>
            </div>
          </div>
        )}

        {/* Hero-specific Scroll Indicator Switch */}
        {activeSection === "hero" && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border admin-border admin-card p-4">
            <div>
              <p className="font-medium admin-text-primary text-sm">Scroll Indicator</p>
              <p className="text-xs admin-text-secondary mt-0.5">
                Show or hide the scroll cue mouse icon in the hero section.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs admin-text-secondary font-medium">
                {showScrollIndicator ? "Enabled" : "Disabled"}
              </span>
              <button
                aria-checked={showScrollIndicator}
                aria-label={`${showScrollIndicator ? "Disable" : "Enable"} scroll indicator`}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  showScrollIndicator ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => {
                  updateField(["hero", "showScrollIndicator"], !showScrollIndicator)
                  onAction(
                    `Scroll indicator ${showScrollIndicator ? "disabled" : "enabled"}`,
                  )
                }}
                role="switch"
                type="button"
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    showScrollIndicator ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* SEO Tab or Standard Section Fields */}
        {activeSection === "seo" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                SEO Title
              </label>
              <input
                className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                maxLength={70}
                onChange={(event) => onSeoChange({ ...seoData, title: event.target.value })}
                placeholder="Search result title"
                value={seoData.title}
              />
              <span className="mt-1.5 block text-xs admin-text-muted">
                {seoData.title.length}/70 characters
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                Open Graph Image URL
              </label>
              <input
                className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                onChange={(event) => onSeoChange({ ...seoData, ogImage: event.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
                value={seoData.ogImage}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                Meta Description
              </label>
              <textarea
                className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary min-h-28 resize-y"
                maxLength={320}
                onChange={(event) =>
                  onSeoChange({ ...seoData, description: event.target.value })
                }
                placeholder="Briefly describe this page for search engine results"
                rows={4}
                value={seoData.description}
              />
              <span className="mt-1.5 block text-xs admin-text-muted">
                {seoData.description.length}/320 characters
              </span>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                Keywords
              </label>
              <input
                className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                onChange={(event) => onSeoChange({ ...seoData, keywords: event.target.value })}
                placeholder="Comma-separated keywords (e.g. branding, performance marketing)"
                value={seoData.keywords}
              />
            </div>
          </div>
        ) : (
          <SectionFields
            onChange={updateField}
            onAction={onAction}
            onRequestDelete={setPendingDelete}
            cmsFooterAddress={cmsFooterAddress}
            path={[activeSection]}
            value={data[activeSection]}
          />
        )}
      </div>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title={pendingDelete?.title}
        description={pendingDelete?.description}
        confirmLabel={pendingDelete?.confirmLabel ?? "Delete"}
        onConfirm={() => {
          pendingDelete?.onConfirm()
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
