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
  createDefaultContactPageContent,
  normalizeContactPageContent,
  type NormalizedContactPageContent,
} from "@/lib/contact-page-content"

export function ContactPageManager() {
  const [content, setContent] = useState<NormalizedContactPageContent>(createDefaultContactPageContent())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/content/contact-page")
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => {
        if (raw) setContent(normalizeContactPageContent(raw))
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/contact-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      })
      setMessage(res.ok ? "Contact page saved!" : "Failed to save")
      if (res.ok) setTimeout(() => setMessage(""), 3000)
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const setHero = (patch: Partial<NormalizedContactPageContent["hero"]>) =>
    setContent({ ...content, hero: { ...content.hero, ...patch } })
  const setInfo = (patch: Partial<NormalizedContactPageContent["info"]>) =>
    setContent({ ...content, info: { ...content.info, ...patch } })
  const setForm = (patch: Partial<NormalizedContactPageContent["form"]>) =>
    setContent({ ...content, form: { ...content.form, ...patch } })
  const setMap = (patch: Partial<NormalizedContactPageContent["map"]>) =>
    setContent({ ...content, map: { ...content.map, ...patch } })
  const setBottomCta = (patch: Partial<NormalizedContactPageContent["bottomCta"]>) =>
    setContent({ ...content, bottomCta: { ...content.bottomCta, ...patch } })
  const setTypo = (patch: Partial<NormalizedContactPageContent["typography"]>) =>
    setContent({ ...content, typography: { ...content.typography, ...patch } })

  const updateInfoItem = (index: number, value: string, href?: string) => {
    const items = [...content.info.items]
    items[index] = { ...items[index], value, href }
    setInfo({ items })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold admin-text-primary mb-1">Contact Page</h1>
          <p className="admin-text-secondary text-sm">Hero, contact info, form, map and bottom CTA</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Page"}</Button>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      <div className="space-y-2.5">
        <AdminCompactCard title="Typography">
          <TypographyPillRow>
            <FontSizePill label="Hero title" value={content.typography.heroTitleFontSize} onChange={(v) => setTypo({ heroTitleFontSize: v })} min={16} max={56} />
            <FontSizePill label="Hero text" value={content.typography.heroDescriptionFontSize} onChange={(v) => setTypo({ heroDescriptionFontSize: v })} min={10} max={24} />
            <FontSizePill label="Section label" value={content.typography.sectionLabelFontSize} onChange={(v) => setTypo({ sectionLabelFontSize: v })} min={8} max={20} />
            <FontSizePill label="Section heading" value={content.typography.sectionHeadingFontSize} onChange={(v) => setTypo({ sectionHeadingFontSize: v })} min={16} max={40} />
            <FontSizePill label="Info text" value={content.typography.infoValueFontSize} onChange={(v) => setTypo({ infoValueFontSize: v })} min={10} max={18} />
            <FontSizePill label="Form label" value={content.typography.formLabelFontSize} onChange={(v) => setTypo({ formLabelFontSize: v })} min={10} max={18} />
            <FontSizePill label="CTA text" value={content.typography.ctaTextFontSize} onChange={(v) => setTypo({ ctaTextFontSize: v })} min={10} max={20} />
            <FontSizePill label="CTA button" value={content.typography.ctaButtonFontSize} onChange={(v) => setTypo({ ctaButtonFontSize: v })} min={10} max={18} />
          </TypographyPillRow>
        </AdminCompactCard>

        <AdminCompactCard title="Hero">
          <AdminFieldGrid cols={3}>
            <CompactField label="Title line 1" value={content.hero.titleLine1} onChange={(v) => setHero({ titleLine1: v })} />
            <CompactField label="Title highlight" value={content.hero.titleHighlight} onChange={(v) => setHero({ titleHighlight: v })} />
            <CompactField label="Title line 2" value={content.hero.titleLine2} onChange={(v) => setHero({ titleLine2: v })} />
          </AdminFieldGrid>
          <CompactTextarea label="Description" value={content.hero.description} onChange={(v) => setHero({ description: v })} rows={2} />
          <ImageUpload preset="hero" label="Hero image" value={content.hero.image} onChange={(url) => setHero({ image: url })} />
        </AdminCompactCard>

        <AdminCompactCard title="Get in touch">
          <AdminFieldGrid cols={2}>
            <CompactField label="Label" value={content.info.label} onChange={(v) => setInfo({ label: v })} />
            <CompactField label="Heading" value={content.info.heading} onChange={(v) => setInfo({ heading: v })} />
          </AdminFieldGrid>
          {content.info.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <CompactField label={`${item.icon} — value`} value={item.value} onChange={(v) => updateInfoItem(index, v, item.href)} />
              {(item.icon === "phone" || item.icon === "email") && (
                <CompactField
                  label={`${item.icon} — link (optional)`}
                  value={item.href ?? ""}
                  onChange={(v) => updateInfoItem(index, item.value, v)}
                />
              )}
            </div>
          ))}
          <CompactField label="Email callout text" value={content.info.emailCalloutText} onChange={(v) => setInfo({ emailCalloutText: v })} />
          <CompactField label="Email callout email" value={content.info.emailCalloutEmail} onChange={(v) => setInfo({ emailCalloutEmail: v })} />
        </AdminCompactCard>

        <AdminCompactCard title="Contact form">
          <AdminFieldGrid cols={2}>
            <CompactField label="Label" value={content.form.label} onChange={(v) => setForm({ label: v })} />
            <CompactField label="Heading" value={content.form.heading} onChange={(v) => setForm({ heading: v })} />
          </AdminFieldGrid>
          <AdminFieldGrid cols={2}>
            <CompactField label="Name placeholder" value={content.form.namePlaceholder} onChange={(v) => setForm({ namePlaceholder: v })} />
            <CompactField label="Email placeholder" value={content.form.emailPlaceholder} onChange={(v) => setForm({ emailPlaceholder: v })} />
            <CompactField label="Phone placeholder" value={content.form.phonePlaceholder} onChange={(v) => setForm({ phonePlaceholder: v })} />
            <CompactField label="Company placeholder" value={content.form.companyPlaceholder} onChange={(v) => setForm({ companyPlaceholder: v })} />
            <CompactField label="Service placeholder" value={content.form.servicePlaceholder} onChange={(v) => setForm({ servicePlaceholder: v })} />
            <CompactField label="Message placeholder" value={content.form.messagePlaceholder} onChange={(v) => setForm({ messagePlaceholder: v })} />
          </AdminFieldGrid>
          <CompactField label="Button text" value={content.form.buttonText} onChange={(v) => setForm({ buttonText: v })} />
          <CompactField
            label="Service options (comma separated)"
            value={content.form.serviceOptions.join(", ")}
            onChange={(v) => setForm({ serviceOptions: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <AdminFieldGrid cols={2}>
            <CompactField label="Privacy label" value={content.form.privacyLabel} onChange={(v) => setForm({ privacyLabel: v })} />
            <CompactField label="Privacy URL" value={content.form.privacyUrl} onChange={(v) => setForm({ privacyUrl: v })} />
          </AdminFieldGrid>
        </AdminCompactCard>

        <AdminCompactCard title="Map">
          <CompactField label="Embed URL" value={content.map.embedUrl} onChange={(v) => setMap({ embedUrl: v })} />
        </AdminCompactCard>

        <AdminCompactCard title="Bottom CTA">
          <CompactTextarea label="Text" value={content.bottomCta.text} onChange={(v) => setBottomCta({ text: v })} rows={2} />
          <AdminFieldGrid cols={2}>
            <CompactField label="Button text" value={content.bottomCta.buttonText} onChange={(v) => setBottomCta({ buttonText: v })} />
            <CompactField label="Button URL" value={content.bottomCta.buttonUrl} onChange={(v) => setBottomCta({ buttonUrl: v })} />
          </AdminFieldGrid>
        </AdminCompactCard>
      </div>
    </div>
  )
}
