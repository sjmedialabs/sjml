import type { CSSProperties } from "react"

const DEFAULT_OVERLAY =
  "linear-gradient(90deg, rgb(22 22 23 / 0.92) 0%, rgb(22 22 23 / 0.72) 45%, rgb(22 22 23 / 0.35) 100%)"

/** Paint the photo and the dark overlay as the section background so they are not separate overlapping elements. */
export function heroBackgroundStyle(image?: string, overlay = DEFAULT_OVERLAY): CSSProperties | undefined {
  const safe = image?.trim()
  if (!safe) return undefined
  const url = safe.replace(/["\\\n\r]/g, "")
  return {
    backgroundImage: `${overlay}, url("${url}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }
}

/** @deprecated Use heroBackgroundStyle on the hero section. Kept so old imports do not render stacked layers. */
export function InnerPageHeroBackground(_props: { image?: string; overlayClassName?: string }) {
  return null
}
