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
  createDefaultAboutContent,
  normalizeAboutContent,
  type NormalizedAboutContent,
  type AboutValueItem,
  type AboutJourneyStat,
} from "@/lib/about-content"
import { ABOUT_VALUE_ICON_PRESETS } from "@/components/about/about-value-icons"

const VALUE_ICON_OPTIONS = Object.keys(ABOUT_VALUE_ICON_PRESETS)
const STAT_ICON_OPTIONS = ["users", "layers", "trophy", "globe"]

export function AboutPageManager() {
  const [activeTab, setActiveTab] = useState<"hero" | "whoWeAre" | "values" | "journey">("hero")
  const [content, setContent] = useState<NormalizedAboutContent>(createDefaultAboutContent())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/about")
      if (res.ok) {
        const raw = await res.json()
        setContent(normalizeAboutContent(raw))
      }
    } catch (error) {
      console.error("Failed to fetch about data", error)
    }
  }

  const saveData = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const payload = {
        aboutPage: content,
        hero: {
          ...content.hero,
          title: `${content.hero.titleLine1} ${content.hero.titleHighlight}`,
        },
        about: {
          badge: content.whoWeAre.label,
          title: content.whoWeAre.titleLine1,
          highlightedTitle: content.whoWeAre.titleHighlight,
          description: content.whoWeAre.description,
          image: content.whoWeAre.image,
          buttonText: content.whoWeAre.buttonText,
          buttonUrl: content.whoWeAre.buttonUrl,
          values: content.valuesSection.items,
        },
        stats: content.journeySection.items,
        values: content.valuesSection.items,
      }

      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      setMessage(res.ok ? "About page saved successfully!" : "Failed to save")
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const tabs = [
    { id: "hero" as const, label: "Hero" },
    { id: "whoWeAre" as const, label: "Who We Are" },
    { id: "values" as const, label: "Our Values" },
    { id: "journey" as const, label: "Journey in Numbers" },
  ]

  return (
    <div>
      <div className="mb-4 flex justify-between items-start gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold admin-text-primary mb-1">About Page</h1>
          <p className="admin-text-secondary text-xs">Manage About Us sections.</p>
        </div>
        <Button onClick={saveData} disabled={saving} size="sm">
          {saving ? "Saving…" : "Save About Page"}
        </Button>
      </div>

      {message && (
        <div
          className={`mb-3 p-2.5 rounded-lg border text-xs ${
            message.includes("success")
              ? "bg-green-500/20 border-green-500/50 text-green-400"
              : "bg-red-500/20 border-red-500/50 text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "admin-bg-secondary admin-text-secondary hover:admin-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "hero" && (
        <AdminCompactCard title="Hero">
          <AdminFieldGrid cols={2}>
            <CompactField
              label="Title line 1"
              value={content.hero.titleLine1}
              onChange={(v) => setContent({ ...content, hero: { ...content.hero, titleLine1: v } })}
            />
            <CompactField
              label="Title highlight"
              value={content.hero.titleHighlight}
              onChange={(v) => setContent({ ...content, hero: { ...content.hero, titleHighlight: v } })}
            />
            <CompactField
              label="Subtitle line 1"
              value={content.hero.taglineLine1}
              onChange={(v) => setContent({ ...content, hero: { ...content.hero, taglineLine1: v } })}
            />
            <CompactField
              label="Subtitle line 2"
              value={content.hero.taglineLine2}
              onChange={(v) => setContent({ ...content, hero: { ...content.hero, taglineLine2: v } })}
            />
          </AdminFieldGrid>
          <CompactTextarea
            label="Description"
            value={content.hero.description}
            onChange={(v) => setContent({ ...content, hero: { ...content.hero, description: v } })}
            rows={3}
          />
          <ImageUpload
            label="Hero image"
            value={content.hero.image}
            onChange={(url) => setContent({ ...content, hero: { ...content.hero, image: url } })}
          />
        </AdminCompactCard>
      )}

      {activeTab === "whoWeAre" && (
        <AdminCompactCard title="Who We Are">
          <CompactField
            label="Section label"
            value={content.whoWeAre.label}
            onChange={(v) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, label: v } })}
          />
          <AdminFieldGrid cols={3}>
            <CompactField
              label="Title line 1"
              value={content.whoWeAre.titleLine1}
              onChange={(v) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, titleLine1: v } })}
            />
            <CompactField
              label="Title line 2"
              value={content.whoWeAre.titleLine2}
              onChange={(v) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, titleLine2: v } })}
            />
            <CompactField
              label="Title highlight"
              value={content.whoWeAre.titleHighlight}
              onChange={(v) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, titleHighlight: v } })}
            />
          </AdminFieldGrid>
          <CompactTextarea
            label="Description"
            value={content.whoWeAre.description}
            onChange={(v) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, description: v } })}
            rows={3}
          />
          <AdminFieldGrid cols={2}>
            <CompactField
              label="Button text"
              value={content.whoWeAre.buttonText}
              onChange={(v) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, buttonText: v } })}
            />
            <CompactField
              label="Button URL"
              value={content.whoWeAre.buttonUrl}
              onChange={(v) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, buttonUrl: v } })}
            />
          </AdminFieldGrid>
          <ImageUpload
            label="Section image"
            value={content.whoWeAre.image}
            onChange={(url) => setContent({ ...content, whoWeAre: { ...content.whoWeAre, image: url } })}
          />
        </AdminCompactCard>
      )}

      {activeTab === "values" && (
        <div className="space-y-2.5">
          <AdminCompactCard title="Our Values — typography">
            <TypographyPillRow>
              <FontSizePill
                label="Label"
                value={content.valuesSection.typography.sectionLabelFontSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    valuesSection: {
                      ...content.valuesSection,
                      typography: { ...content.valuesSection.typography, sectionLabelFontSize: v },
                    },
                  })
                }
                min={8}
                max={24}
              />
              <FontSizePill
                label="Title"
                value={content.valuesSection.typography.itemTitleFontSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    valuesSection: {
                      ...content.valuesSection,
                      typography: { ...content.valuesSection.typography, itemTitleFontSize: v },
                    },
                  })
                }
                min={10}
                max={32}
              />
              <FontSizePill
                label="Description"
                value={content.valuesSection.typography.itemDescriptionFontSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    valuesSection: {
                      ...content.valuesSection,
                      typography: { ...content.valuesSection.typography, itemDescriptionFontSize: v },
                    },
                  })
                }
                min={10}
                max={24}
              />
              <FontSizePill
                label="Icon circle"
                value={content.valuesSection.typography.iconCircleSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    valuesSection: {
                      ...content.valuesSection,
                      typography: { ...content.valuesSection.typography, iconCircleSize: v },
                    },
                  })
                }
                min={32}
                max={72}
              />
              <FontSizePill
                label="Icon glyph"
                value={content.valuesSection.typography.iconGlyphSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    valuesSection: {
                      ...content.valuesSection,
                      typography: { ...content.valuesSection.typography, iconGlyphSize: v },
                    },
                  })
                }
                min={12}
                max={40}
              />
            </TypographyPillRow>
          </AdminCompactCard>

          <AdminCompactCard>
            <CompactField
              label="Section label"
              value={content.valuesSection.label}
              onChange={(v) =>
                setContent({ ...content, valuesSection: { ...content.valuesSection, label: v } })
              }
            />
          </AdminCompactCard>

          {content.valuesSection.items.map((item, index) => (
            <AdminCompactCard key={item.id} title={`Value ${index + 1}`}>
              <div className="flex justify-end -mt-1 mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-400"
                  onClick={() =>
                    setContent({
                      ...content,
                      valuesSection: {
                        ...content.valuesSection,
                        items: content.valuesSection.items.filter((_, i) => i !== index),
                      },
                    })
                  }
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <AdminFieldGrid cols={2}>
                <CompactField
                  label="Title"
                  value={item.title}
                  onChange={(v) => {
                    const items = [...content.valuesSection.items]
                    items[index] = { ...item, title: v }
                    setContent({ ...content, valuesSection: { ...content.valuesSection, items } })
                  }}
                />
                <CompactSelect
                  label="Icon"
                  value={item.icon}
                  onChange={(v) => {
                    const items = [...content.valuesSection.items]
                    items[index] = { ...item, icon: v }
                    setContent({ ...content, valuesSection: { ...content.valuesSection, items } })
                  }}
                  options={VALUE_ICON_OPTIONS.map((o) => ({ value: o, label: o }))}
                />
              </AdminFieldGrid>
              <CompactTextarea
                label="Description"
                value={item.description}
                onChange={(v) => {
                  const items = [...content.valuesSection.items]
                  items[index] = { ...item, description: v }
                  setContent({ ...content, valuesSection: { ...content.valuesSection, items } })
                }}
                rows={2}
              />
            </AdminCompactCard>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setContent({
                ...content,
                valuesSection: {
                  ...content.valuesSection,
                  items: [
                    ...content.valuesSection.items,
                    { id: Date.now().toString(), title: "", description: "", icon: "creativity" } satisfies AboutValueItem,
                  ],
                },
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add value
          </Button>
        </div>
      )}

      {activeTab === "journey" && (
        <div className="space-y-2.5">
          <AdminCompactCard title="Journey in Numbers — typography">
            <TypographyPillRow>
              <FontSizePill
                label="Label"
                value={content.journeySection.typography.sectionLabelFontSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    journeySection: {
                      ...content.journeySection,
                      typography: { ...content.journeySection.typography, sectionLabelFontSize: v },
                    },
                  })
                }
                min={8}
                max={24}
              />
              <FontSizePill
                label="Icon"
                value={content.journeySection.typography.iconSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    journeySection: {
                      ...content.journeySection,
                      typography: { ...content.journeySection.typography, iconSize: v },
                    },
                  })
                }
                min={20}
                max={56}
              />
              <FontSizePill
                label="Value"
                value={content.journeySection.typography.statValueFontSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    journeySection: {
                      ...content.journeySection,
                      typography: { ...content.journeySection.typography, statValueFontSize: v },
                    },
                  })
                }
                min={16}
                max={48}
              />
              <FontSizePill
                label="Stat label"
                value={content.journeySection.typography.statLabelFontSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    journeySection: {
                      ...content.journeySection,
                      typography: { ...content.journeySection.typography, statLabelFontSize: v },
                    },
                  })
                }
                min={8}
                max={20}
              />
              <FontSizePill
                label="Description"
                value={content.journeySection.typography.statDescriptionFontSize}
                onChange={(v) =>
                  setContent({
                    ...content,
                    journeySection: {
                      ...content.journeySection,
                      typography: { ...content.journeySection.typography, statDescriptionFontSize: v },
                    },
                  })
                }
                min={10}
                max={20}
              />
            </TypographyPillRow>
          </AdminCompactCard>

          <AdminCompactCard>
            <CompactField
              label="Section label"
              value={content.journeySection.label}
              onChange={(v) =>
                setContent({ ...content, journeySection: { ...content.journeySection, label: v } })
              }
            />
          </AdminCompactCard>

          {content.journeySection.items.map((item, index) => (
            <AdminCompactCard key={item.id} title={`Stat ${index + 1}`}>
              <div className="flex justify-end -mt-1 mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-400"
                  onClick={() =>
                    setContent({
                      ...content,
                      journeySection: {
                        ...content.journeySection,
                        items: content.journeySection.items.filter((_, i) => i !== index),
                      },
                    })
                  }
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <AdminFieldGrid cols={2}>
                <CompactField
                  label="Value"
                  value={item.value}
                  onChange={(v) => {
                    const items = [...content.journeySection.items]
                    items[index] = { ...item, value: v }
                    setContent({ ...content, journeySection: { ...content.journeySection, items } })
                  }}
                />
                <CompactField
                  label="Label"
                  value={item.label}
                  onChange={(v) => {
                    const items = [...content.journeySection.items]
                    items[index] = { ...item, label: v }
                    setContent({ ...content, journeySection: { ...content.journeySection, items } })
                  }}
                />
              </AdminFieldGrid>
              <CompactTextarea
                label="Description"
                value={item.description}
                onChange={(v) => {
                  const items = [...content.journeySection.items]
                  items[index] = { ...item, description: v }
                  setContent({ ...content, journeySection: { ...content.journeySection, items } })
                }}
                rows={2}
              />
              <CompactSelect
                label="Icon"
                value={item.icon}
                onChange={(v) => {
                  const items = [...content.journeySection.items]
                  items[index] = { ...item, icon: v }
                  setContent({ ...content, journeySection: { ...content.journeySection, items } })
                }}
                options={STAT_ICON_OPTIONS.map((o) => ({ value: o, label: o }))}
              />
            </AdminCompactCard>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setContent({
                ...content,
                journeySection: {
                  ...content.journeySection,
                  items: [
                    ...content.journeySection.items,
                    { id: Date.now().toString(), value: "", label: "", description: "", icon: "users" } satisfies AboutJourneyStat,
                  ],
                },
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add stat
          </Button>
        </div>
      )}
    </div>
  )
}
