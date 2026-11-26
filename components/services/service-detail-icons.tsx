/** Gold line-art icons for service detail features & process steps. */

import type { ReactNode } from "react"
import { FlatSvg } from "@/components/flat-svg"

const iconClass = "w-full h-full"

function IconBase({ children }: { children: ReactNode }) {
  return (
    <FlatSvg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass} aria-hidden="true">
      {children}
    </FlatSvg>
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

export function DetailIconRocket() {
  return (
    <IconBase>
      <path d="M20 8c4 3 6 8 6 12-2 0-4 .5-6 2-2-1.5-4-2-6-2 0-4 2-9 6-12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 22l-3 6M26 22l3 6M17 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconBuilding() {
  return (
    <IconBase>
      <path d="M12 32V12h16v20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 16h2M22 16h2M16 21h2M22 21h2M16 26h2M22 26h2M10 32h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconBriefcase() {
  return (
    <IconBase>
      <rect x="9" y="15" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 15V12a4 4 0 0 1 8 0v3M9 22h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconUsers() {
  return (
    <IconBase>
      <circle cx="15" cy="15" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 28c1.5-4 4-6 7-6s5.5 2 7 6M22 28c.5-2.5 2-4 4-4 2 0 3.5 1.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function DetailIconRefresh() {
  return (
    <IconBase>
      <path d="M12 18a8 8 0 0 1 13-5l2-2v7h-7l3-3a6 6 0 1 0-1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  check: DetailIconCheck,
  message: DetailIconMessage,
  search: DetailIconSearch,
  delivery: DetailIconDelivery,
  rocket: DetailIconRocket,
  building: DetailIconBuilding,
  briefcase: DetailIconBriefcase,
  users: DetailIconUsers,
  refresh: DetailIconRefresh,
} as const

export const DETAIL_PROCESS_ICONS = {
  search: DetailIconSearch,
  lightbulb: DetailIconLightbulb,
  pen: DetailIconPen,
  message: DetailIconMessage,
  check: DetailIconCheck,
  delivery: DetailIconDelivery,
  target: DetailIconTarget,
  rocket: DetailIconRocket,
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
