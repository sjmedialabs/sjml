"use client"

import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
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
  SERVICE_AUDIENCE_ICON_PRESETS,
  SERVICE_FEATURE_ICON_PRESETS,
  SERVICE_OFFERING_ICON_PRESETS,
  SERVICE_PROCESS_ICON_PRESETS,
  type ServiceDetailTemplate,
} from "@/lib/service-detail-template"

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-xs admin-text-secondary cursor-pointer select-none mb-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-admin-border"
      />
      <span>{label}</span>
    </label>
  )
}

export function ServiceDetailTemplateEditor({
  template,
  onChange,
  hideIntroImage = false,
}: {
  template: ServiceDetailTemplate
  onChange: (template: ServiceDetailTemplate) => void
  /** Hide when banner image is managed separately (sub-services). */
  hideIntroImage?: boolean
}) {
  const setTypo = (patch: Partial<ServiceDetailTemplate["typography"]>) =>
    onChange({ ...template, typography: { ...template.typography, ...patch } })

  return (
    <div className="space-y-2.5">
      <AdminCompactCard title="Detail page typography">
        <TypographyPillRow>
          <FontSizePill label="Category" value={template.typography.categoryLabelFontSize} onChange={(v) => setTypo({ categoryLabelFontSize: v })} min={8} max={20} />
          <FontSizePill label="Hero title" value={template.typography.titleFontSize} onChange={(v) => setTypo({ titleFontSize: v })} min={16} max={72} />
          <FontSizePill label="Hero text" value={template.typography.heroDescriptionFontSize} onChange={(v) => setTypo({ heroDescriptionFontSize: v })} min={10} max={24} />
          <FontSizePill label="Intro heading" value={template.typography.introHeadingFontSize} onChange={(v) => setTypo({ introHeadingFontSize: v })} min={14} max={40} />
          <FontSizePill label="Intro" value={template.typography.introFontSize} onChange={(v) => setTypo({ introFontSize: v })} min={10} max={24} />
          <FontSizePill label="Section title" value={template.typography.sectionTitleFontSize} onChange={(v) => setTypo({ sectionTitleFontSize: v })} min={14} max={40} />
          <FontSizePill label="Offering title" value={template.typography.offeringTitleFontSize} onChange={(v) => setTypo({ offeringTitleFontSize: v })} min={12} max={28} />
          <FontSizePill label="Offering text" value={template.typography.offeringDescriptionFontSize} onChange={(v) => setTypo({ offeringDescriptionFontSize: v })} min={10} max={20} />
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

      <AdminCompactCard title="Hero">
        <AdminFieldGrid cols={2}>
          <CompactField label="Category label" value={template.categoryLabel} onChange={(v) => onChange({ ...template, categoryLabel: v })} />
          <CompactField label="Hero title" value={template.title} onChange={(v) => onChange({ ...template, title: v })} />
        </AdminFieldGrid>
        <CompactTextarea label="Hero description" value={template.heroDescription} onChange={(v) => onChange({ ...template, heroDescription: v })} rows={2} />
        <AdminFieldGrid cols={2}>
          <CompactField label="Hero button text" value={template.heroButtonText} onChange={(v) => onChange({ ...template, heroButtonText: v })} />
          <CompactField label="Hero button URL" value={template.heroButtonUrl} onChange={(v) => onChange({ ...template, heroButtonUrl: v })} />
        </AdminFieldGrid>
        {!hideIntroImage && (
          <ImageUpload preset="banner" label="Hero background image" value={template.introImage} onChange={(url) => onChange({ ...template, introImage: url })} />
        )}
      </AdminCompactCard>

      <AdminCompactCard title="Intro section">
        <CompactField label="Intro heading (H2)" value={template.introHeading} onChange={(v) => onChange({ ...template, introHeading: v })} />
        <CompactTextarea label="Paragraph 1" value={template.introParagraph1} onChange={(v) => onChange({ ...template, introParagraph1: v })} rows={3} />
        <CompactTextarea label="Paragraph 2" value={template.introParagraph2} onChange={(v) => onChange({ ...template, introParagraph2: v })} rows={3} />
      </AdminCompactCard>

      <AdminCompactCard title="Offerings (service cards)">
        <ToggleRow
          label="Show offerings section"
          checked={template.offeringsEnabled}
          onChange={(offeringsEnabled) => onChange({ ...template, offeringsEnabled })}
        />
        <CompactField label="Section title" value={template.offeringsTitle} onChange={(v) => onChange({ ...template, offeringsTitle: v })} />
        {template.offerings.map((offering, index) => (
          <div key={offering.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs admin-text-secondary">Offering {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-400"
                onClick={() => onChange({ ...template, offerings: template.offerings.filter((_, i) => i !== index) })}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <AdminFieldGrid cols={2}>
              <CompactField
                label="Title"
                value={offering.title}
                onChange={(v) => {
                  const offerings = [...template.offerings]
                  offerings[index] = { ...offering, title: v }
                  onChange({ ...template, offerings })
                }}
              />
              <CompactSelect
                label="Icon"
                value={offering.icon}
                onChange={(v) => {
                  const offerings = [...template.offerings]
                  offerings[index] = { ...offering, icon: v }
                  onChange({ ...template, offerings })
                }}
                options={SERVICE_OFFERING_ICON_PRESETS.map((o) => ({ value: o, label: o }))}
              />
            </AdminFieldGrid>
            <CompactTextarea
              label="Description"
              value={offering.description}
              onChange={(v) => {
                const offerings = [...template.offerings]
                offerings[index] = { ...offering, description: v }
                onChange({ ...template, offerings })
              }}
              rows={2}
            />
            <CompactTextarea
              label="Bullet points (one per line)"
              value={offering.points.join("\n")}
              onChange={(v) => {
                const offerings = [...template.offerings]
                offerings[index] = {
                  ...offering,
                  points: v
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                }
                onChange({ ...template, offerings })
              }}
              rows={4}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...template,
              offerings: [
                ...template.offerings,
                { id: Date.now().toString(), icon: "target", title: "", description: "", points: [] },
              ],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add offering
        </Button>
      </AdminCompactCard>

      <AdminCompactCard title="Values (why it matters)">
        <ToggleRow
          label="Show values section"
          checked={template.valuesEnabled}
          onChange={(valuesEnabled) => onChange({ ...template, valuesEnabled })}
        />
        <CompactField label="Section title" value={template.valuesTitle} onChange={(v) => onChange({ ...template, valuesTitle: v })} />
        {template.values.map((item, index) => (
          <div key={item.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs admin-text-secondary">Value {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-400"
                onClick={() => onChange({ ...template, values: template.values.filter((_, i) => i !== index) })}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <AdminFieldGrid cols={2}>
              <CompactField
                label="Title"
                value={item.title}
                onChange={(v) => {
                  const values = [...template.values]
                  values[index] = { ...item, title: v }
                  onChange({ ...template, values })
                }}
              />
              <CompactSelect
                label="Icon"
                value={item.icon}
                onChange={(v) => {
                  const values = [...template.values]
                  values[index] = { ...item, icon: v }
                  onChange({ ...template, values })
                }}
                options={SERVICE_FEATURE_ICON_PRESETS.map((o) => ({ value: o, label: o }))}
              />
            </AdminFieldGrid>
            <CompactTextarea
              label="Description"
              value={item.description}
              onChange={(v) => {
                const values = [...template.values]
                values[index] = { ...item, description: v }
                onChange({ ...template, values })
              }}
              rows={2}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...template,
              values: [...template.values, { id: Date.now().toString(), icon: "target", title: "", description: "" }],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add value
        </Button>
      </AdminCompactCard>

      <AdminCompactCard title="Who we work with">
        <ToggleRow
          label="Show audience section"
          checked={template.audiencesEnabled}
          onChange={(audiencesEnabled) => onChange({ ...template, audiencesEnabled })}
        />
        <CompactField label="Section title" value={template.audiencesTitle} onChange={(v) => onChange({ ...template, audiencesTitle: v })} />
        {template.audiences.map((item, index) => (
          <div key={item.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs admin-text-secondary">Audience {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-400"
                onClick={() => onChange({ ...template, audiences: template.audiences.filter((_, i) => i !== index) })}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <AdminFieldGrid cols={2}>
              <CompactField
                label="Title"
                value={item.title}
                onChange={(v) => {
                  const audiences = [...template.audiences]
                  audiences[index] = { ...item, title: v }
                  onChange({ ...template, audiences })
                }}
              />
              <CompactSelect
                label="Icon"
                value={item.icon}
                onChange={(v) => {
                  const audiences = [...template.audiences]
                  audiences[index] = { ...item, icon: v }
                  onChange({ ...template, audiences })
                }}
                options={SERVICE_AUDIENCE_ICON_PRESETS.map((o) => ({ value: o, label: o }))}
              />
            </AdminFieldGrid>
            <CompactTextarea
              label="Description"
              value={item.description}
              onChange={(v) => {
                const audiences = [...template.audiences]
                audiences[index] = { ...item, description: v }
                onChange({ ...template, audiences })
              }}
              rows={2}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...template,
              audiences: [...template.audiences, { id: Date.now().toString(), icon: "users", title: "", description: "" }],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add audience
        </Button>
      </AdminCompactCard>

      <AdminCompactCard title="Highlight cards (USP)">
        <ToggleRow
          label="Show highlight cards"
          checked={template.highlightsEnabled}
          onChange={(highlightsEnabled) => onChange({ ...template, highlightsEnabled })}
        />
        <CompactField label="Section title (optional)" value={template.highlightsTitle} onChange={(v) => onChange({ ...template, highlightsTitle: v })} />
        {template.features.map((feature, index) => (
          <div key={feature.id} className="border-t admin-border pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs admin-text-secondary">Feature {index + 1}</span>
              <ConfirmDeleteDialog
                trigger={
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                }
                title="Remove this feature?"
                description="This feature will be removed from the service page."
                onConfirm={() =>
                  onChange({ ...template, features: template.features.filter((_, i) => i !== index) })
                }
              />
            </div>
            <AdminFieldGrid cols={2}>
              <CompactField
                label="Title"
                value={feature.title}
                onChange={(v) => {
                  const features = [...template.features]
                  features[index] = { ...feature, title: v }
                  onChange({ ...template, features })
                }}
              />
              <CompactSelect
                label="Icon"
                value={feature.icon}
                onChange={(v) => {
                  const features = [...template.features]
                  features[index] = { ...feature, icon: v }
                  onChange({ ...template, features })
                }}
                options={SERVICE_FEATURE_ICON_PRESETS.map((o) => ({ value: o, label: o }))}
              />
            </AdminFieldGrid>
            <CompactTextarea
              label="Description"
              value={feature.description}
              onChange={(v) => {
                const features = [...template.features]
                features[index] = { ...feature, description: v }
                onChange({ ...template, features })
              }}
              rows={2}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...template,
              features: [...template.features, { id: Date.now().toString(), icon: "lightbulb", title: "", description: "" }],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add highlight
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
              <ConfirmDeleteDialog
                trigger={
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                }
                title="Remove this process step?"
                description="This step will be removed from the service page."
                onConfirm={() =>
                  onChange({ ...template, processSteps: template.processSteps.filter((_, i) => i !== index) })
                }
              />
            </div>
            <AdminFieldGrid cols={3}>
              <CompactField
                label="Number"
                value={step.stepNumber}
                onChange={(v) => {
                  const processSteps = [...template.processSteps]
                  processSteps[index] = { ...step, stepNumber: v }
                  onChange({ ...template, processSteps })
                }}
              />
              <CompactField
                label="Title"
                value={step.title}
                onChange={(v) => {
                  const processSteps = [...template.processSteps]
                  processSteps[index] = { ...step, title: v }
                  onChange({ ...template, processSteps })
                }}
              />
              <CompactSelect
                label="Icon"
                value={step.icon}
                onChange={(v) => {
                  const processSteps = [...template.processSteps]
                  processSteps[index] = { ...step, icon: v }
                  onChange({ ...template, processSteps })
                }}
                options={SERVICE_PROCESS_ICON_PRESETS.map((o) => ({ value: o, label: o }))}
              />
            </AdminFieldGrid>
            <CompactTextarea
              label="Description"
              value={step.description}
              onChange={(v) => {
                const processSteps = [...template.processSteps]
                processSteps[index] = { ...step, description: v }
                onChange({ ...template, processSteps })
              }}
              rows={2}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...template,
              processSteps: [
                ...template.processSteps,
                {
                  id: Date.now().toString(),
                  stepNumber: String(template.processSteps.length + 1).padStart(2, "0"),
                  title: "",
                  description: "",
                  icon: "search",
                },
              ],
            })
          }
        >
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
