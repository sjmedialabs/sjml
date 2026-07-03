import type { ServicesPageHero, ServicesPageTypography } from "@/lib/services-page-content"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"

export function ServicesHeroSection({
  data,
  typography,
}: {
  data: ServicesPageHero
  typography: ServicesPageTypography
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
            <h1
              className="font-bold uppercase leading-[1.05] tracking-tight mb-2"
              style={{ fontSize: `${typography.heroTitleFontSize}px` }}
            >
              <span className="text-white">{data.titleLine1}</span>{" "}
              <span className="text-home-primary">{data.titleHighlight}</span>
            </h1>
            {data.description && (
              <p
                className="text-white/85 leading-relaxed max-w-lg"
                style={{ fontSize: `${typography.heroDescriptionFontSize}px` }}
              >
                {data.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
