"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ContactPopup } from "@/components/contact-popup"
import { normalizeHeaderContent } from "@/lib/header-content"

interface HeaderData {
  logo?: string
  logoText?: string
  navItems?: Array<{ label: string; href: string }>
  ctaButton?: { text: string; href: string }
}

interface HeaderProps {
  data?: HeaderData | null
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function Header({ data: propData }: HeaderProps = {}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactPopupOpen, setContactPopupOpen] = useState(false)
  const [headerData, setHeaderData] = useState<HeaderData | null>(propData || null)

  useEffect(() => {
    // Only fetch if data wasn't provided via props
    if (!propData) {
      const fetchHeaderData = async () => {
        try {
          const res = await fetch("/api/content/header")
          if (res.ok) {
            const data = await res.json()
            setHeaderData(normalizeHeaderContent(data))
          }
        } catch (error) {
          console.error("Failed to fetch header data:", error)
        }
      }
      fetchHeaderData()
    }
  }, [propData])

  const isNavLinkActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const navLinks = useMemo(() => {
    const items =
      headerData?.navItems?.map((item) => ({ name: item.label, href: item.href })) ?? []
    if (!items.some((item) => item.href === "/")) {
      return [{ name: "HOME", href: "/" }, ...items]
    }
    return items
  }, [headerData?.navItems])

  const renderNavLinkContent = (href: string, label: string) => {
    const active = isNavLinkActive(href)
    return (
      <span
        className={`nav-link-label inline-flex items-center gap-1 uppercase tracking-[0.08em] transition-colors ${
          active
            ? "border-b-2 border-primary pb-0.5 text-primary"
            : "text-[#000000]/70"
        }`}
      >
        {label}
      </span>
    )
  }

  const navLinkClassName = (href: string) => {
    const active = isNavLinkActive(href)
    return `font-medium transition-colors ${
      active
        ? "text-primary"
        : "text-[#000000]/70 hover:[&_.nav-link-label]:border-b-2 hover:[&_.nav-link-label]:border-primary hover:[&_.nav-link-label]:pb-0.5 hover:[&_.nav-link-label]:text-[#000000]"
    }`
  }

  // Don't render header if no data available
  if (!headerData) {
    return null
  }

  const logoText = headerData.logoText ?? ""
  const ctaText = headerData.ctaButton?.text ?? ""

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10 text-[#000000]">
        <div className="site-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {headerData?.logo ? (
                <Image
                  src={headerData.logo}
                  alt={logoText}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              ) : (
                <>
                  <span className="text-primary font-bold text-xl tracking-tight leading-none">SJML</span>
                  <span className="hidden sm:block w-px h-9 bg-black/15 shrink-0" aria-hidden="true" />
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-[9px] font-semibold tracking-[0.18em] text-[#000000] uppercase">Branding &</span>
                    <span className="text-[9px] font-semibold tracking-[0.18em] text-[#000000] uppercase">Advertising</span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={navLinkClassName(link.href)}>
                  {renderNavLinkContent(link.href, link.name)}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center">
              <Button onClick={() => setContactPopupOpen(true)} className="uppercase tracking-wide gap-2">
                {ctaText}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button className="text-[#000000]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-black/10">
            <nav className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`py-2 ${navLinkClassName(link.href)}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {renderNavLinkContent(link.href, link.name)}
                </Link>
              ))}
              <Button
                className="mt-4"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setContactPopupOpen(true)
                }}
              >
                {ctaText}
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* ContactPopup component */}
      <ContactPopup isOpen={contactPopupOpen} onClose={() => setContactPopupOpen(false)} />
    </>
  )
}
