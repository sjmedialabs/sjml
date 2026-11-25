import type { ServiceDetailTemplate } from "@/lib/service-detail-template"
import { ServiceDetailSidebar, type SidebarNavItem } from "./service-detail-sidebar"
import { ServiceDetailContent } from "./service-detail-content"
import { ServiceDetailHero } from "./service-detail-hero"

export function ServiceDetailLayout({
  breadcrumbs,
  parentTitle,
  parentSlug,
  parentHref,
  parentActive = false,
  showOverview = false,
  navItems,
  template,
}: {
  breadcrumbs: { label: string; href?: string }[]
  parentTitle: string
  parentSlug: string
  parentHref?: string
  parentActive?: boolean
  showOverview?: boolean
  navItems: SidebarNavItem[]
  template: ServiceDetailTemplate
}) {
  return (
    <>
      <ServiceDetailHero
        breadcrumbs={breadcrumbs}
        categoryLabel={template.categoryLabel}
        title={template.title}
        description={template.heroDescription}
        buttonText={template.heroButtonText}
        buttonUrl={template.heroButtonUrl}
        image={template.introImage}
        typography={template.typography}
      />

      <section className="service-detail-page bg-white py-5 md:py-6 lg:py-7">
        <div className="site-container">
          <div className="service-detail-layout-grid">
            <ServiceDetailSidebar
              parentTitle={parentTitle}
              parentSlug={parentSlug}
              parentHref={parentHref || `/services/${parentSlug}`}
              parentActive={parentActive}
              showOverview={showOverview}
              navItems={navItems}
              sidebarCta={template.sidebarCta}
              typography={template.typography}
            />
            <ServiceDetailContent template={template} />
          </div>
        </div>
      </section>
    </>
  )
}
