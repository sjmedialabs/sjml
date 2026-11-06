"use client"

import { useState } from "react"

const templates = [
  "Blank Page",
  "Blog Detail Template",
  "Case Study Details Template",
  "Business Intelligence",
  "Case Studies Template",
  "Landing Page Template 1",
  "Landing Page Template 2",
  "Home Template",
  "About Us",
]

const navigationItems = [
  "HOME",
  "ABOUT US",
  "SERVICES",
  "WORK",
  "INDUSTRIES",
  "INSIGHTS",
  "CONTACT US",
]

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface LandingPageFormProps {
  onCancel: () => void
}

export function LandingPageForm({ onCancel }: LandingPageFormProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [navigation, setNavigation] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("Blank Page")

  return (
    <section className="min-h-[calc(100vh-4rem)] -m-8 bg-[#f5f7fa] p-5 text-[#161617]">
      <header className="mb-7">
        <h1 className="text-[28px] font-bold">Create New Page</h1>
        <p className="mt-1 text-base text-[#525252]">
          Place the page directly in your website Navigation hierarchy
        </p>
      </header>

      <form
        className="rounded-md border border-[#e5e7eb] bg-white p-5 sm:p-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <section className="p-0">
          <h2 className="mb-6 text-3xl font-semibold text-[#161617] sm:text-4xl">
            Basic Information
          </h2>
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-base font-normal text-[#525252]">
                Title
              </span>
              <input
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-2.5 text-base text-[#161617] outline-none placeholder:text-[#737373] focus:border-[#a3a3a3]"
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
              <span className="mb-2 block text-base font-normal text-[#525252]">
                URL slug
              </span>
              <input
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-2.5 text-base text-[#161617] outline-none placeholder:text-[#737373] focus:border-[#a3a3a3]"
                onChange={(event) => {
                  setSlugEdited(true)
                  setSlug(toSlug(event.target.value))
                }}
                placeholder="auto-generated from title"
                value={slug}
              />
              <span className="mt-2 block text-sm text-[#525252]">
                Route preview: /{slug || "page-slug"}
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-base font-normal text-[#525252]">
                Menu item (Nav Bar)
              </span>
              <select
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-2.5 text-base text-[#161617] outline-none focus:border-[#a3a3a3]"
                id="landing-page-navigation"
                onChange={(event) => setNavigation(event.target.value)}
                value={navigation}
              >
                <option value="">None — unlinked page</option>
                {navigationItems.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="mt-8 p-0">
          <h2 className="mb-4 text-[14px] font-semibold text-[#161617]">
            Template (Optional)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              const selected = selectedTemplate === template
              return (
                <button
                  aria-pressed={selected}
                  className={`min-h-[50px] rounded border px-4 py-3 text-left text-base font-medium transition-colors ${
                    selected
                      ? "border-[#FCC50E] bg-[#FCC50E] text-[#161617]"
                      : "border-[#d1d5db] bg-white text-[#161617] hover:border-[#a3a3a3]"
                  }`}
                  key={template}
                  onClick={() => setSelectedTemplate(template)}
                  type="button"
                >
                  {template}
                </button>
              )
            })}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5ebf2] pt-5">
          <p className="text-sm text-[#525252]">
            Page saving will be available once landing page storage is connected.
          </p>
          <div className="flex gap-3">
            <button
              className="rounded border border-[#d1d5db] px-4 py-2.5 text-sm font-semibold text-[#525252] hover:bg-[#f5f5f5]"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="cursor-not-allowed rounded bg-[#161617]/50 px-4 py-2.5 text-sm font-semibold text-white"
              disabled
              type="submit"
            >
              Create page
            </button>
          </div>
        </footer>
      </form>
    </section>
  )
}
