import Link from "next/link"
import type { IndustryCardItem, IndustriesPageGrid, IndustriesPageTypography } from "@/lib/industries-page-content"
import { IndustryCardIcon } from "./industry-icons"

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function IndustriesGridSection({
  cards,
  grid,
  typography,
}: {
  cards: IndustryCardItem[]
  grid: IndustriesPageGrid
  typography: IndustriesPageTypography
}) {
  const activeCards = cards.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <section className="industries-grid-section bg-white pb-10 md:pb-12">
      <div className="site-container">
        <div className="industries-card-grid">
          {activeCards.map((card) => (
            <article key={card.id} className="industry-card group">
              <div className="industry-card-image-wrap">
                {card.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.image} alt="" className="industry-card-image" />
                ) : (
                  <div className="industry-card-image bg-black/5" />
                )}
                <div className="industry-card-icon-badge">
                  <IndustryCardIcon icon={card.icon} size={typography.cardIconSize} />
                </div>
              </div>
              <div className="industry-card-body">
                <h3 className="font-bold text-black mb-2 text-center" style={{ fontSize: `${typography.cardTitleFontSize}px` }}>
                  {card.title}
                </h3>
                {card.description && (
                  <p
                    className="text-black/65 leading-relaxed text-center mb-4"
                    style={{ fontSize: `${typography.cardDescriptionFontSize}px` }}
                  >
                    {card.description}
                  </p>
                )}
                <Link
                  href={card.linkUrl || "/work"}
                  className="inline-flex items-center justify-center gap-1.5 w-full font-bold uppercase text-black/80 hover:text-home-primary transition-colors"
                  style={{ fontSize: `${typography.cardLinkFontSize}px` }}
                >
                  {card.linkText || "VIEW OUR WORK"}
                  <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {grid.exploreButtonText && (
          <div className="flex justify-center mt-8 md:mt-10">
            <Link
              href={grid.exploreButtonUrl || "/contact"}
              className="industries-explore-btn inline-flex items-center gap-2 font-bold uppercase tracking-wide text-home-primary border border-home-primary rounded-full px-6 h-10 hover:bg-home-primary hover:text-black transition-colors"
              style={{ fontSize: `${typography.exploreButtonFontSize}px` }}
            >
              {grid.exploreButtonText}
              <ArrowIcon />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
