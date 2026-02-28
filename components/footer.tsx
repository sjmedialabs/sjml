"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

interface FooterData {
  logo?: string
  companyName?: string
  tagline?: string
  address?: string
  phone?: string
  email?: string
  copyright?: string
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

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Our Work", href: "/work" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
]

// Only working service links
const serviceLinks = [
  { name: "Branding", href: "/services/brand-strategy." },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
  { name: "Web Development", href: "/services/web-design-development" },
]

const socialLinks = [
  { name: "Facebook", icon: "f" },
  { name: "Instagram", icon: "📷" },
  { name: "LinkedIn", icon: "in" },
  { name: "Twitter", icon: "𝕏" },
  { name: "YouTube", icon: "▶" },
]

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData>({
    companyName: "SJ MEDIA LABS",
    tagline: "IGNITING BRILLIANCE",
    email: "info@sjmedialabs.com",
    copyright: "© 2025 SJ Media Labs. All Rights Reserved",
    address: "",
    phone: "",
  })

  useEffect(() => {
    // Fetch footer settings from API
    fetch("/api/content/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFooterData({
            logo: data.footerLogo || data.logo,
            companyName: data.siteName || "SJ MEDIA LABS",
            tagline: data.siteTagline || "IGNITING BRILLIANCE",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "info@sjmedialabs.com",
            copyright: data.copyright || "© 2025 SJ Media Labs. All Rights Reserved",
            socialLinks: data.socialMedia || {},
          })
        }
      })
      .catch((err) => console.error("Failed to fetch footer settings:", err))
  }, [])

  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Logo & Contact */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              {footerData.logo ? (
                <Image src={footerData.logo} alt={footerData.companyName || ""} width={120} height={40} className="h-10 w-auto" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground font-bold text-lg leading-tight">{footerData.companyName}</span>
                    <span className="text-muted-foreground text-[9px] tracking-[0.2em]">{footerData.tagline}</span>
                  </div>
                </>
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
              <p className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-[#E63946]" />
                {footerData.email}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 bg-secondary hover:bg-[#E63946] rounded flex items-center justify-center text-foreground text-xs transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
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

          {/* Services Links */}
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
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">{footerData.copyright}</p>
          <div className="flex gap-6 text-muted-foreground text-sm">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
