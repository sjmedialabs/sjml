import Link from "next/link"
import type { ServicesPageGrid, ServicesPageTypography } from "@/lib/services-page-content"
import { ServiceCardIconDisplay } from "./service-card-icons"

export interface ServiceCardItem {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  linkText?: string
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function ServicesGridSection({
  label,
  services,
  typography,
}: {
  label: ServicesPageGrid["label"]
  services: ServiceCardItem[]
  typography: ServicesPageTypography
}) {
  if (!services.length) {
    return (
      <section className="services-grid-section bg-white py-10 md:py-14">
        <div className="site-container">
          <p className="site-paragraph text-black/60">No services available yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="services-grid-section bg-white py-10 md:py-14">
      <div className="site-container">
        {label && (
          <div className="flex items-center gap-3 mb-8">
            <span
              className="uppercase tracking-[0.22em] text-home-primary font-bold"
              style={{ fontSize: `${typography.gridLabelFontSize}px` }}
            >
              {label}
            </span>
            <span className="h-px w-10 bg-home-primary" aria-hidden="true" />
          </div>
        )}
        <div className="services-card-grid">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="services-card border border-black/10 rounded-lg p-5 flex flex-col bg-white group cursor-pointer block"
            >
              <div className="text-home-primary mb-4" style={{ width: typography.cardIconSize, height: typography.cardIconSize }}>
                <ServiceCardIconDisplay icon={service.icon} index={index} />
              </div>
              <span
                className="font-bold uppercase tracking-wide text-black mb-2"
                style={{ fontSize: `${Math.max(14, typography.cardTitleFontSize)}px` }}
              >
                {service.title}
              </span>
              <span
                className="text-black/65 leading-relaxed mb-4 flex-1"
                style={{ fontSize: `${Math.max(14, typography.cardDescriptionFontSize)}px` }}
              >
                {service.description}
              </span>
              <span
                className="inline-flex items-center gap-1.5 font-bold uppercase text-home-primary group-hover:opacity-80 transition-opacity"
                style={{ fontSize: `${Math.max(14, typography.cardLinkFontSize)}px` }}
              >
                {service.linkText || "EXPLORE SERVICES"}
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
