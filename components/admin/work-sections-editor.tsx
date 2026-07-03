"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"
import { SectionEnableToggle } from "./section-enable-toggle"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import {
  type WorkDetailSections,
  type WorkInfoCard,
  type WorkDeliverable,
  type WorkGalleryItem,
  type WorkProcessStep,
  type WorkMetric,
} from "@/lib/work-sections"

interface WorkSectionsEditorProps {
  sections: WorkDetailSections
  onChange: (sections: WorkDetailSections) => void
}

function moveItem<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const next = [...arr]
  const target = index + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[index], next[target]] = [next[target], next[index]]
  return next.map((item, i) => ({ ...item, displayOrder: i } as T))
}

export function WorkSectionsEditor({ sections, onChange }: WorkSectionsEditorProps) {
  const patch = (key: keyof WorkDetailSections, value: WorkDetailSections[typeof key]) => {
    onChange({ ...sections, [key]: value })
  }

  const sectionFields = (
    key: keyof WorkDetailSections,
    label: string,
    hint: string,
  ) => {
    const s = sections[key]
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold admin-text-primary">{label}</h2>
          <p className="text-sm admin-text-muted mt-1">{hint}</p>
        </div>
        <SectionEnableToggle
          id={`work-${key}-enabled`}
          enabled={s.enabled}
          onChange={(enabled) => patch(key, { ...s, enabled })}
        />
      </div>
    )
  }

  const numberTitleDesc = (key: keyof WorkDetailSections) => {
    const s = sections[key]
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm admin-text-secondary mb-2">Section number</label>
          <Input
            value={s.sectionNumber}
            onChange={(e) => patch(key, { ...s, sectionNumber: e.target.value })}
            className="admin-bg-tertiary admin-border-light admin-text-primary"
            placeholder="01"
          />
        </div>
        <div>
          <label className="block text-sm admin-text-secondary mb-2">Section title</label>
          <Input
            value={s.title}
            onChange={(e) => patch(key, { ...s, title: e.target.value })}
            className="admin-bg-tertiary admin-border-light admin-text-primary"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm admin-text-secondary mb-2">Section description</label>
          <Textarea
            value={s.description}
            onChange={(e) => patch(key, { ...s, description: e.target.value })}
            className="admin-bg-tertiary admin-border-light admin-text-primary"
            rows={2}
          />
        </div>
      </div>
    )
  }

  const updateInfoCards = (cards: WorkInfoCard[]) => patch("snapshot", { ...sections.snapshot, infoCards: cards })
  const updateDeliverables = (items: WorkDeliverable[]) =>
    patch("delivered", { ...sections.delivered, deliverables: items })
  const updateGallery = (items: WorkGalleryItem[]) => patch("gallery", { ...sections.gallery, items })
  const updateSteps = (steps: WorkProcessStep[]) => patch("process", { ...sections.process, steps })
  const updateMetrics = (metrics: WorkMetric[]) => patch("results", { ...sections.results, metrics })

  return (
    <div className="space-y-6">
      {/* Section 01 */}
      <div className="admin-card border admin-border rounded-xl p-6">
        {sectionFields("snapshot", "Section 01: Project Snapshot", "Summary, featured image, and dynamic info cards.")}
        {numberTitleDesc("snapshot")}
        <div className="space-y-4">
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Project summary</label>
            <Textarea
              value={sections.snapshot.summary}
              onChange={(e) => patch("snapshot", { ...sections.snapshot, summary: e.target.value })}
              className="admin-bg-tertiary admin-border-light admin-text-primary"
              rows={4}
            />
          </div>
          <ImageUpload
            label="Featured project image"
            value={sections.snapshot.featuredImage}
            onChange={(url) => patch("snapshot", { ...sections.snapshot, featuredImage: url })}
          />
          <div className="flex justify-between items-center">
            <label className="text-sm admin-text-secondary font-medium">Information cards</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateInfoCards([
                  ...sections.snapshot.infoCards,
                  { icon: "", label: "", value: "", displayOrder: sections.snapshot.infoCards.length, enabled: true },
                ])
              }
              className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
            >
              <Plus className="w-4 h-4 mr-1" /> Add card
            </Button>
          </div>
          {sections.snapshot.infoCards.map((card, index) => (
            <div key={index} className="p-4 admin-bg-tertiary rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm admin-text-secondary">Card {index + 1}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => updateInfoCards(moveItem(sections.snapshot.infoCards, index, -1))}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" disabled={index === sections.snapshot.infoCards.length - 1} onClick={() => updateInfoCards(moveItem(sections.snapshot.infoCards, index, 1))}>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => updateInfoCards(sections.snapshot.infoCards.filter((_, i) => i !== index))} className="text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={card.enabled} onChange={(e) => { const n = [...sections.snapshot.infoCards]; n[index] = { ...card, enabled: e.target.checked }; updateInfoCards(n) }} />
                <span className="text-sm admin-text-primary">Enabled</span>
              </div>
              <ImageUpload label="Icon (optional)" value={card.icon} onChange={(url) => { const n = [...sections.snapshot.infoCards]; n[index] = { ...card, icon: url }; updateInfoCards(n) }} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Label (e.g. Industry)" value={card.label} onChange={(e) => { const n = [...sections.snapshot.infoCards]; n[index] = { ...card, label: e.target.value }; updateInfoCards(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
                <Input placeholder="Value" value={card.value} onChange={(e) => { const n = [...sections.snapshot.infoCards]; n[index] = { ...card, value: e.target.value }; updateInfoCards(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 02 */}
      <div className="admin-card border admin-border rounded-xl p-6">
        {sectionFields("delivered", "Section 02: What We Delivered", "Grid of deliverable cards with icon, title, and description.")}
        {numberTitleDesc("delivered")}
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" onClick={() => updateDeliverables([...sections.delivered.deliverables, { icon: "", title: "", description: "", displayOrder: sections.delivered.deliverables.length, enabled: true }])} className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent">
            <Plus className="w-4 h-4 mr-1" /> Add deliverable
          </Button>
        </div>
        {sections.delivered.deliverables.map((item, index) => (
          <div key={index} className="p-4 admin-bg-tertiary rounded-lg space-y-3 mb-3">
            <div className="flex justify-between">
              <span className="text-sm admin-text-secondary">Deliverable {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => updateDeliverables(sections.delivered.deliverables.filter((_, i) => i !== index))} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <label className="flex items-center gap-2 text-sm admin-text-primary"><input type="checkbox" checked={item.enabled} onChange={(e) => { const n = [...sections.delivered.deliverables]; n[index] = { ...item, enabled: e.target.checked }; updateDeliverables(n) }} /> Enabled</label>
            <ImageUpload label="Icon" value={item.icon} onChange={(url) => { const n = [...sections.delivered.deliverables]; n[index] = { ...item, icon: url }; updateDeliverables(n) }} />
            <Input placeholder="Title" value={item.title} onChange={(e) => { const n = [...sections.delivered.deliverables]; n[index] = { ...item, title: e.target.value }; updateDeliverables(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
            <Textarea placeholder="Short description" value={item.description} onChange={(e) => { const n = [...sections.delivered.deliverables]; n[index] = { ...item, description: e.target.value }; updateDeliverables(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" rows={2} />
          </div>
        ))}
      </div>

      {/* Section 03 */}
      <div className="admin-card border admin-border rounded-xl p-6">
        {sectionFields("gallery", "Section 03: Project Gallery", "Asymmetric gallery with lightbox. Order: tall left, wide top-right, squares bottom-right.")}
        {numberTitleDesc("gallery")}
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" onClick={() => updateGallery([...sections.gallery.items, { image: "", title: "", altText: "", displayOrder: sections.gallery.items.length }])} className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent">
            <Plus className="w-4 h-4 mr-1" /> Add image
          </Button>
        </div>
        {sections.gallery.items.map((item, index) => (
          <div key={index} className="p-4 admin-bg-tertiary rounded-lg space-y-3 mb-3">
            <div className="flex justify-between">
              <span className="text-sm admin-text-secondary">Image {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => updateGallery(sections.gallery.items.filter((_, i) => i !== index))} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <ImageUpload label="Image" value={item.image} onChange={(url) => { const n = [...sections.gallery.items]; n[index] = { ...item, image: url }; updateGallery(n) }} />
            <Input placeholder="Title (optional)" value={item.title ?? ""} onChange={(e) => { const n = [...sections.gallery.items]; n[index] = { ...item, title: e.target.value }; updateGallery(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
            <Input placeholder="Alt text" value={item.altText ?? ""} onChange={(e) => { const n = [...sections.gallery.items]; n[index] = { ...item, altText: e.target.value }; updateGallery(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
          </div>
        ))}
      </div>

      {/* Section 04 */}
      <div className="admin-card border admin-border rounded-xl p-6">
        {sectionFields("process", "Section 04: Design Process", "Horizontal timeline with numbered steps.")}
        {numberTitleDesc("process")}
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" onClick={() => updateSteps([...sections.process.steps, { stepNumber: String(sections.process.steps.length + 1).padStart(2, "0"), title: "", description: "", displayOrder: sections.process.steps.length }])} className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent">
            <Plus className="w-4 h-4 mr-1" /> Add step
          </Button>
        </div>
        {sections.process.steps.map((step, index) => (
          <div key={index} className="p-4 admin-bg-tertiary rounded-lg space-y-3 mb-3">
            <div className="flex justify-between">
              <span className="text-sm admin-text-secondary">Step {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => updateSteps(sections.process.steps.filter((_, i) => i !== index))} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Step number (01)" value={step.stepNumber} onChange={(e) => { const n = [...sections.process.steps]; n[index] = { ...step, stepNumber: e.target.value }; updateSteps(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
              <Input placeholder="Step title" value={step.title} onChange={(e) => { const n = [...sections.process.steps]; n[index] = { ...step, title: e.target.value }; updateSteps(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
            </div>
            <Textarea placeholder="Step description" value={step.description} onChange={(e) => { const n = [...sections.process.steps]; n[index] = { ...step, description: e.target.value }; updateSteps(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" rows={2} />
          </div>
        ))}
      </div>

      {/* Section 05 */}
      <div className="admin-card border admin-border rounded-xl p-6">
        {sectionFields("results", "Section 05: Results & Impact", "Metric cards with icon, value, title, and description.")}
        {numberTitleDesc("results")}
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" onClick={() => updateMetrics([...sections.results.metrics, { icon: "", value: "", title: "", description: "", displayOrder: sections.results.metrics.length, enabled: true }])} className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent">
            <Plus className="w-4 h-4 mr-1" /> Add metric
          </Button>
        </div>
        {sections.results.metrics.map((metric, index) => (
          <div key={index} className="p-4 admin-bg-tertiary rounded-lg space-y-3 mb-3">
            <div className="flex justify-between">
              <span className="text-sm admin-text-secondary">Metric {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => updateMetrics(sections.results.metrics.filter((_, i) => i !== index))} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <label className="flex items-center gap-2 text-sm admin-text-primary"><input type="checkbox" checked={metric.enabled} onChange={(e) => { const n = [...sections.results.metrics]; n[index] = { ...metric, enabled: e.target.checked }; updateMetrics(n) }} /> Enabled</label>
            <ImageUpload label="Icon" value={metric.icon} onChange={(url) => { const n = [...sections.results.metrics]; n[index] = { ...metric, icon: url }; updateMetrics(n) }} />
            <Input placeholder="Metric value (e.g. 100%)" value={metric.value} onChange={(e) => { const n = [...sections.results.metrics]; n[index] = { ...metric, value: e.target.value }; updateMetrics(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
            <Input placeholder="Metric title" value={metric.title} onChange={(e) => { const n = [...sections.results.metrics]; n[index] = { ...metric, title: e.target.value }; updateMetrics(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" />
            <Textarea placeholder="Description" value={metric.description} onChange={(e) => { const n = [...sections.results.metrics]; n[index] = { ...metric, description: e.target.value }; updateMetrics(n) }} className="admin-bg-tertiary admin-border-light admin-text-primary" rows={2} />
          </div>
        ))}
      </div>
    </div>
  )
}
