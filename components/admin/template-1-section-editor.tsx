"use client"

import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { Upload, X } from "lucide-react"
import { uploadImageAction } from "@/app/actions/upload"
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
            <button
              aria-label={`Remove ${label}`}
              className="rounded p-1 text-[#526783] hover:bg-[#eef3f8]"
              onClick={() => {
                onChange("")
                onAction(`${label} removed`)
              }}
              type="button"
            >
              <X aria-hidden="true" size={16} />
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
    const isImageField = /(?:image|logo|photo|icon)(?:url)?$/i.test(fieldName)
    const displayFieldName =
      path[0] === "hero" && path.length === 2
        ? fieldName === "formTitle"
          ? "Form Title"
          : fieldName === "submitButtonText"
            ? "Form Submit Button Text"
            : fieldName.replace(/Label$/, "").replace(/Placeholder$/, "")
        : fieldName
    const label = displayFieldName.endsWith("Href")
      ? `${formatLabel(displayFieldName.slice(0, -"Href".length))} Redirection URL`
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
      "min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] leading-6 text-[#161617] outline-none focus:border-[#a3a3a3]"
    const isLongText = value.length > 60 || value.includes("\n")
    const spansFullWidth =
      isLongText || /description|answer|statement|subtitle/i.test(fieldName)
    const rows = Math.min(
      10,
      Math.max(4, value.split("\n").length, Math.ceil(value.length / 60)),
    )

    return (
      <label
        className={`block min-w-0 ${spansFullWidth ? "md:col-span-2" : ""}`}
      >
        <span className="mb-1.5 block text-sm text-[#525252]">{label}</span>
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
      </label>
    )
  }

  if (Array.isArray(value)) {
    const isClientsList = path[0] === "clients" && path[path.length - 1] === "clients"
    const isFaqList = path[0] === "faq" && path[path.length - 1] === "faqs"

    return (
      <div className="min-w-0 space-y-3 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-[#333]">
            {formatLabel(path[path.length - 1] ?? "")}
          </h4>
          {(isClientsList || isFaqList) && (
            <button
              className="rounded border border-[#d1d5db] px-3 py-2 text-sm font-medium text-[#526783] hover:bg-[#f5f7fa]"
              onClick={() => {
                pendingScrollIndex.current = value.length
                onChange(path, [
                  ...value,
                  isClientsList
                    ? { id: `client-${crypto.randomUUID()}`, name: "", logoUrl: "" }
                    : { id: `faq-${crypto.randomUUID()}`, question: "", answer: "" },
                ])
                onAction(isClientsList ? "Client added" : "FAQ added")
              }}
              type="button"
            >
              {isClientsList ? "Add client" : "Add FAQ"}
            </button>
          )}
        </div>
        {value.map((item, index) => (
          <fieldset
            className="block min-w-0 rounded border border-[#e5e7eb] p-4 break-inside-avoid"
            key={index}
            ref={(element) => {
              if (index === pendingScrollIndex.current) {
                newlyAddedItemRef.current = element
              }
            }}
          >
            <legend className="px-1 text-xs font-medium text-[#71839e]">
              {isClientsList
                ? `Client ${index + 1}`
                : isFaqList
                  ? `FAQ ${index + 1}`
                  : `Item ${index + 1}`}
            </legend>
            {isClientsList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-sm text-[#525252]">Name</span>
                  <input
                    className="min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] leading-6 text-[#161617] outline-none focus:border-[#a3a3a3]"
                    onChange={(event) =>
                      onChange([...path, String(index), "name"], event.target.value)
                    }
                    value={typeof item.name === "string" ? item.name : ""}
                  />
                </label>
                <SimpleImageUpload
                  label="Logo"
                  onChange={(url) =>
                    onChange([...path, String(index), "logoUrl"], url)
                  }
                  onAction={onAction}
                  value={typeof item.logoUrl === "string" ? item.logoUrl : ""}
                />
                <div className="sm:col-span-2">
                  <button
                    className="rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    onClick={() => {
                      onChange(
                        path,
                        value.filter((_, clientIndex) => clientIndex !== index),
                      )
                      onAction("Client deleted")
                    }}
                    type="button"
                  >
                    Delete client
                  </button>
                </div>
              </div>
            ) : isFaqList && isRecord(item) ? (
              <div className="grid min-w-0 gap-4">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-sm text-[#525252]">Question</span>
                  <input
                    className="min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] leading-6 text-[#161617] outline-none focus:border-[#a3a3a3]"
                    onChange={(event) =>
                      onChange([...path, String(index), "question"], event.target.value)
                    }
                    value={typeof item.question === "string" ? item.question : ""}
                  />
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-sm text-[#525252]">Answer</span>
                  <textarea
                    className="min-h-32 w-full resize-y rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] leading-6 text-[#161617] outline-none focus:border-[#a3a3a3]"
                    onChange={(event) =>
                      onChange([...path, String(index), "answer"], event.target.value)
                    }
                    rows={4}
                    value={typeof item.answer === "string" ? item.answer : ""}
                  />
                </label>
                <button
                  className="justify-self-start rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  onClick={() => {
                    onChange(
                      path,
                      value.filter((_, faqIndex) => faqIndex !== index),
                    )
                    onAction("FAQ deleted")
                  }}
                  type="button"
                >
                  Delete FAQ
                </button>
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
                path[0] === "hero" &&
                lockedHeroFormFieldKeys.has(key)
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
    ...Object.entries(sectionLabels)
      .filter(([key]) => key !== "header" && key !== "footer")
      .map(([key, label]) => ({
        key: key as keyof Template1PageData,
        label,
      })),
    { key: "seo", label: "SEO" },
  ]
  const activeLabel = tabs.find((tab) => tab.key === activeSection)?.label ?? "SEO"

  return (
    <div>
      <nav
        aria-label="Page editor sections"
        className="mb-4 flex flex-wrap gap-2"
        role="tablist"
      >
        {tabs.map(({ key, label }) => {
          const active = activeSection === key
          return (
            <button
              aria-controls="page-editor-panel"
              aria-selected={active}
              className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#FCC50E] text-[#161617]"
                  : "bg-[#e5e7eb] text-[#525252] hover:bg-[#d9dce1]"
              }`}
              id={`page-editor-tab-${key}`}
              key={key}
              onClick={() => setActiveSection(key)}
              role="tab"
              type="button"
            >
              {label}
            </button>
          )
        })}
      </nav>
      <section
        aria-labelledby={`page-editor-tab-${activeSection}`}
        className="w-full min-w-0 rounded-md border border-[#e5e7eb] bg-white px-4 pb-4 !pt-3 sm:px-5 sm:pb-5"
        id="page-editor-panel"
        role="tabpanel"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3
            className="!text-[30px] font-bold text-[#161617]"
            id="page-editor-heading"
          >
            {activeLabel}
          </h3>
          {activeSection !== "seo" && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#525252]">
                {enabledSections[activeSection] ? "Enabled" : "Disabled"}
              </span>
              <button
                aria-checked={enabledSections[activeSection]}
                aria-label={`${enabledSections[activeSection] ? "Disable" : "Enable"} ${activeLabel} section`}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  enabledSections[activeSection] ? "bg-[#16a34a]" : "bg-[#9ca3af]"
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
                  className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                    enabledSections[activeSection] ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}
        </div>
        {activeSection === "seo" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-[#525252]">SEO title</span>
              <input
                className="min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] text-[#161617] outline-none focus:border-[#a3a3a3]"
                maxLength={70}
                onChange={(event) => onSeoChange({ ...seoData, title: event.target.value })}
                placeholder="Search result title"
                value={seoData.title}
              />
              <span className="mt-1 block text-xs text-[#737373]">
                {seoData.title.length}/70 characters
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-[#525252]">Open Graph image URL</span>
              <input
                className="min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] text-[#161617] outline-none focus:border-[#a3a3a3]"
                onChange={(event) => onSeoChange({ ...seoData, ogImage: event.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
                value={seoData.ogImage}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm text-[#525252]">Meta description</span>
              <textarea
                className="min-h-36 w-full resize-y rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] leading-6 text-[#161617] outline-none focus:border-[#a3a3a3]"
                maxLength={320}
                onChange={(event) =>
                  onSeoChange({ ...seoData, description: event.target.value })
                }
                placeholder="Briefly describe this page for search results"
                rows={6}
                value={seoData.description}
              />
              <span className="mt-1 block text-xs text-[#737373]">
                {seoData.description.length}/320 characters
              </span>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm text-[#525252]">Keywords</span>
              <input
                className="min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-[15px] text-[#161617] outline-none focus:border-[#a3a3a3]"
                onChange={(event) => onSeoChange({ ...seoData, keywords: event.target.value })}
                placeholder="Comma-separated keywords"
                value={seoData.keywords}
              />
            </label>
          </div>
        ) : (
          <SectionFields
            onChange={updateField}
            onAction={onAction}
            path={[activeSection]}
            value={data[activeSection]}
          />
        )}
      </section>
    </div>
  )
}
