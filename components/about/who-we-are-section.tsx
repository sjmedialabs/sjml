import Link from "next/link"
import type { AboutWhoWeAre } from "@/lib/about-content"
import { SectionLabel } from "./section-label"

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function WhoWeAreSection({ data }: { data: AboutWhoWeAre }) {
  return (
    <section className="about-who-we-are bg-white py-10 md:py-14">
      <div className="site-container">
        <div className="about-who-we-are-grid items-center">
          <div className="about-who-we-are-copy">
            <SectionLabel>{data.label}</SectionLabel>
            <h2 className="site-title font-bold leading-[1.15] text-black mb-4">
              {data.titleLine1 && <span className="block">{data.titleLine1}</span>}
              {data.titleLine2 && <span className="block">{data.titleLine2}</span>}
              {data.titleHighlight && (
                <span className="block text-home-primary">{data.titleHighlight}</span>
              )}
            </h2>
            {data.description && (
              <p className="site-paragraph text-black/75 leading-relaxed mb-6">{data.description}</p>
            )}
            <Link
              href={data.buttonUrl || "/contact"}
              className="home-hero-cta-primary inline-flex items-center gap-2 h-9 px-4 text-sm font-bold uppercase tracking-wide transition-colors"
            >
              {data.buttonText || "OUR STORY"}
              <ArrowIcon />
            </Link>
          </div>
          {data.image && (
            <div className="about-who-we-are-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.image} alt="" className="about-who-we-are-image" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
