"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type {
  InsightsPageFilterCategory,
  InsightsPageLoadMore,
  InsightsPageTypography,
} from "@/lib/insights-page-content"
import type { InsightGridItem } from "@/lib/insight-grid-item"
import { FlatSvg } from "@/components/flat-svg"

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <FlatSvg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </FlatSvg>
  )
}

export function InsightsGridSection({
  posts,
  filterCategories,
  searchPlaceholder,
  loadMore,
  typography,
}: {
  posts: InsightGridItem[]
  filterCategories: InsightsPageFilterCategory[]
  searchPlaceholder: string
  loadMore: InsightsPageLoadMore
  typography: InsightsPageTypography
}) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(loadMore.initialVisible)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((post) => {
      const categoryMatch =
        activeCategory === "all" ||
        post.categories.includes(activeCategory) ||
        post.categoryTags.toLowerCase().includes(activeCategory.replace("-", " "))
      const searchMatch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.categoryTags.toLowerCase().includes(q)
      return categoryMatch && searchMatch
    })
  }, [posts, activeCategory, search])

  const visible = filtered.slice(0, visibleCount)
  const canLoadMore = visibleCount < filtered.length

  const availableFilterCategories = useMemo(() => {
    return filterCategories.filter((cat) => {
      if (cat.value === "all") return true
      return posts.some(
        (post) =>
          post.categories.includes(cat.value) ||
          post.categoryTags.toLowerCase().includes(cat.value.replace("-", " "))
      )
    })
  }, [filterCategories, posts])

  return (
    <section className="insights-grid-section bg-white py-10 md:py-12">
      <div className="site-container">
        <div className="insights-filter-bar">
          <div className="insights-filter-tabs">
            {availableFilterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.value)
                  setVisibleCount(loadMore.initialVisible)
                }}
                className={`insights-filter-btn ${activeCategory === cat.value ? "insights-filter-active" : ""}`}
                style={{ fontSize: `${typography.filterFontSize}px` }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <label className="insights-search-wrap">
            <SearchIcon />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setVisibleCount(loadMore.initialVisible)
              }}
              placeholder={searchPlaceholder}
              className="insights-search-input"
              style={{ fontSize: `${typography.searchFontSize}px` }}
            />
          </label>
        </div>

        <div className="insights-card-grid">
          {visible.map((post) => (
            <Link key={post.id} href={`/insights/${post.slug.trim().replace(/\.+$/, "")}`} className="insight-card group">
              <div className="insight-card-image-wrap">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt={post.title} className="insight-card-image" />
                ) : (
                  <div className="insight-card-image insight-card-image-placeholder" />
                )}
                {post.categoryTags && (
                  <span className="insight-card-tag" style={{ fontSize: `${typography.cardCategoryFontSize}px` }}>
                    {post.categoryTags}
                  </span>
                )}
              </div>
              <div className="insight-card-body">
                <span className="insight-card-title block" style={{ fontSize: `${Math.max(14, typography.cardTitleFontSize)}px` }}>
                  {post.title}
                </span>
                {post.excerpt && (
                  <span className="insight-card-excerpt block" style={{ fontSize: `${Math.max(14, typography.cardExcerptFontSize)}px` }}>
                    {post.excerpt}
                  </span>
                )}
                <div className="insight-card-footer" style={{ fontSize: `${Math.max(14, typography.cardMetaFontSize)}px` }}>
                  <span>{post.date}</span>
                  <span aria-hidden="true">•</span>
                  <span>{post.readTime}</span>
                  <span className="insight-card-arrow" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-black/50 py-12">No insights match your search.</p>
        )}

        {canLoadMore && (
          <div className="insights-load-more-wrap">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + loadMore.loadBatch)}
              className="insights-load-more-btn"
              style={{ fontSize: `${typography.loadMoreFontSize}px` }}
            >
              {loadMore.buttonText}
              <ArrowIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
