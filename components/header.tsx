"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ContactPopup } from "@/components/contact-popup"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderData {
  logo?: string
  logoText?: string
  navItems?: Array<{ label: string; href: string }>
  ctaButton?: { text: string; href: string }
}

interface HeaderProps {
  data?: HeaderData | null
}

interface NavService {
  slug: string
  title: string
  displayOrder?: number
}

interface NavSubService {
  parentSlug: string
  slug: string
  name: string
  displayOrder?: number
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
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
  const [expandedMobileNav, setExpandedMobileNav] = useState<string | null>(null)
  const [contactPopupOpen, setContactPopupOpen] = useState(false)
  const [headerData, setHeaderData] = useState<HeaderData | null>(propData || null)
  const [navServices, setNavServices] = useState<NavService[]>([])
  const [navSubServices, setNavSubServices] = useState<NavSubService[]>([])

  useEffect(() => {
    // Only fetch if data wasn't provided via props
    if (!propData) {
      const fetchHeaderData = async () => {
        try {
          const res = await fetch("/api/content/header")
          if (res.ok) {
            const data = await res.json()
            setHeaderData(data)
          }
        } catch (error) {
          console.error("Failed to fetch header data:", error)
        }
      }
      fetchHeaderData()
    }
  }, [propData])

  useEffect(() => {
    const fetchNavServices = async () => {
      try {
        const [servicesRes, subServicesRes] = await Promise.all([
          fetch("/api/services?all=true"),
          fetch("/api/sub-services?nav=true"),
        ])
        if (servicesRes.ok) {
          const services = await servicesRes.json()
          if (Array.isArray(services)) {
            setNavServices(
              services.map((service: NavService & { displayOrder?: number }) => ({
                slug: service.slug,
                title: service.title,
                displayOrder: service.displayOrder,
              })),
            )
          }
        }
        if (subServicesRes.ok) {
          const subs = await subServicesRes.json()
          if (Array.isArray(subs)) setNavSubServices(subs)
        }
      } catch (error) {
        console.error("Failed to fetch navigation services:", error)
      }
    }
    fetchNavServices()
  }, [])

  const subServicesByParent = useMemo(() => {
    const map: Record<string, NavSubService[]> = {}
    navSubServices.forEach((sub) => {
      if (!map[sub.parentSlug]) map[sub.parentSlug] = []
      map[sub.parentSlug].push(sub)
    })
    return map
  }, [navSubServices])

  const sortedNavServices = useMemo(
    () => [...navServices].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [navServices],
  )

  const getServiceSlugFromHref = (href: string) => {
    const match = href.match(/^\/services\/([^/]+)\/?$/)
    return match ? match[1] : null
  }

  const getNavDropdownItems = (href: string) => {
    if (href === "/services") {
      if (sortedNavServices.length === 0) return null

      return sortedNavServices.map((service) => ({
        service,
        subServices: subServicesByParent[service.slug] || [],
      }))
    }

    const parentSlug = getServiceSlugFromHref(href)
    if (!parentSlug) return null

    const subServices = subServicesByParent[parentSlug] || []
    if (subServices.length === 0) return null

    const parentService = sortedNavServices.find((service) => service.slug === parentSlug)
    return [
      {
        service: parentService || { slug: parentSlug, title: parentSlug },
        subServices,
      },
    ]
  }

  const isNavLinkActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const linkClassName = (href: string) =>
    `text-sm transition-colors ${
      isNavLinkActive(href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
    }`

  const renderDesktopDropdownPanel = (href: string) => {
    const groups = getNavDropdownItems(href)
    if (!groups || groups.length === 0) return null

    return (
      <div className="absolute top-full left-0 pt-2 min-w-[240px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        <div className="rounded-lg border border-border bg-background shadow-lg py-2">
          {href === "/services" && (
            <>
              <Link
                href="/services"
                className="block px-4 py-2 text-sm text-foreground hover:bg-muted/50 font-medium"
              >
                All Services
              </Link>
              <div className="my-1 border-t border-border" />
            </>
          )}
          {groups.map(({ service, subServices }) => (
            <div key={service.slug} className="py-1">
              {href === "/services" && (
                <Link
                  href={`/services/${service.slug}`}
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
                >
                  {service.title}
                </Link>
              )}
              {subServices.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/services/${service.slug}/${sub.slug}`}
                  className={`block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 ${
                    href === "/services" ? "pl-6" : ""
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMobileDropdownItems = (href: string, label: string) => {
    const groups = getNavDropdownItems(href)
    if (!groups || groups.length === 0) return null

    const isExpanded = expandedMobileNav === label

    return (
      <div>
        <div className="flex items-center justify-between gap-2">
          <Link
            href={href}
            className={`flex-1 text-sm py-2 ${linkClassName(href)}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {label}
          </Link>
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label={`Expand ${label} menu`}
            onClick={() => setExpandedMobileNav(isExpanded ? null : label)}
          >
            <ChevronDownIcon className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
        {isExpanded && (
          <div className="pl-3 pb-2 space-y-1 border-l border-border ml-1">
            {href === "/services" && (
              <Link
                href="/services"
                className="block text-sm py-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Services
              </Link>
            )}
            {groups.map(({ service, subServices }) => (
              <div key={service.slug} className="space-y-1">
                {href === "/services" && (
                  <Link
                    href={`/services/${service.slug}`}
                    className="block text-sm py-1.5 font-medium text-foreground hover:text-[#E63946]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {service.title}
                  </Link>
                )}
                {subServices.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/services/${service.slug}/${sub.slug}`}
                    className={`block text-sm py-1.5 text-muted-foreground hover:text-foreground ${
                      href === "/services" ? "pl-3" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Don't render header if no data available
  if (!headerData) {
    return null
  }

  const navLinks = headerData.navItems?.map((item) => ({ name: item.label, href: item.href })) || []
  const logoText = headerData.logoText ?? ""
  const ctaText = headerData.ctaButton?.text ?? ""

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="w-8 h-8 bg-[#E63946] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SJ</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground font-bold text-sm leading-tight">{logoText}</span>
                    <span className="text-muted-foreground text-[10px] tracking-wider">DIGITAL AGENCY</span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const dropdown = renderDesktopDropdownPanel(link.href)
                if (dropdown) {
                  return (
                    <div key={link.name} className="relative group">
                      <Link href={link.href} className={`inline-flex items-center gap-1 ${linkClassName(link.href)}`}>
                        {link.name}
                        <ChevronDownIcon className="opacity-70" />
                      </Link>
                      {dropdown}
                    </div>
                  )
                }

                return (
                  <Link key={link.name} href={link.href} className={linkClassName(link.href)}>
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <Button
                className="bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-full px-6"
                onClick={() => setContactPopupOpen(true)}
              >
                {ctaText}
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <button className="text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <nav className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => {
                const mobileDropdown = renderMobileDropdownItems(link.href, link.name)
                if (mobileDropdown) return <div key={link.name}>{mobileDropdown}</div>

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm py-2 ${linkClassName(link.href)}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <Button
                className="bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-full mt-4"
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
