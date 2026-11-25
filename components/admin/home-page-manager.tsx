"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"
import { VideoUpload } from "./video-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SectionEnableToggle } from "./section-enable-toggle"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import {
  createDefaultHero,
  createDefaultStats,
  createDefaultServicesSection,
  normalizeHomeContent,
  HOME_HERO_DEFAULT_COLORS,
  type HomeHero,
  type HomeStat,
  type HomeServicesSection,
  type HeroSlide,
  type HomeServiceCard,
} from "@/lib/home-content"
import { AdminToast } from "./admin-toast"
import { ColorPill, TypographyPillRow } from "./admin-compact-fields"
import { STAT_ICON_PRESETS, isStatIconPreset } from "@/components/stats-icons"

const ICON_OPTIONS = [
  { value: "users", label: "Users / Clients" },
  { value: "layers", label: "Layers / Projects" },
  { value: "trophy", label: "Trophy / Experience" },
  { value: "globe", label: "Globe / Global" },
]

const HERO_OVER_TITLE_FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32]
const HERO_TITLE_FONT_SIZES = [20, 24, 28, 32, 36, 40, 42, 48, 52, 56, 60, 64, 72, 80, 90, 100]
const HERO_DESCRIPTION_FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28]
const SERVICES_LABEL_FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18]
const SERVICES_SECTION_TITLE_FONT_SIZES = [24, 28, 32, 36, 38, 40, 44, 48, 52, 56]
const SERVICES_SECTION_DESC_FONT_SIZES = [11, 12, 13, 14, 15, 16, 17, 18, 20, 22]
const SERVICES_CARD_TITLE_FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24]
const SERVICES_CARD_DESC_FONT_SIZES = [9, 10, 11, 12, 13, 14, 15, 16, 18]

function FontSizeSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: number
  options: number[]
  onChange: (value: number) => void
}) {
  const opts = options.includes(value) ? options : [...options, value].sort((a, b) => a - b)
  return (
    <div>
      <label className="block text-sm admin-text-secondary mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full admin-bg-tertiary admin-border-light admin-text-primary rounded px-3 py-2 border"
      >
        {opts.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
    </div>
  )
}

export function HomePageManager() {
  const [activeTab, setActiveTab] = useState<"hero" | "stats" | "services">("hero")
  const [hero, setHero] = useState<HomeHero>(createDefaultHero())
  const [stats, setStats] = useState<HomeStat[]>(createDefaultStats())
  const [servicesSection, setServicesSection] = useState<HomeServicesSection>(createDefaultServicesSection())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/content/home")
      if (!res.ok) return
      const raw = await res.json()
      const normalized = normalizeHomeContent(raw, { forAdmin: true })
      setHero(normalized.hero)
      setStats(normalized.stats)
      setServicesSection(normalized.servicesSection)
    } catch (e) {
      console.error("Failed to fetch home content", e)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hero,
          stats,
          homeServicesSection: servicesSection,
        }),
      })
      setMessage(res.ok ? "Homepage saved successfully!" : "Error saving homepage")
    } catch {
      setMessage("Error saving homepage")
    }
    setSaving(false)
  }

  const updateSlide = (index: number, patch: Partial<HeroSlide>) => {
    const slides = [...hero.slides]
    slides[index] = { ...slides[index], ...patch }
    setHero({ ...hero, slides })
  }

  const moveSlide = (index: number, dir: -1 | 1) => {
    const slides = [...hero.slides]
    const target = index + dir
    if (target < 0 || target >= slides.length) return
    ;[slides[index], slides[target]] = [slides[target], slides[index]]
    setHero({
      ...hero,
      slides: slides.map((s, i) => ({ ...s, sortOrder: i })),
    })
  }

  const addSlide = () => {
    setHero({
      ...hero,
      slides: [
        ...hero.slides,
        {
          id: Date.now().toString(),
          enabled: true,
          sortOrder: hero.slides.length,
          overTitle: "",
          headline: "",
          headlineLine2: "",
          highlightText: "",
          description: "",
          primaryButtonText: "OUR SERVICES",
          primaryButtonUrl: "/services",
          secondaryButtonText: "VIEW OUR WORK",
          secondaryButtonUrl: "/work",
          backgroundImage: "",
          backgroundVideo: "",
        },
      ],
    })
  }

  const tabs = [
    { id: "hero" as const, label: "Hero Section" },
    { id: "stats" as const, label: "Statistics Bar" },
    { id: "services" as const, label: "What We Do" },
  ]

  return (
    <div>
      <div className="mb-8 flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold admin-text-primary mb-2">Homepage</h1>
          <p className="admin-text-secondary">
            Manage the homepage hero, statistics bar, and services section (reference layout).
          </p>
        </div>
        <Button onClick={saveContent} disabled={saving}>
          {saving ? "Saving…" : "Save Homepage"}
        </Button>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
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
        <div className="space-y-6">
          <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold admin-text-primary">Hero settings</h2>
              <SectionEnableToggle
                id="hero-enabled"
                enabled={hero.enabled}
                onChange={(enabled) => setHero({ ...hero, enabled })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm admin-text-primary">
              <input
                type="checkbox"
                checked={hero.showScrollIndicator}
                onChange={(e) => setHero({ ...hero, showScrollIndicator: e.target.checked })}
              />
              Show scroll indicator
            </label>
            <Input
              value={hero.scrollIndicatorText}
              onChange={(e) => setHero({ ...hero, scrollIndicatorText: e.target.value })}
              placeholder="SCROLL DOWN"
              className="admin-bg-tertiary admin-border-light admin-text-primary max-w-xs"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FontSizeSelect
                label="Over-title font size"
                value={hero.overTitleFontSize ?? 14}
                options={HERO_OVER_TITLE_FONT_SIZES}
                onChange={(overTitleFontSize) => setHero({ ...hero, overTitleFontSize })}
              />
              <FontSizeSelect
                label="Title font size"
                value={hero.titleFontSize ?? 42}
                options={HERO_TITLE_FONT_SIZES}
                onChange={(titleFontSize) => setHero({ ...hero, titleFontSize })}
              />
              <FontSizeSelect
                label="Description font size"
                value={hero.descriptionFontSize ?? 16}
                options={HERO_DESCRIPTION_FONT_SIZES}
                onChange={(descriptionFontSize) => setHero({ ...hero, descriptionFontSize })}
              />
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Carousel min height</label>
                <select
                  value={hero.maxHeight ?? 700}
                  onChange={(e) => setHero({ ...hero, maxHeight: Number(e.target.value) })}
                  className="w-full admin-bg-tertiary admin-border-light admin-text-primary rounded px-3 py-2 border"
                >
                  {[700, 750, 800, 850, 900].map((h) => (
                    <option key={h} value={h}>
                      {h}px
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm admin-text-secondary mb-2">Title & content colors</label>
              <TypographyPillRow>
                <ColorPill
                  label="Over-title"
                  value={hero.overTitleColor ?? HOME_HERO_DEFAULT_COLORS.overTitle}
                  onChange={(overTitleColor) => setHero({ ...hero, overTitleColor })}
                />
                <ColorPill
                  label="Title"
                  value={hero.headlineColor ?? HOME_HERO_DEFAULT_COLORS.headline}
                  onChange={(headlineColor) => setHero({ ...hero, headlineColor })}
                />
                <ColorPill
                  label="Highlight"
                  value={hero.highlightColor ?? HOME_HERO_DEFAULT_COLORS.highlight}
                  onChange={(highlightColor) => setHero({ ...hero, highlightColor })}
                />
                <ColorPill
                  label="Description"
                  value={hero.descriptionColor ?? HOME_HERO_DEFAULT_COLORS.description}
                  onChange={(descriptionColor) => setHero({ ...hero, descriptionColor })}
                />
              </TypographyPillRow>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold admin-text-primary">Slides</h2>
              <p className="text-sm admin-text-secondary">
                {hero.slides.length} slide{hero.slides.length !== 1 ? "s" : ""}
                {" · "}
                {hero.slides.filter((s) => s.enabled).length} enabled on website
              </p>
            </div>
            <Button type="button" onClick={addSlide}>
              <Plus className="w-4 h-4 mr-1" /> Add slide
            </Button>
          </div>

          {hero.slides.length === 0 && (
            <div className="admin-card border admin-border rounded-xl p-8 text-center">
              <p className="admin-text-secondary mb-4">No slides yet. Add your first hero slide to get started.</p>
              <Button type="button" onClick={addSlide}>
                <Plus className="w-4 h-4 mr-1" /> Add slide
              </Button>
            </div>
          )}

          {hero.slides.map((slide, index) => (
            <div key={slide.id} className="admin-card border admin-border rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold admin-text-primary">Slide {index + 1}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => moveSlide(index, -1)}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === hero.slides.length - 1}
                    onClick={() => moveSlide(index, 1)}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400"
                    onClick={() =>
                      setHero({ ...hero, slides: hero.slides.filter((_, i) => i !== index) })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm admin-text-primary">
                <input
                  type="checkbox"
                  checked={slide.enabled}
                  onChange={(e) => updateSlide(index, { enabled: e.target.checked })}
                />
                Enabled
              </label>
              <Input
                placeholder="Over-title (e.g. WE BUILD BRANDS THAT)"
                value={slide.overTitle}
                onChange={(e) => updateSlide(index, { overTitle: e.target.value })}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
              />
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  placeholder="Title line 1 (e.g. INSPIRE.)"
                  value={slide.headline}
                  onChange={(e) => updateSlide(index, { headline: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
                <Input
                  placeholder="Title line 2 (e.g. CONNECT.)"
                  value={slide.headlineLine2 ?? ""}
                  onChange={(e) => updateSlide(index, { headlineLine2: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
                <Input
                  placeholder="Title line 3 / highlight (e.g. PERFORM.)"
                  value={slide.highlightText}
                  onChange={(e) => updateSlide(index, { highlightText: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <Textarea
                value={slide.description}
                onChange={(e) => updateSlide(index, { description: e.target.value })}
                rows={3}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Primary button text"
                  value={slide.primaryButtonText}
                  onChange={(e) => updateSlide(index, { primaryButtonText: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
                <Input
                  placeholder="Primary button URL"
                  value={slide.primaryButtonUrl}
                  onChange={(e) => updateSlide(index, { primaryButtonUrl: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
                <Input
                  placeholder="Secondary button text"
                  value={slide.secondaryButtonText}
                  onChange={(e) => updateSlide(index, { secondaryButtonText: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
                <Input
                  placeholder="Secondary button URL"
                  value={slide.secondaryButtonUrl}
                  onChange={(e) => updateSlide(index, { secondaryButtonUrl: e.target.value })}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <ImageUpload
                preset="heroCarousel"
                label="Background image"
                value={slide.backgroundImage ?? ""}
                onChange={(url) => updateSlide(index, { backgroundImage: url })}
              />
              <VideoUpload
                preset="heroBackground"
                label="Background video (optional — takes priority over image)"
                value={slide.backgroundVideo ?? ""}
                onChange={(url) => updateSlide(index, { backgroundVideo: url })}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setStats([
                  ...stats,
                  {
                    id: Date.now().toString(),
                    value: "",
                    label: "",
                    icon: "users",
                    enabled: true,
                    sortOrder: stats.length,
                  },
                ])
              }
              className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
            >
              <Plus className="w-4 h-4 mr-1" /> Add statistic
            </Button>
          </div>
          {stats.map((stat, index) => (
            <div key={stat.id} className="admin-card border admin-border rounded-xl p-6 space-y-3">
              <div className="flex justify-between">
                <span className="admin-text-secondary text-sm">Stat {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400"
                  onClick={() => setStats(stats.filter((_, i) => i !== index))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm admin-text-primary">
                <input
                  type="checkbox"
                  checked={stat.enabled}
                  onChange={(e) => {
                    const next = [...stats]
                    next[index] = { ...stat, enabled: e.target.checked }
                    setStats(next)
                  }}
                />
                Enabled
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Value (e.g. 500+)"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...stats]
                    next[index] = { ...stat, value: e.target.value }
                    setStats(next)
                  }}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
                <Input
                  placeholder="Label (e.g. HAPPY CLIENTS)"
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...stats]
                    next[index] = { ...stat, label: e.target.value }
                    setStats(next)
                  }}
                  className="admin-bg-tertiary admin-border-light admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Icon preset</label>
                <div className="flex items-center gap-3">
                  <div className="text-[var(--home-primary,#fcc50e)] shrink-0">
                    {isStatIconPreset(stat.icon) ? (
                      (() => {
                        const PreviewIcon = STAT_ICON_PRESETS[stat.icon]
                        return <PreviewIcon />
                      })()
                    ) : (
                      <STAT_ICON_PRESETS.users />
                    )}
                  </div>
                  <select
                    value={isStatIconPreset(stat.icon) ? stat.icon : "users"}
                    onChange={(e) => {
                      const next = [...stats]
                      next[index] = { ...stat, icon: e.target.value }
                      setStats(next)
                    }}
                    className="flex-1 admin-bg-tertiary admin-border-light admin-text-primary rounded px-3 py-2"
                  >
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ImageUpload
                preset="statIcon"
                label="Custom icon image (overrides preset)"
                value={stat.icon.startsWith("/") || stat.icon.startsWith("http") ? stat.icon : ""}
                onChange={(url) => {
                  const next = [...stats]
                  next[index] = { ...stat, icon: url }
                  setStats(next)
                }}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === "services" && (
        <div className="space-y-6">
          <div className="admin-card border admin-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold admin-text-primary">Section settings</h2>
              <SectionEnableToggle
                id="services-section-enabled"
                enabled={servicesSection.enabled}
                onChange={(enabled) => setServicesSection({ ...servicesSection, enabled })}
              />
            </div>
            <Input
              placeholder="Label (WHAT WE DO)"
              value={servicesSection.label}
              onChange={(e) => setServicesSection({ ...servicesSection, label: e.target.value })}
              className="admin-bg-tertiary admin-border-light admin-text-primary"
            />
            <Input
              placeholder="Title"
              value={servicesSection.title}
              onChange={(e) => setServicesSection({ ...servicesSection, title: e.target.value })}
              className="admin-bg-tertiary admin-border-light admin-text-primary"
            />
            <Textarea
              value={servicesSection.description}
              onChange={(e) => setServicesSection({ ...servicesSection, description: e.target.value })}
              rows={3}
              className="admin-bg-tertiary admin-border-light admin-text-primary"
            />
            <div className="border-t admin-border pt-4 mt-2">
              <h3 className="text-sm font-semibold admin-text-primary mb-3">Typography & card size</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FontSizeSelect
                  label="Label font size"
                  value={servicesSection.labelFontSize ?? 11}
                  options={SERVICES_LABEL_FONT_SIZES}
                  onChange={(labelFontSize) => setServicesSection({ ...servicesSection, labelFontSize })}
                />
                <FontSizeSelect
                  label="Section title font size"
                  value={servicesSection.sectionTitleFontSize ?? 38}
                  options={SERVICES_SECTION_TITLE_FONT_SIZES}
                  onChange={(sectionTitleFontSize) =>
                    setServicesSection({ ...servicesSection, sectionTitleFontSize })
                  }
                />
                <FontSizeSelect
                  label="Description font size"
                  value={servicesSection.sectionDescriptionFontSize ?? 15}
                  options={SERVICES_SECTION_DESC_FONT_SIZES}
                  onChange={(sectionDescriptionFontSize) =>
                    setServicesSection({ ...servicesSection, sectionDescriptionFontSize })
                  }
                />
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Card width</label>
                  <select
                    value={servicesSection.cardWidth ?? 190}
                    onChange={(e) =>
                      setServicesSection({ ...servicesSection, cardWidth: Number(e.target.value) })
                    }
                    className="w-full admin-bg-tertiary admin-border-light admin-text-primary rounded px-3 py-2 border"
                  >
                    {[150, 170, 190, 210, 240, 280, 320].map((w) => (
                      <option key={w} value={w}>
                        {w}px
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Card height</label>
                  <select
                    value={servicesSection.cardHeight ?? 220}
                    onChange={(e) =>
                      setServicesSection({ ...servicesSection, cardHeight: Number(e.target.value) })
                    }
                    className="w-full admin-bg-tertiary admin-border-light admin-text-primary rounded px-3 py-2 border"
                  >
                    {[160, 180, 200, 220, 260, 300, 360].map((h) => (
                      <option key={h} value={h}>
                        {h}px
                      </option>
                    ))}
                  </select>
                </div>
                <FontSizeSelect
                  label="Card title font size"
                  value={servicesSection.cardTitleFontSize ?? 13}
                  options={SERVICES_CARD_TITLE_FONT_SIZES}
                  onChange={(cardTitleFontSize) => setServicesSection({ ...servicesSection, cardTitleFontSize })}
                />
                <FontSizeSelect
                  label="Card description font size"
                  value={servicesSection.cardDescriptionFontSize ?? 11}
                  options={SERVICES_CARD_DESC_FONT_SIZES}
                  onChange={(cardDescriptionFontSize) =>
                    setServicesSection({ ...servicesSection, cardDescriptionFontSize })
                  }
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Explore link text"
                value={servicesSection.exploreLinkText}
                onChange={(e) => setServicesSection({ ...servicesSection, exploreLinkText: e.target.value })}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
              />
              <Input
                placeholder="Explore link URL"
                value={servicesSection.exploreLinkUrl}
                onChange={(e) => setServicesSection({ ...servicesSection, exploreLinkUrl: e.target.value })}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setServicesSection({
                  ...servicesSection,
                  items: [
                    ...servicesSection.items,
                    {
                      id: Date.now().toString(),
                      title: "",
                      description: "",
                      icon: "",
                      link: "/services",
                      enabled: true,
                      sortOrder: servicesSection.items.length,
                    },
                  ],
                })
              }
              className="admin-border-light text-gray-300 hover:admin-bg-secondary bg-transparent"
            >
              <Plus className="w-4 h-4 mr-1" /> Add service card
            </Button>
          </div>

          {servicesSection.items.map((item, index) => (
            <div key={item.id} className="admin-card border admin-border rounded-xl p-6 space-y-3">
              <div className="flex justify-between">
                <span className="admin-text-secondary text-sm">Card {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400"
                  onClick={() =>
                    setServicesSection({
                      ...servicesSection,
                      items: servicesSection.items.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm admin-text-primary">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) => {
                    const items = [...servicesSection.items]
                    items[index] = { ...item, enabled: e.target.checked }
                    setServicesSection({ ...servicesSection, items })
                  }}
                />
                Enabled
              </label>
              <Input
                placeholder="Title"
                value={item.title}
                onChange={(e) => {
                  const items = [...servicesSection.items]
                  items[index] = { ...item, title: e.target.value }
                  setServicesSection({ ...servicesSection, items })
                }}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
              />
              <Textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  const items = [...servicesSection.items]
                  items[index] = { ...item, description: e.target.value }
                  setServicesSection({ ...servicesSection, items })
                }}
                rows={2}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
              />
              <Input
                placeholder="Link URL"
                value={item.link}
                onChange={(e) => {
                  const items = [...servicesSection.items]
                  items[index] = { ...item, link: e.target.value }
                  setServicesSection({ ...servicesSection, items })
                }}
                className="admin-bg-tertiary admin-border-light admin-text-primary"
              />
              <ImageUpload
                preset="serviceIcon"
                label="Icon"
                value={item.icon}
                onChange={(url) => {
                  const items = [...servicesSection.items]
                  items[index] = { ...item, icon: url }
                  setServicesSection({ ...servicesSection, items })
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
