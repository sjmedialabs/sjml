"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"
import { CaseStudyDownloadModal } from "./case-study-download-modal"

export interface CaseStudyCardItem {
  id: string
  slug: string
  title: string
  description: string
  image: string
  tags: string[]
  client?: string
  industry?: string
  year?: string
  pdfUrl?: string
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  )
}

interface CaseStudiesGridSectionProps {
  studies: CaseStudyCardItem[]
  categories?: string[]
}

export function CaseStudiesGridSection({
  studies,
  categories = ["all", "branding", "digital marketing", "web development", "advertising"],
}: CaseStudiesGridSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(6)
  const [selectedStudy, setSelectedStudy] = useState<{ title: string; pdfUrl?: string } | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return studies.filter((study) => {
      const categoryMatch =
        activeCategory === "all" ||
        study.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase())) ||
        (study.industry && study.industry.toLowerCase().includes(activeCategory.toLowerCase()))

      const searchMatch =
        !q ||
        study.title.toLowerCase().includes(q) ||
        study.description.toLowerCase().includes(q) ||
        study.tags.some((t) => t.toLowerCase().includes(q)) ||
        (study.industry && study.industry.toLowerCase().includes(q))

      return categoryMatch && searchMatch
    })
  }, [studies, activeCategory, search])

  const visible = filtered.slice(0, visibleCount)
  const canLoadMore = visibleCount < filtered.length

  return (
    <section className="insights-grid-section bg-white py-10 md:py-12">
      <div className="site-container">
        {/* Exact Insights Filter Bar & Search Input */}
        <div className="insights-filter-bar">
          <div className="insights-filter-tabs">
            {categories.map((cat) => {
              const val = cat.toLowerCase()
              const label = cat.toUpperCase()
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(val)
                    setVisibleCount(6)
                  }}
                  className={`insights-filter-btn ${activeCategory === val ? "insights-filter-active" : ""}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <label className="insights-search-wrap">
            <SearchIcon />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setVisibleCount(6)
              }}
              placeholder="Search case studies..."
              className="insights-search-input"
            />
          </label>
        </div>

        {/* Exact Insights Card Grid */}
        <div className="insights-card-grid">
          {visible.map((study) => (
            <div
              key={study.id || study.slug}
              className="insight-card group flex flex-col justify-between"
            >
              <div>
                <div className="insight-card-image-wrap">
                  {study.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={study.image} alt={study.title} className="insight-card-image" />
                  ) : (
                    <div className="insight-card-image insight-card-image-placeholder" />
                  )}
                  {study.tags && study.tags.length > 0 && (
                    <span className="insight-card-tag">{study.tags[0]}</span>
                  )}
                </div>

                <div className="insight-card-body">
                  <h3 className="insight-card-title text-base font-bold text-gray-900 group-hover:text-home-primary transition-colors">
                    {study.title}
                  </h3>
                  {study.description && (
                    <p className="insight-card-excerpt">
                      {study.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudy({ title: study.title, pdfUrl: study.pdfUrl })}
                  className="w-full flex items-center justify-center gap-2 bg-home-primary hover:bg-home-primary-hover text-black text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-lg transition-all duration-200 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Case Study</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-black/50 py-12">No case studies match your search.</p>
        )}

        {canLoadMore && (
          <div className="insights-load-more-wrap">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + 6)}
              className="insights-load-more-btn"
            >
              <span>Load More Case Studies</span>
            </button>
          </div>
        )}
      </div>

      {/* Popup Form Modal */}
      {selectedStudy && (
        <CaseStudyDownloadModal
          isOpen={true}
          onClose={() => setSelectedStudy(null)}
          caseStudyTitle={selectedStudy.title}
          pdfUrl={selectedStudy.pdfUrl}
        />
      )}
    </section>
  )
}
