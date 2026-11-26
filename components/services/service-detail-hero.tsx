import Link from "next/link"
import type { ServiceDetailTypography } from "@/lib/service-detail-template"
import { heroBackgroundStyle } from "@/components/inner-page-hero-background"
import { Breadcrumbs } from "@/components/breadcrumbs"

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function ServiceDetailHero({
  breadcrumbs,
  categoryLabel,
  title,
  description,
  buttonText,
  buttonUrl,
  image,
  typography,
}: {
  breadcrumbs: { label: string; href?: string }[]
  categoryLabel?: string
  title: string
  description?: string
  buttonText?: string
  buttonUrl?: string
  image?: string
  typography: ServiceDetailTypography
}) {
  return (
    <section className="about-hero service-detail-hero bg-home-secondary" style={heroBackgroundStyle(image)}>
      <div className="site-container about-hero-inner">
        <div className="about-hero-grid">
          <div className="about-hero-content w-full max-w-3xl">
            <Breadcrumbs items={breadcrumbs} highlightLast className="service-detail-hero-breadcrumbs text-xs mb-4" />

            {categoryLabel && (
              <p
                className="uppercase tracking-[0.2em] text-home-primary font-bold mb-2"
                style={{ fontSize: `${Math.max(typography.categoryLabelFontSize, 12)}px` }}
              >
                {categoryLabel}
              </p>
            )}

            <h1
              className="font-bold text-white leading-[1.05] uppercase tracking-tight mb-3"
              style={{ fontSize: `clamp(2rem, 5vw, ${Math.max(typography.titleFontSize, 44)}px)` }}
            >
              {title}
            </h1>

            {description && (
              <p
                className="text-white/85 leading-relaxed max-w-xl mb-4"
                style={{ fontSize: `${typography.heroDescriptionFontSize}px` }}
              >
                {description}
              </p>
            )}

            {buttonText && (
              <Link
                href={buttonUrl || "/contact"}
                className="home-hero-cta-primary inline-flex items-center gap-2 h-11 px-5 font-bold uppercase tracking-wide"
                style={{ fontSize: `${typography.sidebarCtaButtonFontSize}px` }}
              >
                {buttonText}
                <ArrowIcon />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
