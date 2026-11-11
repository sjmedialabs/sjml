"use client"

import { Eye, FileText, Pencil, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

function formatISTDateTime(dateString: string): string {
  if (!dateString) return "—"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    const datePart = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)

    const timePart = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date).toUpperCase()

    return `${datePart}, ${timePart}`
  } catch {
    return dateString
  }
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
    `${page.title} ${page.route} ${page.status} ${page.template}`.toLowerCase().includes(filter.toLowerCase()),
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
        <div className="flex min-h-[50vh] items-center justify-center text-sm admin-text-secondary">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3" />
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
    <div>
      <AdminToast message={actionMessage} onClose={() => setActionMessage("")} duration={3000} />

      {/* Header */}
      <div className="mb-8 flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold admin-text-primary mb-2">Landing Pages</h1>
          <p className="admin-text-secondary">
            Manage landing pages, custom templates, and marketing campaign URLs
          </p>
        </div>
        <Button
          onClick={() => {
            setActionMessage("New landing page form opened")
            updateEditorUrl("create")
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" /> New Page
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 admin-text-secondary" />
          <Input
            placeholder="Search pages..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="pl-10 admin-bg-secondary admin-border-light admin-text-primary w-64 sm:w-80"
          />
        </div>
        <div className="text-sm admin-text-secondary">
          {isLoadingPages
            ? "Loading pages..."
            : `${filteredPages.length} ${filteredPages.length === 1 ? "page" : "pages"}`}
        </div>
      </div>

      {actionError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {actionError}
        </div>
      )}

      {/* Table Card */}
      <div className="admin-card border admin-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b admin-border">
                <th className="p-4 admin-text-secondary font-medium">Page</th>
                <th className="p-4 admin-text-secondary font-medium">Route</th>
                <th className="p-4 admin-text-secondary font-medium">Status</th>
                <th className="p-4 admin-text-secondary font-medium">Template</th>
                <th className="p-4 admin-text-secondary font-medium text-center">Sections</th>
                <th className="p-4 admin-text-secondary font-medium">Updated</th>
                <th className="p-4 admin-text-secondary font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPages ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : pagesError ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm text-red-600">
                    {pagesError}
                  </td>
                </tr>
              ) : filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <tr
                    key={page.route}
                    className="border-b admin-border hover:admin-bg-secondary transition-colors"
                  >
                    <td className="p-4">
                      <a
                        className="admin-text-primary font-medium hover:text-primary transition-colors block"
                        href={`${page.route}?preview=1`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {page.title}
                      </a>
                    </td>
                    <td className="p-4">
                      <a
                        className="admin-text-secondary hover:text-primary transition-colors text-sm font-mono"
                        href={`${page.route}?preview=1`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {page.route}
                      </a>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          page.status === "Enabled"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-gray-500/10 admin-text-muted border-gray-500/20"
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="p-4 admin-text-secondary text-sm">
                      {page.template}
                    </td>
                    <td className="p-4 admin-text-secondary text-sm text-center">
                      {page.sections}
                    </td>
                    <td className="p-4 admin-text-muted text-sm whitespace-nowrap">
                      {formatISTDateTime(page.updated)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="admin-border-light admin-text-secondary hover:admin-bg-secondary h-8 px-2.5 text-xs bg-transparent"
                        >
                          <a href={`${page.route}?preview=1`} target="_blank" rel="noreferrer">
                            <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActionMessage(`${page.title} editor opened`)
                            updateEditorUrl("edit", page.slug)
                          }}
                          className="admin-border-light admin-text-secondary hover:admin-bg-secondary h-8 px-2.5 text-xs bg-transparent"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <button
                          aria-checked={page.status === "Enabled"}
                          aria-label={`${page.title} is ${page.status.toLowerCase()}`}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-wait disabled:opacity-50 ${
                            page.status === "Enabled" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                          disabled={Boolean(updatingSlug)}
                          onClick={() => void togglePageStatus(page)}
                          role="switch"
                          type="button"
                          title={
                            updatingSlug === page.slug
                              ? "Updating..."
                              : `Click to ${page.status === "Enabled" ? "disable" : "enable"} ${page.title}`
                          }
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
                  <td colSpan={7} className="p-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl admin-bg-secondary admin-text-muted">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="font-semibold admin-text-primary text-base">
                        {filter ? "No pages match your filter" : "No landing pages yet"}
                      </p>
                      <p className="mt-1 text-sm admin-text-muted">
                        {filter
                          ? "Try a different search term."
                          : "Click 'New Page' above to create your first landing page."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
