"use client"

import { Input } from "@/components/ui/input"
import { RichTextEditor } from "./rich-text-editor"
import {
  SERVICE_SECTION_COUNT,
  type ServiceContentSection,
} from "@/lib/service-sections"

interface ServiceSectionsEditorProps {
  sections: ServiceContentSection[]
  onChange: (sections: ServiceContentSection[]) => void
  hints?: readonly string[]
  sectionNumberStart?: number
}

export function ServiceSectionsEditor({
  sections,
  onChange,
  hints,
  sectionNumberStart = 1,
}: ServiceSectionsEditorProps) {
  const updateSection = (
    index: number,
    field: keyof ServiceContentSection,
    value: string | boolean,
  ) => {
    const next = [...sections]
    while (next.length < SERVICE_SECTION_COUNT) {
      next.push({ title: "", subtitle: "", description: "", enabled: true })
    }
    next[index] = { ...next[index], [field]: value }
    onChange(next.slice(0, SERVICE_SECTION_COUNT))
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: SERVICE_SECTION_COUNT }, (_, index) => {
        const section = sections[index] ?? { title: "", subtitle: "", description: "", enabled: true }
        const hint = hints?.[index]
        const sectionNumber = sectionNumberStart + index
        const enableId = `section-enabled-${sectionNumber}`

        return (
          <div key={index} className="admin-card border admin-border rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold admin-text-primary">
                  Section {sectionNumber}
                </h3>
                {hint && <p className="text-xs admin-text-muted mt-1">{hint}</p>}
              </div>
              <label htmlFor={enableId} className="flex items-center gap-2 text-sm admin-text-primary shrink-0">
                <input
                  type="checkbox"
                  id={enableId}
                  checked={section.enabled !== false}
                  onChange={(e) => updateSection(index, "enabled", e.target.checked)}
                  className="rounded admin-border-light"
                />
                Enabled
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title</label>
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(index, "title", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Section title"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Subtitle</label>
                <Input
                  value={section.subtitle}
                  onChange={(e) => updateSection(index, "subtitle", e.target.value)}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                  placeholder="Section subtitle"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Description</label>
                <RichTextEditor
                  value={section.description}
                  onChange={(html) => updateSection(index, "description", html)}
                  placeholder="Write section content with headings, lists, and paragraphs…"
                  minHeight="180px"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
