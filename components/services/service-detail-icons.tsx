/** Gold line-art icons for service detail features & process steps. */

import type { ReactNode } from "react"

const iconClass = "w-full h-full"

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass} aria-hidden="true">
      {children}
    </svg>
  )
}

export function DetailIconLightbulb() {
  return (
    <IconBase>
      <path d="M20 8a8 8 0 0 0-4 15v3h8v-3a8 8 0 0 0-4-15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 30h8M17 33h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconPen() {
  return (
    <IconBase>
      <path d="M12 28 24 12l4 4L16 32l-4-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 16l4 4" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function DetailIconMonitor() {
  return (
    <IconBase>
      <rect x="9" y="12" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 30h8M20 26v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconTarget() {
  return (
    <IconBase>
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
    </IconBase>
  )
}

export function DetailIconSearch() {
  return (
    <IconBase>
      <circle cx="18" cy="18" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m24 24 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconMessage() {
  return (
    <IconBase>
      <path d="M10 12h20v12H18l-4 4v-4H10V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </IconBase>
  )
}

export function DetailIconCheck() {
  return (
    <IconBase>
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="m14 20 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  )
}

export function DetailIconDelivery() {
  return (
    <IconBase>
      <path d="M12 14h16v14H12V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 14V11a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 22v4M17 24h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconSidebarTarget() {
  return (
    <IconBase>
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </IconBase>
  )
}

export const DETAIL_FEATURE_ICONS = {
  lightbulb: DetailIconLightbulb,
  pen: DetailIconPen,
  monitor: DetailIconMonitor,
  target: DetailIconTarget,
} as const

export const DETAIL_PROCESS_ICONS = {
  search: DetailIconSearch,
  lightbulb: DetailIconLightbulb,
  pen: DetailIconPen,
  message: DetailIconMessage,
  check: DetailIconCheck,
  delivery: DetailIconDelivery,
} as const

export type DetailFeatureIconPreset = keyof typeof DETAIL_FEATURE_ICONS
export type DetailProcessIconPreset = keyof typeof DETAIL_PROCESS_ICONS

export function ServiceDetailFeatureIcon({ icon, size }: { icon: string; size: number }) {
  const Icon = DETAIL_FEATURE_ICONS[icon as DetailFeatureIconPreset] ?? DetailIconLightbulb
  return (
    <span className="text-home-primary inline-flex shrink-0" style={{ width: size, height: size }}>
      <Icon />
    </span>
  )
}

export function ServiceDetailProcessIcon({ icon, size }: { icon: string; size: number }) {
  const Icon = DETAIL_PROCESS_ICONS[icon as DetailProcessIconPreset] ?? DetailIconSearch
  return (
    <span className="text-home-primary inline-flex shrink-0" style={{ width: size, height: size }}>
      <Icon />
    </span>
  )
}
