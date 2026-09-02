import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"

export function CaseStudiesHeroSection({
  title = "Case Studies",
  titleHighlight = "Extraordinary Results",
  description = "Discover how we help leading brands achieve extraordinary results through strategy, innovation, and creative execution.",
  image = "",
}: {
  title?: string
  titleHighlight?: string
  description?: string
  image?: string
}) {
  return (
    <section className="about-hero bg-home-secondary">
      <InnerPageHeroBackground image={image} />
      <div className="site-container about-hero-inner">
        <div className="about-hero-grid">
          <div className="about-hero-content">
            <span className="about-hero-accent-line block mb-2" aria-hidden="true" />
            <p className="uppercase tracking-[0.22em] text-home-primary font-bold mb-2 text-xs">
              PORTFOLIO & CASE STUDIES
            </p>
            <h1 className="font-bold leading-[1.12] tracking-tight mb-3 text-3xl md:text-5xl">
              <span className="text-white block">{title}</span>
              {titleHighlight && <span className="text-home-primary block">{titleHighlight}</span>}
            </h1>
            {description && (
              <p className="text-white/85 leading-relaxed max-w-lg text-sm md:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
