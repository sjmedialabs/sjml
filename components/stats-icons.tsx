/** Line-art stats icons matching homepage mockup (gold stroke, no fill). */

import type { ReactNode } from "react"

const iconClass = "w-[34px] h-[34px] md:w-[38px] md:h-[38px]"

function StatIconBase({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function StatUsersIcon() {
  return (
    <StatIconBase>
      <circle cx="14" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 28c0-3.866 3.134-7 7-7s7 3.134 7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="26" cy="15" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M21 28c0-2.761 2.239-5 5-5 1.38 0 2.63.56 3.54 1.46"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="16.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M28.5 28c0-2.209 1.791-4 4-4 .98 0 1.87.35 2.57.93"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </StatIconBase>
  )
}

export function StatLayersIcon() {
  return (
    <StatIconBase>
      <path
        d="M20 8 32 14 20 20 8 14 20 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 20 20 26 32 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 26 20 32 32 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </StatIconBase>
  )
}

export function StatTrophyIcon() {
  return (
    <StatIconBase>
      <path
        d="M14 10h12v6c0 3.314-2.686 6-6 6s-6-2.686-6-6v-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 12H10a2 2 0 0 0 2 2v1a2 2 0 0 1-2 2h-.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M26 12h4a2 2 0 0 1-2 2v1a2 2 0 0 0 2 2h.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M17 26h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M15 30h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M20 22v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </StatIconBase>
  )
}

export function StatGlobeIcon() {
  return (
    <StatIconBase>
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="20" cy="20" rx="5" ry="11" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 20h22" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 14.5h19M10.5 25.5h19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </StatIconBase>
  )
}

export function StatBriefcaseIcon() {
  return (
    <StatIconBase>
      <rect x="10" y="16" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16v-3a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 22h20" stroke="currentColor" strokeWidth="1.5" />
    </StatIconBase>
  )
}

export function StatRocketIcon() {
  return (
    <StatIconBase>
      <path d="M20 8c4 4 6 10 6 16l-6-3-6 3c0-6 2-12 6-16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="20" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 28l2-4M26 28l-2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </StatIconBase>
  )
}

export const STAT_ICON_PRESETS = {
  users: StatUsersIcon,
  layers: StatLayersIcon,
  trophy: StatTrophyIcon,
  globe: StatGlobeIcon,
  briefcase: StatBriefcaseIcon,
  rocket: StatRocketIcon,
} as const

export type StatIconPreset = keyof typeof STAT_ICON_PRESETS

export function isStatIconPreset(icon: string): icon is StatIconPreset {
  return icon in STAT_ICON_PRESETS
}
