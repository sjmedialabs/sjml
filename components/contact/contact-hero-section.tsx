import Link from "next/link"
import type { ContactPageHero, ContactPageTypography } from "@/lib/contact-page-content"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"

export function ContactHeroSection({
  data,
  typography,
}: {
  data: ContactPageHero
  typography: ContactPageTypography
}) {
  return (
    <section className="about-hero bg-home-secondary contact-hero">
      <InnerPageHeroBackground image={data.image} />
      <div className="site-container about-hero-inner">
        <div className="about-hero-grid">
          <div className="about-hero-content">
            <nav aria-label="Breadcrumb" className="contact-hero-breadcrumbs">
              <Link href="/">Home</Link>
              <span aria-hidden="true">&gt;</span>
              <span className="contact-hero-breadcrumbs-current">Contact Us</span>
            </nav>
            <h1 className="font-bold leading-[1.12] tracking-tight mb-3" style={{ fontSize: `${typography.heroTitleFontSize}px` }}>
              <span className="text-white">{data.titleLine1} </span>
              <span className="text-home-primary">{data.titleHighlight}</span>
              {data.titleLine2 && <span className="text-white"> {data.titleLine2}</span>}
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
