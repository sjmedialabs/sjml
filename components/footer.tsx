"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

export interface FooterData {
  logo?: string
  companyName?: string
  siteName?: string
  tagline?: string
  siteTagline?: string
  address?: string
  phone?: string
  email?: string
  copyright?: string
  newsletterText?: string
  companyLinks?: Array<{ name: string; href: string }>
  serviceLinks?: Array<{ name: string; href: string }>
  socialLinks?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

interface FooterProps {
  data?: FooterData | null
}

export function Footer({ data: propData }: FooterProps = {}) {
  const [footerData, setFooterData] = useState<FooterData | null>(propData ?? null)

  useEffect(() => {
    if (propData) {
      setFooterData(propData)
      return
    }
    fetch("/api/content/footer")
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => {
        if (data && !data.error) {
          setFooterData({
            address: data.address,
            phone: data.phone,
            email: data.email,
            copyright: data.copyright,
            newsletterText: data.newsletterText,
            siteName: data.siteName,
            siteTagline: data.siteTagline,
            companyName: data.siteName || data.companyName,
            tagline: data.siteTagline || data.tagline,
            companyLinks: data.companyLinks || [],
            serviceLinks: data.serviceLinks || [],
            socialLinks: data.socialLinks || {},
          })
        }
      })
      .catch(() => setFooterData(null))
  }, [propData])

  if (!footerData) {
    return (
      <footer className="bg-background pt-8 pb-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          Configure footer content in admin dashboard.
        </div>
      </footer>
    )
  }

  const companyLinks = footerData.companyLinks || []
  const serviceLinks = footerData.serviceLinks || []
  const socialLinks = footerData.socialLinks || {}
  const companyName = footerData.companyName || footerData.siteName || ""
  const tagline = footerData.tagline || footerData.siteTagline || ""

  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Logo & Contact */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              {footerData.logo ? (
                <Image src={footerData.logo} alt={companyName} width={120} height={40} className="h-10 w-auto" />
              ) : (
                companyName && (
                  <>
                    <div className="w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground font-bold text-lg leading-tight">{companyName}</span>
                      {tagline && <span className="text-muted-foreground text-[9px] tracking-[0.2em]">{tagline}</span>}
                    </div>
                  </>
                )
              )}
            </Link>

            <div className="space-y-3 text-muted-foreground text-sm">
              {footerData.address && (
                <p className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E63946]" />
                  <span className="whitespace-pre-line">{footerData.address}</span>
                </p>
              )}
              {footerData.phone && (
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-[#E63946]" />
                  {footerData.phone}
                </p>
              )}
              {footerData.email && (
                <p className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4 text-[#E63946]" />
                  {footerData.email}
                </p>
              )}
            </div>

            {(socialLinks.facebook || socialLinks.instagram || socialLinks.linkedin || socialLinks.twitter || socialLinks.youtube) && (
              <div className="flex gap-3 mt-6">
                {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-secondary hover:bg-[#E63946] rounded flex items-center justify-center text-foreground text-xs transition-colors">f</a>}
                {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-secondary hover:bg-[#E63946] rounded flex items-center justify-center text-foreground text-xs transition-colors">📷</a>}
                {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-secondary hover:bg-[#E63946] rounded flex items-center justify-center text-foreground text-xs transition-colors">in</a>}
                {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-secondary hover:bg-[#E63946] rounded flex items-center justify-center text-foreground text-xs transition-colors">𝕏</a>}
                {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-secondary hover:bg-[#E63946] rounded flex items-center justify-center text-foreground text-xs transition-colors">▶</a>}
              </div>
            )}
          </div>

          {/* Company Links - from DB */}
          {companyLinks.length > 0 && (
            <div>
              <h3 className="text-[#E63946] font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services Links - from DB */}
          {serviceLinks.length > 0 && (
            <div>
              <h3 className="text-[#E63946] font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {serviceLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {footerData.copyright && <p className="text-muted-foreground text-sm">{footerData.copyright}</p>}
          <div className="flex gap-6 text-muted-foreground text-sm">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
