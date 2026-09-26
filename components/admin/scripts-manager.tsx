"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AdminToast } from "./admin-toast"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import {
  ALL_PAGES_ID,
  canAddScript,
  createEmptyScript,
  getAvailablePages,
  getDropdownPages,
  getPageLabel,
  normalizeScripts,
  type ScriptPlacement,
  type SitePageOption,
  type SiteScript,
} from "@/lib/site-scripts"

function PageMultiSelect({
  pages,
  selected,
  onChange,
  disabled,
}: {
  pages: SitePageOption[]
  selected: string[]
  onChange: (pages: string[]) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  const togglePage = (pageId: string) => {
    if (pageId === ALL_PAGES_ID) {
      onChange(selected.includes(ALL_PAGES_ID) ? [] : [ALL_PAGES_ID])
      return
    }

    const withoutAll = selected.filter((id) => id !== ALL_PAGES_ID)
    if (withoutAll.includes(pageId)) {
      onChange(withoutAll.filter((id) => id !== pageId))
      return
    }
    onChange([...withoutAll, pageId])
  }

  const removePage = (pageId: string) => {
    onChange(selected.filter((id) => id !== pageId))
  }

  const triggerLabel = selected.length
    ? selected.map(getPageLabel).join(", ")
    : pages.length
      ? "Select pages"
      : "No pages available"

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled || pages.length === 0}
            className="admin-input flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className={selected.length ? "admin-text-primary truncate" : "admin-text-secondary truncate"}>
              {triggerLabel}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] max-h-72 overflow-y-auto p-1">
          {pages.length === 0 ? (
            <p className="px-3 py-2 text-sm admin-text-secondary">No pages left to assign.</p>
          ) : (
            pages.map((page) => {
              const checked = selected.includes(page.id)
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => togglePage(page.id)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-black/5"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      checked ? "border-primary bg-primary text-white" : "border-black/20 bg-white"
                    }`}
                  >
                    {checked ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className="admin-text-primary">{page.label}</span>
                </button>
              )
            })
          )}
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((pageId) => (
            <span
              key={pageId}
              className="inline-flex items-center gap-1 rounded-full border admin-border bg-black/5 px-2.5 py-1 text-xs admin-text-primary"
            >
              {getPageLabel(pageId)}
              <button
                type="button"
                onClick={() => removePage(pageId)}
                className="rounded-full p-0.5 hover:bg-black/10"
                aria-label={`Remove ${getPageLabel(pageId)}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ScriptCard({
  script,
  scripts,
  onChange,
  onDelete,
}: {
  script: SiteScript
  scripts: SiteScript[]
  onChange: (updates: Partial<SiteScript>) => void
  onDelete: () => void
}) {
  const dropdownPages = useMemo(
    () => getDropdownPages(scripts, script.placement, script.id, script.pages),
    [scripts, script.placement, script.id, script.pages],
  )

  return (
    <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <Label>Script name</Label>
          <Input
            value={script.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={script.placement === "header" ? "e.g. Google Tag Manager" : "e.g. Chat widget"}
            className="text-base"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <label className="flex items-center gap-2 text-sm admin-text-secondary">
            <input
              type="checkbox"
              checked={script.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
              className="h-4 w-4 accent-[#E63946]"
            />
            Enabled
          </label>
          <Button type="button" variant="outline" size="icon" onClick={onDelete} aria-label="Delete script">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Pages</Label>
        <p className="text-xs admin-text-secondary mb-2">
          Multiselect. Pages already used by another {script.placement} script are hidden.
        </p>
        <PageMultiSelect
          pages={dropdownPages}
          selected={script.pages}
          onChange={(pages) => onChange({ pages })}
        />
      </div>

      <div>
        <Label>Script code</Label>
        <p className="text-xs admin-text-secondary mb-2">
          Paste a full snippet (including <code>&lt;script&gt;</code> tags) or raw JavaScript. To run more than one
          snippet on the same pages, put them in this box together.
        </p>
        <textarea
          className="admin-input min-h-[160px] w-full font-mono text-sm"
          value={script.code}
          onChange={(e) => onChange({ code: e.target.value })}
          placeholder={
            script.placement === "header"
              ? "<!-- Google Tag Manager -->\n<script>...</script>"
              : "<script src=\"https://example.com/widget.js\"></script>"
          }
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export function ScriptsManager() {
  const [scripts, setScripts] = useState<SiteScript[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<SiteScript | null>(null)

  useEffect(() => {
    fetchScripts()
  }, [])

  const fetchScripts = async () => {
    try {
      const res = await fetch("/api/content/scripts")
      if (res.ok) {
        const data = await res.json()
        setScripts(normalizeScripts(data))
      }
    } catch (error) {
      console.error("Failed to fetch scripts:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveScripts = async () => {
    setSaving(true)
    setMessage("")

    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/scripts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scripts }),
      })

      if (res.ok) {
        const data = await res.json()
        setScripts(normalizeScripts(data))
        setMessage("Scripts saved successfully. They will appear on the selected pages.")
      } else {
        const errorData = await res.json().catch(() => ({}))
        setMessage(errorData.error || "Failed to save scripts")
      }
    } catch (error) {
      console.error("Save error:", error)
      setMessage("Error saving scripts")
    } finally {
      setSaving(false)
    }
  }

  const addScript = (placement: ScriptPlacement) => {
    if (!canAddScript(scripts, placement)) {
      setMessage(
        `No pages left for another ${placement} script. Edit an existing one or remove a page assignment first.`,
      )
      return
    }

    const next = createEmptyScript(placement)
    const remaining = getAvailablePages(scripts, placement)
    if (remaining.length === 1 && remaining[0].id !== ALL_PAGES_ID) {
      next.pages = [remaining[0].id]
    }
    setScripts([...scripts, next])
  }

  const updateScript = (id: string, updates: Partial<SiteScript>) => {
    setScripts((current) => current.map((script) => (script.id === id ? { ...script, ...updates } : script)))
  }

  const headerScripts = scripts.filter((script) => script.placement === "header")
  const footerScripts = scripts.filter((script) => script.placement === "footer")

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="admin-text-secondary">Loading scripts...</p>
          </div>
        </div>
      </div>
    )
  }

  const renderList = (placement: ScriptPlacement, items: SiteScript[]) => {
    const canAdd = canAddScript(scripts, placement)

    return (
      <div className="space-y-6 max-w-4xl">
        <div className="admin-card p-6">
          <h2 className="text-xl font-semibold admin-text-primary mb-2">
            {placement === "header" ? "Header scripts" : "Footer scripts"}
          </h2>
          <p className="text-sm admin-text-secondary">
            {placement === "header"
              ? "These snippets are injected into the document head on the pages you select."
              : "These snippets are injected at the end of the page body on the pages you select."}{" "}
            Choose All pages, or pick specific pages. A page used here will not appear when you add the next{" "}
            {placement} script.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="admin-card border admin-border rounded-xl p-8 text-center">
            <p className="admin-text-secondary mb-4">No {placement} scripts yet.</p>
            <Button type="button" onClick={() => addScript(placement)}>
              <Plus className="h-4 w-4" />
              Add {placement} script
            </Button>
          </div>
        ) : (
          items.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              scripts={scripts}
              onChange={(updates) => updateScript(script.id, updates)}
              onDelete={() => setDeleteTarget(script)}
            />
          ))
        )}

        {items.length > 0 && (
          <div>
            <Button type="button" variant="outline" onClick={() => addScript(placement)} disabled={!canAdd}>
              <Plus className="h-4 w-4" />
              Add {placement} script
            </Button>
            {!canAdd && (
              <p className="mt-2 text-xs admin-text-secondary">
                Every page is already assigned. Remove a page from an existing script to add another one.
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold admin-text-primary mb-2">Header & Footer Scripts</h1>
        <p className="admin-text-secondary">
          Add multiple tracking, chat, or custom scripts and assign each one to specific pages or the whole site.
        </p>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="header">Header ({headerScripts.length})</TabsTrigger>
          <TabsTrigger value="footer">Footer ({footerScripts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="header">{renderList("header", headerScripts)}</TabsContent>
        <TabsContent value="footer">{renderList("footer", footerScripts)}</TabsContent>
      </Tabs>

      <div className="flex justify-end items-center mt-8 pt-6 border-t admin-border">
        <Button onClick={saveScripts} disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
          {saving ? "Saving..." : "Save scripts"}
        </Button>
      </div>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Delete this script?"
        description="The script will be removed from the selected pages after you save."
        onConfirm={() => {
          if (!deleteTarget) return
          setScripts((current) => current.filter((script) => script.id !== deleteTarget.id))
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}
