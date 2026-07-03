/** Gold line-art icons for service overview cards — matches mockup. */

import type { ReactNode } from "react"
import { createDefaultServiceDetailTemplate } from "@/lib/service-detail-template"

const iconClass = "w-full h-full"

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass} aria-hidden="true">
      {children}
    </svg>
  )
}

export function ServiceIconBranding() {
  return (
    <IconBase>
      <path d="M12 28 22 10l6 6-10 18-6-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="26" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function ServiceIconAdvertising() {
  return (
    <IconBase>
      <path d="M10 18h6l4-6v12l-4-6H10v0Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 16c2 1 3 3 3 4s-1 3-3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 20H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function ServiceIconDigitalMarketing() {
  return (
    <IconBase>
      <path d="M10 28V16M18 28V12M26 28V20M34 28V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m28 14 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  )
}

export function ServiceIconWebExperience() {
  return (
    <IconBase>
      <rect x="8" y="11" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 15h24" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 22h3v3h-3v-3Z" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function ServiceIconMotionVideo() {
  return (
    <IconBase>
      <rect x="10" y="12" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m18 17 6 4-6 4v-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </IconBase>
  )
}

export function ServiceIconPackaging() {
  return (
    <IconBase>
      <path d="M10 16 20 10l10 6v12l-10 6-10-6V16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 10v12M10 16l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </IconBase>
  )
}

export function ServiceIconStrategy() {
  return (
    <IconBase>
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 10v4M20 26v4M10 20h4M26 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function ServiceIconMediaPlanning() {
  return (
    <IconBase>
      <rect x="8" y="11" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 20h8M18 18v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export const SERVICE_CARD_ICON_PRESETS = {
  branding: ServiceIconBranding,
  advertising: ServiceIconAdvertising,
  "digital-marketing": ServiceIconDigitalMarketing,
  "web-experience": ServiceIconWebExperience,
  "motion-video": ServiceIconMotionVideo,
  packaging: ServiceIconPackaging,
  strategy: ServiceIconStrategy,
  "media-planning": ServiceIconMediaPlanning,
} as const

export type ServiceCardIconPreset = keyof typeof SERVICE_CARD_ICON_PRESETS

export function isServiceCardIconPreset(icon: string): icon is ServiceCardIconPreset {
  return icon in SERVICE_CARD_ICON_PRESETS
}

export function ServiceCardIconDisplay({ icon, index }: { icon: string; index: number }) {
  if (icon.startsWith("/") || icon.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon} alt="" className="w-full h-full object-contain" />
    )
  }
  if (isServiceCardIconPreset(icon)) {
    const Icon = SERVICE_CARD_ICON_PRESETS[icon]
    return (
      <span className="text-home-primary block w-full h-full">
        <Icon />
      </span>
    )
  }
  const presets = Object.keys(SERVICE_CARD_ICON_PRESETS) as ServiceCardIconPreset[]
  const Fallback = SERVICE_CARD_ICON_PRESETS[presets[index % presets.length]]
  return (
    <span className="text-home-primary block w-full h-full">
      <Fallback />
    </span>
  )
}

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_CARD_ICON_PRESETS).map((key) => ({
  value: key,
  label: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}))
