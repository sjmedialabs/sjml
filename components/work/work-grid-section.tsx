"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { WorkPageFilterCategory, WorkPageTypography } from "@/lib/work-page-content"
import type { WorkGridItem } from "@/lib/work-grid-item"

function PlayIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" fill="rgb(0 0 0 / 0.35)" />
      <path d="M20 16.5v15l12-7.5-12-7.5Z" fill="white" />
    </svg>
  )
}

export function WorkGridSection({
  works,
  filterCategories,
  industryFilterLabel,
  typography,
}: {
  works: WorkGridItem[]
  filterCategories: WorkPageFilterCategory[]
  industryFilterLabel: string
  typography: WorkPageTypography
}) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeIndustry, setActiveIndustry] = useState("all")

  const industries = useMemo(() => {
    const set = new Set<string>()
    works.forEach((w) => {
      if (w.industry?.trim()) set.add(w.industry.trim())
    })
    return Array.from(set).sort()
  }, [works])

  const filtered = useMemo(() => {
    return works.filter((work) => {
      const cats = work.categories ?? []
      const categoryMatch =
        activeCategory === "all" ||
        cats.includes(activeCategory) ||
        work.categoryTags?.toLowerCase().includes(activeCategory.replace("-", " "))
      const industryMatch = activeIndustry === "all" || work.industry === activeIndustry
      return categoryMatch && industryMatch
    })
  }, [works, activeCategory, activeIndustry])

  return (
    <section className="work-grid-section bg-white py-8 md:py-12">
      <div className="site-container">
        <div className="work-filter-bar">
          <div className="work-filter-tabs">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`work-filter-btn ${activeCategory === cat.value ? "work-filter-active" : ""}`}
                style={{ fontSize: `${typography.filterFontSize}px` }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="work-filter-dropdown-wrap">
            <label className="sr-only" htmlFor="work-industry-filter">
              Filter by industry
            </label>
            <select
              id="work-industry-filter"
              value={activeIndustry}
              onChange={(e) => setActiveIndustry(e.target.value)}
              className="work-industry-select"
              style={{ fontSize: `${typography.filterFontSize}px` }}
            >
              <option value="all">{industryFilterLabel}</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="work-card-grid">
          {filtered.map((work) => (
            <Link key={work.id} href={`/work/${work.slug}`} className="work-card group">
              <div className="work-card-image-wrap">
                {work.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={work.image} alt={work.title} className="work-card-image" />
                ) : (
                  <div className="work-card-image work-card-image-placeholder" />
                )}
                {work.isVideo && (
                  <div className="work-card-play-overlay" aria-hidden="true">
                    <PlayIcon />
                  </div>
                )}
              </div>
              <div className="work-card-body">
                {work.categoryTags && (
                  <p className="work-card-category" style={{ fontSize: `${typography.cardCategoryFontSize}px` }}>
                    {work.categoryTags}
                  </p>
                )}
                <h3 className="work-card-title" style={{ fontSize: `${typography.cardTitleFontSize}px` }}>
                  {work.title}
                </h3>
                {work.cardSubtitle && (
                  <p className="work-card-subtitle" style={{ fontSize: `${typography.cardSubtitleFontSize}px` }}>
                    {work.cardSubtitle}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-black/50 py-12">No projects match the selected filters.</p>
        )}
      </div>
    </section>
  )
}
