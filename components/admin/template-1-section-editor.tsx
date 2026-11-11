"use client"

import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { uploadImageAction } from "@/app/actions/upload"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "./rich-text-editor"
import type {
  Template1PageData,
  Template1SectionVisibility,
} from "@/components/template-1/default-data"
import type { LandingPageSeo } from "@/lib/landing-pages"

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
  "formOverline",
  "fullNameLabel",
  "fullNamePlaceholder",
  "emailLabel",
  "emailPlaceholder",
  "phoneLabel",
  "phonePlaceholder",
  "messageLabel",
  "messagePlaceholder",
  "trustText",
  "privacyText",
  "privacyLinkText",
  "privacyLinkHref",
])

const hiddenHeaderFooterFieldKeys = new Set([
  "logoText",
  "taglineLine1",
  "taglineLine2",
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

function SimpleImageUpload({
  label,
  value,
  onChange,
  onAction,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onAction: (message: string) => void
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
    if (file.size > 10 * 1024 * 1024) {
      const message = "Image must be smaller than 10MB."
      setErrorMessage(message)
      onAction(`❌ ${message}`)
      return
    }

    setErrorMessage("")
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const result = await uploadImageAction(formData)
      if (!result.url) {
        throw new Error(result.error ?? "Image upload failed.")
      }
      onChange(result.url)
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
      <span className="block text-sm font-medium admin-text-secondary mb-1.5">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        {value && (
          <img
            alt={`${label} preview`}
            className="h-10 w-10 rounded-lg border admin-border object-contain bg-white p-1 shrink-0"
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
        <Button
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="admin-border-light admin-text-primary hover:admin-bg-secondary bg-transparent h-10 px-4 shrink-0"
          type="button"
        >
          <Upload aria-hidden="true" className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
        {value && (
          <span className="flex items-center gap-2 text-xs admin-text-secondary shrink-0">
            <span>Image uploaded</span>
            <button
              aria-label={`Remove ${label}`}
              className="rounded p-1 text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => {
                onChange("")
                onAction(`${label} removed`)
              }}
              type="button"
            >
              <X aria-hidden="true" size={14} />
            </button>
          </span>
        )}
      </div>
      {errorMessage && (
        <p aria-live="polite" className="mt-1 text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

function SectionFields({
  value,
  path,
  onChange,
  onAction,
}: {
  value: unknown
  path: string[]
  onChange: (path: string[], value: unknown) => void
  onAction: (message: string) => void
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
        ? fieldName === "formTitle"
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
          onChange={(url) => onChange(path, url)}
          onAction={onAction}
          value={value}
        />
      )
    }

    const inputClassName =
      "w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
    const isLongText = value.length > 60 || value.includes("\n")
    const spansFullWidth =
      isLongText || /description|answer|statement|subtitle/i.test(fieldName)
    const rows = Math.min(
      10,
      Math.max(4, value.split("\n").length, Math.ceil(value.length / 60)),
    )

    return (
      <div className={`block min-w-0 ${spansFullWidth ? "md:col-span-2" : ""}`}>
        <label className="block text-sm font-medium admin-text-secondary mb-1.5">{label}</label>
        {isLongText ? (
          <textarea
            className={`${inputClassName} min-h-32 resize-y`}
            onChange={(event) => onChange(path, event.target.value)}
            rows={rows}
            value={value}
          />
        ) : (
          <input
            className={inputClassName}
            onChange={(event) => onChange(path, event.target.value)}
            value={value}
          />
        )}
      </div>
    )
  }

  if (Array.isArray(value)) {
    const isClientsList = path[0] === "clients" && path[path.length - 1] === "clients"
    const isFaqList = path[0] === "faq" && path[path.length - 1] === "faqs"
    const isWorkProjectsList = path[0] === "work" && path[path.length - 1] === "projects"
    const isServicesList = path[0] === "services" && path[path.length - 1] === "services"
    const isWhySjmlList = path[0] === "whySjml" && path[path.length - 1] === "points"
    const isProcessList = path[0] === "process" && path[path.length - 1] === "steps"

    return (
      <div className="min-w-0 space-y-4 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <h4 className="text-sm font-semibold admin-text-primary">
            {formatLabel(path[path.length - 1] ?? "")} ({value.length})
          </h4>
          {(isClientsList || isFaqList || isWorkProjectsList || isServicesList || isWhySjmlList || isProcessList) && (
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
                      : isWorkProjectsList
                        ? {
                            id: `work-${crypto.randomUUID()}`,
                            title: "",
                            category: "",
                            image: "/placeholder.jpg",
                            imageAlt: "",
                            statusNote: "Narrative for approval",
                            challenge: "",
                            approach: "",
                            narrativeHtml: `<p><span style="color: rgba(22, 22, 23, 0.45); font-size: 11px;">Narrative for approval</span></p><p><strong>Challenge:</strong> </p><p><strong>Approach:</strong> </p>`,
                            href: "/work",
                          }
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
                      : isWorkProjectsList
                        ? "Project added"
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
                  : isWorkProjectsList
                    ? "Add Project"
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
                  : isWorkProjectsList
                    ? `Project ${index + 1}: ${(isRecord(item) && typeof item.title === "string" && item.title) || `Project ${index + 1}`}`
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
                <div className="flex-1 min-w-0">
                  <SimpleImageUpload
                    label="Client Logo"
                    onChange={(url) =>
                      onChange([...path, String(index), "logoUrl"], url)
                    }
                    onAction={onAction}
                    value={typeof item.logoUrl === "string" ? item.logoUrl : ""}
                  />
                </div>
                <div className="shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-10 w-10 p-0 flex items-center justify-center shrink-0"
                    onClick={() => {
                      onChange(
                        path,
                        value.filter((_, clientIndex) => clientIndex !== index),
                      )
                      onAction("Client deleted")
                    }}
                    title="Delete Client"
                    aria-label="Delete Client"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                        onChange(
                          path,
                          value.filter((_, faqIndex) => faqIndex !== index),
                        )
                        onAction("FAQ deleted")
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
            ) : isWorkProjectsList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <div className="block min-w-0">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Project Title
                  </label>
                  <input
                    className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "title"], event.target.value)
                    }
                    placeholder="e.g. RightData"
                    value={typeof item.title === "string" ? item.title : ""}
                  />
                </div>

                <div className="block min-w-0">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Category / Service Subtitle
                  </label>
                  <input
                    className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "category"], event.target.value)
                    }
                    placeholder="e.g. Enterprise technology / Web & Experience"
                    value={typeof item.category === "string" ? item.category : ""}
                  />
                </div>

                <div className="block min-w-0">
                  <SimpleImageUpload
                    label="Project Image"
                    onChange={(url) =>
                      onChange([...path, String(index), "image"], url)
                    }
                    onAction={onAction}
                    value={typeof item.image === "string" ? item.image : ""}
                  />
                </div>

                <div className="block min-w-0">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Project Link URL
                  </label>
                  <input
                    className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "href"], event.target.value)
                    }
                    placeholder="/work"
                    value={typeof item.href === "string" ? item.href : ""}
                  />
                </div>

                {/* RICH TEXT EDITOR FOR NARRATIVE & CASE DETAILS */}
                <div className="sm:col-span-2 pt-1">
                  <RichTextEditor
                    label="Case Narrative (Rich Text Editor)"
                    description="Edit the Narrative for approval, Challenge, and Approach using rich text formatting (bold, italic, bullets, headers, etc.)."
                    value={
                      typeof item.narrativeHtml === "string" && item.narrativeHtml.trim()
                        ? item.narrativeHtml
                        : [
                            typeof item.statusNote === "string" && item.statusNote
                              ? `<p><span style="color: rgba(22, 22, 23, 0.45); font-size: 11px;">${item.statusNote}</span></p>`
                              : "",
                            typeof item.challenge === "string" && item.challenge
                              ? `<p><strong>Challenge:</strong> ${item.challenge}</p>`
                              : "",
                            typeof item.approach === "string" && item.approach
                              ? `<p><strong>Approach:</strong> ${item.approach}</p>`
                              : "",
                          ]
                            .filter(Boolean)
                            .join("")
                    }
                    onChange={(html) => {
                      onChange([...path, String(index), "narrativeHtml"], html)
                    }}
                  />
                </div>

                <div className="sm:col-span-2 pt-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-8 w-8 p-0"
                    onClick={() => {
                      onChange(
                        path,
                        value.filter((_, projectIndex) => projectIndex !== index),
                      )
                      onAction("Project deleted")
                    }}
                    title="Delete Project"
                    aria-label="Delete Project"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : isServicesList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Service Number
                  </label>
                  <input
                    className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "number"], event.target.value)
                    }
                    placeholder={String(index + 1).padStart(2, "0")}
                    value={typeof item.number === "string" ? item.number : ""}
                  />
                </div>
                <div className="sm:col-span-8">
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
                <div className="sm:col-span-1 flex sm:items-end justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-10 w-10 p-0 flex items-center justify-center shrink-0"
                    onClick={() => {
                      onChange(
                        path,
                        value.filter((_, serviceIndex) => serviceIndex !== index),
                      )
                      onAction("Service deleted")
                    }}
                    title="Delete Service"
                    aria-label="Delete Service"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Point Number
                  </label>
                  <input
                    className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "number"], event.target.value)
                    }
                    placeholder={String(index + 1).padStart(2, "0")}
                    value={typeof item.number === "string" ? item.number : ""}
                  />
                </div>
                <div className="sm:col-span-8">
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
                <div className="sm:col-span-1 flex sm:items-end justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-10 w-10 p-0 flex items-center justify-center shrink-0"
                    onClick={() => {
                      onChange(
                        path,
                        value.filter((_, pointIndex) => pointIndex !== index),
                      )
                      onAction("Point deleted")
                    }}
                    title="Delete Point"
                    aria-label="Delete Point"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium admin-text-secondary mb-1.5">
                    Step Number
                  </label>
                  <input
                    className="w-full h-10 px-4 admin-input rounded-lg focus:outline-none focus:border-primary text-sm admin-text-primary"
                    onChange={(event) =>
                      onChange([...path, String(index), "number"], event.target.value)
                    }
                    placeholder={String(index + 1).padStart(2, "0")}
                    value={typeof item.number === "string" ? item.number : ""}
                  />
                </div>
                <div className="sm:col-span-8">
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
                <div className="sm:col-span-1 flex sm:items-end justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent h-10 w-10 p-0 flex items-center justify-center shrink-0"
                    onClick={() => {
                      onChange(
                        path,
                        value.filter((_, stepIndex) => stepIndex !== index),
                      )
                      onAction("Step deleted")
                    }}
                    title="Delete Step"
                    aria-label="Delete Step"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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

    return (
      <div
        className={`grid min-w-0 grid-cols-1 gap-4 ${
          useTwoColumns ? "md:grid-cols-2" : "sm:grid-cols-2"
        }`}
      >
        {Object.entries(value)
          .filter(
            ([key]) =>
              key.toLowerCase() !== "id" &&
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
              path={[...path, key]}
              value={child}
            />
          ))}
      </div>
    )
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
            path={[activeSection]}
            value={data[activeSection]}
          />
        )}
      </div>
    </div>
  )
}
