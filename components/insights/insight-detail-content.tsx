import Link from "next/link"
import type { InsightDetailTemplate } from "@/lib/insight-detail-template"
import { InsightShareLinks } from "./insight-share-links"

export function InsightDetailContent({
  title,
  categoryTags,
  date,
  readTime,
  author,
  image,
  template,
}: {
  title: string
  categoryTags: string
  date: string
  readTime: string
  author: string
  image: string
  template: InsightDetailTemplate
}) {
  const typo = template.typography

  return (
    <article className="insight-detail-article">
      {categoryTags && (
        <span className="insight-detail-category" style={{ fontSize: `${typo.categoryFontSize}px` }}>
          {categoryTags}
        </span>
      )}
      <h1 className="insight-detail-title" style={{ fontSize: `${typo.titleFontSize}px` }}>
        {title}
      </h1>
      <p className="insight-detail-meta" style={{ fontSize: `${typo.metaFontSize}px` }}>
        {[date, readTime, author ? `By ${author}` : ""].filter(Boolean).join(" • ")}
      </p>

      {image && (
        <div className="insight-detail-featured-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className="insight-detail-featured-image" />
        </div>
      )}

      {template.introParagraph && (
        <p className="insight-detail-intro" style={{ fontSize: `${typo.introFontSize}px` }}>
          {template.introParagraph}
        </p>
      )}

      <div className="insight-detail-sections">
        {template.sections.map((section) => (
          <div key={section.id} className="insight-detail-section">
            <h2 className="insight-detail-section-heading" style={{ fontSize: `${typo.sectionHeadingFontSize}px` }}>
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className="insight-detail-body" style={{ fontSize: `${typo.bodyFontSize}px` }}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>

      {template.closingStatement && (
        <p className="insight-detail-closing">{template.closingStatement}</p>
      )}

      <InsightShareLinks
        label={template.shareLabel}
        links={template.shareLinks}
        fontSize={typo.shareLabelFontSize}
      />
    </article>
  )
}

export function InsightDetailBreadcrumbs({ title }: { title: string }) {
  return (
    <div className="insight-breadcrumbs-bar">
      <div className="site-container">
        <nav aria-label="Breadcrumb" className="insight-breadcrumbs">
          <Link href="/">Home</Link>
          <span className="insight-breadcrumbs-sep" aria-hidden="true">&gt;</span>
          <Link href="/insights">Insights</Link>
          <span className="insight-breadcrumbs-sep" aria-hidden="true">&gt;</span>
          <span className="insight-breadcrumbs-current">{title}</span>
        </nav>
      </div>
    </div>
  )
}
