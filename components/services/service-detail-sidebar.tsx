import Link from "next/link"
import type { ServiceDetailCta, ServiceDetailTypography } from "@/lib/service-detail-template"

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
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
  parentSlug,
  parentHref,
  parentActive = false,
  showOverview = false,
  navItems,
  sidebarCta,
  typography,
}: {
  parentTitle: string
  parentSlug: string
  parentHref?: string
  parentActive?: boolean
  showOverview?: boolean
  navItems: SidebarNavItem[]
  sidebarCta: ServiceDetailCta
  typography: ServiceDetailTypography
}) {
  const categoryHref = parentHref || `/services/${parentSlug}`
  const hasChildren = navItems.length > 0

  return (
    <aside className="service-detail-sidebar lg:sticky lg:top-28">
      <Link
        href="/services"
        className="service-detail-back-link inline-flex items-center gap-1.5 text-black/55 hover:text-black mb-5 transition-colors"
        style={{ fontSize: `${typography.categoryLabelFontSize + 1}px` }}
      >
        <ChevronLeftIcon />
        <span className="font-semibold uppercase tracking-[0.12em]">All Services</span>
      </Link>

      <div className="service-detail-hierarchy mb-8">
        <Link
          href={categoryHref}
          className={`service-detail-category-link block font-bold uppercase tracking-[0.16em] mb-3 transition-colors ${
            parentActive ? "text-home-primary" : "text-black/80 hover:text-home-primary"
          }`}
          style={{ fontSize: `${Math.max(typography.categoryLabelFontSize, 12)}px` }}
          aria-current={parentActive ? "page" : undefined}
        >
          {parentTitle}
        </Link>

        {hasChildren && (
          <nav className="service-detail-nav flex flex-col gap-1" aria-label="Service hierarchy">
            {showOverview && (
              <Link
                href={categoryHref}
                className={`service-detail-nav-link rounded-md flex items-center gap-2.5 py-2.5 px-3 text-sm transition-colors ${
                  parentActive
                    ? "is-active bg-home-primary text-black font-semibold"
                    : "text-black/70 hover:text-black hover:bg-black/[0.03]"
                }`}
                aria-current={parentActive ? "page" : undefined}
              >
                Overview
              </Link>
            )}
            {navItems.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className={`service-detail-nav-link rounded-md flex items-center gap-2.5 py-2.5 px-3 text-sm transition-colors ${
                  item.active
                    ? "is-active bg-home-primary text-black font-semibold"
                    : "text-black/70 hover:text-black hover:bg-black/[0.03]"
                }`}
                aria-current={item.active ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {(sidebarCta.heading || sidebarCta.text) && (
        <div className="service-sidebar-cta rounded-xl p-5 bg-home-primary">
          {sidebarCta.heading && (
            <p
              className="font-bold text-black mb-1.5 leading-snug"
              style={{ fontSize: `${typography.sidebarCtaHeadingFontSize}px` }}
            >
              {sidebarCta.heading}
            </p>
          )}
          {sidebarCta.text && (
            <p className="text-black/75 mb-4 leading-relaxed" style={{ fontSize: `${typography.sidebarCtaTextFontSize}px` }}>
              {sidebarCta.text}
            </p>
          )}
          <Link
            href={sidebarCta.buttonUrl || "/contact"}
            className="inline-flex items-center gap-2 h-9 px-4 font-bold uppercase tracking-wide w-full justify-center rounded-md bg-black text-white hover:bg-black/90 transition-colors"
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
    <div className="service-bottom-cta bg-[#f3f3f3] rounded-xl p-6 md:py-8 md:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="text-center md:text-left">
        {data.heading && (
          <h3
            className="font-bold text-black mb-1 leading-snug"
            style={{ fontSize: `${typography.bottomCtaHeadingFontSize}px` }}
          >
            {data.heading}
          </h3>
        )}
        {data.text && (
          <p className="text-black/65 leading-relaxed" style={{ fontSize: `${typography.bottomCtaTextFontSize}px` }}>
            {data.text}
          </p>
        )}
      </div>
      <Link
        href={data.buttonUrl || "/contact"}
        className="home-hero-cta-primary inline-flex items-center gap-2 h-11 px-5 font-bold uppercase tracking-wide shrink-0"
        style={{ fontSize: `${typography.bottomCtaButtonFontSize}px` }}
      >
        {data.buttonText || "GET STARTED"}
        <ArrowIcon />
      </Link>
    </div>
  )
}
