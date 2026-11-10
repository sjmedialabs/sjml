"use client"

import { Eye, FileText, Pencil, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type {
  Template1PageData,
  Template1SectionVisibility,
} from "@/components/template-1/default-data"
import type { LandingPageSeo } from "@/lib/landing-pages"
import { AdminToast } from "./admin-toast"
import { LandingPageForm } from "./landing-page-form"

interface LandingPage {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isLandingPageList(value: unknown): value is LandingPage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (page: unknown) =>
        isRecord(page) &&
        typeof page.title === "string" &&
        typeof page.route === "string" &&
        typeof page.slug === "string" &&
        typeof page.status === "string" &&
        typeof page.sections === "number" &&
        typeof page.template === "string" &&
        typeof page.updated === "string" &&
        (page.navigation === undefined || typeof page.navigation === "string") &&
        (page.sectionData === undefined || isRecord(page.sectionData)) &&
        (page.enabledSections === undefined || isRecord(page.enabledSections)) &&
        (page.seoData === undefined || isRecord(page.seoData)),
    )
  )
}

export function LandingPagesManager() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editorMode = searchParams.get("editor")
  const editSlug = searchParams.get("edit")
  const [filter, setFilter] = useState("")
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [isLoadingPages, setIsLoadingPages] = useState(true)
  const [pagesError, setPagesError] = useState("")
  const [updatingSlug, setUpdatingSlug] = useState("")
  const [actionError, setActionError] = useState("")
  const [actionMessage, setActionMessage] = useState("")
  const isCreatingPage = editorMode === "create"
  const editingPage = editSlug
    ? landingPages.find((page) => page.slug === editSlug) ?? null
    : null

  const updateEditorUrl = useCallback((mode?: "create" | "edit", slug?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("section", "landing-pages")
    params.delete("editor")
    params.delete("edit")
    if (mode === "create") {
      params.set("editor", "create")
    } else if (mode === "edit" && slug) {
      params.set("edit", slug)
    }
    router.push(`/admin/dashboard?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  useEffect(() => {
    let active = true

    async function loadLandingPages() {
      try {
        const response = await fetch("/api/landing-pages")
        const result: unknown = await response.json()
        if (!response.ok) {
          const errorMessage =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "Failed to fetch landing pages"
          throw new Error(errorMessage)
        }
        if (!isLandingPageList(result)) {
          throw new Error("Landing pages response has an invalid format")
        }
        if (active) setLandingPages(result)
      } catch (error) {
        if (active) {
          setPagesError(error instanceof Error ? error.message : "Failed to fetch landing pages")
        }
      } finally {
        if (active) setIsLoadingPages(false)
      }
    }

    void loadLandingPages()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (editSlug && !isLoadingPages && !editingPage) {
      updateEditorUrl()
    }
  }, [editSlug, editingPage, isLoadingPages, updateEditorUrl])

  const filteredPages = landingPages.filter((page) =>
    `${page.title} ${page.route} ${page.status}`.toLowerCase().includes(filter.toLowerCase()),
  )

  async function togglePageStatus(page: LandingPage) {
    const nextStatus = page.status === "Enabled" ? "Disabled" : "Enabled"
    setUpdatingSlug(page.slug)
    setActionError("")

    try {
      const token = localStorage.getItem("adminToken")
      if (!token) throw new Error("Your admin session has expired. Please sign in again.")

      const response = await fetch(`/api/landing-pages/${encodeURIComponent(page.slug)}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      })
      const result: unknown = await response.json()
      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Failed to update page status"
        throw new Error(message)
      }
      if (
        !isRecord(result) ||
        typeof result.status !== "string" ||
        result.status !== nextStatus ||
        typeof result.updated !== "string"
      ) {
        throw new Error("The server returned an invalid page")
      }
      const updatedStatus = result.status
      const updatedAt = result.updated

      setLandingPages((currentPages) =>
        currentPages.map((currentPage) =>
          currentPage.slug === page.slug
            ? { ...currentPage, status: updatedStatus, updated: updatedAt }
            : currentPage,
        ),
      )
      setActionMessage(`Landing page ${nextStatus.toLowerCase()}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update page status"
      setActionError(message)
      setActionMessage(`❌ ${message}`)
    } finally {
      setUpdatingSlug("")
    }
  }

  if (isCreatingPage || editingPage || (editSlug && isLoadingPages)) {
    if (editSlug && isLoadingPages) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#71839e]">
          Loading page editor...
        </div>
      )
    }

    return (
      <>
        <AdminToast message={actionMessage} onClose={() => setActionMessage("")} duration={3000} />
        <LandingPageForm
          key={editingPage?.slug ?? "new-page"}
          page={editingPage ?? undefined}
          onAction={setActionMessage}
          onCancel={() => {
            updateEditorUrl()
          }}
          onSaved={(page) => {
            setLandingPages((currentPages) =>
              editingPage
                ? currentPages.map((currentPage) =>
                    currentPage.slug === editingPage.slug ? page : currentPage,
                  )
                : [page, ...currentPages],
            )
            if (!editingPage) updateEditorUrl()
          }}
        />
      </>
    )
  }

  return (
    <>
    <AdminToast message={actionMessage} onClose={() => setActionMessage("")} duration={3000} />
    <section className="min-h-[calc(100vh-4rem)] bg-[#f5f7fa] -m-8 p-5 text-[#172b4d]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="mt-1 text-lg text-[#71839e]">
            Manage your website hierarchy and content structure.
          </p>
        </div>
        <button
          onClick={() => {
            setActionMessage("New landing page form opened")
            updateEditorUrl("create")
          }}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#FCC50E] px-4 py-2 text-sm font-semibold text-black transition-colors "
        >
          <Plus size={16} />
          New page
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dce4ee] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5ebf2] p-3.5">
          <label className="flex w-full max-w-sm items-center gap-2 rounded-md bg-[#f5f7fa] px-3 py-2 text-[#91a2ba]">
            <Search size={16} />
            <input
              aria-label="Filter pages"
              className="w-full bg-transparent px-2 text-sm text-[#172b4d] outline-none placeholder:text-[#91a2ba]"
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Filter pages..."
              value={filter}
            />
          </label>
          <span className="text-sm text-[#91a2ba]">
            {isLoadingPages
              ? "Loading pages..."
              : `${filteredPages.length} ${filteredPages.length === 1 ? "page" : "pages"}`}
          </span>
        </div>
        {actionError && (
          <p aria-live="polite" className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
            {actionError}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] table-fixed text-left">
            <thead className="border-b border-[#e5ebf2] bg-[#fbfcfd] text-xs font-semibold uppercase tracking-wide text-[#71839e]">
              <tr>
                <th className="w-[24%] px-5 py-3">Page</th>
                <th className="w-[14%] px-4 py-3">Route</th>
                <th className="w-[9%] px-4 py-3">Status</th>
                <th className="w-[7%] px-4 py-3">SEO</th>
                <th className="w-[8%] px-4 py-3 text-center">Sections</th>
                <th className="w-[12%] px-4 py-3">Updated</th>
                <th className="w-[26%] px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPages ? (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center text-sm text-[#91a2ba]">
                    Loading landing pages...
                  </td>
                </tr>
              ) : pagesError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center text-sm text-red-600">
                    {pagesError}
                  </td>
                </tr>
              ) : filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <tr className="border-b border-[#e5ebf2] last:border-0" key={page.route}>
                    <td className="px-5 py-4">
                      <a
                        className="font-semibold text-[#172b4d] hover:underline"
                        href={`${page.route}?preview=1`}
                      >
                        {page.title}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        className="text-[#526783] hover:underline"
                        href={`${page.route}?preview=1`}
                      >
                        {page.route}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        page.status === "Enabled"
                          ? "bg-green-100 text-green-800"
                          : "bg-[#f0f2f5] text-[#526783]"
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#91a2ba]">—</td>
                    <td className="px-4 py-4 text-center">{page.sections}</td>
                    <td className="px-4 py-4 text-[#91a2ba]">{page.updated.split("T")[0]}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <a
                          aria-label={`Preview ${page.title}`}
                          className="inline-flex items-center gap-1 rounded border border-[#d1d5db] px-2.5 py-1.5 text-xs font-semibold text-[#526783] hover:bg-[#f5f7fa]"
                          href={`${page.route}?preview=1`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Eye size={14} />
                          Preview
                        </a>
                        <button
                          aria-label={`Edit ${page.title}`}
                          className="inline-flex items-center gap-1 rounded border border-[#d1d5db] px-2.5 py-1.5 text-xs font-semibold text-[#526783] hover:bg-[#f5f7fa]"
                          onClick={() => {
                            setActionMessage(`${page.title} editor opened`)
                            updateEditorUrl("edit", page.slug)
                          }}
                          type="button"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          aria-checked={page.status === "Enabled"}
                          aria-label={`${page.title} is ${page.status.toLowerCase()}`}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-wait disabled:opacity-50 ${
                            page.status === "Enabled" ? "bg-green-600" : "bg-[#9ca3af]"
                          }`}
                          disabled={Boolean(updatingSlug)}
                          onClick={() => void togglePageStatus(page)}
                          role="switch"
                          type="button"
                          title={updatingSlug === page.slug ? "Updating..." : `Click to ${page.status === "Enabled" ? "disable" : "enable"} ${page.title}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                              page.status === "Enabled" ? "translate-x-[22px]" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f0f4f8] text-[#91a8c1]">
                        <FileText size={22} />
                      </div>
                      <p className="font-semibold text-[#334663]">
                        {filter ? "No pages match your filter" : "No landing pages yet"}
                      </p>
                      <p className="mt-1 text-sm text-[#91a2ba]">
                        {filter ? "Try a different search term." : "Create a landing page to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    </>
  )
}
