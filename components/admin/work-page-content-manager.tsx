"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import {
  AdminCompactCard,
  AdminFieldGrid,
  CompactField,
  CompactSelect,
  CompactTextarea,
  FontSizePill,
  TypographyPillRow,
} from "./admin-compact-fields"
import {
  createDefaultWorkPageContent,
  normalizeWorkPageContent,
  type NormalizedWorkPageContent,
  type WorkPageFilterCategory,
  type WorkPageStatItem,
} from "@/lib/work-page-content"
import { STAT_ICON_PRESETS } from "@/components/stats-icons"

export function WorkPageContentManager() {
  const [content, setContent] = useState<NormalizedWorkPageContent>(createDefaultWorkPageContent())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/content/work-page")
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => {
        if (raw) setContent(normalizeWorkPageContent(raw))
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/work-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      })
      setMessage(res.ok ? "Work page saved!" : "Failed to save")
      if (res.ok) setTimeout(() => setMessage(""), 3000)
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const setHero = (patch: Partial<NormalizedWorkPageContent["hero"]>) =>
    setContent({ ...content, hero: { ...content.hero, ...patch } })
  const setCta = (patch: Partial<NormalizedWorkPageContent["cta"]>) =>
    setContent({ ...content, cta: { ...content.cta, ...patch } })
  const setTypo = (patch: Partial<NormalizedWorkPageContent["typography"]>) =>
    setContent({ ...content, typography: { ...content.typography, ...patch } })
  const setTestimonial = (patch: Partial<NormalizedWorkPageContent["testimonial"]>) =>
    setContent({ ...content, testimonial: { ...content.testimonial, ...patch } })

  const updateFilter = (index: number, patch: Partial<WorkPageFilterCategory>) => {
    const filterCategories = [...content.filterCategories]
    filterCategories[index] = { ...filterCategories[index], ...patch }
    setContent({ ...content, filterCategories })
  }

  const updateStat = (index: number, patch: Partial<WorkPageStatItem>) => {
    const stats = [...content.stats]
    stats[index] = { ...stats[index], ...patch }
    setContent({ ...content, stats })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold admin-text-primary mb-1">Work Page Content</h2>
          <p className="admin-text-secondary text-sm">Hero, filters, stats, testimonial and CTA on /work</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Page"}</Button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">{message}</div>
      )}

      <div className="space-y-2.5">
        <AdminCompactCard title="Typography">
          <TypographyPillRow>
            <FontSizePill label="Hero label" value={content.typography.heroLabelFontSize} onChange={(v) => setTypo({ heroLabelFontSize: v })} min={8} max={20} />
            <FontSizePill label="Hero title" value={content.typography.heroTitleFontSize} onChange={(v) => setTypo({ heroTitleFontSize: v })} min={16} max={56} />
            <FontSizePill label="Filter" value={content.typography.filterFontSize} onChange={(v) => setTypo({ filterFontSize: v })} min={8} max={16} />
            <FontSizePill label="Card title" value={content.typography.cardTitleFontSize} onChange={(v) => setTypo({ cardTitleFontSize: v })} min={10} max={24} />
            <FontSizePill label="Stat value" value={content.typography.statValueFontSize} onChange={(v) => setTypo({ statValueFontSize: v })} min={16} max={40} />
            <FontSizePill label="CTA text" value={content.typography.ctaTextFontSize} onChange={(v) => setTypo({ ctaTextFontSize: v })} min={12} max={28} />
          </TypographyPillRow>
        </AdminCompactCard>

        <AdminCompactCard title="Hero">
          <CompactField label="Label" value={content.hero.label} onChange={(v) => setHero({ label: v })} />
          <AdminFieldGrid cols={2}>
            <CompactField label="Title line 1" value={content.hero.titleLine1} onChange={(v) => setHero({ titleLine1: v })} />
            <CompactField label="Title highlight" value={content.hero.titleHighlight} onChange={(v) => setHero({ titleHighlight: v })} />
          </AdminFieldGrid>
          <CompactTextarea label="Description" value={content.hero.description} onChange={(v) => setHero({ description: v })} rows={3} />
          <ImageUpload label="Hero image" value={content.hero.image} onChange={(url) => setHero({ image: url })} />
        </AdminCompactCard>

        <AdminCompactCard title="Filter categories">
          <CompactField label="Industry dropdown label" value={content.industryFilterLabel} onChange={(v) => setContent({ ...content, industryFilterLabel: v })} />
          {content.filterCategories.map((cat, index) => (
            <AdminFieldGrid cols={2} key={cat.id}>
              <CompactField label="Label" value={cat.label} onChange={(v) => updateFilter(index, { label: v })} />
              <CompactField label="Value" value={cat.value} onChange={(v) => updateFilter(index, { value: v })} />
            </AdminFieldGrid>
          ))}
        </AdminCompactCard>

        <AdminCompactCard title="Stats">
          {content.stats.map((stat, index) => (
            <div key={stat.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
              <AdminFieldGrid cols={2}>
                <CompactField label="Value" value={stat.value} onChange={(v) => updateStat(index, { value: v })} />
                <CompactField label="Label" value={stat.label} onChange={(v) => updateStat(index, { label: v })} />
                <CompactSelect label="Icon" value={stat.icon} onChange={(v) => updateStat(index, { icon: v })} options={Object.keys(STAT_ICON_PRESETS).map((k) => ({ value: k, label: k }))} />
              </AdminFieldGrid>
              <CompactTextarea label="Description" value={stat.description} onChange={(v) => updateStat(index, { description: v })} rows={2} />
            </div>
          ))}
        </AdminCompactCard>

        <AdminCompactCard title="Testimonial">
          <CompactTextarea label="Quote" value={content.testimonial.quote} onChange={(v) => setTestimonial({ quote: v })} rows={3} />
          <AdminFieldGrid cols={2}>
            <CompactField label="Author" value={content.testimonial.author} onChange={(v) => setTestimonial({ author: v })} />
            <CompactField label="Role" value={content.testimonial.role} onChange={(v) => setTestimonial({ role: v })} />
          </AdminFieldGrid>
        </AdminCompactCard>

        <AdminCompactCard title="Bottom CTA">
          <AdminFieldGrid cols={2}>
            <CompactField label="Text line 1" value={content.cta.textLine1} onChange={(v) => setCta({ textLine1: v })} />
            <CompactField label="Highlight" value={content.cta.textHighlight} onChange={(v) => setCta({ textHighlight: v })} />
            <CompactField label="Button text" value={content.cta.buttonText} onChange={(v) => setCta({ buttonText: v })} />
            <CompactField label="Button URL" value={content.cta.buttonUrl} onChange={(v) => setCta({ buttonUrl: v })} />
          </AdminFieldGrid>
        </AdminCompactCard>
      </div>
    </div>
  )
}
