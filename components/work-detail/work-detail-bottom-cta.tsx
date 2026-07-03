import Link from "next/link"
import type { WorkDetailTemplate } from "@/lib/work-detail-template"
import { WorkPaperPlaneIcon } from "@/components/work/work-icons"

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function WorkDetailBottomCta({ template }: { template: WorkDetailTemplate }) {
  const { bottomCta, typography: typo } = template

  return (
    <section className="work-detail-bottom-cta">
      <div className="site-container">
        <div className="work-detail-cta-panel">
          <div className="work-detail-cta-icon-wrap" aria-hidden="true">
            <WorkPaperPlaneIcon className="work-detail-cta-plane-icon" />
          </div>
          <div className="work-detail-cta-copy">
            <p className="work-detail-cta-label" style={{ fontSize: `${Math.max(typo.bottomCtaHeadingFontSize - 6, 14)}px` }}>
              {bottomCta.labelLine || "Have a project in mind?"}
            </p>
            <p className="work-detail-cta-heading" style={{ fontSize: `${typo.bottomCtaHeadingFontSize}px` }}>
              {bottomCta.heading}
            </p>
          </div>
          <Link
            href={bottomCta.buttonUrl || "/contact"}
            className="home-hero-cta-primary work-detail-cta-button inline-flex items-center gap-2 h-10 px-5 font-bold uppercase tracking-wide shrink-0"
            style={{ fontSize: `${typo.bottomCtaButtonFontSize}px` }}
          >
            {bottomCta.buttonText || "LET'S TALK"}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
