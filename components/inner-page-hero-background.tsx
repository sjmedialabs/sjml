/** Full-bleed cover image + gradient overlay for inner page heroes. */
export function InnerPageHeroBackground({
  image,
  overlayClassName = "about-hero-overlay",
}: {
  image?: string
  overlayClassName?: string
}) {
  if (!image) return null

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="inner-page-hero-bg" aria-hidden="true" />
      <div className={overlayClassName} aria-hidden="true" />
    </>
  )
}
