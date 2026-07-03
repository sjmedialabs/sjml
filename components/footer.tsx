"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import { normalizeFooterContent, type FooterContent, type FooterSocialLinks } from "@/lib/footer-content"

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function SocialLinks({ links }: { links: FooterSocialLinks }) {
  const items = [
    { key: "facebook", href: links.facebook, Icon: Facebook, label: "Facebook" },
    { key: "instagram", href: links.instagram, Icon: Instagram, label: "Instagram" },
    { key: "linkedin", href: links.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { key: "twitter", href: links.twitter, Icon: XIcon, label: "X" },
    { key: "youtube", href: links.youtube, Icon: Youtube, label: "YouTube" },
  ].filter((item) => item.href?.trim())

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map(({ key, href, Icon, label }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="home-footer-social flex h-9 w-9 items-center justify-center rounded-[4px] border border-black/20 bg-black/5 text-black transition-colors hover:bg-black hover:text-home-primary"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  )
}

interface FooterProps {
  data?: unknown
}

export function Footer({ data: propData }: FooterProps = {}) {
  const [footerData, setFooterData] = useState<FooterContent>(() => normalizeFooterContent(propData))

  useEffect(() => {
    let cancelled = false

    async function loadFooter() {
      try {
        const [footerRes, settingsRes, servicesRes] = await Promise.all([
          propData ? Promise.resolve(null) : fetch("/api/content/footer"),
          fetch("/api/content/settings").catch(() => null),
          fetch("/api/services?all=true").catch(() => null),
        ])

        let merged = normalizeFooterContent(propData)

        if (!propData && footerRes?.ok) {
          merged = normalizeFooterContent(await footerRes.json())
        }

        if (settingsRes?.ok) {
          const settings = await settingsRes.json()
          merged = normalizeFooterContent({
            ...merged,
            logo: merged.logo || settings.footerLogo,
            phone: merged.phone || settings.contactPhone || settings.phone,
            email: merged.email || settings.contactEmail || settings.email,
            address: merged.address || settings.address,
            socialLinks: {
              facebook: merged.socialLinks.facebook || settings.socialMedia?.facebook,
              instagram: merged.socialLinks.instagram || settings.socialMedia?.instagram,
              linkedin: merged.socialLinks.linkedin || settings.socialMedia?.linkedin,
              twitter: merged.socialLinks.twitter || settings.socialMedia?.twitter,
              youtube: merged.socialLinks.youtube || settings.socialMedia?.youtube,
            },
          })
        }

        if (servicesRes?.ok) {
          const services = await servicesRes.json()
          if (Array.isArray(services) && services.length > 0 && merged.serviceLinks.length === 0) {
            merged = {
              ...merged,
              serviceLinks: services.map((s: { title: string; slug: string }) => ({
                name: s.title,
                href: `/services/${s.slug}`,
              })),
            }
          }
        }

        if (!cancelled) setFooterData(merged)
      } catch {
        if (!cancelled) setFooterData(normalizeFooterContent(propData))
      }
    }

    loadFooter()
    return () => {
      cancelled = true
    }
  }, [propData])

  const { companyLinks, serviceLinks, socialLinks, siteName, siteTagline } = footerData

  return (
    <footer className="home-footer bg-home-primary text-black">
      <div className="site-container py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand & contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              {footerData.logo ? (
                <Image
                  src={footerData.logo}
                  alt={siteName ?? "SJ Media Labs"}
                  width={140}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <span className="text-xl font-bold tracking-tight">{siteName ?? "SJML"}</span>
                </>
              )}
            </Link>
            {siteTagline && (
              <p className="site-subtitle text-[10px] uppercase tracking-[0.18em] text-black/70 mb-4">{siteTagline}</p>
            )}
            <div className="space-y-2.5 mb-5">
              {footerData.address && (
                <p className="site-paragraph flex items-start gap-2 text-black/80">
                  <MapPinIcon className="mt-0.5 shrink-0" />
                  <span className="whitespace-pre-line">{footerData.address}</span>
                </p>
              )}
              {footerData.phone && (
                <p className="site-paragraph flex items-center gap-2 text-black/80">
                  <PhoneIcon className="shrink-0" />
                  <a href={`tel:${footerData.phone.replace(/\s/g, "")}`} className="hover:opacity-70">
                    {footerData.phone}
                  </a>
                </p>
              )}
              {footerData.email && (
                <p className="site-paragraph flex items-center gap-2 text-black/80">
                  <MailIcon className="shrink-0" />
                  <a href={`mailto:${footerData.email}`} className="hover:opacity-70">
                    {footerData.email}
                  </a>
                </p>
              )}
            </div>
            <SocialLinks links={socialLinks} />
          </div>

          {/* Company */}
          <div>
            <h3 className="site-subtitle text-sm font-bold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={`${link.href}-${link.name}`}>
                  <Link href={link.href} className="site-paragraph text-black/80 hover:text-black transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="site-subtitle text-sm font-bold uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={`${link.href}-${link.name}`}>
                  <Link href={link.href} className="site-paragraph text-black/80 hover:text-black transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="site-subtitle text-sm font-bold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="site-paragraph text-black/80 hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="site-paragraph text-black/80 hover:text-black transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="site-paragraph text-black/80 hover:text-black transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="site-paragraph text-black/80 hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="site-paragraph text-black/70 text-center sm:text-left">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
