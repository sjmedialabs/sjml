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
  SERVICE_FEATURE_ICON_PRESETS,
  SERVICE_PROCESS_ICON_PRESETS,
  type ServiceDetailTemplate,
} from "@/lib/service-detail-template"

export function ServiceDetailTemplateEditor({
  template,
  onChange,
}: {
  template: ServiceDetailTemplate
  onChange: (template: ServiceDetailTemplate) => void
}) {
  const setTypo = (patch: Partial<ServiceDetailTemplate["typography"]>) =>
    onChange({ ...template, typography: { ...template.typography, ...patch } })

  return (
    <div className="space-y-2.5">
      <AdminCompactCard title="Detail page typography">
        <TypographyPillRow>
          <FontSizePill label="Category" value={template.typography.categoryLabelFontSize} onChange={(v) => setTypo({ categoryLabelFontSize: v })} min={8} max={20} />
          <FontSizePill label="Title" value={template.typography.titleFontSize} onChange={(v) => setTypo({ titleFontSize: v })} min={16} max={56} />
          <FontSizePill label="Intro" value={template.typography.introFontSize} onChange={(v) => setTypo({ introFontSize: v })} min={10} max={24} />
          <FontSizePill label="Feature title" value={template.typography.featureTitleFontSize} onChange={(v) => setTypo({ featureTitleFontSize: v })} min={10} max={24} />
          <FontSizePill label="Feature text" value={template.typography.featureDescriptionFontSize} onChange={(v) => setTypo({ featureDescriptionFontSize: v })} min={10} max={20} />
          <FontSizePill label="Feature icon" value={template.typography.featureIconSize} onChange={(v) => setTypo({ featureIconSize: v })} min={20} max={48} />
          <FontSizePill label="Process label" value={template.typography.processLabelFontSize} onChange={(v) => setTypo({ processLabelFontSize: v })} min={8} max={20} />
          <FontSizePill label="Process title" value={template.typography.processTitleFontSize} onChange={(v) => setTypo({ processTitleFontSize: v })} min={14} max={40} />
          <FontSizePill label="Step title" value={template.typography.processStepTitleFontSize} onChange={(v) => setTypo({ processStepTitleFontSize: v })} min={9} max={18} />
          <FontSizePill label="Step text" value={template.typography.processStepDescriptionFontSize} onChange={(v) => setTypo({ processStepDescriptionFontSize: v })} min={9} max={18} />
          <FontSizePill label="Process icon" value={template.typography.processIconSize} onChange={(v) => setTypo({ processIconSize: v })} min={24} max={56} />
          <FontSizePill label="Bottom heading" value={template.typography.bottomCtaHeadingFontSize} onChange={(v) => setTypo({ bottomCtaHeadingFontSize: v })} min={12} max={28} />
          <FontSizePill label="Bottom text" value={template.typography.bottomCtaTextFontSize} onChange={(v) => setTypo({ bottomCtaTextFontSize: v })} min={10} max={20} />
          <FontSizePill label="Bottom btn" value={template.typography.bottomCtaButtonFontSize} onChange={(v) => setTypo({ bottomCtaButtonFontSize: v })} min={10} max={18} />
          <FontSizePill label="Sidebar heading" value={template.typography.sidebarCtaHeadingFontSize} onChange={(v) => setTypo({ sidebarCtaHeadingFontSize: v })} min={10} max={20} />
          <FontSizePill label="Sidebar text" value={template.typography.sidebarCtaTextFontSize} onChange={(v) => setTypo({ sidebarCtaTextFontSize: v })} min={10} max={18} />
          <FontSizePill label="Sidebar btn" value={template.typography.sidebarCtaButtonFontSize} onChange={(v) => setTypo({ sidebarCtaButtonFontSize: v })} min={10} max={18} />
        </TypographyPillRow>
      </AdminCompactCard>

      <AdminCompactCard title="Intro">
        <AdminFieldGrid cols={2}>
          <CompactField label="Category label" value={template.categoryLabel} onChange={(v) => onChange({ ...template, categoryLabel: v })} />
          <CompactField label="Page title" value={template.title} onChange={(v) => onChange({ ...template, title: v })} />
        </AdminFieldGrid>
        <CompactTextarea label="Paragraph 1" value={template.introParagraph1} onChange={(v) => onChange({ ...template, introParagraph1: v })} rows={2} />
        <CompactTextarea label="Paragraph 2" value={template.introParagraph2} onChange={(v) => onChange({ ...template, introParagraph2: v })} rows={2} />
        <ImageUpload label="Intro image" value={template.introImage} onChange={(url) => onChange({ ...template, introImage: url })} />
      </AdminCompactCard>

      <AdminCompactCard title="Features (4 columns)">
        {template.features.map((feature, index) => (
          <div key={feature.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs admin-text-secondary">Feature {index + 1}</span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() =>
                onChange({ ...template, features: template.features.filter((_, i) => i !== index) })
              }>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <AdminFieldGrid cols={2}>
              <CompactField label="Title" value={feature.title} onChange={(v) => {
                const features = [...template.features]; features[index] = { ...feature, title: v }; onChange({ ...template, features })
              }} />
              <CompactSelect label="Icon" value={feature.icon} onChange={(v) => {
                const features = [...template.features]; features[index] = { ...feature, icon: v }; onChange({ ...template, features })
              }} options={SERVICE_FEATURE_ICON_PRESETS.map((o) => ({ value: o, label: o }))} />
            </AdminFieldGrid>
            <CompactTextarea label="Description" value={feature.description} onChange={(v) => {
              const features = [...template.features]; features[index] = { ...feature, description: v }; onChange({ ...template, features })
            }} rows={2} />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange({
          ...template,
          features: [...template.features, { id: Date.now().toString(), icon: "lightbulb", title: "", description: "" }],
        })}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add feature
        </Button>
      </AdminCompactCard>

      <AdminCompactCard title="Process timeline">
        <CompactField label="Section label" value={template.processLabel} onChange={(v) => onChange({ ...template, processLabel: v })} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Title line 1" value={template.processTitleLine1} onChange={(v) => onChange({ ...template, processTitleLine1: v })} />
          <CompactField label="Title highlight" value={template.processTitleHighlight} onChange={(v) => onChange({ ...template, processTitleHighlight: v })} />
        </AdminFieldGrid>
        {template.processSteps.map((step, index) => (
          <div key={step.id} className="border-t admin-border pt-2 mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs admin-text-secondary">Step {index + 1}</span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() =>
                onChange({ ...template, processSteps: template.processSteps.filter((_, i) => i !== index) })
              }>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <AdminFieldGrid cols={3}>
              <CompactField label="Number" value={step.stepNumber} onChange={(v) => {
                const processSteps = [...template.processSteps]; processSteps[index] = { ...step, stepNumber: v }; onChange({ ...template, processSteps })
              }} />
              <CompactField label="Title" value={step.title} onChange={(v) => {
                const processSteps = [...template.processSteps]; processSteps[index] = { ...step, title: v }; onChange({ ...template, processSteps })
              }} />
              <CompactSelect label="Icon" value={step.icon} onChange={(v) => {
                const processSteps = [...template.processSteps]; processSteps[index] = { ...step, icon: v }; onChange({ ...template, processSteps })
              }} options={SERVICE_PROCESS_ICON_PRESETS.map((o) => ({ value: o, label: o }))} />
            </AdminFieldGrid>
            <CompactTextarea label="Description" value={step.description} onChange={(v) => {
              const processSteps = [...template.processSteps]; processSteps[index] = { ...step, description: v }; onChange({ ...template, processSteps })
            }} rows={2} />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange({
          ...template,
          processSteps: [...template.processSteps, {
            id: Date.now().toString(),
            stepNumber: String(template.processSteps.length + 1).padStart(2, "0"),
            title: "",
            description: "",
            icon: "search",
          }],
        })}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add step
        </Button>
      </AdminCompactCard>

      <AdminCompactCard title="CTAs">
        <CompactField label="Bottom heading" value={template.bottomCta.heading} onChange={(v) => onChange({ ...template, bottomCta: { ...template.bottomCta, heading: v } })} />
        <CompactTextarea label="Bottom subtext" value={template.bottomCta.text} onChange={(v) => onChange({ ...template, bottomCta: { ...template.bottomCta, text: v } })} rows={2} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Bottom button" value={template.bottomCta.buttonText} onChange={(v) => onChange({ ...template, bottomCta: { ...template.bottomCta, buttonText: v } })} />
          <CompactField label="Bottom URL" value={template.bottomCta.buttonUrl} onChange={(v) => onChange({ ...template, bottomCta: { ...template.bottomCta, buttonUrl: v } })} />
        </AdminFieldGrid>
        <CompactField label="Sidebar heading" value={template.sidebarCta.heading} onChange={(v) => onChange({ ...template, sidebarCta: { ...template.sidebarCta, heading: v } })} />
        <CompactTextarea label="Sidebar subtext" value={template.sidebarCta.text} onChange={(v) => onChange({ ...template, sidebarCta: { ...template.sidebarCta, text: v } })} rows={2} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Sidebar button" value={template.sidebarCta.buttonText} onChange={(v) => onChange({ ...template, sidebarCta: { ...template.sidebarCta, buttonText: v } })} />
          <CompactField label="Sidebar URL" value={template.sidebarCta.buttonUrl} onChange={(v) => onChange({ ...template, sidebarCta: { ...template.sidebarCta, buttonUrl: v } })} />
        </AdminFieldGrid>
      </AdminCompactCard>
    </div>
  )
}
