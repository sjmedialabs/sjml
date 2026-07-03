import Link from "next/link"
import type { IndustriesPageCta, IndustriesPageTypography } from "@/lib/industries-page-content"
import { SectionLabel } from "@/components/about/section-label"

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function IndustriesCtaSection({
  data,
  typography,
}: {
  data: IndustriesPageCta
  typography: IndustriesPageTypography
}) {
  return (
    <section className="industries-cta-section bg-white pb-10 md:pb-14">
      <div className="site-container">
        <div className="industries-cta-panel">
          <div className="industries-cta-grid">
            <div className="min-w-0">
              {data.label && (
                <SectionLabel fontSize={typography.ctaLabelFontSize}>{data.label}</SectionLabel>
              )}
              {data.heading && (
                <h2 className="font-bold text-black leading-snug" style={{ fontSize: `${typography.ctaHeadingFontSize}px` }}>
                  {data.heading}
                </h2>
              )}
            </div>
            <div className="min-w-0 flex flex-col items-start justify-center gap-4">
              {data.text && (
                <p className="text-black/70 leading-relaxed" style={{ fontSize: `${typography.ctaTextFontSize}px` }}>
                  {data.text}
                </p>
              )}
              <Link
                href={data.buttonUrl || "/contact"}
                className="home-hero-cta-primary inline-flex items-center gap-2 h-10 px-5 font-bold uppercase tracking-wide shrink-0"
                style={{ fontSize: `${typography.ctaButtonFontSize}px` }}
              >
                {data.buttonText || "LET'S TALK"}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
