import { Breadcrumbs } from "@/components/breadcrumbs"
import type { ServiceDetailTemplate } from "@/lib/service-detail-template"
import { ServiceDetailSidebar, type SidebarNavItem } from "./service-detail-sidebar"
import { ServiceDetailContent } from "./service-detail-content"

export function ServiceDetailLayout({
  breadcrumbs,
  parentTitle,
  parentSlug,
  navItems,
  template,
}: {
  breadcrumbs: { label: string; href?: string }[]
  parentTitle: string
  parentSlug: string
  navItems: SidebarNavItem[]
  template: ServiceDetailTemplate
}) {
  return (
    <>
      <div className="service-breadcrumbs-bar bg-home-secondary py-2.5">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbs} highlightLast className="service-breadcrumbs text-xs" />
        </div>
      </div>
      <section className="service-detail-page bg-white py-8 md:py-10 lg:py-12">
        <div className="site-container">
          <div className="service-detail-layout-grid">
            <ServiceDetailSidebar
              parentTitle={parentTitle}
              parentSlug={parentSlug}
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
