import Link from "next/link"
import { Fragment } from "react"
import type { WorkDetailTemplate } from "@/lib/work-detail-template"
import { WorkMetaIcon } from "@/components/work/work-icons"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"

export function WorkDetailHero({
  title,
  template,
}: {
  title: string
  template: WorkDetailTemplate
}) {
  const typo = template.typography
  const heroImage = template.heroImage || undefined

  const metaItems = [
    template.meta.year ? { icon: "calendar" as const, value: template.meta.year } : null,
    template.meta.industry ? { icon: "diamond" as const, value: template.meta.industry } : null,
    template.meta.location ? { icon: "location" as const, value: template.meta.location } : null,
  ].filter(Boolean) as Array<{ icon: "calendar" | "diamond" | "location"; value: string }>

  return (
    <section className="work-detail-hero">
      <InnerPageHeroBackground image={heroImage} />
      <div className="site-container work-detail-hero-inner">
        <div className="work-detail-hero-grid">
          <div className="work-detail-hero-panel">
            <div className="work-detail-hero-panel-inner">
              <nav aria-label="Breadcrumb" className="work-detail-breadcrumbs">
                <Link href="/">Home</Link>
                <span aria-hidden="true">&gt;</span>
                <Link href="/work">Work</Link>
                <span aria-hidden="true">&gt;</span>
                <span className="work-detail-breadcrumbs-current">{title}</span>
              </nav>

              {template.categoryTags && (
                <p className="work-detail-hero-category" style={{ fontSize: `${typo.categoryFontSize}px` }}>
                  {template.categoryTags}
                </p>
              )}

              <h1 className="work-detail-hero-title" style={{ fontSize: `${typo.titleFontSize}px` }}>
                {title}
              </h1>

              {template.subtitle && (
                <p className="work-detail-hero-subtitle" style={{ fontSize: `${typo.subtitleFontSize}px` }}>
                  {template.subtitle}
                </p>
              )}

              {template.introParagraph && (
                <p className="work-detail-hero-intro" style={{ fontSize: `${typo.introFontSize}px` }}>
                  {template.introParagraph}
                </p>
              )}

              {metaItems.length > 0 && (
                <div className="work-detail-meta-bar">
                  {metaItems.map((item, index) => (
                    <Fragment key={item.value}>
                      {index > 0 && <span className="work-detail-meta-divider" aria-hidden="true" />}
                      <div className="work-detail-meta-item">
                        <WorkMetaIcon icon={item.icon} className="work-detail-meta-icon" />
                        <span style={{ fontSize: `${typo.metaFontSize}px` }}>{item.value}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
