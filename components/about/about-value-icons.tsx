/** Gold line-art value icons on dark circles — matches About mockup. */

import type { ReactNode } from "react"

const svgClass = "w-full h-full"

function ValueIconBase({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} aria-hidden="true">
      {children}
    </svg>
  )
}

function CreativityIcon() {
  return (
    <ValueIconBase>
      <path
        d="M9 18h6M10 21h4M12 2a5 5 0 0 0-3 9.2V13a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.8A5 5 0 0 0 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ValueIconBase>
  )
}

function StrategyIcon() {
  return (
    <ValueIconBase>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </ValueIconBase>
  )
}

function CollaborationIcon() {
  return (
    <ValueIconBase>
      <path
        d="M8 11V8a2 2 0 1 1 4 0v3M12 11V8a2 2 0 1 1 4 0v3M6 11h12v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 16v2M15 16v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </ValueIconBase>
  )
}

function ResultsIcon() {
  return (
    <ValueIconBase>
      <path d="M4 19V5M4 19h16M8 15v-3M12 15V9M16 15v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </ValueIconBase>
  )
}

export const ABOUT_VALUE_ICON_PRESETS = {
  creativity: CreativityIcon,
  strategy: StrategyIcon,
  collaboration: CollaborationIcon,
  results: ResultsIcon,
} as const

export type AboutValueIconPreset = keyof typeof ABOUT_VALUE_ICON_PRESETS

export function AboutValueIcon({
  icon,
  circleSize = 48,
  glyphSize = 20,
}: {
  icon: string
  circleSize?: number
  glyphSize?: number
}) {
  const Icon = ABOUT_VALUE_ICON_PRESETS[icon as AboutValueIconPreset] ?? CreativityIcon
  return (
    <span
      className="about-value-icon flex shrink-0 items-center justify-center rounded-full bg-home-secondary text-home-primary"
      style={{ width: circleSize, height: circleSize }}
    >
      <span style={{ width: glyphSize, height: glyphSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon />
      </span>
    </span>
  )
}
