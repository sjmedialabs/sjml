import type { IndustriesPageHero, IndustriesPageTypography } from "@/lib/industries-page-content"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"

export function IndustriesHeroSection({
  data,
  typography,
}: {
  data: IndustriesPageHero
  typography: IndustriesPageTypography
}) {
  return (
    <section className="about-hero bg-home-secondary">
      <InnerPageHeroBackground image={data.image} />
      <div className="site-container about-hero-inner">
        <div className="about-hero-grid">
          <div className="about-hero-content">
            <span className="about-hero-accent-line block mb-2" aria-hidden="true" />
            {data.label && (
              <p
                className="uppercase tracking-[0.22em] text-home-primary font-bold mb-2"
                style={{ fontSize: `${typography.heroLabelFontSize}px` }}
              >
                {data.label}
              </p>
            )}
            <h1 className="font-bold leading-[1.12] tracking-tight mb-3" style={{ fontSize: `${typography.heroTitleFontSize}px` }}>
              <span className="text-white block">{data.titleLine1}</span>
              <span className="text-home-primary block">{data.titleHighlight}</span>
            </h1>
            {data.description && (
              <p className="text-white/85 leading-relaxed max-w-lg" style={{ fontSize: `${typography.heroDescriptionFontSize}px` }}>
                {data.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
