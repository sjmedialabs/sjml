import { defaultHeaderContent } from "@/lib/defaults"

export interface HeaderNavItem {
  id: string
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}

export interface NormalizedHeaderContent {
  logo: string
  logoText: string
  navItems: HeaderNavItem[]
  ctaButton: { text: string; href: string }
  showTopBar: boolean
  topBarText: string
}

function isIndustriesLabel(label: string): boolean {
  return label.trim().toUpperCase().replace(/\s+/g, " ") === "INDUSTRIES"
}

/** Correct legacy nav entries where Industries pointed at case studies. */
export function normalizeHeaderNavItems(items: HeaderNavItem[]): HeaderNavItem[] {
  return items.map((item) => {
    if (isIndustriesLabel(item.label) || (item.href === "/case-studies" && /industr/i.test(item.label))) {
      return {
        ...item,
        label: "INDUSTRIES",
        href: "/industries",
      }
    }
    return item
  })
}

export function normalizeHeaderContent(data: Record<string, unknown>): NormalizedHeaderContent {
  const defaults = defaultHeaderContent
  const rawItems = Array.isArray(data.navItems) ? (data.navItems as HeaderNavItem[]) : defaults.navItems

  return {
    logo: (data.logo as string) ?? defaults.logo,
    logoText: (data.logoText as string) ?? defaults.logoText,
    navItems: normalizeHeaderNavItems(rawItems),
    ctaButton: {
      text: ((data.ctaButton as { text?: string })?.text) ?? defaults.ctaButton.text,
      href: ((data.ctaButton as { href?: string })?.href) ?? defaults.ctaButton.href,
    },
    showTopBar: (data.showTopBar as boolean) ?? defaults.showTopBar,
    topBarText: (data.topBarText as string) ?? defaults.topBarText,
  }
}
