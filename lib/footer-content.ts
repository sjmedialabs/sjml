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

export function normalizeFooterContent(raw: unknown): FooterContent {
  const defaults = createDefaultFooter()
  const data = (raw ?? {}) as Partial<FooterContent>

  return {
    logo: data.logo?.trim() || defaults.logo,
    siteName: data.siteName?.trim() || defaults.siteName,
    siteTagline: data.siteTagline?.trim() || defaults.siteTagline,
    address: data.address?.trim() || defaults.address,
    phone: data.phone?.trim() || defaults.phone,
    email: data.email?.trim() || defaults.email,
    copyright: data.copyright?.trim() || defaults.copyright,
    newsletterText: data.newsletterText?.trim() || defaults.newsletterText,
    companyLinks:
      Array.isArray(data.companyLinks) && data.companyLinks.length > 0
        ? data.companyLinks.filter((l) => l.name && l.href)
        : defaults.companyLinks,
    serviceLinks:
      Array.isArray(data.serviceLinks) && data.serviceLinks.length > 0
        ? data.serviceLinks.filter((l) => l.name && l.href)
        : defaults.serviceLinks,
    socialLinks: { ...defaults.socialLinks, ...(data.socialLinks ?? {}) },
  }
}
