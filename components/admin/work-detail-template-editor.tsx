"use client"

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
  WORK_METRIC_ICON_PRESETS,
  WORK_PILLAR_ICON_PRESETS,
  type WorkDetailTemplate,
} from "@/lib/work-detail-template"

export function WorkDetailTemplateEditor({
  template,
  onChange,
}: {
  template: WorkDetailTemplate
  onChange: (template: WorkDetailTemplate) => void
}) {
  const setTypo = (patch: Partial<WorkDetailTemplate["typography"]>) =>
    onChange({ ...template, typography: { ...template.typography, ...patch } })

  const setMeta = (patch: Partial<WorkDetailTemplate["meta"]>) =>
    onChange({ ...template, meta: { ...template.meta, ...patch } })

  const setTestimonial = (patch: Partial<WorkDetailTemplate["testimonial"]>) =>
    onChange({ ...template, testimonial: { ...template.testimonial, ...patch } })

  const setProjectDetails = (patch: Partial<WorkDetailTemplate["projectDetails"]>) =>
    onChange({ ...template, projectDetails: { ...template.projectDetails, ...patch } })

  const setBottomCta = (patch: Partial<WorkDetailTemplate["bottomCta"]>) =>
    onChange({ ...template, bottomCta: { ...template.bottomCta, ...patch } })

  return (
    <div className="space-y-2.5">
      <AdminCompactCard title="Detail typography">
        <TypographyPillRow>
          <FontSizePill label="Category" value={template.typography.categoryFontSize} onChange={(v) => setTypo({ categoryFontSize: v })} min={8} max={20} />
          <FontSizePill label="Title" value={template.typography.titleFontSize} onChange={(v) => setTypo({ titleFontSize: v })} min={16} max={56} />
          <FontSizePill label="Subtitle" value={template.typography.subtitleFontSize} onChange={(v) => setTypo({ subtitleFontSize: v })} min={10} max={24} />
          <FontSizePill label="Intro" value={template.typography.introFontSize} onChange={(v) => setTypo({ introFontSize: v })} min={10} max={20} />
          <FontSizePill label="Metric value" value={template.typography.metricValueFontSize} onChange={(v) => setTypo({ metricValueFontSize: v })} min={16} max={48} />
          <FontSizePill label="Testimonial" value={template.typography.testimonialFontSize} onChange={(v) => setTypo({ testimonialFontSize: v })} min={10} max={20} />
        </TypographyPillRow>
      </AdminCompactCard>

      <AdminCompactCard title="Hero">
        <CompactField label="Category tags" value={template.categoryTags} onChange={(v) => onChange({ ...template, categoryTags: v })} />
        <CompactField label="Subtitle" value={template.subtitle} onChange={(v) => onChange({ ...template, subtitle: v })} />
        <CompactTextarea label="Intro paragraph" value={template.introParagraph} onChange={(v) => onChange({ ...template, introParagraph: v })} rows={3} />
        <ImageUpload preset="cardWide" label="Hero image" value={template.heroImage} onChange={(url) => onChange({ ...template, heroImage: url })} />
        <AdminFieldGrid cols={3}>
          <CompactField label="Year" value={template.meta.year} onChange={(v) => setMeta({ year: v })} />
          <CompactField label="Industry" value={template.meta.industry} onChange={(v) => setMeta({ industry: v })} />
          <CompactField label="Location" value={template.meta.location} onChange={(v) => setMeta({ location: v })} />
        </AdminFieldGrid>
      </AdminCompactCard>

      <AdminCompactCard title="Project overview">
        <CompactField label="Section label" value={template.projectLabel} onChange={(v) => onChange({ ...template, projectLabel: v })} />
        <CompactField label="Overview title" value={template.overviewTitle} onChange={(v) => onChange({ ...template, overviewTitle: v })} />
        <CompactTextarea label="Overview text" value={template.overviewText} onChange={(v) => onChange({ ...template, overviewText: v })} rows={3} />
        {template.pillars.map((pillar, index) => (
          <div key={pillar.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
            <span className="text-xs admin-text-secondary block mb-1">Pillar {index + 1}</span>
            <AdminFieldGrid cols={2}>
              <CompactField label="Title" value={pillar.title} onChange={(v) => {
                const pillars = [...template.pillars]; pillars[index] = { ...pillar, title: v }; onChange({ ...template, pillars })
              }} />
              <CompactSelect label="Icon" value={pillar.icon} onChange={(v) => {
                const pillars = [...template.pillars]; pillars[index] = { ...pillar, icon: v }; onChange({ ...template, pillars })
              }} options={WORK_PILLAR_ICON_PRESETS.map((o) => ({ value: o, label: o }))} />
            </AdminFieldGrid>
            <CompactTextarea label="Description" value={pillar.description} onChange={(v) => {
              const pillars = [...template.pillars]; pillars[index] = { ...pillar, description: v }; onChange({ ...template, pillars })
            }} rows={2} />
            {pillar.bullets && (
              <CompactField label="Bullets (comma separated)" value={pillar.bullets.join(", ")} onChange={(v) => {
                const pillars = [...template.pillars]
                pillars[index] = { ...pillar, bullets: v.split(",").map((s) => s.trim()).filter(Boolean) }
                onChange({ ...template, pillars })
              }} />
            )}
          </div>
        ))}
      </AdminCompactCard>

      <AdminCompactCard title="Gallery">
        <CompactField label="Section label" value={template.galleryLabel} onChange={(v) => onChange({ ...template, galleryLabel: v })} />
        <div className="mb-4">
          <ImageUpload
            preset="gallery"
            label="Upload Gallery Images (Select multiple files)"
            value=""
            multiple
            onMultipleChange={(newUrls) => {
              const current = template.galleryImages.filter(Boolean)
              onChange({ ...template, galleryImages: [...current, ...newUrls] })
            }}
            onChange={(url) => {
              if (url) onChange({ ...template, galleryImages: [...template.galleryImages, url] })
            }}
          />
        </div>

        {template.galleryImages.filter(Boolean).length > 0 && (
          <div className="mt-4 border-t admin-border pt-4">
            <p className="text-xs admin-text-muted mb-3 font-semibold uppercase tracking-wider">
              Uploaded Gallery Images ({template.galleryImages.filter(Boolean).length})
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {template.galleryImages.filter(Boolean).map((img, index) => (
                <div
                  key={index}
                  className="group relative h-14 w-full rounded-md overflow-hidden border admin-border-light bg-black/40 shadow-xs"
                >
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...template,
                          galleryImages: template.galleryImages.filter((_, i) => i !== index),
                        })
                      }
                      className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-transform hover:scale-110 shadow cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AdminCompactCard>

      <AdminCompactCard title="Results">
        <CompactField label="Section label" value={template.resultsLabel} onChange={(v) => onChange({ ...template, resultsLabel: v })} />
        <CompactField label="Title" value={template.resultsTitle} onChange={(v) => onChange({ ...template, resultsTitle: v })} />
        <CompactTextarea label="Text" value={template.resultsText} onChange={(v) => onChange({ ...template, resultsText: v })} rows={3} />
        {template.metrics.map((metric, index) => (
          <div key={metric.id} className="border-t admin-border pt-2 mt-2">
            <AdminFieldGrid cols={3}>
              <CompactField label="Value" value={metric.value} onChange={(v) => {
                const metrics = [...template.metrics]; metrics[index] = { ...metric, value: v }; onChange({ ...template, metrics })
              }} />
              <CompactField label="Label" value={metric.label} onChange={(v) => {
                const metrics = [...template.metrics]; metrics[index] = { ...metric, label: v }; onChange({ ...template, metrics })
              }} />
              <CompactSelect label="Icon" value={metric.icon} onChange={(v) => {
                const metrics = [...template.metrics]; metrics[index] = { ...metric, icon: v }; onChange({ ...template, metrics })
              }} options={WORK_METRIC_ICON_PRESETS.map((o) => ({ value: o, label: o }))} />
            </AdminFieldGrid>
          </div>
        ))}
      </AdminCompactCard>

      <AdminCompactCard title="Testimonial & details">
        <CompactTextarea label="Quote" value={template.testimonial.quote} onChange={(v) => setTestimonial({ quote: v })} rows={3} />
        <CompactField label="Project details heading" value={template.projectDetailsLabel || "PROJECT DETAILS"} onChange={(v) => onChange({ ...template, projectDetailsLabel: v })} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Author" value={template.testimonial.author} onChange={(v) => setTestimonial({ author: v })} />
          <CompactField label="Role" value={template.testimonial.role} onChange={(v) => setTestimonial({ role: v })} />
        </AdminFieldGrid>
        <ImageUpload preset="avatar" label="Author image" value={template.testimonial.image} onChange={(url) => setTestimonial({ image: url })} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Client" value={template.projectDetails.client} onChange={(v) => setProjectDetails({ client: v })} />
          <CompactField label="Industry" value={template.projectDetails.industry} onChange={(v) => setProjectDetails({ industry: v })} />
          <CompactField label="Services" value={template.projectDetails.services} onChange={(v) => setProjectDetails({ services: v })} />
          <CompactField label="Duration" value={template.projectDetails.duration} onChange={(v) => setProjectDetails({ duration: v })} />
          <CompactField label="Team" value={template.projectDetails.team} onChange={(v) => setProjectDetails({ team: v })} />
          <CompactField label="Website" value={template.projectDetails.website} onChange={(v) => setProjectDetails({ website: v })} />
        </AdminFieldGrid>
        <ImageUpload preset="sideImage" label="Side image" value={template.sideImage} onChange={(url) => onChange({ ...template, sideImage: url })} />
      </AdminCompactCard>
    </div>
  )
}

export function WorkCtaEditor({
  template,
  onChange,
}: {
  template: WorkDetailTemplate
  onChange: (template: WorkDetailTemplate) => void
}) {
  const setBottomCta = (patch: Partial<WorkDetailTemplate["bottomCta"]>) =>
    onChange({ ...template, bottomCta: { ...template.bottomCta, ...patch } })

  return (
    <div className="space-y-4">
      <AdminCompactCard title="Call To Action (CTA) Section">
        <CompactField label="Label line" value={template.bottomCta.labelLine || ""} onChange={(v) => setBottomCta({ labelLine: v })} />
        <CompactField label="Heading / Highlight text" value={template.bottomCta.heading} onChange={(v) => setBottomCta({ heading: v })} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Button text" value={template.bottomCta.buttonText} onChange={(v) => setBottomCta({ buttonText: v })} />
          <CompactField label="Button URL" value={template.bottomCta.buttonUrl} onChange={(v) => setBottomCta({ buttonUrl: v })} />
        </AdminFieldGrid>
      </AdminCompactCard>
    </div>
  )
}
