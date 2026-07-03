import Link from "next/link"
import type { ContactBottomCta, ContactPageTypography } from "@/lib/contact-page-content"

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.7 0-8 1.3-8 4v2h10v-2c0-1.1.4-2.1 1.1-2.8A6.7 6.7 0 0 0 8 13Zm8 0a6.7 6.7 0 0 0-3.1.8c.7.7 1.1 1.7 1.1 2.8v2h8v-2c0-2.7-5.3-4-8-4Z" />
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

export function ContactBottomCtaSection({
  data,
  typography,
}: {
  data: ContactBottomCta
  typography: ContactPageTypography
}) {
  return (
    <section className="contact-bottom-cta-section bg-white pb-10 md:pb-14">
      <div className="site-container">
        <div className="contact-bottom-cta-panel">
          <div className="contact-bottom-cta-icon" aria-hidden="true">
            <PeopleIcon />
          </div>
          <p className="contact-bottom-cta-text" style={{ fontSize: `${typography.ctaTextFontSize}px` }}>
            {data.text}
          </p>
          <Link
            href={data.buttonUrl || "/contact"}
            className="contact-bottom-cta-btn"
            style={{ fontSize: `${typography.ctaButtonFontSize}px` }}
          >
            {data.buttonText}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
