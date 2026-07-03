"use client"

import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import {
  AdminCompactCard,
  AdminFieldGrid,
  CompactField,
  CompactTextarea,
  FontSizePill,
  TypographyPillRow,
} from "./admin-compact-fields"
import type { InsightDetailTemplate } from "@/lib/insight-detail-template"

export function InsightDetailTemplateEditor({
  template,
  onChange,
}: {
  template: InsightDetailTemplate
  onChange: (template: InsightDetailTemplate) => void
}) {
  const setTypo = (patch: Partial<InsightDetailTemplate["typography"]>) =>
    onChange({ ...template, typography: { ...template.typography, ...patch } })

  const updateSection = (index: number, patch: Partial<InsightDetailTemplate["sections"][0]>) => {
    const sections = [...template.sections]
    sections[index] = { ...sections[index], ...patch }
    onChange({ ...template, sections })
  }

  const updateSectionParagraph = (sectionIndex: number, paragraphIndex: number, value: string) => {
    const sections = [...template.sections]
    const paragraphs = [...sections[sectionIndex].paragraphs]
    paragraphs[paragraphIndex] = value
    sections[sectionIndex] = { ...sections[sectionIndex], paragraphs }
    onChange({ ...template, sections })
  }

  return (
    <div className="space-y-2.5">
      <AdminCompactCard title="Detail typography">
        <TypographyPillRow>
          <FontSizePill label="Category" value={template.typography.categoryFontSize} onChange={(v) => setTypo({ categoryFontSize: v })} min={8} max={16} />
          <FontSizePill label="Title" value={template.typography.titleFontSize} onChange={(v) => setTypo({ titleFontSize: v })} min={16} max={56} />
          <FontSizePill label="Intro" value={template.typography.introFontSize} onChange={(v) => setTypo({ introFontSize: v })} min={10} max={20} />
          <FontSizePill label="Section heading" value={template.typography.sectionHeadingFontSize} onChange={(v) => setTypo({ sectionHeadingFontSize: v })} min={10} max={24} />
          <FontSizePill label="Body" value={template.typography.bodyFontSize} onChange={(v) => setTypo({ bodyFontSize: v })} min={10} max={20} />
        </TypographyPillRow>
      </AdminCompactCard>

      <AdminCompactCard title="Article body">
        <CompactTextarea label="Intro paragraph" value={template.introParagraph} onChange={(v) => onChange({ ...template, introParagraph: v })} rows={3} />
        <CompactField label="Closing statement" value={template.closingStatement} onChange={(v) => onChange({ ...template, closingStatement: v })} />
        {template.sections.map((section, index) => (
          <div key={section.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs admin-text-secondary">Section {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-400"
                onClick={() => onChange({ ...template, sections: template.sections.filter((_, i) => i !== index) })}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <CompactField label="Heading" value={section.heading} onChange={(v) => updateSection(index, { heading: v })} />
            {section.paragraphs.map((paragraph, pIndex) => (
              <CompactTextarea
                key={pIndex}
                label={`Paragraph ${pIndex + 1}`}
                value={paragraph}
                onChange={(v) => updateSectionParagraph(index, pIndex, v)}
                rows={3}
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const sections = [...template.sections]
                sections[index] = { ...section, paragraphs: [...section.paragraphs, ""] }
                onChange({ ...template, sections })
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add paragraph
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...template,
              sections: [
                ...template.sections,
                { id: String(Date.now()), heading: `${template.sections.length + 1}. New section`, paragraphs: [""] },
              ],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add section
        </Button>
      </AdminCompactCard>

      <AdminCompactCard title="Share">
        <CompactField label="Share label" value={template.shareLabel} onChange={(v) => onChange({ ...template, shareLabel: v })} />
        {template.shareLinks.map((link, index) => (
          <AdminFieldGrid cols={2} key={link.id}>
            <CompactField label="Platform" value={link.platform} onChange={(v) => {
              const shareLinks = [...template.shareLinks]
              shareLinks[index] = { ...link, platform: v }
              onChange({ ...template, shareLinks })
            }} />
            <CompactField label="URL" value={link.url} onChange={(v) => {
              const shareLinks = [...template.shareLinks]
              shareLinks[index] = { ...link, url: v }
              onChange({ ...template, shareLinks })
            }} />
          </AdminFieldGrid>
        ))}
      </AdminCompactCard>
    </div>
  )
}
