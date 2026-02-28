import Image from "next/image"

export interface PageHeroProps {
  title: string
  description?: string
  /** Background image URL for the hero section */
  image?: string
}

const HERO_MIN_HEIGHT = "min-h-[420px]"
const TITLE_CLASS = "text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-center"
const DESCRIPTION_CLASS = "text-xl text-muted-foreground max-w-3xl mx-auto text-center mt-6"

/**
 * Shared hero section for all inner pages (About, Work, Services, etc.).
 * Same height, font, font style, text alignment and position everywhere.
 */
export function PageHero({ title, description, image }: PageHeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden ${HERO_MIN_HEIGHT}`}
    >
      {image && (
        <>
          <div className="absolute inset-0">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </>
      )}
      {!image && <div className="absolute inset-0 bg-muted/30" />}

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <h1 className={TITLE_CLASS}>{title}</h1>
        {description && <p className={DESCRIPTION_CLASS}>{description}</p>}
      </div>
    </section>
  )
}
