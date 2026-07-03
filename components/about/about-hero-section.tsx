import type { AboutHero } from "@/lib/about-content"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"

export function AboutHeroSection({ data }: { data: AboutHero }) {
  return (
    <section className="about-hero bg-home-secondary">
      <InnerPageHeroBackground image={data.image} />
      <div className="site-container about-hero-inner">
        <div className="about-hero-grid">
          <div className="about-hero-content">
            <span className="about-hero-accent-line block mb-2" aria-hidden="true" />
            <h1 className="site-title font-bold uppercase leading-[1.05] tracking-tight mb-2">
              <span className="text-white">{data.titleLine1}</span>{" "}
              <span className="text-home-primary">{data.titleHighlight}</span>
            </h1>
            {(data.taglineLine1 || data.taglineLine2) && (
              <div className="mb-2">
                {data.taglineLine1 && (
                  <p className="site-subtitle text-white leading-snug">{data.taglineLine1}</p>
                )}
                {data.taglineLine2 && (
                  <p className="site-subtitle text-home-primary leading-snug">{data.taglineLine2}</p>
                )}
              </div>
            )}
            {data.description && (
              <p className="site-paragraph text-white/85 leading-relaxed max-w-lg">{data.description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
