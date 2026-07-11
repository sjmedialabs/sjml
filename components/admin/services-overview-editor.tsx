"use client"

import { ImageUpload } from "./image-upload"
import {
  AdminCompactCard,
  AdminFieldGrid,
  CompactField,
  CompactTextarea,
  FontSizePill,
  TypographyPillRow,
} from "./admin-compact-fields"
import type { NormalizedServicesPageContent } from "@/lib/services-page-content"

export function ServicesOverviewEditor({
  content,
  onChange,
}: {
  content: NormalizedServicesPageContent
  onChange: (content: NormalizedServicesPageContent) => void
}) {
  const setHero = (patch: Partial<NormalizedServicesPageContent["hero"]>) =>
    onChange({ ...content, hero: { ...content.hero, ...patch } })
  const setGrid = (patch: Partial<NormalizedServicesPageContent["grid"]>) =>
    onChange({ ...content, grid: { ...content.grid, ...patch } })
  const setCta = (patch: Partial<NormalizedServicesPageContent["cta"]>) =>
    onChange({ ...content, cta: { ...content.cta, ...patch } })
  const setTypo = (patch: Partial<NormalizedServicesPageContent["typography"]>) =>
    onChange({ ...content, typography: { ...content.typography, ...patch } })

  return (
    <div className="space-y-2.5">
      <AdminCompactCard title="Typography">
        <TypographyPillRow>
          <FontSizePill label="Hero label" value={content.typography.heroLabelFontSize} onChange={(v) => setTypo({ heroLabelFontSize: v })} min={8} max={24} />
          <FontSizePill label="Hero title" value={content.typography.heroTitleFontSize} onChange={(v) => setTypo({ heroTitleFontSize: v })} min={16} max={72} />
          <FontSizePill label="Hero text" value={content.typography.heroDescriptionFontSize} onChange={(v) => setTypo({ heroDescriptionFontSize: v })} min={10} max={24} />
          <FontSizePill label="Grid label" value={content.typography.gridLabelFontSize} onChange={(v) => setTypo({ gridLabelFontSize: v })} min={8} max={24} />
          <FontSizePill label="Card title" value={content.typography.cardTitleFontSize} onChange={(v) => setTypo({ cardTitleFontSize: v })} min={10} max={24} />
          <FontSizePill label="Card text" value={content.typography.cardDescriptionFontSize} onChange={(v) => setTypo({ cardDescriptionFontSize: v })} min={10} max={20} />
          <FontSizePill label="Card link" value={content.typography.cardLinkFontSize} onChange={(v) => setTypo({ cardLinkFontSize: v })} min={10} max={18} />
          <FontSizePill label="Card icon" value={content.typography.cardIconSize} onChange={(v) => setTypo({ cardIconSize: v })} min={24} max={56} />
          <FontSizePill label="CTA text" value={content.typography.ctaTextFontSize} onChange={(v) => setTypo({ ctaTextFontSize: v })} min={12} max={32} />
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
        <ImageUpload preset="hero" label="Hero image" value={content.hero.image} onChange={(url) => setHero({ image: url })} />
      </AdminCompactCard>

      <AdminCompactCard title="Grid section">
        <CompactField label="Section label" value={content.grid.label} onChange={(v) => setGrid({ label: v })} />
      </AdminCompactCard>

      <AdminCompactCard title="Bottom CTA">
        <CompactTextarea label="Text" value={content.cta.text} onChange={(v) => setCta({ text: v })} rows={2} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Button text" value={content.cta.buttonText} onChange={(v) => setCta({ buttonText: v })} />
          <CompactField label="Button URL" value={content.cta.buttonUrl} onChange={(v) => setCta({ buttonUrl: v })} />
        </AdminFieldGrid>
      </AdminCompactCard>
    </div>
  )
}
