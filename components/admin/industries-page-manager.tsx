"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
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
  createDefaultIndustriesPageContent,
  normalizeIndustriesPageContent,
  INDUSTRY_STAT_ICON_PRESETS,
  type NormalizedIndustriesPageContent,
  type IndustryCardItem,
  type IndustryStatItem,
} from "@/lib/industries-page-content"
import { INDUSTRY_ICON_OPTIONS } from "@/components/industries/industry-icons"

export function IndustriesPageManager() {
  const [activeTab, setActiveTab] = useState<"content" | "cards" | "stats">("content")
  const [content, setContent] = useState<NormalizedIndustriesPageContent>(createDefaultIndustriesPageContent())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/industries-page")
      if (res.ok) {
        const raw = await res.json()
        setContent(normalizeIndustriesPageContent(raw))
      }
    } catch (error) {
      console.error("Failed to fetch industries page", error)
    }
  }

  const saveData = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/industries-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        setMessage("Industries page saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to save industries page")
      }
    } catch {
      setMessage("Failed to save industries page")
    }
    setSaving(false)
  }

  const setHero = (patch: Partial<NormalizedIndustriesPageContent["hero"]>) =>
    setContent({ ...content, hero: { ...content.hero, ...patch } })
  const setExpertise = (patch: Partial<NormalizedIndustriesPageContent["expertise"]>) =>
    setContent({ ...content, expertise: { ...content.expertise, ...patch } })
  const setGrid = (patch: Partial<NormalizedIndustriesPageContent["grid"]>) =>
    setContent({ ...content, grid: { ...content.grid, ...patch } })
  const setCta = (patch: Partial<NormalizedIndustriesPageContent["cta"]>) =>
    setContent({ ...content, cta: { ...content.cta, ...patch } })
  const setTypo = (patch: Partial<NormalizedIndustriesPageContent["typography"]>) =>
    setContent({ ...content, typography: { ...content.typography, ...patch } })

  const updateCard = (index: number, patch: Partial<IndustryCardItem>) => {
    const cards = [...content.cards]
    cards[index] = { ...cards[index], ...patch }
    setContent({ ...content, cards })
  }

  const updateStat = (index: number, patch: Partial<IndustryStatItem>) => {
    const stats = [...content.stats]
    stats[index] = { ...stats[index], ...patch }
    setContent({ ...content, stats })
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold admin-text-primary mb-2">Industries Page</h1>
          <p className="admin-text-secondary">Manage the /industries page content, cards and stats</p>
        </div>
        <Button onClick={saveData} disabled={saving}>
          {saving ? "Saving..." : "Save Page"}
        </Button>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      <div className="flex gap-2 border-b admin-border pb-4 mb-6">
        {(["content", "cards", "stats"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-colors capitalize ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "admin-bg-secondary admin-text-secondary hover:admin-text-primary"
            }`}
          >
            {tab === "content" ? "Page Content" : tab}
          </button>
        ))}
      </div>

      {activeTab === "content" && (
        <div className="space-y-2.5">
          <AdminCompactCard title="Typography">
            <TypographyPillRow>
              <FontSizePill label="Hero label" value={content.typography.heroLabelFontSize} onChange={(v) => setTypo({ heroLabelFontSize: v })} min={8} max={20} />
              <FontSizePill label="Hero title" value={content.typography.heroTitleFontSize} onChange={(v) => setTypo({ heroTitleFontSize: v })} min={16} max={56} />
              <FontSizePill label="Hero text" value={content.typography.heroDescriptionFontSize} onChange={(v) => setTypo({ heroDescriptionFontSize: v })} min={10} max={24} />
              <FontSizePill label="Expertise title" value={content.typography.expertiseTitleFontSize} onChange={(v) => setTypo({ expertiseTitleFontSize: v })} min={14} max={40} />
              <FontSizePill label="Expertise text" value={content.typography.expertiseDescriptionFontSize} onChange={(v) => setTypo({ expertiseDescriptionFontSize: v })} min={10} max={20} />
              <FontSizePill label="Card title" value={content.typography.cardTitleFontSize} onChange={(v) => setTypo({ cardTitleFontSize: v })} min={10} max={24} />
              <FontSizePill label="Card text" value={content.typography.cardDescriptionFontSize} onChange={(v) => setTypo({ cardDescriptionFontSize: v })} min={10} max={18} />
              <FontSizePill label="Card link" value={content.typography.cardLinkFontSize} onChange={(v) => setTypo({ cardLinkFontSize: v })} min={9} max={16} />
              <FontSizePill label="Card icon" value={content.typography.cardIconSize} onChange={(v) => setTypo({ cardIconSize: v })} min={16} max={32} />
              <FontSizePill label="Stat value" value={content.typography.statValueFontSize} onChange={(v) => setTypo({ statValueFontSize: v })} min={16} max={40} />
              <FontSizePill label="Stat label" value={content.typography.statLabelFontSize} onChange={(v) => setTypo({ statLabelFontSize: v })} min={9} max={16} />
              <FontSizePill label="Stat text" value={content.typography.statDescriptionFontSize} onChange={(v) => setTypo({ statDescriptionFontSize: v })} min={9} max={16} />
              <FontSizePill label="CTA heading" value={content.typography.ctaHeadingFontSize} onChange={(v) => setTypo({ ctaHeadingFontSize: v })} min={14} max={32} />
              <FontSizePill label="CTA text" value={content.typography.ctaTextFontSize} onChange={(v) => setTypo({ ctaTextFontSize: v })} min={10} max={20} />
              <FontSizePill label="CTA button" value={content.typography.ctaButtonFontSize} onChange={(v) => setTypo({ ctaButtonFontSize: v })} min={10} max={18} />
            </TypographyPillRow>
          </AdminCompactCard>

          <AdminCompactCard title="Hero">
            <AdminFieldGrid cols={2}>
              <CompactField label="Label" value={content.hero.label} onChange={(v) => setHero({ label: v })} />
              <CompactField label="Title line 1" value={content.hero.titleLine1} onChange={(v) => setHero({ titleLine1: v })} />
              <CompactField label="Title highlight" value={content.hero.titleHighlight} onChange={(v) => setHero({ titleHighlight: v })} />
            </AdminFieldGrid>
            <CompactTextarea label="Description" value={content.hero.description} onChange={(v) => setHero({ description: v })} rows={3} />
            <ImageUpload label="Hero image" value={content.hero.image} onChange={(url) => setHero({ image: url })} />
          </AdminCompactCard>

          <AdminCompactCard title="Our Expertise">
            <CompactField label="Section label" value={content.expertise.label} onChange={(v) => setExpertise({ label: v })} />
            <AdminFieldGrid cols={2}>
              <CompactField label="Title line 1" value={content.expertise.titleLine1} onChange={(v) => setExpertise({ titleLine1: v })} />
              <CompactField label="Title line 2" value={content.expertise.titleLine2} onChange={(v) => setExpertise({ titleLine2: v })} />
            </AdminFieldGrid>
            <CompactTextarea label="Description" value={content.expertise.description} onChange={(v) => setExpertise({ description: v })} rows={3} />
          </AdminCompactCard>

          <AdminCompactCard title="Grid button">
            <AdminFieldGrid cols={2}>
              <CompactField label="Button text" value={content.grid.exploreButtonText} onChange={(v) => setGrid({ exploreButtonText: v })} />
              <CompactField label="Button URL" value={content.grid.exploreButtonUrl} onChange={(v) => setGrid({ exploreButtonUrl: v })} />
            </AdminFieldGrid>
          </AdminCompactCard>

          <AdminCompactCard title="Bottom CTA">
            <CompactField label="Label" value={content.cta.label} onChange={(v) => setCta({ label: v })} />
            <CompactField label="Heading" value={content.cta.heading} onChange={(v) => setCta({ heading: v })} />
            <CompactTextarea label="Text" value={content.cta.text} onChange={(v) => setCta({ text: v })} rows={2} />
            <AdminFieldGrid cols={2}>
              <CompactField label="Button text" value={content.cta.buttonText} onChange={(v) => setCta({ buttonText: v })} />
              <CompactField label="Button URL" value={content.cta.buttonUrl} onChange={(v) => setCta({ buttonUrl: v })} />
            </AdminFieldGrid>
          </AdminCompactCard>
        </div>
      )}

      {activeTab === "cards" && (
        <div className="space-y-2.5">
          {content.cards.map((card, index) => (
            <AdminCompactCard key={card.id} title={`Industry ${index + 1}: ${card.title || "Untitled"}`}>
              <div className="flex justify-end mb-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() =>
                  setContent({ ...content, cards: content.cards.filter((_, i) => i !== index) })
                }>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <AdminFieldGrid cols={2}>
                <CompactField label="Title" value={card.title} onChange={(v) => updateCard(index, { title: v })} />
                <CompactSelect label="Icon" value={card.icon} onChange={(v) => updateCard(index, { icon: v })} options={INDUSTRY_ICON_OPTIONS} />
                <CompactField label="Link text" value={card.linkText} onChange={(v) => updateCard(index, { linkText: v })} />
                <CompactField label="Link URL" value={card.linkUrl} onChange={(v) => updateCard(index, { linkUrl: v })} />
                <CompactField label="Display order" value={String(card.displayOrder)} onChange={(v) => updateCard(index, { displayOrder: Number(v) || 0 })} />
              </AdminFieldGrid>
              <CompactTextarea label="Description" value={card.description} onChange={(v) => updateCard(index, { description: v })} rows={2} />
              <ImageUpload label="Card image" value={card.image} onChange={(url) => updateCard(index, { image: url })} />
              <label className="inline-flex items-center gap-2 text-xs admin-text-secondary mt-1">
                <input type="checkbox" checked={card.isActive} onChange={(e) => updateCard(index, { isActive: e.target.checked })} />
                Active
              </label>
            </AdminCompactCard>
          ))}
          <Button variant="outline" size="sm" onClick={() =>
            setContent({
              ...content,
              cards: [
                ...content.cards,
                {
                  id: Date.now().toString(),
                  title: "",
                  description: "",
                  image: "",
                  icon: "real-estate",
                  linkText: "VIEW OUR WORK",
                  linkUrl: "/work",
                  displayOrder: content.cards.length,
                  isActive: true,
                },
              ],
            })
          }>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add industry card
          </Button>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-2.5">
          {content.stats.map((stat, index) => (
            <AdminCompactCard key={stat.id} title={`Stat ${index + 1}`}>
              <AdminFieldGrid cols={2}>
                <CompactField label="Value" value={stat.value} onChange={(v) => updateStat(index, { value: v })} />
                <CompactSelect label="Icon" value={stat.icon} onChange={(v) => updateStat(index, { icon: v })} options={INDUSTRY_STAT_ICON_PRESETS.map((o) => ({ value: o, label: o }))} />
                <CompactField label="Label" value={stat.label} onChange={(v) => updateStat(index, { label: v })} />
              </AdminFieldGrid>
              <CompactTextarea label="Description" value={stat.description} onChange={(v) => updateStat(index, { description: v })} rows={2} />
            </AdminCompactCard>
          ))}
        </div>
      )}
    </div>
  )
}
