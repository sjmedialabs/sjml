import Link from "next/link"
import type { WorkPageCta, WorkPageTypography } from "@/lib/work-page-content"

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function WorkCtaSection({
  data,
  typography,
}: {
  data: WorkPageCta
  typography: WorkPageTypography
}) {
  return (
    <section className="work-cta-banner bg-home-secondary py-8 md:py-10">
      <div className="site-container flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white font-medium text-center md:text-left" style={{ fontSize: `${typography.ctaTextFontSize}px` }}>
          {data.textLine1}{" "}
          <span className="text-home-primary">{data.textHighlight}</span>
        </p>
        <Link
          href={data.buttonUrl || "/contact"}
          className="home-hero-cta-primary inline-flex items-center gap-2 h-9 px-4 font-bold uppercase tracking-wide shrink-0"
          style={{ fontSize: `${typography.ctaButtonFontSize}px` }}
        >
          {data.buttonText || "LET'S TALK"}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  )
}
