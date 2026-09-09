"use client"

import { useMemo, useState, useEffect, useLayoutEffect, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { WorkPageFilterCategory, WorkPageTypography } from "@/lib/work-page-content"
import type { WorkGridItem } from "@/lib/work-grid-item"

const WORK_FILTER_STORAGE_KEY = "sjml-work-page-filters"

type StoredWorkFilters = {
  category?: string
  industry?: string
  restore?: boolean
}

function readStoredWorkFilters(): StoredWorkFilters | null {
  try {
    const raw = sessionStorage.getItem(WORK_FILTER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredWorkFilters
  } catch {
    return null
  }
}

function writeStoredWorkFilters(filters: StoredWorkFilters) {
  try {
    sessionStorage.setItem(WORK_FILTER_STORAGE_KEY, JSON.stringify(filters))
  } catch {
    // Ignore quota / private-mode failures
  }
}

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
  availableIndustries = [],
  filterCategories,
  industryFilterLabel,
  typography,
}: {
  works: WorkGridItem[]
  availableIndustries?: string[]
  filterCategories: WorkPageFilterCategory[]
  industryFilterLabel: string
  typography: WorkPageTypography
}) {
  const searchParams = useSearchParams()
  const initialIndustryParam = searchParams.get("industry") || ""

  const [activeCategory, setActiveCategory] = useState("all")
  const [activeIndustry, setActiveIndustry] = useState("all")
  const restoredFromDetailRef = useRef(false)

  // Combine industries from created industries list + industries attached to work items
  const industries = useMemo(() => {
    const set = new Set<string>()
    availableIndustries.forEach((ind) => {
      if (ind && ind.trim()) set.add(ind.trim())
    })
    works.forEach((w) => {
      if (w.industry?.trim()) set.add(w.industry.trim())
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [availableIndustries, works])

  // Restore the tab/industry selected before opening a work detail page.
  // useLayoutEffect applies it before paint so the UI does not flash back to ALL.
  useLayoutEffect(() => {
    const stored = readStoredWorkFilters()
    if (!stored?.restore) return

    restoredFromDetailRef.current = true

    if (stored.category && filterCategories.some((cat) => cat.value === stored.category)) {
      setActiveCategory(stored.category)
    }
    if (typeof stored.industry === "string" && stored.industry) {
      setActiveIndustry(stored.industry)
    }

    // Delay clearing so React Strict Mode's immediate remount still sees restore=true.
    const timeoutId = window.setTimeout(() => {
      writeStoredWorkFilters({ ...stored, restore: false })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [filterCategories])

  // Sync activeIndustry with query parameter if present (e.g. /work?industry= from industries page).
  // Skip when returning from a work detail so the restored dropdown is not overwritten.
  useEffect(() => {
    if (restoredFromDetailRef.current) return
    if (!initialIndustryParam) return
    const paramLower = initialIndustryParam.toLowerCase().trim()

    // Find exact or case-insensitive match in industries list
    const matched = industries.find((ind) => ind.toLowerCase().trim() === paramLower)
    if (matched) {
      setActiveIndustry(matched)
    } else {
      setActiveIndustry(initialIndustryParam)
    }
  }, [initialIndustryParam, industries])

  const persistFiltersForDetail = () => {
    writeStoredWorkFilters({
      category: activeCategory,
      industry: activeIndustry,
      restore: true,
    })
  }

  const filtered = useMemo(() => {
    return works.filter((work) => {
      const cats = work.categories ?? []
      const categoryMatch =
        activeCategory === "all" ||
        cats.includes(activeCategory) ||
        work.categoryTags?.toLowerCase().includes(activeCategory.replace("-", " "))

      const workInd = (work.industry || "").toLowerCase().trim()
      const selInd = activeIndustry.toLowerCase().trim()
      const industryMatch = activeIndustry === "all" || workInd === selInd

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
            <Link
              key={work.id}
              href={`/work/${work.slug}`}
              className="work-card group"
              onClick={persistFiltersForDetail}
            >
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
