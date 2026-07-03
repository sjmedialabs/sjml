import type { ComponentType, ReactNode, SVGProps } from "react"

type WorkIconProps = SVGProps<SVGSVGElement>

function IconBase({ children, className, ...props }: WorkIconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

const STROKE = 1.25

export function WorkTargetIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth={STROKE} />
      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth={STROKE} />
      <circle cx="16" cy="16" r="1.25" fill="currentColor" />
    </IconBase>
  )
}

export function WorkUsersIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={STROKE} />
      <path d="M6 24c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
      <circle cx="22" cy="13" r="2.5" stroke="currentColor" strokeWidth={STROKE} />
      <path d="M18 24c0-2.209 1.791-4 4-4" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
    </IconBase>
  )
}

export function WorkLightbulbIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 6a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6v2h-6v-2c-1.5-1.5-3-3.5-3-6a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" />
      <path d="M13 24h6" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
    </IconBase>
  )
}

export function WorkStarIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 6 18.5 13H26l-6.5 4.5L22 25l-6-4-6 4 2.5-7.5L2 13h7.5L16 6Z" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" />
    </IconBase>
  )
}

export function WorkChartIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 22 13 14l5 4 7-10" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 26h24" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
    </IconBase>
  )
}

export function WorkBagIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 12V10a6 6 0 1 1 12 0v2" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
      <rect x="8" y="12" width="16" height="14" rx="2" stroke="currentColor" strokeWidth={STROKE} />
    </IconBase>
  )
}

export function WorkCalendarIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <rect x="6" y="8" width="20" height="18" rx="2" stroke="currentColor" strokeWidth={STROKE} />
      <path d="M6 14h20M12 6v4M20 6v4" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
    </IconBase>
  )
}

export function WorkDiamondIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 6 24 16 16 26 8 16 16 6Z" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" />
    </IconBase>
  )
}

export function WorkPaperPlaneIcon(props: WorkIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path d="M21.5 3.5 11 14M21.5 3.5l-6.5 17-4-7-7-4 17-6.5Z" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" />
    </svg>
  )
}

export function WorkLocationIcon(props: WorkIconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 26s8-6.5 8-13a8 8 0 1 0-16 0c0 6.5 8 13 8 13Z" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" />
      <circle cx="16" cy="13" r="2.5" stroke="currentColor" strokeWidth={STROKE} />
    </IconBase>
  )
}

const PILLAR_ICONS: Record<string, ComponentType<WorkIconProps>> = {
  target: WorkTargetIcon,
  users: WorkUsersIcon,
  lightbulb: WorkLightbulbIcon,
  star: WorkStarIcon,
}

const METRIC_ICONS: Record<string, ComponentType<WorkIconProps>> = {
  chart: WorkChartIcon,
  users: WorkUsersIcon,
  bag: WorkBagIcon,
  star: WorkStarIcon,
}

export function WorkPillarIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = PILLAR_ICONS[icon] ?? WorkStarIcon
  return <Icon className={className} />
}

export function WorkMetricIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = METRIC_ICONS[icon] ?? WorkChartIcon
  return <Icon className={className} />
}

export function WorkMetaIcon({ icon, className }: { icon: string; className?: string }) {
  const icons: Record<string, ComponentType<WorkIconProps>> = {
    calendar: WorkCalendarIcon,
    diamond: WorkDiamondIcon,
    location: WorkLocationIcon,
  }
  const Icon = icons[icon] ?? WorkCalendarIcon
  return <Icon className={className} />
}
