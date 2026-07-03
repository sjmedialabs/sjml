import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"

export interface PageHeroProps {
  title: string
  description?: string
  /** Background image URL for the hero section */
  image?: string
}

const TITLE_BASE_CLASS = "site-title font-bold leading-tight page-hero-heading"
const DESCRIPTION_CLASS =
  "site-paragraph max-w-3xl text-white/85 leading-relaxed mt-3 page-hero-description typography-exempt"

/** Renders title in white; use "|" in title to split: part before | is white, part after | is gold. */
function HeroTitle({ title }: { title: string }) {
  if (!title) return null
  const pipeIndex = title.indexOf("|")
  if (pipeIndex === -1) {
    return <h1 className={TITLE_BASE_CLASS}>{title}</h1>
  }
  const beforePart = title.slice(0, pipeIndex).trim()
  const highlightPart = title.slice(pipeIndex + 1).trim()
  return (
    <h1 className={TITLE_BASE_CLASS}>
      <span>{beforePart}</span>
      {highlightPart && <span className="text-home-primary"> {highlightPart}</span>}
    </h1>
  )
}

/**
 * Shared hero section for legacy inner pages (Careers, Clients, Testimonials, etc.).
 */
export function PageHero({ title, description, image }: PageHeroProps) {
  return (
    <section className="about-hero bg-home-secondary">
      <InnerPageHeroBackground image={image} overlayClassName="about-hero-overlay" />
      {!image && <div className="absolute inset-0 bg-home-secondary z-0" aria-hidden="true" />}
      <div className="site-container about-hero-inner">
        <div className="about-hero-grid">
          <div className="about-hero-content w-full max-w-5xl">
            <HeroTitle title={title} />
            {description && <p className={DESCRIPTION_CLASS}>{description}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
