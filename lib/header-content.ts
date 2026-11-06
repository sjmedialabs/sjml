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

/** Correct legacy nav entries where Industries pointed at case studies. Does not invent new links. */
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

function asNavItems(raw: unknown, fallback: HeaderNavItem[]): HeaderNavItem[] {
  if (!Array.isArray(raw)) return fallback
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id ? item.id : String(index),
      label: typeof item.label === "string" ? item.label : "",
      href: typeof item.href === "string" ? item.href : "/",
      children: Array.isArray(item.children)
        ? item.children
            .filter((child): child is Record<string, unknown> => Boolean(child && typeof child === "object"))
            .map((child) => ({
              label: typeof child.label === "string" ? child.label : "",
              href: typeof child.href === "string" ? child.href : "/",
            }))
        : undefined,
    }))
}

/** Persist admin payload without inventing nav items. */
export function sanitizeHeaderForWrite(data: Record<string, unknown>): NormalizedHeaderContent {
  const defaults = defaultHeaderContent
  const rawLogo = typeof data.logo === "string" ? data.logo.trim() : ""
  const logo = rawLogo && rawLogo !== "/logo.svg" ? rawLogo : ""
  const cta = (data.ctaButton && typeof data.ctaButton === "object" ? data.ctaButton : {}) as {
    text?: string
    href?: string
  }

  return {
    logo,
    logoText: typeof data.logoText === "string" ? data.logoText : defaults.logoText,
    navItems: asNavItems(data.navItems, defaults.navItems),
    ctaButton: {
      text: typeof cta.text === "string" ? cta.text : defaults.ctaButton.text,
      href: typeof cta.href === "string" ? cta.href : defaults.ctaButton.href,
    },
    showTopBar: Boolean(data.showTopBar),
    topBarText: typeof data.topBarText === "string" ? data.topBarText : "",
  }
}

export function normalizeHeaderContent(data: Record<string, unknown>): NormalizedHeaderContent {
  const defaults = defaultHeaderContent
  const rawItems = Array.isArray(data.navItems) ? (data.navItems as HeaderNavItem[]) : defaults.navItems

  const rawLogo = typeof data.logo === "string" ? data.logo.trim() : ""
  const logo = rawLogo && rawLogo !== "/logo.svg" ? rawLogo : ""

  return {
    logo,
    logoText: (data.logoText as string) ?? defaults.logoText,
    navItems: normalizeHeaderNavItems(asNavItems(rawItems, defaults.navItems)),
    ctaButton: {
      text: ((data.ctaButton as { text?: string })?.text) ?? defaults.ctaButton.text,
      href: ((data.ctaButton as { href?: string })?.href) ?? defaults.ctaButton.href,
    },
    showTopBar: (data.showTopBar as boolean) ?? defaults.showTopBar,
    topBarText: (data.topBarText as string) ?? defaults.topBarText,
  }
}
