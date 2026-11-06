import { defaultHomeContent } from "@/lib/defaults"

export interface FooterLink {
  name: string
  href: string
}

export interface FooterSocialLinks {
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
  youtube?: string
}

export interface FooterContent {
  logo?: string
  siteName?: string
  siteTagline?: string
  address?: string
  phone?: string
  email?: string
  copyright?: string
  newsletterText?: string
  companyLinks: FooterLink[]
  serviceLinks: FooterLink[]
  socialLinks: FooterSocialLinks
}

export function createDefaultFooter(): FooterContent {
  const d = defaultHomeContent.footer as FooterContent
  return {
    logo: d.logo ?? "",
    siteName: d.siteName ?? "SJ Media Labs",
    siteTagline: d.siteTagline ?? "Branding & Advertising",
    address: d.address ?? "",
    phone: d.phone ?? "",
    email: d.email ?? "",
    copyright: d.copyright ?? "© 2025 SJ Media Labs. All rights reserved.",
    newsletterText: d.newsletterText ?? "",
    companyLinks: d.companyLinks ?? [],
    serviceLinks: d.serviceLinks ?? [],
    socialLinks: d.socialLinks ?? {},
  }
}

function pickString(value: unknown, fallback: string): string {
  if (typeof value === "string") return value.trim()
  if (value == null) return fallback
  return String(value).trim()
}

function pickLinks(value: unknown, fallback: FooterLink[]): FooterLink[] {
  if (!Array.isArray(value)) return fallback
  return value
    .filter((link): link is FooterLink => Boolean(link && typeof link === "object"))
    .map((link) => ({
      name: typeof link.name === "string" ? link.name : "",
      href: typeof link.href === "string" ? link.href : "/",
    }))
    .filter((link) => link.name.trim() !== "" || link.href.trim() !== "")
}

export function normalizeFooterContent(raw: unknown): FooterContent {
  const defaults = createDefaultFooter()
  // Treat missing document as defaults; treat present document (even empty fields) as intentional.
  if (raw == null || typeof raw !== "object") {
    return defaults
  }

  const data = raw as Partial<FooterContent> & Record<string, unknown>
  const hasOwn = (key: string) => Object.prototype.hasOwnProperty.call(data, key)

  return {
    logo: hasOwn("logo") ? pickString(data.logo, "") : defaults.logo,
    siteName: hasOwn("siteName") ? pickString(data.siteName, "") : defaults.siteName,
    siteTagline: hasOwn("siteTagline") ? pickString(data.siteTagline, "") : defaults.siteTagline,
    address: hasOwn("address") ? pickString(data.address, "") : defaults.address,
    phone: hasOwn("phone") ? pickString(data.phone, "") : defaults.phone,
    email: hasOwn("email") ? pickString(data.email, "") : defaults.email,
    copyright: hasOwn("copyright") ? pickString(data.copyright, "") : defaults.copyright,
    newsletterText: hasOwn("newsletterText") ? pickString(data.newsletterText, "") : defaults.newsletterText,
    companyLinks: hasOwn("companyLinks") ? pickLinks(data.companyLinks, []) : defaults.companyLinks,
    serviceLinks: hasOwn("serviceLinks") ? pickLinks(data.serviceLinks, []) : defaults.serviceLinks,
    socialLinks: {
      ...defaults.socialLinks,
      ...(data.socialLinks && typeof data.socialLinks === "object" ? data.socialLinks : {}),
    },
  }
}
