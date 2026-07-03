"use client"

import { useState } from "react"
import Link from "next/link"
import type { InsightsPageSidebarNewsletter, InsightsPageTypography } from "@/lib/insights-page-content"
import type { InsightGridItem } from "@/lib/insight-grid-item"

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function InsightDetailSidebar({
  related,
  relatedHeading,
  newsletter,
  typography,
  currentSlug,
}: {
  related: InsightGridItem[]
  relatedHeading: string
  newsletter: InsightsPageSidebarNewsletter
  typography: InsightsPageTypography
  currentSlug: string
}) {
  const [email, setEmail] = useState("")
  const items = related.filter((p) => p.slug !== currentSlug).slice(0, 4)

  return (
    <aside className="insight-detail-sidebar">
      {items.length > 0 && (
        <div className="insight-related-block">
          <span className="insight-related-accent" aria-hidden="true" />
          <h2 className="insight-related-heading" style={{ fontSize: `${typography.sidebarHeadingFontSize}px` }}>
            {relatedHeading}
          </h2>
          <div className="insight-related-list">
            {items.map((post) => (
              <Link key={post.id} href={`/insights/${post.slug}`} className="insight-related-item group">
                <div className="insight-related-thumb-wrap">
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image} alt="" className="insight-related-thumb" />
                  ) : (
                    <div className="insight-related-thumb insight-related-thumb-placeholder" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="insight-related-title" style={{ fontSize: `${typography.sidebarCardTitleFontSize}px` }}>
                    {post.title}
                  </p>
                  <p className="insight-related-meta" style={{ fontSize: `${typography.sidebarCardMetaFontSize}px` }}>
                    {post.date} • {post.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="insight-newsletter-box">
        <div className="insight-newsletter-icon" aria-hidden="true">
          <MailIcon />
        </div>
        {newsletter.heading && (
          <h3 className="insight-newsletter-heading">{newsletter.heading}</h3>
        )}
        <p className="insight-newsletter-text" style={{ fontSize: `${typography.newsletterTextFontSize}px` }}>
          {newsletter.text}
        </p>
        <form
          className="insight-newsletter-form"
          onSubmit={(e) => {
            e.preventDefault()
            setEmail("")
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletter.placeholder}
            className="insight-newsletter-input"
            required
          />
          <button type="submit" className="insight-newsletter-btn" style={{ fontSize: `${typography.newsletterButtonFontSize}px` }}>
            {newsletter.buttonText}
            <ArrowIcon />
          </button>
        </form>
      </div>
    </aside>
  )
}
