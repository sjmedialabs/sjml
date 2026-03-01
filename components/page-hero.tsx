import Image from "next/image"

export interface PageHeroProps {
  title: string
  description?: string
  /** Background image URL for the hero section */
  image?: string
}

const HERO_MIN_HEIGHT = "min-h-[420px]"
const TITLE_BASE_CLASS = "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center"
const DESCRIPTION_CLASS = "text-xl max-w-3xl mx-auto text-center mt-6"
/** White text with shadow for visibility on any hero background (light and dark mode) */
const HERO_TEXT_SHADOW = "0 1px 3px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.8)"

/** Renders title in white; use "|" in title to split: part before | is white, part after | is red. */
function HeroTitle({ title }: { title: string }) {
  if (!title) return null
  const pipeIndex = title.indexOf("|")
  if (pipeIndex === -1) {
    return (
      <h1 className={`${TITLE_BASE_CLASS} text-white`} style={{ textShadow: HERO_TEXT_SHADOW }}>
        {title}
      </h1>
    )
  }
  const beforePart = title.slice(0, pipeIndex).trim()
  const redPart = title.slice(pipeIndex + 1).trim()
  return (
    <h1 className={TITLE_BASE_CLASS} style={{ textShadow: HERO_TEXT_SHADOW }}>
      <span className="text-white">{beforePart}</span>
      {redPart && <span className="text-white" style={{ color: "#E63946", textShadow: HERO_TEXT_SHADOW }}> {redPart}</span>}
    </h1>
  )
}

/**
 * Shared hero section for all inner pages (About, Work, Services, etc.).
 * No overlay on image. Title uses black and red combination (use "|" in admin to split).
 */
export function PageHero({ title, description, image }: PageHeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden ${HERO_MIN_HEIGHT}`}
    >
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}
      {!image && <div className="absolute inset-0 bg-muted/30" />}

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <HeroTitle title={title} />
        {description && (
          <p className={`${DESCRIPTION_CLASS} text-white`} style={{ textShadow: HERO_TEXT_SHADOW }}>
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
