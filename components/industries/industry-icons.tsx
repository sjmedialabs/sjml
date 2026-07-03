/** Gold line-art icons for industry cards. */

import type { ReactNode } from "react"

const iconClass = "w-full h-full"

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass} aria-hidden="true">
      {children}
    </svg>
  )
}

export function IndustryIconRealEstate() {
  return (
    <IconBase>
      <path d="M20 8 32 14v18H8V14L20 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 22h8M16 26h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function IndustryIconHealthcare() {
  return (
    <IconBase>
      <path d="M20 28s-8-5.2-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5.8-8 11-8 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 14v6M17 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function IndustryIconEducation() {
  return (
    <IconBase>
      <path d="M8 18 20 12l12 6-12 6-12-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 21v5l6 3 6-3v-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </IconBase>
  )
}

export function IndustryIconRetail() {
  return (
    <IconBase>
      <path d="M12 14h16l-1 16H13L12 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 14V11a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20v4M18 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function IndustryIconTechnology() {
  return (
    <IconBase>
      <rect x="10" y="14" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 28h12M20 26v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 18h20" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function IndustryIconManufacturing() {
  return (
    <IconBase>
      <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 12v3M20 25v3M12 20h3M25 20h3M14.5 14.5l2 2M23.5 23.5l2 2M25.5 14.5l-2 2M16.5 23.5l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function IndustryIconFinance() {
  return (
    <IconBase>
      <path d="M10 28V14M18 28V10M26 28V18M34 28V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m28 16 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  )
}

export function IndustryIconFood() {
  return (
    <IconBase>
      <path d="M14 12v16M14 12c0-2 2-4 4-4M18 12v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26 12v16M26 12c2 0 4 2 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export const INDUSTRY_ICON_PRESETS = {
  "real-estate": IndustryIconRealEstate,
  healthcare: IndustryIconHealthcare,
  education: IndustryIconEducation,
  retail: IndustryIconRetail,
  technology: IndustryIconTechnology,
  manufacturing: IndustryIconManufacturing,
  finance: IndustryIconFinance,
  food: IndustryIconFood,
} as const

export type IndustryIconPreset = keyof typeof INDUSTRY_ICON_PRESETS

export function IndustryCardIcon({ icon, size }: { icon: string; size: number }) {
  const Icon = INDUSTRY_ICON_PRESETS[icon as IndustryIconPreset] ?? IndustryIconRealEstate
  return (
    <span className="text-home-primary inline-flex shrink-0" style={{ width: size, height: size }}>
      <Icon />
    </span>
  )
}

export const INDUSTRY_ICON_OPTIONS = Object.keys(INDUSTRY_ICON_PRESETS).map((key) => ({
  value: key,
  label: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}))
