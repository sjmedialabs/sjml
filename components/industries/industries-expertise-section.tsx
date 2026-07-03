import type { IndustriesPageExpertise, IndustriesPageTypography } from "@/lib/industries-page-content"
import { SectionLabel } from "@/components/about/section-label"

export function IndustriesExpertiseSection({
  data,
  typography,
}: {
  data: IndustriesPageExpertise
  typography: IndustriesPageTypography
}) {
  return (
    <section className="industries-expertise bg-white py-10 md:py-12">
      <div className="site-container">
        <div className="industries-expertise-grid">
          <div className="min-w-0">
            <SectionLabel fontSize={typography.expertiseLabelFontSize}>{data.label}</SectionLabel>
            <h2 className="font-bold text-black leading-[1.15]" style={{ fontSize: `${typography.expertiseTitleFontSize}px` }}>
              {data.titleLine1 && <span className="block">{data.titleLine1}</span>}
              {data.titleLine2 && <span className="block">{data.titleLine2}</span>}
            </h2>
          </div>
          {data.description && (
            <p
              className="text-black/70 leading-relaxed self-center"
              style={{ fontSize: `${typography.expertiseDescriptionFontSize}px` }}
            >
              {data.description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
