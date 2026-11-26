import type { CSSProperties } from "react"

/** Scales a title's existing responsive sizes. 1 keeps the current sizes. */
export function landingTitleStyle(defaultSize: number, fontSize?: number): CSSProperties {
  const selected = typeof fontSize === "number" && fontSize > 0 ? fontSize : defaultSize
  const scale = defaultSize > 0 ? selected / defaultSize : 1
  return {
    ["--landing-title-scale" as string]: String(Number.isFinite(scale) && scale > 0 ? scale : 1),
  }
}
