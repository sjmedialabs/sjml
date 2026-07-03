import Link from "next/link"
import type { ServiceDetailCta, ServiceDetailTypography } from "@/lib/service-detail-template"
import { DetailIconSidebarTarget } from "./service-detail-icons"

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export interface SidebarNavItem {
  slug: string
  name: string
  href: string
  active?: boolean
}

export function ServiceDetailSidebar({
  parentTitle,
  navItems,
  sidebarCta,
  typography,
}: {
  parentTitle: string
  parentSlug: string
  navItems: SidebarNavItem[]
  sidebarCta: ServiceDetailCta
  typography: ServiceDetailTypography
}) {
  return (
    <aside className="service-detail-sidebar">
      <p
        className="font-bold uppercase text-home-primary mb-5 tracking-[0.18em]"
        style={{ fontSize: `${typography.categoryLabelFontSize}px` }}
      >
        {parentTitle}
      </p>

      {navItems.length > 0 && (
        <nav className="service-detail-nav mb-8" aria-label="Service navigation">
          <ul className="space-y-0">
            {navItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  className={`service-detail-nav-link flex items-center gap-2.5 py-2.5 px-3 text-sm transition-colors ${
                    item.active
                      ? "is-active bg-black/[0.04] text-black font-semibold"
                      : "text-black/70 hover:text-black hover:bg-black/[0.02]"
                  }`}
                >
                  <span
                    className={`service-detail-nav-bullet shrink-0 rounded-full ${
                      item.active ? "bg-home-primary" : "bg-transparent"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {(sidebarCta.heading || sidebarCta.text) && (
        <div className="service-sidebar-cta border border-black/10 rounded-lg p-5">
          <div className="text-home-primary mb-3" style={{ width: 40, height: 40 }}>
            <DetailIconSidebarTarget />
          </div>
          {sidebarCta.heading && (
            <p
              className="font-bold text-black mb-1.5 leading-snug"
              style={{ fontSize: `${typography.sidebarCtaHeadingFontSize}px` }}
            >
              {sidebarCta.heading}
            </p>
          )}
          {sidebarCta.text && (
            <p className="text-black/65 mb-4 leading-relaxed" style={{ fontSize: `${typography.sidebarCtaTextFontSize}px` }}>
              {sidebarCta.text}
            </p>
          )}
          <Link
            href={sidebarCta.buttonUrl || "/contact"}
            className="home-hero-cta-primary inline-flex items-center gap-2 h-9 px-4 font-bold uppercase tracking-wide w-full justify-center"
            style={{ fontSize: `${typography.sidebarCtaButtonFontSize}px` }}
          >
            {sidebarCta.buttonText || "LET'S TALK"}
            <ArrowIcon />
          </Link>
        </div>
      )}
    </aside>
  )
}

export function ServiceDetailBottomCta({
  data,
  typography,
}: {
  data: ServiceDetailCta
  typography: ServiceDetailTypography
}) {
  if (!data.heading && !data.text) return null
  return (
    <div className="service-bottom-cta bg-black/[0.03] border border-black/[0.06] rounded-xl p-6 md:py-7 md:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="text-center md:text-left">
        {data.heading && (
          <p className="font-bold text-black mb-1 leading-snug" style={{ fontSize: `${typography.bottomCtaHeadingFontSize}px` }}>
            {data.heading}
          </p>
        )}
        {data.text && (
          <p className="text-black/65 leading-relaxed" style={{ fontSize: `${typography.bottomCtaTextFontSize}px` }}>
            {data.text}
          </p>
        )}
      </div>
      <Link
        href={data.buttonUrl || "/contact"}
        className="home-hero-cta-primary inline-flex items-center gap-2 h-10 px-5 font-bold uppercase tracking-wide shrink-0"
        style={{ fontSize: `${typography.bottomCtaButtonFontSize}px` }}
      >
        {data.buttonText || "GET STARTED"}
        <ArrowIcon />
      </Link>
    </div>
  )
}
