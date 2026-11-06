"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ContactPopup } from "@/components/contact-popup"
import { normalizeHeaderContent } from "@/lib/header-content"
import { useProvidedHeader } from "@/components/header-provider"

interface HeaderData {
  logo?: string
  logoText?: string
  navItems?: Array<{ label: string; href: string }>
  ctaButton?: { text: string; href: string }
  showTopBar?: boolean
  topBarText?: string
}

interface HeaderProps {
  data?: HeaderData | null
}

const DESKTOP_NAV_MQ = "(min-width: 1365px)"

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
  const headerRef = useRef<HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactPopupOpen, setContactPopupOpen] = useState(false)
  const [isDesktopNav, setIsDesktopNav] = useState(false)
  const provided = useProvidedHeader()
  const [headerData, setHeaderData] = useState<HeaderData | null>(propData || provided)

  useEffect(() => {
    if (propData || provided) return
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
  }, [propData, provided])

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ)
    const sync = () => {
      setIsDesktopNav(mq.matches)
      if (mq.matches) setMobileMenuOpen(false)
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Keep page offset in sync when announcement bar / mobile menu change header height.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--site-header-height", `${el.offsetHeight}px`)
    }

    syncHeaderHeight()
    const observer = new ResizeObserver(syncHeaderHeight)
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty("--site-header-height")
    }
  }, [headerData?.showTopBar, headerData?.topBarText, mobileMenuOpen, isDesktopNav])

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
            : "text-black/80"
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
        : "text-black/80 hover:[&_.nav-link-label]:border-b-2 hover:[&_.nav-link-label]:border-primary hover:[&_.nav-link-label]:pb-0.5 hover:[&_.nav-link-label]:text-black"
    }`
  }

  if (!headerData) {
    return null
  }

  const logoText = headerData.logoText ?? ""
  const ctaText = headerData.ctaButton?.text ?? ""
  const ctaHref = headerData.ctaButton?.href?.trim() || "/contact"
  const openCtaAsPopup = !ctaHref || ctaHref === "/contact" || ctaHref === "#contact"

  const handleCtaClick = () => {
    if (openCtaAsPopup) {
      setContactPopupOpen(true)
      return
    }
    if (ctaHref.startsWith("http://") || ctaHref.startsWith("https://") || ctaHref.startsWith("mailto:") || ctaHref.startsWith("tel:")) {
      window.location.href = ctaHref
      return
    }
    window.location.href = ctaHref
  }

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10 text-[#000000]"
      >
        {headerData.showTopBar && headerData.topBarText?.trim() ? (
          <div className="bg-primary text-primary-foreground text-center text-sm px-4 py-2">
            {headerData.topBarText}
          </div>
        ) : null}
        <div className="site-container bg-white">
          <div className="flex items-center justify-between h-16 gap-3">
            <Link href="/" className="site-header-logo flex items-center gap-2 shrink-0 min-w-0">
              {headerData?.logo ? (
                <Image
                  src={headerData.logo}
                  alt={logoText}
                  width={200}
                  height={64}
                  className="site-header-logo-img h-auto w-auto"
                  priority
                />
              ) : (
                <>
                  <span className="site-header-logo-text text-primary font-bold tracking-tight leading-none">SJML</span>
                  <span className="site-header-logo-rule hidden sm:block w-px bg-black/15 shrink-0" aria-hidden="true" />
                  <div className="site-header-logo-tagline hidden sm:flex flex-col leading-tight">
                    <span className="font-semibold text-[#000000] uppercase">Branding &</span>
                    <span className="font-semibold text-[#000000] uppercase">Advertising</span>
                  </div>
                </>
              )}
            </Link>

            {isDesktopNav ? (
              <>
                <nav className="site-header-nav flex items-center min-w-0 text-[#000000]" aria-label="Primary">
                  {navLinks.map((link) => (
                    <Link key={`${link.href}-${link.name}`} href={link.href} className={navLinkClassName(link.href)}>
                      {renderNavLinkContent(link.href, link.name)}
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center shrink-0">
                  {openCtaAsPopup ? (
                    <Button onClick={handleCtaClick} className="site-header-cta uppercase tracking-wide gap-2">
                      {ctaText}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  ) : (
                    <Button asChild className="site-header-cta uppercase tracking-wide gap-2">
                      <Link href={ctaHref}>
                        {ctaText}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="home-menu-toggle inline-flex h-11 w-11 items-center justify-center text-[#000000] transition-opacity hover:opacity-70"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
                </button>
              </div>
            )}
          </div>
        </div>

        {!isDesktopNav && mobileMenuOpen && (
          <div className="bg-white border-t border-black/10">
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
              {openCtaAsPopup ? (
                <Button
                  className="mt-4 site-header-cta"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setContactPopupOpen(true)
                  }}
                >
                  {ctaText}
                </Button>
              ) : (
                <Button asChild className="mt-4 site-header-cta">
                  <Link href={ctaHref} onClick={() => setMobileMenuOpen(false)}>
                    {ctaText}
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      <ContactPopup isOpen={contactPopupOpen} onClose={() => setContactPopupOpen(false)} />
    </>
  )
}
