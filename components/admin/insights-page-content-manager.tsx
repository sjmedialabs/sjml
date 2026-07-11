"use client"

import { AdminToast } from "./admin-toast"
import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import {
  AdminCompactCard,
  AdminFieldGrid,
  CompactField,
  CompactTextarea,
  FontSizePill,
  TypographyPillRow,
} from "./admin-compact-fields"
import {
  createDefaultInsightsPageContent,
  normalizeInsightsPageContent,
  type NormalizedInsightsPageContent,
  type InsightsPageFilterCategory,
} from "@/lib/insights-page-content"

export function InsightsPageContentManager() {
  const [content, setContent] = useState<NormalizedInsightsPageContent>(createDefaultInsightsPageContent())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/content/insights-page")
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => {
        if (raw) setContent(normalizeInsightsPageContent(raw))
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/insights-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      })
      setMessage(res.ok ? "Insights page saved!" : "Failed to save")
      if (res.ok) setTimeout(() => setMessage(""), 3000)
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const setHero = (patch: Partial<NormalizedInsightsPageContent["hero"]>) =>
    setContent({ ...content, hero: { ...content.hero, ...patch } })
  const setTypo = (patch: Partial<NormalizedInsightsPageContent["typography"]>) =>
    setContent({ ...content, typography: { ...content.typography, ...patch } })
  const setNewsletter = (patch: Partial<NormalizedInsightsPageContent["sidebarNewsletter"]>) =>
    setContent({ ...content, sidebarNewsletter: { ...content.sidebarNewsletter, ...patch } })
  const setLoadMore = (patch: Partial<NormalizedInsightsPageContent["loadMore"]>) =>
    setContent({ ...content, loadMore: { ...content.loadMore, ...patch } })

  const updateFilter = (index: number, patch: Partial<InsightsPageFilterCategory>) => {
    const filterCategories = [...content.filterCategories]
    filterCategories[index] = { ...filterCategories[index], ...patch }
    setContent({ ...content, filterCategories })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold admin-text-primary mb-1">Insights Page Content</h2>
          <p className="admin-text-secondary text-sm">Hero, filters, load more and sidebar on /insights</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Page"}</Button>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      <div className="space-y-2.5">
        <AdminCompactCard title="Typography">
          <TypographyPillRow>
            <FontSizePill label="Hero label" value={content.typography.heroLabelFontSize} onChange={(v) => setTypo({ heroLabelFontSize: v })} min={8} max={20} />
            <FontSizePill label="Hero title" value={content.typography.heroTitleFontSize} onChange={(v) => setTypo({ heroTitleFontSize: v })} min={16} max={56} />
            <FontSizePill label="Hero text" value={content.typography.heroDescriptionFontSize} onChange={(v) => setTypo({ heroDescriptionFontSize: v })} min={10} max={24} />
            <FontSizePill label="Filter" value={content.typography.filterFontSize} onChange={(v) => setTypo({ filterFontSize: v })} min={8} max={16} />
            <FontSizePill label="Search" value={content.typography.searchFontSize} onChange={(v) => setTypo({ searchFontSize: v })} min={10} max={18} />
            <FontSizePill label="Card category" value={content.typography.cardCategoryFontSize} onChange={(v) => setTypo({ cardCategoryFontSize: v })} min={8} max={14} />
            <FontSizePill label="Card title" value={content.typography.cardTitleFontSize} onChange={(v) => setTypo({ cardTitleFontSize: v })} min={10} max={24} />
            <FontSizePill label="Card excerpt" value={content.typography.cardExcerptFontSize} onChange={(v) => setTypo({ cardExcerptFontSize: v })} min={10} max={18} />
            <FontSizePill label="Card meta" value={content.typography.cardMetaFontSize} onChange={(v) => setTypo({ cardMetaFontSize: v })} min={9} max={16} />
            <FontSizePill label="Load more" value={content.typography.loadMoreFontSize} onChange={(v) => setTypo({ loadMoreFontSize: v })} min={9} max={16} />
            <FontSizePill label="Sidebar heading" value={content.typography.sidebarHeadingFontSize} onChange={(v) => setTypo({ sidebarHeadingFontSize: v })} min={8} max={16} />
            <FontSizePill label="Sidebar card title" value={content.typography.sidebarCardTitleFontSize} onChange={(v) => setTypo({ sidebarCardTitleFontSize: v })} min={10} max={18} />
            <FontSizePill label="Sidebar card meta" value={content.typography.sidebarCardMetaFontSize} onChange={(v) => setTypo({ sidebarCardMetaFontSize: v })} min={9} max={16} />
            <FontSizePill label="Newsletter text" value={content.typography.newsletterTextFontSize} onChange={(v) => setTypo({ newsletterTextFontSize: v })} min={10} max={18} />
            <FontSizePill label="Newsletter btn" value={content.typography.newsletterButtonFontSize} onChange={(v) => setTypo({ newsletterButtonFontSize: v })} min={9} max={16} />
          </TypographyPillRow>
        </AdminCompactCard>

        <AdminCompactCard title="Hero">
          <CompactField label="Label" value={content.hero.label} onChange={(v) => setHero({ label: v })} />
          <AdminFieldGrid cols={2}>
            <CompactField label="Title line 1" value={content.hero.titleLine1} onChange={(v) => setHero({ titleLine1: v })} />
            <CompactField label="Title highlight" value={content.hero.titleHighlight} onChange={(v) => setHero({ titleHighlight: v })} />
          </AdminFieldGrid>
          <CompactTextarea label="Description" value={content.hero.description} onChange={(v) => setHero({ description: v })} rows={3} />
          <ImageUpload preset="hero" label="Hero image" value={content.hero.image} onChange={(url) => setHero({ image: url })} />
        </AdminCompactCard>

        <AdminCompactCard title="Filter categories">
          {content.filterCategories.map((cat, index) => (
            <AdminFieldGrid cols={2} key={cat.id}>
              <CompactField label="Label" value={cat.label} onChange={(v) => updateFilter(index, { label: v })} />
              <CompactField label="Value" value={cat.value} onChange={(v) => updateFilter(index, { value: v })} />
            </AdminFieldGrid>
          ))}
          <CompactField label="Search placeholder" value={content.searchPlaceholder} onChange={(v) => setContent({ ...content, searchPlaceholder: v })} />
        </AdminCompactCard>

        <AdminCompactCard title="Load more">
          <CompactField label="Button text" value={content.loadMore.buttonText} onChange={(v) => setLoadMore({ buttonText: v })} />
          <AdminFieldGrid cols={2}>
            <CompactField label="Initial visible" value={String(content.loadMore.initialVisible)} onChange={(v) => setLoadMore({ initialVisible: Number.parseInt(v) || 6 })} />
            <CompactField label="Load batch" value={String(content.loadMore.loadBatch)} onChange={(v) => setLoadMore({ loadBatch: Number.parseInt(v) || 3 })} />
          </AdminFieldGrid>
        </AdminCompactCard>

        <AdminCompactCard title="Detail sidebar">
          <CompactField label="Related heading" value={content.relatedHeading} onChange={(v) => setContent({ ...content, relatedHeading: v })} />
          <CompactField label="Newsletter heading" value={content.sidebarNewsletter.heading} onChange={(v) => setNewsletter({ heading: v })} />
          <CompactTextarea label="Newsletter text" value={content.sidebarNewsletter.text} onChange={(v) => setNewsletter({ text: v })} rows={2} />
          <AdminFieldGrid cols={2}>
            <CompactField label="Email placeholder" value={content.sidebarNewsletter.placeholder} onChange={(v) => setNewsletter({ placeholder: v })} />
            <CompactField label="Subscribe button" value={content.sidebarNewsletter.buttonText} onChange={(v) => setNewsletter({ buttonText: v })} />
          </AdminFieldGrid>
        </AdminCompactCard>
      </div>
    </div>
  )
}
