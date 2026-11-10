"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
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

export function LandingPageForm({ page, onCancel, onSaved }: LandingPageFormProps) {
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
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function createPage() {
    if (isSaving) return
    setIsSaving(true)
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
      setErrorMessage(error instanceof Error ? error.message : "Failed to create page")
    } finally {
      setIsSaving(false)
    }
  }

  const pageDetails = (
    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-base font-normal text-[#525252]">Title</span>
        <input
          className="min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-base text-[#161617] outline-none placeholder:text-[#737373] focus:border-[#a3a3a3]"
          onChange={(event) => {
            setTitle(event.target.value)
            if (!slugEdited) setSlug(toSlug(event.target.value))
          }}
          placeholder="Page title"
          required
          value={title}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-base font-normal text-[#525252]">URL slug</span>
        <input
          className="min-h-12 w-full rounded border border-[#d1d5db] bg-white px-3 py-3 text-base text-[#161617] outline-none placeholder:text-[#737373] focus:border-[#a3a3a3]"
          onChange={(event) => {
            setSlugEdited(true)
            setSlug(toSlug(event.target.value))
          }}
          placeholder="auto-generated from title"
          required
          value={slug}
        />
        <span className="mt-2 block text-sm text-[#525252]">
          Route preview: /{slug || "page-slug"}
        </span>
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="mb-2 block text-base font-normal text-[#525252]">Template</legend>
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
                className={`flex min-h-28 cursor-pointer flex-col justify-between rounded-md border p-4 pr-14 transition-colors ${
                  template === option
                    ? "border-[#FCC50E] bg-[#fff9df] ring-2 ring-[#FCC50E]/30"
                    : "border-[#d1d5db] bg-white hover:border-[#a3a3a3]"
                }`}
                htmlFor={`landing-page-template-${option}`}
              >
                <span className="text-base font-semibold text-[#161617]">{option}</span>
                <span className="mt-3 text-sm text-[#525252]">
                  {option === "Template 1"
                    ? `${templateOnePageSections} editable page sections`
                    : "Page template"}
                </span>
              </label>
              <button
                aria-label={`Preview ${option}`}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded border border-[#d1d5db] bg-white text-[#525252] transition-colors hover:border-[#FCC50E] hover:text-[#161617] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCC50E]"
                onClick={() => window.open("/template-1", "_blank", "noopener,noreferrer")}
                title={`Preview ${option}`}
                type="button"
              >
                <Eye aria-hidden="true" size={18} />
              </button>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )

  return (
    <section className="min-h-[calc(100vh-4rem)] -m-8 w-full min-w-0 bg-[#f5f7fa] p-5 text-[#161617]">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold">
            {page ? `Edit ${page.title}` : "Create New Page"}
          </h1>
          <p className="mt-1 text-base text-[#525252]">
            {page
              ? "Manage the selected template sections and SEO."
              : "Enter the basic details to create a page. You can edit its sections afterward."}
          </p>
        </div>
        <button
          className="rounded bg-[#FCC50E] px-5 py-2.5 text-sm font-semibold text-[#161617] hover:bg-[#eab800] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving}
          form="landing-page-form"
          type="submit"
        >
          {isSaving ? (page ? "Saving..." : "Creating...") : page ? "Save changes" : "Create page"}
        </button>
      </header>

      <form
        id="landing-page-form"
        className="w-full min-w-0 rounded-md border border-[#e5e7eb] bg-white p-5 sm:p-7"
        onSubmit={(event) => {
          event.preventDefault()
          void createPage()
        }}
      >
        {page && template === "Template 1" ? (
          <Template1SectionEditor
            data={sectionData}
            onChange={setSectionData}
            enabledSections={enabledSections}
            onEnabledSectionsChange={setEnabledSections}
            seoData={seoData}
            onSeoChange={setSeoData}
          />
        ) : page ? (
          <section className="w-full min-w-0 rounded-md border border-[#e5e7eb] bg-white p-4 text-sm text-[#525252] sm:p-5">
            No section editor is available for this template.
          </section>
        ) : (
          <section className="w-full min-w-0 rounded-md border border-[#e5e7eb] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-base font-semibold text-[#161617]">Page Details</h2>
            {pageDetails}
          </section>
        )}

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5ebf2] pt-5">
          <div aria-live="polite" className="text-sm">
            {errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : (
              <p className="text-[#525252]">
                {page
                  ? `Configure the ${template} sections and SEO.`
                  : `Your page will be created using ${template} (${templateOnePageSections} sections). Edit it afterward to configure each section.`}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="rounded border border-[#d1d5db] px-4 py-2.5 text-sm font-semibold text-[#525252] hover:bg-[#f5f5f5]"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          </div>
        </footer>
      </form>
    </section>
  )
}
