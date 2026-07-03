import { Sparkles, Clock, Layers, BarChart3, Target, Users, Search, Lightbulb, PenLine, MessageSquare, Check, Package } from "lucide-react"

const CARD_ICONS = [Sparkles, Clock, Layers, BarChart3, Target, Users]

export function ServiceCardIcon({ icon, index }: { icon: string; index: number }) {
  if (icon.startsWith("/") || icon.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon} alt="" className="w-full h-full object-contain" />
    )
  }
  const Fallback = CARD_ICONS[index % CARD_ICONS.length]
  return <Fallback className="w-full h-full text-home-primary" strokeWidth={1.5} />
}

const FEATURE_ICONS: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  clock: Clock,
  layers: Layers,
  chart: BarChart3,
  target: Target,
  users: Users,
}

export function ServiceFeatureIcon({ icon, size }: { icon: string; size: number }) {
  const Icon = FEATURE_ICONS[icon] ?? Sparkles
  return (
    <span className="text-home-primary inline-flex" style={{ width: size, height: size }}>
      <Icon className="w-full h-full" strokeWidth={1.5} />
    </span>
  )
}

const PROCESS_ICONS: Record<string, typeof Search> = {
  search: Search,
  lightbulb: Lightbulb,
  pen: PenLine,
  message: MessageSquare,
  check: Check,
  package: Package,
}

export function ServiceProcessIcon({ icon, size }: { icon: string; size: number }) {
  const Icon = PROCESS_ICONS[icon] ?? Search
  return (
    <span className="text-home-primary inline-flex" style={{ width: size, height: size }}>
      <Icon className="w-full h-full" strokeWidth={1.5} />
    </span>
  )
}
